#!/usr/bin/env bash
# Trim + encode a raw recording for the site, and cut its poster frame.
#   scripts/encode-clip.sh recordings/hero.webm public/media/hero-light 2.0 14.5 [speed] [posterAt]
#   → hero-light.mp4 (H.264, no audio, faststart) + hero-light-poster.jpg
# start/end are seconds in the raw file; speed > 1 shortens dead time (1.15–1.3 reads natural).
# posterAt is a fraction of the encoded clip (default 0.3) OR an absolute second when suffixed "s"
# (e.g. "11s"): the poster should show the page the clip is about, not the state it starts from.
# Env knobs:
#   CUT="from:to"   drop the raw range [from,to) — a jump cut over dead waiting (raw seconds, inside
#                   start..end). Cut only where the frame is static on both sides, so the join is invisible.
#   CROP="w:h:x:y"  crop the raw frame first (raw pixels — the recorder captures at 2×, so double the
#                   CSS px you measured) to frame the clip on the relevant action.
#   WIDTH=1600      output width (default 1600; the raw is 2560 wide so this is a downscale).
#   CRF=24          x264 quality.
set -euo pipefail
in="$1"; out="$2"; start="${3:-0}"; end="${4:-}"; speed="${5:-1}"; posterAt="${6:-0.3}"
width="${WIDTH:-1600}"; crf="${CRF:-24}"
[ -z "$end" ] && end=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
post="setpts=PTS/${speed}"
[ -n "${CROP:-}" ] && post="crop=${CROP},${post}"
post="${post},scale=${width}:-2:flags=lanczos,format=yuv420p"
if [ -n "${CUT:-}" ]; then
  cutFrom="${CUT%%:*}"; cutTo="${CUT##*:}"
  fc="[0:v]trim=start=${start}:end=${cutFrom},setpts=PTS-STARTPTS[a];[0:v]trim=start=${cutTo}:end=${end},setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,${post}[v]"
  ffmpeg -v error -y -i "$in" -filter_complex "$fc" -map "[v]" -an \
    -c:v libx264 -preset slow -crf "$crf" -movflags +faststart "$out.mp4"
else
  ffmpeg -v error -y -ss "$start" -i "$in" -t "$(echo "$end - $start" | bc)" -an \
    -vf "$post" \
    -c:v libx264 -preset slow -crf "$crf" -movflags +faststart "$out.mp4"
fi
plen=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out.mp4")
case "$posterAt" in
  *s) at="${posterAt%s}" ;;
  *) at=$(echo "$plen * $posterAt" | bc -l) ;;
esac
ffmpeg -v error -y -ss "$at" -i "$out.mp4" -frames:v 1 -q:v 4 "$out-poster.jpg"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height:format=duration,size -of default=nw=1 "$out.mp4"
