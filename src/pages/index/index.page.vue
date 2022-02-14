<template>
    <div v-for="val in precipDay" :key="val.datetime">
        {{ val.precip }}
    </div>
    <ScatterPlot :precipitation="precipDay" />
</template>

<script setup>
import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import.meta.hot?.on('vite:beforeUpdate', () => import.meta.hot?.invalidate());

const props = defineProps({
    weather: {
        type: Object,
        required: true,
    },
});

/** @type {Array<{day: string, precip: number}>} */
const precipDay = [];

const precipitation = () =>
    props.weather.days?.map(
        /** @param {{precip: number, datetime: string}} el */ el => {
            precipDay.push({day: el.datetime, precip: el.precip});
            el.precip;
        },
    );
precipitation();
</script>
