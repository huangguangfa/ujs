import { resolveConfig } from '../config'
import { build as bundlerViteBuild } from 'vite'

import type { InlineConfig, ResolvedConfig } from '../config'

export async function build(inlineConfig: InlineConfig = {}) {
  // get config
  const config = await resolveConfig(inlineConfig, 'build', 'production')
  const bunderBuildConfig = resolveBuildConfig(config, inlineConfig)
  const stats = await bundlerViteBuild()
  console.log(stats, bunderBuildConfig)
}

function resolveBuildConfig(
  config: ResolvedConfig,
  inlineConfig: InlineConfig
) {
  console.log(config, inlineConfig)
  return {}
}
