import { PageContextBuiltIn } from "vite-plugin-ssr";

export interface PageProps {
    // menu: Menu[];
    // footer: Footer;
    // language: Language;
    // urlPathname: string;
    // parsedUrl: string;
    // title: string;
    // description: string;
    // accessToken: string;
    // user?: User;
    // page?: Page;
    // savedJobs: number[];
    // isMobileRequest: boolean;
    // job?: FullJob;
}

export interface PageContext extends PageContextBuiltIn{
    documentProps: {
        title: string,
        description: string
    }
    // params: Object<string, string>;
    // url: string;
    // pageProps: PageProps;
    // urlNormalized: string;
    // urlParsed: {
    //     pathName: string;
    //     search: {
    //         [key: string]: string;
    //     } | null;
    //     hash: string | null;
    // };
}