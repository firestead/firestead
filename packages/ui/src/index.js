import { getFiresteadContext } from "./context"
import { prepare, bundle } from "./build"

export async function initApp(){
    const firesteadContext = getFiresteadContext()
    await prepare(firesteadContext)
    await bundle(firesteadContext)
}