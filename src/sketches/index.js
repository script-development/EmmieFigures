/** @typedef {import("types/sketches").SketchApi} SketchApi */
/** @typedef {import('types/sketches').DrawApi} DrawApi */
/** @typedef {import('types/sketches').SetupApi} SetupApi */
/** @typedef {import("types/sketches").SketchProperties} SketchProperties */
/** @typedef {(e: DrawApi) => {}} DrawScript */
/** @typedef {(e: SetupApi) => void} SetupScript */

import Draw from './draw';
import Setup from './setup';

/** @type {Array<{draw: DrawScript, api: DrawApi}>} */
const scripts = [];

/** @type {boolean} */
let active = true;
let requestId = 0;

const loop = () => {
    scripts.forEach(script => script.draw(script.api));
    requestId = requestAnimationFrame(loop);
    if (!active) cancelAnimationFrame(requestId);
};

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
 * @param {string} id the id of the canvas element
 * @returns {SketchApi}
 */
export default id => {
    const context = getContext(id);

    /** @type {SketchProperties} */
    const properties = {};

    return {
        context,
        /** @param {SetupScript} script*/
        set setup(script) {
            properties.setup = Setup(context);
            script(properties.setup);
        },
        /** @param {DrawScript} script */
        set draw(script) {
            properties.draw = Draw(context);
            scripts.push({draw: script, api: properties.draw});
            loop();
        },
        loop: () => (active = true),
        noLoop: () => (active = false),
    };
};
