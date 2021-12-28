<template>
    <div class="demo">
        <button v-if="alive" @click="change(0)">Dot Product</button>
        <button v-if="alive" @click="change(1)">Another Project</button>
        <button v-if="alive" @click="change(2)">Text Morph</button>
        <!-- <button @click="change">Change Component</button>
        <button @click="keepSwitch">Keep on/off, current: {{ keep }}</button> -->
        <keep-alive v-if="keep">
            <component :is="file" class="tab" />
        </keep-alive>
        <component :is="file" v-else class="tab" />
    </div>
</template>

<script setup>
import {computed, defineAsyncComponent, ref} from 'vue';

const keep = ref(false);
const alive = ref(true);

const componentFile1 = defineAsyncComponent(() => import('p5js/components/OlcFireworks.vue'));
const componentFile2 = defineAsyncComponent(() => import('p5js/components/P5PurpleRain.vue'));
const componentFile3 = defineAsyncComponent(() => import('p5js/components/TextMorph.vue'));
const comps = [componentFile1, componentFile2, componentFile3];
const comp = ref();
const change = /** @param {number} index */ index => {
    alive.value = false;
    comp.value = index;
};

// const keepSwitch = () => {
//     keep.value = !keep.value;
// };

const file = computed(() => comps[comp.value]);
</script>

<style>
/* .demo {
    font-family: sans-serif;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 20px 30px;
    margin-top: 1em;
    margin-bottom: 40px;
    user-select: none;
    overflow-x: auto;
}

.tab-button {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    margin-bottom: -1px;
    margin-right: -1px;
}
.tab-button:hover {
    background: #e0e0e0;
}
.tab-button.active {
    background: #e0e0e0;
}
.demo-tab {
    border: 1px solid #ccc;
    padding: 10px;
} */
</style>
