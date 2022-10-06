/**
 * @typedef {import('axios').Method} Method
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
import axios from 'axios';
import {setResponseError} from './error.js';

/**
 *
 * @param {AxiosRequestConfig} config
 * @param {boolean} retry if the request is a retry
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const doRequest = async (config, retry = false) => {
    try {
        return await axios.request(config);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (retry) {
                    return await doRequest(config);
                }
                setResponseError(error);
            }
        }
        throw error;
    }
};

/**
 * @param {Method} method the http method
 * @param {string} url the url to request
 * @param {Object<string,any>} [data] the http data to send
 *
 * @returns {AxiosRequestConfig}
 */
const createRequestConfig = (method, url, data) => {
    /** @type {{[key: string]: string}} */
    const headers = {};
    /** @type {{[key: string]: string}} */
    const params = {};

    url = createParams(url, params);

    return {
        url,
        method,
        headers,
        params,
        data,
    };
};

/**
 * create params object from request-parameters url
 * @param {string} url the url to request
 * @param {{[key: string]: string}} params object to place parameters in
 */
const createParams = (url, params) => {
    if (url.split('?').length > 1) {
        url.split('?')[1]
            .split('&')
            .forEach(param => {
                const prop = param.split('=');
                params[prop[0]] = prop[1];
            });
        url = url.split('?')[0];
    }
    return url;
};

/**
 * @param {Method} method the http method
 * @param {string} url the url to get from the api
 * @param {Object<string,any>} [data] the http data to send
 */
const apiCall = async (method, url, data) => {
    const requestConfig = createRequestConfig(method, url, data);

    const response = await doRequest(requestConfig);

    return response.data;
};

/**
 * @param {string} url the url to get from the api
 */
export const getFromApi = url => apiCall('GET', url);

/**
 * @param {string} url
 * @param {object} [data]
 */
export const postToApi = (url, data) => apiCall('POST', url, data);

/**
 * @param {string} url
 * @param {object} data
 */
export const putToApi = (url, data) => apiCall('PUT', url, data);

/**
 * @param {string} url
 */
export const deleteFromApi = url => apiCall('DELETE', url);
