import {fileExists} from './services/filesystem.js';
import VC from './services/visualcrossing.js';

/**
 * Check for weather and report data on the server.
 * If no data is present, get weather data from Visual Crossing Weather API.
 */
export default async () => {
    (await fileExists('./data/VC_Data.json')) ? await appendWeatherData() : await setWeatherData();
};

const setWeatherData = async () => {
    console.log('set'); // eslint-disable-line no-console
    await VC.setHistory();
};

const appendWeatherData = async () => {
    console.log('append'); // eslint-disable-line no-console
    await VC.appendHistory();
};
