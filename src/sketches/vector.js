/** @typedef {import('types/vectors').vec2} vec2d */

/**
 *
 * @param {vec2d} v1
 * @param {vec2d} v2
 * @returns {vec2d}
 */
const addTwoVectors = (v1, v2) => {
    v1.x += v2.x;
    v1.y += v2.y;
    return v1;
};

/**
 *
 * @param {vec2d} v1
 * @param {vec2d} v2
 * @returns {vec2d}
 */
const subtractTwoVectors = (v1, v2) => {
    v1.x -= v2.x;
    v1.y -= v2.y;
    return v1;
};

/** @param {vec2d} v */
const getMagnitudeSquared = v => v.x * v.x + v.y * v.y;

/** @param {vec2d} v */
const getMagnitude = v => Math.sqrt(getMagnitudeSquared(v));

/**
 * @param {vec2d} v
 * @param {number} n
 */
const setMagnitude = (v, n) => v.norm().mult(n);

/**
 * @param {vec2d} v
 * @param {number} n
 * @returns {vec2d}
 */
const multiplyByNumber = (v, n) => {
    v.x *= n;
    v.y *= n;
    return v;
};

/** @param {vec2d} v */
const normalize = v => {
    const l = v.mag();
    if (l !== 0) v.mult(1 / l);
    return v;
};

/**
 * @param {vec2d} v
 * @param {number} n
 * @returns {vec2d}
 */
const divideByNumber = (v, n) => {
    v.x /= n;
    v.y /= n;
    return v;
};

/**
 * @param {vec2d} v
 * @returns {vec2d}
 */
const randomize2D = v => {
    const angle = Math.random() * (Math.PI * 2);
    v.x = Math.cos(angle);
    v.y = Math.sin(angle);
    return v;
};

/** @param {vec2d} v */
const copy = v => vec2(v.x, v.y);

/**
 * @param {vec2d} v
 * @param {number} max
 * @returns {vec2d}
 */
const limit = (v, max) => {
    const mSq = getMagnitudeSquared(v);
    if (mSq > max * max) v.div(Math.sqrt(mSq)).mult(max);
    return v;
}

/** @type {import('types/vectors').vec} */
const vec = {
    add: (v1, v2) => addTwoVectors(v1.copy(), v2),
    sub: (v1, v2) => subtractTwoVectors(v1.copy(), v2),
    div: (v, n) => divideByNumber(v.copy(), n),
    mult: (v, n) => multiplyByNumber(v.copy(), n),
    random2D: () => randomize2D(vec2()),
};

/**
 * 2D vector
 * @param {number} x
 * @param {number} y
 * @returns {vec2d}
 */
const vec2 = (x = 0, y = 0) => {
    const self = {
        get x() {
            return x;
        },
        set x(val) {
            x = val;
        },
        get y() {
            return y;
        },
        set y(val) {
            y = val;
        },
        /**
         * @param {number} x_
         * @param {number} y_
         */
        set: (x_, y_) => {
            x = x_;
            y = y_;
        },
        /**@param {vec2d} v */
        add: v => addTwoVectors(self, v),
        /**@param {vec2d} v */
        sub: v => subtractTwoVectors(self, v),
        /** @param {number} n */
        mult: n => multiplyByNumber(self, n),
        /** @param {number} n */
        div: n => divideByNumber(self, n),
        norm: () => normalize(self),
        copy: () => copy(self),
        mag: () => getMagnitude(self),
        magSq: () => getMagnitudeSquared(self),
        /** @param {number} n */
        setMag: n => setMagnitude(self, n),
        random2D: () => randomize2D(self),
        /** @param {number} max */
        limit: max => limit(self, max),
    };
    return self;
};

export {vec, vec2};
