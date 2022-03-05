/** @typedef {import("types/sketches").Sketch} SketchApi */

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

/** @param {HTMLCanvasElement} canvas */
const CenterCanvas = canvas => {
    canvas.style.position = 'absolute';
    canvas.style.left = Math.floor((innerWidth - canvas.width) / 2) + 'px';
    canvas.style.top = Math.floor((innerHeight - canvas.height) / 2) + 'px';
};

/** @param {HTMLCanvasElement} canvas */
const Mouse = canvas => {
    const pos = {x: 0, y: 0};
    const canvasBoundingClientRect = canvas.getBoundingClientRect();
    canvas.addEventListener('mousemove', evt => {
        pos.x = evt.clientX - canvasBoundingClientRect.left;
        pos.y = evt.clientY - canvasBoundingClientRect.top;
    });
    return {
        get x() {
            return pos.x;
        },
        get y() {
            return pos.y;
        },
    };
};

/**
 * @param {string} id the id of the canvas element
 * @returns
 */
export default id => {
    const context = getContext(id);
    const centerCanvas = () => CenterCanvas(context.canvas);
    const mouse = () => Mouse(context.canvas);

    return {
        context,
        centerCanvas,
        mouse,
    };
};
