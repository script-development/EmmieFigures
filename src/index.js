import express from 'express';
import vite from 'vite';
import path from 'path';
import {createPageRenderer} from 'vite-plugin-ssr';

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(path.dirname(''));

startServer();

async function startServer() {
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
    app.get('*', async (req, res, next) => {
        const url = req.originalUrl;
        const pageContextInit = {
            url,
        };
        const pageContext = await renderPage(pageContextInit);
        const {httpResponse} = pageContext;
        if (!httpResponse) return next();
        const {body, statusCode, contentType} = httpResponse;
        res.status(statusCode).type(contentType).send(body);
    });

    const port = process.env.PORT || 3001;
    app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${port}`);
}
