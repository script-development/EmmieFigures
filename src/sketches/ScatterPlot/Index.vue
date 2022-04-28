<template>
    <canvas id="scatter-plot" class="hidden" />
</template>

<script setup>
/**
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('@vue/runtime-core').PropType<GraphData>} GraphProp
 */

import {onMounted, watch} from 'vue';
import Sketch from '..';
import {setGraph, Graph} from './Graph';
import {setStatsX, setStatsY, Stats, statsActive, getLinearRegressionData} from './Stats';
import {elements} from './Graph';
import {linearRegression} from './regression';

let ctx;

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

watch(
    () => statsActive.value,
    active => {
        if (active) {
            const linearRegressionData = getLinearRegressionData();
            console.log(linearRegressionData);
            const regress = linearRegression(linearRegressionData);
            const y1 = regress(elements.x.pos.x1);
            const y2 = regress(elements.x.pos.x2);
            console.log(y1);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.lineTo(elements.x.pos.x1, ctx.canvas.height - y1);
            ctx.moveTo(elements.x.pos.x2, ctx.canvas.height - y2);
            ctx.stroke();
            console.log(ctx);
        }
    },
);
watch(
    () => props.dataX,
    dataX => {
        setGraph(dataX, elements.xTitle, elements.x, elements.xUnits);
        setStatsX(dataX);
    },
);
watch(
    () => props.dataY,
    dataY => {
        setGraph(dataY, elements.yTitle, elements.y, elements.yUnits);
        setStatsY(dataY);
    },
);

onMounted(() => {
    const sketch = Sketch('scatter-plot', {pos: 'center', w: 1280, h: 720});
    sketch.context.canvas.classList.remove('hidden');
    sketch.context.canvas.classList.add('block');
    ctx = sketch.context;

    const graph = Graph(sketch);
    const stats = Stats(sketch);

    sketch.update(() => {
        stats.update();
    });

    sketch.render(() => {
        sketch.context.clearRect(0, 0, sketch.context.canvas.width, sketch.context.canvas.height);

        graph.show();
        stats.show();
    });
});
</script>
