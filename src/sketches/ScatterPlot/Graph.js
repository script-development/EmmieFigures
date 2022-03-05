/** @typedef {import('types/graph').Precipitation} Precipitation */
/** @typedef {import('types/graph').Presence} Presence */
/** @typedef {import('types/graph').Stat} Stat */
/** @typedef {{x1: number, y1: number, x2: number, y2: number}} vec4 */

/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {number} canvas width */
let width;

/** @type {number} canvas height */
let height;

/**
 * Create x-Axis
 * @param {vec4} position
 * @returns {{show: function}}
 */
const xAxis = position => {
    const pos = position;
    const show = () => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pos.x1, pos.y1);
        ctx.lineTo(pos.x2, pos.y2);
        ctx.stroke();
    };
    return {show};
};

/**
 * Create x-Axis
 * @param {vec4} position
 * @returns {{show: function}}
 */
const yAxis = position => {
    const pos = position;
    const show = () => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pos.x1, pos.y1);
        ctx.lineTo(pos.x2, pos.y2);
        ctx.stroke();
    };
    return {show};
};

/**
 * Create x-Axis
 * @param {vec4} position
 * @param {string} title
 * @returns {{show: function}}
 */
const xAxisTitle = (position, title) => {
    const pos = position;
    const show = () => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.font = '24px georgia';
        ctx.fillText(title, pos.x1 + (pos.x2 - pos.x1) / 2 - 50, pos.y1 + 60);
    };
    return {show};
};

/**
 * Create x-Axis
 * @param {vec4} position
 * @param {string} title
 * @returns {{show: function}}
 */
const yAxisTitle = (position, title) => {
    const pos = position;
    const show = () => {
        ctx.fillStyle = 'black';
        ctx.font = '24px georgia';
        ctx.save();
        ctx.translate(pos.x1 - 100, pos.y1 + (pos.y2 - pos.y1) / 2 + 70);
        ctx.rotate(-Math.PI / 2);
        ctx.beginPath();
        ctx.fillText(title, 0, 0);
        ctx.restore();
    };
    return {show};
};

/**
 * @param {Array<Presence>} presence
 * @param {vec4} position
 */
const xAxisUnits = (presence, position) => {
    const pos = position;
    const max = presence.reduce((a, {percentage}) => Math.max(a, percentage), 0);
    const min = presence.reduce((a, {percentage}) => Math.min(a, percentage), max);
    const steps = 10;
    const unitMin = pos.x1 + 10;
    const unitMax = pos.x2 - 10;
    const length = unitMax - unitMin;
    const show = () => {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;
        for (let i = 0; i <= steps; i++) {
            let xP = unitMin + (length / steps) * i;
            ctx.beginPath();
            ctx.moveTo(xP, pos.y1 - 5);
            ctx.lineTo(xP, pos.y1 + 5);
            ctx.stroke();
            ctx.font = '16px georgia';
            ctx.fillText((min + ((max - min) / steps) * i).toFixed(1), xP - 10, pos.y1 + 20);
        }
    };
    return {show, length, unitMin, min, max};
};

/**
 * @param {Array<Precipitation>} precipitation
 * @param {vec4} position
 */
const yAxisUnits = (precipitation, position) => {
    const pos = position;
    const max = precipitation.reduce((a, {mm}) => Math.max(a, mm), 0);
    const min = 0;
    const steps = 10;
    const unitMin = pos.y1 - 10;
    const unitMax = pos.y2 + 10;
    const length = unitMax - unitMin;
    const show = () => {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;
        for (let j = 0; j <= steps; j++) {
            let yP = unitMin + (length / steps) * j;
            ctx.beginPath();
            ctx.moveTo(pos.x1 - 5, yP);
            ctx.lineTo(pos.x1 + 5, yP);
            ctx.stroke();
            ctx.font = '16px georgia';
            ctx.fillText((min + ((max - min) / steps) * j).toFixed(2), pos.x1 - 50, yP + 3);
        }
    };
    return {show, length, unitMin, min, max};
};

/**
 * Scatter Plot -> Precipitation (mm) / Presence (%)
 * @param {CanvasRenderingContext2D} context
 * @param {Array<Precipitation>} precipitation
 * @param {Array<Presence>} presence
 */
export default (context, precipitation, presence) => {
    ctx = context;
    width = context.canvas.width;
    height = context.canvas.height;
    const origin = {x: width * 0.2, y: height * 0.8};
    const x = xAxis({x1: origin.x, y1: origin.y, x2: width * 0.8, y2: origin.y});
    const y = yAxis({x1: origin.x, y1: origin.y, x2: origin.x, y2: height * 0.2});
    const xTitle = xAxisTitle({x1: origin.x, y1: origin.y, x2: width * 0.8, y2: origin.y}, 'Aanwezigheid (%)');
    const yTitle = yAxisTitle({x1: origin.x, y1: origin.y, x2: origin.x, y2: height * 0.2}, 'Neerslag (in mm)');
    const xUnits = xAxisUnits(presence, {x1: origin.x, y1: origin.y, x2: width * 0.8, y2: origin.y});
    const yUnits = yAxisUnits(precipitation, {x1: origin.x, y1: origin.y, x2: origin.x, y2: height * 0.2});
    // Graph Title
    // Legend

    const show = () => {
        x.show();
        y.show();
        xTitle.show();
        yTitle.show();
        xUnits.show();
        yUnits.show();
    };

    return {show, xUnits, yUnits};
};
