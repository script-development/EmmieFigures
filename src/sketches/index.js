/** @typedef {import("types/sketches").Sketch} SketchAPI */
/** @typedef {import("types/sketches").Globals} GlobalVariables */

import engine from './engine';
import Globals from './Globals';

/**
 * get canvas element and extract context2D
 * @param {string} id
 * @returns {CanvasRenderingContext2D}
 */
const getContext = id => {
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(id));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cant get 2d context');
    return context;
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {GlobalVariables} globals
 * @param {number} width
 * @param {number} height
 */
const setCanvasSize = (canvas, globals, width, height) => {
    canvas.width = width;
    canvas.height = height;
    globals.width = width;
    globals.height = height;
};

/** @param {HTMLCanvasElement} canvas */
const CenterCanvas = canvas => {
    canvas.style.position = 'absolute';
    canvas.style.left = Math.floor((innerWidth - canvas.width) / 2) + 'px';
    canvas.style.top = Math.floor((innerHeight - canvas.height) / 2) + 'px';
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {GlobalVariables} globals
 */
const Mouse = (canvas, globals) => {
    const canvasBoundingClientRect = canvas.getBoundingClientRect();
    canvas.addEventListener('mousemove', evt => {
        globals.mouseX = evt.clientX - canvasBoundingClientRect.left;
        globals.mouseY = evt.clientY - canvasBoundingClientRect.top;
    });
};

/**
 * @param {string} id the id of the canvas element
 * @returns {SketchAPI}
 */
export default id => {
    const context = getContext(id);
    const globals = Globals();
    Mouse(context.canvas, globals);
    setCanvasSize(context.canvas, globals, innerWidth, innerHeight);

    return {
        context,
        globals,
        update: script => engine.setUpdate(script),
        render: script => engine.setRender(script),
        size: (width, height) => setCanvasSize(context.canvas, globals, width, height),
        centerCanvas: () => CenterCanvas(context.canvas),
        mouse: () => Mouse(context.canvas, globals),
    };
};
