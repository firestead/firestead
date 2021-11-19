import pathe from 'pathe'
import hash from 'hash-sum'
import { createFilter } from '@rollup/pluginutils'
import { compileTemplate } from '@vue/compiler-sfc'

function genScopeId(code, filename) {
    const sourceRoot = process.cwd()
    const shortFilePath = pathe
        .relative(sourceRoot, filename)
        .replace(/^(\.\.[\/\\])+/, '')
        .replace(/\\/g, '/');
    const scopeId = hash(shortFilePath + '\n' + code)
    return scopeId;
}

const defaultOptions = {
    include: /\.svg$/,
    exclude: [],
    sourceMap: false,
    target: 'browser',
};

export default function pluginSvgToVue(options = {}) {
    options = { ...defaultOptions, ...options }
    const filter = createFilter(options.include, options.exclude)

    return {
        name: 'svg-to-vue',
        async transform(source, id) {
            if (!filter(id)) return null;
            const compiled = compileTemplate({
                source: source,
                filename: id,
                id: genScopeId(source, id),
                ssr: options.target === 'node',
            });
            let code = compiled.code
            const sourceMap = compiled.map
            if (code.includes('export function render')) {
                code = code.concat(`\n export default render`)
            }
            return {
                code,
                map: options.sourceMap ? sourceMap : null,
            }
        },
    }
}