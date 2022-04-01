const _rDefault = r => r.default || r

export const commands = {
  init: () => import('./init.js').then(_rDefault),
  dev: () => import('./dev.js').then(_rDefault),
  build: () => import('./build.js').then(_rDefault),
  deploy: () => import('./deploy.js').then(_rDefault),
  usage: () => import('./usage.js').then(_rDefault)
}

export function defineFiresteadCommand (command){
    return command
}