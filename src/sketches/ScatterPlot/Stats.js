/**
 * @typedef {import("types/graph").Stat} Stat
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('types/sketches').Sketch} SketchAPI
 */
import engine, {setRender, setUpdate, unsetRender} from 'sketches/engine';
import {ref} from 'vue';
import {elements} from './Graph';
import {linearRegression} from './regression';
import {regressionLoess} from 'd3-regression';
import {Vec2} from 'sketches/vectors';

/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {Array<Stat>} */
const stats = [];

/** @type {import('@vue/runtime-core').Ref<boolean>} */
export const statsActive = ref(false);

/** @type {GraphData} */
let dataX;

/** @type {GraphData} */
let dataY;

/**
 * Create Statistic objects from x & y-axis data
 * @param {SketchAPI} sketch
 */
export const createStats = sketch => {
    ctx = sketch.context;
    setUpdate({
        id: 'stats',
        update: () => {
            for (const stat of stats) stat.update(stat);
        },
    });
    setRender({
        id: 'stats',
        show: () => {
            for (const stat of stats) stat.show();
        },
    });
};

/** @param {GraphData} data */
export const setStatsX = data => {
    dataX = data;
    makeStats();
};

/** @param {GraphData} data */
export const setStatsY = data => {
    dataY = data;
    makeStats();
};

const getLinearRegressionData = () => {
    /** @type {Array<{x: number, y: number}>} */
    const data = [];
    stats.forEach(stat => data.push({x: stat.valueX, y: stat.valueY}));
    return data;
};

/** @param {import('types/sketches').Paint} paint */
const showRegression = paint => paint.line(regressionElement);

/** @type {import('types/graph').GraphLineElement} */
const regressionElement = {
    pos: {x1: 0, y1: 0, x2: 0, y2: 0},
    color: 'red',
    weight: 2,
    paint: 'line',
};

const showLinearRegression = () => {
    regressionElement.pos.x1 = elements.x.pos.x1;
    regressionElement.pos.x2 = elements.x.pos.x2;
    const data = getLinearRegressionData();
    const regression = linearRegression(data);
    const yValue1 = regression(elements.xUnits.min);
    const yValue2 = regression(elements.xUnits.max);
    regressionElement.pos.y1 = getPosY(elements.yUnits, yValue1);
    regressionElement.pos.y2 = getPosY(elements.yUnits, yValue2);
    setRender({
        id: 'linear-regression',
        show: showRegression,
    });
};

let bandwidth = 0.3; // [default] smoothing parameter

const showLoessRegression = () => {
    const regressionGenerator = regressionLoess()
        // @ts-ignore
        .x(d => d.valueX)
        // @ts-ignore
        .y(d => d.valueY)
        .bandwidth(bandwidth);
    const lines = regressionGenerator(stats);
    /** @type {import('types/graph').GraphLineElement[]} */
    const linesConverted = [];
    for (let i = 0; i < lines.length - 1; i++) {
        linesConverted.push({
            pos: {
                x1: getPosX(elements.xUnits, lines[i][0]),
                y1: getPosY(elements.yUnits, lines[i][1]),
                x2: getPosX(elements.xUnits, lines[i + 1][0]),
                y2: getPosY(elements.yUnits, lines[i + 1][1]),
            },
            color: 'orange',
            weight: 2,
            paint: 'line',
        });
    }

    setRender({
        id: 'loess-regression',
        /** @param {import('types/sketches').Paint} paint */
        show: paint => linesConverted.forEach(el => paint.line(el)),
    });
};

/** @type {HTMLElement} */
let span;

/** @type {HTMLInputElement} */
let slider;

/**
 * @param {"linear-regression"|"loess-regression"|"none"} newKey
 * @param {"linear-regression"|"loess-regression"|"none"} oldKey
 */
export const changeRegression = (newKey, oldKey) => {
    if (oldKey != 'none') {
        if (oldKey === 'loess-regression') {
            // remove slider and reset bandwidth
            document.body.removeChild(span);
            document.body.removeChild(slider);
            // optional: remove to keep value after selection changes or make it an option
            bandwidth = 0.3;
        }
        unsetRender(oldKey);
    }
    if (newKey != 'none') setRegression(newKey);
};

/** @param {"linear-regression"|"loess-regression"} type */
const setRegression = type => {
    if (type === 'linear-regression') showLinearRegression();
    if (type === 'loess-regression') {
        showLoessRegression();

        // create slider
        span = document.createElement('span');
        slider = document.createElement('input');
        Object.assign(slider, {
            type: 'range',
            min: 0,
            max: 1,
            step: 0.01,
            class: 'slider',
            id: 'myRange',
        });
        slider.value = '0.3';
        slider.className = 'absolute bottom-22 mb-24 xl:w-96 z-1';
        span.innerHTML = `bandwidth: ${slider.value}`;
        span.className = 'absolute bottom-18 mb-24 xl:w-96 z-1';
        slider.addEventListener('input', evt => {
            const target = /** @type {HTMLInputElement} */ (evt.target);
            span.innerHTML = `bandwidth: ${target.value}`;
            bandwidth = parseFloat(target.value);
            unsetRender('loess-regression');
            showLoessRegression();
        });
        document.body.appendChild(slider);
        document.body.appendChild(span);
    }
};

// @ts-ignore
let oldStatsPos;

