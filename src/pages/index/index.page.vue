<template>
    <ScatterPlot :data-x="dataX" :data-y="dataY" />
    <div class="absolute bottom-0">
        <div class="mb-3 xl:w-96 z-1">
            <label for="weather-options">Kies een weertype:</label>
            <select id="weather-options" v-model="selected" :class="selectClass">
                <option v-for="option in weatherOptions" :key="option.key" :value="option">
                    {{ `${option.name} (${option.unitOfMeasure})` }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup>
/** @typedef {import('types/data').ReportData} ReportData */
/** @typedef {import('types/data').WeatherData} WeatherData */
import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import {onMounted, ref, computed} from 'vue';
import {getFromApi} from 'services/api';
import {getEnv} from 'services/env';

const props = defineProps({
    weatherOptions: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').WeatherOptions[]>} */
        type: Array,
        required: true,
    },
});

/** @type {import('@vue/runtime-core').Ref<WeatherData[]>} */
const weather = ref([]);

/** @type {import('@vue/runtime-core').Ref<ReportData[]>} */
const reports = ref([]);

/** selected weather type for x-axis */
const selected = ref(props.weatherOptions[0]);

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

onMounted(async () => {
    weather.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/weather-data`);
    reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
});

/** data for x-axis based on current selected weather type */
const dataX = computed(() => ({
    title: selected.value.name,
    unitOfMeasure: selected.value.unitOfMeasure,
    steps: selected.value.steps,
    /** get weather values and dates from weather data */
    data: weather.value.map(weather => ({date: weather.datetime, value: weather[selected.value.key]})),
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

// Temporarily select options (for functional purposes)
const selectClass =
    'appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding' +
    'bg-no-repeat border border-solid border-gray-300 rounded' +
    'transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';
</script>
