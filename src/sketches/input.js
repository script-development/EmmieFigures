/** @param {CanvasRenderingContext2D} context */
export const Mouse = context => {
    const properties = {
        x: 0,
        y: 0,
    };
    const rect = context.canvas.getBoundingClientRect();
    document.addEventListener('mousemove', evt => {
        properties.x = evt.clientX - rect.left;
        properties.y = evt.clientY - rect.top;
    });
    return properties;
};
