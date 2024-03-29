<template>
    <canvas id="scatter-plot" class="hidden" style="z-index: -1" />
</template>

<script setup>
/**
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('@vue/runtime-core').PropType<GraphData>} GraphProp
 */

/** @typedef {import('types/graph').GraphOption} GraphOption */
/** @typedef {import('@vue/runtime-core').PropType<GraphOption[]>} GraphOptions */

import {onMounted, watch} from 'vue';
import Sketch from '..';
import {createGraph, setGraph, elements} from './Graph';
import {setStatsX, setStatsY, createStats, changeRegression} from './Stats';

const props = defineProps({
    dataX: {
        /** @type {GraphProp} weather data for x-axis */
        type: Object,
        required: true,
    },
    dataY: {
        /** @type {GraphProp} presence data for y-axis */
        type: Object,
        required: true,
    },
    options: {
        type: Object,
        required: true,
    },
});

watch(
    () => props.dataX,
    dataX => {
        setGraph(dataX, elements.xTitle, elements.x, elements.xUnits);
        setStatsX(dataX);
        changeRegression(props.options.trendLineKey, props.options.trendLineKey);
    },
);
watch(
    () => props.dataY,
    dataY => {
        setGraph(dataY, elements.yTitle, elements.y, elements.yUnits);
        setStatsY(dataY);
        changeRegression(props.options.trendLineKey, props.options.trendLineKey);
    },
);
watch(
    () => props.options.trendLineKey,
    (newKey, oldKey) => {
        changeRegression(newKey, oldKey);
    },
);

onMounted(() => {
    const sketch = Sketch('scatter-plot', {pos: 'center', w: 1280, h: 720, clear: true});
    sketch.context.canvas.classList.remove('hidden');
    sketch.context.canvas.classList.add('block');

    createGraph(sketch);
    createStats(sketch);

    sketch.start();
});
</script>
