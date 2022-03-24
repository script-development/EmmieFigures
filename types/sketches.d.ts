export interface Sketch {
    context: CanvasRenderingContext2D,
    update: (script: (delta: number) => void) => void,
    render: (script: (interpolate: number) => void) => void,
    start: () => void,
    stop: () => void,
    mouse: () => Globals["mouse"],
}

export interface SketchOptions {
    size?: "full",
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    pos?: "center"|"absolute",
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
