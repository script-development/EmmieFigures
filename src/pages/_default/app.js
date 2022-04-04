import {createSSRApp, h} from 'vue';
import PageShell from './PageShell.vue';
// import {setPageContext} from './usePageContext';
import 'virtual:windi.css';
import 'assets/app.css';

export {createApp};

/** @param {import('types').PageContext} pageContext */
function createApp(pageContext) {
    const {Page, pageProps} = pageContext;
    const PageWithLayout = {
        render() {
            return h(
                PageShell,
                {},
                {
                    default() {
                        return h(Page, pageProps || {});
                    },
                },
            );
        },
    };

    const app = createSSRApp(PageWithLayout);

    // We make `pageContext` available from any Vue component
    // setPageContext(app, pageContext);

    return app;
}
