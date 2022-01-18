// cc
// Based on https://github.com/egoist/rollup-plugin-esbuild (MIT)

import { extname, relative } from 'pathe'
import { transform } from 'esbuild'
import { createFilter } from '@rollup/pluginutils'

const defaultLoaders = {
  '.ts': 'ts',
  '.js': 'js'
}

export function esbuild (options = {}) {
  let target

  const loaders = {
    ...defaultLoaders
  }

  if (options.loaders) {
    for (const key of Object.keys(options.loaders)) {
      const value = options.loaders[key]
      if (typeof value === 'string') {
        loaders[key] = value
      } else if (value === false) {
        delete loaders[key]
      }
    }
  }

  const extensions = Object.keys(loaders)
  const INCLUDE_REGEXP = new RegExp(
    `\\.(${extensions.map(ext => ext.slice(1)).join('|')})$`
  )
  const EXCLUDE_REGEXP = /node_modules/

  const filter = createFilter(
    options.include || INCLUDE_REGEXP,
    options.exclude || EXCLUDE_REGEXP
  )

  return {
    name: 'esbuild',

    async transform (code, id) {
      if (!filter(id)) {
        return null
      }

      const ext = extname(id)
      const loader = loaders[ext]

      if (!loader) {
        return null
      }

      target = options.target || 'node12'

      const result = await transform(code, {
        loader,
        target,
        define: options.define,
        sourcemap: options.sourceMap !== false,
        sourcefile: id
      })

      printWarnings(id, result, this)

      return (
        result.code && {
          code: result.code,
          map: result.map || null
        }
      )
    },

    async renderChunk (code) {
      if (options.minify) {
        const result = await transform(code, {
          loader: 'js',
          minify: true,
          target
        })
        if (result.code) {
          return {
            code: result.code,
            map: result.map || null
          }
        }
      }
      return null
    }
  }
}

function printWarnings (
  id,
  result,
  plugin
) {
  if (result.warnings) {
    for (const warning of result.warnings) {
      let message = '[esbuild]'
      if (warning.location) {
        message += ` (${relative(process.cwd(), id)}:${warning.location.line}:${warning.location.column
          })`
      }
      message += ` ${warning.text}`
      plugin.warn(message)
    }
  }
}