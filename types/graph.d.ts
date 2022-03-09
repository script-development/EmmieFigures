export interface Stat {
    pos: {x: number, y: number},
    percentage: number,
    mm: number,
    date: string,
    show: (interpolate?: number) => void,
    update: (delta?: number) => number,
    selected: () => void,
}

export interface Precipitation {
    date: string,
    mm: number,
}

export interface Presence {
    date: string,
    percentage: number,
}
