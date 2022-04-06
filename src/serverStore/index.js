/** @type {any} */
const store = {};

/**
 *
 * @param {string} key
 * @param {Array<{}>|string} data
 */
export const setData = (key, data) => {
    if (typeof data === 'object') store[key] = data;
    else if (isJsonString(data)) store[key] = JSON.parse(data);
    else throw new Error('Data must be JSON string or object');
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

/** @param {string} key */
export const getData = key => {
    if (typeof key === 'string') return store[key];
    else throw new Error('key must be a string');
};

export const weatherOptions = [
    {
        key: 'precip',
        name: 'Neerslag',
        unitOfMeasure: 'mm',
    },
    {
        key: 'temp',
        name: 'Temperatuur',
        unitOfMeasure: '°C',
    },
    {
        key: 'windspeed',
        name: 'Windsnelheid',
        unitOfMeasure: 'km/h',
    },
    {
        key: 'cloudcover',
        name: 'Bewolking',
        unitOfMeasure: '%',
    },
    {
        key: 'pressure',
        name: 'Druk',
        unitOfMeasure: 'bar',
    },
];
