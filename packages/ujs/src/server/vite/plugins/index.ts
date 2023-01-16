import ViteHtmlPlugin from './html/vite-html-plugin'

import type { ResolvedConfig } from '../../../config'

export function getUjsVitePlugins(config: ResolvedConfig) {
  return [ViteHtmlPlugin(config)]
}
