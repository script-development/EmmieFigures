<template>
    <div id="canvas"></div>
</template>

<script setup>
/** @typedef {import('p5')} p5 */
import {onMounted} from '@vue/runtime-core';

/** @type {p5} */
let p5;

class Motion {
    Motion() {
        this.pos = p5.createVector(0, 0);
    }
}

let pos = 200;
const posX = () => {
    pos = 100;
    console.log(pos);
};

onMounted(async () => {
    const P5 = (await import('p5')).default;
    /** @param {p5} p5init */
    const script = p5init => {
        p5 = p5init;
        p5.setup = () => {
            p5.createCanvas(window.innerWidth, window.innerHeight);
        };
        p5.draw = () => {
            p5.background(0);
            p5.ellipse(p5.mouseX, p5.mouseY, 40, 40);
            p5.rectMode(p5.CENTER);
            p5.rect(window.innerWidth / 2, window.innerHeight / 2, pos, 200);
        };
    };
    const canvas = document.getElementById('canvas');
    if (canvas) new P5(script, canvas);
});
</script>

<style></style>
