/** @type {(c: CanvasRenderingContext2D) => import("types/paint").Paint} */
export default c => ({
    text: ({color, align, baseline, weight, size, font, msg, pos}) => {
        c.fillStyle = color;
        c.textAlign = align;
        c.textBaseline = baseline;
        c.font = `${weight} ${size}px ${font}`;
        c.fillText(msg, pos.x, pos.y);
    },
    line: ({color, weight, pos}) => {
        c.strokeStyle = color;
        c.lineWidth = weight;
        c.beginPath();
        c.moveTo(pos.x1, pos.y1);
        c.lineTo(pos.x2, pos.y2);
        c.stroke();
    },
    clear: () => c.clearRect(0, 0, c.canvas.width, c.canvas.height),
});

//     c.save();
//     c.translate(pos.x, pos.y);
//     c.rotate(angle);
//     c.fillText(text, 0, 0);
//     c.restore();

const defaults = {
    line: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        color: 'black',
        weight: 1,
        /** @type {"line"} */
        type: 'line',
    },
    text: {
        x: 0,
        y: 0,
        msg: '',
        size: 24,
        weight: 'normal',
        color: 'black',
        font: 'sans-serif',
        /** @type {CanvasTextAlign} */
        align: 'center',
        /** @type {CanvasTextBaseline} */
        baseline: 'middle',
        /** @type {"text"} */
        type: 'text',
    },
};

/** @type {(options?: import("types/paint").LineOptions) => import("types/paint").Line} */
export const Line = (options = {}) => {
    const {x1, y1, x2, y2, color, weight, type} = {...defaults.line, ...options};
    return {
        pos: {x1, y1, x2, y2},
        color,
        weight,
        type,
    };
};

/** @type {(options: import("types/paint").TextOptions) => import("types/paint").Text} */
export const Text = (options = {}) => {
    const {x, y, msg, size, weight, color, font, align, baseline, type} = {...defaults.text, ...options};
    return {
        pos: {x, y},
        msg,
        size,
        weight,
        color,
        font,
        align,
        baseline,
        type,
    };
};
