import fs from 'node:fs'
import { resolve } from 'node:path'
import { emptyDir } from '@ujs/utils'

import { createMainContent } from './main'

// import { ViteUserConfig } from '../../../../config/index'
// userConfig: ViteUserConfig

export default function createRunTimeMain() {
  return {
    name: 'vite-plugin-ujs-runtime-main',
    config() {
      const rootPath = resolve(process.cwd(), '.ujs')
      if (fs.existsSync(rootPath)) {
        emptyDir(rootPath)
      } else if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath)
      }
      const content = createMainContent()
      fs.writeFile(resolve(rootPath, 'index.ts'), content, 'utf8', (err) => {
        if (err) {
          console.log(`.ujs入口文件写入失败${err.message}`)
        }
      })
    },
  }
}
