/**
 * @typedef {import('axios').Method} Method
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
import axios from 'axios';
//  import {getAccessToken, refreshToken} from './accessToken.js';
// import {getFromCache, OneDayTTL, putInCache} from './cache.js';
// import {getEnv} from './env.js';
// import {setResponseError} from './error.js';

// const BASE_URL = getEnv('VITE_QUBE_IN_API');

/**
 *
 * @param {string} method the url method
 * @param {string} [url] the actual url
 * @param {object} [data] the optional data
 * @returns
 */
// const createCacheKey = (method, url, data) => {
//     const cacheKey = method + url;

//     if (!data) return cacheKey;
//     return cacheKey + JSON.stringify(data);
// };

const retryMessages = ['this token has expired', 'no valid session or connection found'];

/**
 *
 * @param {AxiosRequestConfig} config
 * @param {boolean} retry if the request is a retry
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const doRequest = async (config, retry = false) => {
    try {
        return await axios.request(config);
    } catch (e) {
        /** @type {import('axios').AxiosError} */
        // @ts-ignore can't define e in the catch
        const error = e;
        if (error.response) {
            const {message} = error.response.data;

            if (retry && retryMessages.includes(message)) {
                // config.headers['x-api-key'] = await refreshToken();
                return await doRequest(config, false);
            }

            // setResponseError(error);
        }
        throw error;
    }
};

/**
 * @param {Method} method the http method
 * @param {string} uri the uri to request
 * @param {string} [token] the optional token
 * @param {Object<string,any>} [data] the http body
 *
 * @returns {Promise<AxiosRequestConfig>}
 */
const createRequestConfig = async (method, uri, token, data) => {
    // const url = new URL(`${BASE_URL}/${uri}`);
    // url.searchParams.set('jobboard_id', '1');

    /** @type {{[key: string]: string}} */
    const headers = {
        // 'x-api-key': token ?? (await getAccessToken()),
        // 'x-response-type': 'json',
    };

    return {
        // url: url.href,
        url: uri,
        method,
        headers,
        data,
    };
};

/**
 * @param {Method} method the http method
 * @param {string} uri the uri to get from the api
 * @param {string} [token] the optional duration to store the request in cache in seconds
 * @param {number} [cacheDuration] the optional duration to store the request in cache in seconds
 * @param {Object<string,any>} [data] the http data to send
 */
// eslint-disable-next-line complexity
const apiCall = async (method, uri, token, cacheDuration, data) => {
    const requestConfig = await createRequestConfig(method, uri, token, data);
    // const cacheKey = createCacheKey(method, requestConfig.url, data);

    // if (cacheDuration) {
    //     const storedResult = getFromCache(cacheKey);
    //     if (storedResult) return storedResult;
    // }

    const response = await doRequest(requestConfig);

    const responseData = response.data;

    const actualData = responseData.meta || !responseData.data ? responseData : responseData.data;
    // if (cacheDuration) putInCache(cacheKey, actualData, cacheDuration);

    return actualData;
};

/**
 * @param {string} uri the uri to get from the api
 * @param {string} [token] the optional token
 * @param {number} [cacheDuration] the optional duration to store the request in cache in seconds
 */
export const getFromApi = (uri, token, cacheDuration) => apiCall('GET', uri, token, cacheDuration);

/**
 * @param {string} uri
 * @param {object} [data]
 * @param {string} [token] the optional token
 * @param {number} [cacheDuration]
 */
export const postToApi = (uri, data, token, cacheDuration) => apiCall('POST', uri, token, cacheDuration, data);

/**
 * @param {string} uri
 * @param {object} data
 * @param {string} [token] the optional token
 */
export const putToApi = (uri, data, token) => apiCall('PUT', uri, token, undefined, data);

/**
 *
 * @param {string} uri
 */
export const deleteFromApi = uri => apiCall('DELETE', uri, undefined, 0);

/**
 * @param {string} textId
 * @param {string} [token] the optional token
 */
// export const getSettingByTextId = (textId, token) =>
//     getFromApi(`settings/by-textid?textid=${textId}`, token, OneDayTTL);
