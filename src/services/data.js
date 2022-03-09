import fs from 'fs/promises';
import {getFromApi} from './api.js';
import {getEnv} from './env.js';

const BASE_URL = getEnv('WEATHER_API_BASE_URL');
const API_KEY = getEnv('WEATHER_API_KEY');

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
};

/** @type {Array<import('types/index.js').WeatherData>} */
export let weatherData;

/**
 * Check for weather data on the server.
 * If no data is present, fetches from Visual Crossing Weather API.
 */
export const deploy = async () => {
    try {
        await fs.access('./data/weatherHistory.json'); // catch will fetch data if file is not present
        const wDat = await fs.readFile('./data/weatherHistory.json', 'utf-8');
        weatherData = JSON.parse(wDat);
    } catch {
        // maximum request for free account is 6 months, making 2 requests to get 1 year of data
        const wDat1 = await getWeatherData([1, 1, 2021], [30, 6, 2021]);
        const days1 = wDat1.days;
        delete wDat1.days; // wDat1 is now only meta data
        // 2nd request
        const wDat2 = await getWeatherData([1, 7, 2021], [31, 12, 2021]);
        wDat1.queryCost += wDat2.queryCost;
        const days = days1?.concat(wDat2.days ?? []);

        await fs.writeFile('./data/weatherHistory.json', JSON.stringify(days));
        await fs.writeFile('./data/weatherMeta.json', JSON.stringify(wDat1));
        weatherData = days ?? [];
    }
};

/**
 * @param {Array<number>} start
 * @param {Array<number>} end
 * @returns {Promise<{days?: import('types/index.js').WeatherData[], queryCost: number}>}
 */
const getWeatherData = (start, end) => {
    const startDate = dateQueryString(start[0], start[1], start[2]);
    const endDate = dateQueryString(end[0], end[1], end[2]);
    const queryString = getQueryString(startDate, endDate);
    return getFromApi(queryString);
};

/**
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string}
 */
const getQueryString = (startDate, endDate) => {
    let qString = BASE_URL + `/${options.location}/${startDate}/${endDate}`;
    qString += `?unitGroup=metric${options.outputSection}&key=${API_KEY}${options.elements}&contentType=json`;
    return qString;
};

/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {String}
 */
const dateQueryString = (day, month, year) =>
    `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
