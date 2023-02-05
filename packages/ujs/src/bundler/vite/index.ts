import { createServer, build } from 'vite'
import { resolveViteConfig } from './vite-config'
import { resolveBuildConfig } from './build'

import type { ResolvedConfig } from '../../config'

// server
export async function createViteServer(config: ResolvedConfig) {
  const viteConfig = await resolveViteConfig(config)
  return createServer(viteConfig)
}

// build
export async function createBundlerViteBuild(config: ResolvedConfig) {
  const bunderBuildConfig = await resolveBuildConfig(config)
  await build(bunderBuildConfig)
}
