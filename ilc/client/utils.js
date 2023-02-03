export function getSlotElement(slotName) {
    const slot = document.getElementById(slotName);
    if (slot === null) {
        throw new Error(`Can't find slot element on the page`);
    }
    const appContainer = slot.querySelector('.app-container');

    return appContainer || slot;
}

export function prependSpaCallback(spaCallbacks, type, callback) {
    const res = {
        bootstrap: spaCallbacks.bootstrap,
        mount: spaCallbacks.mount,
        unmount: spaCallbacks.unmount,
        unload: spaCallbacks.unload,
    };

    let orig = spaCallbacks[type];
    if (Array.isArray(orig)) {
        res[type] = [callback].concat(orig);
    } else {
        res[type] = [callback, orig];
    }

    return res;
}

export function flattenFnArray(appOrParcel, lifecycle) {
    let fns = appOrParcel[lifecycle] || [];
    fns = Array.isArray(fns) ? fns : [fns];
    if (fns.length === 0) {
        fns = [() => Promise.resolve()];
    }

    return function (props) {
        return fns.reduce((resultPromise, fn, index) => {
            return resultPromise.then(() => {
                const thisPromise = fn(props);
                return smellsLikeAPromise(thisPromise)
                    ? thisPromise
                    : Promise.reject(`The lifecycle function ${lifecycle} at array index ${index} did not return a promise`);
            });
        }, Promise.resolve());
    };
}

export function smellsLikeAPromise(promise) {
    return (
        promise &&
        typeof promise.then === "function" &&
        typeof promise.catch === "function"
    );
}

export class Logger {
    static environment = process.env.NODE_ENV;
    static defaultStyles = 'font-size: 18px; ';
    static errorStyles = 'background-color: #F44336; color: #fff;';

    static _print(message, isError) {
        if (Logger.environment === 'production') return;

        if (typeof message === 'object' && message !== null) {
            console.dir(message, { depth: null });
        } else {
            console.log(`%c${message}`, `${Logger.defaultStyles}${isError && Logger.errorStyles}`);
        }
    }

    static log(message) {
        Logger._print(message, false);
    }

    static error(message) {
        Logger._print(message, true);
    }
}
