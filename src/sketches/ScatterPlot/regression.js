/**
 * Linear regression equation (y = mx + b)
 * from: https://classroom.synonym.com/calculate-trendline-2709.html
 * @param {Array<{x: number, y: number}>} data
 * @returns {(x: number) => number}
 */
export const linearRegression = data => {
    // Calculate the Slope (m) of the Trendline
    const n = data.length;
    const a = n * data.reduce((prev, cur) => prev + cur.x * cur.y, 0);
    const b = data.reduce((prev, cur) => prev + cur.x, 0) * data.reduce((prev, cur) => prev + cur.y, 0);
    const c = n * data.reduce((prev, cur) => prev + Math.pow(cur.x, 2), 0);
    const d = Math.pow(
        data.reduce((prev, cur) => prev + cur.x, 0),
        2,
    );
    const m = (a - b) / (c - d);

    // Calculating the y-intercept (b) of the Trendline
    const e = data.reduce((prev, cur) => prev + cur.y, 0);
    const f = m * data.reduce((prev, cur) => prev + cur.x, 0);
    const yIntercept = (e - f) / n;

    return x => m * x + yIntercept;
};
