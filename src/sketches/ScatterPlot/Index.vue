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
    const dots = [];

    props.presence.forEach(present => {
        const prec = props.precipitation.find(precip => precip.date === present.date);
        if (prec) {
            dots.push(Dot(present.percentage, prec.mm, present.date, sketch.context));
        }
    });

    const graph = Graph(sketch.context, props.precipitation, props.presence, dots);

    sketch.draw = ({clear}) => {
        clear();
        graph.show();
        dots.forEach(dot => {
            dot.show();
            dot.inside(mouse);
        });
    };
});

/**
 * @param {number} presencePercentage
 * @param {number} precipitationMM
 * @param {string} date
 * @param {CanvasRenderingContext2D} ctx
 */
const Dot = (presencePercentage, precipitationMM, date, ctx) => {
    const color = [255, 0, 0];
    const pos = {x: 640, y: 360};
    const show = () => {
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
    };

    /** @param {{x: number, y: number}} mouse */
    const inside = mouse => {
        const distX = mouse.x - pos.x;
        const distY = mouse.y - pos.y;
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist < 5) {
            color[0] = 0;
            color[1] = 255;
        } else {
            color[0] = 255;
            color[1] = 0;
        }
    };

    return {
        percentage: presencePercentage,
        mm: precipitationMM,
        date,
        pos,
        show,
        inside,
    };
};
</script>
