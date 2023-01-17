import { isArray } from '@ujs/utils'
import type { ResolvedConfig } from '../../../../config'

export function createHtml(config: ResolvedConfig) {
  const htmlContent = [
    `<!DOCTYPE html>
    <html>
    <head>`,
    createScriptTag(config.headScripts).join('\n'),
    `</head>
    <body>`,
    createScriptTag(config.bodyScripts).join('\n'),
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
      if (i.includes(scriptTagStart)) return i
      return `${scriptTagStart}${i}${scriptTagEnd}`
    })
  }
  return [scriptContent]
}
