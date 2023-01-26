export function createMainContent() {
  const renderVueStr = renderVueTempate()
  return `${renderVueStr}
    `
}

function renderVueTempate() {
  return `
import app from './app.vue'
import { renderClient } from '@ujs/renderer-vue'
renderClient({app})
console.log(333)
    `
}

export function createAppVueContent() {
  return `<template>
  111
  <router-view></router-view>
</template>
  `
}
