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
    external: ['esbuild', 'rollup', 'vite', 'express', 'chalk'],
    plugins: createNodePlugins(isProduction, !isProduction),
  })
}

function createNodePlugins(
  isProduction: boolean,
  sourceMap: boolean
): Plugin[] {
  return [
    babel({ babelHelpers: 'bundled' }),
    typescript({
      sourceMap,
      declaration: true,
      declarationDir: path.resolve(__dirname, 'dist'),
      emitDeclarationOnly: true,
      noEmitOnError: true,
      filterRoot: './src',
    }),
    nodeResolve({ preferBuiltins: true }),
    json(),
    commonjs(),
  ]
}

export default (commandLineArgs: any): RollupOptions[] => {
  const isDev = commandLineArgs.watch
  const isProduction = !isDev

  return defineConfig([createNodeConfig(isProduction)])
}
