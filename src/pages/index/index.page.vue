<template>
    <!-- <div id="canvas"></div> -->
    <h1>{{ weather }}</h1>
</template>

<script setup>
import {onMounted} from '@vue/runtime-core';

const props = defineProps({
    weather: {
        type: String,
        required: true,
    },
});

onMounted(async () => {
    // const {init} = await import('p5js/index');
    // const p5 = init('canvas');
    // const canvas = p5
    //     .createCanvas(1600, 400)
    //     .position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
    // p5.draw = () => {
    //     p5.background(200);
    //     p5.fill(255, 0, 0);
    //     p5.stroke(255);
    //     p5.strokeWeight(1);
    //     for (let i = 0; i < props.weatherData.length; i++) {
    //         p5.ellipse(props.weatherData[i] * 75, p5.height / 2, 5, 5);
    //     }
    // };
});
</script>
