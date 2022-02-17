export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    return {
        pageContext: {
            pageProps: {
                weather: context.weatherData,
            },
        },
    };
}

export const passToClient = ['pageProps'];
