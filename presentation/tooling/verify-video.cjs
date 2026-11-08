const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");
const JSZip = require("jszip");
const OUT = path.resolve(__dirname, "../video");
const VIDEO = path.join(OUT, "Kliseer-Presentation-EN.mp4");
const timeline = JSON.parse(
  fs.readFileSync(path.join(OUT, "timeline.json"), "utf8"),
);
async function main() {
  const metadata = JSON.parse(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-count_frames",
        "-show_streams",
        "-show_format",
        "-of",
        "json",
        VIDEO,
      ],
      { encoding: "utf8" },
    ),
  );
  const video = metadata.streams.find((s) => s.codec_type === "video");
  const audio = metadata.streams.find((s) => s.codec_type === "audio");
  if (!video || !audio)
    throw new Error("Final MP4 must contain video and narration.");
  if (
    video.width !== 1920 ||
    video.height !== 1080 ||
    video.avg_frame_rate !== "30/1" ||
    Number(video.nb_read_frames) !== timeline.frames
  )
    throw new Error(
      "Video dimensions, frame rate or frame count do not match the authored timeline.",
    );
  if (
    Math.abs(Number(video.duration) - timeline.seconds) > 0.04 ||
    Math.abs(Number(audio.duration) - timeline.seconds) > 0.08
  )
    throw new Error(
      "Final narration and visual timeline are out of duration alignment.",
    );
  execFileSync("ffmpeg", ["-v", "error", "-i", VIDEO, "-f", "null", "NUL"], {
    stdio: "pipe",
  });
  const { spawnSync } = require("node:child_process");
  const meter = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      VIDEO,
      "-af",
      "volumedetect",
      "-vn",
      "-sn",
      "-f",
      "null",
      "NUL",
    ],
    { encoding: "utf8" },
  );
  if (meter.status !== 0) throw new Error(meter.stderr);
  const peak = Number(meter.stderr.match(/max_volume: ([\d.-]+) dB/)?.[1]);
  const mean = Number(meter.stderr.match(/mean_volume: ([\d.-]+) dB/)?.[1]);
  if (!Number.isFinite(peak) || peak >= 0 || mean < -35)
    throw new Error("Narration is clipped, missing, or unexpectedly quiet.");
  const preview = path.join(OUT, "review");
  fs.rmSync(preview, { recursive: true, force: true });
  fs.mkdirSync(preview, { recursive: true });
  const images = [];
  for (const [index, scene] of timeline.scenes.entries()) {
    const file = path.join(
      preview,
      `scene-${String(scene.slide).padStart(2, "0")}.png`,
    );
    const at = (scene.startFrame + scene.frames - 60) / timeline.fps;
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-v",
        "error",
        "-ss",
        String(at),
        "-i",
        VIDEO,
        "-frames:v",
        "1",
        file,
      ],
      { stdio: "pipe" },
    );
    images.push({
      input: await sharp(file).resize(640, 360).png().toBuffer(),
      left: (index % 3) * 660 + 20,
      top: Math.floor(index / 3) * 380 + 20,
    });
  }
  await sharp({
    create: { width: 2000, height: 1540, channels: 3, background: "#E5E7EB" },
  })
    .composite(images)
    .png()
    .toFile(path.join(OUT, "Kliseer-Video-Overview.png"));
  const proof = {
    videoCodec: video.codec_name,
    audioCodec: audio.codec_name,
    width: video.width,
    height: video.height,
    fps: 30,
    frames: Number(video.nb_read_frames),
    videoSeconds: Number(video.duration),
    audioSeconds: Number(audio.duration),
    bytes: Number(metadata.format.size),
    captionPhrases: timeline.scenes.reduce((n, s) => n + s.captions.length, 0),
    voice: timeline.voice,
    peakDb: peak,
    meanDb: mean,
    fullDecode: "passed",
    sampledScenes: 12,
  };
  fs.writeFileSync(
    path.join(OUT, "verification.json"),
    JSON.stringify(proof, null, 2),
  );
  const zip = new JSZip();
  for (const name of [
    "Kliseer-Presentation-EN.mp4",
    "Kliseer-Voiceover-EN.mp3",
    "Kliseer-Subtitles-EN.srt",
    "Kliseer-Video-Overview.png",
  ])
    zip.file(name, fs.readFileSync(path.join(OUT, name)));
  fs.writeFileSync(
    path.join(OUT, "Kliseer-Video-EN.zip"),
    await zip.generateAsync({ type: "nodebuffer", compression: "STORE" }),
  );
  const smoke = path.join(OUT, "render-smoke.mp4");
  if (fs.existsSync(smoke)) fs.unlinkSync(smoke);
  console.log(JSON.stringify(proof, null, 2));
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
