<template>
    <div id="canvas"></div>
</template>

<script setup>
/** @typedef {import('p5')} p5 */
/** @typedef {import('p5').Vector} vector */
import {onMounted} from '@vue/runtime-core';

// /** @type {p5} */
// let p5;

// /** @type {vector} */
// let vector;

// let vehicles = [];
// let particles = 1;

// let canvasWidth, canvasHeight;

// class Motion {
//     constructor() {
//         let x = 0;
//         let y = 0;
//         this.w = 0;
//         this.h = 0;
//         this.r = 0;
//         if (arguments.length == 3) {
//             x = arguments[0];
//             y = arguments[1];
//             this.r = arguments[2];
//         }
//         if (arguments.length == 4) {
//             x = arguments[0];
//             y = arguments[1];
//             this.w = arguments[2];
//             this.h = arguments[3];
//         }
//         this.pos = p5.createVector(x, y);
//         // this.vel = p5.createVector(0, 0);
//         // this.vel = p5.Vector.random2D();
//         // this.vel = p5.constructor.Vector.random2D();
//         this.vel = vector.random2D();
//         this.vel.setMag(5);
//         this.angle = this.vel.heading() + p5.PI / 2;
//         // this.angle = 0;
//         this.acc = p5.createVector(0, 0);
//         this.up = false;
//         this.down = false;
//         this.left = false;
//         this.right = false;
//         this.maxSpeed = 5;
//         this.accSpeed = 0.05;
//     }
//     update() {
//         // keyboard input
//         // if (this.up) this.acc.y -= this.accSpeed;
//         // if (this.down) this.acc.y += this.accSpeed;
//         // if (this.left) this.acc.x -= this.accSpeed;
//         // if (this.right) this.acc.x += this.accSpeed;
//         if (this.left) this.angle -= 0.1;
//         if (this.right) this.angle += 0.1;

//         this.vel.add(this.acc);
//         this.vel.limit(this.maxSpeed);
//         this.pos.add(this.vel);
//         this.acc.mult(0);
//     }
//     showTriangle() {
//         p5.fill(255, 0, 0);
//         p5.strokeWeight(2);
//         p5.stroke(255);

//         // modelVertexes
//         let x1 = 0;
//         let y1 = -this.r * 2;
//         let x2 = -this.r;
//         let y2 = this.r;
//         let x3 = this.r;
//         let y3 = this.r;

//         // Rotate
//         let xx1 = x1 * p5.cos(this.angle) - y1 * p5.sin(this.angle);
//         let yy1 = x1 * p5.sin(this.angle) + y1 * p5.cos(this.angle);
//         let xx2 = x2 * p5.cos(this.angle) - y2 * p5.sin(this.angle);
//         let yy2 = x2 * p5.sin(this.angle) + y2 * p5.cos(this.angle);
//         let xx3 = x3 * p5.cos(this.angle) - y3 * p5.sin(this.angle);
//         let yy3 = x3 * p5.sin(this.angle) + y3 * p5.cos(this.angle);

//         // Translate
//         xx1 += this.pos.x;
//         yy1 += this.pos.y;
//         xx2 += this.pos.x;
//         yy2 += this.pos.y;
//         xx3 += this.pos.x;
//         yy3 += this.pos.y;

//         // Draw model
//         p5.triangle(xx1, yy1, xx2, yy2, xx3, yy3);
//     }
//     showRect() {
//         p5.fill(255, 0, 0);
//         p5.strokeWeight(2);
//         p5.stroke(255);
//         p5.rect(this.pos.x, this.pos.y, this.w, this.h);
//     }
//     edgesRect() {
//         if (this.pos.x < 0) {
//             this.pos.x = 0;
//             this.vel.x *= -1;
//         } else if (this.pos.x + this.w > canvasWidth) {
//             this.pos.x = canvasWidth - this.w;
//             this.vel.x *= -1;
//         }
//         if (this.pos.y < 0) {
//             this.pos.y = 0;
//             this.vel.y *= -1;
//         } else if (this.pos.y + this.h > canvasHeight) {
//             this.pos.y = canvasHeight - this.h;
//             this.vel.y *= -1;
//         }
//     }
// }

onMounted(async () => {
    await import('../p5/index');
    const P5 = await import('p5');

    // const Vector = (await import('p5')).Vector;
    // const allP5 = await import('p5');
    // const P5 = allP5.default;
    // const {Vector} = allP5;
    // Vector.random2D();
    // vector = Vector;
    // /** @param {p5} p5init */
    // const script = p5init => {
    //     p5 = p5init;
    //     p5.setup = () => {
    //         canvasWidth = 1024;
    //         canvasHeight = 576;
    //         // p5.createCanvas(window.innerWidth, window.innerHeight);
    //         p5.createCanvas(canvasWidth, canvasHeight);
    //         for (let i = 0; i < particles; i++) {
    //             vehicles.push(new Motion(400, 200, 20));
    //         }
    //     };
    //     p5.draw = () => {
    //         p5.background(0);
    //         for (let i = 0; i < particles; i++) {
    //             vehicles[i].update();
    //             // vehicles[i].edgesRect();
    //             vehicles[i].showTriangle();
    //         }
    //     };
    //     p5.keyPressed = () => {
    //         if (p5.keyCode == p5.UP_ARROW) vehicles[0].up = true;
    //         if (p5.keyCode == p5.DOWN_ARROW) vehicles[0].down = true;
    //         if (p5.keyCode == p5.LEFT_ARROW) vehicles[0].left = true;
    //         if (p5.keyCode == p5.RIGHT_ARROW) vehicles[0].right = true;
    //     };
    //     p5.keyReleased = () => {
    //         if (p5.keyCode == p5.UP_ARROW) vehicles[0].up = false;
    //         if (p5.keyCode == p5.DOWN_ARROW) vehicles[0].down = false;
    //         if (p5.keyCode == p5.LEFT_ARROW) vehicles[0].left = false;
    //         if (p5.keyCode == p5.RIGHT_ARROW) vehicles[0].right = false;
    //     };
    // };
    // const canvas = document.getElementById('canvas');
    // if (canvas) new P5(script, canvas);
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
