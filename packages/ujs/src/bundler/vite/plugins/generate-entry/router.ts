import { isAbsolute } from 'path'
import assert from 'assert'
import resolve from 'resolve'
import type { ResolvedConfig } from '../../../../config'

interface IOpts {
  routes: any[]
  onResolveComponent?: (component: string) => string
}

interface IMemo {
  id: number
  ret: any
}

export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path)
  if (isExtendedLengthPath) {
    return path
  }
  return path.replace(/\\/g, '/')
}

export async function getRoutes(
  config: ResolvedConfig
): Promise<Record<string, any>> {
  let routes: any = []
  if (config.routes) {
    routes = getConfigRoutes({
      routes: config.routes,
      onResolveComponent(component) {
        if (isAbsolute(component)) {
          return component
        }
        if (component.startsWith('@/')) {
          component = component.replace('@/', './')
        }
        component = winPath(
          resolve.sync(localPath(component), {
            basedir: './src/views',
            extensions: ['.vue'],
          })
        )
        component = component.replace(winPath(`${''}/`), '/')
        return component
      },
    })
  }

  function localPath(path: string) {
    if (path.charAt(0) !== '.') {
      return `./${path}`
    } else {
      return path
    }
  }

  return routes
}

export function getConfigRoutes(opts: IOpts): any[] {
  const memo: IMemo = { ret: {}, id: 1 }
  transformRoutes({
    routes: opts.routes,
    parentId: undefined,
    memo,
    onResolveComponent: opts.onResolveComponent,
  })
  return memo.ret
}

function transformRoutes(opts: {
  routes: any[]
  parentId: undefined | string
  memo: IMemo
  onResolveComponent?: Function
}) {
  opts.routes.forEach((route) => {
    transformRoute({
      route,
      parentId: opts.parentId,
      memo: opts.memo,
      onResolveComponent: opts.onResolveComponent,
    })
  })
}

function transformRoute(opts: {
  route: any
  parentId: undefined | string
  memo: IMemo
  onResolveComponent?: Function
}) {
  assert(
    !opts.route.children,
    'children is not allowed in route props, use routes instead.'
  )
  const id = String(opts.memo.id++)
  const { component, wrappers } = opts.route
  let absPath = opts.route.path
  if (absPath?.charAt(0) !== '/') {
    const parentAbsPath = opts.parentId
      ? opts.memo.ret[opts.parentId].absPath.replace(/\/+$/, '/') // to remove '/'s on the tail
      : '/'
    absPath = endsWithStar(parentAbsPath)
      ? parentAbsPath
      : ensureWithSlash(parentAbsPath, absPath)
  }
  opts.memo.ret[id] = {
    path: opts.route.path,
    ...(component
      ? {
          file: opts.onResolveComponent
            ? opts.onResolveComponent(component)
            : component,
        }
      : {}),
    parentId: opts.parentId,
    id,
  }
  if (absPath) {
    opts.memo.ret[id].absPath = absPath
  }
  if (wrappers?.length) {
    let parentId = opts.parentId
    let path = opts.route.path
    let layout = opts.route.layout
    wrappers.forEach((wrapper: any) => {
      const { id } = transformRoute({
        route: {
          path,
          component: wrapper,
          isWrapper: true,
          ...(layout === false ? { layout: false } : {}),
        },
        parentId,
        memo: opts.memo,
        onResolveComponent: opts.onResolveComponent,
      })
      parentId = id
      path = endsWithStar(path) ? '*' : ''
    })
    opts.memo.ret[id].parentId = parentId
    opts.memo.ret[id].path = path
    // wrapper ????????? ?????? path ??????, ????????? path ??? originPath ?????? layout ??????
    opts.memo.ret[id].originPath = opts.route.path
  }
  if (opts.route.routes) {
    transformRoutes({
      routes: opts.route.routes,
      parentId: id,
      memo: opts.memo,
      onResolveComponent: opts.onResolveComponent,
    })
  }
  return { id }
}

function endsWithStar(str: string) {
  return str.endsWith('*')
}

function ensureWithSlash(left: string, right: string) {
  // right path maybe empty
  if (!right?.length || right === '/') {
    return left
  }
  return `${left.replace(/\/+$/, '')}/${right.replace(/^\/+/, '')}`
}

export async function getRouteComponents(opts: {
  routes: Record<string, any>
  prefix: string
}) {
  const imports = Object.keys(opts.routes)
    .map((key) => {
      const route = opts.routes[key]
      if (route.file.startsWith('(')) {
        return `'${key}': () => Promise.resolve(${route.file}),`
      }

      const path =
        isAbsolute(route.file) || route.file.startsWith('@/')
          ? route.file
          : `${opts.prefix}${route.file}`
      return `'${key}': () => import('${winPath(path)}'),`
    })
    .join('\n')
  return `{\n${imports}\n}`
}
