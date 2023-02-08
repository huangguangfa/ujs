import vue from '@vitejs/plugin-vue'
import ViteHtmlPlugin from './html/vite-html-plugin'
import createRunTimeMain from './generate-entry'
import deleteOutputFiles from './delete-output-files'

import type { ResolvedConfig } from '../../../config'

const tmpHtmlEntry = ['.ujs/index.html']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUjsVitePlugins(config: ResolvedConfig) {
  return [
    vue(),
    createRunTimeMain(),
    ViteHtmlPlugin(),
    deleteOutputFiles(Object.values(tmpHtmlEntry), (file) => {
      if (file.type === 'asset') {
      }
    }),
  ]
}
