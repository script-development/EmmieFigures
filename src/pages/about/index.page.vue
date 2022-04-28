<template>
    <canvas id="test" />
</template>

<script setup>
import Sketch from 'sketches/index.js';
import {onMounted} from 'vue';
import {linearRegression} from 'sketches/ScatterPlot/regression.js';

const data = [
    {
        x: 1,
        y: 3,
    },
    {
        x: 2,
        y: 5,
    },
    {
        x: 3,
        y: 4,
    },
];

const regress = linearRegression(data);

const x1 = 0;
const x2 = 10;

const y1 = regress(x1);
const y2 = regress(x2);

onMounted(() => {
    const sketch = Sketch('test', {w: 400, h: 400, border: true});
    const c = sketch.context;

    const unitLength = 40;
    const size = 4;

    c.fillStyle = 'red';
    data.forEach(d => {
        c.fillRect(d.x * unitLength, 400 - d.y * unitLength, size, size);
    });
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(x1 * unitLength, 400 - y1 * unitLength);
    c.lineTo(x2 * unitLength, 400 - y2 * unitLength);
    c.stroke();
});
</script>
