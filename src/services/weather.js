import {CronJob} from 'cron';
import fs from 'fs';
import {getEnv} from './env.js';
import {getFromApi} from './api.js';

const BASE_URL = getEnv('WEATHER_API_BASE_URL');
const API_KEY = getEnv('WEATHER_API_KEY');

/** @type {Object} */
export let weatherData;

/**
 * Check for weather data on the server.
 * If no data is present, fetch from Visual Crossing Weather Api.
 * @returns
 */
export const deploy = async () => {
    // TODO:: Convert console.log to error handler / catcher / logger
    fs.readFile('./data/weatherDays.json', 'utf8', (err, data) => {
        if (err?.code === 'ENOENT') {
            getData(dateQueryString(1, 1, 2021), dateQueryString(2, 6, 2021)).then(data1 => {
                // getData(dateQueryString(1, 1, 2021), dateQueryString(30, 6, 2021)).then(data1 => {
                const days1 = data1.days;
                delete data1.days; // data1 is now only meta data

                getData(dateQueryString(1, 7, 2021), dateQueryString(31, 12, 2021)).then(data2 => {
                    // getData(dateQueryString(1, 7, 2021), dateQueryString(31, 12, 2021)).then(data2 => {
                    data1.queryCost += data2.queryCost;
                    const days = days1.concat(data2.days);

                    fs.writeFile('./data/weatherMeta.json', JSON.stringify(data1), err => {
                        // eslint-disable-next-line no-console
                        if (err) console.error(err);
                        else console.log('success weather meta'); // eslint-disable-line no-console

                        fs.writeFile('./data/weatherDays.json', JSON.stringify(days), err => {
                            // eslint-disable-next-line no-console
                            if (err) console.error(err);
                            else console.log('success weather days'); // eslint-disable-line no-console
                        });
                    });
                });
            });
        } else {
            weatherData = JSON.parse(data);
            console.log('server restart? weather.deploy: file exists already'); // eslint-disable-line no-console
        }
    });

    await new Promise(resolve => {
        setTimeout(() => {
            resolve(undefined);
        }, 2000);
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

/**
 * @param {string} startDate
 * @param {string} endDate
 */
const getData = (startDate, endDate) => {
    let qString = BASE_URL + `/${options.location}/${startDate}/${endDate}`;
    qString += `?unitGroup=metric${options.outputSection}&key=${API_KEY}${options.elements}&contentType=json`;
    return getFromApi(qString);
    // return `${startDate}}, ${endDate}`;
};

/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {String}
 */
const dateQueryString = (day, month, year) =>
    `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
