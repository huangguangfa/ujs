import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  minify: false,
  clean: true,
  shims: false,
  sourcemap: true,
  target: 'es5',
  async onSuccess() {
    console.log('打包完成')
  },
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    }
  },
})
