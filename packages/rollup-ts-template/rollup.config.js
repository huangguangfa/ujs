import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'index.es',
      file: 'dist/index.es.js',
      format: 'es',
    },
    {
      name: 'index.cjs',
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
  ],
  plugins: [babel(), typescript({})],
}
