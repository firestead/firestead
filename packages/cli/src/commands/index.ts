import type { Argv } from 'mri'

const _rDefault = r => r.default || r

export const commands = {
  init: () => import('./init.js').then(_rDefault),
  dev: () => import('./dev').then(_rDefault),
  build: () => import('./build.js').then(_rDefault),
  deploy: () => import('./deploy.js').then(_rDefault),
  usage: () => import('./usage.js').then(_rDefault)
}

export type Command = keyof typeof commands

export interface FiresteadCommandMeta {
  name: string;
  usage: string;
  description: string;
  [key: string]: any;
}

export type CLIInvokeResult = void | 'error' | 'wait'

export interface FiresteadCommand {
  invoke(args: Argv): Promise<CLIInvokeResult> | CLIInvokeResult
  meta: FiresteadCommandMeta
}

export function defineFiresteadCommand (command: FiresteadCommand) :FiresteadCommand{
    return command
}