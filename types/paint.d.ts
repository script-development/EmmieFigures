export interface Text {
    text: string,
    size: number,
    weight: string,
    color: string,
    font: string,
    align: CanvasTextAlign,
    baseline: CanvasTextBaseline,
    paint: 'text',
    pos: {x: number, y: number},
    angle?: number
}

export interface Line {
pos: {x1: number, y1: number, x2: number, y2: number},
color: string,
weight: number,
paint: 'line'
}

export interface Paint {
    Text,
    Line,
}
