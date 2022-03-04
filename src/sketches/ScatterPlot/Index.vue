<template>
    <canvas id="scatter-plot" />
</template>

<script setup>
/**
 * @typedef {import('types/index').Precipitation} Precipitation
 * @typedef {import('@vue/runtime-core').PropType<Precipitation[]>} Precip
 * @typedef {import('types/index').Presence} Presence
 * @typedef {import('@vue/runtime-core').PropType<Presence[]>} Present
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

    const graph = Graph(sketch.context, props.precipitation, props.presence);

    sketch.draw = ({clear}) => {
        clear();
        graph.show();
    };
});
</script>
