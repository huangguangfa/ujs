// @ts-ignore
// import App from './app.vue'
// @ts-ignore
import { createApp } from 'vue'
// @ts-ignore
import { createRouter, RouterHistory } from 'vue-router'
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
  let rootContainer = opts.App

  const router = createRouter({
    history: !!opts.history,
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
