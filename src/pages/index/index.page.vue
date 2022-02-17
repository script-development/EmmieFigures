<template>
    <ScatterPlot :precipitation="precipitation" />
</template>

<script setup>
/** @typedef {import('types/index').WeatherData} WeatherData */
/** @typedef {import('@vue/runtime-core').PropType<WeatherData[]>} Weather */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import.meta.hot?.on('vite:beforeUpdate', () => import.meta.hot?.invalidate());

const props = defineProps({
    weather: {
        /** @type {Weather} */
        type: Object,
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
</script>
