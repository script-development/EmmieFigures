import { GraphLineElement, GraphTextElement } from "./graph";

export interface Paint {
    clear: () => void,
    text: (element: GraphTextElement) => void,
    line: (element: GraphLineElement) => void,
};

export interface Sketch {
    context: CanvasRenderingContext2D,
    grid: Grid,
    start: () => void,
    stop: () => void,
};

export interface SketchOptions {
    size?: "full",
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    pos?: "center"|"absolute",
    rows? : number,
    cols? : number,
    border?: boolean,
    clear?: boolean,
};

export interface Grid {
    width: number,
    height: number,
    xUnits: number,
    yUnits: number,
    unitWidth: number,
    unitHeight: number,
    show: () => void,
};
