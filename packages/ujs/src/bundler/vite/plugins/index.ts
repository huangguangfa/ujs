import vue from '@vitejs/plugin-vue'
import ViteHtmlPlugin from './html/vite-html-plugin'
import createRunTimeMain from './generate-entry'

import type { ResolvedConfig } from '../../../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUjsVitePlugins(config: ResolvedConfig) {
  return [vue(), createRunTimeMain(), ViteHtmlPlugin()]
}
