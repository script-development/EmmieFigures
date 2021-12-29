/** @typedef {import('p5')} p5 */

import {Vector} from 'p5';
import Motion from './motion';

/**
 * @param {p5} p
 * @param {{x : number, y: number, targetX: number, targetY: number}} options
 * @return
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
