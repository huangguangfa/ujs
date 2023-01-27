// @ts-ignore
// import App from './app.vue'
// @ts-ignore
import { createApp } from 'vue'
// @ts-ignore
import { createRouter, RouterHistory, createWebHashHistory } from 'vue-router'

import { createClientRoutes } from './routes'
import { IRouteComponents, IRoutesById } from './types'

export function renderClient(opts: {
  rootElement: string
  routes: IRoutesById
  routeComponents: IRouteComponents
  pluginManager: any
  basename?: string
  history: RouterHistory
  app: any
}) {
  const routes = createClientRoutes({
    routesById: opts.routes,
    routeComponents: opts.routeComponents,
  }) as any
  // @ts-ignore
  let rootContainer = opts.app
  const router = createRouter({
    history: opts.history || createWebHashHistory(),
    strict: true,
    routes,
  })
  console.log('---', rootContainer)
  const app = createApp(rootContainer)

  app.use(router)
  app.mount(opts.rootElement || '#app')

  return {
    app,
    router,
  }
}
