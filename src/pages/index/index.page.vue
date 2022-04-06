<template>
    <!-- <ScatterPlot :data-x="dataX" :data-y="dataY" /> -->
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

import {computed} from '@vue/reactivity';
// import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import {onMounted, ref} from 'vue';
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
// const dataY = ref([]);

const reports = ref([]);

/** selected weather type for x-axis */
const selected = ref(props.weatherOptions[0]);

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

const uniqueDates = computed(() => {
    return reports.value.reduce((acc, report) => {
        if (!acc[report.date]) acc[report.date] = {total: 0, present: 0};
        for (const daypart of dayparts) {
            if (report[`${daypart}_schedule_id`]) {
                acc[report.date].total++;
                if (report[`${daypart}_present`]) acc[report.date].present++;
            }
        }
        return acc;
    }, {});
});

/**
 * @param {ReportData[]} reports
 * @param {string[]} uniqueDates
 */
const getPresence = computed(() => ({
    title: 'Aanwezigheid',
    unitOfMeasure: '%',
    /** get presence values and dates for each unique day */
    data: Object.keys(uniqueDates.value).map(date => {
        console.log(uniqueDates.value[date]);
        return {
            date,
            // value: calculatePresencePerDay(uniqueDates.value[date]),
        };
    }),
}));

/** @param {ReportData[]} reports */
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

onMounted(async () => {
    weather.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/weather-data`);
    reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
    console.time('total');
    console.log(getPresence.value);
    console.timeEnd('total');
});

/** data for x-axis based on current selected weather type */
const dataX = computed(() => ({
    title: selected.value.name,
    unitOfMeasure: selected.value.unitOfMeasure,
    /** get weather values and dates from weather data */
    data: weather.value.map(weather => ({date: weather.datetime, value: weather[selected.value.key]})),
}));

// Temporarily select options (for functional purposes)
const selectClass =
    'appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding' +
    'bg-no-repeat border border-solid border-gray-300 rounded' +
    'transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';
</script>
