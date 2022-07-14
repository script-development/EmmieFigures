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
        :model-value="weatherTypeKey"
        class="absolute bottom-0"
        :options="settings.weatherTypes"
        :disabled="!statsActive"
        @change="changeSelection"
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
            min="2021-01-01"
            :max="maxStartDate"
            :disabled="!statsActive"
            @change="event => (selectedStartDate = /**@type {HTMLInputElement} */ (event.target).value)"
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
            :max="yesterday()"
            :disabled="!statsActive"
            @change="event => (selectedEndDate = /**@type {HTMLInputElement} */ (event.target).value)"
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
import {addOrSubtractDays, yesterday} from 'services/dates';
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

// /** @type {import('@vue/runtime-core').Ref<WeatherData[]>} */
const weather = ref({});

/** @type {import('@vue/runtime-core').Ref<ReportData[]>} */
const reports = ref([]);

/** selected weather type for x-axis */
const weatherTypeKey = ref('cloudcover');

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

const selectedStartDate = ref('');
const selectedEndDate = ref('');
const minEndDate = computed(() => addOrSubtractDays(selectedStartDate.value, 1));
const maxStartDate = computed(() => addOrSubtractDays(selectedEndDate.value, -1));

/** @param {string} date */
const convert = date => {
    return date.split('-').join('');
};

onMounted(async () => {
    selectedStartDate.value = '2021-01-01';
    selectedEndDate.value = yesterday();
    reports.value = await getFromApi(`${getEnv('VITE_APP_URL')}/api/report-data`);
    weather.value = await getFromApi(
        `${getEnv('VITE_APP_URL')}/api/weather/${weatherTypeKey.value}/${convert(selectedStartDate.value)}-${convert(
            selectedEndDate.value,
        )}`,
    );
});

const weatherSetting = computed(
    () =>
        props.settings.weatherTypes.find(setting => setting.key === weatherTypeKey.value) ||
        props.settings.weatherTypes[3], // || => default
);

/** @param {Event} evt */
const changeSelection = evt => {
    weatherTypeKey.value = evt.target.value;

    weather.value = getFromApi(
        `${getEnv('VITE_APP_URL')}/api/weather/${weatherTypeKey.value}/${convert(selectedStartDate.value)}-${convert(
            selectedEndDate.value,
        )}`,
    );
};

/** data for x-axis based on current selected weather type */
const dataX = computed(() => ({
    title: weatherSetting.value.name,
    unitOfMeasure: weatherSetting.value.unitOfMeasure,
    steps: weatherSetting.value.steps,
    /** get weather values and dates from weather data */
    // data: weather.value.map(weather => ({date: weather.datetime, value: weather[weatherSetting.value.key]})),
    data: weather.value,
}));

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
