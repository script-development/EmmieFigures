import Variables from 'sketches/variables';

/**
 * Precipitation graph with date
 * @param {number} width
 * @param {number} height
 */
export default () => {
    const {width, height} = Variables;
    // x1, y1 = Origin (De oorsprong)
    const yAxis = {x1: width * 0.2, y1: height * 0.8, x2: width * 0.2, y2: height * 0.2};
    const xAxis = {x1: width * 0.2, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8};

    /** @param {import("..").DrawApi} e */
    const show = ({stroke, strokeWeight, line}) => {
        stroke(0);
        strokeWeight(4);
        line(yAxis.x1, yAxis.y1, yAxis.x2, yAxis.y2);
        line(xAxis.x1, xAxis.y1, xAxis.x2, xAxis.y2);
    };
    return {show};
};
