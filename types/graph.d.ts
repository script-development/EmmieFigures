export interface Graph {
    show: () => void,
    xUnits: {
        show: () => void,
        minValue: number,
        maxValue: number,
        unitSX: number,
        length: number,
    },
    yUnits: {
        show: () => void,
        minValue: number,
        maxValue: number,
        unitSY: number,
        length: number,
    },
    setX: (dataX: GraphData) => this["xUnits"],
    resize: () => void,

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
    show: (interpolate?: number) => void,
    update: (delta?: number) => number,
    selected: () => void,
}

export interface GraphData {
    title: string,
    unitOfMeasure: string,
    data: [
        {
            date: string,
            value: number,

        }
    ]
}
