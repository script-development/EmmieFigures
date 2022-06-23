/** @typedef {import('types/sketches').SketchOptions} SketchOptions */

import Paint from './paint';
import engine from './engine';
import Grid from './grid';
import {setRender} from './engine';

const setOption = {
    /**
     * @param {string} value
     * @param {HTMLCanvasElement} canvas
     */
    pos: (value, canvas) => setPos(value, canvas),
    /**
     * @param {string} value
     * @param {HTMLCanvasElement} canvas
     */
    size: (value, canvas) => setSize(value, canvas),
    /**
     * @param {string} value
     * @param {HTMLCanvasElement} canvas
     */
    bg: (value, canvas) => (canvas.style.backgroundColor = value),
    /**
     * @param {boolean} value
     */
    clear: value => (value ? setClear() : ''),
};

/**
 * Make a new Sketch API for a canvas element
 * @param {string} id the id of the canvas element
 * @param {SketchOptions} [options]
 * @returns {import('types/sketches').Sketch}
 */
export default (id, options) => {
    const context = getContext(id);
    if (options) {
        setXYWH(options, context.canvas);
        // @ts-ignore
        Object.keys(options).forEach(option => setOption[option](options[option], context.canvas));
    }
    const grid = Grid(context);
    const p = Paint(context);
    // @ts-ignore
    Object.keys(p).forEach(key => (paint[key] = p[key]));
    return {
        context,
        grid,
        start: () => engine.start(),
        stop: () => engine.stop(),
    };
};

export const paint = {
    interpolate: 0,
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
const setXYWH = (options, canvas) => {
    if (options.x) {
        canvas.style.left = options.x + 'px';
        delete options.x;
    }
    if (options.y) {
        canvas.style.top = options.y + 'px';
        delete options.y;
    }
    if (options.w) {
        canvas.width = options.w;
        delete options.w;
    }
    if (options.h) {
        canvas.height = options.h;
        delete options.h;
    }
};

/**
 * @param {string} size
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
 * @param {string} pos
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
 */
const setClear = () => {
    setRender({
        id: 'clear',
        /** @param {import('types/sketches').Paint} paint */
        show: paint => paint.clear(),
    });
};
