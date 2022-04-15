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
    if (dataY) {
        stats = [];
        makeStats(dataX, dataY);
        setStatsPosition();
    }
};

/** @param {GraphData} data */
export const setStatsY = data => {
    dataY = data;
    if (dataX) {
        stats = [];
        makeStats(dataX, dataY);
        setStatsPosition();
    }
};

/**
 * Create all statistics objects from x-axis & y-axis data
 * @param {GraphData} dataX
 * @param {GraphData} dataY
 */
const makeStats = (dataX, dataY) => {
    let id = 1;
    dataY.data.forEach(y => {
        const x = dataX.data.find(x => x.date === y.date);
        if (!x) return;
        stats.push(makeStat(x.value, y.value, y.date, id));
        id++;
    });
};

const setStatsPosition = () => {
    const xUnits = elements.xUnits;
    const yUnits = elements.yUnits;
    stats.forEach(stat => {
        stat.pos.x = getPos(xUnits.maxValue, xUnits.minValue, xUnits.startX, xUnits.length, stat.valueX);
        stat.pos.y = getPos(yUnits.maxValue, yUnits.minValue, yUnits.startY, yUnits.length, stat.valueY);
    });
};

/**
 * @param {number} valueX
 * @param {number} valueY
 * @param {string} date
 * @param {number} id
 * @returns {Stat}
 */
const makeStat = (valueX, valueY, date, id) => {
    const color = [0, 100, 0];
    const pos = {x: 0, y: 0};
    const radius = 3;

    return {
        valueX,
        valueY,
        date,
        pos,
        id,
        update: () => update(),
        show: () => show(color, pos, radius),
    };
};

/**
 * @param {number} max
 * @param {number} min
 * @param {number} unitMin
 * @param {number} length
 * @param {number} stat
 */
const getPos = (max, min, unitMin, length, stat) => {
    const range = max - min;
    const leftOver = stat - min;
    const posPercentage = leftOver / range;
    const posLength = posPercentage * length;
    return posLength + unitMin;
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
