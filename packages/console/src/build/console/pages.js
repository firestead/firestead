// cc https://github.com/nuxt/framework/blob/main/packages/nuxt3/src/pages/utils.ts
import { extname, relative, resolve } from 'pathe'
import { encodePath } from 'ufo'
import globby from 'globby'

async function resolveFiles (path, pattern) {
  const files = await globby(pattern, {
    cwd: path,
    followSymbolicLinks: true
  })
  return files.map(p => resolve(path, p))
}

export async function resolvePagesRoutes (firesteadContext) {
  if(firesteadContext.options.console.pages.length > 0){
    for(const page of firesteadContext.options.console.pages){
      const files = await resolveFiles(page.path, `**/*{${firesteadContext.options.console.extensions.join(',')}}`)
      // Sort to make sure parent are listed first
      files.sort()
      const routes = generateRoutesFromFiles(files, page)
      firesteadContext.options.console.routes = firesteadContext.options.console.routes.concat(routes)
    }
  }
  return true
}

export function generateRoutesFromFiles (files, page) {
  const routes = []
  const pagesDir = page.path

  for (const file of files) {
    const segments = relative(pagesDir, file)
      .replace(new RegExp(`${extname(file)}$`), '')
      .split('/')

    const route = {
      name: '',
      path: '',
      file,
      children: []
    }

    // Array where routes should be added, useful when adding child routes
    let parent = routes

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]

      const tokens = parseSegment(segment)
      const segmentName = tokens.map(({ value }) => value).join('')
      const isSingleSegment = segments.length === 1
      const isLastSegment = i === segments.length - 1

      // ex: parent/[slug].vue -> parent-slug
      route.name += (route.name && '-') + segmentName

      // ex: parent.vue + parent/child.vue
      const child = parent.find(parentRoute => parentRoute.name === route.name)
      if (child) {
        parent = child.children
        route.path = ''
      } else if (segmentName === '404' && isSingleSegment) {
        route.path += '/:catchAll(.*)*'
      } else if (segmentName === 'index' && !route.path) {
        route.path += '/'
      } else if (segmentName !== 'index') {
        route.path += getRoutePath(tokens)
        if (isLastSegment && tokens.length === 1 && tokens[0].type === 'dynamic') {
          route.path += '?'
        }
      }
    }

    parent.push(route)
  }

  return prepareRoutes(routes, page.prefix)
}

function getRoutePath (tokens) {
  return tokens.reduce((path, token) => {
    return (
      path +
      (token.type === 'dynamic'
        ? `:${token.value}`
        : token.type === 'catchall'
          ? `:${token.value}(.*)*`
          : encodePath(token.value))
    )
  }, '/')
}

const PARAM_CHAR_RE = /[\w\d_.]/

function parseSegment (segment) {
  let state = 'initial'
  let i = 0

  let buffer = ''
  const tokens = []

  function consumeBuffer () {
    if (!buffer) {
      return
    }
    if (state === 'initial') {
      throw new Error('wrong state')
    }

    tokens.push({
      type:
        state === 'static'
          ? 'static'
          : state === 'dynamic'
            ? 'dynamic'
            : 'catchall',
      value: buffer
    })

    buffer = ''
  }

  while (i < segment.length) {
    const c = segment[i]

    switch (state) {
      case 'initial':
        buffer = ''
        if (c === '[') {
          state = 'dynamic'
        } else {
          i--
          state = 'static'
        }
        break

      case 'static':
        if (c === '[') {
          consumeBuffer()
          state = 'dynamic'
        } else {
          buffer += c
        }
        break

      case 'catchall':
      case 'dynamic':
        if (buffer === '...') {
          buffer = ''
          state = 'catchall'
        }
        if (c === ']') {
          if (!buffer) {
            throw new Error('Empty param')
          } else {
            consumeBuffer()
          }
          state = 'initial'
        } else if (PARAM_CHAR_RE.test(c)) {
          buffer += c
        } else {
          console.debug(`[pages]Ignored character "${c}" while building param "${buffer}" from "segment"`)
        }
        break
    }
    i++
  }

  if (state === 'dynamic') {
    throw new Error(`Unfinished param "${buffer}"`)
  }

  consumeBuffer()

  return tokens
}

function prepareRoutes (routes, prefix, parent = null) {
  for (const route of routes) {
    // Remove -index
    if (route.name) {
      route.name = route.name.replace(/-index$/, '')
    }

    if (route.path === '/') {
      // Remove ? suffix when index page at same level
      routes.forEach((siblingRoute) => {
        if (siblingRoute.path.endsWith('?')) {
          siblingRoute.path = siblingRoute.path.slice(0, -1)
        }
      })
    }
    // Remove leading / if children route
    if (parent && route.path.startsWith('/')) {
      route.path = route.path.slice(1)
    }

    //add prefix
    if(prefix){
      route.path = `/${prefix}${route.path}`
      route.name = `${prefix}-${route.name}`
    }

    if (route.children.length) {
      route.children = prepareRoutes(route.children, prefix, route)
    }

    if (route.children.find(childRoute => childRoute.path === '')) {
      delete route.name
    }
  }

  return routes
}