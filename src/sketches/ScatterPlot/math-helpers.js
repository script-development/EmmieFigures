/**
 * Constrains a value between a minimum and maximum value.
 * @param {number} n number to constrain
 * @param {number} low minimum limit
 * @param {number} high maximum limit
 * @returns
 */
export const constrain = (n, low, high) => Math.max(Math.min(n, high), low);

/**
 * Re-maps a number from one range to another.
 * @param {number} value the incoming value to be converted
 * @param {number} start1 lower bound of the value's current range
 * @param {number} stop1 higher bound of the value's current range
 * @param {number} start2 lower bound of the value's target range
 * @param {number} stop2 higher bound of the value's target range
 * @param {boolean} [withinBounds] constrain the value to the newly mapped range
 * @returns
 */
export const map = (value, start1, stop1, start2, stop2, withinBounds) => {
    const newval = ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (!withinBounds) return newval;
    return start2 < stop2 ? constrain(newval, start2, stop2) : constrain(newval, stop2, start2);
};
