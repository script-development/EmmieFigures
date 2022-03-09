import {CronJob} from 'cron';

/**
 * Start a new Cron Job that auto fetches new weather- presence data at midnight.
 * New data will be appended to existing weather data.
 */
export const cronStart = () => {
    new CronJob('*/10 52 * * * *', function () {
        console.log('tick'); // eslint-disable-line no-console
    }).start();
};
