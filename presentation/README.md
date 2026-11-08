# Kliseer presentation — English

## Open these files

- **Kliseer-Presentation-EN.pptx** — 12 editable 16:9 slides. Every slide has English narration, timing, recording cues, and evidence references in Speaker Notes.
- **Kliseer-Presentation-EN.pdf** — slide-only export for review or submission.
- **Kliseer-Teleprompter-EN.txt** — spoken narration with slide/time markers.
- **Kliseer-Script-EN.md** — full recording guide, timeline, narration, demo cues, and source references.
- **preview/** — 1920 × 1080 slide images exported by Microsoft PowerPoint.

Target runtime: **4:40**, including brief pauses; 661 spoken words. Rehearse once to set your own pace. Slides advance manually. No recorded narration, app footage, or opening video is embedded.

**Selected visual direction: Editorial violet.** The deck alternates white, dark brand-violet, and one saturated-violet trust slide. Headlines now use **Sora SemiBold**; body copy, UI labels, and data use **Inter** through the static `Inter Presentation` compatibility family. Asymmetric layouts and editable product illustrations remain. Official logo assets, source evidence, all twelve narration paragraphs, timing, and recording cues are preserved. These refinements update the PowerPoint, PDF, slide previews, and presentation ZIP only; the previously rendered MP4 has not been restyled.

For an actual product-demo video, follow the app-recording cues on slides 4–8. The company, email, and chat panels are editable illustrations of the existing walkthrough, not a live session. Harborline is fictional; the Hivolts score is a historical November 7, 2026 snapshot. Public activity does not prove buying intent. Contact information still needs verification. No email is sent by Kliseer.

## Animated English presentation

The animated version is a separate Remotion composition, `KliseerNarratedPresentationEN`, in `../opening-video`. Its audio-locked timeline is **280.1 seconds** at **1920 × 1080 / 30 fps**, with 12 scenes and 68 English caption phrases. Open `http://localhost:3000/KliseerNarratedPresentationEN` while the existing Studio is running.

- `video/Kliseer-Presentation-EN.mp4` — rendered H.264 video with English narration and burned-in subtitles.
- `video/Kliseer-Voiceover-EN.mp3` — standalone English TTS narration.
- `video/Kliseer-Subtitles-EN.srt` — subtitle sidecar for an editor or player.
- `video/timeline.json` — measured scene durations and caption timestamps.
- `video/Kliseer-Video-EN.zip` — video, standalone narration, subtitle sidecar, and scene overview.

Verified final output: 1920 × 1080, 30 fps, 8,403 frames, 280.1 seconds of video and 280.107 seconds of AAC audio. The complete file decoded without errors. Audio peak was -1.4 dBFS (no clipping); twelve extracted scene frames were visually reviewed. Caption phrases match the source narration and use native TTS bookmark timings. No human listening assessment is claimed.

Voice: **Microsoft Zira Desktop**, US English, rate 1. This is a generic Windows synthetic voice, not a cloned voice or premium neural provider. Speech is generated locally; no script or private content is sent to a TTS service. Brand pronunciation aliases are applied for Kliseer, Klise, and Vultr. The presentation has no background music.

The video uses animated illustrative UI, not a live screen recording. Harborline remains fictional. Hivolts evidence is explicitly historical. The email and chat copy are illustrative and are not proof of a model response or of an email being sent.

To regenerate the narration and timeline, run from the repository root:

```console
powershell -NoProfile -File presentation/tooling/synthesize.ps1
node presentation/tooling/prepare-video.cjs
```

The speech generator uses native 16 kHz PCM so SAPI bookmarks retain the correct time units; requesting 48 kHz directly caused the engine's bookmark times to triple on this workstation. The preparation step normalizes levels, resamples to 48 kHz, pads each scene to an exact number of video frames, checks every caption against its source narration, and exports the MP3/SRT. Edit the narration in `tooling/content.json`, not the generated `opening-video/src/NarratedTimeline.tsx`.

From `opening-video`, export with the bundled Remotion browser:

```console
npm run lint
npx remotion render src/index.ts KliseerNarratedPresentationEN ../presentation/video/Kliseer-Presentation-EN.mp4 --concurrency=1 --disallow-parallel-encoding --disable-shared-memory-capture --codec=h264 --crf=18 --x264-preset=fast --audio-bitrate=192k
```

The sequential-encoding flags avoid the streaming encoder failure observed on this Windows workstation. Sparse image-sequence rendering with audio also failed in Remotion's inline audio writer; use `remotion still` for isolated frames or extract review images from the final MP4 instead. From the repository root, `node presentation/tooling/verify-video.cjs` decodes the final video, checks dimensions/frame count/audio duration and peak levels, extracts twelve review frames, and builds the ZIP.


## Record

Open the PPTX in Microsoft PowerPoint. Use **Record / Record Slide Show**, with Presenter View for private notes. Export at **Full HD / 1080p** after recording. The title and closing slides already bookend the video. If using the existing 20-second opener, shorten the body to keep the result under five minutes.

The deck uses **Sora SemiBold + Inter**. The display font comes from the [official Sora repository](https://github.com/sora-xor/sora-font/tree/master/fonts/ttf). `Inter Presentation` is a static 14pt-optical-size instance of the repository's Inter variable font, at Regular 400 and Bold 700; the distinct family name avoids variable-font collisions in Windows/Office. Font files and their SIL Open Font Licenses are included in the presentation ZIP. Install the bundled TTFs if your editor does not honor embedded fonts. Text, shapes, product illustrations, and the service table remain editable; only the official logo/icon assets are embedded images.

## Rebuild

From `presentation/tooling`:

```console
npm ci
powershell -NoProfile -File install-fonts.ps1
npm run build
powershell -NoProfile -File export.ps1 -EmbedFonts
node package.cjs
```

`content.json` is the narration source. `build.cjs` creates the PowerPoint and text files using the existing brand assets. `export.ps1` requires Microsoft PowerPoint on Windows; it exports PDF/PNG and checks text overflow, text overlap, off-slide shapes, and exact preservation of each source narration paragraph in Speaker Notes. It preserves any existing PowerPoint application session. `package.cjs` creates a contact sheet and a ZIP containing only the handoff files, not dependencies.

`install-fonts.ps1` registers the bundled fonts for the current Windows user. The static body fonts are already supplied; to regenerate them from `design/fonts/Inter-Variable.ttf`, run `prepare-fonts.py` with Python and fonttools 4.61.1. The PowerPoint exporter uses `SaveAs(..., EmbedFonts=true)` and records the actual text-run font assignments. Do not rely on a variable font's presence in Windows as proof that Office rendered it: inspect the PDF's embedded font names as well.

The deck changes no application behavior or production data. The demo URL and architecture come from repository documentation; live deployment availability has not been reverified for this presentation.
