"""Cut a raw CMS take into a focused clip: keyframed crop windows, optional removed ranges, loop fades.

  python3 scripts/cut-clip.py RAW OUT --start S --dur D --out-size 1600x924 \
      --window 0:92,60,876 --window 5.2-5.9:92,82,678 [--cut 3.1:4.0] [--fade 0.25] [--poster 0.92]

Windows are `t[-t2]:x,y,w` in CSS px of the 1280×800 capture (the raw is 2×): the crop's top-left and
width; height follows the output aspect. A window with one time is a hold from that time; a range is a
smoothstep transition from the previous window that starts at t and lands at t2. Times are in the OUTPUT
timeline (after --cut ranges, which are raw seconds relative to --start, are removed). --fade adds a
fade from/to white at both ends so the loop restart reads as intentional. The poster is cut at the
given fraction (or "Ns" seconds) of the finished clip. Writes OUT.mp4 (+ OUT-poster.jpg).
"""
import argparse, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("raw"); ap.add_argument("out")
ap.add_argument("--start", type=float, required=True); ap.add_argument("--dur", type=float, required=True)
ap.add_argument("--out-size", default="1600x1000")
ap.add_argument("--window", action="append", required=True)
ap.add_argument("--cut", action="append", default=[])
ap.add_argument("--fade", type=float, default=0.0)
ap.add_argument("--poster", default="0.9")
ap.add_argument("--crf", type=int, default=24)
ap.add_argument("--scale", type=float, default=2.0, help="raw px per CSS px")
a = ap.parse_args()

OW, OH = (int(v) for v in a.out_size.split("x"))
IW, IH = 1280 * a.scale, 800 * a.scale       # raw frame
ASPECT = OW / OH
TIME = "it"                                  # zoompan input-frame timestamp (after the cuts)

# Parse windows → (t_from, t_to, x, y, w) in CSS px; height = w / ASPECT.
states = []
for spec in a.window:
    when, box = spec.split(":")
    x, y, w = (float(v) for v in box.split(","))
    t0, t1 = (float(v) for v in when.split("-")) if "-" in when else (float(when), float(when))
    states.append((t0, t1, x, y, w))
states.sort()

def ease(t0, t1):
    if t1 <= t0:
        return f"gte({TIME},{t0})"          # a step: the window switches instantly at t0 (a hard cut)
    p = f"clip(({TIME}-{t0})/({t1}-{t0}),0,1)"
    return f"({p}*{p}*(3-2*{p}))"

def track(idx):
    """Piecewise expression for coordinate idx (0=x,1=y,2=w) over the states."""
    expr = str(states[-1][2 + idx])
    for i in range(len(states) - 1, 0, -1):
        prev, cur = states[i - 1][2 + idx], states[i][2 + idx]
        t0, t1 = states[i][0], states[i][1]
        blend = f"{prev}+({cur}-{prev})*{ease(t0, t1)}"
        expr = f"if(lt({TIME},{t1}),{blend},{expr})"
    return expr

# zoompan always crops a window of the SOURCE aspect (16:10) and stretches it to `s`. To land on a
# different output aspect without distortion, zoom to a 16:10 window that CONTAINS the wanted window
# (centred on it), emit at the source aspect, then crop to the output size. zoompan clamps its window
# to the frame, so the crop offset is computed per frame from the wanted window and the clamped one
# (crop's `t` runs on the same clock as zoompan's `it`), not assumed centred.
SRC_ASPECT = IW / IH
def expr(time_var):
    global TIME
    TIME = time_var
    Wd = f"(({track(2)})*{a.scale})"         # wanted window width, raw px
    Hd = f"({Wd}/{ASPECT})"                  # wanted window height, raw px
    Xd = f"(({track(0)})*{a.scale})"
    Yd = f"(({track(1)})*{a.scale})"
    if ASPECT >= SRC_ASPECT:                 # wider than source: zoom by width, crop the top/bottom excess
        z = f"({IW})/{Wd}"
        win_h = f"({IH}/({z}))"
        y_want = f"({Yd}+{Hd}/2-{win_h}/2)"
        y_cl = f"clip({y_want},0,{IH}-{win_h})"
        return dict(z=z, x=Xd, y=y_cl, crop_x="0", crop_y=f"(({Yd})-({y_cl}))/{win_h}*{ZH}")
    else:                                    # taller than source: zoom by height, crop the side excess
        z = f"({IH})/{Hd}"
        win_w = f"({IW}/({z}))"
        x_want = f"({Xd}+{Wd}/2-{win_w}/2)"
        x_cl = f"clip({x_want},0,{IW}-{win_w})"
        return dict(z=z, x=x_cl, y=Yd, crop_x=f"(({Xd})-({x_cl}))/{win_w}*{ZW}", crop_y="0")
if ASPECT >= SRC_ASPECT:
    ZW, ZH = OW, round(OW / SRC_ASPECT / 2) * 2
else:
    ZW, ZH = round(OH * SRC_ASPECT / 2) * 2, OH
zp = expr("it")                              # zoompan reads the input timestamp as `it`
cr = expr("t")                               # crop reads the frame timestamp as `t`
zoompan = (f"zoompan=z='{zp['z']}':x='{zp['x']}':y='{zp['y']}':d=1:s={ZW}x{ZH}:fps=25,"
           f"crop={OW}:{OH}:x='{cr['crop_x']}':y='{cr['crop_y']}'")

# Segments to keep (raw seconds relative to --start), after removing the --cut ranges.
cuts = sorted(tuple(float(v) for v in c.split(":")) for c in a.cut)
keep, cursor = [], 0.0
for c0, c1 in cuts:
    if c0 > cursor:
        keep.append((cursor, c0))
    cursor = max(cursor, c1)
if cursor < a.dur:
    keep.append((cursor, a.dur))
out_dur = sum(b - c for c, b in keep)

parts = []
for i, (s0, s1) in enumerate(keep):
    parts.append(f"[0:v]trim=start={s0:.3f}:end={s1:.3f},setpts=PTS-STARTPTS[k{i}]")
concat = "".join(f"[k{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=1:a=0[cat]"
post = zoompan
if a.fade > 0:
    post += f",fade=t=in:st=0:d={a.fade}:color=white,fade=t=out:st={out_dur - a.fade:.3f}:d={a.fade}:color=white"
post += ",format=yuv420p"
fc = ";".join(parts + [concat, f"[cat]{post}[v]"])

subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a.start}", "-t", f"{a.dur}", "-i", a.raw,
                "-filter_complex", fc, "-map", "[v]", "-an",
                "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-movflags", "+faststart", a.out + ".mp4"], check=True)
plen = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.out + ".mp4"]))
at = float(a.poster[:-1]) if a.poster.endswith("s") else plen * float(a.poster)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{at:.2f}", "-i", a.out + ".mp4", "-frames:v", "1", "-q:v", "4", a.out + "-poster.jpg"], check=True)
print(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration,size", "-of", "default=nw=1", a.out + ".mp4"]).decode().strip())
