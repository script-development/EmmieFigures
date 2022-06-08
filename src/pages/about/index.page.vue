<template>
    <canvas id="test" />
</template>

<script setup>
import {setRender, setUpdate} from 'sketches/engine';
import Sketch from 'sketches/index.js';
import {onMounted} from 'vue';

const Particle = (x, y, mass) => {
    return {
        x,
        y,
        prevx: x,
        prevy: y,
        mass,
    };
};

const particles = [];
const sticks = [];

const pA = Particle(220, 20, 10000);
const pB = Particle(280, 20, 10000);
const pC = Particle(280, 60, 10000);
const pD = Particle(220, 60, 10000);
particles.push(pA, pB, pC, pD);

const keepInsideView = particle => {
    if (particle.y >= 400) particle.y = 400;
    if (particle.x >= 500) particle.x = 500;
    if (particle.y < 0) particle.y = 0;
    if (particle.x < 0) particle.x = 0;
};

const update = deltaTime => {
    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];

        let force = {x: 0.0, y: 0.5};

        let acceleration = {x: force.x / particle.mass, y: force.y / particle.mass};

        let prevPosition = {x: particle.x, y: particle.y};

        particle.x = particle.x * 2 - particle.prevx + acceleration.x * (deltaTime * deltaTime);
        particle.y = particle.y * 2 - particle.prevy + acceleration.y * (deltaTime * deltaTime);

        particle.prevx = prevPosition.x;
        particle.prevy = prevPosition.y;

        keepInsideView(particle);
    }
};

const show = ctx => {
    ctx.clearRect(0, 0, 500, 400);
    for (let i = 0; i < particles.length; i++) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, 10, 0, Math.PI * 2);
        ctx.fill();
    }
};

onMounted(() => {
    const sketch = Sketch('test', {pos: 'center', w: 500, h: 400, bg: 'black'});
    const ctx = sketch.context;

    setUpdate({
        id: 'test',
        update,
    });
    setRender({
        id: 'test',
        show: () => show(ctx),
    });
    sketch.start();
});
</script>
