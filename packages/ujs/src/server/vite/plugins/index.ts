import vue from '@vitejs/plugin-vue'
import ViteHtmlPlugin from './html/vite-html-plugin'
import createRunTimeMain from './run-time-main'

import type { ResolvedConfig } from '../../../config'

export function getUjsVitePlugins(config: ResolvedConfig) {
  return [vue(), createRunTimeMain(), ViteHtmlPlugin(config)]
}
