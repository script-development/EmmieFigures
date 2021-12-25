<template>
    <div id="platform2D" />
</template>

<script setup>
import {onMounted} from 'vue';

onMounted(async () => {
    const {init} = await import('p5js/index');
    const {Player} = await import('p5js/platform2D/player');
    const p5 = init('platform2D');
    const player = Player(p5, 50, 50);
    p5.createCanvas(1200, 600).position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
    p5.draw = () => {
        p5.background(0);
        // player.applyForce(p5.createVector(0, 0.2));
        player.update();
        player.show();
    };
});
</script>
