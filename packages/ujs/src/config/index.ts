import path from 'node:path'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import colors from 'picocolors'
import { DEFAULT_CONFIG_FILES } from '../common/constants'
import { lookupFile, dynamicImport } from '../utils'
import type { UserConfig as viteConfig, PluginOption, Plugin } from 'vite'

import { build } from 'esbuild'
const _require = createRequire(import.meta.url)

export type ViteUserConfig = viteConfig & {
  routes?: any
  ujsConfig?: ResolvedConfig
}
export type VitePlugin = PluginOption | Plugin

export type CustomViteConfig = ResolvedConfig & { ujsConfig: ResolvedConfig }
export interface UserConfigServer {
  prot?: number
  https?: boolean
  host?: string
}

export interface UserConfig {
  base?: string
  publicPath?: string
  headScripts?: Array<string>
  bodyScripts?: Array<string>
  viteConfig?: viteConfig
  mode?: string
  root?: string
  server?: UserConfigServer
}

export interface ConfigRouter {
  path: string
  component: string
  wrappers?: any
}

export type ResolvedConfig = Readonly<
  Omit<UserConfig, 'plugins'> & {
    env?: string
    configFile: string | undefined | false
    routes?: Array<ConfigRouter>
  }
>

export interface InlineConfig extends UserConfig {
  configFile?: string | false
}
export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn

export interface ConfigEnv {
  command: 'build' | 'serve'
  mode: string
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any
}

export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig> {
  console.log('defaultMode', defaultMode)
  let config = inlineConfig
  let mode = inlineConfig.mode || defaultMode
  if (mode === 'production') {
    process.env.NODE_ENV = 'production'
  }
  if (command === 'serve' && process.env.NODE_ENV === 'production') {
    process.env.NODE_ENV = 'development'
  }
  let { configFile } = config
  const configEnv = {
    mode,
    command,
  }
  if (configFile !== false) {
    const loadResult = await loadConfigFromFile(
      configEnv,
      configFile,
      config.root
    )
    if (loadResult) {
      config = loadResult.config
      configFile = loadResult.path
    }
  }

  const resolved = {
    ...config,
    configFile,
  }

  return resolved
}

export async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd()
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null> {
  // ??????????????????
  const start = performance.now()
  const getTime = () => `${(performance.now() - start).toFixed(2)}ms`
  let resolvedPath: string | undefined
  if (configFile) {
    resolvedPath = path.resolve(configFile)
  } else {
    for (const filename of DEFAULT_CONFIG_FILES) {
      const filePath = path.resolve(configRoot, filename)
      if (!fs.existsSync(filePath)) continue
      resolvedPath = filePath
      break
    }
  }
  if (!resolvedPath) {
    console.log(colors.red(`config not found`))
    return null
  }
  let isESM = false
  if (/\.m[jt]s$/.test(resolvedPath)) {
    isESM = true
  } else if (/\.c[jt]s$/.test(resolvedPath)) {
    isESM = false
  } else {
    try {
      const pkg = lookupFile(configRoot, ['package.json'])
      isESM = !!pkg && JSON.parse(pkg).type === 'module'
    } catch (e) {}
  }

  try {
    const bundled = await bundleConfigFile(resolvedPath, isESM)
    // ????????????bundled??????
    const userConfig = await loadConfigFromBundledFile(
      resolvedPath,
      bundled.code,
      isESM
    )
    console.log(colors.gray(`load configuration file???${getTime()}`))
    const config = await (typeof userConfig === 'function'
      ? userConfig(configEnv)
      : userConfig)
    return {
      path: resolvedPath,
      config,
      dependencies: bundled.dependencies, // config bundle ??????
    }
  } catch (e) {
    throw e
  }
}

async function bundleConfigFile(
  fileName: string,
  isESM: boolean
): Promise<{ code: string; dependencies: string[] }> {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    outfile: 'out.js',
    write: false,
    target: ['node14.18', 'node16'],
    platform: 'node',
    bundle: true,
    format: isESM ? 'esm' : 'cjs',
    sourcemap: 'inline',
    metafile: true,
  })
  const { text } = result.outputFiles[0]
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  }
}

async function loadConfigFromBundledFile(
  fileName: string,
  bundledCode: string,
  isESM: boolean
): Promise<UserConfigExport> {
  if (isESM) {
    const fileBase = `${fileName}.timestamp-${Date.now()}`
    const fileNameTmp = `${fileBase}.mjs`
    const fileUrl = `${pathToFileURL(fileBase)}.mjs`
    fs.writeFileSync(fileNameTmp, bundledCode)
    try {
      // ????????????import(filePath)???????????????????????????js???????????????????????????
      return (await dynamicImport(fileUrl)).default
    } finally {
      try {
        fs.unlinkSync(fileNameTmp)
      } catch {
        console.log('deleteting')
      }
    }
  } else {
    const extension = path.extname(fileName)
    const realFileName = fs.realpathSync(fileName)
    const loaderExt = extension in _require.extensions ? extension : '.js'
    // ??????????????? => ?????????+???????????????
    const defaultLoader = _require.extensions[loaderExt]!
    _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
      if (filename === realFileName) {
        //  ??? js???????????????????????????????????????node????????????js??????????????????????????????????????????????????????????????????
        ;(module as NodeModuleWithCompile)._compile(bundledCode, filename)
      } else {
        defaultLoader(module, filename)
      }
    }
    delete _require.cache[_require.resolve(fileName)]
    const raw = _require(fileName)
    _require.extensions[loaderExt] = defaultLoader
    return raw.__esModule ? raw.default : raw
  }
}
