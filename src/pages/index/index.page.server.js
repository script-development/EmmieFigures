import {promises as fs} from 'fs';

export {onBeforeRender};

async function onBeforeRender() {
    const fetchedData = await fs.readFile('./data/weather.json', {encoding: 'utf-8'});
    const weatherData = JSON.parse(fetchedData);
    const pageProps = {weather: weatherData};
    return {
        pageContext: {
            pageProps,
        },
    };
}

export const passToClient = ['pageProps'];
