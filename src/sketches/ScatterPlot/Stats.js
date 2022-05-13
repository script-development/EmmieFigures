/**
 * @typedef {import("types/graph").Stat} Stat
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('types/sketches').Sketch} SketchAPI
 */
import {setRender, unsetRender} from 'sketches/engine';
import {ref} from 'vue';
import {elements} from './Graph';
import {linearRegression} from './regression';
import {regressionLoess} from 'd3-regression';

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
    regressionElement.pos.y1 = getPos(
        elements.yUnits.max,
        elements.yUnits.min,
        elements.yUnits.startY,
        elements.yUnits.lengthY,
        yValue1,
    );
    regressionElement.pos.y2 = getPos(
        elements.yUnits.max,
        elements.yUnits.min,
        elements.yUnits.startY,
        elements.yUnits.lengthY,
        yValue2,
    );
    setRender({
        id: 'linear-regression',
        show: showRegression,
    });
};

const showLoessRegression = () => {
    const regressionGenerator = regressionLoess()
        .x(d => d.valueX)
        .y(d => d.valueY);
    const line = regressionGenerator(stats);
    line.forEach((el, index) => {
        if (!(index & 1)) {
            // careful is data = uneven length (for now they are all 256 in length)
            // console.log(index);
            // const newEl = {...regressionElement};
            // regressionElement.pos.x1 = getPos(100, 0, 170, 940, el[0]);
            // regressionElement.pos.y1 = getPos(100, 20, 550, -380, el[1]);
            // regressionElement.pos.x2 = getPos
        }
    });
};

/**
 * @param {"linear-regression"|"loess-regression"|"none"} newKey
 * @param {"linear-regression"|"loess-regression"|"none"} oldKey
 */
export const changeRegression = (newKey, oldKey) => {
    if (oldKey != 'none') unsetRender(oldKey);
    if (newKey != 'none') setRegression(newKey);
};

/** @param {"linear-regression"|"loess-regression"} type */
const setRegression = type => {
    if (type === 'linear-regression') showLinearRegression();
    if (type === 'loess-regression') showLoessRegression();
};

/**
 * Create all statistics objects from x-axis & y-axis data
 */
const makeStats = () => {
    if (!dataX || !dataY) return;
    stats.length = 0;
    let id = 1;
    // color and radius hardcoded for the moment
    const color = [0, 100, 0];
    const radius = 4;
    dataY.data.forEach(y => {
        const x = dataX.data.find(x => x.date === y.date);
        if (!x) return;
        const pos = {
            x: getPos(
                elements.xUnits.max,
                elements.xUnits.min,
                elements.xUnits.startX,
                elements.xUnits.lengthX,
                x.value,
            ),
            y: getPos(
                elements.yUnits.max,
                elements.yUnits.min,
                elements.yUnits.startY,
                elements.yUnits.lengthY,
                y.value,
            ),
        };
        stats.push(Statistic(pos, x.value, y.value, y.date, id, color, radius));
        id++;
    });
    statsActive.value = true;
};

/**
 * @param {{x: number, y: number}} pos
 * @param {number} valueX
 * @param {number} valueY
 * @param {string} date
 * @param {number} id
 * @param {Array<number>} color
 * @param {number} radius
 * @returns {Stat}
 */
const Statistic = (pos, valueX, valueY, date, id, color, radius) => ({
    valueX,
    valueY,
    date,
    pos,
    id,
    update: () => update(),
    show: () => show(color, pos, radius),
});

/**
 * @param {number} max
 * @param {number} min
 * @param {number} start
 * @param {number} length
 * @param {number} statValue
 */
const getPos = (max, min, start, length, statValue) => {
    const range = max - min;
    const leftOver = statValue - min;
    const posPercentage = leftOver / range;
    const posLength = posPercentage * length;
    return posLength + start;
};

const update = () => {};

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
