<template>
    <div id="flocking" :style="{height: height, overflow: 'hidden'}" />
</template>

<script setup>
import {onMounted, ref} from '@vue/runtime-core';

let height = ref('400px');

onMounted(async () => {
    height.value = window.innerHeight + 'px';
    const {init} = await import('p5js/index');
    const {Boid} = await import('p5js/vehicles');
    const p5 = init('flocking');

    p5.createCanvas(window.innerWidth, window.innerHeight);
    /** @type {Array<{show: function, update: function, flock: function}>} */
    const flock = Array(10)
        .fill(0)
        .map(() => Boid(p5));

    p5.draw = () => {
        p5.background(0);
        flock.forEach(boid => {
            boid.flock(flock);
            boid.update();
            boid.show();
            //
        });
    };
});
</script>
