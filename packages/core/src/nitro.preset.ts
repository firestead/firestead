//TODO: check out https://github.com/JamieCurnow/nuxt-firebase-webframework

import type { NitroPreset } from "nitropack";
import { readFile, writeFile, stat  } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

export default {
    entry: "#internal/nitro/entries/node",
    commands: {
      deploy: "npx firebase deploy",
    },
    hooks: {
      async compiled(nitro) {
        const isPackageJsonFile = existsSync(join(nitro.options.output.serverDir, "package.json"))
        if(isPackageJsonFile){
          const packageJson = JSON.parse(
            await readFile(join(nitro.options.output.serverDir, "package.json"), "utf8")
          );
          packageJson.dependencies = {...packageJson.bundledDependencies}
          delete packageJson.bundledDependencies;
          await writeFile(
              join(nitro.options.output.serverDir, "package.json"),
              JSON.stringify(packageJson, null, 2)
          );
        }
      },
    },
  } as NitroPreset;