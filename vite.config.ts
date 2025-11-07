import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [glsl()],
  base: '/pinsandcurves-engine/',
    build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        helloWorld: resolve(__dirname, 'examples/helloWorld/index.html'),
        defaultTriangle: resolve(__dirname, 'examples/defaultTriangle/index.html'),
        defaultTriangleInstanced: resolve(__dirname, 'examples/defaultTriangleInstanced/index.html'),
        defaultTriangleInstancedUsedAsTexture: resolve(__dirname, 'examples/defaultTriangleInstancedUsedAsTexture/index.html'),
        gradient: resolve(__dirname, 'examples/gradient/index.html'),
      },
    },
  },
})
