import {renderToString} from '@vue/server-renderer';
import {escapeInject, dangerouslySkipEscape} from 'vite-plugin-ssr';
import {createApp} from './app';
import logoUrl from 'assets/favicon.svg';
import {Application_Description, Application_Title} from 'services/constants';

export {render};
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname'];

/** @param {import('types').PageContext} pageContext */
async function render(pageContext) {
    const app = createApp(pageContext);
    const appHtml = await renderToString(app);

    // See https://vite-plugin-ssr.com/html-head
    const {documentProps} = pageContext;
    const title = (documentProps && documentProps.title) || Application_Title;
    const desc = (documentProps && documentProps.description) || Application_Description;

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`;

    return {
        documentHtml,
        pageContext: {
            // `pageContext` here, which is useful if page redirection https://vite-plugin-ssr.com/page-redirection
        },
    };
}
