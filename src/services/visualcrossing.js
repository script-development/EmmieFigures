import fs from 'fs/promises';
import {getFromApi} from './api.js';
import {yesterday} from './dates.js';
import {getEnv} from './env.js';
import {setData} from './store.js';

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/';

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
    startDate: '2021-01-01',
};

export default {
    appendHistory: async () => {
        // get latest date from history data on server
        /** @type {import('types/data.js').WeatherData[]} */
        const history = JSON.parse(await fs.readFile('./data/VC.json', 'utf-8'));
        const lastDate = history.reduce(
            (prev, curr) => (curr.datetime > prev ? (prev = curr.datetime) : prev),
            options.startDate,
        );
        console.log(lastDate);
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
        // Multiple requests to get data from 01-01-2021 till yesterday or up to queryCost limit
        for (const date of requestDates) {
            const weatherData = await getWeatherData(date[0], date[1]);
            if (!weatherData)
                throw new Error(`error retrieving Visual Crossing Weather Data: ${date[0]} to ${date[1]}`);
            data.push(weatherData);
        }

        /** @type {import('types/data.js').WeatherData[]} */
        let weatherDays = [];
        let queryCost = 0;

        data.forEach(weatherData => {
            weatherDays = weatherDays.concat(weatherData.days);
            queryCost += weatherData.queryCost;
        });

        await fs.writeFile('./data/VC.json', JSON.stringify(weatherDays));

        const {days, ...weatherMeta} = data[0]; // eslint-disable-line no-unused-vars
        weatherMeta.queryCost = queryCost;

        await fs.writeFile('./data/weatherMeta.json', JSON.stringify(weatherMeta));
        setData('weatherData', weatherDays);
    },
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
    let qString = `${BASE_URL}timeline/${options.location}/${startDate}/${endDate}`;
    qString += `?unitGroup=metric${options.outputSection}&key=${getEnv('VC_API_KEY')}${
        options.elements
    }&contentType=json`;
    return qString;
};
