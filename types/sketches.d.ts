export interface SketchApi {
    width: number;
    height: number;
    setup: (event: SetupApi) => void,
    draw: (event: DrawApi) => void,
}

export interface SetupApi {
    size: (width: number, height: number) => void,
    position: (position: string) => void,
    backgroundColor: (color: number) => void,
    border: (border: string) => void,
}

export interface DrawApi {
    strokeWeight: (num: number) => void,
    stroke: (num: number) => void,
    noStroke: () => void,
    fill: (num: number) => void,
    noFill: () => void,
    line: (x1: number, y1: number, x2: number, y2: number) => void,
    clear: () => void,
}

export interface SketchProperties {
    setup?: setupApi,
    draw?: DrawApi,
}