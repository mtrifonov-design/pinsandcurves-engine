import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [glsl()],
  base: '/pinsandcurves-engine/',
})
