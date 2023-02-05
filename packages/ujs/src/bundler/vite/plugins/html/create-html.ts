import { isArray } from '@ujs/utils'
import type { ResolvedConfig } from '../../../../config'

const _bodyScripts = ['<script src="./index.ts" type="module"></script>']

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
