import type { UserConfig, ViteUserConfig } from '../config'
export interface HttpOptions {
  viteConfig: ViteUserConfig
}

export async function resolveHtppOptions(
  config: UserConfig
): Promise<HttpOptions | undefined> {
  if (!config) return undefined
  return {
    viteConfig: {
      ...config.viteConfig,
    },
  }
}
