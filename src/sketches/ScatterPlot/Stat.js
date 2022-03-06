/** set to id of selected stat (mouse hover), else -1 */
let insideId = -1;

/**
 * @param {number} percentage
 * @param {number} mm
 * @param {string} date
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number}} mouse
 * @param {number} id
 * @returns {import("types/graph").Stat}
 */
export default (percentage, mm, date, ctx, mouse, id) => {
    const color = [0, 100, 0];
    const pos = {x: 0, y: 0};
    let radius = 5;
    const update = () => updateStat(id, color, mouse, pos, radius);

    const show = () => showStat(ctx, color, pos, radius);
    const selected = () => showSelected(ctx, mouse);

    return {
        percentage,
        mm,
        date,
        pos,
        show,
        update,
        selected,
    };
};

/**
 * @param {{x: number, y: number}} mouse
 * @param {mouse} pos
 * @param {number} radius
 */
const mouseInside = (mouse, pos, radius) =>
    Math.sqrt(Math.pow(mouse.x - pos.x, 2) + Math.pow(mouse.y - pos.y, 2)) < radius;

/**
 *
 * @param {number} id
 * @param {Array<number>} color
 * @param {{x: number, y: number}} mouse
 * @param {mouse} pos
 * @param {number} radius
 * @returns {number}
 */
const updateStat = (id, color, mouse, pos, radius) => {
    if (insideId === id) {
        if (!mouseInside(mouse, pos, radius)) {
            insideId = -1;
            color[0] = 0;
            return -1;
        }
    } else if (insideId < 0 && mouseInside(mouse, pos, radius)) {
        insideId = id;
        color[0] = 255;
        return id;
    }
    return insideId;
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number}} mouse
 */
const showSelected = (ctx, mouse) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'magenta';
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    ctx.lineTo(mouse.x + 30, mouse.y - 30);
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.rect(mouse.x + 30, mouse.y - 110, 200, 80);
    ctx.fill();
    ctx.stroke();
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<number>} color
 * @param {{x: number, y: number}} pos
 * @param {number} radius
 */
const showStat = (ctx, color, pos, radius) => {
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
};

/**
 *
 * @param {{max: number, min: number, unitMin: number, length: number}} xUnits
 * @param {xUnits} yUnits
 * @param {Array<import("types/graph").Stat>} stats
 */
export const setStatPosition = (xUnits, yUnits, stats) => {
    /**
     * @param {number} max
     * @param {number} min
     * @param {number} unitMin
     * @param {number} length
     * @param {number} stat
     */
    const pos = (max, min, unitMin, length, stat) => {
        const range = max - min;
        const leftOver = stat - min;
        const posPercentage = leftOver / range;
        const posLength = posPercentage * length;
        return posLength + unitMin;
    };

    stats.forEach(stat => {
        stat.pos.x = pos(xUnits.max, xUnits.min, xUnits.unitMin, xUnits.length, stat.percentage);
        stat.pos.y = pos(yUnits.max, yUnits.min, yUnits.unitMin, yUnits.length, stat.mm);
    });
};
