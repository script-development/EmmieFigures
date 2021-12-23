/** @typedef {import('vite-plugin-ssr/types').PageContextBuiltIn} pageContext */

export {onBeforeRender};

/** @param {pageContext} pageContext */
async function onBeforeRender(pageContext) {
    return {
        pageContext: {
            pageProps: {url: pageContext.url},
        },
    };
}
