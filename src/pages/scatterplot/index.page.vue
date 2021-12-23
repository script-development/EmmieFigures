<template>
    <div>{{ url }}</div>
    <P5ScatterPlot />
</template>

<script setup>
import P5ScatterPlot from 'p5js/components/P5ScatterPlot.vue';

defineProps({url: {type: String, required: true}});
</script>
