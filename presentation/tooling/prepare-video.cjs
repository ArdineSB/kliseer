const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ROOT = path.resolve(__dirname, "../..");
const PUBLIC = path.join(ROOT, "opening-video/public/presentation");
const OUT = path.join(ROOT, "presentation/video");
const speech = JSON.parse(
  fs
    .readFileSync(path.join(PUBLIC, "audio/speech.json"), "utf8")
    .replace(/^\uFEFF/, ""),
);
const fps = 30;
fs.mkdirSync(OUT, { recursive: true });
for (const [from, to] of [
  ["design/fonts/Inter-Variable.ttf", "Inter-Variable.ttf"],
  ["presentation/assets/logo.png", "logo.png"],
  ["presentation/assets/icon.png", "icon.png"],
  ["presentation/assets/company.png", "company.png"],
  ["presentation/assets/outreach.png", "outreach.png"],
  ["presentation/assets/chat.png", "chat.png"],
])
  fs.copyFileSync(path.join(ROOT, from), path.join(PUBLIC, to));
let offset = 0;
const scenes = [];
for (const scene of speech) {
  const audio = path.join(PUBLIC, "audio", scene.file);
  const duration = Number(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        audio,
      ],
      { encoding: "utf8" },
    ).trim(),
  );
  const text = scene.captions.map((c) => c.text).join(" ");
  if (text !== scene.narration)
    throw new Error(`Caption transcript mismatch: ${scene.slide}`);
  for (let i = 0; i < scene.captions.length; i++) {
    const c = scene.captions[i];
    if (
      c.startMs < 0 ||
      c.endMs <= c.startMs ||
      c.endMs > duration * 1000 ||
      (i && c.startMs < scene.captions[i - 1].endMs)
    )
      throw new Error(
        `Invalid audio-boundary timing: slide ${scene.slide} caption ${i}`,
      );
  }
  const frames = Math.ceil((duration + 0.4) * fps);
  const normalized = `track-${String(scene.slide).padStart(2, "0")}.wav`;
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-v",
      "error",
      "-i",
      audio,
      "-af",
      `loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000,apad,atrim=end_sample=${frames * 1600}`,
      "-ar",
      "48000",
      "-ac",
      "1",
      path.join(PUBLIC, "audio", normalized),
    ],
    { stdio: "pipe" },
  );
  const captions = scene.captions.map((c) => ({
    ...c,
    text: ` ${c.text}`,
    pageBreakAfter: true,
  }));
  scenes.push({
    ...scene,
    captions,
    file: normalized,
    startFrame: offset,
    frames,
    audioDuration: duration,
  });
  offset += frames;
}
const imports = `import {Audio} from '@remotion/media';\nimport {AbsoluteFill, Sequence, staticFile} from 'remotion';\nimport {BasicCaptions} from './basic-captions.element';\nimport {NarratedScene} from './NarratedScene';\n`;
const jsx = scenes
  .map(
    (s) =>
      `    <Sequence name=${JSON.stringify(`${String(s.slide).padStart(2, "0")} / ${s.section}`)}${s.startFrame ? ` from={${s.startFrame}}` : ""} durationInFrames={${s.frames}}>\n      <NarratedScene slide={${s.slide}} durationInFrames={${s.frames}} title=${JSON.stringify(s.title)} section=${JSON.stringify(s.section)} cues={${JSON.stringify(s.captions.map((c) => ({ text: c.text, seconds: c.startMs / 1000 })))}} />\n      <Audio name="English narration" src={staticFile('presentation/audio/${s.file}')} />\n      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>\n        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={${JSON.stringify(s.captions, null, 2)}} />\n      </div>\n    </Sequence>`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(ROOT, "opening-video/src/NarratedTimeline.tsx"),
  `${imports}\n// Generated from the real TTS audio and bookmark timestamps by prepare-video.cjs.\nexport const narrationDurationInFrames=${offset};\nexport const NarratedPresentation=()=> (\n  <AbsoluteFill style={{background:'#FFFFFF'}}>\n${jsx}\n  </AbsoluteFill>\n);\n`,
);
const srtTime = (ms) => {
  const t = Math.round(ms);
  return `${String(Math.floor(t / 3600000)).padStart(2, "0")}:${String(Math.floor(t / 60000) % 60).padStart(2, "0")}:${String(Math.floor(t / 1000) % 60).padStart(2, "0")},${String(t % 1000).padStart(3, "0")}`;
};
let captionIndex = 0;
const srt = scenes
  .flatMap((s) =>
    s.captions.map(
      (c) =>
        `${++captionIndex}\n${srtTime((s.startFrame / fps) * 1000 + c.startMs)} --> ${srtTime((s.startFrame / fps) * 1000 + c.endMs)}\n${c.text}\n`,
    ),
  )
  .join("\n");
fs.writeFileSync(path.join(OUT, "Kliseer-Subtitles-EN.srt"), srt);
fs.writeFileSync(
  path.join(OUT, "timeline.json"),
  JSON.stringify(
    {
      fps,
      width: 1920,
      height: 1080,
      frames: offset,
      seconds: offset / fps,
      voice: speech[0].voice,
      rate: speech[0].rate,
      scenes,
    },
    null,
    2,
  ),
);
const concat = scenes
  .map(
    (s) => `file '${path.join(PUBLIC, "audio", s.file).replace(/\\/g, "/")}'`,
  )
  .join("\n");
const concatPath = path.join(OUT, "audio-concat.txt");
fs.writeFileSync(concatPath, concat);
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-v",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatPath,
    "-c:a",
    "libmp3lame",
    "-b:a",
    "192k",
    path.join(OUT, "Kliseer-Voiceover-EN.mp3"),
  ],
  { stdio: "pipe" },
);
fs.unlinkSync(concatPath);
console.log(
  JSON.stringify(
    {
      scenes: scenes.length,
      captions: captionIndex,
      frames: offset,
      seconds: offset / fps,
      voice: speech[0].voice,
      verified:
        "All caption phrases match the script and lie within measured audio duration.",
    },
    null,
    2,
  ),
);
