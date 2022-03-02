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
    props.weather.map(weather => {
        precipitation.push({day: weather.datetime, precip: weather.precip});
        weather.precip;
    });

// const dayParts = ['morning', 'afternoon', 'evening'];
const uniqueDates = [...new Set(props.reports.map(report => report.date))];

const presenceDatetime = () => {
    uniqueDates.forEach(date => {
        const filteredReports = props.reports.filter(report => report.date === date);
        const presenceDay = calculatePresencePerDay(date, filteredReports);
        presence.push(presenceDay);
    });
};

/**
 * @param {string} date
 * @param {Array<ReportData>} reports
 */
const calculatePresencePerDay = (date, reports) => {
    let total = 0; // all scheduled dayparts (morning, afternoon and evening)
    let present = 0; // all dayparts where client has been present

    reports.forEach(report => {
        if (report.morning_schedule_id) {
            total++;
            if (report.morning_present) present++;
        }
        if (report.afternoon_schedule_id) {
            total++;
            if (report.afternoon_present) present++;
        }
        if (report.evening_schedule_id) {
            total++;
            if (report.evening_present) present++;
        }
    });

    return {
        day: date,
        percentage: Math.round((present * 100) / total), // this gives the percentage of presence on a certain day
    };
};

precipitationDatetime();
presenceDatetime();
</script>
