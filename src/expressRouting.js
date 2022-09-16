/** @typedef {import('express').Express} Express */

import {renderPage} from 'vite-plugin-ssr';

/** @type {Express} */
let app;

/** @param {Express} expressApp */
export default expressApp => {
    app = expressApp;
    apiHandler();
    ssrHandler();
};

const apiHandler = () => {
    //
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
