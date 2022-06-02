import {paint} from 'sketches/index.js';

/** @type {{id: string, update: function}[]} */
let updates = [];

/** @type {{id: string, show: function}[]} */
const render = [];

// mainloop
let maxFPS = 120;
let step = 1000 / maxFPS;
let delta = 0;
let lastTimestamp = 0;

// start/stop
let requestID = 0;
let running = false;
let started = false;

// logs
let updateCount = 0; // panic counter
let totalUpdates = 0;
let totalFrames = 0;
let returns = 0;

// calculate FPS
let actualFPS = 0;
let lastFPSUpdate = 0;
let framesThisSecond = 0;

/** @param {DOMHighResTimeStamp} timestamp */
const mainLoop = timestamp => {
    requestID = requestAnimationFrame(mainLoop);
    // throttle FPS
    if (timestamp < lastTimestamp + 1000 / maxFPS) {
        returns++;
        return;
    }
    delta += timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    calculateFPS(timestamp);
    simulate();

    paint.interpolate = delta / step;
    for (let i = 0; i < render.length; i++) render[i].show(paint);
    // console.log(timestamp);
    // if (timestamp > 5000) stop();
};

const simulate = () => {
    updateCount = 0;
    while (delta >= step) {
        totalUpdates++;
        for (let i = 0; i < updates.length; i++) updates[i].update(step); // initial render
        delta -= step;
        // spiral of death prevention
        if (++updateCount >= 240) {
            delta = 0;
            break;
        }
    }
};

/** @param {DOMHighResTimeStamp} timestamp */
const calculateFPS = timestamp => {
    if (timestamp > lastFPSUpdate + 100) {
        actualFPS = 0.25 * framesThisSecond + (1 - 0.25) * actualFPS;
        lastFPSUpdate = timestamp;
        framesThisSecond = 0;
    }
    framesThisSecond++;
    totalFrames++;
};

const start = () => {
    if (!started) {
        started = true; // prevent requesting multiple frames
        requestID = requestAnimationFrame(timestamp => {
            for (let i = 0; i < render.length; i++) render[i].show(paint); // initial render
            running = true;
            lastTimestamp = timestamp;
            lastFPSUpdate = timestamp;
            framesThisSecond = 0;

            requestID = requestAnimationFrame(mainLoop);
        });
    }
};

const stop = () => {
    running = false;
    started = false;
    cancelAnimationFrame(requestID);
};

/**
 * @param {{id: string, show: function}} obj
 * @returns {number} the length of the render array
 */
export const setRender = obj => render.push(obj);

/** @param {string} id */
export const unsetRender = id => {
    const index = render.findIndex(obj => obj.id === id);
    if (index != -1) render.splice(index, 1);
};

/**
 * @param {{id: string, update: function}} obj
 * @returns {number} the length of the render array
 */
export const setUpdate = obj => updates.push(obj);

/** @param {string} id */
export const unsetUpdate = id => {
    const index = updates.findIndex(obj => obj.id === id);
    if (index != -1) updates.splice(index, 1);
};

export default {
    start: () => start(),
    stop: () => stop(),
    running: () => running,
    frameCount: () => totalFrames,
    updateCount: () => totalUpdates,
    returnCount: () => returns,
    /** @param {number} [fps] */
    frameRate: fps => frameRate(fps),
};

/** @param {number} [fps] */
const frameRate = fps => {
    if (fps != undefined) {
        maxFPS = fps;
        step = 1000 / fps;
        return;
    }
    return (actualFPS * 10).toFixed(0);
};
