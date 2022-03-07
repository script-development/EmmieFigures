<template>
    <div id="canvas" />
    <h1>{{ precipitation }}</h1>
</template>

<script setup>
import {onMounted, computed} from '@vue/runtime-core';

const props = defineProps({
    weather: {
        type: Object,
        required: true,
    },
});

const precipitation = computed(() => {
    return props.weather.days?.map(/** @param {{precip: string}} el */ el => el.precip);
});

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init('canvas');
    p5.createCanvas(innerWidth, innerHeight);

    // const prep = precipitation.value.map(/** @param {number} el */ el => Motion(p5, {x: el}));
    // console.log(prep);

    p5.draw = () => {
        // p5.background(255);
        // p5.fill(0, 0, 128);
        // p5.noStroke();
        // prep.forEach(/** @param {{pos: import('p5').Vector}} pre */ pre => p5.ellipse(pre.pos.x * 100, 200, 5, 5));
    };
});
</script>
