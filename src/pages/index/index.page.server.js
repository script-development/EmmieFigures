import fs from 'fs';
import {setLog} from 'services/log';

export {onBeforeRender};

/** @param {import('vite-plugin-ssr').PageContextBuiltIn} pageContext */
function onBeforeRender(pageContext) {
    fs.access(logFile, fs.constants.F_OK, err => {
        // if (err)
        // fs.writeFile(logFile, getLogString('created this log file'), err => {
        // eslint-disable-next-line no-console
        // if (err) console.log('An error occured while trying to create the log file', err.code);
        // });
    });
    let weatherData = {};
    const tempData = fs.readFileSync('./data/wether.json', {encoding: 'utf-8'});
    //     if (err) setLog(`An error occured while trying to retrieve weatherData for ${pageContext.url}`, 'danger');
    //     weatherData = JSON.parse(data);
    // });
    console.log(typeof tempData);
    console.log('ASDFASDFASDF');
    weatherData = JSON.parse(tempData);
    const pageProps = {weather: weatherData};
    const newP = {
        pageContext: {
            pageProps,
        },
    };
    return newP;
}

// export const passToClient = ['pageProps'];
