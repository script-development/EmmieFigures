// import {putInCache, getFromCache} from 'services/cache';

export {onBeforeRender};

// import {ortData} from 'services/data';
// import {readFile} from 'fs/promises';
// import {getFromApi} from 'services/api';
// console.log(reportData.length);

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

/** @param {Array<import('types/data').ReportData>} reports */
const calculatePresencePerDay = reports => {
    let total = 0; // all scheduled dayparts (morning, afternoon and evening)
    let present = 0; // all dayparts where client has been present

    reports.forEach(report => {
        for (const daypart of dayparts) {
            if (report[`${daypart}_schedule_id`]) {
                total++;
                if (report[`${daypart}_present`]) present++;
            }
        }
    });

    return Math.round((present * 100) / total);
};

/** @param {import("types").PageContext} context */
async function onBeforeRender(context) {
    // const wDat = await readFile('./data/weatherHistory.json', 'utf-8');
    // const rDat = JSON.stringify(await readFile('./data/reports.json'));
    // const test = getFromCache('test');
    // if (!test) {
    //     console.log('put');
    //     putInCache('test', {some: true});
    // }
    // console.log(getFromCache('test'));

    // const test = await getFromApi('https://deelay.me/5000/https://picsum.photos/200/300');
    // const reportData = await reports();
    // const dataX = computed(() => ({
    // const weatherData = {
    //     title: 'Neerslag',
    //     unitOfMeasure: 'mm',
    //     data: context.weatherData.map(weather => ({date: weather.datetime, value: weather.precip})),
    // };
    //     title: selected.value.name,
    //     unitOfMeasure: selected.value.unitOfMeasure,
    //     /** get weather values and dates from weather data */
    //     data: props.weather.map(weather => ({date: weather.datetime, value: weather[selected.value.key]})),
    // }));
    // console.log(weatherData);
    // const uniqueDates = [...new Set(reportData.reportsForMonth.map(report => report.date))];
    // console.log(uniqueDates);
    // console.log(reportData.reportsForMonth.length);
    /** data for y-axis */
    // const dataY = {
    //     title: 'Aanwezigheid',
    //     unitOfMeasure: '%',
    //     /** get presence values and dates for each unique day */
    //     data: uniqueDates.map(date => {
    //         const filteredReports = reportData.reportsForMonth.filter(report => report.date === date);
    //         return {
    //             date,
    //             value: calculatePresencePerDay(filteredReports),
    //         };
    //     }),
    // };
    return {
        pageContext: {
            pageProps: {
                weather: [],
                // weather: [],
                reports: [],
                // reports: [],
                weatherOptions: [],
            },
        },
    };
}
