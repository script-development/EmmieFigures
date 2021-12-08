import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vite';
import ssr from 'vite-plugin-ssr/plugin';

import path from 'path';

const srcPath = path.resolve('./');

export default defineConfig({
    plugins: [vue(), ssr()],
    resolve: {
        alias: {
            components: path.join(srcPath, 'components'),
            pages: path.join(srcPath, 'pages'),
        },
    },
});
