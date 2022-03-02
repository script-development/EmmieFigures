import NodeCache from 'node-cache';

const cache = new NodeCache({checkperiod: 60, useClones: false});

export const OneHourTTL = 60 * 60 * 1;
export const OneDayTTL = OneHourTTL * 24;

/**
 *
 * @param {string} key
 * @param {any} value
 * @param {number} [ttl] define a ttl (in seconds), default = no expiration
 * @returns {boolean} true on success
 */
export const putInCache = (key, value, ttl = 0) => cache.set(key, value, ttl);

/**
 *
 * @param {string} key
 * @returns the value stored in the key
 */
export const getFromCache = key => cache.get(key);

/**
 *
 * @param {string} key
 * @returns {Number} number of deleted keys (delete will never fail)
 */
export const removeFromCache = key => cache.del(key);

/** @returns {NodeCache.Stats} */
export const flushAllData = () => {
    cache.flushAll();
    return cache.getStats();
};
