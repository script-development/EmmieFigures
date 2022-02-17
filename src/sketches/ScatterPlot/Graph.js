/**
 * Precipitation graph with date
 * @param {import('..').SketchApi} sketch
 * @param {Array<import('types').Precipitation>} props
 */
export default (sketch, props) => {
    const {width, height} = sketch;

    const month = 12;
    const days = props
        .filter(i => i.day.search(`2021-${month}`) != -1)
        .map(i => {
            let day = i.day.substring(8);
            return day.charAt(0) === '0' ? day.slice(1) : day;
        });
    const precip = props;

    // const min = 0;
    // const max = props.reduce((a, {precip}) => Math.max(a, precip), 0);

    // x1, y1 = Origin (De oorsprong)
    const yAxis = {x1: width * 0.2, y1: height * 0.8 + 10, x2: width * 0.2, y2: height * 0.2};
    const xAxis = {x1: width * 0.2 - 10, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8};

    // x-as eenheid

    /** @param {import("..").DrawApi} e */
    const show = ({noStroke, stroke, strokeWeight, line, fill, text}) => {
        // X & Y - axis
        stroke(0);
        strokeWeight(4);
        line(yAxis.x1, yAxis.y1, yAxis.x2, yAxis.y2);
        line(xAxis.x1, xAxis.y1, xAxis.x2, xAxis.y2);

        // X & Y-axis units and titles
        const length = (xAxis.x2 - xAxis.x1) * 0.93;
        const margin = xAxis.x2 - xAxis.x1 - length;
        // const steps = 1;
        const stepLength = (length * 1.05) / days.length;
        days.forEach((day, index) => {
            // X-axis units
            let x = xAxis.x1 + margin / 2;
            x += index * stepLength;
            fill(255, 0, 0);
            noStroke();
            text(day, x, xAxis.y1 + 15);
            // X-axis title

            // Y-axis units

            // Y-axis title

            // Graph data (lines)
        });
    };
    return {show, days};
};
