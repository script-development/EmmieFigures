<template>
    <div id="canvas-container">
        <canvas id="scatter-plot" :width="width" :height="height" style="border: 1px solid black" />
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

const width = 1280,
    height = 720;

onMounted(() => {
    const sketch = Sketch('scatter-plot');

    // setting position through javascript (css' floating point messes up mouse positioning);
    sketch.centerCanvas();

    const mouse = sketch.mouse();

    /** @type {Array<Stat>} */
    const stats = [];

    const graph = Graph(sketch.context, props.precipitation, props.presence);

    // create a statistic object for every date in presence
    props.presence.forEach((present, index) => {
        const precip = props.precipitation.find(precip => precip.date === present.date);
        if (!precip) return;
        stats.push(Stat(present.percentage, precip.mm, present.date, sketch.context, mouse, index));
    });

    setStatPosition(graph.xUnits, graph.yUnits, stats);
    let selectedId = -1;

    const loop = () => {
        sketch.context.clearRect(0, 0, width, height);

        graph.show();
        for (const stat of stats) {
            selectedId = stat.update();
            stat.show();
        }
        // force selected stat to appear on top and show stat values on screen @ mouse location
        if (selectedId > -1) {
            stats[selectedId].show();
            stats[selectedId].selected();
        }

        requestAnimationFrame(loop);
    };
    loop();
});
</script>
