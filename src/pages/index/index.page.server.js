import Settings from '../../settings.js';

export {onBeforeRender};

async function onBeforeRender() {
    return {
        pageContext: {
            pageProps: {settings: Settings},
        },
    };
}
