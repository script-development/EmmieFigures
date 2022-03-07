<template>
    <ScatterPlot :precipitation="precipitation" :presence="presence" />
</template>

<script setup>
/** @typedef {import('types/index').WeatherData} WeatherData */
/** @typedef {import('@vue/runtime-core').PropType<WeatherData[]>} Weather */
/** @typedef {import('types/index').ReportData} ReportData */
/** @typedef {import('@vue/runtime-core').PropType<ReportData[]>} Reports */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
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

/** @type {Array<import('types').Presence>} */
const presence = [];

const precipitationDatetime = () =>
    props.weather.forEach(weather => precipitation.push({day: weather.datetime, precip: weather.precip}));

const presenceDatetime = () => {
    presence.push();
};

precipitationDatetime();
presenceDatetime();
</script>
