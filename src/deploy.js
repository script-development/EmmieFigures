// import fs from 'fs/promises';

import {fileExists} from './services/filesystem.js';
import VC from './services/visualcrossing.js';

/**
 * Check for weather and report data on the server.
 * If no data is present, get weather data from Visual Crossing Weather API.
 */
export default async () => {
    (await fileExists('./data/VC.json')) ? await appendWeatherData() : await setWeatherData();
};

const setWeatherData = async () => {
    console.log('set');
    await VC.createSession();
    await VC.setHistory();

    // setData('VCWqueryCost', 0);
    // let queryCost = 0;

    // max historical weather data for free account is 6 months
    // const weatherData = await getWeatherData('2021-01-01', '2021-01-03');
    // await fs.writeFile('./data/test.json', JSON.stringify(weatherData));
    // console.log(weatherData);
    // setCost();
};

const appendWeatherData = async () => {
    console.log('append');
    // setCost();
};

// var data = {
//     current: 'true',
//     history: 'true',
//     info: 'true',
//     sessionId:
//         'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJWaXN1YWwgQ3Jvc3NpbmcgQ29ycG9yYXRpb24iLCJleHAiOjE2NjM5Mjk5NzMsImlhdCI6MTY2Mzg0MzU3MywiaXAiOiIyMTMuMTI2LjUxLjIxNCIsInVpZCI6ImRlZW5sQGdteC5jb20iLCJpaWQiOiJWQ1dlYnNpdGUifQ.nnxJPQaKivq_UuNhSLqL2uBH9kd8Tg_-2qPN8UdoIWPMHdoCi3G3xPVhtCh2yxb9ri2mVjSdYzXYMgBUVpYgQw',
// };
// const config = {
//     method: 'post',
//     url: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/usagesummary',
//     headers: {
//         authority: 'weather.visualcrossing.com',
//         accept: '*/*',
//         'accept-language': 'en-US,en;q=0.9,nl;q=0.8',
//         'cache-control': 'no-cache',
//         'content-type': 'application/x-www-form-urlencoded',
//         dnt: '1',
//         origin: 'https://www.visualcrossing.com',
//         pragma: 'no-cache',
//         referer: 'https://www.visualcrossing.com/',
//         'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Windows"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'same-site',
//         'sec-gpc': '1',
//         'user-agent':
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
//     },
//     params: data,
// };

// const setCost = async () => {
//     // const dat = await postToApi(
//     //     'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/usagesummary',
//     //     config,
//     // );
//     // setData('qC', dat);
//     // console.log(dat);
//     axios(config)
//         .then(function (response) {
//             // console.log(response.data.currentPeriodUsage);
//             setData('qC', {
//                 data: response.data,
//                 status: response.status,
//                 statusText: response.statusText,
//                 headers: response.headers,
//                 config: response.config,
//             });
//         })
//         .catch(function (error) {
//             console.log('error');
//         });
//     // console.log(dat);
// };

// const weather = async () => {
//     try {
//         await fs.access('./data/weatherHistory.json'); // catch will fetch data if file is not present
//         const weatherData = await fs.readFile('./data/weatherHistory.json', 'utf-8');
//         return weatherData;
//     } catch {
//         // maximum request for free account is 6 months, making 2 requests to get 1 year of data

//         const weatherData1 = await getWeatherData('2021-01-01', '2021-06-30');
//         if (!weatherData1) throw new Error(weatherApiError);

//         // 2nd request
//         const weatherData2 = await getWeatherData('2021-07-01', '2021-31-12');
//         if (!weatherData2) throw new Error(weatherApiError);

//         const weatherDays = weatherData1.days.concat(weatherData2.days);
//         await fs.writeFile('./data/weatherHistory.json', JSON.stringify(weatherDays));

//         weatherData1.queryCost += weatherData2.queryCost;
//         const {days, ...weatherMeta} = weatherData1; // eslint-disable-line no-unused-vars

//         await fs.writeFile('./data/weatherMeta.json', JSON.stringify(weatherMeta));
//         return weatherDays;
//     }
// };

// /**
//  * @param {string} startDate startDate
//  * @param {string} endDate endDate
//  * @returns {Promise<VisualCrossingData>}
//  */
// const getWeatherData = (startDate, endDate) => getFromApi(getQueryString(startDate, endDate));

// /**
//  * @param {string} startDate
//  * @param {string} endDate
//  * @returns {string}
//  */

// const getQueryString = (startDate, endDate) => {
//     let qString = BASE_URL + `/${options.location}/${startDate}/${endDate}`;
//     qString += `?unitGroup=metric${options.outputSection}&key=${API_KEY}${options.elements}&contentType=json`;
//     return qString;
// };
