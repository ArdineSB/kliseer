# Landing delivery verification

Verified locally on November 8, 2026. No production deployment or remote configuration change was performed.

## Delivered

- Static Astro landing with the five requested sections, four separate UI/cursor demonstrations, official logo/Inter, and semantic app tokens.
- Additive native Landing and Landing motion pages saved in design/kliseer.figcraft; saved document inspected with dirty=false. Eighteen landing exports exist. Hero desktop/mobile WebP assets were visually inspected and used by the responsive picture.
- Historical Hivolts16/20 Tier S sample, four factors5/5/5/1, correct Moishy recipient/provider disclosure, source record/date, fictional Harborline disclosure, no pricing/testimonials/customer claims or automatic sending.
- Next /app basePath cutover, raw API/form/image/auth path updates, Caddy routing and guarded deployment instructions.

## Builds and checks exercised

- npm run check: all five suites passed (tier, account, contacts, chat-workspace, guest routing).
- npm run check:landing passed. Motion compiler and Astro static build passed.
- npm run build completed Next and Astro. Next production build was rerun successfully after the guest matcher correction.
- Full ESLint: zero errors; two existing unused-parameter warnings in app/api/prospects/[id]/lookup/route.ts. Scoped ESLint for the changed proxy/regression test passed.
- Native Caddy binary validated deploy/Caddyfile as a valid configuration. A temporary local Caddy served landing/dist and proxied the built Next application, rather than testing only framework dev output.
- Impeccable detector reported only its generic Inter font warning. Inter is explicitly required by the brief, so it was retained.

## Browser scenarios exercised

| Scenario | Observed result |
|---|---|
| Critical hero image request held | Full-screen loader visible, site inert, status without numbers/progressbar, zero motion-module requests before readiness |
| Critical request released | Loader hidden and site released after actual image load/decode; no minimum-duration hold |
| Warm cached navigation | Loader duration0ms in the observed run |
| Hero request aborted | Static fallback visible, loader removed, site not inert |
| Continue without preview while request held | Immediate release to fallback; focus moved to Explore Demo |
| JavaScript disabled before navigation | Headline, links and all four final scenes present; loader hidden; no hidden result content |
| Reduced-motion preference | No intro shown, canvas display:none, zero active animations, no traveling cursor, all results visible |
| WebGL2 unavailable (fault injection) | Canvas hidden, static silver/violet CSS fallback retained, page ready |
| Four workflow sections | Each independently reached its final state on entering view |
| Replay | Observed initial hidden file rows and visible cursor, then phase1 with visible rows |
| Offscreen interruption | Active scene canceled to final readable state without replay on return |
| Pause motion control | Document state paused; canvas running=false |
| Hidden-document signal (fault injection) | visibilitychange handler stopped canvas (running true→false). Native browser tab-switch automation aborted, so this is not claimed as a real tab-switch test |
| Keyboard | Tab reached skip link, brand, navigation, login and both hero actions; observed3px focus outlines |
| Widths320/390/768/1440 | document scrollWidth matched viewport; no broken images. Desktop and390px screenshots inspected |

JavaScript-disabled DOM/readability checks passed; that scenario's screenshot helper timed out. No full assistive-technology audit or field performance benchmark is claimed.

## Routing regression found and fixed

The first production smoke found HTTP500 on a fresh /app visit: no guest cookie. The compiled negative-lookahead matcher required a slash after the base path and did not cover bare /app. Added the explicit root matcher, preserving exclusions for static/image/favicon paths. scripts/routing.check.ts failed for /app before the fix and passes afterward; it uses the actual installed Next matcher utility and server initialization.

After rebuilding/restarting the app:

- Fresh /app HTTP request returned200 and issued the guest cookie. Browser rendered the actual Home workspace.
- /app/api/seller returned200 through the browser session.
- Native sidebar links resolved under /app, without double prefixes.
- Login form submitted to /app/api/auth/login and displayed the expected invalid-credentials message. No test account was created.
- Seer search used action /app/seer; submitting HIVOLTS navigated to /app/seer?q=HIVOLTS&source= and rendered the Hivolts detail link.
- Caddy root returned200; missing static path returned404. Both local development-origin / and /app also returned200.
- /app/ returns308 to /app; CI health checks were corrected to use the slashless path.

## Deployment boundary

The production Caddy preparation is intentionally explicit in deploy/README.md. CI stops before activation without the persistent config symlink and backup. The bootstrap copy keeps that symlink valid before first activation; rollback retains the prior configuration. The remote activation/rollback procedure was not executed in this session.
