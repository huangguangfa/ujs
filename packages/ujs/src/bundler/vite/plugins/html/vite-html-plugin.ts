import chalk from 'chalk'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mainHtml } from '../generate-entry/config'

import type { Plugin } from 'vite'

export default function ViteHtmlPlugin(): Plugin {
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
              const htmlPath = resolve(process.cwd(), mainHtml)
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
  }
}
