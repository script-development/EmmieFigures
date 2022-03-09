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

const width = 1280,
    height = 720;

onMounted(() => {
    const sketch = Sketch('scatter-plot');

    sketch.setup = ({size, position, border, textSize, textFont}) => {
        size(width, height);
        position('center');
        border('1px solid #ddd');
        textSize(20);
        textFont('georgia');
    };

    const graph = Graph(width, height, props.precipitation);

    sketch.draw = Palet => {
        Palet.clear();
        graph.show(Palet);
    };
});
</script>
