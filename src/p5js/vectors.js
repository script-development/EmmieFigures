/** @typedef {import('types/P5').vec2} vec2 */

/**
 * @param {vec2} v1
 * @param {vec2} v2
 */
const addTwoVectors = (v1, v2) => {
    v1.x + v2.x;
    v1.y + v2.y;
    return v1;
};

export const vec2 = (x = 0, y = 0) => {
    let x_ = x;
    let y_ = y;
    const self = {
        get x() {
            return x_;
        },
        set x(newX) {
            x_ = newX;
        },
        get y() {
            return y_;
        },
        set y(newY) {
            y_ = newY;
        },
        /** @param {vec2} vector */
        add: vector => addTwoVectors(self, vector),
    };
    return self;
};
