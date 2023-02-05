import { getUjsVitePlugins } from './plugins/index'
import type { ViteUserConfig, VitePlugin, ResolvedConfig } from '../../config'
export async function resolveVitePlugins(
  viteConfig: ViteUserConfig,
  config: ResolvedConfig
): Promise<Array<VitePlugin>> {
  return [...(viteConfig.plugins || []), ...getUjsVitePlugins(config)].filter(
    Boolean
  )
}
