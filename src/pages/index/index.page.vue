<template>
    <h1>Stargazers</h1>
    <h2>Intergalactic Alliance</h2>
    <p>
        The Stargazers are members of the Intergalactic Alliance paving the way for peace and benevolence among all
        species. They are known for their enthusiasm for science, for their love of fun, and their dedication to
        education.
    </p>
    <button>More Info</button>
    <img src="/src/assets/Sample-image.svg" alt="sample-svg-image" />
</template>

<script setup>
/** @typedef {import('types/data').WeatherData} WeatherData */
/** @typedef {import('@vue/runtime-core').PropType<WeatherData[]>} Weather */
/** @typedef {import('types/data').ReportData} ReportData */
/** @typedef {import('@vue/runtime-core').PropType<ReportData[]>} Reports */

// import ScatterPlot from 'sketches/ScatterPlot/Index.vue';

const props = defineProps({
    weather: {
        /** @type {Weather} */
        type: Array,
        required: true,
    },
    reports: {
        /** @type {Reports} */
        type: Array,
        required: true,
    },
});

/** @type {Array<import('types/graph').Precipitation>} */
const precipitation = [];

/** @type {Array<import('types/graph').Presence>} */
const presence = [];

/** filter precipitation and date from weather data */
const setPrecipitation = () =>
    props.weather.map(weather => {
        precipitation.push({date: weather.datetime, mm: weather.precip});
        weather.precip;
    });

/** set presence for each unique day */
const setPresence = () => {
    uniqueDates.forEach(date => {
        const filteredReports = props.reports.filter(report => report.date === date);
        presence.push({
            date,
            percentage: calculatePresencePerDay(filteredReports),
        });
    });
};

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];
const uniqueDates = [...new Set(props.reports.map(report => report.date))];

/** @param {Array<ReportData>} reports */
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

setPrecipitation();
setPresence();
</script>
