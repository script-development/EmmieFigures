<template>
    <canvas v-show="store.load.loaded" id="main-canvas" />
    <!-- <Text v-if="!store.load.loaded" id="tri" :msg="store.load.msg" class="tr" /> -->
    <!-- <Spinner /> -->
    <div id="line1" ref="line" />
    <div id="line2" />
    <Navigation v-if="store.load.loaded" />
    <div :style="store.styles.pageShell">
        <slot />
    </div>
</template>

<script setup>
import Navigation from 'components/navigation/Navigation.vue';
// import Text from 'components/Text.vue';
// import Title from 'components/Title.vue';
// import {Application_Title} from 'services/constants';
import {store} from 'services/store';
import Sketch from 'sketches/index';
import {onMounted, reactive, ref} from 'vue';

store.load = reactive({
    loaded: false,
});
store.styles = reactive({pageShell: {marginTop: '0'}});

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

const line = ref(null);

onMounted(() => {
    // console.log(line.value);
    line.value.addEventListener('animationend', ev => {
        if (ev.animationName === 'shrink') store.load.loaded = true;
    });
    const sketch = Sketch('main-canvas', {size: 'full', clear: true});
    setSketch(sketch);
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
    animation-duration: 0.1s, 5s, 0.1s;
    animation-delay: 0.5s, 0.7s, 5.7s;
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
    animation-duration: 0.1s, 5s, 0.1s;
    animation-delay: 0.6s, 0.7s, 5.8s;
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
        transform: translateX(-50%) translateY(-50%) rotate(2160deg);
    }
}
@keyframes rotate2 {
    to {
        transform: translateX(-50%) translateY(-50%) rotate(2250deg);
    }
}
</style>
