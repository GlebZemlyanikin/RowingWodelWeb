/* eslint-env node */
/* global process */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    base: process.env.VITE_BASE ?? '/RowingWodelWeb/',
    plugins: [react()],
    server: {
        fs: {
            allow: ['..'], // разрешить импорт из родительской директории
        },
    },
    resolve: {
        alias: {
            // '@shared': path.resolve(__dirname, '../shared') // удалено, shared больше не используется
        },
    },
});
