import fs from 'node:fs'
import path from 'node:path'

interface LookupFileOptions {
  pathOnly?: boolean
  rootDir?: string
  predicate?: (file: string) => boolean
}
/**
 * 查找某个文件
 * @param  dir 查找的目录
 * @param  formats 查找文件的昵称，可以多个
 * @param options 条件、支持外部callback check
 */
export function lookupFile(
  dir: string,
  formats: string[],
  options?: LookupFileOptions
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const result = options?.pathOnly
        ? fullPath
        : fs.readFileSync(fullPath, 'utf-8')
      if (!options?.predicate || options.predicate(result)) {
        return result
      }
    }
  }
  const parentDir = path.dirname(dir)
  if (
    parentDir !== dir &&
    (!options?.rootDir || parentDir.startsWith(options?.rootDir))
  ) {
    return lookupFile(parentDir, formats, options)
  }
}

export const dynamicImport = new Function('file', 'return import(file)')
