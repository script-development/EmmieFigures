/** @typedef {import("types/sketches").SketchApi} iSketch */

/** @type {Array<Function>} */
const scripts = [];

/** @type {boolean} */
let running = false;

const loop = () => {
    scripts.forEach(script => script());
    requestAnimationFrame(loop);
};

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
 * @param {string} id the id of the canvas element
 * @param {'2d' | 'webgl'} renderer the type of renderer (only '2d' supported for now)
 * @returns {iSketch}
 */
export const Sketch = (id, renderer) => {
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(id));
    const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext(renderer));

    return {
        canvas,
        context,
        /** @param {Function} script */
        set draw(script) {
            console.log('ran');
            if (!running) {
                running = true;
                loop();
            }
            console.log(context);
            scripts.push(script);
        },
        size: (width, height) => canvasSize(canvas, width, height),
        position: position => canvasPosition(canvas, position),
        backgroundColor: color => canvasBackgroundColor(canvas, color),
        border: border => canvasBorder(canvas, border),
    };
};
