import {CronJob} from 'cron';
import fs from 'fs';
import {getEnv} from './env.js';
import {getFromApi} from './api.js';
import {setLog} from './log.js';

export default {
    /**
     * Check for weather data on the server.
     * If no data is present, fetch from Visual Crossing Weather Api.
     * @returns
     */
    deploy: () => {
        fs.readFile('./data/weather.json', 'utf8', err => {
            if (err?.code === 'ENOENT') {
                setLog('First time fetching data from Visual Crossing Weather API');
                getData()
                    .then(data => {
                        setLog('Weather data fetched succesfully', 'success');
                        fs.writeFile('./data/weather.json', JSON.stringify(data), err => {
                            if (err)
                                setLog(
                                    `Error writing weather data to file => code: ${err.code}, errno: ${err.errno}`,
                                    'danger',
                                );
                            else setLog('Weather data is written successfully', 'success');
                        });
                    })
                    .catch(err => {
                        setLog(
                            `Weather data fetch failed => ${err.reponse.status}: ${err.response.statusText}`,
                            'danger',
                        );
                    });
            }
            setLog('server restart? weather.deploy => file exists already', 'warning');
        });
    },
    /**
     * Start a new Cron Job that auto fetches new weather- presence data at midnight.
     * New data will be appended to existing weather data.
     */
    cronStart: () => {
        new CronJob('*/10 52 * * * *', function () {
            console.log('tick');
        }).start();
    },
};

const getData = () => {
    const BASE_URL = getEnv('WEATHER_API_BASE_URL');
    const API_KEY = getEnv('WEATHER_API_KEY');
    let location = 'groningen'; // || longitude & latitude
    let outputSection = '&include=days'; // other options: current, hours, events, alerts (seperate with '%2C')
    const elements = ''; // options: precip, datetime, description
    // const date = new Date('1 Januari 2000');
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
    const historyLength = 1;
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
