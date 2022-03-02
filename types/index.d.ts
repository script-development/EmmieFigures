import { PageContextBuiltIn } from "vite-plugin-ssr";

export interface Precipitation {
    day: string,
    precip: number,
}

export interface Presence {
    day: string,
    percentage: number,
}

export interface PageProps {}

export interface PageContext extends PageContextBuiltIn{
    documentProps: {
        title: string,
        description: string,
    },
    params: Object<string, string>,
    url: string,
    weatherData: Array<WeatherData>,
    reportData: {
        reportsForMonth: Array<ReportData>,
        message: string,
    },
    pageProps: PageProps,
    urlNormalized: string,
    urlParsed: {
        pathName: string,
        search: {
            [key: string]: string,
        } | null,
        hash: string | null,
    },
}

export interface ReportData {
    morning_schedule_id: number | null,
    afternoon_schedule_id: number | null,
    evening_schedule_id: number | null,
    morning_present: number | null,
    afternoon_present: number | null,
    evening_present: number | null,
    date: string,
}

export interface WeatherData {
    datetime: string,
    datetimeEpoch: number,
    tzoffset: number,
    tempmax: number,
    tempmin: number,
    temp: number,
    feelslikemax: number,
    feelslikemin: number,
    feelslike: number,
    dew: number,
    humidity: number,
    precip: number,
    precipprob: null,
    precipcover: number,
    preciptype: null,
    snow: null,
    snowdepth: null,
    windgust: number,
    windspeed: number,
    winddir: number,
    pressure: number,
    cloudcover: number,
    visibility: number,
    solarradiation: number,
    solarenergy: number,
    uvindex: number,
    sunrise: string,
    sunriseEpoch: number,
    sunset: number,
    sunsetEpoch: number,
    moonphase: number,
    conditions: string,
    description: string,
    icon: string,
    stations: Array<string>,
    source: string,
}

export type ErrorBag = {
    default: string,
    [key: string]: string,
}