import IlcAppSdk from 'ilc-sdk/app';
import * as singleSpa from 'single-spa';

import composeAppSlotPairsToRegister from './composeAppSlotPairsToRegister';
import {makeAppId} from '../common/utils';
import {getSlotElement, prependSpaCallback} from './utils';
import WrapApp from './WrapApp';
import isActiveFactory from './isActiveFactory';
import AsyncBootUp from './AsyncBootUp';

export default function (registryConf, router, appErrorHandlerFactory, bundleLoader) {
    const asyncBootUp = new AsyncBootUp();

    composeAppSlotPairsToRegister(registryConf).forEach(pair => {
        const slotName = pair.slotName;
        const appName = pair.appName;
        const appId = pair.appId;

        const appSdk = new IlcAppSdk(window.ILC.getAppSdkAdapter(appId));
        const onUnmount = async () => appSdk.unmount();
        // We prepend this lifecycle function to have unified behaviour for all apps when
        // we're missing slot for them to be mounted in template
        const onMount = async () => {
            try {
                getSlotElement(slotName);
            } catch (e) {
                throw new Error(`Failed to mount application "${appName}" to slot "${slotName}" due to absence of the slot in template!`);
            }
        };

        singleSpa.registerApplication(
            appId,
            async () => {
                const appConf = registryConf.apps[appName];
                let wrapperConf = null;
                if (appConf.wrappedWith) {
                    wrapperConf = {
                        ...registryConf.apps[appConf.wrappedWith],
                        appId: makeAppId(appConf.wrappedWith, slotName),
                    }
                }

                // Speculative preload of the JS bundle. We don't do it for CSS here as we already did it with preload links
                bundleLoader.preloadApp(appName);

                const overrides = await asyncBootUp.waitForSlot(slotName);
                // App wrapper was rendered at SSR instead of app
                if (wrapperConf !== null && overrides.wrapperPropsOverride === null) {
                    wrapperConf.cssBundle = overrides.cssBundle ? overrides.cssBundle : wrapperConf.cssBundle;
                } else {
                    appConf.cssBundle = overrides.cssBundle ? overrides.cssBundle : appConf.cssBundle;
                }

                const waitTill = [bundleLoader.loadAppWithCss(appName)];
                if (wrapperConf !== null) {
                    waitTill.push(bundleLoader.loadAppWithCss(appConf.wrappedWith));
                }

                return Promise.all(waitTill).then(([spaCallbacks, wrapperSpaCallbacks]) => {
                    if (wrapperConf !== null) {
                        const wrapper = new WrapApp(wrapperConf, overrides.wrapperPropsOverride);

                        spaCallbacks = wrapper.wrapWith(spaCallbacks, wrapperSpaCallbacks);
                    }

                    const cbs = prependSpaCallback(spaCallbacks, 'unmount', onUnmount);

                    return prependSpaCallback(cbs, 'mount', onMount);
                });
            },
            isActiveFactory(router, appName, slotName),
            {
                domElementGetter: () => getSlotElement(slotName),
                getCurrentPathProps: () => router.getCurrentRouteProps(appName, slotName),
                getCurrentBasePath: () => router.getCurrentRoute().basePath,
                appId, // Unique application ID, if same app will be rendered twice on a page - it will get different IDs
                errorHandler: appErrorHandlerFactory(appName, slotName),
                appSdk,
            }
        );
    });
}
