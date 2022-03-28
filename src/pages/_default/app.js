import {createSSRApp, h} from 'vue';
import PageShell from './PageShell.vue';
import {setPageContext} from './usePageContext';
import 'virtual:windi.css';
import 'assets/app.css';
import {weatherData} from 'src/store/weather';
// import {getFromCache} from 'services/cache';

export {createApp};

if (typeof window != 'object') {
    // console.log(getFromCache('weather'));
}

/** @param {import('types').PageContext} pageContext */
function createApp(pageContext) {
    const {Page, pageProps} = pageContext;
    const PageWithLayout = {
        data: () => ({count: 1}),
        render() {
            return h(
                PageShell,
                {},
                {
                    default() {
                        return h(Page, {});
                    },
                },
            );
        },
    };

    weatherData = pageProps.weatherData;

    const app = createSSRApp(PageWithLayout);

    // We make `pageContext` available from any Vue component
    setPageContext(app, pageContext);

    return app;
}
