import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * 递归遍历目录得到目录下的文件
 * @param  dir 查找的目录地址
 * @param  dirCallback 找到目录执行的外部callback
 * @param  fileCallback 找到文件执行的外部callback
 */
export function postOrderDirectoryTraverse(dir, dirCallback, fileCallback) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === '.git') {
      continue
    }
    const fullpath = path.resolve(dir, filename)
    // 是目录继续遍历
    if (fs.lstatSync(fullpath).isDirectory()) {
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      dirCallback(fullpath)
      continue
    }
    // 执行外部callback
    fileCallback(fullpath)
  }
}

export function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}
