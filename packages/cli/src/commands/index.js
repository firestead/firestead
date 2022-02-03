const _rDefault = r => r.default || r

export const commands = {
  dev: () => import('./dev.js').then(_rDefault),
  build: () => import('./build.js').then(_rDefault),
  usage: () => import('./usage.js').then(_rDefault)
}

export function defineFiresteadCommand (command){
    return command
}