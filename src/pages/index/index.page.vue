<template>
    <div id="p5index" style="height: 100vh; overflow: hidden; position: relative" />
</template>

<script setup>
import {onMounted} from 'vue';

onMounted(async () => {
    const {init} = await import('p5js/index');
    const p5 = init('p5index');
    p5.createCanvas(window.innerWidth, window.innerHeight);

    const links = [
        {
            href: '/p5-projects',
            name: 'P5 Projects',
            x: -200,
            y: 0,
            /** @type {null|import('p5').Element} */
            link: null,
        },
        {
            href: '/scatterplot',
            name: 'Scatter Plot',
            x: -200,
            y: 0,
            /** @type {null|import('p5').Element} */
            link: null,
        },
    ];
    let startX = -200;
    for (let i = 0; i < links.length; i++) {
        links[i].x = startX;
        links[i].y = 250 + i * 50;
        links[i].link = p5
            .createA(links[i].href, links[i].name)
            .position(links[i].x, links[i].y)
            .style('width', '150px');
    }
    let speed = 30;
    let phase = 1;

    p5.draw = () => {
        p5.background(245);
        if (phase == 1) {
            links[0].x += speed;
            if (links[0].x >= 300) {
                links[0].x = 300;
                phase = 2;
            }
            links[0].link?.position(links[0].x, links[0].y);
        } else if (phase == 2) {
            links[1].x += speed;
            if (links[1].x >= 300) {
                links[1].x = 300;
                phase = 2;
            }
            links[1].link?.position(links[1].x, links[1].y);
        }
    };
});
</script>
