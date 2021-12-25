<template>
    <div id="p5index" style="height: 100vh; overflow: hidden; position: relative" />
</template>

<script setup>
import {onMounted} from 'vue';

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init('p5index');
    p5.createCanvas(window.innerWidth, window.innerHeight);
    const link1 = p5.createA('/nature', 'Nature of Code');
    const link2 = p5.createA('/platform-2D', 'Platform 2D');
    const link3 = p5.createA('/purplerain', 'Purple Rain');
    let link1X = -200;
    let link2X = -200;
    let link3X = -200;
    link1.position(link1X, 200).style('width', '150px');
    link2.position(link2X, 250).style('width', '150px');
    link3.position(link3X, 300).style('width', '150px');
    let speed = 30;
    let phase = 1;
    p5.draw = () => {
        p5.background(255);
        if (phase == 1) {
            link1X += speed;
            if (link1X >= 300) {
                link1X = 300;
                phase = 2;
            }
            link1.position(link1X, 200);
        } else if (phase == 2) {
            link2X += speed;
            if (link2X >= 300) {
                link2X = 300;
                phase = 3;
            }
            link2.position(link2X, 250);
        } else if (phase == 3) {
            link3X += speed;
            if (link3X >= 300) {
                link3X = 300;
                phase = 4;
            }
            link3.position(link3X, 300);
        }
    };
});
</script>
