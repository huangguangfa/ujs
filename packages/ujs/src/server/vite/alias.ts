import { isObject } from '@ujs/utils'
import { dirname } from 'path'
import { createRequire } from 'node:module'
const _require = createRequire(import.meta.url)

import type { AliasOptions } from 'vite'

export function resolveAliasConfig(inlineAlias: AliasOptions | undefined) {
  inlineAlias = isObject(inlineAlias) ? inlineAlias : {}
  return {
    ...inlineAlias,
    ...resolveDefaultAlias(),
  }
}

function resolveDefaultAlias() {
  return {
    vue: resolveVuePath(),
  }
}

function resolveVuePath() {
  const vuePath = dirname(_require.resolve('vue/package.json'))
  return vuePath
}
