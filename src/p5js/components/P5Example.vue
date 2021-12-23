<template>
    <div id="p5example" />
</template>

<script setup>
/** @typedef {import('vue').Ref<HTMLElement|undefined>} p5Element */
import {onMounted} from '@vue/runtime-core';

const canvasWidth = 400;
const canvasHeight = 400;

onMounted(async () => {
    // import P5 instance creator and other sketch functions
    const {init} = await import('p5js/index');

    // create local p5 instance
    const p5 = init('p5example');

    // p5.setup
    const canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);

    // p5 element events:
    // canvas.mouseClicked(() => {});

    // p5 draw function (default @ 60 times per second, see framerate())
    p5.draw = () => {
        drawRect(p5);
    };

    // p5 global events:
    // p5.mousePressed = () => {};
    // p5.keyPressed = () => {};
});

/** @param {import('p5')} p5  */
const drawRect = p5 => {
    p5.background(255);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.rectMode(p5.CORNERS);
    p5.rect(0, 0, p5.width, p5.height, 50);
    p5.noFill();
    p5.stroke(255, 0, 0);
    p5.strokeWeight(2);
    p5.ellipse(p5.mouseX, p5.mouseY, 20, 20);
};
</script>
