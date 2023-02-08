import chalk from 'chalk'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mainHtml, runTimeDirectory } from '../generate-entry/config'

import type { Plugin } from 'vite'

export default function ViteHtmlPlugin(): Plugin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // let mainFileChunk: any
  return {
    name: 'vite-plugin-ujs-html',
    configureServer(server) {
      return () => {
        server.middlewares.use(async function kmiViteHtmlMiddleware(
          req,
          res,
          next
        ) {
          // 只处理html
          if (!req.url?.endsWith('.html') && req.url !== '/') {
            return next()
          }
          if (req.headers.accept?.includes('text/html')) {
            try {
              // 处理通用html
              const htmlPath = resolve(
                process.cwd(),
                `${runTimeDirectory}/${mainHtml}`
              )
              const htmlContent = readFileSync(htmlPath, 'utf-8')
              res.setHeader('Content-Type', 'text/html')
              res.end(await server.transformIndexHtml(req.url, htmlContent))
            } catch (e) {
              console.log(chalk.red('html模版注入异常'))
              return next(e)
            }
          }
          next()
        })
      }
    },
    // 入口文件ts写入html
    // buildStart() {
    //   const mainPath = resolve(process.cwd(), `${runTimeDirectory}/${mainFile}`)
    //   // 获取chunk
    //   mainFileChunk = this.emitFile({
    //     type: 'chunk',
    //     id: mainPath,
    //   })
    // },
    // generateBundle() {
    //   const mainScript = `<script src="./${this.getFileName(
    //     mainFileChunk
    //   )}" type="module"></script>`
    //   this.emitFile({
    //     type: 'asset',
    //     fileName: 'index.html',
    //     source: mainScript,
    //   })
    // },
  }
}
