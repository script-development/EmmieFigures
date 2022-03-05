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
