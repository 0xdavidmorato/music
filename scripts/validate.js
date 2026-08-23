#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });
function loadJson(p){
  try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){
    console.error(`Failed to parse JSON ${p}: ${e.message}`);
    process.exit(2);
  }
}

const root = process.cwd();
const ipaSchemaPath = path.join(root, 'docs', 'schema', 'ipa-schema.json');
const songSchemaPath = path.join(root, 'docs', 'schema', 'song-schema.json');

if(!fs.existsSync(ipaSchemaPath) || !fs.existsSync(songSchemaPath)){
  console.error('Schemas not found in docs/schema. Make sure docs/schema exists.');
  process.exit(2);
}

const ipaSchema = loadJson(ipaSchemaPath);
const songSchema = loadJson(songSchemaPath);

const validateIpa = ajv.compile(ipaSchema);
const validateSong = ajv.compile(songSchema);

let ok = true;

// validate ipa.json
const ipaPath = path.join(root,'data','ipa.json');
if(fs.existsSync(ipaPath)){
  const ipa = loadJson(ipaPath);
  const valid = validateIpa(ipa);
  if(!valid){
    console.error('ipa.json validation errors:');
    console.error(validateIpa.errors);
    ok = false;
  } else {
    console.log('ipa.json OK');
  }
} else {
  console.warn('ipa.json not found, skipping');
}

// validate song-*.json
const dataDir = path.join(root,'data');
if(fs.existsSync(dataDir)){
  const files = fs.readdirSync(dataDir).filter(f=>f.startsWith('song-') && f.endsWith('.json'));
  if(files.length===0){
    console.warn('No song-*.json files found in data/');
  }
  for(const f of files){
    const p = path.join(dataDir,f);
    const obj = loadJson(p);
    const valid = validateSong(obj);
    if(!valid){
      console.error(`${f} validation errors:`);
      console.error(validateSong.errors);
      ok = false;
    } else {
      console.log(`${f} OK`);
    }
    // optional: check for empty ipa fields
    if(obj.lines && Array.isArray(obj.lines)){
      for(const line of obj.lines){
        if(line.hasOwnProperty('ipa') && (line.ipa === null || line.ipa === '')){
          console.warn(`${f}: line ${line.line_id || '(no id)'} has empty ipa`);
        }
      }
    }
  }
} else {
  console.error('data/ directory not found');
  process.exit(2);
}

if(!ok){
  console.error('Validation failed');
  process.exit(1);
}
console.log('All validations passed');
process.exit(0);
