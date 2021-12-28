<template>
    <div id="quadtree" :style="{height: height, overflow: 'hidden'}" />
</template>

<script setup>
import {onMounted, ref} from '@vue/runtime-core';

let height = ref('400px');

onMounted(async () => {
    height.value = window.innerHeight + 'px';
    const {init} = await import('p5js/index');
    const {QuadTree, Point, Rectangle} = await import('p5js/quadtree');
    const p5 = init('quadtree');

    const boundary = Rectangle(200, 200, 200, 200);
    const qTree = QuadTree(boundary);

    for (let i = 0; i < 1; i++) {
        let pt = Point(p5.random(p5.width), p5.random(p5.height));
        qTree.insert(pt);
    }

    p5.createCanvas(400, 400).position((window.innerWidth - p5.width) / 2, (window.innerHeight - p5.height) / 2);
    p5.draw = () => {
        p5.background(0);
        //
    };
});
</script>
