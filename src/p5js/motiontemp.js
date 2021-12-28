/**
 * @typedef {import('p5')} P5
 * @typedef {import('p5').Vector} P5Vector
 * @typedef {import('types/P5').Motion} Motion
 * @typedef {import('types/P5').Vehicle} Vehicle
 */

import {Vector} from 'p5';

/**
 * @param {P5} p // The P5 instance
 * @param {Motion} parameter2 // object with position and optional maxSpeed
 * @returns
 */
export const Pursuer = (p, {x = 0, y = 0, maxVel = 15}) => {
    const motion = Motion(p, {x, y, maxVel});
    const show = () => {
        p.stroke(255);
        p.strokeWeight(2);
        p.fill(255);
        p.push();
        p.translate(motion.pos.x, motion.pos.y);
        p.rotate(motion.vel.heading());
        p.triangle(-motion.r, -motion.r / 2, -motion.r, motion.r / 2, motion.r, 0);
        p.pop();
    };
    return {...motion, show};
};

/**
 * @param {P5} p // The P5 instance
 * @param {Vehicle} parameter2 // object with position and optional maxSpeed
 * @returns
 */
export const Target = (p, {x = 0, y = 0, maxVel = 15}) => {
    const motion = Motion(p, {x, y, maxVel});
    motion.vel.set(5, 2);
    const show = () => {
        p.stroke(255);
        p.strokeWeight(2);
        p.fill(255, 0, 0);
        p.push();
        p.translate(motion.pos.x, motion.pos.y);
        p.ellipse(0, 0, motion.r * 2, motion.r * 2);
        p.pop();
    };
    return {...motion, show};
};
/**
 * @param {P5} p // The P5 instance
 * @param {Motion} parameter2 // object with position and optional maxSpeed
 * @returns
 */
export default function (p, {x = 0, y = 0, maxVel = 5}) {
    const pos = p.createVector(x, y);
    const vel = p.createVector(2, 0);
    const acc = p.createVector(0, 0);
    let maxForce = 0.1;
    const r = 20;
    let wanderTheta = p.PI / 2;
    let currentPath = [];
    const paths = [currentPath];

    const wander = () => {
        // let force = Vector.random2D();
        let wanderPoint = vel.copy();
        wanderPoint.setMag(100);
        wanderPoint.add(pos);
        // p.fill(255, 0, 0);
        // p.noStroke();
        // p.circle(wanderPoint.x, wanderPoint.y, 8);

        let wanderRadius = 50;
        // p.noFill();
        // p.stroke(255);
        // p.circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);

        // p.line(pos.x, pos.y, wanderPoint.x, wanderPoint.y);

        let theta = wanderTheta + vel.heading();

        let px = wanderRadius * p.cos(theta);
        let py = wanderRadius * p.sin(theta);
        wanderPoint.add(px, py);

        // p.fill(0, 255, 0);
        // p.noStroke();
        // p.circle(wanderPoint.x, wanderPoint.y, 16);

        // p.stroke(255);
        // p.line(pos.x, pos.y, wanderPoint.x, wanderPoint.y);

        let steer = wanderPoint.sub(pos);
        steer.setMag(maxForce);

        applyForce(steer);

        let displacement = 0.3;
        wanderTheta += p.random(-displacement, displacement);
    };

    /** @param {Vector} target */
    const seek = (target, {fleeing = false, arriving = false}) => {
        const force = Vector.sub(target, pos);
        let maxSpeed = maxVel;
        if (arriving) {
            let ra = 100;
            let d = force.mag();
            if (d < ra) {
                maxSpeed = p.map(d, 0, ra, 0, maxVel);
            }
        }
        force.setMag(maxSpeed);
        if (fleeing) force.mult(-1);
        force.sub(vel);
        force.limit(maxForce);
        return force;
    };

    /** @param {Vector} target */
    const flee = target => seek(target, {fleeing: true});

    /** @param {Vehicle} vehicle */
    const pursue = (vehicle, {evading = false}) => {
        let target = vehicle.pos.copy();
        let prediction = vehicle.vel.copy();
        prediction.mult(10);
        target.add(prediction);
        p.fill(0, 255, 0);
        p.circle(target.x, target.y, 16);
        return seek(target, {fleeing: evading});
    };

    /** @param {Vehicle} vehicle */
    const evade = vehicle => pursue(vehicle, {evading: true});

    /** @param {number} value */
    const setMaxSpeed = value => {
        maxVel = value;
    };

    /** @param {number} value */
    const setMaxForce = value => {
        maxForce = value;
    };

    /** @param {Vector} force */
    const applyForce = force => {
        acc.add(force);
    };
    const update = () => {
        vel.add(acc);
        vel.limit(maxVel);
        pos.add(vel);
        acc.set(0, 0);

        currentPath.push(pos.copy());
    };
    const show = () => {
        p.stroke(255);
        p.strokeWeight(2);
        p.fill(255);
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(vel.heading());
        p.triangle(-r, -r / 2, -r, r / 2, r, 0);
        p.pop();

        for (let path of paths) {
            p.beginShape();
            p.noFill();
            for (let v of path) {
                p.vertex(v.x, v.y);
            }
            p.endShape();
        }
    };
    const edges = () => {
        let hitEdge = false;
        if (pos.x + r < 0) {
            pos.x = 1200 + r;
            hitEdge = true;
        } else if (pos.x - r > 1200) {
            pos.x = -r;
            hitEdge = true;
        }
        if (pos.y + r < 0) {
            pos.y = 600 + r;
            hitEdge = true;
        } else if (pos.y - r > 600) {
            pos.y = -r;
            hitEdge = true;
        }
        if (hitEdge) {
            currentPath = [];
            paths.push(currentPath);
        }
    };
    return {wander, show, evade, pursue, edges, pos, vel, r, flee, setMaxSpeed, setMaxForce, update, applyForce, seek};
}
