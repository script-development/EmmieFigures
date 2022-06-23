/**
 * @param {CanvasRenderingContext2D} ctx
 */
export default ctx => ({
    ctx,
    /** @param {import("types/graph").GraphTextElement} element */
    text: ({color, align, baseline, weight, size, font, text, pos, angle}) => {
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.font = `${weight} ${size}px ${font}`;
        if (angle) {
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(angle);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        } else ctx.fillText(text, pos.x, pos.y);
    },
    /** @param {import("./ScatterPlot/Graph").LineElement} element */
    line: element => {
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.weight;
        ctx.beginPath();
        ctx.moveTo(element.pos.x1, element.pos.y1);
        ctx.lineTo(element.pos.x2, element.pos.y2);
        ctx.stroke();
    },
    rect: () => {},
    clear: () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
});