const setOldStatsPos = () => {
    oldStatsPos.length = 0;
    stats.forEach(s =>
        // oldStatsPos.push({
        //     x: s.pos.x,
        //     y: s.pos.y,
        //     dx: Math.random() * 5,
        //     dy: Math.random() * 5,
        //     max: Math.random() * 8 + 2,
        // }),
        oldStatsPos.push({
            x: s.pos.x,
            y: s.pos.y,
            dx: Math.random() * 6 - 3,
            dy: Math.random() * 6 - 3,
            max: Math.random() * 5 + 2,
        }),
    );
};

/**
 * Create all statistics objects from x-axis & y-axis data
 */
const makeStats = () => {
    if (!dataX || !dataY) return;
    if (statsActive.value === true) setOldStatsPos();
    else {
        oldStatsPos = Array.from({length: 256}, () => ({x: 1300 / 2, y: 25, dx: 0, dy: 0, max: 5}));
    }
    statsActive.value = false;
    stats.length = 0;
    let id = 1;
    dataY.data.forEach(y => {
        const x = dataX.data.find(x => x.date === y.date);
        if (!x) return;
        const acc = {x: 0, y: 0};
        const vel = {x: oldStatsPos[id - 1].dx, y: oldStatsPos[id - 1].dy};
        const pos = {x: oldStatsPos[id - 1].x, y: oldStatsPos[id - 1].y};
        let maxSpeed = oldStatsPos[id - 1].max;
        let maxForce = 0.3;
        const target = {
            x: getPosX(elements.xUnits, x.value),
            y: getPosY(elements.yUnits, y.value),
        };
        let seek = true;
        stats.push(
            Statistic(seek, pos, vel, acc, maxSpeed, maxForce, target, x.value, y.value, y.date, id, [0, 100, 0], 4),
        );
        id++;
    });
};

/**
 * @param {boolean} seek
 * @param {{x: number, y: number}} pos
 * @param {{x: number, y: number}} vel
 * @param {{x: number, y: number}} acc
 * @param {number} maxSpeed
 * @param {number} maxForce
 * @param {{x: number, y: number}} target
 * @param {number} valueX
 * @param {number} valueY
 * @param {string} date
 * @param {number} id
 * @param {[number, number, number]} color
 * @param {number} radius
 * @returns {Stat}
 */
const Statistic = (seek, pos, vel, acc, maxSpeed, maxForce, target, valueX, valueY, date, id, color, radius) => ({
    valueX,
    valueY,
    date,
    target,
    pos,
    vel,
    acc,
    id,
    seek,
    color,
    maxSpeed,
    maxForce,
    update: stat => update(stat),
    show: () => show(color, pos, radius),
    applyForce: force => {
        acc.x += force.x;
        acc.y += force.y;
    },
});

/**
 * @param {import('types/graph').GraphUnitsElement} unitsElement
 * @param {number} statValue
 */
const getPosX = (unitsElement, statValue) => {
    const range = unitsElement.max - unitsElement.min;
    const leftOver = statValue - unitsElement.min;
    const posPercentage = leftOver / range;
    const posLength = posPercentage * unitsElement.lengthX;
    return posLength + unitsElement.startX;
};

/**
 * @param {import('types/graph').GraphUnitsElement} unitsElement
 * @param {number} statValue
 */
const getPosY = (unitsElement, statValue) => {
    const range = unitsElement.max - unitsElement.min;
    const leftOver = statValue - unitsElement.min;
    const posPercentage = leftOver / range;
    const posLength = posPercentage * unitsElement.lengthY;
    return posLength + unitsElement.startY;
};

let onSpot = 0;
const constrain = (n, low, high) => {
    return Math.max(Math.min(n, high), low);
};
const map = (n, start1, stop1, start2, stop2, withinBounds) => {
    const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
};

/** @param {Stat} stat */
const seek = stat => {
    const desired = Vec2.sub(stat.target, stat.pos);

    // Arrive
    const r = 200;
    const dist = Vec2.dist(stat.pos, stat.target);
    if (dist < 0.5) {
        onSpot++;
        stat.seek = false;
        // stat.color[0] = 100;
        stat.pos.x = stat.target.x;
        stat.pos.y = stat.target.y;
        stat.vel.x = 0;
        stat.vel.y = 0;
        stat.acc.x = 0;
        stat.acc.y = 0;
        if (onSpot === stats.length) {
            statsActive.value = true;
            onSpot = 0;
        }
        return;
    }
    if (dist < r) {
        const m = map(dist, 0, r, 0, stat.maxSpeed);
        Vec2.setMag(desired, m);
    } else Vec2.setMag(desired, stat.maxSpeed);
    const steering = Vec2.sub(desired, stat.vel);
    Vec2.limit(steering, stat.maxForce);
    stat.applyForce(steering);
};

/**
 * @param {Stat} stat
 */
const update = stat => {
    if (stat.seek && engine.frameCount() > stat.id / 3 + 100) seek(stat);

    stat.vel.x += stat.acc.x;
    stat.vel.y += stat.acc.y;
    Vec2.limit(stat.vel, stat.maxSpeed);
    stat.pos.x += stat.vel.x;
    stat.pos.y += stat.vel.y;
    stat.acc.x = 0;
    stat.acc.y = 0;
};

/**
 * @param {Array<number>} color
 * @param {{x: number, y: number}} pos
 * @param {number} radius
 */
const show = (color, pos, radius) => {
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
};
