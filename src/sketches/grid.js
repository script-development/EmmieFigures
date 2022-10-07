import {Line} from './paint';

const Grid = (w = 300, h = 150, x = 10, y = 10) => ({
    width: w,
    height: h,
    xUnits: x,
    yUnits: y,
    unitWidth: w / x,
    unitHeight: h / y,
});

/**
 * @param {CanvasRenderingContext2D} context
 * @param {import("types/sketches").Paint} paint
 */
export default (context, paint) => {
    const grid = Grid(context.canvas.width, context.canvas.height, 32, 18);
    const lineX = Line({x2: grid.width, color: 'gray'});
    const lineY = Line({y2: grid.height, color: 'gray'});
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
