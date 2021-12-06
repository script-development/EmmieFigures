<template>
    <div id="canvas"></div>
    <div id="canvas2" @click="posX()">M</div>
</template>

<script setup>
import { onMounted } from '@vue/runtime-core';

let pos = 200;
const posX = () => {
    pos = 100;
    console.log(pos);
}

onMounted(async() => {
    const P5 = (await import('p5')).default;
    const script = p5 => {
      p5.setup = () => {
          p5.createCanvas(window.innerWidth, window.innerHeight);
      };
      p5.draw = () => {
        // p5.clear();
        p5.background(0);
        p5.ellipse(p5.mouseX, p5.mouseY, 40, 40);
        p5.rectMode(p5.CENTER);
        p5.rect(window.innerWidth / 2, window.innerHeight/2, pos, 200);
      }; 
    }
    const canvas = document.getElementById("canvas");
    if (canvas) new P5(script, canvas);
})
</script>

<style></style>