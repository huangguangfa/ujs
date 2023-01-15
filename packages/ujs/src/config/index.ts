import path from 'node:path'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import colors from 'picocolors'
import { DEFAULT_CONFIG_FILES } from '../common/constants'
import { lookupFile, dynamicImport } from '../utils'
import type { UserConfig as viteConfig } from 'vite'

import { build } from 'esbuild'
const _require = createRequire(import.meta.url)

export type ViteUserConfig = viteConfig

export interface UserConfig {
  base?: string
  publicPath?: string
  headScripts?: Array<String>
  viteConfig?: viteConfig
  plugins?: any
  mode?: string
  root?: string
}

export type ResolvedConfig = Readonly<
  Omit<UserConfig, 'plugins'> & {
    env?: string
    configFile: string | undefined | false
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
  // 获取开始时间
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
    // 加载用户bundled产物
    const userConfig = await loadConfigFromBundledFile(
      resolvedPath,
      bundled.code,
      isESM
    )
    console.log(colors.gray(`load configuration file：${getTime()}`))
    const config = await (typeof userConfig === 'function'
      ? userConfig(configEnv)
      : userConfig)
    return {
      path: resolvedPath,
      config,
      dependencies: bundled.dependencies, // config bundle 依赖
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
      // 直接通过import(filePath)的方式把临时地址的js导出的内容返回出去
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
    // 代理、重写 => 自定义+定制化处理
    const defaultLoader = _require.extensions[loaderExt]!
    _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
      if (filename === realFileName) {
        //  对 js文件进行编译加载、这里涉及node对第三方js的加载编译流程了、需要有这方面的知识储备才行
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
