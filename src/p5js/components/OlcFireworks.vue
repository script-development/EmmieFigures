<template>
    <div id="olcFireworks" :style="{height: height, overflow: 'hidden'}" />
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref} from '@vue/runtime-core';

let height = ref('400px');

/** @type {import('p5')} */
let p5;

onBeforeUnmount(() => {
    p5.remove();
});

onMounted(async () => {
    const {init} = await import('p5js/index');
    p5 = init('olcFireworks');
    height.value = window.innerHeight + 'px';

    p5.createCanvas(800, 600).position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);

    p5.draw = () => {
        p5.background(0);
    };
});
</script>
