export interface SketchApi {
    context: CanvasRenderingContext2D,
    setup: (event: SetupApi) => void,
    draw: (event: DrawApi) => void,
    loop: () => void,
    noLoop: () => void,
}

export interface SetupApi {
    size: (width: number, height: number) => void,
    position: (position: string) => void,
    backgroundColor: (color: number) => void,
    border: (border: string) => void,
    textFont: (type: string) => void,
    textSize: (size: number) => void,
}

export interface DrawApi {
    strokeWeight: (num: number) => void,
    stroke: (...args) => void,
    noStroke: () => void,
    fill: (...args) => void,
    noFill: () => void,
    line: (x1: number, y1: number, x2: number, y2: number) => void,
    rect: (x: number, y: number, w: number, h: number) => void,
    clear: () => void,
    text: (string, x: number, y: number) => void,
}

export interface SketchProperties {
    setup?: setupApi,
    draw?: DrawApi,
}