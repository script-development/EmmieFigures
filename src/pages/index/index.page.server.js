import weatherData from 'assets/weather.json';

// /** @param {import('vite-plugin-ssr').PageContextBuiltIn} pageContext */
export const onBeforeRender = () => {
    const pageProps = {weather: weatherData};
    const newP = {
        pageContext: {
            pageProps,
        },
    };
    return newP;
};

export const passToClient = ['pageProps'];
