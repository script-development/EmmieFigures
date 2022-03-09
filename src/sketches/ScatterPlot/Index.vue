<template>
    <div id="canvas-container">
        <canvas id="scatter-plot" style="border: 1px solid black" />
    </div>
</template>

<script setup>
/**
 * @typedef {import('types/graph').Precipitation} Precipitation
 * @typedef {import('@vue/runtime-core').PropType<Precipitation[]>} Precip
 * @typedef {import('types/graph').Presence} Presence
 * @typedef {import('@vue/runtime-core').PropType<Presence[]>} Present
 * @typedef {import('types/graph').Stat} Stat
 */

import {onMounted} from 'vue';
import Sketch from '..';
import Graph from './Graph';
import Stat from './Stat';
import {setStatPosition} from './Stat';

const props = defineProps({
    precipitation: {
        /** @type {Precip} */
        type: Array,
        required: true,
    },
    presence: {
        /** @type {Present} */
        type: Array,
        required: true,
    },
});

/** used for mouse hover over stat */
let selectedId = -1;

/** @type {Array<Stat>} */
const stats = [];

onMounted(() => {
    const sketch = Sketch('scatter-plot');

    sketch.size(1280, 720);

    // setting position through javascript (css' floating point messes up mouse positioning);
    sketch.centerCanvas();

    // initialize mouse input
    sketch.mouse();

    const graph = Graph(sketch, props.precipitation, props.presence);

    // create a statistic object for every date in presence
    props.presence.forEach((present, index) => {
        const precip = props.precipitation.find(precip => precip.date === present.date);
        if (!precip) return;
        stats.push(Stat(present.percentage, precip.mm, present.date, index, sketch));
    });

    setStatPosition(graph.xUnits, graph.yUnits, stats);

    sketch.update(() => {
        for (const stat of stats) selectedId = stat.update();
    });

    sketch.render(() => {
        sketch.context.clearRect(0, 0, sketch.globals.width, sketch.globals.height);

        graph.show();
        for (const stat of stats) stat.show();

        // force selected stat to appear on top and show stat values on screen @ mouse location
        if (selectedId > -1) {
            stats[selectedId].show();
            stats[selectedId].selected();
        }
    });
});
</script>
