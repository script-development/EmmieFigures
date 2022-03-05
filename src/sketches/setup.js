/**
 * Set size of the canvas element
 * @param {HTMLCanvasElement} canvas
 * @param {number} width width of the canvas
 * @param {number} height height of the canvas
 */
const canvasSize = (canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} position
 */
const canvasPosition = (canvas, position) => {
    if (position === 'center') {
        // canvas.style.position = 'absolute';
        canvas.style.left = Math.floor((innerWidth - canvas.width) / 2) + 'px';
        canvas.style.top = Math.floor((innerHeight - canvas.height) / 2) + 'px';
    }
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Array<number>} args */
const canvasBackgroundColor = (canvas, ...args) => {
    if (args.length === 1 && typeof args[0] === 'number')
        canvas.style.background = `rgb(${args[0]}, ${args[0]}, ${args[0]})`;
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} border
 */
const canvasBorder = (canvas, border) => {
    canvas.style.border = border;
};

/**
 * @param {CanvasRenderingContext2D} c
 * @param {string} a
 */
const contextFont = (c, a) => {
    const font = c.font.split(' ');
    c.font = `${font[0]} ${a}`;
};

/**
 *
 * @param {CanvasRenderingContext2D} c
 * @param {number} a
 */
const contextSize = (c, a) => {
    const font = c.font.split(' ');
    c.font = `${a}px ${font[1]}`;
};

/**
 * Setup Properties
 * @param {CanvasRenderingContext2D} context
 * @returns {import("types/sketches").SetupApi}
 */
export default context => {
    return {
        size: (width, height) => canvasSize(context.canvas, width, height),
        position: position => canvasPosition(context.canvas, position),
        backgroundColor: color => canvasBackgroundColor(context.canvas, color),
        border: border => canvasBorder(context.canvas, border),
        textFont: type => contextFont(context, type),
        textSize: size => contextSize(context, size),
    };
};
