export function createMainContent() {
  const renderVueStr = renderVueTempate()
  return `${renderVueStr}
    `
}

function renderVueTempate() {
  return `
  import app from './app.vue'
  import { getRoutes } from './router'
  import { renderClient } from '@ujs/renderer-vue'
  
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
