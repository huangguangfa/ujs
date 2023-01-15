import { resolveConfig } from '../config'
import type { InlineConfig } from '../config'

export async function createServer(inlineConfig: InlineConfig = {}) {
  const config = await resolveConfig(inlineConfig, 'serve', 'development')
  // server vite
  console.log('get conifg', config)
}

export function restartServer() {}
