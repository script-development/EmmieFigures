import { Paint } from "./paint";

export interface Sketch {
    context: CanvasRenderingContext2D,
    grid?: Grid,
    paint: Paint,
    run: () => void,
    halt: () => void,
    mouse: () => {x: number, y: number},
};

export interface SketchOptions {
    size?: "full",
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    pos?: "center"|"absolute",
    rows?: number,
    cols?: number,
    grid?: boolean,
    border?: boolean,
    clear?: boolean,
    run?: boolean,
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