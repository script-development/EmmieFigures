<template>
    <ScatterPlot :precipitation="precipitation" />
</template>

<script setup>
import {computed} from '@vue/runtime-core';
import ScatterPlot from 'sketches/ScatterPlot/Index.vue';
import.meta.hot?.on('vite:beforeUpdate', () => import.meta.hot?.invalidate());

const props = defineProps({
    weather: {
        type: Object,
        required: true,
    },
});

const precipitation = computed(() => props.weather.days?.map(/** @param {{precip: string}} el */ el => el.precip));
</script>
