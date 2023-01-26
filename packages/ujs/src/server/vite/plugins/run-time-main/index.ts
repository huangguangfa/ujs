import fs from 'node:fs'
import { resolve } from 'node:path'
import { emptyDir } from '@ujs/utils'

import { createMainContent, createAppVueContent } from './main'
import { mainFile, appVue, routerFile } from './config'
import { getRoutes, getRouteComponents } from './router'

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
      // 写入router文件
      const routes = await getRoutes(config)
      const routeComponents = await getRouteComponents({
        routes,
        prefix: '',
      })
      const routerContent = `
      export async function getRoutes() {
        return {
          routes:${JSON.stringify(routes)},
          routeComponents:${routeComponents}
        }
      }
      `
      fs.writeFile(
        resolve(rootPath, routerFile),
        routerContent,
        'utf8',
        (err) => {
          if (err) {
            console.log(`router.ts写入失败${err.message}`)
          }
        }
      )
    },
  }
}
