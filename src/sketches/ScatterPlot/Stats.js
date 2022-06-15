/**
 * @typedef {import("types/graph").Stat} Stat
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('types/sketches').Sketch} SketchAPI
 * @typedef {import('types/vectors').Vec2D} Vec2D
 */
import engine, {setRender, setUpdate, unsetRender} from 'sketches/engine';
import {ref} from 'vue';
import {elements} from './Graph';
import {linearRegression} from './regression';
import {regressionLoess} from 'd3-regression';
import {Vec2} from 'sketches/vectors';
import {map} from './math-helpers';

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
            for (const stat of stats) update(stat);
        },
    });
    setRender({
        id: 'stats',
        show: () => {
            for (const stat of stats) show(stat);
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

/** @type {{x: number, y: number, dx: number, dy: number, max: number}[]} */
let oldStatsPos;

const setOldStatsPos = () => {
    oldStatsPos.length = 0;
    stats.forEach(s =>
        oldStatsPos.push({
            x: s.pos.x,
            y: s.pos.y,
            dx: 0,
            dy: 0,
            max: Math.random() * 6 + 5,
        }),
    );
};

const statDef = {
    id: 0,
    valueX: 0,
    valueY: 0,
    date: '',
    pos: {x: 0, y: 0},
    vel: {x: 0, y: 0},
    acc: {x: 0, y: 0},
    target: {x: 0, y: 0},
    maxSpeed: 10,
    maxForce: 1,
    seek: true,
    radius: 4,
    color: [0, 100, 0],
};

/**
 * Create all statistics objects from x-axis & y-axis data
 */
const makeStats = () => {
    if (!dataX || !dataY) return;
    statsActive.value
        ? setOldStatsPos()
        : (oldStatsPos = Array.from({length: 256}, () => ({x: ctx.canvas.width / 2, y: -25, dx: 0, dy: 0, max: 10})));
    statsActive.value = false;
    stats.length = 0;
    statDef.id = 1;
    dataY.data.forEach(y => {
        const x = dataX.data.find(x => x.date === y.date);
        if (!x) return;
        statDef.valueX = x.value;
        statDef.valueY = y.value;
        statDef.date = y.date;
        statDef.pos = {x: oldStatsPos[statDef.id - 1].x, y: oldStatsPos[statDef.id - 1].y};
        statDef.vel = {x: oldStatsPos[statDef.id - 1].dx, y: oldStatsPos[statDef.id - 1].dy};
        statDef.maxSpeed = oldStatsPos[statDef.id - 1].max;
        statDef.target = {
            x: getPosX(elements.xUnits, x.value),
            y: getPosY(elements.yUnits, y.value),
        };
        stats.push(Statistic(statDef));
        statDef.id++;
    });
};

/**
 *
 * @param {Stat} stat
 * @returns
 */
const Statistic = ({id, valueX, valueY, date, pos, vel, acc, target, maxSpeed, maxForce, seek, radius, color}) => ({
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
    radius,
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

/** @param {Stat} stat */
const seek = stat => {
    const desired = Vec2.sub(stat.target, stat.pos); // desired velocity
    // Arrive
    const slowRadius = 50;
    const distance = Vec2.dist(stat.pos, stat.target);
    let max = stat.maxSpeed;
    if (distance < slowRadius) {
        if (distance < 0.5) {
            onSpot++;
            stat.seek = false;
            stat.pos.x = stat.target.x;
            stat.pos.y = stat.target.y;
            stat.vel.x = 0;
            stat.vel.y = 0;
            stat.acc.x = 0;
            stat.acc.y = 0;
            // all stats on their spot = set statsActive to true and reset onSpot counter
            if (onSpot === stats.length) {
                statsActive.value = true;
                onSpot = 0;
            }
            return;
        }
        max = map(distance, 0, slowRadius, 0, stat.maxSpeed); // the closer to target pos, the slower
    }
    Vec2.setMag(desired, max); // set maximum desired velocity according to current speed
    const steering = Vec2.sub(desired, stat.vel); // steering velocity = desired - current velocity
    Vec2.limit(steering, stat.maxForce); // apply max steering velocity (less force = slower steering and vica versa)
    applyForce(stat, steering);
};

/**
 *
 * @param {Stat} stat
 * @param {Vec2D} force
 */
const applyForce = (stat, force) => {
    stat.acc.x += force.x;
    stat.acc.y += force.y;
};

/**
 * @param {Stat} stat
 */
const update = stat => {
    if (stat.seek && engine.frameCount() > stat.id / 3 + 100) seek(stat); // throttle start of seek
    // TODO: add deltaTime
    stat.vel.x += stat.acc.x;
    stat.vel.y += stat.acc.y;
    Vec2.limit(stat.vel, stat.maxSpeed);
    stat.pos.x += stat.vel.x;
    stat.pos.y += stat.vel.y;
    stat.acc.x = 0;
    stat.acc.y = 0;
};

/**
 * @param {Stat} stat
 */
const show = stat => {
    ctx.fillStyle = `rgb(${stat.color[0]}, ${stat.color[1]}, ${stat.color[2]})`;
    ctx.beginPath();
    ctx.arc(stat.pos.x, stat.pos.y, stat.radius, 0, Math.PI * 2);
    ctx.fill();
};
