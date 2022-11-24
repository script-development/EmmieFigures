<template>
    <!-- <FirstLoadSpinner v-if="!loaded" @on-load="onLoad" /> -->
    <canvas v-show="loaded" id="canvas1" />
    <Navigation v-if="loaded" />
    <slot />
</template>

<script setup>
import Navigation from 'components/navigation/Index.vue';
// import FirstLoadSpinner from 'components/spinners/FirstLoad.vue';
import Sketch from 'sketches/index';
import {onMounted, ref} from 'vue';

const loaded = ref(false);
// const onLoad = () => (loaded.value = true);

onMounted(() => {
    Sketch('canvas1', {size: 'full', clear: true, run: true});
    loaded.value = true;
});
</script>
