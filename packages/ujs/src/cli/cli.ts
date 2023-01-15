import { cac } from 'cac'
import { lookupFile } from '../utils'
const pkg = lookupFile('', ['package.json'])

const cli = cac('ujs')

const devGradientBanner =
  '\u001b[38;2;189;255;243m正\u001b[39m\u001b[38;2;176;248;233m在\u001b[39m\u001b[38;2;163;241;223m执\u001b[39m\u001b[38;2;151;235;213m行\u001b[39m\u001b[38;2;138;228;203md\u001b[39m\u001b[38;2;125;221;194me\u001b[39m\u001b[38;2;112;214;184mv\u001b[39m\u001b[38;2;100;208;174m指\u001b[39m\u001b[38;2;87;201;164m令\u001b[39m\u001b[38;2;74;194;154m!\u001b[39m'
const ejectGradientBanner =
  '\u001b[38;2;255;95;109m正\u001b[39m\u001b[38;2;255;97;101m在\u001b[39m\u001b[38;2;255;104;98m执\u001b[39m\u001b[38;2;255;114;100m行\u001b[39m\u001b[38;2;255;125;102me\u001b[39m\u001b[38;2;255;136;103mj\u001b[39m\u001b[38;2;255;146;105me\u001b[39m\u001b[38;2;255;156;106mc\u001b[39m\u001b[38;2;255;166;108mt\u001b[39m\u001b[38;2;255;176;110m指\u001b[39m\u001b[38;2;255;186;111m令\u001b[39m\u001b[38;2;255;195;113m!\u001b[39m'

// dev
cli
  .command('[root]', 'start dev server')
  .alias('serve')
  .alias('dev')
  .action(async () => {
    console.log(devGradientBanner)
    const { createServer } = await import('../server')
    const server = await createServer()
    await server.listen()
  })

// build
cli.command('build [root]', 'build for production').action(async () => {
  const { build } = await import('../build')
  build()
})

// eject
cli
  .command('eject')
  .alias('e')
  .action(() => {
    console.log(ejectGradientBanner)
  })

cli.help()
cli.version(!!pkg && JSON.parse(pkg).version)
cli.parse()
