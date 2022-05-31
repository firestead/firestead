import { resolve } from 'pathe'

export default {
    /**
     * enable/disable Firebase emulator
     */
    runEmulator: true,
    /**
     * Emulator services that should be enabled
     */
    services: ['functions', 'storage', 'auth', 'firestore', 'pubsub'],
    /**
     * Emulator export path
     */
    exportDir: {
        $resolve: (val, get) => {
            const buildDir = get('buildConfig.dir')
            return resolve(buildDir, val || 'emulator')
        }
    }
}