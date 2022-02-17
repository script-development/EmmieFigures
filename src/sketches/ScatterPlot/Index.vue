<template>
    <canvas id="scatter-plot" />
</template>

<script setup>
/**
 * @typedef {import('types/index').Precipitation} Precipitation
 * @typedef {import('@vue/runtime-core').PropType<Precipitation[]>} Precip
 */

import {onMounted} from 'vue';
import Sketch from '..';
import Graph from './Graph';

const props = defineProps({
    precipitation: {
        /** @type {Precip} */
        type: Array,
        required: true,
    },
});

onMounted(() => {
    const sketch = Sketch('scatter-plot');

    sketch.setup = ({size, position, border, textSize, textFont}) => {
        size(1280, 720);
        position('center');
        border('1px solid #ddd');
        textSize(20);
        textFont('georgia');
    };

    const graph = Graph(sketch, props.precipitation);

    sketch.draw = e => {
        e.clear();
        graph.show(e);
    };
});
</script>
