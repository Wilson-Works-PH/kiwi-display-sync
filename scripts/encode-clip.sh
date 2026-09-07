#!/usr/bin/env bash
# Trim + encode a raw recording for the site, and cut its poster frame.
#   scripts/encode-clip.sh public/media/raw/hero.webm public/media/hero-light 2.0 14.5 [speed] [posterAt]
#   → hero-light.mp4 (H.264, 1280 wide, no audio, faststart) + hero-light-poster.jpg
# start/end are seconds in the raw file; speed > 1 shortens dead time (1.35 reads natural).
# posterAt is a fraction of the encoded clip (default 0.3): the poster should show the page the clip
# is about, not the dashboard it starts from.
set -euo pipefail
in="$1"; out="$2"; start="${3:-0}"; end="${4:-}"; speed="${5:-1}"; posterAt="${6:-0.3}"
dur=""; [ -n "$end" ] && dur="-t $(echo "$end - $start" | bc)"
ffmpeg -v error -y -ss "$start" -i "$in" $dur -an \
  -vf "setpts=PTS/${speed},scale=1280:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -movflags +faststart "$out.mp4"
plen=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out.mp4")
ffmpeg -v error -y -ss "$(echo "$plen * $posterAt" | bc -l)" -i "$out.mp4" -frames:v 1 -q:v 4 "$out-poster.jpg"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$out.mp4"
