import {getEnv} from 'services/env';
import {getFromApi} from 'services/api';
// import {removeFromCache, getFromCache, putInCache} from 'services/cache';

/** @param {import('vite-plugin-ssr').PageContextBuiltIn} pageContext */
export async function onBeforeRender(pageContext) {
        // await getFromApi(qString)
        //     .then(dat => {
        //         putInCache('weatherData', dat);
        //         putInCache('weatherCheck', {date: `${year}-${month + 1}-${day}`, historyLength});
        //     })
        //     .catch(err => {
        //         console.log('error', err);
        //     });
        // data = qString;
        // // set day, month and year in weatherCheck, if date changes, new data will be fetched
        // putInCache('weatherCheck', {day, month, year});
    }
    // const tempData = {weatherCheck: getFromCache('weatherCheck'), weatherData: getFromCache('weatherData'), fail: 'no'};
    // tempData.weatherData.days.forEach(day => {
    //     data.push(day.precip);
    // });

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
    const pageProps = {weatherData: data};
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
