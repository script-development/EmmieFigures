<template>
    <ScatterPlot :precipitation="precipitation" />
    <div>Main</div>
</template>

<script setup>
/** @typedef {import('types/index').WeatherData} WeatherData */
/** @typedef {import('@vue/runtime-core').PropType<WeatherData[]>} Weather */
/** @typedef {import('types/index').ReportData} ReportData */
/** @typedef {import('@vue/runtime-core').PropType<ReportData[]>} Reports */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import {onMounted} from 'vue';
import.meta.hot?.on('vite:beforeUpdate', () => import.meta.hot?.invalidate());

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

/** @type {Array<import('types').Precipitation>} */
const precipitation = [];

const precipitationDatetime = () =>
    props.weather.map(weather => {
        precipitation.push({day: weather.datetime, precip: weather.precip});
        weather.precip;
    });
precipitationDatetime();
onMounted(() => {
    // number of days
    // sort dates of december
    const orderedDates = props.reports
        .filter(report => report.date.includes('2021-12'))
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    const unique = [...new Set(orderedDates.map(el => el.date))];
    console.log(unique);
    // get 1st date of december
    let currentDate = orderedDates[0].date;
    const firstDates = orderedDates.filter(report => {
        if (report.date === currentDate) {
            return true;
        }
        currentDate = report.date;
        return false;
    });
    let length = 0;
    let presence = 0;
    console.log(firstDates);
    firstDates.forEach(report => {
        if (report.morning_schedule_id) {
            length++;
            if (report.morning_present) presence++;
        }
        if (report.afternoon_schedule_id) {
            length++;
            if (report.afternoon_present) presence++;
        }
    });
    console.log(length, presence);
});
</script>
