# Kliseer all-in-one opening

Remotion composition for a 20-second, 1920×1080, 30 fps product-presentation opener. The motion moves through company context, target criteria, a dated Hivolts prospect sample, an unsent email draft, and an evidence-grounded Kliseer chat.

## Focused version 2

`KliseerFocusedProspectV2` is a separate 30-second, 1920×1080, 30 fps composition. It removes the dashboard chrome and keeps one historical Hivolts prospect card as the only product surface. The card reveals its identity, score, four factors, and dated public signal in sequence. The displayed `16 / 20 · Tier S` remains a historical sample dated November 7, 2026; the public signal is not purchase intent.

## Narrated English presentation

`KliseerNarratedPresentationEN` is a separate 12-scene animated presentation with locally generated Microsoft Zira English narration and synchronized subtitles. Its timeline is 8,403 frames at 30 fps (4:40.1), 1920 × 1080. The opener and focused prospect compositions remain unchanged.

Final narrated output: `../presentation/video/Kliseer-Presentation-EN.mp4`; standalone MP3 and SRT are alongside it. The full narrated composition has been rendered and decoded successfully.
## Landing hero animation

The landing hero uses `KliseerAllInOneOpening`, the same 20-second Remotion composition previewed in Studio. It is rendered at 1200×674 from the 1920×1080 timeline, then centered and cover-cropped into the 1200×488 hero frame. It loops silently. The desktop still remains underneath as poster and fallback; mobile retains its dedicated portrait still. Playback pauses offscreen, in hidden tabs, when the page motion toggle is paused, and under reduced motion.

Rendered asset: `../landing/public/media/hero-opening-loop.mp4`.

Render using the focused entry point to avoid loading the narrated-presentation scenes:

```console
npx remotion render src/OpeningRenderEntry.tsx KliseerAllInOneOpening ../landing/public/media/hero-opening-loop.mp4 --codec=h264 --crf=22 --x264-preset=fast --concurrency=1 --disallow-parallel-encoding --disable-shared-memory-capture --scale=0.625
```




Sources: `src/NarratedScene.tsx` defines the animated visual scenes; generated `src/NarratedTimeline.tsx` groups each scene with its audio and caption phrases. Narration comes from `../presentation/tooling/content.json`. Rebuild and voice details are in `../presentation/README.md`. The native TTS input and normalized tracks are in `public/presentation/audio`.

```console
npx remotion render src/index.ts KliseerNarratedPresentationEN ../presentation/video/Kliseer-Presentation-EN.mp4 --concurrency=1 --disallow-parallel-encoding --disable-shared-memory-capture --codec=h264 --crf=18 --x264-preset=fast --audio-bitrate=192k
```

The animated UI is an illustration, not a live demonstration. Historical evidence, fictional seller, unverified contact, and unsent-draft boundaries remain explicit. No music or cloned voice is used.


## Preview

```console
npm run dev
```

Open `http://localhost:3000` and select `KliseerAllInOneOpening`. The five review compositions are grouped under `Review-Stills` and show the settled state of each beat.

## Verify and render

```console
npm run lint
npx remotion render src/OpeningRenderEntry.tsx KliseerAllInOneOpening out/kliseer-opening.mp4
```

The 1200×674 silent hero loop has been rendered from the opening composition. This command exports a separate full-resolution 1920×1080 MP4.

## Data disclosures

- Harborline Electrical Supply is a fictional seller study case; the company profile is an editable draft from illustrative files, and originals are not retained.
- Hivolts Electrical Inc is shown as a historical `16 / 20 · Tier S` sample dated November 7, 2026, not a live score.
- The NYC DOB record is a public signal, not confirmation of purchase intent.
- Moishy Rosman's email is provider-supplied and not verified.
- The email draft is illustrative and not sent.
