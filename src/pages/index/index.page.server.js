import {getFromApi} from 'services/api';

export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    // get reports from Rapp
    const reportData = await getFromApi('http://localhost:8000/api/reports-presence/2021-12-01/2021-12-31');
    return {
        pageContext: {
            pageProps: {
                weather: context.weatherData,
                reports: reportData.reportsForMonth ?? [],
            },
        },
    };
}

export const passToClient = ['pageProps'];
