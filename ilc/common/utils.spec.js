const { removeEndSlashUrl, removeDoubleParams, generateRouteProps, removeBackOffersParams } = require("./utils");

describe('utils', () => {
    describe('removeEndSlashUrl', () => {
        const url = 'url'

        test('given url without end slash, should return same', () => {
            expect(removeEndSlashUrl(url)).toBe(url)
        });

        test('given url end slash, should return without end slash', () => {
            expect(removeEndSlashUrl('url/')).toBe(url)
        });

        test('given url end slash with params, should return without end slash but keep params', () => {
            expect(removeEndSlashUrl('url/?test=true&param=true')).toBe('url?test=true&param=true')
        });
    });


    describe('removeDoubleParams', () => {
        const doubleParams = {
            offer_id: 'offer_id',
            aff_id: 'aff_id',
            source: 'source',
            utm_source: ['utm_source', 'utm_source'],
            utm_medium: ['email', 'email'],
            utm_campaign: 'utm_campaign',
            utm_term: ['utm_term', 'utm_term'],
            utm_id: ['utm_id', 'utm_id'],
            sfmc_id: ['sfmc_id', 'sfmc_id'],
            utm_content: 'utm_content',
            sfmc_activityid: 'sfmc_activityid'
        };

        const params = {
            offer_id: 'offer_id',
            aff_id: 'aff_id',
            source: 'source',
            utm_source: 'utm_source',
            utm_medium: 'email',
            utm_campaign: 'utm_campaign',
            utm_term: 'utm_term',
            utm_id: 'utm_id',
            sfmc_id: 'sfmc_id',
            utm_content: 'utm_content',
            sfmc_activityid: 'sfmc_activityid'
        };

        test('given correct params from campaign, should return it', () => {
            expect(removeDoubleParams({ foo: 'bar' })).toStrictEqual({ foo: 'bar' })
        });

        test('given params doubled from campaigns, should sanitize it', () => {
            expect(removeDoubleParams(doubleParams)).toStrictEqual(params)
        });

        test('given backOffer param, should remove it', () => {
            params.bo = "1234"

            removeBackOffersParams(params);

            expect(params.bo).not.toBeDefined()
        });

        test('given no backOffer param, should remove nothing', () => {
            removeBackOffersParams(params);

            expect(params).toStrictEqual(params)
        });
    });

    describe('generateRouteProps', () => {
        const isSpecial = { isSpecialRoute: true }

        const specialRoute = {
            basePath: '/static-first-part/dynamic/static-second-part',
            reqUrl: '/static-first-part/dynamic/static-second-part',
            routeId: 10,
            route: '/static-first-part/(.*)/static-second-part',
            template: 'template',
            specialRole: null,
            meta: { isSpecialPattern: true, dynamicProps: ['dynamicProp'] },
            slots: {
                slot: { appName: 'appName', props: {}, kind: null }
            }
        }

        const siteConfig = {
            configs: {
                visitorIdGeneration: 'true',
                dotcmsGateway: 'dotcmsGateway',
                brand: '',
                referrerId: '0',
                overrideUrl: 'overrideUrl',
                offerId: '0',
                urlId: '0',
                gtmId: 'gtmId',
                gtmScriptVersion: '0',
                dataLayer: '{"event": "event", "optimizeContainerId": "optimizeContainerId", "UA_ID": "UA_ID", "GA4_ID": "GA4_ID"}',
            },
            hostname: 'hostname',
        };

        const expectedProps = {
            ...isSpecial,
            urlDynamicProps: { dynamicProp: "dynamic" },
        }

        const dynamicProps = specialRoute.meta.dynamicProps
        const routeDynamicMiddleAndEnd = "/static-first-part/(.*)/static-second-part/(.*)"

        test('given no route, should return nothing', () => {
            expect(generateRouteProps()).not.toBeDefined()
        });

        test('given a route that is not special, should return nothing', () => {
            expect(generateRouteProps({ route: '', meta: {} })).not.toBeDefined()
        });

        test('given a route that is dynamic in the end but dont have dynamicProps, should return isSpecial', () => {
            expect(generateRouteProps({ route: '/news//*', meta: { isSpecialPattern: true } })).toStrictEqual(isSpecial)
        });

        test('given a route that is dynamic in the middle but dont have dynamicProps, should return isSpecial', () => {
            delete specialRoute.meta.dynamicProps

            expect(generateRouteProps(specialRoute)).toStrictEqual(isSpecial)
            specialRoute.meta.dynamicProps = dynamicProps
        });

        test('given a route that is dynamic in the middle and also in the end but dont have dynamicProps, should return isSpecial', () => {
            specialRoute.route = routeDynamicMiddleAndEnd
            delete specialRoute.meta.dynamicProps

            expect(generateRouteProps(specialRoute)).toStrictEqual(isSpecial)
            specialRoute.meta.dynamicProps = dynamicProps
        });


        test('given a route that is dynamic in the end and have dynamicProps, should return routeProps correctly', () => {
            specialRoute.route = '/static//*'
            specialRoute.basePath = '/static/dynamic'
            specialRoute.reqUrl = '/static/dynamic?test=true'

            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });

        test('given a route that is dynamic in the middle, should return routeProps correctly', () => {
            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });

        test('given a route that is dynamic in the middle and start with 2 subpath, should return routeProps correctly', () => {
            specialRoute.route = '/partone/parttwo/(.*)/partthree'
            specialRoute.basePath = '/partone/parttwo/dynamic/partthree'
            specialRoute.reqUrl = '/partone/parttwo/dynamic/partthree?test=true'
            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });

        test('given a route that is dynamic in the middle and end with 2 subpath, should return routeProps correctly', () => {
            specialRoute.route = '/partone/(.*)/parttwo/partthree'
            specialRoute.basePath = '/partone/dynamic/parttwo/partthree'
            specialRoute.reqUrl = '/partone/dynamic/parttwo/partthree?test=true'
            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });

        test('given a route that is dynamic and have multiples before and after subpath, should return routeProps correctly', () => {
            specialRoute.route = '/partone/parttwo/partthree/(.*)/partfour/partfive/partsix'
            specialRoute.basePath = '/partone/parttwo/partthree/dynamic/partfour/partfive/partsix'
            specialRoute.reqUrl = '/partone/parttwo/partthree/dynamic/partfour/partfive/partsix?test=true'
            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });

        test('given a route that is special and more complicated, should return routeProps correctly', () => {
            specialRoute.route = routeDynamicMiddleAndEnd
            specialRoute.basePath = '/static-first-part/dynamic-part-one/static-second-part/dynamic-part-two'
            specialRoute.reqUrl = '/static-first-part/dynamic-part-one/static-second-part/dynamic-part-two'
            specialRoute.meta.dynamicProps = ['dynamicProp', 'dynamicProp2']
            expectedProps.urlDynamicProps = { dynamicProp: "dynamic-part-one", dynamicProp2: "dynamic-part-two" }

            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });

        test('given a route that is not special, but have siteConfig, should return siteConfig', () => {
            expect(generateRouteProps({ route: '', meta: { siteConfig } })).toStrictEqual({siteConfig})
        });

        test('given a route that is dynamic in the end, but have siteConfig, should return isSpecial and siteConfig', () => {
            expect(generateRouteProps({ route: '/news//*', meta: { isSpecialPattern: true, siteConfig } })).toStrictEqual({ ...isSpecial, siteConfig })
        });

        test('given a route that is special and more complicated, but have siteConfig, should return routeProps correctly', () => {
            specialRoute.route = routeDynamicMiddleAndEnd
            specialRoute.basePath = '/static-first-part/dynamic-part-one/static-second-part/dynamic-part-two'
            specialRoute.reqUrl = '/static-first-part/dynamic-part-one/static-second-part/dynamic-part-two'
            specialRoute.meta.dynamicProps = ['dynamicProp', 'dynamicProp2']
            specialRoute.meta.siteConfig = siteConfig
            
            expectedProps.urlDynamicProps = { dynamicProp: "dynamic-part-one", dynamicProp2: "dynamic-part-two" }
            expectedProps.siteConfig = siteConfig

            expect(generateRouteProps(specialRoute)).toStrictEqual(expectedProps)
        });
    });
});
