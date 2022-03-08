/** @type {function} */
let update;

/** @type {function} */
let render;

/** @type {number|undefined} */
let lastTime;
let accumulator = 0;
const timestep = 1 / 60;

/** @param {DOMHighResTimeStamp} millis */
const loop = millis => {
    if (lastTime) {
        update((millis - lastTime) / 1000);
        render();
    }
    lastTime = millis;

    requestAnimationFrame(loop);
};

/** @param {function} script */
const setUpdate = script => {
    update = script;
};

/** @param {function} script */
const setRender = script => {
    render = script;
    loop(0);
};

export default {
    setUpdate: /** @param {function} script */ script => setUpdate(script),
    setRender: /** @param {function} script */ script => setRender(script),
};
