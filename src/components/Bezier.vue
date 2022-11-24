<template>
    <div v-if="false">Bézier Curves</div>
</template>

<script setup>
import {store} from 'services/store';
import {setRender} from 'sketches/engine';

let num = 0;

/** @type {CanvasRenderingContext2D} */
const ctx = store.sketch.context;

const mouse = store.sketch.mouse();

const curve = {
    start: {
        x: 20,
        y: 300,
    },
    cp1: {
        x: 100,
        y: 100,
    },
    cp2: {
        x: 400,
        y: 400,
    },
    end: {
        x: 600,
        y: 300,
    },
};

const {start, cp1, cp2, end} = curve;
const size = 24;
const borderRadius = 50;

const draw = () => {
    console.log(mouse.x, mouse.y);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.beginPath();

    ctx.roundRect(start.x - size / 2, start.y - size / 2, size, size, borderRadius);
    ctx.roundRect(mouse.x - size / 2, mouse.y - size / 2, size, size, borderRadius);
    ctx.roundRect(cp2.x - size / 2, cp2.y - size / 2, size, size, borderRadius);
    ctx.roundRect(end.x - size / 2, end.y - size / 2, size, size, borderRadius);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(mouse.x, mouse.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();
};
setRender({id: '1', show: draw});
</script>
