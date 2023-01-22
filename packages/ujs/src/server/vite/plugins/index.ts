import ViteHtmlPlugin from './html/vite-html-plugin'
import createRunTimeMain from './run-time-main'

import type { ResolvedConfig } from '../../../config'

export function getUjsVitePlugins(config: ResolvedConfig) {
  return [createRunTimeMain(),ViteHtmlPlugin(config)]
}
