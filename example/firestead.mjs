#!/usr/bin/env node
process._startTime = Date.now()
import('@firestead/cli').then(r => (r.default || r).main())