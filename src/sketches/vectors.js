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
