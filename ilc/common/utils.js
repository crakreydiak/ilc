const deepmerge = require('deepmerge');

function appIdToNameAndSlot(appId) {
    const [appNameWithoutPrefix, slotName] = appId.split('__at__');

    // Case for shared libraries
    if (appNameWithoutPrefix === undefined || slotName === undefined) {
        return {
            appName: appId,
            slotName: 'none',
        };
    }

    return {
        appName: `@portal/${appNameWithoutPrefix}`,
        slotName,
    };
}

function makeAppId(appName, slotName) {
    return `${appName.replace('@portal/', '')}__at__${slotName}`;
}

function cloneDeep(source) {
    return deepmerge({}, source);
}

const uniqueArray = array => [...new Set(array)];

function removeEndSlashUrl(url) {
    return url.replace(/\/$|\/(?=\?)/, "");
}

function removeDoubleParams(query) {
    var querySanitized = query;
    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
            querySanitized[key] = value[0]
        }
    }
    return querySanitized
}

function removeBackOffersParams(query) {
    delete query?.bo;
    return query;
}

function generateRouteProps(currentRoute) {
    if (!currentRoute) {
        return
    }

    if (!currentRoute.route || !currentRoute.meta || !currentRoute.meta.isSpecialPattern) {
        if (!currentRoute.meta) {
            return
        }

        if (currentRoute.meta.siteConfig) {
            return { siteConfig: currentRoute.meta.siteConfig }
        }

        return
    }

    // avoid changing MFEs behaviour default routing
    const tempCurrentRoute = { ...currentRoute };

    if (currentRoute.route.includes('/*') || currentRoute.route.includes('//*')) {
        currentRoute.route = currentRoute.route.replace('//', '/');
        currentRoute.route = currentRoute.route.replace('/*', '/(.*)')
        currentRoute.basePath = currentRoute.reqUrl && currentRoute.reqUrl.split(/[?#]/)[0]
    }

    if (!currentRoute.meta.dynamicProps) {
        currentRoute = tempCurrentRoute;
        if (currentRoute.meta.siteConfig) {
            return { isSpecialRoute: true, siteConfig: currentRoute.meta.siteConfig }
        }
        return { isSpecialRoute: true }
    }

    const urlAllPaths = currentRoute.basePath.split('/').filter(Boolean);
    const urlStaticPaths = currentRoute.route.split('/(.*)').reduce((acc, path) => {
        const paths = path.split('/').filter(Boolean)
        return [...acc, ...paths]
    }, []);

    const urlDynamicPaths = urlAllPaths.filter(item => !urlStaticPaths.includes(item));
    const urlDynamicProps = currentRoute.meta.dynamicProps.reduce((acc, dynamicPart, index) => {
        return {
            ...acc,
            [dynamicPart]: urlDynamicPaths[index],
        };
    }, {});

    currentRoute = tempCurrentRoute;
    if (currentRoute.meta.siteConfig) {
        return { isSpecialRoute: true, urlDynamicProps, siteConfig: currentRoute.meta.siteConfig }
    }

    return { isSpecialRoute: true, urlDynamicProps}
}

module.exports = {
    appIdToNameAndSlot,
    makeAppId,
    cloneDeep,
    uniqueArray,
    removeEndSlashUrl,
    removeDoubleParams,
    generateRouteProps,
    removeBackOffersParams,
}
