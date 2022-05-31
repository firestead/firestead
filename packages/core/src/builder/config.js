import { resolve } from 'pathe'
import { writeFile } from "../utils"

export async function writeFiresteadConfig (firesteadContext) {
    const firesteadConfig = {
        hosting: {
            targets: {
              ...firesteadContext.options.hosting.targets
            }
        }
    }
    return await writeFile(
      resolve(firesteadContext.options.rootPath, firesteadContext.options.configFileName),
      JSON.stringify(
        firesteadConfig,
        null,
        4
      )
    )
  }