<template>
    <canvas id="scatter-plot" />
</template>

<script setup>
/**
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('@vue/runtime-core').PropType<GraphData>} GraphProp
 */

import {onMounted, watch} from 'vue';
import Sketch from '..';
import Graph from './Graph';
import Stats from './Stats';
// import globals from '../globals';
import engine from '../engine.js';

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
});

/** @type {import('types/graph').Graph} */
let graph;

/** @type {import('types/graph').Stats} */
let stats;

watch(
    () => props.dataX,
    newDataX => {
        // data for x-axis has changed, setting new data
        const xUnits = graph.setX(newDataX);
        stats.setX(xUnits, graph.yUnits, newDataX);
    },
);

onMounted(() => {
    const sketch = Sketch('scatter-plot', {size: 'full'});

    sketch.mouse();

    graph = Graph(sketch, props.dataX, props.dataY);
    stats = Stats(sketch, graph, props.dataX, props.dataY);

    sketch.update(() => {
        stats.update();
    });

    sketch.render(() => {
        sketch.context.clearRect(0, 0, sketch.context.canvas.width, sketch.context.canvas.height);
        graph.show();
        stats.show();
    });
    sketch.start();
});
</script>
