import {slug2Date} from '../services/dates.js';

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

/**
 *
 * @param {string} weatherType
 * @param {string} from
 * @param {string} to
 * @returns
 */
export const getSelectedWeatherData = (weatherType, from, to) => {
    const data = getData('weatherData').reduce(
        (
            /** @type {{date: string, value: number}[]} */ acc,
            /** @type {import('types/data.js').WeatherData} */ weather,
        ) => {
            if (weather.datetime < slug2Date(from) || weather.datetime > slug2Date(to)) return acc;
            acc.push({date: weather.datetime, value: weather[weatherType]});
            return acc;
        },
        [],
    );
    return data;
};

export const getReportData = () => {
    //
};
