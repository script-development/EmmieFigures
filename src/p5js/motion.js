/**
 * @typedef {import('p5')} p5
 * @typedef {import('p5').Vector} p5Vector
 * @typedef {import('types/P5').Motion} Motion
 */
import {Vector} from 'p5';

/**
 * @param {p5} p // The P5 instance
 * @param {{x: number, y: number, vx: number, vy: number}} param2 // object with position x and y
 * @returns {Motion}
 */
export default function (p, {x = 0, y = 0, vx = 0, vy = 0}) {
    const pos = p.createVector(x, y);
    const vel = p.createVector(vx, vy);
    const acc = p.createVector(0, 0);
    const maxVel = 30;
    const maxForce = 0.5;

    /** @param {p5Vector} force */
    const addAcc = force => {
        acc.add(force);
    };
    const upd = () => {
        vel.add(acc);
        vel.limit(maxVel);
        pos.add(vel);
        acc.set(0, 0);
    };
    /** @param {p5Vector} target */
    const seek = (target, {fleeing = false, arriving = false}) => {
        const force = Vector.sub(target, pos);
        let maxSpeed = maxVel;
        if (arriving) {
            let ra = 500;
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
    return {maxVel, maxForce, pos, vel, acc, addAcc, upd, seek};
}
