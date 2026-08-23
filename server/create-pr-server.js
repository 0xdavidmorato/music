#!/usr/bin/env node
// server/create-pr-server.js
// Minimal local HTTP server to accept song JSON and create a PR using scripts/create-pr-from-file.js
// Usage: node server/create-pr-server.js

const http = require('http')
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const HOST = '127.0.0.1'
const PORT = process.env.PR_SERVER_PORT || 8787

function sendJson(res, code, obj){
  res.writeHead(code, {'Content-Type':'application/json'})
  res.end(JSON.stringify(obj))
}

const server = http.createServer((req,res)=>{
  if (req.method === 'POST' && req.url === '/create-pr') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        const { fileName, branch, title, body: prBody, file } = payload
        if (!fileName || !file) return sendJson(res,400,{ error: 'fileName and file required' })

        // write temp file in repo tmp
        const tmpDir = path.resolve(__dirname, '..', 'tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
        const tmpPath = path.join(tmpDir, `${Date.now()}-${fileName}`)
        fs.writeFileSync(tmpPath, JSON.stringify(file, null, 2), 'utf8')

        // run the existing script
        const args = [path.join(__dirname, '..', 'scripts', 'create-pr-from-file.js'), '--file', tmpPath]
        if (branch) args.push('--branch', branch)
        if (title) args.push('--title', title)
        if (prBody) args.push('--body', prBody)

        const node = process.execPath
        const resSpawn = spawnSync(node, args, { encoding: 'utf8' })

        // capture output
        const out = resSpawn.stdout || ''
        const err = resSpawn.stderr || ''

        if (resSpawn.status !== 0) {
          return sendJson(res, 500, { ok: false, stdout: out, stderr: err })
        }

        // attempt to extract PR URL from stdout
        const match = out.match(/https:\/\/github.com\/[\w\-\.]+\/[\w\-\.]+\/pull\/\d+/)
        const prUrl = match ? match[0] : null
        sendJson(res, 200, { ok: true, stdout: out, stderr: err, prUrl })
      } catch (e) {
        sendJson(res, 500, { error: e.message })
      }
    })
  } else if (req.method === 'GET' && req.url === '/ping') {
    sendJson(res,200,{ok:true,uptime:process.uptime()})
  } else {
    sendJson(res,404,{error:'not found'})
  }
})

server.listen(PORT, HOST, ()=>{
  console.log(`create-pr-server listening at http://${HOST}:${PORT}`)
})
