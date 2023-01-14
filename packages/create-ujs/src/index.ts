#!/usr/bin/env node
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import prompts from 'prompts'
import { green, bold, red } from 'kolorist'

import { emptyDir } from './utils'
import { generateTemplate } from './generate'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function init() {
  console.log()
  console.log(bold(green('create ujs cli ~')))
  console.log()
  const cwd = process.cwd()
  const argv = minimist(process.argv.slice(2), {
    string: ['_'],
    boolean: true,
  })
  let targetDir = 'ujs-project'
  const defaultProjectName = 'ujs-project'
  let result: {
    projectName?: string
    needsAppointmentRouter?: boolean
    needsTypeScript?: boolean
    needsKsUi?: boolean
    needsKsUtils?: boolean
    projectType?: boolean
  } = {}
  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: 'text',
          message: '输入您的项目名称:',
          initial: defaultProjectName,
          onState: (state) =>
            (targetDir = String(state.value).trim() || defaultProjectName),
        },
        {
          name: 'needsAppointmentRouter',
          type: 'toggle',
          message: '是否开启约定式路由？',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsTypeScript',
          type: 'toggle',
          message: '是否启用typescript',
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsKsUi',
          type: 'toggle',
          message: '是否需要KsUi',
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsKsUtils',
          type: 'toggle',
          message: '是否需要KsUtils',
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 您取消了创建cli')
        },
      }
    )
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }

  const {
    projectName,
    projectType = 'vue',
    needsAppointmentRouter,
    needsTypeScript = argv.typescript,
    // needsKsUi,
    // needsKsUtils,
  } = result
  const projectRootPath = path.join(cwd, targetDir)

  if (fs.existsSync(projectRootPath)) {
    emptyDir(projectRootPath)
  } else if (!fs.existsSync(projectRootPath)) {
    fs.mkdirSync(projectRootPath)
  }

  console.log(`\n 正在创建脚手架到： ${bold(green(`${projectRootPath}`))}`)

  const pkg = { name: projectName, version: '0.0.0' }
  fs.writeFileSync(
    path.resolve(projectRootPath, 'package.json'),
    JSON.stringify(pkg, null, 2)
  )

  const templateRoot = path.resolve(__dirname, `./template/${projectType}/`)
  // 组合生成cli模版
  function generate(templateName: string) {
    const templateDir = path.resolve(templateRoot, templateName)
    generateTemplate(templateDir, projectRootPath)
  }

  generate('base')
  if (needsAppointmentRouter && !needsTypeScript) {
    generate('config/router')
  }
  // ts
  if (needsTypeScript) {
    generate('tsconfig/base')
    if (needsAppointmentRouter) {
      generate('tsconfig/config/router')
    }
  }

  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent)
    ? 'pnpm'
    : /yarn/.test(userAgent)
    ? 'yarn'
    : 'npm'

  console.log(`\n 创建成功！执行:\n`)
  if (projectRootPath !== cwd) {
    console.log(`  ${bold(green(`cd ${path.relative(cwd, projectRootPath)}`))}`)
  }
  console.log(`  ${bold(green(`${packageManager} install`))}`)
  console.log(`  ${bold(green(`${packageManager} dev`))}`)

  console.log(22111)
}

init().catch((e) => {
  console.error(e)
})
