import engine from './engine';
import globals from './globals';

/**
 * Make a new Sketch API for a canvas element
 * @param {string} id the id of the canvas element
 * @returns {import('types/sketches').Sketch}
 */
export default id => {
    const context = getContext(id);

    return {
        context,
        update: script => engine.setUpdate(script),
        render: script => engine.setRender(script),
        mouse: () => Mouse(context.canvas),
        onResize: script => onResize(context.canvas, script),
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
 * Create a new mouse event listener and set mouse globals for a canvas element
 * @param {HTMLCanvasElement} canvas
 * @returns {import('types/sketches').Globals["mouse"]}
 */
const Mouse = canvas => {
    canvas.addEventListener('mousemove', evt => {
        globals.mouse.x = evt.clientX - globals.canvas.left;
        globals.mouse.y = evt.clientY - globals.canvas.top;
    });

    return globals.mouse;
};

/** @type {MediaQueryList} */
let mql1;
/** @type {MediaQueryList} */
let mql2;

/**
 * set responsive global width and height for canvas
 * @param {HTMLCanvasElement} canvas
 * @param {() => void} script
 */
const onResize = (canvas, script) => {
    mql1 = window.matchMedia('(max-width: 639px)');
    mql2 = window.matchMedia('(max-width: 1007px) and (min-width: 640px');
    mql1.addEventListener('change', handleMql.bind(null, [canvas, script]));
    mql2.addEventListener('change', handleMql.bind(null, [canvas, script]));
    handleMql(null);
    handleMql(null);
    resize(canvas); // canvas size and global values initiation
};

/** @param {Array<HTMLCanvasElement|function>|null} args */
const handleMql = args => {
    setBreakPoint();
    if (args && args[0] instanceof HTMLCanvasElement && typeof args[1] === 'function') resize(args[0], args[1]);
};

const setBreakPoint = () => {
    if (mql1.matches) globals.breakpoint = 'sm';
    else if (mql2.matches) globals.breakpoint = 'md';
    else globals.breakpoint = 'lg';
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {function} [script]
 */
const resize = (canvas, script) => {
    let width = innerWidth;
    let height = (width * 9) / 16;
    if (globals.breakpoint === 'md') {
        width = 640;
        height = (width * 9) / 16;
    } else if (globals.breakpoint === 'lg') {
        width = 1008;
        height = (width * 9) / 16;
    }
    canvas.width = width;
    canvas.height = height;
    globals.canvas.width = width;
    globals.canvas.height = height;
    const rect = canvas.getBoundingClientRect();
    globals.canvas.left = rect.left;
    globals.canvas.top = rect.top;
    if (script) script();
};
