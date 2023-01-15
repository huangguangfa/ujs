import type { UserConfig, ViteUserConfig } from '../config'
export interface HttppServerOptions {
  prot?: number
}

export async function resolveHtppOptions(
  config: UserConfig
): Promise<ViteUserConfig | undefined> {
  if (!config) return undefined
  return {
    ...config.viteConfig,
  }
}
