Contributing — Music Learner

Thank you for contributing. This repository intentionally contains only the songs data and IPA transcriptions. Follow these guidelines to keep data safe and consistent.

1) Branching

- Use feature/* for new features
- Use feature/ipa-edit-<id> for IPA edits
- Use hotfix/* for urgent fixes

2) Editing IPAs (CRUCIAL)

- Edit data/song-<id>.json or data/ipa.json locally
- Validate JSON locally (see below)
- Create a branch and open a PR — include reasons and short changelog in PR description

3) Local validation

- Install ajv-cli (global or use npx):
  npm install -g ajv-cli

- Validate ipa.json:
  ajv validate -s docs/schema/ipa-schema.json -d data/ipa.json

- Validate a song:
  ajv validate -s docs/schema/song-schema.json -d data/song-<id>.json

4) Pre-merge checklist

- [ ] JSON validated
- [ ] IPAs reviewed
- [ ] No direct edits to main
- [ ] Backup/tag created if making destructive changes

5) Backups & recovery

- Create a tag before destructive changes:
  git tag pre-YYYYMMDD && git push origin --tags

- Recover from old commit SHA via:
  git checkout -b restore-old <SHA>
  git push origin restore-old

6) CI

- This repo includes a GitHub Action that validates JSONs on each PR. Ensure the checks pass before merging.

Thank you — keep IPAs safe! 
