<template>
    <h1>matchMedia test</h1>

    <p />
</template>

<script setup>
import {onMounted} from 'vue';
import {view} from './breakpoints';

onMounted(() => {
    view.onBpChange(bp => {
        console.log(bp);
    });
    view.onOrChange(or => {
        console.log(or);
    });
});
</script>
