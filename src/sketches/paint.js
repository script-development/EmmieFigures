/**
 * @param {CanvasRenderingContext2D} c
 */
export default c => ({
    /** @param {import("types/graph").GraphTextElement} element */
    text: ({color, align, baseline, weight, size, font, text, pos, angle}) => {
        c.fillStyle = color;
        c.textAlign = align;
        c.textBaseline = baseline;
        c.font = `${weight} ${size}px ${font}`;
        if (angle) {
            c.save();
            c.translate(pos.x, pos.y);
            c.rotate(angle);
            c.fillText(text, 0, 0);
            c.restore();
        } else c.fillText(text, pos.x, pos.y);
    },
    /** @param {import("./ScatterPlot/Graph").LineElement} element */
    line: element => {
        c.strokeStyle = element.color;
        c.lineWidth = element.weight;
        c.beginPath();
        c.moveTo(element.pos.x1, element.pos.y1);
        c.lineTo(element.pos.x2, element.pos.y2);
        c.stroke();
    },
    clear: () => c.clearRect(0, 0, c.canvas.width, c.canvas.height),
});

const defaultOptions = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    color: 'black',
    weight: 1,
};

export const Line = (options = {}) => {
    const actualOptions = {...defaultOptions, ...options};
    return {
        pos: {
            x1: actualOptions.x1,
            y1: actualOptions.y1,
            x2: actualOptions.x2,
            y2: actualOptions.y2,
        },
        color: actualOptions.color,
        weight: actualOptions.weight,
    };
};
