export interface Options {
    trendLines: Trendlines,
    weatherTypes: WeatherTypes,
}

// export type TrendlineKeys = 'none'|'linear-regression'|'loess-regression';
export type TrendlineKeys = 'none'|'linear-regression'|'loess-regression';

export interface TrendLines {
    [key: TrendLineKeys],
    name: string,
}

export type WeatherTypeKeys = 'precip'|'temp'|'windspeed'|'cloudcover'|'pressure';
export interface WeatherTypes {
    [key: WeatherTypeKeys],
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
    [key: string],
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

