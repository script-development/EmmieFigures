<template>
    <h1>matchMedia test</h1>

    <p />
</template>

<script setup>
import {onMounted} from 'vue';
import {breakpoint} from './breakpoints';

onMounted(() => {
    breakpoint.onChange(bp => {
        console.log(bp);
    });
});
</script>

<style>
/* html {
    font-family: sans-serif;
    background-color: white;
}

body {
    padding: 20px;
    margin: 10px;
    background-color: blue;
    border: 10px solid black;
}

h1,
p {
    text-align: center;
}

p {
    font-size: 1.3rem;
} */
</style>
