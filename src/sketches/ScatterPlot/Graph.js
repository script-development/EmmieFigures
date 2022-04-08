/** @typedef {import('types/graph').GraphData} GraphData */
/** @typedef {import('types/graph').Stat} Stat */

// const graph = {
//     x: {
//         pos: {x: 0, y: 0},
//     },
//     y: {},
//     xTitle: {},
//     yTitle: {},
//     title: {},
// };

const setPositions = () => {
    origin.x = ctx.canvas.width * 0.2;
    origin.y = ctx.canvas.height * 0.8;
};

/** @type {CanvasRenderingContext2D} */
let ctx;

// origin position of the graph, eg: x1, y1 of axis' & title & units ea
const origin = {x: 0, y: 0};

/** @type {{show: () => void}} */
let xTitle;

/** @type {import('types/graph').Graph["xUnits"]} */
let xUnits;

/** @type {{show: () => void}} */
let title;

/**
 * Scatter Plot -> TypeX (Weather type (unit of Measurement)) / TypeY (Presence (%))
 * @param {import("types/sketches").Sketch} sketch
 * @param {GraphData} typeX
 * @param {GraphData} typeY
 * @returns
 */
export default (sketch, typeX, typeY) => {
    ctx = sketch.context;
    setPositions();
    const x = mainAxis(ctx.canvas.width * 0.8, origin.y);
    const y = mainAxis(origin.x, ctx.canvas.height * 0.2);
    xTitle = xAxisTitle(`${typeX.title} (${typeX.unitOfMeasure})`);
    const yTitle = yAxisTitle(`${typeY.title} (${typeY.unitOfMeasure})`);
    xUnits = xAxisUnits(typeX.data);
    const yUnits = yAxisUnits(typeY.data);
    title = graphTitle(`Scatterplot voor ${typeY.title} vs ${typeX.title}`);

    const show = () => {
        x.show();
        y.show();
        xTitle.show();
        yTitle.show();
        xUnits.show();
        yUnits.show();
        title.show();
    };

    /** @param {GraphData} dataX */
    const setX = dataX => {
        xTitle = xAxisTitle(`${dataX.title} (${typeX.unitOfMeasure})`);
        xUnits = xAxisUnits(dataX.data);
        title = graphTitle(`Scatterplot voor ${typeY.title} vs ${dataX.title}`);
        return xUnits;
    };

    return {setX, show, xUnits, yUnits};
};

/**
 * @param {number} x2
 * @param {number} y2
 */
const mainAxis = (x2, y2) => {
    const pos = {x1: origin.x, y1: origin.y, x2, y2};
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

/** @param {string} title */
const xAxisTitle = title => {
    const pos = {x1: origin.x, y1: origin.y, x2: ctx.canvas.width * 0.8, y2: origin.y};
    const show = () => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.font = '24px georgia';
        ctx.fillText(title, pos.x1 + (pos.x2 - pos.x1) / 2, pos.y1 + 60);
    };
    return {show};
};

/** @param {string} title */
const yAxisTitle = title => {
    const pos = {x1: origin.x, y1: origin.y, x2: origin.x, y2: ctx.canvas.height * 0.2};
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

/** @param {GraphData["data"]} dataX */
const xAxisUnits = dataX => {
    const pos = {x1: origin.x, y1: origin.y, x2: ctx.canvas.width * 0.8, y2: origin.y};
    const maxValue = dataX.reduce((a, {value}) => Math.max(a, value), 0);
    const minValue = dataX.reduce((a, {value}) => Math.min(a, value), maxValue);
    const steps = 10;
    const unitSX = pos.x1 + 10;
    const unitEX = pos.x2 - 10;
    const length = unitEX - unitSX;
    const show = () => {
        ctx.fillStyle = 'black';
        for (let i = 0; i <= steps; i++) {
            let xP = unitSX + (length / steps) * i;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xP, pos.y1 - 5);
            ctx.lineTo(xP, pos.y1 + 5);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ddd';
            ctx.moveTo(xP, pos.y1);
            ctx.lineTo(xP, pos.y1 - ctx.canvas.height * 0.6);
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.font = '16px georgia';
            ctx.fillText((minValue + ((maxValue - minValue) / steps) * i).toFixed(1), xP, pos.y1 + 15);
        }
    };
    return {show, length, unitSX, minValue, maxValue};
};

/** @param {GraphData["data"]} typeY */
const yAxisUnits = typeY => {
    const pos = {x1: origin.x, y1: origin.y, x2: origin.x, y2: ctx.canvas.height * 0.2};
    const maxValue = typeY.reduce((a, {value}) => Math.max(a, value), 0);
    const minValue = 0;
    const steps = 10;
    const unitSY = pos.y1 - 10;
    const unitEY = pos.y2 + 10;
    const length = unitEY - unitSY;
    const show = () => {
        ctx.fillStyle = 'black';
        for (let j = 0; j <= steps; j++) {
            let yPos = unitSY + (length / steps) * j;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(pos.x1 - 5, yPos);
            ctx.lineTo(pos.x1 + 5, yPos);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ddd';
            ctx.moveTo(pos.x1, yPos);
            ctx.lineTo(pos.x1 + ctx.canvas.width * 0.6, yPos);
            ctx.stroke();
            ctx.textBaseline = 'middle';
            ctx.font = '16px georgia';
            ctx.fillText((minValue + ((maxValue - minValue) / steps) * j).toFixed(2), pos.x1 - 30, yPos);
        }
    };
    return {show, length, unitSY, minValue, maxValue};
};

/** @param {string} title */
const graphTitle = title => {
    const pos = {x: ctx.canvas.width / 2, y: ctx.canvas.height * 0.1};
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
