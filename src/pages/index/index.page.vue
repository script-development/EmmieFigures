<template>
    <ScatterPlot :data-x="xAxis" :data-y="yAxis" :options="{trendlineKey, weatherTypeKey}" />

    <!-- <VSelect
        v-model="trendlineKey"
        class="absolute bottom-0 mb-24 xl:w-96"
        :options="options.trendLines"
        :disabled="!statsActive"
    >
        Regressie Type
    </VSelect> -->
    <VSelect
        :model-value="weatherTypeKey"
        class="absolute bottom-0"
        :options="options.weatherTypes"
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
            @change="selectedStartDate = /**@type {HTMLInputElement} */ ($event.target).value"
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
            @change="changeSelection"
        />
    </div>
</template>

<script setup>
/** @typedef {import('types/data').ReportData} ReportData */
/** @typedef {import('types/graph').WeatherTypeKeys} WeatherTypeKeys */

import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import options from 'sketches/ScatterPlot/options';
import VSelect from 'components/Select.vue';
import {onMounted, ref, computed, reactive} from 'vue';
import {getFromApi} from 'services/api';
import {getEnv} from 'services/env';
import {addOrSubtractDays, date2Slug, yesterday} from 'services/dates';
import {statsActive} from 'sketches/ScatterPlot/Stats';

/** This constant is needed for 1st @type to work properly */
const filler = 'nottin';

/**
 * selected weather type for x-axis
 * @type {import('@vue/runtime-core').Ref<WeatherTypeKeys>}
 */
const weatherTypeKey = ref('precip');

/**
 * selected trendline for plot
 * @type {import('@vue/runtime-core').Ref<import('types/graph').TrendlineKeys>}
 */
const trendlineKey = ref('none');

/** @type {import('types/graph').AxisProperties} */
const xAxis = reactive({
    ...options.weatherTypes[weatherTypeKey.value],
    data: [],
});

/** @type {import('@vue/runtime-core').Ref<ReportData[]>} */
const reports = ref([]);

/** @type {['morning', 'afternoon', 'evening']} */
const dayparts = ['morning', 'afternoon', 'evening'];

const selectedStartDate = ref('2021-01-01');
const selectedEndDate = ref(yesterday());
const minEndDate = computed(() => addOrSubtractDays(selectedStartDate.value, 1));
const maxStartDate = computed(() => addOrSubtractDays(selectedEndDate.value, -1));

onMounted(async () => {
    if (filler === 'nottin') {
        reports.value = await getFromApi(
            `${getEnv('VITE_APP_URL')}/api/reports/${date2Slug(selectedStartDate.value)}-${date2Slug(
                selectedEndDate.value,
            )}`,
        );
        xAxis.data = await getFromApi(
            `${getEnv('VITE_APP_URL')}/api/weather/${weatherTypeKey.value}/${date2Slug(
                selectedStartDate.value,
            )}-${date2Slug(selectedEndDate.value)}`,
        );
    }
});

/** @param {Event} evt */
const changeSelection = async evt => {
    if (evt.target instanceof HTMLSelectElement)
        weatherTypeKey.value = /** @type {WeatherTypeKeys} */ (evt.target.value);
    if (evt.target instanceof HTMLInputElement) selectedEndDate.value = evt.target.value;
    xAxis.data = await getFromApi(
        `${getEnv('VITE_APP_URL')}/api/weather/${weatherTypeKey.value}/${date2Slug(
            selectedStartDate.value,
        )}-${date2Slug(selectedEndDate.value)}`,
    );
    xAxis.title = options.weatherTypes[weatherTypeKey.value].title;
    xAxis.unitOfMeasure = options.weatherTypes[weatherTypeKey.value].unitOfMeasure;
    xAxis.steps = options.weatherTypes[weatherTypeKey.value].steps;

    reports.value = await getFromApi(
        `${getEnv('VITE_APP_URL')}/api/reports/${date2Slug(selectedStartDate.value)}-${date2Slug(
            selectedEndDate.value,
        )}`,
    );
};

const presence = computed(() =>
    reports.value.reduce((/** @type {Object.<string, {total: number, present: number}>} */ acc, report) => {
        // Check minimum and maximum date (default = min and max date)
        if (!acc[report.date]) acc[report.date] = {total: 0, present: 0};
        setTotalAndPresent(report, acc);
        return acc;
    }, {}),
);

/**
 *
 * @param {ReportData} report
 * @param {{[key: string]: {total: number, present: number}}} acc
 */
const setTotalAndPresent = (report, acc) => {
    for (const daypart of dayparts) {
        if (report[`${daypart}_schedule_id`]) {
            acc[report.date].total++;
            if (report[`${daypart}_present`]) acc[report.date].present++;
        }
    }
};

/** data and setting values for y-axis (static: presence) */
const yAxis = computed(() => ({
    /** set presence values and dates for each unique day */
    data: Object.keys(presence.value).map(date => ({
        date,
        value: Math.round((presence.value[date].present * 100) / presence.value[date].total),
    })),
    title: 'Aanwezigheid',
    unitOfMeasure: '%',
    steps: 10,
}));
</script>
