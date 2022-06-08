import { Vec2d } from "sketches/vectors"

export interface GraphData {
    title: string,
    unitOfMeasure: string,
    steps: number,
    data: {
            date: string,
            value: number,
        }[],
}

export interface GraphOption {
    id: number,
    name: string,
    active: boolean,
}

export interface GraphTextElement {
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

export interface GraphLineElement {
    pos: {x1: number, y1: number, x2: number, y2: number},
    color: string,
    weight: number,
    paint: 'line'
}

export interface GraphUnitsElement {
    units: GraphTextElement[],
    max: number,
    min: number,
    lengthX: number,
    lengthY: number,
    startX: number,
    startY: number,
    offset: Vec4d,
}

export interface GraphElements {
    x: GraphLineElement,
    y: GraphLineElement,
    xTitle: GraphTextElement,
    yTitle: GraphTextElement,
    mainTitle: GraphTextElement,
    xUnits: GraphUnitsElement,
    yUnits: GraphUnitsElement,
}

export interface Stats {
    update: () => void,
    show: () => void,
    setX: (xUnits: Graph["xUnits"], yUnits: Graph["yUnits"], dataX: GraphData) => void,
}

export interface Stat {
    seek: boolean,
    pos: {x: number, y: number},
    vel: {x: number, y: number},
    acc: {x: number, y: number},
    target: {x: number, y: number},
    maxSpeed: number,
    maxForce: number,
    valueX: number,
    valueY: number,
    date: string,
    id: number,
    color: number[],
    radius: number,
}

