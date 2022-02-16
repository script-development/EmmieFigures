/**
 * Precipitation graph with date
 * @param {import('..').SketchApi} sketch
 * @param {Array<import('types').Precipitation>} props
 */
export default (sketch, props) => {
    const {width, height} = sketch;

    const month = 12; // let's take december firstly
    const days = props.filter(i => {
        return i.day.search(`2021-${month}`) != -1;
    });

    const max = props.reduce((a, {precip}) => Math.max(a, precip), 0);

    // x1, y1 = Origin (De oorsprong)
    const yAxis = {x1: width * 0.2, y1: height * 0.8, x2: width * 0.2, y2: height * 0.2};
    const xAxis = {x1: width * 0.2, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8};

    /** @param {import("..").DrawApi} e */
    const show = ({stroke, strokeWeight, line}) => {
        // X & Y - axis
        stroke(0);
        strokeWeight(4);
        line(yAxis.x1, yAxis.y1, yAxis.x2, yAxis.y2);
        line(xAxis.x1, xAxis.y1, xAxis.x2, xAxis.y2);

        // Y-axis with units
        // const length = (yAxis.y1 - yAxis.y2) * 0.9;
        // const steps = 1;
        // const min = 0;
    };
    return {show, days};
};
