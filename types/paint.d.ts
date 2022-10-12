export interface Paint {
    text: (element: Text) => void,
    line: (element: Line) => void,
    clear: () => void,
};

export interface Line {
    pos: {x1: number, y1: number, x2: number, y2: number},
    color: string,
    weight: number,
    type: string,
}

export interface LineOptions {
    x1?: number,
    y1?: number,
    x2?: number,
    y2?: number,
    color?: string,
    weight?: number,
}

export interface Text {
    pos: {x: number, y: number},
    msg: string,
    size: number,
    weight: string,
    color: string,
    font: string,
    align: CanvasTextAlign,
    baseline: CanvasTextBaseline,
    type: string,
}

export interface TextOptions {
    x?: number,
    y?: number,
    msg?: string,
    size?: number,
    weight?: string,
    color?: string,
    font?: string,
    align?: CanvasTextAlign,
    baseline?: CanvasTextBaseline,
}