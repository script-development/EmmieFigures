<template>
    <ScatterPlot :data-x="dataX" :data-y="dataY" />
    <!-- Trendlines -->
    <!-- <div
        v-for="(option, index) in settings.trendLines"
        :key="option.key"
        :class="`absolute bottom-0 mb-${20 - index * 5}`"
    >
        <input :id="option.key" type="checkbox" :disabled="!statsActive" @change="trendLine($event.target, index)" />
        <label :for="option.key">{{ option.name }}</label>
    </div> -->
    <!-- <div class="absolute bottom-0 mb-24 xl:w-96 z-1">
        <label for="regression-options">Kies een regressiontype:</label>
        <select id="regression-options" :class="selectClass" @update="change($event.target)">
            <option selected>Geen</option>
            <option v-for="option in settings.trendLines" :key="option.key" :value="option" :disabled="!statsActive">
                {{ `${option.name}` }}
            </option>
        </select>
    </div> -->
    <VSelect
        :model-value="trendLineKey"
        class="absolute bottom-0 mb-24 xl:w-96 z-1"
        :options="settings.trendLines"
        :disabled="!statsActive"
        @update:model-value="change"
    >
        Regression Type
    </VSelect>
    <VSelect v-model="weatherTypeKey" class="absolute bottom-0" :options="settings.weatherTypes">Weer Type</VSelect>
    <!-- <div class="absolute bottom-0"> -->
    <!-- <div class="absolute bottom-0 mb-3 xl:w-96 z-1">
        <label for="weather-options">Kies een weertype:</label>
        <select id="weather-options" v-model="weatherType" :class="selectClass">
            <option v-for="option in settings.weatherTypes" :key="option.key" :value="option">
                {{ `${option.name} (${option.unitOfMeasure})` }}
            </option>
        </select>
    </div> -->
    <!-- </div> -->
</template>

<script setup>
/** @typedef {import('types/data').ReportData} ReportData */
/** @typedef {import('types/data').WeatherData} WeatherData */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import VSelect from 'components/Select.vue';
import {computed} from '@vue/reactivity';
import {onMounted, ref} from 'vue';
import {getFromApi} from 'services/api';
import {getEnv} from 'services/env';
import {statsActive, showLinearRegression} from 'sketches/ScatterPlot/Stats';

const props = defineProps({
    settings: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').Settings>} */
        type: Object,
        required: true,
    },
});

/** @param {"linear-regression" | "loess-regression" | "none"} type */
const change = type => {
    if (type === 'linear-regression') activateLinearRegression();
    if (type === 'loess-regression') activateLinearRegression();
    if (type === 'none') deactiveLinearRegression();
};

const deactiveLinearRegression = () => {
    // console.log('deactivated');
};

const activateLinearRegression = () => {
    showLinearRegression();
};

/** selected trendLine for plot */
const trendLineKey = ref('none');

/** @type {import('@vue/runtime-core').Ref<WeatherData[]>} */
const weather = ref([]);

/** @type {import('@vue/runtime-core').Ref<ReportData[]>} */
const reports = ref([]);

/** selected weather type for x-axis */
const weatherTypeKey = ref('cloudcover');

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

onMounted(async () => {
    weather.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/weather-data`);
    reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
});

const weatherSetting = computed(
    () =>
        props.settings.weatherTypes.find(setting => setting.key === weatherTypeKey.value) ||
        props.settings.weatherTypes[3],
);

/** data for x-axis based on current selected weather type */
const dataX = computed(() => {
    return {
        title: weatherSetting.value.name,
        unitOfMeasure: weatherSetting.value.unitOfMeasure,
        steps: weatherSetting.value.steps,
        /** get weather values and dates from weather data */
        data: weather.value.map(weather => ({date: weather.datetime, value: weather[weatherSetting.value.key]})),
    };
});

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
