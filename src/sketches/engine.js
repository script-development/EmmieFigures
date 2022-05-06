import {paint} from 'sketches/index.js';

/** @type {{update: function}[]} */
let updates = [];

/** @type {{show: function}[]} */
export const render = [];

// mainloop
let maxFPS = 120;
let step = 1000 / maxFPS;
let delta = 0;
let lastTimeStamp = 0;

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

/** @param {DOMHighResTimeStamp} timeStamp */
const mainLoop = timeStamp => {
    requestID = requestAnimationFrame(mainLoop);
    // throttle FPS
    if (timeStamp < lastTimeStamp + 1000 / maxFPS) {
        returns++;
        return;
    }
    delta += timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    calculateFPS(timeStamp);
    simulate();

    paint.interpolate = delta / step;
    for (let i = 0; i < render.length; i++) render[i].show(paint);
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

/** @param {DOMHighResTimeStamp} timeStamp */
const calculateFPS = timeStamp => {
    if (timeStamp > lastFPSUpdate + 100) {
        actualFPS = 0.25 * framesThisSecond + (1 - 0.25) * actualFPS;
        lastFPSUpdate = timeStamp;
        framesThisSecond = 0;
    }
    framesThisSecond++;
    totalFrames++;
};

const start = () => {
    if (!started) {
        started = true; // prevent requesting multiple frames
        requestID = requestAnimationFrame(timeStamp => {
            for (let i = 0; i < render.length; i++) render[i].show(paint); // initial render
            running = true;
            lastTimeStamp = timeStamp;
            lastFPSUpdate = timeStamp;
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

/** @param {{id: string, show: function}} obj */
export const setRender = obj => render.push(obj);

/** @param {{update: function}} obj */
export const setUpdate = obj => updates.push(obj);

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
