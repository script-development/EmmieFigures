import fs from 'fs';

const logFile = './logs/entries.log';

// run on import:
(() => {
    fs.access(logFile, fs.constants.F_OK, err => {
        if (err)
            fs.writeFile(logFile, getLogString('created this log file'), err => {
                // eslint-disable-next-line no-console
                if (err) console.log('An error occured while trying to create the log file', err.code);
            });
    });
})();

const getLogString = (description = 'empty', type = 'info', timestamp = true) =>
    `${timestamp} | ${description} | ${type}\n`;

/**
 * Set a new log-entry, this will append to the existing log
 * @param {string} description
 * @param {string} type => info, success, warning, danger (default = info)
 * @param {boolean} timestamp set a timestamp to the log-entry
 * @returns
 */
export const setLog = (description, type = 'info', timestamp = true) => {
    const entry = getLogString(description, type, timestamp);
    fs.appendFile(logFile, entry, err => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log('An error occured while trying to add an entry to the log file', err.code);
        }
    });
};

export default {
    deploy: () => {
        //
    },
};

// anomaly, oddity, deviation, alert, message, notification, fault, misstep, failure
// glitch, result, issue, condition, diagnostic, exception
// Success, Danger, Warning, Info,
