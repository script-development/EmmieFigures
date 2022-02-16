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
    weatherData: Object;
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

export type ErrorBag = {
    default: string;
    [key: string]: string;
};