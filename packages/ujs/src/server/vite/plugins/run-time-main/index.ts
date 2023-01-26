import fs from 'node:fs'
import { resolve } from 'node:path'
import { emptyDir } from '@ujs/utils'

import { createMainContent, createAppVueContent } from './main'
import { mainFile, appVue } from './config'
import { getRoutes } from './router'

export default function createRunTimeMain() {
  return {
    name: 'vite-plugin-ujs-runtime-main',
    async config(config) {
      const rootPath = resolve(process.cwd(), '.ujs')
      if (fs.existsSync(rootPath)) {
        emptyDir(rootPath)
      } else if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath)
      }
      const content = createMainContent()
      // 写入app.vue
      fs.writeFile(
        resolve(rootPath, appVue),
        createAppVueContent(),
        'utf8',
        (err) => {
          if (err) {
            console.log(`app.vue文件写入失败${err.message}`)
          }
        }
      )
      // 写入入口文件
      fs.writeFile(resolve(rootPath, mainFile), content, 'utf8', (err) => {
        if (err) {
          console.log(`.ujs入口文件写入失败${err.message}`)
        }
      })

      const routes = await getRoutes(config)
      console.log('--', routes)

      // 写入router文件
    },
  }
}
