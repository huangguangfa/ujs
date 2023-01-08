import { resolveConfig } from '../config'
import type { InlineConfig } from '../config'

export async function createServer(inlineConfig: InlineConfig = {}) {
  await resolveConfig(inlineConfig, 'serve', 'development')
}

export function restartServer() {}
