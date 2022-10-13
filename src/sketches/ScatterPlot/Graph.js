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
    const components = createComponents(sketch.grid);
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
        show,
    };
};

/**
 * Create all graph components
 * @param {import('types/sketches').Grid} grid
 */
const createComponents = ({width, height}) => {
    const components = {
        xAxis: Line({x1: 0.125 * width, y1: 0.75 * height, x2: 0.875 * width, y2: 0.75 * height, weight: 4}),
        yAxis: Line({x1: 0.125 * width, y1: 0.78 * height, x2: 0.125 * width, y2: 0.22 * height, weight: 4}),
        xTitle: Text({x: width / 2, y: 0.875 * height}),
        yTitle: Text({x: 0.0625 * width, y: height / 2}),
        mainTitle: Text({x: width / 2, y: 0.1 * height, size: 32, weight: 'bold', msg: 'Scatterplot'}),
    };
    return components;
};

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

/** @param {Paint} paint */
const show = paint => {
    // for every element: paint value is type of draw with paint object
    Object.keys(elements).forEach(key => {
        if (key === 'xUnits' || key === 'yUnits') elements[key].units.forEach(el => paint[el.paint](el));
        // @ts-ignore
        else showElements(key, paint);
    });
};

/**
 *
 * @param {GraphShowElementsNonUnits} key
 * @param {Paint} paint
 */
const showElements = (key, paint) => {
    const element = elements[key];
    if (element.paint === 'line') paint[element.paint](element);
    else if (element.paint === 'text') paint[element.paint](element);
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
