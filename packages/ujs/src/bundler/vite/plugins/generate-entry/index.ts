import fs from 'node:fs'
import { resolve } from 'node:path'
import { emptyDir } from '@ujs/utils'

import { createMainContent, createAppVueContent } from './main'
import {
  runTimeDirectory,
  mainFile,
  appVue,
  routerFile,
  mainHtml,
} from './config'
import { getRoutes, getRouteComponents } from './router'
import { createHtml } from '../html/create-html'

import type { ResolvedConfig, CustomViteConfig } from '../../../../config/index'

export default function createRunTimeMain() {
  return {
    name: 'vite-plugin-ujs-runtime-main',
    async config(config: CustomViteConfig) {
      const rootPath = resolve(process.cwd(), runTimeDirectory)
      if (fs.existsSync(rootPath)) {
        emptyDir(rootPath)
      } else if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath)
      }
      // app.vue文件写入
      generateAppVueFile()
      // 入口文件写入
      generateMainFile()
      // 写入router文件
      generateRouteFile(config)
      // 写入html
      generateMainHtml(config.ujsConfig)
    },
  }
}

async function generateMainHtml(config: ResolvedConfig) {
  const rootPath = resolve(process.cwd())
  const htmlContent = await createHtml(config)
  generateFile({
    path: rootPath,
    fileName: mainHtml,
    content: htmlContent,
  }).catch((e) => {
    console.log('Failed to write entry file', e)
  })
}

function generateAppVueFile() {
  const rootPath = resolve(process.cwd(), runTimeDirectory)
  const appVueContent = createAppVueContent()
  generateFile({
    path: rootPath,
    fileName: appVue,
    content: appVueContent,
  }).catch((e) => {
    console.log('Failed to write entry file', e)
  })
}

function generateMainFile() {
  const rootPath = resolve(process.cwd(), runTimeDirectory)
  const content = createMainContent()
  generateFile({
    path: rootPath,
    fileName: mainFile,
    content: content,
  }).catch((e) => {
    console.log('Failed to write entry file', e)
  })
}

async function generateRouteFile(config: ResolvedConfig) {
  const rootPath = resolve(process.cwd(), '.ujs')
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
  generateFile({
    path: rootPath,
    fileName: routerFile,
    content: routerContent,
  }).catch((e) => {
    console.log('Failed to write router file', e)
  })
}

function generateFile(opt: {
  path: string
  fileName: string
  content: string
}) {
  return new Promise((_resolve, _reject) => {
    const { path, fileName, content } = opt
    fs.writeFile(resolve(path, fileName), content, 'utf8', (err) => {
      ;(err && _reject(err)) || _resolve(true)
    })
  })
}
