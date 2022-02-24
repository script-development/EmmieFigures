import {getFromApi} from './api.js';

/** @returns {Promise<{reportsForMonths: []}>} */
export const getReportData = async () => {
    return await new Promise(resolve => {
        const data = getFromApi('http://localhost:8000/api/reports-presence/2021-11-12/2021-12-31');
        resolve(data);
    });
};
