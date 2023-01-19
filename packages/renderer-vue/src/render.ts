// @ts-ignore
import App from './App.vue'
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
}) {
  const routes = createClientRoutes({
    routesById: opts.routes,
    routeComponents: opts.routeComponents,
  }) as any
  // @ts-ignore
  let rootContainer = App

  // 路由配置
  const routerConfig = opts.pluginManager.applyPlugins({
    key: 'router',
    type: 'modify',
    initialValue: {},
  })

  const router = createRouter({
    ...routerConfig,
    history: opts.history,
    strict: true,
    routes,
  })

  const app = createApp(rootContainer)

  app.use(router)
  app.mount(opts.rootElement)

  return {
    app,
    router,
  }
}
