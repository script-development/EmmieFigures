/**
 * Scatter Plot -> Precipitation / Presence %
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {Array<import('types').Precipitation>} precipitation
 * @param {Array<import('types').Presence>} presence
 */
export default (ctx, width, height, precipitation, presence) => {
    const maxPresence = presence.reduce((a, {percentage}) => Math.max(a, percentage), 0);
    const minPresence = presence.reduce((a, {percentage}) => Math.min(a, percentage), maxPresence);

    // x1, y1 = Origin (De oorsprong)
    const yAxis = {x1: width * 0.2, y1: height * 0.8 + 10, x2: width * 0.2, y2: height * 0.2}; // = precipitation
    const xAxis = {x1: width * 0.2 - 10, y1: height * 0.8, x2: width * 0.8, y2: height * 0.8}; // = presence

    const stepsX = 10;
    const unitXMin = xAxis.x1 + 30;
    const unitXMax = xAxis.x2 - 15;
    const unitXLength = unitXMax - unitXMin;

    const showXAxis = () => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(xAxis.x1, xAxis.y1);
        ctx.lineTo(xAxis.x2, xAxis.y2);
        ctx.stroke();
    };

    const showYAxis = () => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(yAxis.x1, yAxis.y1);
        ctx.lineTo(yAxis.x2, yAxis.y2);
        ctx.stroke();
    };
    const showXAxisTitle = () => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.font = '24px georgia';
        ctx.fillText('Aanwezigheid (%)', xAxis.x1 + (xAxis.x2 - xAxis.x1) / 2 - 50, xAxis.y1 + 60);
    };
    const showXAxisUnits = () => {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;
        for (let i = 0; i <= stepsX; i++) {
            let x = unitXMin + (unitXLength / stepsX) * i;
            ctx.beginPath();
            ctx.moveTo(x, xAxis.y1 - 5);
            ctx.lineTo(x, xAxis.y1 + 5);
            ctx.stroke();
            ctx.font = '16px georgia';
            ctx.fillText((minPresence + ((maxPresence - minPresence) / stepsX) * i).toString(), x - 10, xAxis.y1 + 20);
        }
    };
    const showYAxisTitle = () => {
        ctx.fillStyle = 'black';
        ctx.font = '24px georgia';
        ctx.save();
        ctx.translate(yAxis.x1 - 50, yAxis.y1 + (yAxis.y2 - yAxis.y1) / 2 + 70);
        ctx.rotate(-Math.PI / 2);
        ctx.beginPath();
        ctx.fillText('Neerslag (in mm)', 0, 0);
        ctx.restore();
    };
    const showYAxisUnits = () => {
        //
    };

    return {showXAxis, showYAxis, showXAxisTitle, showXAxisUnits, showYAxisTitle, showYAxisUnits};
};

/**
 * @param {Array<import('types').Precipitation>} props
 * @param {number} month
 */
const getDaysFromMonth = (props, month) => {
    return props
        .filter(i => i.day.search(`2021-${month}`) != -1)
        .map(i => {
            let day = i.day.substring(8);
            return day.charAt(0) === '0' ? day.slice(1) : day;
        });
};
