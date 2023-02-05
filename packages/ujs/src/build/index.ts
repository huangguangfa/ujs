import { resolveConfig } from '../config'
import { createBundlerViteBuild } from '../bundler/vite'

import type { InlineConfig } from '../config'

export async function build(inlineConfig: InlineConfig = {}) {
  // get config
  const config = await resolveConfig(inlineConfig, 'build', 'production')
  await createBundlerViteBuild(config)
}
