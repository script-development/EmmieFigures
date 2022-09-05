import { Line, Text } from "./paint";

export interface GraphOption {
    id: number,
    name: string,
    active: boolean,
}

export interface AxisProperties {
    title: string,
    unitOfMeasure: string,
    steps: number,
    data: {
            date: string,
            value: number,
        }[],
}

export interface GraphData {
    title: string,
    unitOfMeasure: string,
    steps: number,
    data: {
            date: string,
            value: number,
        }[],
}

export interface GraphUnitsElement {
    units: Text[],
    max: number,
    min: number,
    lengthX: number,
    lengthY: number,
    startX: number,
    startY: number,
    offset: Vec4d,
}

export interface GraphElements {
    [key: string],
    x: Line,
    y: Line,
    xTitle: Text,
    yTitle: Text,
    mainTitle: Text,
    xUnits: GraphUnitsElement,
    yUnits: GraphUnitsElement,
}

export interface Stats {
    update: () => void,
    show: () => void,
    // setX: (xUnits: Graph['xUnits'], yUnits: Graph['yUnits'], dataX: GraphData) => void,
}

export interface Stat {
    pos: {x: number, y: number},
    valueX: number,
    valueY: number,
    date: string,
    id: number,
    show: () => void,
    update: () => void,
}

