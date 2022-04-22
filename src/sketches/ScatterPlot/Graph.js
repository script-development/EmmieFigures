/**
 * @typedef {{
 * units: UnitDefinition[], min: number, max: number, lengthX: number, lengthY: number, startX: number, startY: number,
 * }} Units
 * @typedef {defaults["text"] & {show: 'text'}} UnitDefinition
 */
import Paint from '../paint';
import {Vec4} from 'sketches/vectors';

/** @type {import('types/sketches').Sketch["grid"]["properties"]} */
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
    units: {
        units: [],
        max: 0,
        min: 0,
        lengthX: 0,
        lengthY: 0,
        startX: 0,
        startY: 0,
        offset: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
};

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
        type: '',
    },
    yTitle: {
        ...defaults.text,
        pos: {x: 0, y: 0},
        type: '',
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
        ...defaults.units,
    },
    yUnits: {
        ...defaults.units,
    },
};

/**
 * @param {number} x
 * @param {number} y
 * @param {'text'} text
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
    setUnitOffsets();

    // for every element: show value is type of draw with paint object
    const show = () => {
        Object.keys(elements).map(key => {
            if (key == 'xUnits' || key == 'yUnits') {
                elements[key].units.map(el => paint[el.show](el));
            } else {
                paint[elements[key].show](elements[key]);
            }
        });
    };
    return {show, elements};
};

/**
 * X or Y-axis units
 * @param {Vec4d} pos
 * @param {number} steps
 * @param {import('types/graph').GraphData["data"]} data
 * @returns {Units}
 */
const units = (pos, steps, data) => {
    const max = data.reduce((a, {value}) => Math.max(a, value), 0);
    const min = data.reduce((a, {value}) => Math.min(a, value), max);
    const minRounded = min - (min % steps);
    const maxRounded = max - (max % steps) + steps;
    const range = maxRounded - minRounded;
    const amount = range / steps;

    /** @type {UnitDefinition[]} */
    const units = [];
    for (let i = 0; i <= amount; i++) {
        units.push(
            unitDefinition(
                pos.x1 + ((pos.x2 - pos.x1) / amount) * i,
                pos.y1 + ((pos.y2 - pos.y1) / amount) * i,
                (minRounded + ((maxRounded - minRounded) / amount) * i).toFixed(0),
            ),
        );
    }
    return {
        units,
        min: minRounded,
        max: maxRounded,
        lengthX: pos.x2 - pos.x1,
        lengthY: pos.y2 - pos.y1,
        startX: pos.x1,
        startY: pos.y1,
    };
};

const setUnitOffsets = () => {
    elements.xUnits.offset = {
        x1: grid.unitWidth * 0.25,
        y1: grid.unitHeight * 0.5,
        x2: -grid.unitWidth * 0.25,
        y2: grid.unitHeight * 0.5,
    };
    elements.yUnits.offset = {
        x1: -grid.unitWidth * 0.25,
        y1: -grid.unitHeight * 0.25,
        x2: -grid.unitWidth * 0.5,
        y2: grid.unitHeight * 0.25,
    };
};

/**
 *
 * @param {import('types/graph').GraphData} data
 * @param {elements["xTitle"]|elements["yTitle"]} title
 * @param {elements["x"]|elements["y"]} axis
 * @param {elements["xUnits"]|elements["yUnits"]} unit
 */
export const setGraph = (data, title, axis, unit) => {
    title.text = `${data.title} (${data.unitOfMeasure})`;
    title.type = data.title.toLowerCase();
    elements.mainTitle.text = `Scatterplot voor ${elements.yTitle.type} vs ${elements.xTitle.type}`;
    const units_ = units(Vec4.add(axis.pos, unit.offset), data.steps, data.data);
    Object.assign(unit, units_);
};
