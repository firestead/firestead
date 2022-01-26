import { createApp } from 'h3'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const app = createApp()

app.use('/index.js', async (req, res)=>{
    const firesteadUi = readFileSync(resolve(process.env.FIRESTEAD_BUILD_DIR, 'ui/app/index.js'), 'utf8')
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