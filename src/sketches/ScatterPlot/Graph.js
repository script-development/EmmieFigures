/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {number} */
let width;

/** @type {number} */
let height;

const xAxis = () => {
    const pos = {x1: width * 0.2 - 10, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8}; // = presence
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
    const pos = {x1: width * 0.2, y1: height * 0.8 + 10, x2: width * 0.2, y2: height * 0.2}; // = precipitation
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
const xAxisTitle = () => {
    const pos = {x1: width * 0.2 - 10, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8}; // = presence
    const show = () => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.font = '24px georgia';
        ctx.fillText('Aanwezigheid (%)', pos.x1 + (pos.x2 - pos.x1) / 2 - 50, pos.y1 + 60);
    };
    return {show};
};
const yAxisTitle = () => {
    const pos = {x1: width * 0.2, y1: height * 0.8 + 10, x2: width * 0.2, y2: height * 0.2}; // = precipitation
    const show = () => {
        ctx.fillStyle = 'black';
        ctx.font = '24px georgia';
        ctx.save();
        ctx.translate(pos.x1 - 50, pos.y1 + (pos.y2 - pos.y1) / 2 + 70);
        ctx.rotate(-Math.PI / 2);
        ctx.beginPath();
        ctx.fillText('Neerslag (in mm)', 0, 0);
        ctx.restore();
    };
    return {show};
};
const xAxisUnits = presence => {
    const pos = {x1: width * 0.2 - 10, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8}; // = presence
    const maxPresence = presence.reduce((a, {percentage}) => Math.max(a, percentage), 0);
    const minPresence = presence.reduce((a, {percentage}) => Math.min(a, percentage), maxPresence);
    const stepsX = 10;
    const unitXMin = pos.x1 + 30;
    const unitXMax = pos.x2 - 15;
    const unitXLength = unitXMax - unitXMin;
    const show = () => {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;
        for (let i = 0; i <= stepsX; i++) {
            // console.log(x);
            let xP = unitXMin + (unitXLength / stepsX) * i;
            ctx.beginPath();
            ctx.moveTo(xP, pos.y1 - 5);
            ctx.lineTo(xP, pos.y1 + 5);
            ctx.stroke();
            ctx.font = '16px georgia';
            ctx.fillText((minPresence + ((maxPresence - minPresence) / stepsX) * i).toString(), xP - 10, pos.y1 + 20);
        }
    };
    return {show};
};
// const pos = () => {
//     const show = () => {};
//     return {show};
// };

/**
 * Scatter Plot -> Precipitation / Presence %
 * @param {CanvasRenderingContext2D} context
 * @param {Array<import('types').Precipitation>} precipitation
 * @param {Array<import('types').Presence>} presence
 */
export default (context, precipitation, presence) => {
    ctx = context;
    width = context.canvas.width;
    height = context.canvas.height;
    const x = xAxis();
    const y = yAxis();
    const xTitle = xAxisTitle();
    const yTitle = yAxisTitle();
    const xUnits = xAxisUnits(presence);

    const show = () => {
        x.show();
        y.show();
        xTitle.show();
        yTitle.show();
        xUnits.show();
        // yUnits.show();
    };

    return {show};
};
