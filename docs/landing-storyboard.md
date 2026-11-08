# Kliseer landing — implementation storyboard

Status: new native Landing and Landing motion pages have been created in the existing design/kliseer.figcraft. This is the implementation contract for the approved landing delivery, not a redesign of the app. Mode: Persuade. The parent implementation owns runtime verification.

## Authority and scope

The latest user request authorizes design through implementation and supersedes the earlier no-implementation status in landing-page-prompt.md and design_landing.md. This document records landing-specific resolutions without overwriting either brief or DESIGN.md. The new landing crops supersede OLD EXPORTS only when illustrating this landing. Screens, Components, Q20, auth, setup and application masters remain untouched.

Sources inspected: landing-page-prompt.md; design_landing.md; DESIGN.md; PRODUCT.md; background.md; current components/Shell.tsx and UploadFiles.tsx; lib/fields.ts; app/globals.css; docs/sources.md C5/C6; scripts/seed-hunter-contacts.ts; native FigCraft document 2 and existing brand components. The three local motion videos were inspected as preview grids, not claimed as frame-by-frame timing measurements. The explicit brief fixes composition and brand; no alternative identity exercise was substituted.

## Native artifact map

File: design/kliseer.figcraft. Existing open document identity validated as 2.

| Artifact | Native ID | Size |
|---|---:|---|
| Landing page | 11370 | Native page |
| Landing motion page | 11371 | Native page |
| Desktop landing | 11372 | 1440 × 6410 |
| Mobile landing | 11373 | 390 × 8580 |
| Desktop hero | 11374 | 1440 × 1180 |
| Desktop How it works intro | 11375 | 1440 × 170 |
| Desktop Understand | 11376 | 1440 × 800 |
| Desktop Target | 11377 | 1440 × 800 |
| Desktop Prospects | 11378 | 1440 × 800 |
| Desktop Move | 11379 | 1440 × 860 |
| Desktop Inside a prospect | 11380 | 1440 × 860 |
| Desktop Data and limitations | 11381 | 1440 × 520 |
| Desktop Final CTA | 11382 | 1440 × 420 |
| Mobile sections, same order | 11383–11391 | 390 wide, natural stacked heights |
| Desktop critical product crop | 11440 | 1200 × 488 |
| Mobile critical product crop | 11520 | 342 × 470 |
| Loader/readiness review state | 12038 | 960 × 640 |
| Deferred background policy | 12057 | 960 × 640 |

### Four independent keyframe pairs

| Demonstration | Start | End | Desktop static crop | Mobile static crop |
|---|---:|---:|---:|---:|
| Understand your business | 11878 | 11894 | 11570 | 11590 |
| Define your target | 11917 | 11938 | 11613 | 11631 |
| Find your prospects | 11959 | 11978 | 11652 | 11669 |
| Make your move | 11998 | 12017 | 11689 | 11707 |

Each native keyframe is 960 × 980 with an editable white product crop, cursor position, action description and behavior notes. Clicking the start/end board swaps its paired board for review. This is a native review bridge, not a claim that the production cursor timeline has been implemented or tested inside FigCraft. The resting landing sections show the final UI without a cursor.

## Composition and exact copy

Hero headline, exact: **Stop guessing. Start aiming.** Display it over two centered lines on desktop and mobile. Supporting copy, exact: **Turn scattered business data into clear targets, relevant prospects, and focused outreach.** Primary CTA, exact: **Explore Demo**. No decorative kicker above any heading. No secondary motto.

Nav: How it works → #how-it-works; Inside a prospect → #inside-a-prospect; Data & limitations → #data-and-limitations; Log in → /app/login. Primary hero/final CTA → /app. Final Create account → /app/create-account. Astro owns /; Next owns /app.

Order: Hero → How it works intro → Understand your business → Define your target → Find your prospects → Make your move → Inside a prospect → Data and limitations → Final CTA. Four workflow sections are vertically sequential on desktop as well as mobile; no all-in-one pinned timeline, no scroll lock and no four-card fade-only substitute.

