import react from '@vitejs/plugin-react-swc'
import path from "path"
import { defineConfig } from 'vite'
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr({
    include: '**/*.svg',
  })],
  build: {
    target: 'esnext'
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
