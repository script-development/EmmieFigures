import fs from 'fs/promises';
import qs from 'qs';
import {doRequest, getFromApi} from './api.js';
import {yesterday} from './dates.js';
import {getEnv} from './env.js';
import {setData} from './store.js';

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/';
/** @type {string} */
let apiKey;
/** @type {string} */
let sessionId;

const options = {
    location: 'groningen', // || longitude & latitude
    outputSection: '&include=days', // other options: current, hours, events, alerts (seperate with '%2C')
    elements: '', // options: precip, datetime, description, empty string = all
};

// Error messages
const weatherApiError = 'something went wrong while fetching weatherData from Visual Crossing';

export default {
    createSession: async () => {
        try {
            const response = await doRequest(config);
            apiKey = response.data.apiKey;
            sessionId = response.data.sessionId;
        } catch (error) {
            console.log(error);
        }
    },
    setHistory: async () => {
        const data = [];
        const requestDates = [
            ['2021-01-01', '2021-06-30'],
            ['2021-07-01', '2021-12-31'],
            ['2022-01-01', '2022-06-30'],
            ['2022-07-01', yesterday()],
        ];

        // maximum request for free account is 6 months, multiple requests to get data from 01-01-2021 till yesterday
        requestDates.forEach(async date => {
            data.push(await getWeatherData(date[0], date[1]));
        });
        // const weatherData1 = await getWeatherData();
        // if (!weatherData1) throw new Error(weatherApiError);

        const weatherData2 = await getWeatherData();
        if (!weatherData2) throw new Error(weatherApiError);

        const weatherData3 = await getWeatherData();
        if (!weatherData3) throw new Error(weatherApiError);

        const weatherData4 = await getWeatherData();
        if (!weatherData4) throw new Error(weatherApiError);

        const weatherDays = weatherData1.days
            .concat(weatherData2.days)
            .concat(weatherData3.days)
            .concat(weatherData4.days);
        await fs.writeFile('./data/VC.json', JSON.stringify(weatherDays));

        weatherData1.queryCost += weatherData2.queryCost + weatherData3.queryCost + weatherData4.queryCost;
        const {days, ...weatherMeta} = weatherData1; // eslint-disable-line no-unused-vars

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
    qString += `?unitGroup=metric${options.outputSection}&key=${apiKey}${options.elements}&contentType=json`;
    return qString;
};

var data = qs.stringify({
    requiredStripeProductId: 'prod_ElEHd1q0NaQXG8',
    installId: 'VCWebsite',
    userId: getEnv('VC_USER'),
    userName: getEnv('VC_USER'),
    pwd: getEnv('VC_PASS'),
    nostate: 'true',
});
var config = {
    method: 'post',
    url: `${BASE_URL}createsession`,
    headers: {
        authority: 'weather.visualcrossing.com',
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,nl;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        dnt: '1',
        origin: 'https://www.visualcrossing.com',
        pragma: 'no-cache',
        referer: 'https://www.visualcrossing.com/',
        'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
        'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    },
    data: data,
};
