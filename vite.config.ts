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
        helloWorld: resolve(__dirname, 'examples/hello-world/index.html'),
        uniforms: resolve(__dirname, 'examples/uniforms-example/index.html'),
        instancing: resolve(__dirname, 'examples/instancing-example/index.html'),
        texture: resolve(__dirname, 'examples/texture-example/index.html'),
        gradient: resolve(__dirname, 'examples/gradient/index.html'),
      },
    },
  },
})