Desktop content maximum 1200 at 1440 (120 px side gutters). Native hero headline 88/94, support 20/30 with 660 px measure; white preview 1200 × 488 below substantial negative space. Workflow alternates copy/scene on desktop: Understand and Prospects have copy left, Target and Move have copy right. All four stack copy then scene on mobile. Native cropped interfaces are752 px; runtime uses fluid grid sizing and the same content priority rather than fixed canvas coordinates. Inside uses an open four-factor evidence table. Final heading: A clearer place to start.

Mobile 390: 24 px outer padding, 342 px content. Hero 44/50, section titles 34/42, body 17/27. UI is recomposed at 342 px, not a tiny desktop screenshot; it drops the app rail and reflows content. Primary touch targets are at least 44 px. Product factor labels and values are 14 px or larger; provenance metadata is 13 px. Email and filenames wrap rather than shrink. Four score factors stack with their reasons. Footer and limitations stack naturally. Heights in native frames are composition references, not fixed CSS page heights.

## Brand, surface and tokens

Inter is loaded from design/fonts/Inter-Variable.ttf into FigCraft. Official brand/lockup component 6965 comes from logo-concepts/kliseer-lockup.svg, not retyped lettering. Preserve source colors: the dark wordmark needs a small light neutral plaque on dark hero/loader/footer. Do not recolor the logo to white or create a replacement identity.

The app preview uses existing semantic variables: surface/canvas, surface/shell, surface/subtle, text/primary, text/label, text/secondary, text/muted, border/default, border/input, action/primary, selection/border, navigation/active-bg, status/success, tier/S-bg. These map to the corresponding existing CSS names (slashes become hyphens). Internal app remains light. New Landing surface collection is additive. Runtime names/values below are read from landing/src/styles/landing.css; native values remain the design reference, so this is an explicit role mapping, not a claim that both palettes are byte-identical:

| FigCraft semantic token | Native value | Shipped CSS mapping | Runtime value |
|---|---|---|---|
| landing/surface | #08080B | --film | #111112 |
| landing/elevated | #121217 | --film-raised | #19191D |
| landing/text | #F5F4F8 | --on-film | #F6F5F8 |
| landing/muted | #BDBAC8 | --on-film-secondary | #B9B6C4 |
| landing/line | #35323E | --film-line | #35343E |
| landing/silver | #D2D1D6 | --haze-silver | #D2D1D6 |
| landing/violet | #B6ACD6 | --haze-violet | #9A4FB0 |
| action/primary-subtle | #C4B5FD | --on-film-accent | #C4B5FD |

Use a black-film silver/violet haze, quiet behind type. No gradient lettering, oversized pointer effects, random particles or weapon imagery. App strokes, radii, purple actions and neutral surfaces retain the incumbent language. Focus on the dark surface uses a clearly visible light-violet outline with offset (runtime3 px/5 px), distinct from hover. Purple buttons use existing action/primary and action/primary-hover. Links gain underline on hover/focus. Text selection remains legible.

## Data contract and historical disclosure

Harborline Electrical Supply is a **fictitious seller study case**, not a customer, testimonial or default for every account. The approved illustrative upload filenames are **company-overview.md** and **product-catalog.pdf**. The company-name draft is **Harborline Electrical Supply**, quoted exactly as **“Harborline Electrical Supply”**, attributed to **company-overview.md**. These are illustrative files for the fictitious seller, not claims that real files were ingested during this design task. Native boards and exports were reconciled to these filenames and this draft during handoff.

Prospect is consistently **Hivolts Electrical Inc**. Preserve **Overall 16 / 20, Tier S; Keyword 5/5, Freshness 5/5, Place 5/5, Target fit 1/5** and label it **Historical sample · November 7, 2026**. These values are the approved historical snapshot described in DESIGN.md and are not recalculated in the landing. Target fit was 1 because companyTypes was unset. Time-sensitive freshness is not represented as today's live score. Buyer roles do not contribute points.

Evidence example: NYC DOB **B01483138-I1-EL**, **November 1, 2026**, temporary power/generator-hoist work, from docs/sources.md C5 field-level evidence. Source URL: https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=B01483138-I1-EL. Keep permit status and interpretation separate; do not generalize Complete permits into active demand. Public signal ≠ confirmed purchase intent.

