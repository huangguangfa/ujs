export function createMainContent() {
  const renderVueStr = renderVueTempate()

  return `${renderVueStr}
    `
}

function renderVueTempate() {
  return `
import app from './app.vue'
import { renderClient } from '/Users/guangfa/Desktop/guangfaMac/guangfa/gfCode/ujs/packages/renderer-vue'
renderClient({app})
console.log(333)
    `
}

export function createAppVueContent() {
  return `<template>
  <router-view></router-view>
</template>
  `
}
