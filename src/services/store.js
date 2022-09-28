/** @type {any} */
const store = {};

/**
 *
 * @param {string} key
 * @param {Array<any>|object|string|number} data
 */
export const setData = (key, data) => {
    if (typeof data === 'object' || typeof data === 'number') store[key] = data;
    else if (isJsonString(data)) store[key] = JSON.parse(data);
    else throw new Error('Wrong data type');
};

/** @param {string} key */
export const getData = key => {
    if (typeof key === 'string') return store[key];
    else throw new Error('key must be a string');
};

/** @param {string} subject */
const isJsonString = subject => {
    try {
        JSON.parse(subject);
        return true;
    } catch {
        return false;
    }
};
