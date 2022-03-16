<template>
    <canvas id="scatter-plot" />
</template>

<script setup>
/**
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('@vue/runtime-core').PropType<GraphData>} GraphProp
 * @typedef {import('types/graph').Stat} Stat
 * @typedef {import('types/sketches').Sketch} SketchAPI
 */

import {onMounted, onUpdated} from 'vue';
import Sketch from '..';
import Graph from './Graph';
import {setStats, setStatsPosition} from './Stat';

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

/** @type {SketchAPI} */
let sketch;

/** @type {import('types/graph').Graph} */
let graph;

/** @type {Array<Stat>} */
let stats = [];

/** used for mouse hover over stat */
let selectedId = -1;

onUpdated(() => {
    // data changed, making new graph and stats
    graph = Graph(sketch, props.dataX, props.dataY);
    stats = setStats(props.dataX, props.dataY, sketch);
    setStatsPosition(graph.xUnits, graph.yUnits);
});

onMounted(() => {
    sketch = Sketch('scatter-plot');

    sketch.size(1280, 720);

    // setting position through javascript (css' floating point messes up mouse positioning);
    sketch.centerCanvas();

    // initialize mouse input
    sketch.mouse();

    graph = Graph(sketch, props.dataX, props.dataY);

    // create a statistic object for every date in presence
    stats = setStats(props.dataX, props.dataY, sketch);
    setStatsPosition(graph.xUnits, graph.yUnits);

    sketch.update(() => {
        for (const stat of stats) selectedId = stat.update();
    });

    sketch.render(() => {
        sketch.context.clearRect(0, 0, sketch.globals.width, sketch.globals.height);

        graph.show();
        for (const stat of stats) stat.show();

        // force selected stat to appear on top and show stat values on screen @ mouse location
        if (selectedId > -1) {
            stats[selectedId - 1].show();
            stats[selectedId - 1].selected();
        }
    });
});
</script>