Recipient: **Moishy Rosman**, **Operations Manager**, **moishy@hivoltselectrical.com**, Hivolts. Exact spelling comes from scripts/seed-hunter-contacts.ts row for company 69825. Label **Provider-supplied · not verified** (Hunter seed); do not call it deliverability-verified or company-website-confirmed. Hivolts website is hivoltselectrical.com. Do not silently correct the separate generic seed email jobs@hivoltelectrical.com, and do not borrow another company's contacts. The landing only uses Moishy's approved row.

Source classes remain distinct: public permit records, first-party company websites, provider/directory contacts. Missing contact data must stay missing. No invented customers, testimonials, metrics, source counts, price plans, purchase guarantees or automatic-send claims.

## Motion contract shared by all four sections

- The first critical image opens the door; background and workflow motion never gate the page. Native DOM/CSS/WAAPI drives the four demos; self-hosted Lenis smooths wheel and anchor scroll with reduced-motion support and browser-native fallback. The product demos remain local illustration: no live API calls, seeded accounts, or false performance estimates.

Begin each independent two-action sequence when at least 35% of its scene is visible. Move the cursor to real UI controls, reveal meaningful product state, then return to the static final state. Hold that complete readable result for 1.4 seconds, then loop while visible and motion is allowed. Use restrained ease-out and no spring overshoot. The cursor is decorative/aria-hidden and cannot intercept input. The loop is deliberate, continuous visual storytelling, not a four-card fade or chained scroll lock.

The accessible **Pause motion** / **Resume motion** control stops all four loops, the WebGL renderer, and Lenis; normal browser scrolling continues. Leaving the visible 35% threshold interrupts a scene to its complete final state and cancels its repeat delay; it starts looping again when it returns. Hiding the tab interrupts all sequences and stops WebGL. Buttons remain real, focusable product controls; animation never moves keyboard focus. No live regions announce simulated UI changes.

Reduced motion means native instant scrolling, static CSS haze, final scene states, no cursor travel or ripples. With no JavaScript, the final UI and ordinary anchor links remain readable. Mobile uses the same state model and a top-to-bottom layout without a scroll-locked oversized canvas.

### 1. Understand your business

Start: Klise / Company, Company background; PDF, MD or TXT, 2 MB per file; multiple-file document area and Upload files action. Cursor targets Upload files, not an unrelated label.

Action/change: simulated selection of **company-overview.md** and **product-catalog.pdf**; two distinct per-file rows appear and reach Ready. The **Company name** draft becomes **Harborline Electrical Supply**, with exact quote **“Harborline Electrical Supply”** and filename **company-overview.md**. No automatic approval. This may reveal rows with a short clip-height transition while retaining document geometry.

End: both file rows and filename-attributed draft remain visible; note that original files are not retained and drafts require review. If demonstrating failure in future, one failed file must not delete successes; retry/remove applies per file. Current storyboard is the successful two-file example, not a storage quota or DOCX demo.

### 2. Define your target

Start: Target / Market, Define your market, real labels Regions, Buyer roles, Company types. Company types remains **Not specified in this snapshot**. Regions and Buyer roles show empty entry prompts.

Action/change: cursor focuses Regions and enters **New York, New Jersey** (NY/NJ), then Buyer roles becomes **Operations Manager**. Use a short text/state change and a visible field focus border. Do not animate fake approval.

End: filled editable Regions and Buyer roles, explicit unset Company types, and note that buyer roles do not add score points. This is an illustrative field interaction; the subsequent Hivolts score remains separately labeled as the fixed November 7 historical snapshot, not a fresh score caused by these keystrokes.

### 3. Find your prospects

Start: Seer / Prospects with the historical Hivolts row,16/20 Tier S. Native keyframes crop tightly to this one company; runtime may show the separately approved WCK Electric Corp. and A & S Electric Inc. historical16/20 Tier S comparison rows from the same November7 snapshot. No invented result totals or companies.

