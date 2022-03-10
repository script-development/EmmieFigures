/** @typedef {import('types/graph').Precipitation} Precipitation */
/** @typedef {import('types/graph').Presence} Presence */
/** @typedef {import('types/graph').Stat} Stat */
/** @typedef {{x1: number, y1: number, x2: number, y2: number}} vec4 */

/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {import("types/sketches").Globals} */
let globals;

const origin = {x: 0, y: 0};

const xAxis = () => {
    const pos = {x1: origin.x, y1: origin.y, x2: globals.width * 0.8, y2: origin.y};
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

const yAxis = () => {
    const pos = {x1: origin.x, y1: origin.y, x2: origin.x, y2: globals.height * 0.2};
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
 * @param {string} title
 * @returns {{show: function}}
 */
const xAxisTitle = title => {
    const pos = {x1: origin.x, y1: origin.y, x2: globals.width * 0.8, y2: origin.y};
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
 * Create y-Axis
 * @param {string} title
 * @returns {{show: function}}
 */
const yAxisTitle = title => {
    const pos = {x1: origin.x, y1: origin.y, x2: origin.x, y2: globals.height * 0.2};
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
 */
const xAxisUnits = presence => {
    const pos = {x1: origin.x, y1: origin.y, x2: globals.width * 0.8, y2: origin.y};
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
            ctx.lineTo(xP, pos.y1 - globals.height * 0.6);
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
 */
const yAxisUnits = precipitation => {
    const pos = {x1: origin.x, y1: origin.y, x2: origin.x, y2: globals.height * 0.2};
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
            ctx.lineTo(pos.x1 + globals.width * 0.6, yP);
            ctx.stroke();
            ctx.textBaseline = 'middle';
            ctx.font = '16px georgia';
            ctx.fillText((min + ((max - min) / steps) * j).toFixed(2), pos.x1 - 30, yP);
        }
    };
    return {show, length, unitMin, min, max};
};

/**
 * @param {string} title
 */
const graphTitle = title => {
    const pos = {x: globals.width / 2, y: globals.height * 0.1};
    const show = () => {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#555';
        ctx.fillStyle = 'gray';
        ctx.textAlign = 'center';
        ctx.font = '32px sans-serif';
        ctx.fillText(title, pos.x + 1, pos.y + 1);
        ctx.strokeText(title, pos.x, pos.y);
    };
    return {show};
};

/**
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
 * @param {import("types/sketches").Sketch} sketch
 * @param {Array<Precipitation>} precipitation
 * @param {Array<Presence>} presence
 */
export default (sketch, precipitation, presence) => {
    ctx = sketch.context;
    globals = sketch.globals;
    origin.x = globals.width * 0.2;
    origin.y = globals.height * 0.8;
    const x = xAxis();
    const y = yAxis();
    const xTitle = xAxisTitle('Aanwezigheid (%)');
    const yTitle = yAxisTitle('Neerslag (in mm)');
    const xUnits = xAxisUnits(presence);
    const yUnits = yAxisUnits(precipitation);
    const title = graphTitle('Scatterplot voor aanwezigheid vs neerslag');
    const legend = graphLegend(globals.width * 0.9, globals.height * 0.5, globals.width * 0.15, globals.height * 0.15);

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