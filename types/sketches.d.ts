export interface Sketch {
    context: CanvasRenderingContext2D,
    update: (script: (delta: number) => void) => void,
    render: (script: (interpolate: number) => void) => void,
    mouse: () => Globals["mouse"],
    onResize: (script: () => void) => void,
}

export interface Globals {
    mouse: {
        x: number,
        y: number,
    },
    canvas: {
        width: number,
        height: number,
        top: number,
        left: number,
    },
}
