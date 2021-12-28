<template>
    <div id="clocks" :style="{height: height, overflow: 'hidden'}" />
</template>

<script setup>
import {onMounted, ref} from '@vue/runtime-core';

let height = ref('400px');

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init('clocks');
    height.value = window.innerHeight + 'px';
    p5.createCanvas(window.innerWidth, window.innerHeight).position(
        (window.innerWidth - p5.width) / 2,
        (window.innerHeight - p5.height) / 2,
    );
    p5.angleMode(p5.DEGREES);
    p5.draw = () => {
        p5.background(0);
        let hr = p5.hour();
        let mn = p5.minute();
        let sc = p5.second();
        // p5.fill(255);
        // p5.noStroke();
        // p5.text(hr + ':' + mn + ':' + sc, 50, 50);
        // p5.strokeWeight(4);
        // p5.stroke(255);
        // p5.noFill();
        // p5.ellipse(p5.width / 2, p5.height / 2, 300, 300);

        p5.translate(p5.width / 2, p5.height / 2);
        p5.rotate(-90);

        p5.strokeWeight(8);
        p5.stroke(255, 100, 150);
        p5.noFill();
        let secondAngle = p5.map(sc, 0, 60, 0, 360);
        // p5.arc(0, 0, 300, 300, 0, secondAngle);

        p5.stroke(150, 100, 255);
        let minuteAngle = p5.map(mn, 0, 60, 0, 360);
        // p5.arc(0, 0, 280, 280, 0, minuteAngle);

        p5.stroke(150, 255, 100);
        let hourAngle = p5.map(hr % 12, 0, 12, 0, 360);
        // p5.arc(0, 0, 260, 260, 0, hourAngle);

        p5.push();
        p5.rotate(secondAngle);
        p5.stroke(255, 100, 150);
        p5.line(0, 0, 100, 0);
        p5.pop();

        p5.push();
        p5.rotate(minuteAngle);
        p5.stroke(150, 100, 255);
        p5.line(0, 0, 75, 0);
        p5.pop();

        p5.push();
        p5.rotate(hourAngle);
        p5.stroke(150, 255, 100);
        p5.line(0, 0, 50, 0);
        p5.pop();

        p5.stroke(255);
        p5.point(0, 0);
    };
});
</script>
