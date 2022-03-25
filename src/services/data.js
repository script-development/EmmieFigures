import fs from 'fs/promises';
import {getFromApi} from './api.js';
import {dateQueryString} from './dates.js';
import {getEnv} from './env.js';

const BASE_URL = getEnv('WEATHER_API_BASE_URL');
const API_KEY = getEnv('WEATHER_API_KEY');

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
};

/** @type {Array<import('types/data.js').WeatherData>} */
export let weatherData;

/** @type {Array<import('types/data.js').ReportData>} */
export let reportData;

/** Temporarily placement of the weatherOptions (this should be a database thing) */
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

/**
 * Check for weather data on the server.
 * If no data is present, fetches from Visual Crossing Weather API.
 */
export const deploy = async () => {
    await weather();
    await reports();
};

const weather = async () => {
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

export const reports = async () => {
    // let startDate = '2021-01-01';
    // let endDate = yesterdayQueryString();
    try {
        await fs.access('./data/reports.json'); // catch will fetch data if file is not present
        const rDat = await fs.readFile('./data/reports.json', 'utf-8');
        console.log('fetch reports success'); // eslint-disable-line
        return JSON.parse(rDat);
    } catch {
        console.error('fetch reports failed'); // eslint-disable-line
        // TODO::this is for server start, try block is for server render
        // const rDat = await getFromApi(getEnv('RAPP_REPORTS_URL') + `/${startDate}/${endDate}`);
        // await fs.writeFile('./data/reports.json', JSON.stringify(rDat));
        // reportData = rDat ?? [];
    }
};

/**
 * @param {Array<number>} start
 * @param {Array<number>} end
 * @returns {Promise<{days?: import('types/data.js').WeatherData[], queryCost: number}>}
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
