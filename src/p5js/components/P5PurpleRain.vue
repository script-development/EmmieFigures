<template>
    <div id="p5example" :style="{height: height, overflow: 'hidden'}" />
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref} from '@vue/runtime-core';

console.log('p5purplerain ran');

let height = ref('400px');
/** @type {import('p5')} */
let p5;
onBeforeUnmount(() => {
    console.log('unbeforeumnount purple rain');
    p5.remove();
});

onMounted(async () => {
    const {init} = await import('p5js/index');
    p5 = init('p5example');
    height.value = window.innerHeight + 'px';
    p5.createCanvas(window.innerWidth, window.innerHeight);
    const drops = [];
    for (let i = 0; i < 5000; i++) {
        drops[i] = Drop(p5);
    }

    let fps = p5.frameRate().toFixed(0);
    p5.draw = () => {
        p5.background(230, 230, 250);
        for (let i = 0; i < 5000; i++) {
            drops[i].fall();
            drops[i].show();
        }

        if (p5.frameCount % 10 == 0) {
            fps = p5.frameRate().toFixed(0);
        }
        p5.fill(0);
        p5.noStroke();
        p5.textSize(20);
        p5.text(fps, 50, window.innerHeight - 50);
    };
});

/** @param {import('p5')} p */
const Drop = p => {
    let x = p.random(window.innerWidth);
    let y = p.random(-200, -100);
    let yspeed = p.random(4, 10);
    let len = p.random(10, 20);
    const fall = () => {
        y = y + yspeed;
        if (y > window.innerHeight) y = p.random(-200, -100);
    };
    const show = () => {
        p.stroke(138, 43, 226);
        p.line(x, y, x, y + 10);
    };
    return {fall, show};
};
</script>
