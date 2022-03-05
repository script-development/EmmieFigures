<template>
    <canvas id="scatter-plot" />
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

    sketch.setup = ({size, position, border}) => {
        size(width, height);
        position('center');
        border('1px solid #ddd');
    };

    let mouse = {x: 0, y: 0};

    const canvasBoundingClientRect = sketch.context.canvas.getBoundingClientRect();
    sketch.context.canvas.addEventListener('mousemove', evt => {
        mouse.x = evt.clientX - canvasBoundingClientRect.left;
        mouse.y = evt.clientY - canvasBoundingClientRect.top;
    });

    /** @type {Array<Stat>} */
    const stats = [];

    props.presence.forEach(present => {
        const precip = props.precipitation.find(precip => precip.date === present.date);
        if (!precip) return;
        stats.push(Stat(present.percentage, precip.mm, present.date, sketch.context));
    });

    const graph = Graph(sketch.context, props.precipitation, props.presence, stats);

    sketch.draw = ({clear}) => {
        clear();
        graph.show();
        stats.forEach(dot => dot.show());
    };
});
</script>
