/**
 * @typedef {import("types/graph").Stat} Stat
 * @typedef {import('types/graph').GraphData} GraphData
 * @typedef {import('types/sketches').Sketch} SketchAPI
 */
import {ref} from 'vue';
import {elements} from './Graph';

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

export const getLinearRegressionData = () => {
    /** @type {Array<{x: number, y: number}>} */
    const data = [];
    stats.forEach(stat => data.push({x: stat.pos.x, y: stat.pos.y}));
    return data;
};

/**
 * Create all statistics objects from x-axis & y-axis data
 * @param {GraphData} dataX
 * @param {GraphData} dataY
 */
const makeStats = (dataX, dataY) => {
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
