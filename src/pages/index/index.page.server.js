import {getFromApi} from 'services/api';
import {yesterdayQueryString} from 'services/dates';

export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    let reportData;
    let startDate = '2021-01-01';
    let endDate = yesterdayQueryString();

    try {
        reportData = await getFromApi(`http://127.0.0.1:8000/api/reports-presence/${startDate}/${endDate}`);
    } catch (error) {
        console.error(error); // eslint-disable-line no-console
    }
    return {
        pageContext: {
            pageProps: {
                weather: context.weatherData ?? [],
                reports: reportData?.reportsForMonth ?? [],
            },
        },
    };
}

export const passToClient = ['pageProps'];
