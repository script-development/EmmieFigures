import {getFromApi} from 'services/api';
import {getEnv} from 'services/env';

export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    let reportData;
    getEnv;
    try {
        reportData = await getFromApi(getEnv('RAPP_REPORTS_URL'));
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
