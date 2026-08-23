#!/usr/bin/env node
/**
 * scripts/create-pr-from-file.js
 *
 * Usage:
 *  node scripts/create-pr-from-file.js --file /path/to/song.json --branch "autosave/<id>-<timestamp>" --title "Update song <id>" --body "details"
 *
 * The script will:
 *  - validate that the file exists
 *  - copy it into data/ using its file name (overwriting existing data/<file>)
 *  - create a new git branch
 *  - stage and commit the file
 *  - push the branch
 *  - open a draft PR using `gh`
 *
 * Note: requires `gh` to be authenticated and git available locally.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function usage() {
  console.error('Usage: node scripts/create-pr-from-file.js --file /path/to/song.json [--branch BRANCH] [--title TITLE] [--body BODY]')
  process.exit(2)
}

const argv = require('minimist')(process.argv.slice(2))
if (!argv.file) usage()
const filePath = path.resolve(argv.file)
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath)
  process.exit(1)
}

const fileName = path.basename(filePath)
const destDir = path.resolve(__dirname, '..', 'data')
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
const destPath = path.join(destDir, fileName)

const branch = argv.branch || `autosave/${fileName.replace(/\W+/g, '-')}-${Date.now()}`
const title = argv.title || `Update data: ${fileName}`
const body = argv.body || `Automatic update of ${fileName}`

try {
  // copy file
  fs.copyFileSync(filePath, destPath)
  console.log('Copied', filePath, '->', destPath)

  // git operations
  execSync('git config user.email "action@local"', { stdio: 'inherit' })
  execSync('git config user.name "Auto PR Script"', { stdio: 'inherit' })
  execSync(`git checkout -b ${branch}`, { stdio: 'inherit' })
  execSync(`git add ${destPath}`, { stdio: 'inherit' })
  execSync(`git commit -m "chore(data): update ${fileName}" --no-verify`, { stdio: 'inherit' })
  execSync(`git push -u origin ${branch}`, { stdio: 'inherit' })

  // create PR (draft)
  execSync(`gh pr create --base main --head ${branch} --title "${title}" --body "${body}" --draft`, { stdio: 'inherit' })
  console.log('\nPR created (draft). Review and merge as usual.')
} catch (err) {
  console.error('Error during git/gh operations:', err.message)
  process.exit(1)
}
