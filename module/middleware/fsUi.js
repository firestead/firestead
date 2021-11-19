import { createApp } from 'h3'
import { readFile } from 'fs-extra'
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

const app = createApp()

app.use('/index.js', async (req, res)=>{
    const firesteadUi = await readFile(resolve(dirname(fileURLToPath(import.meta.url)), '../ui/runtime/index.js'))
    return firesteadUi
})
app.use('/', async (req, res)=>{
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Firestead</title>
</head>
<body>
    <div id="app"></div>
    <script src="/fs/index.js"></script>
</body>
</html>`
})

export default app