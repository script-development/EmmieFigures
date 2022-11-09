/* eslint-env node */

import expressRouting from './routing.js';
import {deploy} from './services/data.js';
import compression from 'compression';
import {createServer} from 'vite';
import express from 'express';
import path from 'path';
import sirv from 'sirv';

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(path.dirname(''));
const port = process.env.PORT || 3090;
const app = express();
app.use(compression());

// 1st time data fetch from visualcrossing weather APIs
deploy();

const productionServer = () => app.use(sirv(`${root}/dist/client`));

const developmentServer = async () => {
    const viteDevMiddleware = (
        await createServer({
            root,
            server: {middlewareMode: true},
        })
    ).middlewares;
    app.use(viteDevMiddleware);
};

(async function startServer() {
    isProduction ? productionServer() : await developmentServer();

    expressRouting(app);

    app.listen(port, () => console.log(`Server running at http://localhost:${port}`)); // eslint-disable-line no-console
})();
