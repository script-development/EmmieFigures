<template>
    <div id="canvas"></div>
</template>

<script setup>
/** @typedef {import('p5')} p5 */
/** @typedef {import('p5')} vector */
import {onMounted} from '@vue/runtime-core';

/** @type {p5} */
let p5;

/** @type {vector} */
let vector;

let vehicles = [];
let particles = 500;

let canvasWidth, canvasHeight;

class Motion {
    constructor(x, y, w, h) {
        this.pos = p5.createVector(x, y);
        // this.vel = p5.createVector(0, 0);
        // this.vel = p5.Vector.random2D();
        // this.vel = p5.constructor.Vector.random2D();
        this.vel = vector.random2D();
        this.vel.setMag(5);
        this.acc = p5.createVector(0, 0);
        this.w = w;
        this.h = h;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.maxSpeed = 5;
        this.accSpeed = 0.05;
    }
    update() {
        // keyboard input
        if (this.up) this.acc.y -= this.accSpeed;
        if (this.down) this.acc.y += this.accSpeed;
        if (this.left) this.acc.x -= this.accSpeed;
        if (this.right) this.acc.x += this.accSpeed;

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    showRect() {
        p5.fill(255, 0, 0);
        p5.strokeWeight(2);
        p5.stroke(255);
        p5.rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    edgesRect() {
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        } else if (this.pos.x + this.w > canvasWidth) {
            this.pos.x = canvasWidth - this.w;
            this.vel.x *= -1;
        }
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        } else if (this.pos.y + this.h > canvasHeight) {
            this.pos.y = canvasHeight - this.h;
            this.vel.y *= -1;
        }
    }
}

onMounted(async () => {
    const P5 = (await import('p5')).default;
    const Vector = (await import('p5')).Vector;
    vector = Vector;
    /** @param {p5} p5init */
    const script = p5init => {
        p5 = p5init;
        p5.setup = () => {
            canvasWidth = 800;
            canvasHeight = 400;
            // p5.createCanvas(window.innerWidth, window.innerHeight);
            p5.createCanvas(canvasWidth, canvasHeight);
            for (let i = 0; i < particles; i++) {
                vehicles.push(new Motion(400, 200, 5, 5));
            }
        };
        p5.draw = () => {
            p5.background(0);
            for (let i = 0; i < particles; i++) {
                vehicles[i].update();
                vehicles[i].edgesRect();
                vehicles[i].showRect();
            }
        };
        p5.keyPressed = () => {
            if (p5.keyCode == p5.UP_ARROW) vehicle.up = true;
            if (p5.keyCode == p5.DOWN_ARROW) vehicle.down = true;
            if (p5.keyCode == p5.LEFT_ARROW) vehicle.left = true;
            if (p5.keyCode == p5.RIGHT_ARROW) vehicle.right = true;
        };
        p5.keyReleased = () => {
            if (p5.keyCode == p5.UP_ARROW) vehicle.up = false;
            if (p5.keyCode == p5.DOWN_ARROW) vehicle.down = false;
            if (p5.keyCode == p5.LEFT_ARROW) vehicle.left = false;
            if (p5.keyCode == p5.RIGHT_ARROW) vehicle.right = false;
        };
    };
    const canvas = document.getElementById('canvas');
    if (canvas) new P5(script, canvas);
});
</script>

<style scoped>
#canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
