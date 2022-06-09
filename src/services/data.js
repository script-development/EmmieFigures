/**
 * @typedef {import('types/data.js').VisualCrossingData} VisualCrossingData
 * @typedef {import('types/data.js').WeatherData} WeatherData
 * @typedef {import('types/data.js').ReportData} ReportData
 */

import fs from 'fs/promises';
import {setData} from '../serverStore/index.js';
import {getFromApi} from './api.js';
import {dateQueryString, yesterdayQueryString} from './dates.js';
import {getEnv} from './env.js';

const BASE_URL = getEnv('WEATHER_API_BASE_URL');
const API_KEY = getEnv('WEATHER_API_KEY');

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
};

// Error messages
const weatherApiError = 'something went wrong while fetching weatherData from Visual Crossing';

/**
 * Check for weather and report data on the server.
 * If no data is present, fetches from Visual Crossing Weather and Rapp.
 */
export const deploy = async () => {
    const weatherData = await weather();
    setData('weatherData', weatherData);
    /** @type {ReportData[]} */
    const reportData = await reports();
    // console.log(reportData.length);
    // const uniqueDates = [...new Set(reportData.map(report => report.date))];
    // /** @type {any} */
    // const presenceData = getPresence(reportData, uniqueDates);
    setData('reportData', reportData);
};

const weather = async () => {
    try {
        await fs.access('./data/weatherHistory.json'); // catch will fetch data if file is not present
        const weatherData = await fs.readFile('./data/weatherHistory.json', 'utf-8');
        return weatherData;
    } catch {
        // maximum request for free account is 6 months, making 2 requests to get 1 year of data

        const weatherData1 = await getWeatherData([1, 1, 2021], [30, 6, 2021]);
        if (!weatherData1) throw new Error(weatherApiError);

        // 2nd request
        const weatherData2 = await getWeatherData([1, 7, 2021], [31, 12, 2021]);
        if (!weatherData2) throw new Error(weatherApiError);

        const weatherDays = weatherData1.days.concat(weatherData2.days);
        await fs.writeFile('./data/weatherHistory.json', JSON.stringify(weatherDays));

        weatherData1.queryCost += weatherData2.queryCost;
        const {days, ...weatherMeta} = weatherData1; // eslint-disable-line no-unused-vars

        await fs.writeFile('./data/weatherMeta.json', JSON.stringify(weatherMeta));
        return weatherDays;
    }
};

const reports = async () => {
    const startDate = '2021-01-01';
    const endDate = yesterdayQueryString();
    try {
        await fs.access('./data/reports.json'); // catch will fetch data if file is not present
        const reports = await fs.readFile('./data/reports.json', 'utf-8');
        return JSON.parse(reports);
    } catch {
        const reports = await getFromApi(getEnv('RAPP_REPORTS_URL') + `/${startDate}/${endDate}`);
        await fs.writeFile('./data/reports.json', JSON.stringify(reports.reportsForMonth));
        return reports.reportsForMonths;
    }
};

/**
 * @param {Array<number>} start startDate
 * @param {Array<number>} end endDate
 * @returns {Promise<VisualCrossingData>}
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