Action/change: cursor selects the Hivolts row; selected lavender state reveals the same company's supporting-signal detail. Preserve company identity and score. Native review boards use a detail-view transition; runtime keeps the compact table above the expanded supporting signal. These are explicitly different crops of the same interaction, not a claim of pixel-identical layouts.

End: Hivolts, Overall16/20 Tier S, dated DOB signal and supporting source. The runtime source excerpt names temporary power/generator-hoist work and November1,2026; the landing's evidence panel supplies record B01483138-I1-EL. No fake lead-generation progress or live refresh claim. Public signals are not confirmed buying intent.

### 4. Make your move

Start: Hivolts / Email draft, available recipient Moishy Rosman with role/email and provider provenance, Generate draft action. Cursor selects the recipient context then activates Generate draft.

Action/change: recipient remains stable while subject and editable draft body appear. A brief Draft preparation state is illustrative, not a measured API estimate. No email-send action appears.

End: **Draft prepared. Not sent.** Recipient Moishy Rosman; subject **Electrical supply coordination**; greeting **Hi Moishy Rosman,**; question **Would it be useful to discuss electrical supply requirements for upcoming work?** Keep the illustrative-copy/review notice and explicit statement that Kliseer does not send this email. Native final boards and static scenes use this content. No live claims, invented-person signatures, purchase urgency or invisible recipient substitution.

## Loader and background readiness

The full-screen intro is an enhancement only while the single critical above-fold product preview asset is actually pending decoding/loading. Desktop uses landing/src/assets/hero-desktop.webp, 1200×488; mobile uses hero-mobile.webp, 684×940 for a 342×470 CSS crop. Native source IDs11440/11520. An accessible picture selects the correct variant. Optimized image generation must preserve the content and aspect ratio. Provide descriptive alt and equivalent surrounding HTML facts, not an inaccessible screenshot-only marketing argument.
Desktop hero presentation: use the Remotion `KliseerAllInOneOpening` composition as a silent 20-second H.264 loop at `landing/public/media/hero-opening-loop.mp4` (1200×674, 30 fps), centered and cover-cropped into the 1200×488 preview. The existing decoded hero image remains the accessible poster, no-JavaScript and playback fallback, and critical-loader asset. Load/play video only while the desktop hero is visible, the page is visible, and motion is allowed; pause offscreen, in hidden tabs, on the global motion pause, or under reduced motion. Mobile keeps the 684×940 portrait still.

Display official logo on light plaque and **Preparing the product preview…** only if readiness is genuinely pending. No minimum timer, percentage, countdown or estimated seconds. Cached/already-complete image bypasses the intro immediately. Decode rejection or asset error releases a readable fallback. **Continue without preview** dismisses the intro and exposes the fallback; no focus trap. Content is visible when JavaScript is absent. Status describes critical-preview readiness, not all-page readiness.

The silver/violet film stays as a static CSS fallback immediately. A bundled, self-hosted WebGL enhancement starts only when the hero is visible and the browser is idle; it follows mouse/pen position, smooths the light to the cursor, adds restrained drag and a two-second click ripple, then naturally drifts when untouched. No `preventDefault`, pointer capture, or click interception. Touch retains native scrolling. A low-power context caps resolution to640,000 pixels and drawing to30 frames/second. It pauses offscreen, on hidden tabs, on user pause or during bfcache suspension; reduced motion or save-data preserves the still background. Context loss falls back without withholding content. The shader is independent of the above-fold image readiness.

## Precise divergences resolved

