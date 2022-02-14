export interface SketchApi {
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    size: (width: number, height: number) => void,
    position: (position: string) => void,
    backgroundColor: (color: number) => void,
    border: (border: string) => void,
    draw: function,
}