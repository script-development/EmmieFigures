/** @typedef {import('p5')} p5 */

import {Vector} from 'p5';
import Motion from './motion';

/**
 * @param {p5} p
 * @param {{x : number, y: number, targetX: number, targetY: number}} param2
 */
export const Vehicle = (p, {x, y, targetX, targetY}) => {
    let velR = Vector.random2D();
    const {seek, pos, upd, addAcc} = Motion(p, {x, y, vx: velR.x, vy: velR.y});
    const target = p.createVector(targetX, targetY);
    const r = 8;

    const show = () => {
        p.stroke(255);
        p.strokeWeight(r);
        p.point(pos.x, pos.y);
    };
    return {pos, target, seek, show, update: upd, applyForce: addAcc};
};

// let identifier = 0;

// /**
//  * @param {p5} p
//  */
// export const Boid = p => {
//     identifier++;
//     const id = identifier;
//     const {acc, vel, pos, addAcc, upd} = Motion(p, {x: p.random(p.width), y: p.random(p.height)});
//     const random2DVec = Vector.random2D();
//     vel.set(random2DVec.x, random2DVec.y);
//     vel.setMag(p.random(2, 4));
//     const show = () => {
//         p.strokeWeight(16);
//         p.stroke(255);
//         p.point(pos.x, pos.y);
//     };

//     const align = boids => {
//         let perception = 100;
//         let steering = p.createVector();
//         let total = 0;
//         boids.forEach(boid => {
//             // console.log(boid.id);
//             const d = p.dist(pos.x, pos.y, boid.pos.x, boid.pos.y);
//             if (boid.id != id && d < perception) {
//                 steering.add(boid.velocity);
//                 total++;
//             }
//         });
//         if (total > 0) {
//             steering.div(boids.length);
//             steering.sub(vel);
//         }
//         return steering;
//     };
//     const flock = boids => {
//         let alignment = align(boids);
//         acc.set(alignment.x, alignment.y);
//     };
//     return {id, flock, align, pos, vel, update: upd, applyForce: addAcc, show};
// };
