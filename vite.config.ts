import {resolve} from 'path'
import {defineConfig} from 'vite'
import pkg from "./package.json"
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: pkg.name,
            fileName: pkg.name,
        },
    },
    plugins: [
        dts(),
    ],
})
