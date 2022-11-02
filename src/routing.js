/** @typedef {import('express').Express} Express */

import {renderPage} from 'vite-plugin-ssr';
import {getData} from './services/store.js';

/** @param {Express} app */
export default app => {
    apiHandler(app);
    ssrHandler(app);
};

/** @param {Express} app */
const apiHandler = app => {
    app.get('/api/weather-data', async (req, res) => {
        res.send(getData('weatherData'));
    });
    app.get('/api/report-data', async (req, res) => {
        res.send(getData('reportData'));
    });
};

/** @param {Express} app */
const ssrHandler = app => {
    app.get('*', async (req, res, next) => {
        const pageContextInit = {urlOriginal: req.originalUrl};
        const pageContext = await renderPage(pageContextInit);
        const {httpResponse} = pageContext;
        if (!httpResponse) return next();
        const {body, statusCode, contentType} = httpResponse;
        res.status(statusCode).type(contentType).send(body);
    });
};
