const chai = require('chai');
const supertest = require('supertest');
const nock = require('nock');
const config = require('config');
const defaultErrorPage = require('../../server/errorHandler/defaultErrorPage');
const localStorage = require('../../common/localStorage');
const helpers = require('../../tests/helpers');
const { context } = require('../context/context');

const createApp = require('../app');
const sinon = require('sinon');

describe('ErrorHandler', () => {
    const errorIdRegExp = /(?<errorId>[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12})/;

    let app;
    let server;
    let address;

    before(async () => {
        app = createApp(helpers.getRegistryMock(), helpers.getPluginManagerMock(), context);
        await app.ready();
        app.server.listen(0);

        const { port } = app.server.address();
        address = `127.0.0.1:${port}`;

        server = supertest(app.server);
    });

    afterEach(() => {
        localStorage.clear();
    });

    after(() => {
        app.close();
    });

    it('should show 500 error page with an error id', async () => {
        nock(config.get('registry').address).get('/api/v1/router_domains').reply(200, []);
        nock(config.get('registry').address)
            .get(`/api/v1/template/500/rendered?locale=en-US&domain=${address}`)
            .reply(200, {
                content:
                    '<html>' +
                    '<body>' +
                    '<main>' +
                    '<h1>Hello there!</h1>' +
                    '<div>%ERRORID%</div>' +
                    '</main>' +
                    '</body>' +
                    '</html>',
            });

        const response = await server.get('/_ilc/500').expect(500);

        const { errorId } = response.text.match(errorIdRegExp).groups;

        chai.expect(response.header['cache-control']).to.be.eql('no-cache, no-store, must-revalidate');
        chai.expect(response.header['pragma']).to.be.eql('no-cache');
        chai.expect(response.text).to.be.eql(
            '<html>' +
                '<body>' +
                '<main>' +
                '<h1>Hello there!</h1>' +
                `<div>Error ID: ${errorId}</div>` +
                '</main>' +
                '</body>' +
                '</html>',
        );
    });

    it('should send an error message when showing 500 error page throws an error', async () => {
        nock(config.get('registry').address).get('/api/v1/router_domains').reply(200, []);
        const replyingError = new Error('Something awful happened.');

        nock(config.get('registry').address).get(`/api/v1/template/500/rendered`).replyWithError(replyingError.message);

        const response = await server.get('/_ilc/500').expect(500);

        chai.expect(response.text).to.be.eql(defaultErrorPage);
    });

    describe('when static error page config is specified', () => {
        function mockConfigValue(key, value) {
            const oldGet = config.get.bind(config);
            sinon.stub(config.constructor.prototype, 'get').callsFake(function (name) {
                if (name === key) {
                    return value;
                }

                return oldGet.call(null, name);
            });
        }

        it('should send an error page from static file when showing 500 error page throws an error', async () => {
            mockConfigValue('staticError.disasterFileContentPath', './tests/fixtures/static-error.html');
            nock(config.get('registry').address).get('/api/v1/router_domains').reply(200, []);
            const replyingError = new Error('Something awful happened.');

            nock(config.get('registry').address)
                .get(`/api/v1/template/500/rendered`)
                .replyWithError(replyingError.message);

            const response = await server.get('/_ilc/500').expect(500);

            chai.expect(response.text).to.be.eql('<html><head><title>content from file</title></head></html>\n');
        });
    });
});
