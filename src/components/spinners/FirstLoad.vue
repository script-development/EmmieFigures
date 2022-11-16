<template>
    <div id="line1" />
    <div id="line2" ref="line2" />
</template>

<script setup>
import {onMounted, ref} from 'vue';

const emit = defineEmits(['on-load']);

/** @type {import('@vue/runtime-core').Ref<HTMLElement|undefined>} */
const line2 = ref(undefined);

onMounted(() => {
    line2.value?.addEventListener('animationend', ev => (ev.animationName === 'shrink' ? emit('on-load') : ''));
});
</script>

<style>
#line1 {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0px;
    height: 2px;
    background: #000;
    transform: translateX(-50%) translateY(-50%);
    transform-origin: center;
    animation-timing-function: linear, ease-in-out, linear;
    animation-fill-mode: forwards;
    animation-name: expand, rotate1, shrink;
    animation-duration: 0.1s, 2s, 0.1s;
    animation-delay: 0.5s, 0.7s, 2.7s;
}
#line2 {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0px;
    height: 2px;
    background: #000;
    transform: translateX(-50%) translateY(-50%) rotate(90deg);
    animation-timing-function: linear, ease-in-out, linear;
    animation-fill-mode: forwards;
    animation-name: expand, rotate2, shrink;
    animation-duration: 0.1s, 2s, 0.1s;
    animation-delay: 0.6s, 0.7s, 2.8s;
}
@keyframes expand {
    to {
        width: 50px;
    }
}
@keyframes shrink {
    to {
        width: 0;
    }
}
@keyframes rotate1 {
    to {
        transform: translateX(-50%) translateY(-50%) rotate(1440deg);
    }
}
@keyframes rotate2 {
    to {
        transform: translateX(-50%) translateY(-50%) rotate(1530deg);
    }
}
</style>
