const newrelic = require('newrelic');
const config = require('config');
const fastify = require('fastify');
const crypto = require('crypto');
const tailorFactory = require('./tailor/factory');
const serveStatic = require('./serveStatic');
const errorHandlingService = require('./errorHandler/factory');
const i18n = require('./i18n');
const GuardManager = require('./GuardManager');
const UrlProcessor = require('../common/UrlProcessor');
const ServerRouter = require('./tailor/server-router');
const mergeConfigs = require('./tailor/merge-configs');
const parseOverrideConfig = require('./tailor/parse-override-config');
const { SlotCollection } = require('../common/Slot/SlotCollection');
const CspBuilderService = require('./services/CspBuilderService');
const Application = require('./application/application');
const reportingPluginManager = require('./plugins/reportingPlugin');
const { accessLogger } = require('./logger/accessLogger');
const { isStaticFile, isHealthCheck } = require('./utils/utils');

/**
 * @param {Registry} registryService
 */
module.exports = (registryService, pluginManager, context) => {
    const guardManager = new GuardManager(pluginManager);
    const buildHashSum = (string) => {
        const hashSum = crypto.createHash('sha1');
        hashSum.update(string, 'utf8');
        const hex = hashSum.digest('hex');
        return hex;
    };

    const reportingPlugin = reportingPluginManager.getInstance();

    const appConfig = Application.getConfig(reportingPlugin);
    const logger = reportingPluginManager.getLogger();

    const app = fastify(appConfig);

    app.addHook('onRequest', (req, reply, done) => {
        context.run({ request: req }, async () => {
            const { url } = req.raw;
            accessLogger.logRequest();

            req.raw.ilcState = {};

            if (isStaticFile(url) || isHealthCheck(url)) {
                return done();
            }

            const registryConfig = (await registryService.getConfig()).data;
            const i18nOnRequest = i18n.onRequestFactory(
                registryConfig.settings.i18n,
                pluginManager.getI18nParamsDetectionPlugin(),
            );

            await i18nOnRequest(req, reply);

            done();
        });
    });

    app.addHook('onResponse', (req, reply, done) => {
        accessLogger.logResponse({
            statusCode: reply.statusCode,
            responseTime: reply.getResponseTime(),
        });
        done();
    });

    const autoInjectNrMonitoringConfig = config.get('newrelic.automaticallyInjectBrowserMonitoring');
    const autoInjectNrMonitoring =
        typeof autoInjectNrMonitoringConfig === 'boolean'
            ? autoInjectNrMonitoringConfig
            : autoInjectNrMonitoringConfig !== 'false';
    const tailor = tailorFactory(
        registryService,
        config.get('cdnUrl'),
        config.get('newrelic.customClientJsWrapper'),
        autoInjectNrMonitoring,
        logger,
    );

    if (config.get('cdnUrl') === null) {
        app.use(config.get('static.internalUrl'), serveStatic(config.get('productionMode')));
    }

    app.register(require('./ping'));

    app.get('/_ilc/api/v1/registry/template/:templateName', async (req, res) => {
        const currentDomain = req.hostname;
        const locale = req.raw.ilcState.locale;
        const data = await registryService.getTemplate(req.params.templateName, { locale, forDomain: currentDomain });
        res.status(200).send(data.data.content);
    });

    // Route to test 500 page appearance
    app.get('/_ilc/500', async () => {
        throw new Error('500 page test error');
    });

    app.all('*', async (req, res) => {
        const currentDomain = req.hostname;
        let registryConfig = (await registryService.getConfig({ filter: { domain: currentDomain } })).data;
        const url = req.raw.url;
        const urlProcessor = new UrlProcessor(registryConfig.settings.trailingSlash);
        const processedUrl = urlProcessor.process(url);
        if (processedUrl !== url) {
            res.redirect(processedUrl);
            return;
        }

        // temporary 20ms overhead
        const hex = buildHashSum(JSON.stringify(registryConfig));

        req.log.info(
            {
                checkSum: hex,
                id: req.id,
                domain: currentDomain,
            },
            '[ILC Cache]: Config checksum',
        );

        req.headers['x-request-host'] = req.hostname;
        req.headers['x-request-uri'] = url;

        const overrideConfigs = parseOverrideConfig(
            req.headers.cookie,
            registryConfig.settings.overrideConfigTrustedOrigins,
        );
        // Excluding LDE related transactions from NewRelic
        if (overrideConfigs !== null) {
            req.raw.ldeRelated = true;
            newrelic.getTransaction().ignore();
        }

        registryConfig = mergeConfigs(registryConfig, overrideConfigs);

        const unlocalizedUrl = i18n.unlocalizeUrl(registryConfig.settings.i18n, url);
        req.raw.registryConfig = registryConfig;
        req.raw.router = new ServerRouter(req.log, req.raw, unlocalizedUrl);

        const redirectTo = await guardManager.redirectTo(req);

        if (redirectTo) {
            res.redirect(
                urlProcessor.process(
                    i18n.localizeUrl(registryConfig.settings.i18n, redirectTo, {
                        locale: req.raw.ilcState.locale,
                    }),
                ),
            );
            return;
        }

        const route = req.raw.router.getRoute();

        const csp = new CspBuilderService(
            registryConfig.settings.cspConfig,
            !!registryConfig.settings.cspEnableStrict,
            !!req.raw.ldeRelated,
            registryConfig.settings.cspTrustedLocalHosts,
        );

        try {
            res.res = csp.setHeader(res.res);
        } catch (error) {
            errorHandlingService.noticeError(error, {
                message: 'CSP object processing error',
            });
        }

        const isRouteWithoutSlots = !Object.keys(route.slots).length;
        if (isRouteWithoutSlots) {
            const locale = req.raw.ilcState.locale;
            let { data } = await registryService.getTemplate(route.template, { locale });

            res.header('Content-Type', 'text/html');
            res.status(200).send(data.content);
            return;
        }

        const slotCollection = new SlotCollection(route.slots, registryConfig);
        slotCollection.isValid();

        res.sent = true; // claim full responsibility of the low-level request and response, see https://www.fastify.io/docs/v2.12.x/Reply/#sent
        tailor.requestHandler(req.raw, res.res);
    });

    app.setErrorHandler(errorHandlingService.handleError);

    return app;
};
