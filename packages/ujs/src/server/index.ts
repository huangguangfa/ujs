import http from 'http'
import express from 'express'
import { createViteServer } from '../bundler/vite'
import { resolveConfig } from '../config'
import { resolveHostname, resolveServerUrls, getDevBanner } from './utils'
import { defaultProt } from '../common/constants'
import chalk from 'chalk'

import type { InlineConfig } from '../config'

export type HttpServer = http.Server

export interface DevServer {
  httpServer: http.Server | null
  port: number
  listen(port?: number, isRestart?: boolean): Promise<DevServer>
  resolvedUrls?: ResolvedServerUrls
  runPort?: number
}

export interface ResolvedServerUrls {
  local: string[]
  network: string[]
}

export async function createServer(inlineConfig: InlineConfig = {}) {
  // get config
  const config = await resolveConfig(inlineConfig, 'serve', 'development')
  // create server
  const app = express()
  const viteServer = await createViteServer(config)

  // use vite via middleware way
  app.use(viteServer.middlewares)
  const httpServer = http.createServer(app)
  const port = config.server?.prot || defaultProt

  const server: DevServer = {
    httpServer,
    port,
    async listen() {
      // 启动服务
      await startServer(server, port)
      return server
    },
  }
  return server
}

async function startServer(server: DevServer, inlinePort: number) {
  const httpServer = server.httpServer
  if (!httpServer) {
    throw new Error('服务不存在，启动异常')
  }
  const port = inlinePort
  const hostname = await resolveHostname(undefined)
  try {
    const serverPort = await httpServerStart(httpServer, {
      port,
      host: hostname.host,
    })
    server.resolvedUrls = await resolveServerUrls(httpServer, {})
    server.runPort = serverPort
    const banner = getDevBanner(server.resolvedUrls)

    // 需要优化的地方
    console.log(banner.before)
    console.log(chalk.green('address') + ' -', banner.main)
    console.log(banner.after)
  } catch (e) {
    console.log('httpServerStart服务启动异常')
  }
}

export async function httpServerStart(
  httpServer: HttpServer,
  serverOptions: {
    port: number
    host: string | undefined
  }
): Promise<number> {
  let { port, host } = serverOptions
  return new Promise((resolve, reject) => {
    const onError = (e: Error & { code?: string }) => {
      if (e.code === 'EADDRINUSE') {
        httpServer.listen(++port, host)
      } else {
        httpServer.removeListener('error', onError)
        reject(e)
      }
    }
    httpServer.on('error', onError)
    httpServer.listen(port, host, () => {
      httpServer.removeListener('error', onError)
      resolve(port)
    })
  })
}

export function restartServer() {}
