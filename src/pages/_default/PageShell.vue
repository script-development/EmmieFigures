<template>
    <canvas v-show="loaded" id="main-canvas" />
    <Navigation v-if="loaded" />
    <div :style="store.pageShell">
        <slot />
    </div>
</template>

<script setup>
import Navigation from 'components/navigation/Navigation.vue';
import {store} from 'services/store';
import Sketch from 'sketches/index';
import {onMounted, reactive, ref} from 'vue';

const loaded = ref(false);

// let pageShell = store.pageShell);

const setSketch = /** @param {import('types/sketches').Sketch} sketch */ sketch => {
    store.sketch = {
        width: sketch.context.canvas.width,
        height: sketch.context.canvas.height,
        context: sketch.context,
        paint: sketch.paint,
        run: sketch.run,
        halt: sketch.halt,
    };
};

onMounted(() => {
    const sketch = Sketch('main-canvas', {size: 'full', clear: true});
    setSketch(sketch);
    loaded.value = true;
    store.pageShell = {marginTop: '200px'};
    // console.log(store.pageShell);
    // pageShell.marginTop = '200px';
    // store.pageShell = {marginTop: '200px'};
    // pageShell = store.pageShell;
});
</script>

<style>
body {
    margin: 0;
    font-family: sans-serif;
}
* {
    box-sizing: border-box;
}
</style>
