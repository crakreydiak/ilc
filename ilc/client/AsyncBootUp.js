import { Logger } from './utils';

const System = window.System;

export default class AsyncBootUp {
    #logger;
    #performance;
    #performanceStart;
    #afterRoutingEvent = false;
    #appsWaitingForSlot = {};
    #readySlots = [];

    constructor(logger = Logger, performance = window.performance) {
        this.#logger = logger;
        this.#performance = performance;
        this.#performanceStart = this.#performance.now();

        for (let id of window.ilcApps) {
            this.#markSlotAsReady(id);
        }

        window.ilcApps = {push: id => this.#markSlotAsReady(id)};
        window.addEventListener('single-spa:routing-event', () => (this.#afterRoutingEvent = true));
    }

    async waitForSlot(slotName) {
        const res = {
            spaBundle: null,
            cssBundle: null,
            wrapperPropsOverride: null,
        };

        if (this.#afterRoutingEvent) {
            return res;
        }

        await new Promise(resolve => {
            if (this.#readySlots.includes(slotName)) {
                return resolve();
            }

            this.#appsWaitingForSlot[slotName] = resolve;
        });

        if (!this.#afterRoutingEvent) {
            const milliseconds = this.#performance.now() - this.#performanceStart;
            this.#logger.log(`ILC: Registering app @${slotName} after ${milliseconds} milliseconds.`);
        }

        const slotEl = document.getElementById(slotName);

        if (slotEl === null) {
            throw new Error(`Can not find '${slotName}' on the page!`);
        }

        const overridesEl = slotEl.querySelector('script[type="spa-config-override"]');
        if (overridesEl) {
            const conf = JSON.parse(overridesEl.innerHTML);

            if (conf.spaBundle) {
                System.overrideImportMap(conf.appName, conf.spaBundle);
                res.spaBundle = conf.spaBundle;
            }
            if (conf.cssBundle) {
                res.cssBundle = conf.cssBundle;
            }
            if (conf.wrapperPropsOverride) {
                res.wrapperPropsOverride = conf.wrapperPropsOverride;
            }

          if (conf.dependencies) {
              Object.keys(conf?.dependencies).forEach((depKey) => System.overrideImportMap(depKey, conf.dependencies[depKey]));
          }

          overridesEl.parentNode.removeChild(overridesEl);
        }

        return res;
    }

    #markSlotAsReady = (id) => {
        setTimeout(() => {
            this.#readySlots.push(id);
            this.#appsWaitingForSlot[id] && this.#appsWaitingForSlot[id]();
        }, 0);
    }
};
