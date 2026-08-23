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

7) Editing workflow with the Export + CLI tool

- Use the in-browser IPA editor to make local edits to a song (the UI updates the in-memory model).
- Click "Exportar JSON" to download the updated song JSON to your machine.
- Use the included CLI to create a draft PR from the exported file:

  cd <repo-root>
  npm run create-pr-from-file -- --file /abs/path/to/song-viva-la-vida.json --branch "autosave/viva-<ts>" --title "Update viva la vida IPA" --body "Atualização de IPA"

- The CLI will copy the file into data/, create a branch, commit, push and open a draft PR for review.
- After PR review and CI green, merge into main.

Thank you — keep IPAs safe! 
