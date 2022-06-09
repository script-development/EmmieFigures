/** @param {CanvasRenderingContext2D} context */
export default context => {
    const properties = {
        width: context.canvas.width,
        height: context.canvas.height,
        xUnits: 32,
        yUnits: 18,
        unitWidth: context.canvas.width / 32,
        unitHeight: context.canvas.height / 18,
    };
    const show = () => {
        context.lineWidth = 1;
        context.strokeStyle = 'gray';
        context.beginPath();
        for (let y = 0; y <= properties.yUnits; y++) {
            for (let x = 0; x <= properties.xUnits; x++) {
                // horizontal lines
                context.moveTo(0, y * properties.unitHeight + 0.5);
                context.lineTo(properties.width, y * properties.unitHeight + 0.5);
                // vertical lines
                context.moveTo(x * properties.unitWidth + 0.5, 0);
                context.lineTo(x * properties.unitWidth + 0.5, properties.height);
            }
        }
        context.stroke();
    };

    return {
        properties,
        show,
    };
};
