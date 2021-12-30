import {getEnv} from 'services/env';
import {getFromApi} from 'services/api';
import {removeFromCache, getFromCache, putInCache} from 'services/cache';

/** @param {import('vite-plugin-ssr').PageContextBuiltIn} pageContext */
export async function onBeforeRender(pageContext) {
    // TODO:: make a 1st time retrieval of data at deployment
    // TODO:: error handling

    // get current month and day
    const date = new Date();
    // const date = new Date('April 1, 1981 23:15:30');

    let [month, day, year] = [
        parseInt(('0' + date.getMonth()).slice(-2)),
        ('0' + date.getDate()).slice(-2),
        date.getFullYear(),
    ];

    let data;
    // removeFromCache('weatherCheck');
    // check if weather data is available from cache
    if (!getFromCache('weatherCheck')) {
        const BASE_URL = getEnv('VISUAL_CROSSING_API_BASE_URL');
        const API_KEY = getEnv('VISUAL_CROSSING_WEATHER_KEY');

        // get weather data from last half year up to today
        let y = year - (month - 6 < 0 ? 1 : 0);
        // data = y;
        let m = ('0' + (month + (month - 6 < 0 ? 7 : -5))).slice(-2);
        let d = ('0' + day).slice(-2);
        let qString = BASE_URL + `${y}-${m}-${d}/${year}-${month + 1}-${day}`;
        qString += `?unitGroup=metric&include=days&key=${API_KEY}&elements=datetime,description,precip&contentType=json`;
        data = qString;
    }
    // const weatherData = await getFromApi(
    //     BASE_URL +
    //         '2021-07-01/2021-12-30,
    // );
    // // set day, month and year in weatherCheck, if date changes, new data will be fetched
    // putInCache('weatherCheck', {day, month, year});
    // }

    // data = {month, day, year, type: typeof year};
    // putInCache('weatherUpToDate', {month, day});
    // const TempData = getFromCache('weatherUpToDate');
    // const Data = TempData.month;

    // let Data = deleteFromCache('weatherUpToDate');

    // if (getFromCache('weatherUpToDate')) {
    //     Data = 'Up to Date';
    // } else {
    //     Data = 'NOT up to date';
    // }
    const pageProps = {test: data};
    return {
        pageContext: {
            pageProps,
        },
    };
}

// By default `pageContext.*` are available only on the server. But our hydrate function
// we defined earlier runs in the browser and needs `pageContext.pageProps`; we use
// `passToClient` to tell `vite-plugin-ssr` to serialize and make `pageContext.pageProps`
// available to the browser.
export const passToClient = ['pageProps'];
