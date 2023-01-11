#!/usr/bin/env node

// import * as fs from 'node:fs'
// import * as path from 'node:path'
import minimist from 'minimist'
import prompts from 'prompts'

async function init() {
  const cwd = process.cwd()

  const argv = minimist(process.argv.slice(2), {
    string: ['_'],
    boolean: true,
  })
  console.log(cwd, argv, argv.name)
  let targetDir = 'ujs-project'
  const defaultProjectName = 'ujs-project'
  console.log('targetDir', targetDir)
  let result: {
    projectName?: string
  } = {}
  try {
    result = await prompts([
      {
        name: 'projectName',
        type: 'text',
        message: 'Project name:',
        initial: defaultProjectName,
        onState: (state) =>
          (targetDir = String(state.value).trim() || defaultProjectName),
      },
    ])

    console.log('result', result)
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

init().catch((e) => {
  console.error(e)
})
