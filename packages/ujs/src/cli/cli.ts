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
    console.log(colors.green('执行dev指令'))
    const { createServer } = await import('../server')
    await createServer()
  })

// build
cli
  .command('build [root]', 'build for production')
  .option('--target <target>', `[string] transpile target (default: 'modules')`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option('-w, --watch', `[boolean] rebuilds when modules have changed on disk`)
  .action(async () => {
    console.log(colors.red('执行build指令'))
  })

cli.help()
cli.version(!!pkg && JSON.parse(pkg).version)
cli.parse()
