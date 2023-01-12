import * as fs from 'node:fs'
import * as path from 'node:path'
import { deepMerge } from './deepMerge'
import { sortDependencies } from './sortDependencies'

/**
 * 递归遍历目录得到目录下的文件
 * @param  templateSrc 需要copy的模版地址
 * @param  projectRootPath copy到的目标地址
 */
export function generateTemplate(templateSrc: string, projectRootPath: string) {
  const stats = fs.statSync(templateSrc)
  if (stats.isDirectory()) {
    if (path.basename(templateSrc) === 'node_modules') return
    // 目录递归进去找文件
    fs.mkdirSync(projectRootPath, { recursive: true })
    for (const file of fs.readdirSync(templateSrc)) {
      generateTemplate(
        path.resolve(templateSrc, file),
        path.resolve(projectRootPath, file)
      )
    }
    return
  }
  const filename = path.basename(templateSrc)

  if (filename === 'package.json' && fs.existsSync(projectRootPath)) {
    const existing = JSON.parse(fs.readFileSync(projectRootPath, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(templateSrc, 'utf8'))
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    fs.writeFileSync(projectRootPath, JSON.stringify(pkg, null, 2) + '\n')
    return
  }
  if (filename.startsWith('_')) {
    projectRootPath = path.resolve(
      path.dirname(projectRootPath),
      filename.replace(/^_/, '.')
    )
  }
  // 合并用户的
  if (filename === '_gitignore' && fs.existsSync(projectRootPath)) {
    const existing = fs.readFileSync(projectRootPath, 'utf8')
    const newGitignore = fs.readFileSync(templateSrc, 'utf8')
    fs.writeFileSync(projectRootPath, existing + '\n' + newGitignore)
    return
  }
  fs.copyFileSync(templateSrc, projectRootPath)
}
