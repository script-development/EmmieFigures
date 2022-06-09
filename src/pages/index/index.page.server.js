import {weatherOptions} from 'serverStore/index';

export {onBeforeRender};

async function onBeforeRender() {
    return {
        pageContext: {
            pageProps: {weatherOptions},
        },
    };
}
