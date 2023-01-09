import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'

import type { Plugin, RollupOptions } from 'rollup'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const sharedNodeOptions = defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  output: {
    dir: path.resolve(__dirname, 'dist'),
    entryFileNames: `[name].js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
    externalLiveBindings: false,
    freeze: false,
  },
  onwarn(warning, warn) {
    if (warning.message.includes('Package subpath')) {
      return
    }
    if (warning.message.includes('Use of eval')) {
      return
    }
    if (warning.message.includes('Circular dependency')) {
      return
    }
    warn(warning)
  },
})

function createNodeConfig(isProduction: boolean) {
  return defineConfig({
    ...sharedNodeOptions,
    input: {
      index: path.resolve(__dirname, 'src/index.ts'),
      cli: path.resolve(__dirname, 'src/cli/cli.ts'),
    },
    output: {
      ...sharedNodeOptions.output,
      sourcemap: !isProduction,
    },
    external: ['esbuild', 'rollup'],
    plugins: createNodePlugins(isProduction, !isProduction),
  })
}

function createNodePlugins(
  isProduction: boolean,
  sourceMap: boolean
): Plugin[] {
  return [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      sourceMap,
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'node',
      strict: true,
      declaration: true,
      noImplicitOverride: true,
      noUnusedLocals: true,
      esModuleInterop: true,
      useUnknownInCatchVariables: false,
      include: ['./', '../../types'],
      exclude: ['**/__tests__'],
      compilerOptions: {
        lib: ['ESNext', 'DOM'],
      },
    }),
    json(),
    commonjs(),
  ]
}

export default (commandLineArgs: any): RollupOptions[] => {
  const isDev = commandLineArgs.watch
  const isProduction = !isDev

  return defineConfig([createNodeConfig(isProduction)])
}
