import { createServer } from 'vite'

import type { ViteUserConfig } from '../../config'
import type { HttpOptions } from '../htpp-option'

export async function createViteServer(httpConfig: HttpOptions | undefined) {
  const viteConfig = resolveViteConfig(httpConfig)
  const viteConfigServer = { ...viteConfig.server };
  
  return createServer({
    ...viteConfig,
    server: {
      ...viteConfigServer,
      middlewareMode: true,
    },
  })
}

function resolveViteConfig(
  httpConfig: HttpOptions | undefined
): ViteUserConfig {
  if (!httpConfig) return {}
  
  return {
    ...httpConfig.viteConfig,
    plugins: [
        
    ]
  }
}
