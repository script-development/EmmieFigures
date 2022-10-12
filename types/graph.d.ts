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

export interface Stats {
    update: () => void,
    show: () => void,
    setX: (xUnits: Graph["xUnits"], yUnits: Graph["yUnits"], dataX: GraphData) => void,
}

export interface Stat {
    pos: {x: number, y: number},
    valueX: number,
    valueY: number,
    date: string,
    id: number,
    show: (interpolate?: number) => void,
    update: (delta?: number) => void,
}

