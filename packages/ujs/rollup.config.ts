import path from 'node:path'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'

import type { Plugin, RollupOptions } from 'rollup'

const sharedNodeOptions = defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  output: {
    dir: path.resolve('dist'),
    entryFileNames: `node/[name].js`,
    chunkFileNames: 'node/chunks/dep-[hash].js',
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
      index: path.resolve('src/index.ts'),
      cli: path.resolve('src/cli/cli.ts'),
    },
    output: {
      ...sharedNodeOptions.output,
      sourcemap: !isProduction,
    },
    external: ['fsevents'],
    plugins: createNodePlugins(
      isProduction,
      !isProduction,
      isProduction ? false : path.resolve('dist/node')
    ),
  })
}

function createNodePlugins(
  isProduction: boolean,
  sourceMap: boolean,
  declarationDir: string | false
): Plugin[] {
  return [
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      sourceMap,
      declaration: declarationDir !== false,
      declarationDir: declarationDir !== false ? declarationDir : undefined,
    }),
  ]
}

export default (commandLineArgs: any): RollupOptions[] => {
  const isDev = commandLineArgs.watch
  const isProduction = !isDev

  return defineConfig([createNodeConfig(isProduction)])
}
