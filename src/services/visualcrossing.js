import fs from 'fs/promises';
import {getFromApi} from './api.js';
import {yesterday} from './dates.js';
import {getEnv} from './env.js';
import {getFile} from './filesystem.js';
import {setData} from './store.js';

const BASE_URL = getEnv('VC_BASE_URL');
const API_KEY = getEnv('VC_API_KEY'); //

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
    startDate: '2021-01-01',
};

export default {
    appendHistory: async () => {
        const history = await getFile('./data/VC_Data.json');
        const lastDate = getLastDate(history);
        const yester = yesterday();
        if (lastDate < yester) {
            console.log(`fetching append data from ${lastDate} to ${yester}`);
            const weatherData = await getWeatherData(lastDate, yester);
            if (!weatherData)
                throw new Error(`error retrieving Visual Crossing Weather Data: ${lastDate} to ${yester}`);
            await writeWeatherData([weatherData], history);
        }
        // TODO:: Remove from store and make available only through api route(s)
        setData('weatherData', history);
    },
    setHistory: async () => {
        /** @type {import('types/data.js').VisualCrossingData[]} */
        const data = [];
        const requestDates = [
            ['2021-01-01', '2021-06-30'],
            ['2021-07-01', '2021-12-31'],
            ['2022-01-01', '2022-06-30'],
            ['2022-07-01', yesterday()],
        ];

        // maximum request for free account is 6 months or 1000 queryCost
        // Multiple requests to get data from 01-01-2021 till yesterday [or up to queryCost limit]
        for (const date of requestDates) {
            const weatherData = await getWeatherData(date[0], date[1]);
            if (!weatherData)
                throw new Error(`error retrieving Visual Crossing Weather Data: ${date[0]} to ${date[1]}`);
            data.push(weatherData);
        }
        await writeWeatherData(data);
    },
};

/**
 * get latest date from history data on server
 * @param {import('types/data.js').WeatherData[]} history
 */
export const getLastDate = history =>
    history.reduce((prev, curr) => (curr.datetime > prev ? (prev = curr.datetime) : prev), options.startDate);

/**
 * get first date from history data on server
 * @param {import('types/data.js').WeatherData[]} history
 */
export const getFirstDate = history =>
    history.reduce((prev, curr) => (curr.datetime < prev ? (prev = curr.datetime) : prev), yesterday());

/**
 * get latest date from history data on server
 * @param {import('types/data.js').ReportData[]} history
 */
export const getLastDateR = history =>
    history.reduce((prev, curr) => (curr.date > prev ? (prev = curr.date) : prev), options.startDate);

/**
 * get first date from history data on server
 * @param {import('types/data.js').ReportData[]} history
 */
export const getFirstDateR = history =>
    history.reduce((prev, curr) => (curr.date < prev ? (prev = curr.date) : prev), yesterday());

/**
 * @param {import('types/data.js').VisualCrossingData[]} newData
 * @param {import('types/data.js').WeatherData[]} existingData
 */
const writeWeatherData = async (newData, existingData = []) => {
    let queryCost = 0;

    console.log(`existing data length: ${existingData.length}`);
    newData.forEach(weatherData => {
        existingData = existingData.concat(weatherData.days);
        queryCost += weatherData.queryCost;
    });
    console.log(`new data length: ${existingData.length}, queryCost: ${queryCost}`);
    console.log(`lastDate: ${getLastDate(existingData)}`);
    await fs.writeFile('./data/VC_Data.json', JSON.stringify(existingData));

    const {days, ...meta} = newData[0]; // eslint-disable-line no-unused-vars
    meta.queryCost = queryCost;

    await fs.writeFile('./data/VC_Meta.json', JSON.stringify(meta));
};

/**
 * @param {string} startDate startDate
 * @param {string} endDate endDate
 * @returns {Promise<import('types/data.js').VisualCrossingData>}
 */
const getWeatherData = (startDate, endDate) => getFromApi(getQueryString(startDate, endDate));

/**
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string}
 */
const getQueryString = (startDate, endDate) => {
    let qString = `${BASE_URL}/timeline/${options.location}/${startDate}/${endDate}`;
    qString += `?unitGroup=metric${options.outputSection}&key=${API_KEY}${options.elements}&contentType=json`;
    return qString;
};
