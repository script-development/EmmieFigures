/** @type {function} */
let update;

/** @type {function} */
let render;

// mainloop
const maxFPS = 120;
const step = 1000 / (maxFPS * 2); // factor(2) = amount of update tries per frame
let delta = 0;
let lastTimeStamp = 0;

// start/stop
let requestID = 0;
let active = false; // eslint-disable-line
let started = false;

// logs
let updateCount = 0;
let totalUpdates = 0;
let totalFrames = 0;
let returns = 0;

// calculate FPS
let actualFPS = 0;
let lastFPSUpdate = 0;
let framesThisSecond = 0;

/** @param {DOMHighResTimeStamp} timeStamp */
const mainLoop = timeStamp => {
    if (timeStamp < lastTimeStamp + 1000 / maxFPS) {
        requestID = requestAnimationFrame(mainLoop);
        returns++;
        return;
    }
    delta += timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    calculateFPS(timeStamp);
    simulate();
    render(delta / step);

    requestID = requestAnimationFrame(mainLoop);
    console.log(totalFrames, totalUpdates, returns, (actualFPS * 10).toFixed(0)); // eslint-disable-line
};

const simulate = () => {
    updateCount = 0;
    while (delta >= step) {
        totalUpdates++;
        update(step);
        delta -= step;
        if (++updateCount >= 240) {
            console.log('preventing spiral of death'); // eslint-disable-line
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
            render(); // initial render
            active = true;

            lastTimeStamp = timeStamp;
            lastFPSUpdate = timeStamp;
            framesThisSecond = 0;

            requestID = requestAnimationFrame(mainLoop);
        });
    }
};

const stop = () => {
    active = false;
    started = false;
    cancelAnimationFrame(requestID);
};

/** @param {function} script */
const setUpdate = script => {
    update = script;
};

/** @param {function} script */
const setRender = script => {
    render = script;
    start();
};

export default {
    setUpdate: /** @param {function} script */ script => setUpdate(script),
    setRender: /** @param {function} script */ script => setRender(script),
    start: () => start(),
    stop: () => stop(),
};
