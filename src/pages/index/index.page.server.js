import Settings from 'serverStore/settings';

export {onBeforeRender};

async function onBeforeRender() {
    return {
        pageContext: {
            pageProps: {settings: Settings},
        },
    };
}
