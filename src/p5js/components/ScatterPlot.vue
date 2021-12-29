<template>
    <div id="p5graph" />
    <button @click="put">Put in</button>
    <button @click="get">Get</button>
    <div>{{ cache }}</div>
</template>

<script setup>
import {onMounted, ref} from '@vue/runtime-core';
import {getFromCache, putInCache, OneDayTTL} from 'services/cache';

let cache = ref();

const put = () => {
    putInCache('test', {x: 30}, OneDayTTL);
};
const get = () => {
    cache.value = getFromCache('test');
};

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init('p5graph');
    const canvas = p5.createCanvas(1600, 400);
    canvas.position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
    p5.draw = () => {
        p5.background(200);
    };
});
</script>
