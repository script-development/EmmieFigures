import {CronJob} from 'cron';
import fs from 'fs';
import {getEnv} from './env.js';
import {getFromApi} from './api.js';

const BASE_URL = getEnv('WEATHER_API_BASE_URL');
const API_KEY = getEnv('WEATHER_API_KEY');

/**
 * Check for weather data on the server.
 * If no data is present, fetch from Visual Crossing Weather Api.
 * @returns
 */
export const deploy = () => {
    fs.readFile('./data/weather.json', 'utf8', err => {
        if (err?.code === 'ENOENT') {
            getData()
                .then(data => {
                    fs.writeFile('./data/weather.json', JSON.stringify(data), err => {
                        console.log(err); // eslint-disable-line no-console
                    });
                })
                .catch(err => {
                    console.log(err); // eslint-disable-line no-console
                });
        } else console.log('server restart? weather.deploy: file exists already'); // eslint-disable-line no-console
    });
};

/**
 * Start a new Cron Job that auto fetches new weather- presence data at midnight.
 * New data will be appended to existing weather data.
 */
export const cronStart = () => {
    new CronJob('*/10 52 * * * *', function () {
        console.log('tick'); // eslint-disable-line no-console
    }).start();
};

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
};

const getData = () => {
    const startDate = dateQueryString(1, 7, 2021);
    const endDate = dateQueryString(31, 12, 2021);
    let qString = BASE_URL + `/${options.location}/${startDate}/${endDate}`;
    qString += `?unitGroup=metric${options.outputSection}&key=${API_KEY}${options.elements}&contentType=json`;
    return getFromApi(qString);
};

/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {String}
 */
const dateQueryString = (day, month, year) =>
    `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
