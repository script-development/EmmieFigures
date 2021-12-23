<template>
    <div id="p5graph" />
</template>

<script setup>
import {onMounted} from '@vue/runtime-core';

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init('p5graph');
    const canvas = p5.createCanvas(1600, 400);
    canvas.position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
    p5.draw = () => {
        p5.background(0);
    };
});
</script>
