<template>
    <ScatterPlot :data-x="dataX" :data-y="dataY" :options="{trendLineKey, weatherTypeKey}" />
    <VSelect
        v-model="trendLineKey"
        class="absolute bottom-0 mb-24 xl:w-96"
        :options="settings.trendLines"
        :disabled="!statsActive"
    >
        Regressie Type
    </VSelect>
    <VSelect
        v-model="weatherTypeKey"
        class="absolute bottom-0"
        :options="settings.weatherTypes"
        :disabled="!statsActive"
    >
        Weer Type
    </VSelect>
    <div>
        <label for="start" style="display: block">Start date:</label>
        <input
            id="start"
            :value="selectedStartDate"
            type="date"
            name="data-start"
            :min="minStartDate"
            :max="maxStartDate"
            :disabled="!dateInputsActive"
            @change="changeStartDate"
        />
    </div>
    <div>
        <label for="end" style="display: block">End date:</label>
        <input
            id="end"
            :value="selectedEndDate"
            type="date"
            name="data-end"
            :min="minEndDate"
            :max="maxEndDate"
            :disabled="!dateInputsActive"
            @change="changeEndDate"
        />
    </div>
</template>

<script setup>
/** @typedef {import('types/data').ReportData} ReportData */
/** @typedef {import('types/data').WeatherData} WeatherData */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import VSelect from 'components/Select.vue';
import {onMounted, ref, computed} from 'vue';
import {getFromApi} from 'services/api';
import {getEnv} from 'services/env';
import {addOrSubtractDays} from 'services/dates';
import {statsActive} from 'sketches/ScatterPlot/Stats';

const props = defineProps({
    settings: {
        /** @type {import('@vue/runtime-core').PropType<import('types/data').Settings>} */
        type: Object,
        required: true,
    },
});

/** selected trendLine for plot */
const trendLineKey = ref('none');

/** @type {import('@vue/runtime-core').Ref<WeatherData[]>} */
const weather = ref([]);

/** @type {import('@vue/runtime-core').Ref<ReportData[]>} */
const reports = ref([]);

/** selected weather type for x-axis */
const weatherTypeKey = ref('cloudcover');

let rotate = 4;
// setInterval(() => {
//     weatherTypeKey.value = props.settings.weatherTypes[rotate].key;
//     rotate++;
//     if (rotate === 5) rotate = 0;
// }, 8000);

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

const dateInputsActive = ref(false);

const minStartDate = ref('');
const selectedStartDate = ref(minStartDate.value);
const maxStartDate = ref('');

const minEndDate = ref('');
const selectedEndDate = ref(minEndDate.value);
const maxEndDate = ref('');

/** @param {Event} evt */
const changeStartDate = evt => {
    const target = /** @type {HTMLInputElement} */ (evt.target);
    selectedStartDate.value = target.value;
    minEndDate.value = addOrSubtractDays(target.value, 1);
};

/** @param {Event} evt */
const changeEndDate = evt => {
    const target = /** @type {HTMLInputElement} */ (evt.target);
    selectedEndDate.value = target.value;
    maxStartDate.value = addOrSubtractDays(target.value, -1);
};

const setDateInputs = () => {
    selectedStartDate.value = reports.value[0].date;
    minStartDate.value = reports.value[0].date;
    maxStartDate.value = addOrSubtractDays(reports.value[reports.value.length - 1].date, -1);
    selectedEndDate.value = reports.value[reports.value.length - 1].date;
    minEndDate.value = addOrSubtractDays(reports.value[0].date, 1);
    maxEndDate.value = reports.value[reports.value.length - 1].date;
    dateInputsActive.value = true;
};

onMounted(async () => {
    weather.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/weather-data`);
    reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
    setDateInputs();
});

const weatherSetting = computed(
    () =>
        props.settings.weatherTypes.find(setting => setting.key === weatherTypeKey.value) ||
        props.settings.weatherTypes[3], // || => default
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
        // Check minimum and maximum date (default = min and max date)
        if (report.date < selectedStartDate.value || report.date > selectedEndDate.value) return acc;

        if (!acc[report.date]) acc[report.date] = {total: 0, present: 0};
        setTotalAndPresent(report, acc);
        return acc;
    }, {}),
);

/**
 *
 * @param {ReportData} report
 * @param {Object.<string, {total: number, present: number}>} acc
 */
const setTotalAndPresent = (report, acc) => {
    for (const daypart of dayparts) {
        if (report[`${daypart}_schedule_id`]) {
            acc[report.date].total++;
            if (report[`${daypart}_present`]) acc[report.date].present++;
        }
    }
};

/** data for y-axis (static: presence) */
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
