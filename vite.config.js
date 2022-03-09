import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import ssr from 'vite-plugin-ssr/plugin';
import path from 'path';

const srcPath = path.resolve('./src');

export default defineConfig({
    plugins: [vue(), ssr()],
    resolve: {
        alias: {
            components: path.join(srcPath, 'components'),
            pages: path.join(srcPath, 'pages'),
            sketches: path.join(srcPath, 'sketches'),
            assets: path.join(srcPath, 'assets'),
            services: path.join(srcPath, 'services'),
        },
    },
});
