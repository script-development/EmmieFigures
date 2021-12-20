import vue from '@vitejs/plugin-vue';
import ssr from 'vite-plugin-ssr/plugin';
import path from 'path';

const srcPath = path.resolve('./src');

export default {
    plugins: [vue(), ssr()],
    resolve: {
        alias: {
            components: path.join(srcPath, 'components'),
            pages: path.join(srcPath, 'pages'),
            p5js: path.join(srcPath, 'p5js'),
        },
    },
};
