/* eslint-env node */

import expressRouting from './expressRouting.js';
import compression from 'compression';
import {createServer} from 'vite';
import express from 'express';
import path from 'path';
import sirv from 'sirv';
// import {deploy} from './services/data.js';
// import {getData} from './serverStore/index.js';

// await deploy();

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(path.dirname(''));
const app = express();
app.use(compression());

const productionServer = () => app.use(sirv(`${root}/dist/client`));

const developmentServer = async () => {
    const viteDevMiddleware = (
        await createServer({
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
};

(async function startServer() {
    isProduction ? productionServer() : await developmentServer();

    expressRouting(app);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`)); // eslint-disable-line no-console
})();
