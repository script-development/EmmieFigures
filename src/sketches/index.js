/** @typedef {import('types/sketches').SketchOptions} SketchOptions */
/** @typedef {import('types/sketches').Sketch} Sketch */

import Paint from './paint';
import engine from './engine';
import Grid from './grid';
import {setRender} from './engine';
import {store} from 'services/store';
import {Mouse} from './input';

/**
 * Make a new Sketch API for a canvas element
 * @param {string} id the id of the canvas element
 * @param {SketchOptions} [options]
 * @returns {void}
 */
export default (id, options) => {
    const properties = {};
    properties['context'] = getContext(id);
    properties['paint'] = Paint(properties.context);
    if (options) {
        setOptions(options, properties.context.canvas);
        if (options.clear) setClear(properties.paint);
        if (options.run) engine.run();
        if (options.grid) properties['grid'] = Grid(properties.context, properties.paint);
    }
    properties['run'] = () => engine.run();
    properties['halt'] = () => engine.halt();
    properties['mouse'] = () => Mouse(properties.context);
    sketchToStore(properties);
};

const sketchToStore = /** @param {import('types/sketches').Sketch} sketch */ sketch => {
    store.sketch = {
        width: sketch.context.canvas.width,
        height: sketch.context.canvas.height,
        context: sketch.context,
        paint: sketch.paint,
        run: sketch.run,
        halt: sketch.halt,
        mouse: sketch.mouse,
    };
};

/**
 * get canvas element and extract context2D
 * @param {string} id canvas element id
 * @returns {CanvasRenderingContext2D}
 */
const getContext = id => {
    const canvas = document.getElementById(id);
    if (canvas === null) throw new Error(`HTMLCanvasElement with id ${id} not found`);
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error(`HTMLElement with id ${id} is not a canvas`);

    const context = canvas.getContext('2d');
    if (!context) throw new Error(`CanvasRenderingContext2D not found on HTMLCanvasElement with id ${id}`);

    return context;
};

/**
 * @param {SketchOptions} options
 * @param {HTMLCanvasElement} canvas
 */
const setOptions = (options, canvas) => {
    setXYWH(options, canvas);
    if (options.size) setSize(options.size, canvas);
    if (options.pos) setPos(options.pos, canvas);
    if (options.border) canvas.style.border = '1px solid black';
};

/**
 * @param {SketchOptions} options
 * @param {HTMLCanvasElement} canvas
 */
const setXYWH = ({x, y, w, h}, canvas) => {
    if (x) canvas.style.left = x + 'px';
    if (y) canvas.style.height = y + 'px';
    if (w) canvas.width = w;
    if (h) canvas.height = h;
};

/**
 * @param {SketchOptions["size"]} size
 * @param {HTMLCanvasElement} canvas
 */
const setSize = (size, canvas) => {
    if (size === 'full') {
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
};

/**
 * @param {SketchOptions["pos"]} pos
 * @param {HTMLCanvasElement} canvas
 */
const setPos = (pos, canvas) => {
    if (pos === 'absolute') canvas.style.position = 'absolute';
    if (pos === 'center') {
        canvas.style.position = 'absolute';
        canvas.style.left = (innerWidth - canvas.width) / 2 + 'px';
        canvas.style.top = (innerHeight - canvas.height) / 2 + 'px';
    }
};

/**
 * This must always be the first render in the engine (sketch has to be made before anything else)
 * @param {import('types/paint').Paint} paint
 */
const setClear = paint => {
    setRender(
        {
            id: 'clear',
            show: () => paint.clear(),
        },
        0,
    );
};
