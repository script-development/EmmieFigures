export interface Sketch {
    context: CanvasRenderingContext2D,
    globals: Globals,
    update: (script: (delta: number) => void) => void,
    render: (script: function) => void,
    size: (width: number, height: number) => void,
    centerCanvas: () => void,
    mouse: () => void,
}

export interface Globals {
    width: number,
    height: number,
    mouseX: number,
    mouseY: number,
}
