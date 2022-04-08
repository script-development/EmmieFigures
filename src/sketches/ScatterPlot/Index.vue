<template>
    <canvas id="scatter-plot" class="hidden" />
</template>

<script setup>
/**
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('@vue/runtime-core').PropType<GraphData>} GraphProp
 */

import {onMounted} from 'vue';
import Sketch from '..';
import Graph from './Graph';

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

onMounted(() => {
    const sketch = Sketch('scatter-plot', {pos: 'center', w: 1280, h: 720});
    sketch.context.canvas.classList.remove('hidden');
    sketch.context.canvas.classList.add('block');

    const graph = Graph(sketch);

    sketch.update(() => {
        //
    });

    sketch.render(() => {
        sketch.context.clearRect(0, 0, sketch.context.canvas.width, sketch.context.canvas.height);

        graph.show();
        sketch.grid.show();
    });
});
</script>
