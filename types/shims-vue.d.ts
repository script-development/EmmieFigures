// is used when importing from vue-files, so that typescript can declare the type
// https://github.com/vuejs/vue-next-webpack-preview/issues/5
declare module '*.vue' {
    import {ComponentOptions} from 'vue';
    const component: ComponentOptions;
    export default component;
}
