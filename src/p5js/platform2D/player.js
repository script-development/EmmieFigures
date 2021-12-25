import Motion from './motion';

/**
 * @param {import('p5')} p
 * @param {number} x
 * @param {number} y
 */
export const Player = (p, x, y) => {
    const {pos, applyForce, update} = Motion(p, {x, y});
    const w = 30;
    const h = 60;
    const show = () => {
        p.noStroke();
        p.fill(255, 0, 0);
        p.rect(pos.x, pos.y, w, h);
    };
    return {update, applyForce, show};
};
