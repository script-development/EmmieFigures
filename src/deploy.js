/** @typedef {import('types/data.js').ReportData} ReportData */

import {yesterday} from './services/dates.js';
import {fileExists} from './services/filesystem.js';
import VC from './services/visualcrossing.js';
import fs from 'fs/promises';
import {getFromApi} from './services/api.js';
import {getEnv} from './services/env.js';
import {setData} from './services/store.js';

/**
 * Check for weather and report data on the server.
 * If no data is present, get weather data from Visual Crossing Weather API.
 */
export default async () => {
    (await fileExists('./data/VC_Data.json')) ? await appendWeatherData() : await setWeatherData();
    const reportData = await reports();
    setData('reportData', reportData);
};

const setWeatherData = async () => {
    console.log('set weather data'); // eslint-disable-line no-console
    await VC.setHistory();
};

const appendWeatherData = async () => {
    console.log('append weather data'); // eslint-disable-line no-console
    await VC.appendHistory();
};

// TODO:: Remove from store and make available only through api route(s)
const reports = async () => {
    const startDate = '2020-01-01';
    const endDate = yesterday();
    try {
        await fs.access('./data/reports.json'); // catch will fetch data if file is not present
        const reports = await fs.readFile('./data/reports.json', 'utf-8');
        return reports;
    } catch {
        /** @type {{message: string, reportsForMonth: ReportData[]}} */
        const reports = await getFromApi(getEnv('RAPP_LOCAL_REPORTS_URL') + `/${startDate}/${endDate}`);
        await fs.writeFile('./data/reports.json', JSON.stringify(reports.reportsForMonth));
        return reports.reportsForMonth;
    }
};
