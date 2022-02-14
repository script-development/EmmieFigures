<template>
    <canvas id="scatter-plot" />
</template>

<script setup>
import {onMounted} from 'vue';
import Sketch from '..';
import Graph from './Graph';

const props = defineProps({
    precipitation: {
        type: Object,
        required: true,
    },
});

const arr = props.precipitation.map(el => el.precip);

const max = arr.reduce((a, b) => Math.max(a, b), 0);
const min = arr.reduce((a, b) => Math.min(a, b), 0);

onMounted(() => {
    console.log(max);
    console.log(min);
    const sketch = Sketch('scatter-plot');

    sketch.setup = ({size, position, border}) => {
        size(800, 450);
        position('center');
        border('1px solid #eee');
    };

    const graph = Graph();

    sketch.draw = e => {
        e.clear();
        graph.show(e);
    };
});
</script>
