/** @typedef {import('types/sketches').Grid} Grid */
/** @typedef {import('types/paint').Paint} Paint */

import {Line} from './paint';

/** @type {(w?: number, h?: number, x?: number, y?: number) => Omit<Grid, 'show'>}} */
const createGrid = (w = 300, h = 150, x = 10, y = 10) => ({
    width: w,
    height: h,
    xUnits: x,
    yUnits: y,
    unitWidth: w / x,
    unitHeight: h / y,
});

/** @type {(context: CanvasRenderingContext2D, paint: Paint) => Grid} */
export default (context, paint) => {
    const grid = createGrid(context.canvas.width, context.canvas.height, 32, 18);
    const lineX = Line({x2: grid.width, color: 'lightgray'});
    const lineY = Line({y2: grid.height, color: 'lightgray'});
    const show = () => {
        for (let y = 0; y <= grid.yUnits; y++) {
            for (let x = 0; x <= grid.xUnits; x++) {
                const adjustY = y === grid.yUnits ? -0.5 : 0.5;
                const adjustX = x === grid.xUnits ? -0.5 : 0.5;

                // horizontal lines
                lineX.pos.y1 = y * grid.unitHeight + adjustY;
                lineX.pos.y2 = y * grid.unitHeight + adjustY;
                paint.line(lineX);

                // vertical lines
                lineY.pos.x1 = x * grid.unitWidth + adjustX;
                lineY.pos.x2 = x * grid.unitWidth + adjustX;

                paint.line(lineY);
            }
        }
    };

    return {
        ...grid,
        show,
    };
};
