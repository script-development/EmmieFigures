import fs from 'fs';

export {onBeforeRender};

function onBeforeRender() {
    let weatherData = {};
    const fetchedData = fs.readFileSync('./data/weather.json', {encoding: 'utf-8'});
    weatherData = JSON.parse(fetchedData);
    const pageProps = {weather: weatherData};
    return {
        pageContext: {
            pageProps,
        },
    };
}

export const passToClient = ['pageProps'];
