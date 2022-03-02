import {getFromApi} from 'services/api';

export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    let reportData;
    try {
        reportData = await getFromApi('http://127.0.0.1:8000/api/reports-presence/2021-12-01/2021-12-31');
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
