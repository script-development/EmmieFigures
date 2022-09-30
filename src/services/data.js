/**
 * @typedef {import('types/data.js').VisualCrossingData} VisualCrossingData
 * @typedef {import('types/data.js').WeatherData} WeatherData
 * @typedef {import('types/data.js').ReportData} ReportData
 */

import fs from 'fs/promises';
import {setData} from './store.js';
import {getFromApi} from './api.js';
import {yesterday} from './dates.js';
import {getEnv} from './env.js';

/**
 * Check for weather and report data on the server.
 * If no data is present, fetches from Visual Crossing Weather and Rapp.
 */
export const deploy = async () => {
    const weatherData = await weather();
    setData('weatherData', weatherData);
    const reportData = await reports();
    setData('reportData', reportData);
};

const weather = async () => {
    try {
        await fs.access('./data/weatherHistory.json'); // catch will fetch data if file is not present
        const weatherData = await fs.readFile('./data/weatherHistory.json', 'utf-8');
        return weatherData;
    } catch {
        // maximum request for free account is 6 months, making 2 requests to get 1 year of data

        const weatherData1 = await getWeatherData('2021-01-01', '2021-06-30');
        if (!weatherData1) throw new Error(weatherApiError);

        // 2nd request
        const weatherData2 = await getWeatherData('2021-07-01', '2021-31-12');
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
    const endDate = yesterday();
    try {
        await fs.access('./data/reports.json'); // catch will fetch data if file is not present
        const reports = await fs.readFile('./data/reports.json', 'utf-8');
        return reports;
    } catch {
        /** @type {{message: string, reportsForMonth: ReportData[]}} */
        const reports = await getFromApi(getEnv('RAPP_REPORTS_URL') + `/${startDate}/${endDate}`);
        await fs.writeFile('./data/reports.json', JSON.stringify(reports.reportsForMonth));
        return reports.reportsForMonth;
    }
};
