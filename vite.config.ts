import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        react(),
        splitVendorChunkPlugin(),
        svgr({
            include: '**/*.svg',
        }),
    ],
    build: {
        target: 'esnext',
    },
    server: {
        host: true,
        port: 3001,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
