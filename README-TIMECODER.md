Timecoder helper

Use this script to create line timestamps for a song JSON (data/song-<id>.json).

1) Ensure the song JSON exists (e.g., data/song-viva-la-vida.json).
2) Open your audio player and load the song audio (assets/audio/...).
3) Run:
   python3 scripts/timecoder.py data/song-viva-la-vida.json
4) When prompted, press Enter to start recording (this marks t=0) and then press Enter at each line start while the audio plays.
5) The script writes data/song-viva-la-vida.lrc and updates the song JSON with time_start/time_end for each line.

Notes:
- You can abort with Ctrl+C; partial timestamps will still be written if any were recorded.
- For more precise editing, adjust time_start/time_end manually in the JSON afterwards.
