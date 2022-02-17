const properties = {
    stroke: true,
    strokeWeight: 1,
    strokeStyle: 'black',
    fill: true,
    fillStyle: 'white',
    /** @type {CanvasTextAlign} */
    textAlign: 'center',
    /** @type {CanvasTextBaseline} */
    textBaseline: 'middle',
};

/**
 * @param {number} n
 */
const stroke = n => {
    properties.stroke = true;
    properties.strokeStyle = `rgb(${n}), rgb(${n}), rgb(${n})`;
};

/**
 * @param {Array<number>} args
 */
const fill = args => {
    properties.fill = true;
    if (args.length === 1) properties.fillStyle = `rgb(${args[0]}), rgb(${args[0]}), rgb(${args[0]})`;
    else if (args.length === 3) properties.fillStyle = `rgb(${args[0]}), rgb(${args[1]}), rgb(${args[2]})`;
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
 * @param {CanvasRenderingContext2D} c
 * @param {string} t
 * @param {number} x
 * @param {number} y
 */
const text = (c, t, x, y) => {
    c.textAlign = properties.textAlign;
    c.textBaseline = properties.textBaseline;
    c.lineWidth = properties.strokeWeight;
    if (properties.fill) c.fillText(t, x, y);
    if (properties.stroke) c.strokeText(t, x, y);
};

/**
 *
 * @param {CanvasRenderingContext2D} c
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
const rect = (c, x, y, w, h) => {
    c.lineWidth = properties.strokeWeight;
    c.fillStyle = properties.fillStyle;
    c.strokeStyle = properties.strokeStyle;
    c.rect(x, y, w, h);
    if (properties.fill) c.fill();
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
        fill: (...args) => fill(args),
        noFill: () => (properties.fill = false),
        line: (x1, y1, x2, y2) => line(context, x1, y1, x2, y2),
        rect: (x, y, w, h) => rect(context, x, y, w, h),
        clear: () => context.clearRect(0, 0, canvas.width, canvas.height),
        // textMode('') // default: 'center
        text: (txt, x, y) => text(context, txt, x, y),
    };
};
