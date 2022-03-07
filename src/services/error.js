/**
 * @typedef {import('types').ErrorBag} ErrorBag
 */
import axios from 'axios';
import {reactive} from 'vue';
import {getEnv} from './env.js';

/** @type {ErrorBag} */
export const errors = reactive({default: ''});

/**
 * @param {string} error
 * @param {string} [key] optional key, default = 'default'
 * @returns
 */
export const setError = (error, key = 'default') => (errors[key] = error);

/**
 * @param {import('axios').AxiosError} errorResponse
 */
export const setResponseError = errorResponse => {
    if (!errorResponse.response) return;
    /* eslint-disable no-console */
    console.log(errorResponse.response.config?.url);
    console.log(errorResponse.response.data);
    /* eslint-enable no-console */
    if (Array.isArray(errorResponse.response.data.data)) {
        setError(errorResponse.response.data.data[0]);
    } else {
        setError(errorResponse.response.data.data);
    }
};
/** @param {Error} error */
export const throwErrorToSlack = error => {
    axios.post(getEnv('VITE_SLACK_WEBHOOK_URL'), {text: error.stack});
};
