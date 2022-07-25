/** @typedef {import('types/data.js').ReportData} ReportData */

import {slug2Date} from '../services/dates.js';
import {getData} from './index.js';

/**
 * Get reports from Rapp based on min and max date
 * @param {string} from min date, format: yyyymmdd
 * @param {string} to max date, format: yyyymmdd
 * @returns
 */
export const getSelectedReports = (from, to) =>
    getData('reportData').reduce((/** @type {ReportData[]} */ acc, /** @type {ReportData} */ report) => {
        if (report.date < slug2Date(from) || report.date > slug2Date(to)) return acc;
        acc.push(report);
        return acc;
    }, []);
