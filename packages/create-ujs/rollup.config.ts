import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import copy from 'rollup-plugin-copy'

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
    },
    output: {
      ...sharedNodeOptions.output,
      sourcemap: !isProduction,
    },
    external: ['rollup', 'prompts'],
    plugins: createNodePlugins(isProduction, !isProduction),
  })
}

function createNodePlugins(
  isProduction: boolean,
  sourceMap: boolean
): Plugin[] {
  return [
    babel({ babelHelpers: 'bundled' }),
    copy({
      targets: [
        {
          src: 'src/template',
          dest: 'dist',
        },
      ],
    }),
    typescript({
      sourceMap,
      declaration: true,
      declarationDir: path.resolve(__dirname, 'dist'),
      emitDeclarationOnly: true,
      noEmitOnError: true,
    }),
    commonjs(),
  ]
}

export default (commandLineArgs: any): RollupOptions[] => {
  const isDev = commandLineArgs.watch
  const isProduction = !isDev

  return defineConfig([createNodeConfig(isProduction)])
}
