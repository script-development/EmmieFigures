<template>
    <div ref="p5graph" />
</template>

<script setup>
/** @typedef {import('vue').Ref<HTMLElement|undefined>} p5Element */
import {onMounted, ref} from '@vue/runtime-core';

/** @type {p5Element} */
const p5graph = ref();

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init(p5graph.value);
    const canvas = p5.createCanvas(400, 400);
    canvas.position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
});
</script>
