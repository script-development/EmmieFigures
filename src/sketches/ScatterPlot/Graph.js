// import {Vec4} from 'sketches/vectors';
// import {setRender} from '../engine';

import {Line, Text} from 'sketches/paint';

// /** @typedef {import('types/graph').GraphTextElement} TextElement */
// /** @typedef {import('types/graph').GraphUnitsElement} UnitsElement */
// /** @typedef {import('types/graph').Line} Line */
// /** @typedef {import('types/graph').GraphElements} Elements */
// /** @typedef {"x"|"y"|"yTitle"|"xTitle"|"mainTitle"} GraphShowElementsNonUnits */

// /** @type {import('types/sketches').Sketch["grid"]} */
// let grid;

/**
 * Scatter Plot -> TypeX (Weather type (unit of Measurement)) / TypeY (Presence (%))
 * @param {import("types/sketches").Sketch} sketch
 */
export default sketch => {
    // grid = sketch.grid.properties;
    const components = createComponents(sketch.context.canvas.width, sketch.context.canvas.height);
    // setPositions();
    // setUnitOffsets();
    // setRender({
    //     id: 'graph',
    //     show,
    // });

    // setRender({
    //     id: 'grid',
    //     show: () => sketch.grid.show(),
    // });
    return {
        show: () => show(sketch.paint, components),
    };
};

/**
 * Create all graph components
 * @param {number} width
 * @param {number} height
 */
const createComponents = (width, height) => ({
    xAxis: Line({x1: 0.2 * width, y1: 0.8 * height, x2: 0.8 * width, y2: 0.8 * height, weight: 4}),
    yAxis: Line({x1: 0.2 * width, y1: 0.8 * height, x2: 0.2 * width, y2: 0.2 * height, weight: 4}),
    xTitle: Text({x: width / 2, y: 0.9 * height}),
    yTitle: Text({x: 0.1 * width, y: height / 2}),
    mainTitle: Text({x: width / 2, y: 0.1 * height, size: 32, weight: 'bold', msg: 'Scatterplot'}),
});

const defaults = {
    units: {
        // /** @type {TextElement[]} */
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
//     yTitle: {
//         angle: -Math.PI / 2,
//     },
//     xUnits: {
//         ...defaults.units,
//     },
//     yUnits: {
//         ...defaults.units,
//     },
// };

/**
 * @param {number} x
 * @param {number} y
 * @param {string} text
 */
const Unit = (x, y, text) => ({
    ...defaults.text,
    pos: {x, y},
    text,
    size: 16,
});

/**
 * @param {import('types/paint').Paint} paint
 * @param {import('types/graph').Components} components
 */
const show = (paint, components) => {
    // for every component: type is method to run from the paint object
    Object.keys(components).forEach(key => {
        const type = components[key].type;
        if (type === 'line') paint.line(components[key]);
        else if (type === 'text') paint.text(components[key]);
        // if (key === 'xUnits' || key === 'yUnits') elements[key].units.forEach(el => paint[el.paint](el));
    });
};

/**
 * @param {string} key
 * @param {import('types/paint').Paint} paint
 * @param {import('types/graph').Components} elements
 */
const showElements = (key, paint, elements) => {
    // const element = elements[key];
    paint[elements[key].type](elements[key]);
    // else if (elements[key].type === 'text') paint[elements[key].type](element);
};

/**
 * X or Y-axis units
 * @param {import('types/vectors').Vec4d} pos
 * @param {number} steps
 * @param {import('types/graph').GraphData["data"]} data
 * @returns
 */
const units = (pos, steps, data) => {
    if (!data) return;
    const max = data.reduce((a, {value}) => Math.max(a, value), 0);
    const min = data.reduce((a, {value}) => Math.min(a, value), max);
    const minRounded = min - (min % steps);
    const maxRounded = max - (max % steps) + steps;
    const range = maxRounded - minRounded;
    const amount = range / steps;

    const units = [];
    for (let i = 0; i <= amount; i++) {
        units.push(
            Unit(
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
        x1: -grid.unitWidth * 0.5,
        y1: -grid.unitHeight * 0.25,
        x2: -grid.unitWidth * 0.5,
        y2: grid.unitHeight * 0.25,
    };
};

/**
 *
 * @param {import('types/graph').GraphData} data
 * @param {TextElement} title
 * @param {LineElement} axis
 * @param {UnitsElement} unit
 */
export const setGraph = (data, title, axis, unit) => {
    title.text = `${data.title} (${data.unitOfMeasure})`;
    elements.mainTitle.text = `Scatterplot voor ${elements.yTitle.text
        .split(' ')[0]
        .toLowerCase()} vs ${elements.xTitle.text.split(' ')[0].toLowerCase()}`;
    const units_ = units(Vec4.add(axis.pos, unit.offset), data.steps, data.data);
    Object.assign(unit, units_);
};
