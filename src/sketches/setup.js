import Variables from './variables';

const variables = Variables;

/**
 * Set size of the canvas element
 * @param {HTMLCanvasElement} canvas
 * @param {number} width width of the canvas
 * @param {number} height height of the canvas
 */
const canvasSize = (canvas, width, height) => {
    canvas.width = width;
    variables.width = width;
    canvas.height = height;
    variables.height = height;
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} position
 */
const canvasPosition = (canvas, position) => {
    if (position === 'center') {
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
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
 * Setup Properties
 * @param {HTMLCanvasElement} canvas
 * @returns {import("types/sketches").SetupApi}
 */
export default canvas => {
    return {
        size: (width, height) => canvasSize(canvas, width, height),
        position: position => canvasPosition(canvas, position),
        backgroundColor: color => canvasBackgroundColor(canvas, color),
        border: border => canvasBorder(canvas, border),
    };
};
