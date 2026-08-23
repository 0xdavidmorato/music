#!/usr/bin/env python3
"""
Apply IPA edits from a downloaded edits JSON file and create a branch + PR.
Usage: python3 scripts/apply_ipa_edits.py [edits-file]
Default edits-file: ./<song>-ipa-edits.json (must be present in repo root)

This script will:
 - read the edits JSON (format produced by the in-page editor)
 - validate the song id and map edits into data/song-<id>.json
 - create a new branch ipa-edits-<song>-<timestamp>
 - write the updated song JSON, git add, commit, push
 - create a Pull Request using 'gh'

Requires: git and gh CLI configured and authenticated, and permission to push to the repo or to a fork (script assumes push to origin).
"""
import sys
import json
from pathlib import Path
from datetime import datetime
import subprocess


def run(cmd, check=True, capture=False):
    print('>',' '.join(cmd))
    if capture:
        return subprocess.check_output(cmd, text=True).strip()
    rv = subprocess.run(cmd)
    if check and rv.returncode != 0:
        raise SystemExit(f'Command failed: {cmd}')
    return rv.returncode


def main():
    edits_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not edits_path:
        # try to auto-find any *-ipa-edits.json in cwd
        candidates = list(Path('.').glob('*-ipa-edits.json'))
        if not candidates:
            print('No edits file provided and none found matching *-ipa-edits.json')
            print('Usage: python3 scripts/apply_ipa_edits.py path/to/<song>-ipa-edits.json')
            raise SystemExit(1)
        edits_path = candidates[0]

    if not edits_path.exists():
        raise SystemExit(f'Edits file not found: {edits_path}')

    edits = json.loads(edits_path.read_text(encoding='utf-8'))
    song_id = edits.get('id')
    if not song_id:
        raise SystemExit('Edits file missing "id" field')

    song_file = Path(f'data/song-{song_id}.json')
    if not song_file.exists():
        raise SystemExit(f'Song file not found: {song_file}')

    song = json.loads(song_file.read_text(encoding='utf-8'))

    # Apply edits to song.lines by index
    for item in edits['lines']:
        idx = item['index']
        if idx < 0 or idx >= len(song['lines']):
            print(f'Skipping out-of-range index {idx}')
            continue
        # update text, ipa and chords
        song['lines'][idx]['text'] = item.get('text', song['lines'][idx]['text'])
        song['lines'][idx]['ipa'] = item.get('ipa', song['lines'][idx].get('ipa',''))
        if 'chords' in item:
            song['lines'][idx]['chords'] = item.get('chords','')

    # Prepare branch
    ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    branch = f'ipa-edits-{song_id}-{ts}'

    run(['git', 'checkout', '-b', branch])

    # Write updated song file
    song_file.write_text(json.dumps(song, ensure_ascii=False, indent=2), encoding='utf-8')

    run(['git', 'add', str(song_file)])
    run(['git', 'commit', '-m', f"Apply IPA edits for {song_id} (via editor)\n\nApplied edits from {edits_path.name}")

    # Push branch
    run(['git', 'push', '-u', 'origin', branch])

    # Create PR via gh
    pr_title = f"IPA edits: {song.get('title','') or song_id}"
    pr_body = f"This PR applies IPA edits created via the in-site IPA editor. Edits file: {edits_path.name}"
    run(['gh', 'pr', 'create', '--base', 'main', '--head', branch, '--title', pr_title, '--body', pr_body])

    print('PR created. Clean up: consider deleting the edits file if not needed.')

if __name__ == '__main__':
    main()
