// import {promises as fs} from 'fs';
// import {weatherData} from 'services/weather';

export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    // console.log(context);
    // if (!weatherData) {
    //     console.log(weatherData);
    //     throw new Error('no data!');
    // }
    // const data = await fs.readFile('./data/weather.json', {encoding: 'utf-8'});
    // const parsed = JSON.parse(data);

    // let weatherData = parsed;
    // const weatherData = JSON.parse(fetchedData);
    const pageProps = {weather: context.weatherData};
    return {
        pageContext: {
            pageProps,
        },
    };
}

export const passToClient = ['pageProps'];
