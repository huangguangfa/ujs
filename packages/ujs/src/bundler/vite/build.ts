import { resolve } from 'node:path'
import { resolveViteConfig } from './vite-config'
import { mainHtml, runTimeDirectory } from './plugins/generate-entry/config'

import type { ResolvedConfig, ViteUserConfig } from '../../config'

export async function resolveBuildConfig(
  config: ResolvedConfig
): Promise<ViteUserConfig> {
  const viteConfig = await resolveViteConfig(config)
  const ujsRootPath = resolve(process.cwd(), `${runTimeDirectory}/${mainHtml}`)
  const buildConfig = {
    ...viteConfig,
    build: {
      ...(viteConfig.build || {}),
      rollupOptions: {
        ...(viteConfig.build?.rollupOptions || {}),
        input: ujsRootPath,
      },
    },
  }
  return buildConfig
}
