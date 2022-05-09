<template>
    <ScatterPlot :data-x="dataX" :data-y="dataY" />
    <!-- Trendlines -->
    <div v-for="(option, index) in settings.trendLines" :key="option.key" :class="`absolute bottom-${25 - index * 5}`">
        <input :id="option.key" type="checkbox" :disabled="!statsActive" @change="trendLine($event.target, index)" />
        <label :for="option.key">{{ option.name }}</label>
    </div>
    <VSelect v-model="weatherType" class="absolute bottom-0" :options="settings.weatherTypes">Weer Type</VSelect>
</template>

<script setup>
// @change="optionChange($event.target, option.id)"
/** @typedef {import('types/data').ReportData} ReportData */
/** @typedef {import('types/data').WeatherData} WeatherData */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import VSelect from 'components/Select.vue';
import {computed} from '@vue/reactivity';
import {onMounted, ref} from 'vue';
import {getFromApi} from 'services/api';
import {getEnv} from 'services/env';
import {statsActive} from 'sketches/ScatterPlot/Stats';

const props = defineProps({
    settings: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').Settings>} */
        type: Object,
        required: true,
    },
});

/** @type {import('@vue/runtime-core').Ref<WeatherData[]>} */
const weather = ref([]);

/** @type {import('@vue/runtime-core').Ref<ReportData[]>} */
const reports = ref([]);

/** selected weather type for x-axis */
const weatherType = ref(props.settings.weatherTypes[3]);

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

onMounted(async () => {
    weather.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/weather-data`);
    reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
});

/** data for x-axis based on current selected weather type */
const dataX = computed(() => ({
    title: weatherType.value.name,
    unitOfMeasure: weatherType.value.unitOfMeasure,
    steps: weatherType.value.steps,
    /** get weather values and dates from weather data */
    data: weather.value.map(weather => ({date: weather.datetime, value: weather[weatherType.value.key]})),
}));

const presence = computed(() =>
    reports.value.reduce((/** @type {Object.<string, {total: number, present: number}>} */ acc, report) => {
        if (!acc[report.date]) acc[report.date] = {total: 0, present: 0};
        for (const daypart of dayparts) {
            if (report[`${daypart}_schedule_id`]) {
                acc[report.date].total++;
                if (report[`${daypart}_present`]) acc[report.date].present++;
            }
        }
        return acc;
    }, {}),
);

const dataY = computed(() => ({
    title: 'Aanwezigheid',
    unitOfMeasure: '%',
    steps: 10,
    /** set presence values and dates for each unique day */
    data: Object.keys(presence.value).map(date => ({
        date,
        value: Math.round((presence.value[date].present * 100) / presence.value[date].total),
    })),
}));
</script>
