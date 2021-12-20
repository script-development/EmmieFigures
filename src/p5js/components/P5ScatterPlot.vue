<template>
    <div ref="p5graph" />
</template>

<script setup>
/** @typedef {import('vue').Ref<HTMLElement|null>} p5Element */
import { onMounted, ref } from '@vue/runtime-core';

/** @type {p5Element} */
const p5graph = ref(null);

onMounted(async() => {
    const { init } = await import('p5js/index');
    const p5 = init(p5graph.value);
})
</script>