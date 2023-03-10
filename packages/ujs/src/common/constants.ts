export const DEFAULT_CONFIG_FILES = [
  'ujs.config.js',
  'ujs.config.ts',
  '.ujsrc.js',
  '.ujsrc.ts',
]

export const wildcardHosts = new Set([
  '0.0.0.0',
  '::',
  '0000:0000:0000:0000:0000:0000:0000:0000',
])

export const defaultProt = 3009

export const loopbackHosts = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0000:0000:0000:0000:0000:0000:0000:0001',
])
