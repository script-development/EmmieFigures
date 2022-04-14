/** @typedef {import('types/graph').GraphData} GraphData */
// /** @typedef {import('types/graph').Stat} Stat */

/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {import("types/sketches").Sketch["grid"]["properties"]} */
let grid;

const defaults = {
    text: {
        text: '',
        size: 24,
        weight: 'normal',
        color: 'black',
        font: 'sans-serif',
        /** @type {CanvasTextAlign} */
        align: 'center',
        /** @type {CanvasTextBaseline} */
        baseline: 'middle',
        show: 'text',
    },
};

/** @type {Object.<string, any>} */
const elements = {
    x: {
        pos: {x1: 0, y1: 0, x2: 0, y2: 0},
        color: 'black',
        weight: 4,
        show: 'line',
    },
    y: {
        pos: {x1: 0, y1: 0, x2: 0, y2: 0},
        color: 'black',
        weight: 4,
        show: 'line',
    },
    xTitle: {
        ...defaults.text,
        pos: {x: 0, y: 0},
    },
    yTitle: {
        ...defaults.text,
        pos: {x: 0, y: 0},
        angle: -Math.PI / 2,
    },
    mainTitle: {
        ...defaults.text,
        pos: {x: 0, y: 0},
        weight: 32,
        normal: 'bold',
    },
};

/**
 * @param {number} x
 * @param {number} y
 * @param {string} text
 */
const unitDefinition = (x, y, text) => ({
    ...defaults.text,
    pos: {x, y},
    text,
    size: 16,
});

const setPositions = () => {
    elements.x.pos = {
        x1: grid.unitWidth * 4,
        y1: grid.unitHeight * 14,
        x2: grid.unitWidth * 28,
        y2: grid.unitHeight * 14,
    };
    elements.y.pos = {
        x1: grid.unitWidth * 4,
        y1: grid.unitHeight * 14,
        x2: grid.unitWidth * 4,
        y2: grid.unitHeight * 4,
    };
    elements.xTitle.pos = {x: grid.unitWidth * 16, y: grid.unitHeight * 16};
    elements.yTitle.pos = {x: grid.unitWidth * 2, y: grid.unitHeight * 9};
    elements.mainTitle.pos = {x: grid.width * 0.5, y: grid.unitHeight * 3};
};

/**
 * Scatter Plot -> TypeX (Weather type (unit of Measurement)) / TypeY (Presence (%))
 * @param {import("types/sketches").Sketch} sketch
 * @returns
 */
export default sketch => {
    ctx = sketch.context;
    grid = sketch.grid.properties;
    setPositions();

    const show = () => {
        Object.keys(elements).map(key => {
            if (key == 'xUnits' || key == 'yUnits')
                elements[key].map((/** @type {{ show: string }} */ el) => paint[el.show](el));
            else paint[elements[key].show](elements[key]);
        });
    };

    return {show, elements};
};

/**
 * X or Y-axis units
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} steps
 * @param {GraphData["data"]} data
 * @returns
 */
const units = (x1, y1, x2, y2, steps, data) => {
    const max = data.reduce((a, {value}) => Math.max(a, value), 0);
    const min = data.reduce((a, {value}) => Math.min(a, value), max);
    const minRounded = min - (min % steps);
    const maxRounded = max - (max % steps) + steps;
    const range = maxRounded - minRounded;
    const amount = range / steps;

    const units = [];
    for (let i = 0; i <= amount; i++) {
        units.push(
            unitDefinition(
                x1 + ((x2 - x1) / amount) * i,
                y1 + ((y2 - y1) / amount) * i,
                (minRounded + ((maxRounded - minRounded) / amount) * i).toFixed(0),
            ),
        );
    }
    return units;
};

/** @param {GraphData} dataX */
export const setX = dataX => {
    elements.xTitle.text = `${dataX.title} (${dataX.unitOfMeasure})`;
    elements['xUnits'] = units(
        elements.x.pos.x1 + grid.unitWidth * 0.25,
        elements.x.pos.y1 + grid.unitHeight * 0.5,
        elements.x.pos.x2 - grid.unitWidth * 0.25,
        elements.x.pos.y2 + grid.unitHeight * 0.5,
        2,
        dataX.data,
    );
};

/** @param {GraphData} dataY */
export const setY = dataY => {
    elements.yTitle.text = `${dataY.title} (${dataY.unitOfMeasure})`;
    elements['yUnits'] = units(
        elements.y.pos.x1 - grid.unitWidth * 0.5,
        elements.y.pos.y1 - grid.unitHeight * 0.25,
        elements.y.pos.x2 - grid.unitWidth * 0.5,
        elements.y.pos.y2 + grid.unitHeight * 0.25,
        10,
        dataY.data,
    );
};

/** @type {Object.<string, any>} */
const paint = {
    /** @param {defaults["text"] & {pos: {x: number, y: number}, angle?: number}} param */
    text: ({color, align, baseline, weight, size, font, text, pos, angle}) => {
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.font = `${weight} ${size}px ${font}`;
        if (angle) {
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(angle);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        } else ctx.fillText(text, pos.x, pos.y);
    },
    /** @param {elements['x'] | elements['y']} element */
    line: element => {
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.weight;
        ctx.beginPath();
        ctx.moveTo(element.pos.x1, element.pos.y1);
        ctx.lineTo(element.pos.x2, element.pos.y2);
        ctx.stroke();
    },
};

// /** @param {GraphData["data"]} typeY */
// const yAxisUnits = typeY => {
//     const pos = {x1: origin.x, y1: origin.y, x2: origin.x, y2: ctx.canvas.height * 0.2};
//     const maxValue = typeY.reduce((a, {value}) => Math.max(a, value), 0);
//     const minValue = 0;
//     const steps = 10;
//     const unitSY = pos.y1 - 10;
//     const unitEY = pos.y2 + 10;
//     const length = unitEY - unitSY;
//     const show = () => {
//         ctx.fillStyle = 'black';
//         for (let j = 0; j <= steps; j++) {
//             let yPos = unitSY + (length / steps) * j;
//             ctx.lineWidth = 2;
//             ctx.strokeStyle = 'black';
//             ctx.beginPath();
//             ctx.moveTo(pos.x1 - 5, yPos);
//             ctx.lineTo(pos.x1 + 5, yPos);
//             ctx.stroke();
//             ctx.lineWidth = 1;
//             ctx.strokeStyle = '#ddd';
//             ctx.moveTo(pos.x1, yPos);
//             ctx.lineTo(pos.x1 + ctx.canvas.width * 0.6, yPos);
//             ctx.stroke();
//             ctx.textBaseline = 'middle';
//             ctx.font = '16px georgia';
//             ctx.fillText((minValue + ((maxValue - minValue) / steps) * j).toFixed(2), pos.x1 - 30, yPos);
//         }
//     };
//     return {show, length, unitSY, minValue, maxValue};
// };
