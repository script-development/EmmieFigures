import {CronJob} from 'cron';
import {getFromCache} from './cache.js';

export const cronWeather = {
    start: () => {
        new CronJob('00 00 00 * * *', function () {
            console.log('tick');
        }).start();
    },
    init: () => {
        // weatherData.js => checkWeatherData
    },
};
