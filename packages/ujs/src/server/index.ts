import { createViteServer } from './vite'
import { resolveConfig } from '../config'
import { resolveHtppOptions } from './htpp-option'

import type { InlineConfig } from '../config'

export async function createServer(inlineConfig: InlineConfig = {}) {
  // get config
  const config = await resolveConfig(inlineConfig, 'serve', 'development')
  console.log('--- config ----', config)

  // create server
  const httpsOptions = resolveHtppOptions(config)

  await createViteServer()
  console.log(httpsOptions)
}

export function restartServer() {}
