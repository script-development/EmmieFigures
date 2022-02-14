<template>
    <canvas id="scatter-plot" />
</template>

<script setup>
import {onMounted} from 'vue';
import {Sketch} from '..';

defineProps({
    precipitation: {
        type: Object,
        required: true,
    },
});

onMounted(() => {
    const twoD = Sketch('scatter-plot', '2d');
    const ctx = twoD.context;
    twoD.size(640, 480);
    twoD.position('center');
    twoD.border('1px solid #eee');
    const {width, height} = twoD.canvas;

    twoD.draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(40, 40);
        ctx.stroke();
    };
});
</script>
