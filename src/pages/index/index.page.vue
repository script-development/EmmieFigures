<template>
    <ScatterPlot :data-x="dataX" :data-y="dataY" />
    <label for="weather-options">Kies een weer type:</label>

    <select id="weather-options" v-model="selected">
        <option v-for="option in weatherOptions" :key="option.key" :value="option">
            {{ `${option.name} (${option.unitOfMeasure})` }}
        </option>
    </select>
</template>

<script setup>
import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import {computed, ref} from 'vue';

const props = defineProps({
    weather: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').WeatherData[]>} */
        type: Array,
        required: true,
    },
    reports: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').ReportData[]>} */
        type: Array,
        required: true,
    },
    weatherOptions: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').WeatherOptions[]>} */
        type: Array,
        required: true,
    },
});

const selected = ref(props.weatherOptions[0]);

const dataX = computed(() => ({
    title: selected.value.name,
    unitOfMeasure: selected.value.unitOfMeasure,
    /** get weather values and dates from weather data */
    data: props.weather.map(weather => ({date: weather.datetime, value: weather[selected.value.key]})),
}));

const uniqueDates = [...new Set(props.reports.map(report => report.date))];

const dataY = computed(() => ({
    title: 'Aanwezigheid',
    unitOfMeasure: '%',
    /** get presence values and dates for each unique day */
    data: uniqueDates.map(date => {
        const filteredReports = props.reports.filter(report => report.date === date);
        return {
            date,
            value: calculatePresencePerDay(filteredReports),
        };
    }),
}));

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
</script>
