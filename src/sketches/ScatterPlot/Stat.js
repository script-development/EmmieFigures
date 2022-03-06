/**
 * @param {number} presencePercentage
 * @param {number} precipitationMM
 * @param {string} date
 * @param {CanvasRenderingContext2D} ctx
 * @returns {import("types/graph").Stat}
 */
export default (presencePercentage, precipitationMM, date, ctx) => {
    const color = [255, 0, 0];
    const pos = {x: 0, y: 0};
    const show = () => {
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
    };

    return {
        percentage: presencePercentage,
        mm: precipitationMM,
        date,
        pos,
        show,
    };
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
