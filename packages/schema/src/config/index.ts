import _common from './_common'
import emulator from './emulator'
import buildConfig from './buildConfig'
import hosting from './hosting'
import environments from './environments'

export default {
    ..._common,
    buildConfig,
    emulator,
    hosting,
    environments
}