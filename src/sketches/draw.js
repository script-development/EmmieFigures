const properties = {
    stroke: true,
    strokeWeight: 1,
    strokeStyle: 'black',
    fill: true,
    fillStyle: 'white',
};

/**
 * @param {number} n
 */
const stroke = n => {
    properties.stroke = true;
    properties.strokeStyle = `rgb(${n}), rgb(${n}), rgb(${n})`;
};

/**
 * @param {number} n
 */
const fill = n => {
    properties.fill = true;
    properties.fillStyle = `rgb(${n}), rgb(${n}), rgb(${n})`;
};

/**
 * @param {CanvasRenderingContext2D} c
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
const line = (c, x1, y1, x2, y2) => {
    c.lineWidth = properties.strokeWeight;
    c.strokeStyle = 'black';
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    if (properties.stroke) c.stroke();
};

/**
 * Draw Object with draw properties
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @returns {import("types/sketches").DrawApi}
 */
export default (canvas, context) => {
    return {
        strokeWeight: num => (properties.strokeWeight = num),
        stroke: num => stroke(num),
        noStroke: () => (properties.stroke = false),
        fill: num => fill(num),
        noFill: () => (properties.fill = false),
        line: (x1, y1, x2, y2) => line(context, x1, y1, x2, y2),
        clear: () => context.clearRect(0, 0, canvas.width, canvas.height),
    };
};
