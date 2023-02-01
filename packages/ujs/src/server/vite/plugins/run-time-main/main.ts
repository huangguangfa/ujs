import { dirname } from 'path'
import { createRequire } from 'node:module'
const _require = createRequire(import.meta.url)
export function createMainContent() {
  const renderVueStr = renderVueTempate()
  return `${renderVueStr}
    `
}

function renderVueTempate() {
  const rendererVuePath = dirname(
    _require.resolve('@ujs/renderer-vue/package.json')
  )
  return `
  import app from './app.vue'
  import { getRoutes } from './router'
  import { renderClient } from '${rendererVuePath}'
  
  async function render() {
    const { routes, routeComponents } = await getRoutes()
    renderClient({
      app,
      routes,
      routeComponents,
    })
  }
  render()
    `
}

export function createAppVueContent() {
  return `<template>
  <router-view></router-view>
</template>
  `
}
