// Encodes the landing page's press clippings and aftermovie into web formats.
//
//   node scripts/encode-media.mjs          # encode anything missing
//   node scripts/encode-media.mjs --force  # re-encode everything
//
// Requires ffmpeg (with libaom-av1, libsvtav1, libx264 and libwebp) on PATH.
//
// Press clippings  public/images/NEWS/*.jpg  ->  public/media/press/<slug>[-640].{avif,webp}
// Aftermovie       public/videos/*.mp4       ->  public/media/aftermovie/
//   film-{1080,720}.{av1,h264}.mp4   full film with sound, played on demand
//   loop-{1080,720}.{av1,h264}.mp4   14 s silent b-roll loop shown before playback
//   poster-{1920,960}.{avif,webp}    first frame of the loop
//
// AV1 is listed first in the page so capable browsers take it; H.264 is the fallback.
// MP4s are written with +faststart so playback can begin before the download finishes.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";

const force = process.argv.includes("--force");

const PRESS_IN = "public/images/NEWS";
const PRESS_OUT = "public/media/press";
const FILM_IN = "public/videos/launchpad aftermovie.mp4";
const FILM_OUT = "public/media/aftermovie";

// The loop is a run of b-roll between two hard cuts in the source edit.
const LOOP_START = "43.40";
const LOOP_LENGTH = "14.0";

function ffmpeg(out, args) {
  if (!force && existsSync(out)) {
    console.log(`skip    ${out}`);
    return;
  }
  console.log(`encode  ${out}`);
  const started = Date.now();
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args, out], {
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.error(`ffmpeg failed for ${out}`);
    process.exit(r.status ?? 1);
  }
  console.log(`        done in ${((Date.now() - started) / 1000).toFixed(0)} s`);
}

const slugify = (name) =>
  basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Still images ------------------------------------------------------------------------

const avif = (crf) => ["-c:v", "libaom-av1", "-still-picture", "1", "-crf", String(crf), "-cpu-used", "4", "-pix_fmt", "yuv420p"];
const webp = (q) => ["-c:v", "libwebp", "-quality", String(q), "-compression_level", "6"];
const strip = ["-map_metadata", "-1"];

if (existsSync(PRESS_IN)) {
  mkdirSync(PRESS_OUT, { recursive: true });
  for (const file of readdirSync(PRESS_IN).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
    const src = join(PRESS_IN, file);
    const slug = slugify(file);
    // Thumbnail for the grid (never upscaled), plus the full-resolution scan for reading.
    const thumb = ["-vf", "scale='min(640,iw)':-2:flags=lanczos"];
    ffmpeg(join(PRESS_OUT, `${slug}-640.avif`), ["-i", src, ...thumb, ...avif(36), ...strip]);
    ffmpeg(join(PRESS_OUT, `${slug}-640.webp`), ["-i", src, ...thumb, ...webp(74), ...strip]);
    ffmpeg(join(PRESS_OUT, `${slug}.avif`), ["-i", src, ...avif(34), ...strip]);
    ffmpeg(join(PRESS_OUT, `${slug}.webp`), ["-i", src, ...webp(78), ...strip]);
  }
}

// Video -------------------------------------------------------------------------------

if (existsSync(FILM_IN)) {
  mkdirSync(FILM_OUT, { recursive: true });

  const h264 = (crf, maxrate, level) => [
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-maxrate", maxrate, "-bufsize", `${parseFloat(maxrate) * 2}M`,
    "-profile:v", "high", "-level:v", level, "-pix_fmt", "yuv420p",
  ];
  const av1 = (crf) => [
    "-c:v", "libsvtav1", "-preset", "6", "-crf", String(crf), "-g", "240",
    "-pix_fmt", "yuv420p", "-svtav1-params", "tune=0",
  ];
  const aac = ["-c:a", "aac", "-b:a", "128k", "-ac", "2"];
  const mp4 = ["-movflags", "+faststart", ...strip];
  const p720 = ["-vf", "scale=-2:720:flags=lanczos"];
  const loopIn = ["-ss", LOOP_START, "-t", LOOP_LENGTH, "-i", FILM_IN, "-an"];

  // Poster: the loop's first frame, so nothing jumps when the loop starts playing.
  for (const [w, crf, q] of [[1920, 32, 78], [960, 32, 78]]) {
    const args = ["-ss", LOOP_START, "-i", FILM_IN, "-frames:v", "1", "-vf", `scale=${w}:-2:flags=lanczos`];
    ffmpeg(join(FILM_OUT, `poster-${w}.avif`), [...args, ...avif(crf), ...strip]);
    ffmpeg(join(FILM_OUT, `poster-${w}.webp`), [...args, ...webp(q), ...strip]);
  }

  // The loop plays muted behind a gradient and a play button, so it is compressed harder
  // than the film. The source is grainy with fast cuts; lower CRFs cost 50%+ more bytes.
  ffmpeg(join(FILM_OUT, "loop-1080.av1.mp4"), [...loopIn, ...av1(46), ...mp4]);
  ffmpeg(join(FILM_OUT, "loop-1080.h264.mp4"), [...loopIn, ...h264(29, "3M", "4.0"), ...mp4]);
  ffmpeg(join(FILM_OUT, "loop-720.av1.mp4"), [...loopIn, ...p720, ...av1(46), ...mp4]);
  ffmpeg(join(FILM_OUT, "loop-720.h264.mp4"), [...loopIn, ...p720, ...h264(29, "1.5M", "3.1"), ...mp4]);

  ffmpeg(join(FILM_OUT, "film-1080.av1.mp4"), ["-i", FILM_IN, ...av1(34), ...aac, ...mp4]);
  ffmpeg(join(FILM_OUT, "film-1080.h264.mp4"), ["-i", FILM_IN, ...h264(23, "5M", "4.0"), ...aac, ...mp4]);
  ffmpeg(join(FILM_OUT, "film-720.av1.mp4"), ["-i", FILM_IN, ...p720, ...av1(35), ...aac, ...mp4]);
  ffmpeg(join(FILM_OUT, "film-720.h264.mp4"), ["-i", FILM_IN, ...p720, ...h264(23, "2.5M", "3.1"), ...aac, ...mp4]);
}
