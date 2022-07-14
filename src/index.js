/* eslint-env node */

import {createPageRenderer} from 'vite-plugin-ssr';
import express from 'express';
import vite from 'vite';
import path from 'path';
import {deploy} from './services/data.js';
import {getData, getSelectedWeatherData} from './serverStore/index.js';

await deploy();

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(path.dirname(''));

(async function startServer() {
    const app = express();
    let viteDevServer;

    if (isProduction) {
        app.use(express.static(`${root}/dist/client`));
    } else {
        viteDevServer = await vite.createServer({
            root,
            server: {middlewareMode: true},
        });
        app.use(viteDevServer.middlewares);
    }

    const renderPage = createPageRenderer({viteDevServer, isProduction, root});

    app.get('/api/weather-data', async (req, res) => {
        res.send(getData('weatherData'));
    });
    app.get('/api/report-data', async (req, res) => {
        // TODO: Sort date > ascending
        res.send(getData('reportData'));
    });
    app.get('/api/weather/:type/:from-:to', async (req, res) => {
        const reqP = getSelectedWeatherData(req.params.type, req.params.from, req.params.to);
        res.send(reqP);
    });

    app.get('*', async (req, res, next) => {
        const url = req.originalUrl;
        const pageContextInit = {url};
        const pageContext = await renderPage(pageContextInit);
        const {httpResponse} = pageContext;
        if (!httpResponse) return next();
        const {body, statusCode, contentType} = httpResponse;
        res.status(statusCode).type(contentType).send(body);
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`)); // eslint-disable-line no-console
})();
