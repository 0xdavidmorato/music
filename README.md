Music Learner — Minimal repository

This repository has been reorganized to keep only the songs data and IPA transcriptions necessary to continue development of the music/English learning app.

Structure now:
- data/
  - ipa.json            (central IPA mapping)
  - song-<id>.json     (one file per song containing lyrics, chords, timecodes, ipa, grammar_notes)
- docs/
  - architecture.md     (high-level architecture and data model)
  - DEV_GUIDE.md        (how to start development)

If you need any removed files restored, restore them from previous commits or from backups (index.html.bak exists in the history prior to this change).
