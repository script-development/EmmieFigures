import {CronJob} from 'cron';
import fs from 'fs';
import {getEnv} from './env.js';
import {getFromApi} from './api.js';

export default {
    /**
     * Check for weather data on the server.
     * If no data is present, fetch from Visual Crossing Weather Api.
     */
    deploy: () => {
        // TODO:: Error handling
        fs.readFile(`./database/weather.json`, 'utf8', (err, data) => {
            if (err?.code === 'ENOENT') {
                getWeatherData()
                    .then(weatherData => {
                        fs.writeFile(`database/weather.json`, JSON.stringify(weatherData), err => {
                            if (err) {
                                console.log(`Error writing file: ${err}`);
                            } else {
                                console.log(`Weather data is written successfully.`);
                            }
                        });
                    })
                    .catch(err => {
                        console.log('Error quering weather data');
                        console.error(err);
                    });
            } else {
                console.log(JSON.parse(data));
            }
        });
    },
    /**
     * Start a new Cron Job that auto fetches new weather- presence data at midnight.
     */
    cronJob: () => {
        new CronJob('*/10 52 * * * *', function () {
            console.log('tick');
        }).start();
    },
};

const getWeatherData = () => {
    const BASE_URL = getEnv('WEATHER_API_BASE_URL');
    const API_KEY = getEnv('WEATHER_API_KEY');
    let location = 'groningen'; // || longitude & latitude
    let outputSection = '&include=days'; // other options: current, hours, events, alerts (seperate with '%2C')
    // let elements = '&elements=precip'; // other options: datetime,description
    const elements = '';
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
        day = new Date(year, month + 1, day).getDate(); // + 1 on month when day is 0 to get last day from previous month
    }
    const endDate = dateQueryString(day, month + 1, year);

    // start date = today minus a day minus historyLength in months (max 6 months / query on history visual crossing weather with free account)
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
