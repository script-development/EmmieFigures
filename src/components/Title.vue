<template>
    <h1>{{ title }}</h1>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
});
</script>

<style>
h1 {
    color: black;
    background: white;
    font-size: 5vw;
    position: absolute;
    top: 25%;
    left: 50%;
    -ms-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>
