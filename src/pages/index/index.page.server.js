import fs from 'fs';

export {onBeforeRender};

/** @param {import('vite-plugin-ssr').PageContextBuiltIn} pageContext */
function onBeforeRender(pageContext) {
    const url = pageContext.url;
    let weatherData = {};
    const fetchedData = fs.readFileSync('./data/weather.json', {encoding: 'utf-8'});
    weatherData = JSON.parse(fetchedData);
    const pageProps = {weather: weatherData, url};
    return {
        pageContext: {
            pageProps,
        },
    };
}

export const passToClient = ['pageProps'];
