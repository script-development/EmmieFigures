/** set to id of selected stat (mouse hover), else -1 */
let insideId = -1;

/** @type {import("types/sketches").Globals} */
let globals;

/**
 * @param {number} percentage
 * @param {number} mm
 * @param {string} date
 * @param {number} id
 * @param {import("types/sketches").Sketch} sketch
 * @returns {import("types/graph").Stat}
 */
export default (percentage, mm, date, id, sketch) => {
    globals = sketch.globals;
    const color = [0, 100, 0];
    const pos = {x: 0, y: 0};
    let radius = 5;

    return {
        percentage,
        mm,
        date,
        pos,
        update: delta => update(id, color, pos, radius, delta),
        show: () => show(sketch.context, color, pos, radius),
        selected: () => showSelected(sketch.context),
    };
};

/**
 * @param {{x: number, y: number}} pos
 * @param {number} radius
 */
const mouseInside = (pos, radius) =>
    Math.sqrt(Math.pow(globals.mouseX - pos.x, 2) + Math.pow(globals.mouseY - pos.y, 2)) < radius;

/**
 * @param {number} id
 * @param {Array<number>} color
 * @param {{x: number, y: number}} pos
 * @param {number} radius
 * @param {number} delta
 * @returns {number}
 */
const update = (id, color, pos, radius, delta) => {
    if (insideId === id) {
        if (!mouseInside(pos, radius)) {
            insideId = -1;
            color[0] = 0;
            return -1;
        }
    } else if (insideId < 0 && mouseInside(pos, radius)) {
        insideId = id;
        color[0] = 255;
        return id;
    }
    return insideId;
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
const showSelected = ctx => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'magenta';
    ctx.beginPath();
    ctx.moveTo(globals.mouseX, globals.mouseY);
    ctx.lineTo(globals.mouseX + 30, globals.mouseY - 30);
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.rect(globals.mouseX + 30, globals.mouseY - 110, 200, 80);
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
const show = (ctx, color, pos, radius) => {
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
