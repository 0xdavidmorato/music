#!/usr/bin/env python3
"""
Interactive timecoder for song lines.
Usage: python3 scripts/timecoder.py data/song-<id>.json

Workflow:
- Run the script, it will list lines and wait for you to press Enter for each line while the song plays externally (or while you listen).
- It records timestamps (seconds from start) for each line press.
- It writes an .lrc file to data/song-<id>.lrc and updates the song JSON with time_start/time_end for each line.

Notes:
- You must play the audio externally (e.g., in another player) and press Enter when each line starts.
- The script is simple and works in terminals; no audio playback built-in.
"""
import sys
import time
import json
from pathlib import Path

if len(sys.argv) < 2:
    print('Usage: python3 scripts/timecoder.py data/song-<id>.json')
    raise SystemExit(1)

song_path = Path(sys.argv[1])
if not song_path.exists():
    print('Song file not found:', song_path)
    raise SystemExit(1)

song = json.loads(song_path.read_text(encoding='utf-8'))
lines = song.get('lines', [])
if not lines:
    print('No lines found in song data')
    raise SystemExit(1)

print('Timecoder interactive mode')
print('Play the song audio in another player. When you hear the start of each line, press Enter to record the timestamp.')
print('Press Ctrl+C to abort. Press Enter to start recording (this marks time 0).')
input('Ready? Press Enter to start...')

timestamps = []
start = time.time()
print('Recording...')
try:
    for i, ln in enumerate(lines):
        prompt = f'Line {i+1:02d}/{len(lines)}: "{ln.get("text","")[:40]}..." — press Enter when it starts'
        input(prompt)
        t = time.time() - start
        timestamps.append(t)
        print(f'  recorded {t:.2f}s')
except KeyboardInterrupt:
    print('\nAborted by user')

if not timestamps:
    print('No timestamps recorded')
    raise SystemExit(0)

# Build .lrc content and update song times
lrc_lines = []
for i, t in enumerate(timestamps):
    # LRC timestamp format [mm:ss.xx]
    mins = int(t // 60)
    secs = int(t % 60)
    hund = int((t - int(t)) * 100)
    tag = f'[{mins:02d}:{secs:02d}.{hund:02d}]'
    text = lines[i].get('text','')
    lrc_lines.append(f'{tag}{text}')

# write lrc file
lrc_path = song_path.with_suffix('.lrc')
lrc_path.write_text('\n'.join(lrc_lines), encoding='utf-8')
print('Wrote LRC to', lrc_path)

# update song JSON with time_start/time_end
for i, ln in enumerate(lines):
    if i < len(timestamps):
        ln['time_start'] = round(timestamps[i], 3)
        if i+1 < len(timestamps):
            ln['time_end'] = round(timestamps[i+1], 3)
        else:
            ln['time_end'] = None

song_path.write_text(json.dumps(song, ensure_ascii=False, indent=2), encoding='utf-8')
print('Updated song JSON with time_start/time_end')
print('Done.')
