import { createHtml } from './create-html'
import type { Plugin } from 'vite'
import type { ResolvedConfig } from '../../../../config'

export default function ViteHtmlPlugin(config: ResolvedConfig): Plugin {
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
              const html = await createHtml(config)
              res.setHeader('Content-Type', 'text/html')
              res.end(await server.transformIndexHtml(req.url, html))
            } catch (e) {
              return next(e)
            }
          }
          next()
        })
      }
    },
  }
}
