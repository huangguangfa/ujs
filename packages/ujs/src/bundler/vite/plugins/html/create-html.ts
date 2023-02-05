import { isArray } from '@ujs/utils'
import { resolve } from 'node:path'
import { runTimeDirectory, mainFile } from '../generate-entry/config'
import type { ResolvedConfig } from '../../../../config'

const _bodyScripts = []

export function createHtml(config: ResolvedConfig) {
  const htmlContent = [
    `<!DOCTYPE html>
    <html>
    <head>`,
    createScriptTag(config.headScripts).join('\n'),
    `</head>
    <body>
    <div id="app"></div>`,
    createScriptTag(config.bodyScripts).join('\n'),
    createScriptTag(_bodyScripts).join('\n'),
    getMainJs(),
    `</body>
    </html>`,
  ]
    .filter(Boolean)
    .join('\n')
  return htmlContent
}

function createScriptTag(scriptContent: Array<string> | undefined) {
  if (scriptContent === void 0) return []
  if (isArray(scriptContent)) {
    const scriptTagStart = '<script>'
    const scriptTagEnd = '</script>'
    return scriptContent.map((i) => {
      if (i.includes(scriptTagEnd)) return i
      return `${scriptTagStart}${i}${scriptTagEnd}`
    })
  }
  return [scriptContent]
}

function getMainJs() {
  const mainJsPath = resolve(process.cwd(), `${runTimeDirectory}/${mainFile}`)
  return `<script src="${mainJsPath}" type="module"></script>`
}
