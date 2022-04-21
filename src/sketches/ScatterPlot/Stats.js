/**
 * @typedef {import("types/graph").Stat} Stat
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('types/sketches').Sketch} SketchAPI
 */
import {elements} from './Graph';

/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {Array<Stat>} */
let stats = [];

/** @type {GraphData} */
let dataX;

/** @type {GraphData} */
let dataY;

/**
 * Create Statistic objects from x & y-axis data
 * @param {SketchAPI} sketch
 * @returns
 */
export const Stats = sketch => {
    ctx = sketch.context;
    return {
        update: () => {
            for (const stat of stats) stat.update();
        },
        show: () => {
            for (const stat of stats) stat.show();
        },
    };
};

/** @param {GraphData} data */
export const setStatsX = data => {
    dataX = data;
    if (dataY) makeStats(dataX, dataY);
};

/** @param {GraphData} data */
export const setStatsY = data => {
    dataY = data;
    if (dataX) makeStats(dataX, dataY);
};

/**
 * Create all statistics objects from x-axis & y-axis data
 * @param {GraphData} dataX
 * @param {GraphData} dataY
 */
const makeStats = (dataX, dataY) => {
    stats = [];
    let id = 1;
    dataY.data.forEach(y => {
        const x = dataX.data.find(x => x.date === y.date);
        if (!x) return;
        const pos = {x: getPos(elements.xUnits, x.value), y: getPos(elements.yUnits, y.value)};
        stats.push(Statistic(pos, x.value, y.value, y.date, id));
        id++;
    });
};

/**
 * @param {{x: number, y: number}} pos
 * @param {number} valueX
 * @param {number} valueY
 * @param {string} date
 * @param {number} id
 * @returns {Stat}
 */
const Statistic = (pos, valueX, valueY, date, id) => ({
    // color and radius hardcoded for the moment
    valueX,
    valueY,
    date,
    pos,
    id,
    update: () => update(),
    show: () => show([0, 100, 0], pos, 3),
});

/**
 * @param {{}} units
 * @param {number} statValue
 */
const getPos = ({max, min, start, length}, statValue) => {
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
