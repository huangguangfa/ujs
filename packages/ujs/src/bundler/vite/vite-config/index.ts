import { resolveVitePlugins } from '../plugins'
import { resolveAliasConfig } from '../alias'
import type { ViteUserConfig, ResolvedConfig } from '../../../config'

export async function resolveViteConfig(
  config: ResolvedConfig
): Promise<ViteUserConfig> {
  const userViteConfig = config.viteConfig || {}
  const defaultConfig = {
    __VUE_OPTIONS_API__: false,
    ...userViteConfig,
  }
  return {
    ...defaultConfig,
    routes: config.routes,
    ujsConfig: config,
    plugins: [...(await resolveVitePlugins(defaultConfig, config))],
    resolve: {
      ...(defaultConfig.resolve || {}),
      alias: resolveAliasConfig(defaultConfig.resolve?.alias),
    },
    server: {
      ...defaultConfig.server,
      middlewareMode: true, // 以中间件的形式创建服务
    },
  }
}
