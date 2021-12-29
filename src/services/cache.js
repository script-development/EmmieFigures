/**
 * @typedef {import('node-cache')} NodeCache
 */
const IS_SSR = typeof document === 'undefined';
export const OneHourTTL = 60 * 60 * 1;
export const OneDayTTL = OneHourTTL * 24;

/** @type {NodeCache} */
let cache;

// Hacky way to get top level await
(async () => {
    if (!IS_SSR) return;
    const NodeCache = await import('node-cache');
    cache = new NodeCache.default({checkperiod: 60, useClones: false});
})();

/**
 *
 * @param {string} key
 * @param {any} value
 * @param {number} [ttl]
 * @returns
 */
export const putInCache = (key, value, ttl = OneHourTTL) => {
    if (IS_SSR) {
        cache.set(key, value, ttl);
        return;
    }

    if (typeof value !== 'string') value = JSON.stringify(value);
    localStorage.setItem(key, value);
    localStorage.setItem(`${key}-ttl`, JSON.stringify(new Date().getTime() + ttl * 1000));
};

/**
 *
 * @param {string} key
 * @returns
 */
export const getFromCache = key => {
    if (IS_SSR) return cache.get(key);
    return getFromLocalStorage(key);
};

/**
 *
 * @param {string} key
 * @returns
 */
const getFromLocalStorage = key => {
    const ttl = localStorage.getItem(`${key}-ttl`);
    if (!ttl) return undefined;

    const milliSecondsSinceEpoch = Math.round(Date.now());
    const expires = Math.round(new Date(JSON.parse(ttl)).getTime()) - milliSecondsSinceEpoch;

    if (expires <= 0) return undefined;

    const value = localStorage.getItem(key);

    if (!value) return undefined;

    try {
        return JSON.parse(value);
    } catch (_) {
        return value;
    }
};
