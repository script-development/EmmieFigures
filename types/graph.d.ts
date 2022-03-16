export interface Graph {
    show: () => void,
    xUnits: {
        min: number,
        max: number,
        unitMin: number,
        length: number,
    },
    yUnits: {
        min: number,
        max: number,
        unitMin: number,
        length: number,
    },
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
