import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: false,
  clean: true,
  dts: true,
})
