 

# `rootDir`
- **Type**: `string`
- **Default**: `"/<rootDir>"`

> The path to the firestead root directory.


# `dev`
- **Type**: `boolean`
- **Default**: `false`

> Whether Firestead is running in development mode.


Normally you should not need to set this.


# `configFile`
- **Type**: `string`
- **Default**: `"/<rootDir>/firestead.config.json"`

> Firestead config file


# `buildConfig`

## `dir`
- **Type**: `string`
- **Default**: `"/<rootDir>/_firestead"`

> The path to the firestead build directory


## `rollup`
- **Type**: `any`
- **Default**: `{}`

> Rollup config


## `skip`
- **Type**: `boolean`
- **Default**: `false`

> Defines if firestead build process should be skipped


# `emulator`

## `runEmulator`
- **Type**: `boolean`
- **Default**: `true`

> enable/disable Firebase emulator


## `services`
- **Type**: `array`
- **Default**: `["functions","storage","auth","firestore","pubsub"]`

> Emulator services that should be enabled


## `exportDir`
- **Type**: `string`
- **Default**: `"/<rootDir>/_firestead/emulator"`

> Emulator export path


# `hosting`

## `dir`
- **Type**: `string`
- **Default**: `"/<rootDir>/hosting"`

> hosting directory, where all hosting targets are located


## `current`
- **Type**: `string`
- **Default**: `""`

> current active target


## `targets`
- **Type**: `Record <string, SrcTypesHostingTargetHostingTarget>`
- **Default**: `null`

> hosting targets


# `environments`

## `configFile`
- **Type**: `string`
- **Default**: `"/<rootDir>/.firestead.env.json"`

> Firestead env file


## `activeRuntime`
- **Type**: `string`
- **Default**: `""`

> Current active environment runtime


## `runtimes`
- **Type**: `Record <string, SrcTypesEnvironmentRuntimeEnvironmentRuntime>`
- **Default**: `null`

> Defines environments like dev, staging, prod with Firebase config and env variables
