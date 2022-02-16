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

// const arr = props.precipitation.map(el => el.precip);

// const max = arr.reduce((a, b) => Math.max(a, b), 0);
// const min = arr.reduce((a, b) => Math.min(a, b), 0);

onMounted(() => {
    const sketch = Sketch('scatter-plot');

    sketch.setup = ({size, position, border}) => {
        size(1280, 720);
        position('center');
        border('1px solid #ddd');
    };

    const graph = Graph(sketch, props.precipitation);

    sketch.draw = e => {
        e.clear();
        graph.show(e);
    };
});
</script>
