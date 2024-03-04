import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/src/app.ts',
            ssr: 'resources/src/ssr.ts',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        eslint({
            fix: true,
            include: ['resources/src/**/*.ts', 'resources/src/**/*.js', 'resources/src/**/*.vue'],
        })
    ],
    resolve: {
        alias: [
            { find: "@", replacement: path.resolve(process.cwd(), 'resources/src') },
            { find: /~(.+)/, replacement: path.join(process.cwd(), 'node_modules/$1') },
            { find: "ziggy", replacement: path.join(process.cwd(), 'vendor/tightenco/ziggy/src/js') },
        ]
    },
});
