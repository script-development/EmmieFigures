/** @typedef {import("types/paint").Paint} Paint */

/**
 * @param {CanvasRenderingContext2D} c
 */
export default c => ({
    /** @param {Paint["Text"]} obj */
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
    /** @param {Paint["Line"]} obj */
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
