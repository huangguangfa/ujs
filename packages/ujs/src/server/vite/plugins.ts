import type { ViteUserConfig, VitePlugin } from '../../config'
export async function resolveVitePlugins(
  viteConfig: ViteUserConfig
): Promise<Array<VitePlugin>> {
  return [...(viteConfig.plugins || [])].filter(Boolean)
}
