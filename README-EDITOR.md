IPA Editor workflow

1) Use the in-page editor
   - Open the song page (e.g., the Viva la Vida section in index.html).
   - Click 'Edit IPAs' to enable inline editing of each line's IPA (and original text if needed).
   - After finishing edits, click 'Download edits (JSON)'. This will download a file named <song>-ipa-edits.json.

2) Create a Pull Request with the edits (automated)
   - Place the downloaded JSON file at the repository root (or anywhere and provide its path).
   - Run the helper script to apply and create a PR:
       python3 scripts/apply_ipa_edits.py path/to/viva-la-vida-ipa-edits.json

   - The script will:
       * create a new branch named ipa-edits-<song>-<timestamp>
       * update data/song-<id>.json with your edits
       * commit, push, and create a PR on GitHub

Notes
- Requires git and gh CLI installed and authenticated with push/PR permissions.
- The script assumes origin is writable; if using a fork, adjust the git remote or push target.
- The script is intentionally conservative and only updates the data/song-<id>.json file.