1. Old design-only hold → current user-approved full delivery; this file does not erase the historical brief.
2. Old horizontal linked workflow → four vertically sequential, separately triggered scenes on both breakpoints.
3. Old bright mauve surface → user-requested black-film silver/violet Velvet Haze; app surfaces stay light.
4. Old sidebar Profiling/ICP → current app Home / Klise / Target / Seer / Signals / Competitors / Contacts. ICP still exists in setup; it is not a landing sidebar item.
5. Old Seer Fit96 / three factors → four 0–5 factors, total0–20 and deterministic tier. Only the approved historical16/S sample appears.
6. Old single-file/storage meter → multi-file PDF/MD/TXT, 2 MB per file, per-file Ready rows and filename-attributed drafts. No DOCX or invented1GB quota.
7. Other prospects/no-contact examples → consistent Hivolts + approved Moishy seed throughout the draft journey.
8. Generic verified/contact claims → provider-supplied, not verified; source classes and dates explicit.
9. All-in-one or indefinite animation → independent once-on-entry timelines, explicit Replay, static final interruption/reduced-motion/no-JS state.
10. Estimated intro duration → real critical-asset readiness only, failure release and no forced wait.
11. WebGL required for first paint → nonblocking runtime-deferred enhancement over static fallback.
12. Screenshot scaled down for mobile → dedicated342 px recomposition with readable typography.
13. Handoff reconciliation uses approved illustrative company-overview.md/product-catalog.pdf files, the company-name quote, Operations Manager role, alternating desktop sections, #data-and-limitations anchor and “A clearer place to start.” headline. No-JS final UI and historical data disclosures are unchanged.

### Native design versus runtime composition

The native pages are complete editable design/storyboard artifacts, not screenshots of Astro DOM. During handoff, core data, source filenames, role, final headline and alternate desktop placement were reconciled. Runtime retains the same exact hero copy/CTA and user-selected identity but uses editorial section headings, a numbered stage navigation, a compact comparison table, source beside factors, and fluid dimensions. These composition refinements do not supersede app masters. Step numbering belongs in stage navigation or alongside/below the heading, never a decorative kicker above it. Review the parent-owned implementation for browser behavior rather than treating native click-pairs as production animations.

## Visual handoff and verification responsibility

Completed: native screenshots inspected the complete desktop composition, both heroes, the four workflow states across desktop/mobile, mobile limitations/final, both analysis layouts, all four start/end pairs, and the loader/background policy. Corrections made from those renders: removed haze rectangle seams, aligned the prospect score header, moved cursor endpoints onto their meaningful targets, clarified that end-board cursors fade after settling, and increased spacing after the wrapped mobile draft subject. The polished mobile draft and target/prospect boards were rendered again. No visible text clipping remained in those inspected captures.

After reading the shipped Astro components, the native Company/Target data, draft copy, loader wording, alternating layout and final heading were updated. The reconciled complete desktop, mobile Company/Target and mobile draft were screenshot-reviewed. Nine affected exports were refreshed; unchanged hero crops were not regenerated.

Saved the same design/kliseer.figcraft successfully; the final reconciliation save returned3,068,361 bytes. Earlier native post-save inspection returned dirty=false and confirmed existing top-level counts Screens45, Components33, Q20 options9; reconciliation changed only the new landing nodes. Additions are Landing with two complete sectioned layouts and Landing motion with eight keyframes plus two policy boards. Native CTA/anchor/replay references are attached; browser and presenter interactions were not exercised.

Exported successfully:

- design/export/landing-desktop.png and landing-mobile.png — complete layouts.
- design/export/landing-hero-desktop.png and landing-hero-mobile.png — first-section previews.
- design/export/landing-workflow-understand.png, landing-workflow-target.png, landing-workflow-prospects.png, landing-workflow-move.png — four separate desktop sections.
- design/export/landing-inside-desktop.png and landing-inside-mobile.png — analysis and disclosure layouts.
- design/export/landing-motion-understand.png, landing-motion-target.png, landing-motion-prospects.png, landing-motion-move.png — paired start/end boards.
- design/export/landing-loader.png and landing-background.png — readiness and deferred-enhancement contracts.
- design/export/landing-product-desktop.webp (1200×488, 57,088 bytes) and landing-product-mobile.webp (684×940, 46,444 bytes) — white UI crops only.
- At the parent's explicit request, the same critical crops are also written to landing/src/assets/hero-desktop.webp and hero-mobile.webp for implementation import. The export destination was initially absent, then created; both final exports succeeded.

Browser checks, actual routes, observer/replay/keyboard behavior, responsive image loading, failure paths, reduced motion, WebGL lifecycle and builds/tests remain the parent implementation's final verification responsibility. No browser runtime result, build, test, deployment or remote push is claimed by this native design handoff.
