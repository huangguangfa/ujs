import { cac } from 'cac'
import colors from 'picocolors'
import { lookupFile } from '../utils'
const pkg = lookupFile('', ['package.json'])

const cli = cac('ujs')

// dev
cli
  .command('[root]', 'start dev server')
  .alias('serve')
  .alias('dev')
  .action(async () => {
    console.log(colors.green('【dev】-----执行dev指令'))
    const { createServer } = await import('../server')
    await createServer()
  })

// build
cli.command('build [root]', 'build for production').action(() => {
  console.log(colors.green('【build】-----执行build指令'))
})

// eject
cli
  .command('eject')
  .alias('e')
  .action(() => {
    console.log(colors.green('【eject】-----弹出运行配置'))
  })

cli.help()
cli.version(!!pkg && JSON.parse(pkg).version)
cli.parse()
