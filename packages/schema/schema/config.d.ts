import type { HostingTarget } from '../src/types/hostingTarget'
import type { EnvironmentRuntime } from '../src/types/environmentRuntime'
export interface ConfigSchema {
   /**
   * The path to the firestead root directory.
   * @default "/<rootDir>"
  */
  rootDir: string,

  /**
   * Whether Firestead is running in development mode.
   * Normally you should not need to set this.
   * @default false
  */
  dev: boolean,

  /**
   * Firestead config file
   * @default "/<rootDir>/firestead.config.json"
  */
  configFile: string,

  buildConfig: {
    /**
     * The path to the firestead build directory
     * @default "/<rootDir>/_firestead"
    */
    dir: string,

    /** Rollup config */
    rollup: any,

    /**
     * Defines if firestead build process should be skipped
     * @default false
    */
    skip: boolean,
  },

  emulator: {
    /**
     * enable/disable Firebase emulator
     * @default true
    */
    runEmulator: boolean,

    /**
     * Emulator services that should be enabled
     * @default ["functions","storage","auth","firestore","pubsub"]
    */
    services: Array<string>,

    /**
     * Emulator export path
     * @default "/<rootDir>/_firestead/emulator"
    */
    exportDir: string,
  },

  hosting: {
    /**
     * hosting directory, where all hosting targets are located
     * @default "/<rootDir>/hosting"
    */
    dir: string,

    /**
     * current active target
     * @default ""
    */
    current: string,

    /** hosting targets */
    targets: Record <string, HostingTarget>,
  },

  environments: {
    /**
     * Firestead env file
     * @default "/<rootDir>/.firestead.env.json"
    */
    configFile: string,

    /**
     * Current active environment runtime
     * @default ""
    */
    activeRuntime: string,

    /** Defines environments like dev, staging, prod with Firebase config and env variables */
    runtimes: Record <string, EnvironmentRuntime>,
  },
}