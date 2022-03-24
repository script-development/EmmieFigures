export interface Sketch {
    context: CanvasRenderingContext2D,
    update: (script: (delta: number) => void) => void,
    render: (script: (interpolate: number) => void) => void,
}

export interface SketchOptions {
    size?: "full",
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    pos?: "center"|"absolute",
}
