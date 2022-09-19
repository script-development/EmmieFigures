/** @typedef {import('express').Express} Express */

import {renderPage} from 'vite-plugin-ssr';
import {getData} from './serverStore/index.js';

/** @type {Express} */
let app;

/** @param {Express} expressApp */
export default expressApp => {
    app = expressApp;
    apiHandler();
    ssrHandler();
};

const apiHandler = () => {
    app.get('/api/weather-data', async (req, res) => {
        res.send(getData('weatherData'));
    });
    app.get('/api/report-data', async (req, res) => {
        res.send(getData('reportData'));
    });
};

const ssrHandler = () => {
    app.get('*', async (req, res, next) => {
        const pageContextInit = {urlOriginal: req.originalUrl};
        const pageContext = await renderPage(pageContextInit);
        const {httpResponse} = pageContext;
        if (!httpResponse) return next();
        const {body, statusCode, contentType} = httpResponse;
        res.status(statusCode).type(contentType).send(body);
    });
};
