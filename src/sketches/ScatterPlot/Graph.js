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
        ctx.textAlign = 'center';
        ctx.font = '24px georgia';
        ctx.fillText(title, pos.x1 + (pos.x2 - pos.x1) / 2, pos.y1 + 60);
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
        ctx.translate(pos.x1 - 100, pos.y1 + (pos.y2 - pos.y1) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.font = '24px georgia';
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
        ctx.fillStyle = 'black';
        for (let i = 0; i <= steps; i++) {
            let xP = unitMin + (length / steps) * i;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xP, pos.y1 - 5);
            ctx.lineTo(xP, pos.y1 + 5);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ddd';
            ctx.moveTo(xP, pos.y1);
            ctx.lineTo(xP, pos.y1 - height * 0.6);
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.font = '16px georgia';
            ctx.fillText((min + ((max - min) / steps) * i).toFixed(1), xP, pos.y1 + 15);
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
        ctx.fillStyle = 'black';
        for (let j = 0; j <= steps; j++) {
            let yP = unitMin + (length / steps) * j;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(pos.x1 - 5, yP);
            ctx.lineTo(pos.x1 + 5, yP);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ddd';
            ctx.moveTo(pos.x1, yP);
            ctx.lineTo(pos.x1 + width * 0.6, yP);
            ctx.stroke();
            ctx.textBaseline = 'middle';
            ctx.font = '16px georgia';
            ctx.fillText((min + ((max - min) / steps) * j).toFixed(2), pos.x1 - 30, yP);
        }
    };
    return {show, length, unitMin, min, max};
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string} title
 * @returns
 */
const graphTitle = (x, y, title) => {
    const show = () => {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#555';
        ctx.fillStyle = 'gray';
        ctx.textAlign = 'center';
        ctx.font = '32px sans-serif';
        ctx.fillText(title, x + 1, y + 1);
        ctx.strokeText(title, x, y);
    };
    return {show};
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
const graphLegend = (x, y, w, h) => {
    const pos = {x: x - w / 2, y: y - h / 2};
    const show = () => {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.strokeRect(pos.x, pos.y, w, h);
        ctx.rect(pos.x + 10, pos.y + h / 2 - 5, 10, 10);
        ctx.fill();
        ctx.stroke();
        ctx.font = '16px consolas';
        ctx.fillStyle = 'black';
        ctx.fillText('Legenda:', pos.x + w / 2 - 14, pos.y - 15);
        ctx.font = '14px consolas';
        ctx.textAlign = 'start';
        ctx.fillText('alle dagdelen', pos.x + 25, pos.y + h / 2 + 1);
    };
    return {show};
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
    const title = graphTitle(width / 2, height * 0.1, 'Scatterplot voor aanwezigheid vs neerslag');
    const legend = graphLegend(width * 0.9, height * 0.5, width * 0.15, height * 0.15);

    const show = () => {
        x.show();
        y.show();
        xTitle.show();
        yTitle.show();
        xUnits.show();
        yUnits.show();
        title.show();
        legend.show();
    };

    return {show, xUnits, yUnits};
};
