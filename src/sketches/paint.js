const settings = () => ({
    fill: true,
    stroke: true,
});

/** @param {CanvasRenderingContext2D} c */
export const default2 = c => {
    const properties = settings();
    return {
        fill: color => fill(c, color, properties),
        stroke: color => stroke(c, color, properties),
        noFill: () => (properties.fill = false),
        noStroke: () => (properties.stroke = false),
        strokeSize: () => {},
        textMode: (align, baseline) => textMode(c, align, baseline),
        line: vec4 => line(c, vec4, properties.stroke),
        textSize: () => {},
        textWeight: () => {},
        text: () => {},
    };
};

const fill = (c, col, props) => {
    props.fill = true;
    c.fillStyle = col;
};

const stroke = (c, col, props) => {
    props.stroke = true;
    c.strokeStyle = col;
};

const textMode = (c, align, baseline) => {
    if (align) c.textAlign = align;
    if (baseline) c.textBaseline = baseline;
};

const line = (c, pos, stroke) => {
    c.beginPath();
    c.moveTo(pos.x1, pos.y1);
    c.lineTo(pos.x2, pos.y2);
    if (stroke) c.stroke();
};

/** @param {CanvasRenderingContext2D} c */
export default c => ({
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
    line: element => {
        c.strokeStyle = element.color;
        c.lineWidth = element.weight;
        c.beginPath();
        c.moveTo(element.pos.x1, element.pos.y1);
        c.lineTo(element.pos.x2, element.pos.y2);
        c.stroke();
    },
});
