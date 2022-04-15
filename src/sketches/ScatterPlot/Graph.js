/** @typedef {import('types/graph').GraphData} GraphData */
import Paint from '../paint';

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
export const elements = {
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
        kind: '',
    },
    yTitle: {
        ...defaults.text,
        pos: {x: 0, y: 0},
        kind: '',
        angle: -Math.PI / 2,
    },
    mainTitle: {
        ...defaults.text,
        text: 'Scatterplot',
        pos: {x: 0, y: 0},
        size: 32,
        weight: 'bold',
    },
    xUnits: {
        units: [],
        maxValue: 0,
        minValue: 0,
        length: 0,
        startX: 0,
    },
    yUnits: {
        units: [],
        maxValue: 0,
        minValue: 0,
        length: 0,
        startY: 0,
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
    elements.mainTitle.pos = {x: grid.width * 0.5, y: grid.unitHeight * 2};
};

/**
 * Scatter Plot -> TypeX (Weather type (unit of Measurement)) / TypeY (Presence (%))
 * @param {import("types/sketches").Sketch} sketch
 * @returns
 */
export const Graph = sketch => {
    grid = sketch.grid.properties;
    const paint = Paint(sketch.context);
    setPositions();
    // careful: this might not be a good place for it with future alterations

    const show = () => {
        Object.keys(elements).map(key => {
            if (key == 'xUnits' || key == 'yUnits')
                elements[key].units.map((/** @type {{ show: string }} */ el) => paint[el.show](el));
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
    return {
        units,
        min: minRounded,
        max: maxRounded,
        lengthX: x2 - x1,
        lengthY: y2 - y1,
        x1,
        y1,
    };
};

/** @param {GraphData} dataX */
export const setGraphX = dataX => {
    elements.xTitle.text = `${dataX.title} (${dataX.unitOfMeasure})`;
    elements.xTitle.kind = dataX.title.toLowerCase();
    elements.mainTitle.text = `Scatterplot voor ${elements.yTitle.kind} vs ${elements.xTitle.kind}`;
    const xUnits = units(
        elements.x.pos.x1 + grid.unitWidth * 0.25,
        elements.x.pos.y1 + grid.unitHeight * 0.5,
        elements.x.pos.x2 - grid.unitWidth * 0.25,
        elements.x.pos.y2 + grid.unitHeight * 0.5,
        2,
        dataX.data,
    );
    elements.xUnits.units = xUnits.units;
    elements.xUnits.maxValue = xUnits.max;
    elements.xUnits.minValue = xUnits.min;
    elements.xUnits.length = xUnits.lengthX;
    elements.xUnits.startX = xUnits.x1;
};

/** @param {GraphData} dataY */
export const setGraphY = dataY => {
    elements.yTitle.text = `${dataY.title} (${dataY.unitOfMeasure})`;
    elements.yTitle.kind = dataY.title.toLowerCase();
    elements.mainTitle.text = `Scatterplot voor ${elements.yTitle.kind} vs ${elements.xTitle.kind}`;
    const yUnits = units(
        elements.y.pos.x1 - grid.unitWidth * 0.5,
        elements.y.pos.y1 - grid.unitHeight * 0.25,
        elements.y.pos.x2 - grid.unitWidth * 0.5,
        elements.y.pos.y2 + grid.unitHeight * 0.25,
        10,
        dataY.data,
    );
    elements.yUnits.units = yUnits.units;
    elements.yUnits.maxValue = yUnits.max;
    elements.yUnits.minValue = yUnits.min;
    elements.yUnits.length = yUnits.lengthY;
    elements.yUnits.startY = yUnits.y1;
};
