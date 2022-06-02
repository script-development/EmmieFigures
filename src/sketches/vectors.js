/** @typedef {import("types/vectors").Vec4d} Vec4d */
/** @typedef {import("types/vectors").Vec2d} Vec2d */

export const Vec4 = {
    /**
     * Add 2 double position vectors togethers without altering the source vectors
     * @param {Vec4d} v1
     * @param {Vec4d} v2
     * @returns {Vec4d} new double position vector
     */
    add: (v1, v2) => ({
        x1: v1.x1 + v2.x1,
        y1: v1.y1 + v2.y1,
        x2: v1.x2 + v2.x2,
        y2: v1.y2 + v2.y2,
    }),
};

export const Vec2 = {
    /**
     * Add 2 double position vectors togethers without altering the source vectors
     * @param {Vec2d} v1
     * @param {Vec2d} v2
     * @returns {Vec2d} new double position vector
     */
    sub: (v1, v2) => ({
        x: v1.x - v2.x,
        y: v1.y - v2.y,
    }),
    setMag: (v, n) => {
        const l = mag(v);
        if (l !== 0) mult(v, 1 / l); // normalize
        v.x *= n;
        v.y *= n;
    },
    mag: v => mag(v),
    dist: (v1, v2) => {
        const v3 = {x: 0, y: 0};
        v3.x = v2.x - v1.x;
        v3.y = v2.y - v1.y;
        const l = mag(v3);
        return l;
    },
    limit: (v, max) => {
        const mSq = magSq(v);
        if (mSq > max * max) {
            div(v, Math.sqrt(mSq));
            mult(v, max);
        }
    },
    mult: (v, n) => mult(v, n),
};

const div = (v, n) => {
    v.x /= n;
    v.y /= n;
};
const mag = v => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
const magSq = v => {
    return v.x * v.x + v.y * v.y;
};
const mult = (v, n) => {
    v.x *= n;
    v.y *= n;
};
