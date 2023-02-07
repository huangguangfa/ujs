import { resolve } from 'node:path'
import { resolveViteConfig } from './vite-config'
import { mainHtml } from './plugins/generate-entry/config'

import type { ResolvedConfig, ViteUserConfig } from '../../config'

export async function resolveBuildConfig(
  config: ResolvedConfig
): Promise<ViteUserConfig> {
  const viteConfig = await resolveViteConfig(config)
  const htmlPath = resolve(process.cwd(), mainHtml)
  const buildConfig = {
    ...viteConfig,
    build: {
      ...(viteConfig.build || {}),
      rollupOptions: {
        ...(viteConfig.build?.rollupOptions || {}),
        input: htmlPath,
      },
    },
  }
  return buildConfig
}
