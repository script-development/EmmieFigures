/**
 * @typedef {import('p5')} p5
 * @typedef {import('p5').Vector} p5Vector
 * @typedef {import('types/P5').Motion} Motion
 */

/**
 * @param {p5} p // The P5 instance
 * @param {{x: number, y: number}} param2 // object with position x and y
 * @returns {Motion}
 */
export default function (p, {x = 0, y = 0}) {
    const pos = p.createVector(x, y);
    const vel = p.createVector(0, 0);
    const acc = p.createVector(0, 0);

    /** @param {p5Vector} force */
    const applyForce = force => {
        acc.add(force);
    };
    const update = () => {
        vel.add(acc);
        pos.add(vel);
        acc.set(0, 0);
    };
    return {pos, applyForce, update};
}
