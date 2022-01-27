import {CronJob} from 'cron';
import fs from 'fs';
import {getEnv} from './env.js';
import {getFromApi} from './api.js';

export default {
    /**
     * Check for weather data on the server.
     * If no data is present, fetch from Visual Crossing Weather Api.
     * @returns
     */
    deploy: () => {
        fs.readFile('./data/weather.json', 'utf8', err => {
            if (err?.code === 'ENOENT') {
                getData(6)
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
    },
    /**
     * Start a new Cron Job that auto fetches new weather- presence data at midnight.
     * New data will be appended to existing weather data.
     */
    cronStart: () => {
        new CronJob('*/10 52 * * * *', function () {
            console.log('tick'); // eslint-disable-line no-console
        }).start();
    },
};

/** @param {number} historyLength number of months to get data for */
const getData = historyLength => {
    const BASE_URL = getEnv('WEATHER_API_BASE_URL');
    const API_KEY = getEnv('WEATHER_API_KEY');
    let location = 'groningen'; // || longitude & latitude
    let outputSection = '&include=days'; // other options: current, hours, events, alerts (seperate with '%2C')
    const elements = ''; // options: precip, datetime, description
    const date = new Date();
    let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];

    // end date = today minus a day
    day -= 1;
    if (day < 1) {
        if (month < 1) {
            month = 11;
            year--;
        }
        day = new Date(year, month + 1, day).getDate(); // + 1 on month when day is 0 = last day from previous month
    }
    const endDate = dateQueryString(day, month + 1, year);

    // start date = today minus a day minus historyLength in months
    // data will be fetched in segments (max history query is 6 months for free visual crossing weather acount)
    if (historyLength > 12) throw 'max historylength is 12 months';
    // if (historyLength > 6)
    month -= historyLength;
    if (month < 0) {
        year--;
        month += 12;
    }
    const maxDay = new Date(year, month + 1, 0).getDate();
    if (day > maxDay) day = maxDay;
    const startDate = dateQueryString(day, month + 1, year);

    let qString = BASE_URL + `/${location}/${startDate}/${endDate}`;
    qString += `?unitGroup=metric${outputSection}&key=${API_KEY}${elements}&contentType=json`;

    // Weather data will be fetched in segments (max history query is 6 months)

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
