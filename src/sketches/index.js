/** @typedef {import("types/sketches").SketchApi} SketchApi */
/** @typedef {import('types/sketches').DrawApi} DrawApi */
/** @typedef {import('types/sketches').SetupApi} SetupApi */
/** @typedef {import("types/sketches").SketchProperties} SketchProperties */
/** @typedef {(e: DrawApi) => {}} DrawScript */
/** @typedef {(e: SetupApi) => void} SetupScript */

import Draw from './draw';
import Setup from './setup';
import Variables from './variables';

/** @type {Array<{draw: DrawScript, api: DrawApi}>} */
const scripts = [];

/** @type {boolean} */
let running = false;

const loop = () => {
    scripts.forEach(script => script.draw(script.api));
    requestAnimationFrame(loop);
};

/**
 * @param {string} id the id of the canvas element
 * @returns {SketchApi}
 */
export default id => {
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(id));
    const context = canvas.getContext('2d');

    /** @type {SketchProperties} */
    const properties = {};
    const variables = Variables;

    if (!context) throw new Error('Cant get 2d context');

    return {
        get width() {
            return variables.width;
        },
        get height() {
            return variables.height;
        },
        /** @param {SetupScript} script*/
        set setup(script) {
            properties.setup = Setup(canvas);
            script(properties.setup);
        },
        /** @param {DrawScript} script */
        set draw(script) {
            if (!running) {
                running = true;
                loop();
            }
            properties.draw = Draw(canvas, context);
            scripts.push({draw: script, api: properties.draw});
        },
    };
};
