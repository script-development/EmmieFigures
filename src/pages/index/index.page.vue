<template>
    <ScatterPlot :precipitation="precipitation" :presence="presence" />
</template>

<script setup>
import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import {computed} from 'vue';

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
});

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];
const uniqueDates = [...new Set(props.reports.map(report => report.date))];

/** filter precipitation and date from weather data */
const precipitation = computed(() => props.weather.map(weather => ({date: weather.datetime, mm: weather.precip})));

/** set presence for each unique day */
const presence = computed(() => {
    return uniqueDates.map(date => {
        const filteredReports = props.reports.filter(report => report.date === date);
        return {
            date,
            percentage: calculatePresencePerDay(filteredReports),
        };
    });
});

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
