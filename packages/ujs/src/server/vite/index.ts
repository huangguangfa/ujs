import { createServer } from 'vite'
import { resolveVitePlugins } from './plugins'

import type { ViteUserConfig, ResolvedConfig } from '../../config'
import type { HttpOptions } from '../htpp-option'

export async function createViteServer(
  httpConfig: HttpOptions | undefined,
  config: ResolvedConfig
) {
  const viteConfig = await resolveViteConfig(httpConfig, config)
  const viteConfigServer = { ...viteConfig.server }

  return createServer({
    ...viteConfig,
    server: {
      ...viteConfigServer,
      middlewareMode: true,
    },
  })
}

async function resolveViteConfig(
  httpConfig: HttpOptions | undefined,
  config: ResolvedConfig
): Promise<ViteUserConfig> {
  if (!httpConfig) return {}
  const defaultConfig = {
    __VUE_OPTIONS_API__: false,
    ...httpConfig.viteConfig,
  }
  return {
    ...defaultConfig,
    routes: config.routes,
    plugins: [...(await resolveVitePlugins(httpConfig.viteConfig, config))],
  }
}
