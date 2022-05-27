import {getFromApi} from 'services/api';
import {yesterdayQueryString} from 'services/dates';
import {getEnv} from 'services/env';

export {onBeforeRender};

const weatherOptions = [
    {
        key: 'precip',
        name: 'Neerslag',
        unitOfMeasure: 'mm',
    },
    {
        key: 'temp',
        name: 'Temperatuur',
        unitOfMeasure: '°C',
    },
    {
        key: 'windspeed',
        name: 'Windsnelheid',
        unitOfMeasure: 'km/h',
    },
    {
        key: 'cloudcover',
        name: 'Bewolking',
        unitOfMeasure: '%',
    },
    {
        key: 'pressure',
        name: 'Druk',
        unitOfMeasure: 'bar',
    },
];

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    let reportData;
    let startDate = '2021-01-01';
    let endDate = yesterdayQueryString();

    try {
        reportData = await getFromApi(getEnv('RAPP_REPORTS_URL') + `/${startDate}/${endDate}`);
    } catch (error) {
        console.error(error); // eslint-disable-line no-console
    }
    return {
        pageContext: {
            pageProps: {
                weather: context.weatherData ?? [],
                reports: reportData?.reportsForMonth ?? [],
                weatherOptions,
            },
        },
    };
}

export const passToClient = ['pageProps'];
