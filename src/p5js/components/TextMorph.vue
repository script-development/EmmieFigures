<template>
    <div id="text_morph" :style="{height: height, overflow: 'hidden'}" />
</template>

<script setup>
import {onMounted, ref} from '@vue/runtime-core';

let height = ref('400px');

onMounted(async () => {
    const {init} = await import('p5js/index');
    const {Vehicle} = await import('p5js/vehicles.js');
    const p5 = init('text_morph', true);
    height.value = window.innerHeight + 'px';

    let points1, points2;
    let vehicles = [];
    let lengthDifStart;
    let setPoint2 = true;
    let fps = p5.frameRate().toFixed(0);

    p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight).position(
            (window.innerWidth - p5.width) / 2,
            (window.innerHeight - p5.height) / 2,
        );
        points1 = p5.font.textToPoints('Stan', 960, p5.height / 2, 200);
        for (let i = 0; i < points1.length; i++) {
            vehicles.push(
                Vehicle(p5, {
                    x: p5.random(p5.width),
                    y: p5.random(p5.height),
                    targetX: points1[i].x,
                    targetY: points1[i].y,
                }),
            );
        }
        points2 = p5.font.textToPoints('This is even longer! (though smaller)', 150, p5.height / 2, 100);
        lengthDifStart = points1.length - 1;
    };
    p5.draw = () => {
        p5.background(51);

        if (p5.millis() > 3000) {
            if (setPoint2) {
                for (let i = lengthDifStart; i < points2.length; i++) {
                    let index = parseInt(p5.random(points1.length));
                    vehicles.push(
                        Vehicle(p5, {
                            // x: points1[index].x,
                            // y: points1[index].y,
                            x: p5.random(p5.width),
                            y: p5.random(p5.height),
                            targetX: points2[i].x,
                            targetY: points2[i].y,
                        }),
                    );
                }
                for (let i = 0; i < points1.length; i++) {
                    vehicles[i].target.x = points2[i].x;
                    vehicles[i].target.y = points2[i].y;
                }
                setPoint2 = false;
            } else {
                for (let i = 0; i < vehicles.length; i++) {
                    let force = vehicles[i].seek(vehicles[i].target, {arriving: true});
                    vehicles[i].applyForce(force);
                    vehicles[i].update();
                    vehicles[i].show();
                }
            }
        } else {
            for (let i = 0; i < vehicles.length; i++) {
                let force = vehicles[i].seek(vehicles[i].target, {arriving: true});
                vehicles[i].applyForce(force);
                vehicles[i].update();
                vehicles[i].show();
            }
        }

        if (p5.frameCount % 10 == 0) {
            fps = p5.frameRate().toFixed(0);
        }
        p5.fill(255);
        p5.noStroke();
        p5.textSize(20);
        p5.text(fps, 50, p5.height - 50);
    };
});
</script>
