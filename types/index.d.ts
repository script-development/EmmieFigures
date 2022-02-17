import { PageContextBuiltIn } from "vite-plugin-ssr";

export interface Precipitation {
    day: string;
    precip: number;
}

export interface PageProps {}

export interface PageContext extends PageContextBuiltIn{
    documentProps: {
        title: string,
        description: string
    },
    params: Object<string, string>;
    url: string;
    weatherData: WeatherData;
    pageProps: PageProps;
    urlNormalized: string;
    urlParsed: {
        pathName: string;
        search: {
            [key: string]: string;
        } | null;
        hash: string | null;
    };
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
    source: string
}

export type ErrorBag = {
    default: string;
    [key: string]: string;
};