export {onBeforeRender};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    // const {reportsForMonth} = context.reportData;
    // console.log(typeof context.reportData);
    return {
        pageContext: {
            pageProps: {
                weather: context.weatherData,
                reports: context.reportData.reportsForMonth,
            },
        },
    };
}

export const passToClient = ['pageProps'];
