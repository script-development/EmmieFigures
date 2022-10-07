/* eslint-env node */

import {renderPage} from 'vite-plugin-ssr';
import express from 'express';
import path from 'path';
import deploy from './deploy.js';
import {getData} from './services/store.js';
import {getLastDate} from './services/visualcrossing.js';
import {getFile} from 'services/filesystem.js';

// VisualCrossingWeather data fetch
await deploy();

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(path.dirname(''));

(async function startServer() {
    const app = express();

    if (isProduction) {
        app.use(express.static(`${root}/dist/client`));
    } else {
        const viteDevMiddleware = (
            await (
                await import('vite')
            ).createServer({
                root,
                server: {
                    middlewareMode: true,
                    watch: {
                        usePolling: true,
                        interval: 100,
                    },
                },
            })
        ).middlewares;
        app.use(viteDevMiddleware);
    }

    app.get('/api/qC', async (req, res) => {
        const history = await getFile('./data/VC_Data.json');
        const lastDate = getLastDate(history);
        res.send(lastDate);
    });
    app.get('/api/qC2', (req, res) => {
        const r = getData('weatherData');
        res.send(r);
    });
    // app.get('/api/weather-data', async (req, res) => {
    //     res.send(getData('weatherData'));
    // });
    // app.get('/api/report-data', async (req, res) => {
    //     res.send(getData('reportData'));
    // });

    app.get('*', async (req, res, next) => {
        const urlOriginal = req.originalUrl;
        const pageContextInit = {urlOriginal};
        const pageContext = await renderPage(pageContextInit);
        const {httpResponse} = pageContext;
        if (!httpResponse) return next();
        const {body, statusCode, contentType} = httpResponse;
        res.status(statusCode).type(contentType).send(body);
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`)); // eslint-disable-line no-console
})();
