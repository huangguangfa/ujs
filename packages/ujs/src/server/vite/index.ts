import { createServer } from 'vite'
import { resolveViteConfig } from './vite-config'

import type { ResolvedConfig } from '../../config'

export async function createViteServer(config: ResolvedConfig) {
  const viteConfig = await resolveViteConfig(config)
  return createServer(viteConfig)
}
