import fse from 'fs-extra'
import { compileTemplate } from 'vue/compiler-sfc'

export default function svgImport(options = {}) {

  const svgRegex = /\.svg$/

  return {
    name: 'svg-import',
    enforce: 'pre',

    resolveid (id) {
      if (id.match(svgRegex)) {
        return id
      }
    },

    async load (id) {
      if (!id.match(svgRegex)) {
        return
      }

      let svg = await fse.readFile(id, 'utf-8')
      // remove the xml declaration if it exists
      svg = `<svg${svg.split("<svg").pop()}`
      let { code, map } = compileTemplate({
        id: JSON.stringify(id),
        source: svg,
        filename: id
      })

      code = `${code}\nexport default { render: render }`
        return {
            code,
            map: options.map ? map : null,
        }
    }
  }
}