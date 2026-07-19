import {resolve} from 'path'
import {defineConfig} from 'vite'
import pkg from "./package.json"
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            // global variable for browser <script> usage; must be a valid identifier
            name: 'NumberAdapter',
            fileName: pkg.name,
            formats: ['es', 'umd'],
        },
        target: 'es2020',
    },
    plugins: [
        dts(),
    ],
})
