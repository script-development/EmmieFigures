export interface Stat {
    pos: {x: number, y: number},
    percentage: number,
    mm: number,
    date: string,
    show: () => void,
    inside: ({x: number, y: number}) => void,
}

export interface Precipitation {
    date: string,
    mm: number,
}

export interface Presence {
    date: string,
    percentage: number,
}
