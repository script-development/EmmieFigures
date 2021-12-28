/** @typedef {{x: number, y: number, w: number, h: number}} Rectangle */
/** @typedef {import('types/P5').QuadTree} QuadTree */
/** @typedef {{x: number, y: number}} Point */

/**
 * @param {number} x_
 * @param {number} y_
 */
export const Point = (x_, y_) => {
    //
};

/**
 * @param {number} x_
 * @param {number} y_
 * @param {number} w_
 * @param {number} h_
 * @returns {Rectangle}
 */
export const Rectangle = (x_, y_, w_, h_) => {
    let x = x_;
    let y = y_;
    let w = w_;
    let h = h_;
    return {x, y, w, h};
};

/**
 * @param {Rectangle} boundary
 *
 */
export const QuadTree = boundary => {
    const x = boundary.x;
    const y = boundary.y;
    const w = boundary.w;
    const h = boundary.h;
    let northwest, northeast, southwest, southeast;

    const capacity = 4;
    const points = [];

    const subdivide = () => {
        northwest = QuadTree();
        northeast = QuadTree();
        southwest = QuadTree();
        southeast = QuadTree();
    };

    /** @param {Point} pt */
    const insert = pt => {
        if (points.length < capacity) {
            points.push(pt);
        } else {
            subdivide();
        }
    };
    return {insert, x, y, w, h};
};
