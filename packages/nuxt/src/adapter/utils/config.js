export function getRuntimeConfig(runtime, envVariables){
  const runtimeConfig = {}
  Object.entries(envVariables).forEach(
      ([name, env]) => {
        if(env.runtime[runtime]){
          runtimeConfig[name] = env.value
        }
      }
  )
  return runtimeConfig
}