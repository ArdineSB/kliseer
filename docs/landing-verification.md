# Landing delivery verification

Verified locally on November 8, 2026. No production deployment or remote configuration change was performed.

## Delivered

- Static Astro landing with the five requested sections, four separate UI/cursor demonstrations, official logo/Inter, and semantic app tokens.
- Additive native Landing and Landing motion pages saved in design/kliseer.figcraft; saved document inspected with dirty=false. Eighteen landing exports exist. Hero desktop/mobile WebP assets were visually inspected and used by the responsive picture.
- Historical Hivolts 16 / 20, Tier S, with score factors 5 / 5 / 5 / 1; a correctly attributed Moishy contact and source/date; and a disclosure that Harborline is fictional. No invented pricing, testimonials, customer claims or automatic sending.
- Next /app basePath cutover, raw API/form/image/auth path updates, Caddy routing and guarded deployment instructions.

## Builds and checks exercised

- npm run check: all five suites passed (tier, account, contacts, chat-workspace, guest routing).
- npm run check:landing passed. Motion compiler and Astro static build passed.
- npm run build completed Next and Astro. Next production build was rerun successfully after the guest matcher correction.
- Full `npm run lint` passed.
- Caddy validated `deploy/Caddyfile`. Temporary local Caddy served the built Astro landing and proxied the production Next app.
- The design detector flagged Inter as a generic-font warning; the user-selected font was kept.

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
| Motion pause button | Document state paused; all four scenes settled; WebGL `running=false`; Lenis root class removed (native scroll restored) |
| Lenis wheel easing | A browser wheel input of 500 device px arrived as 400 CSS px; 16 animation-frame samples rose monotonically from 598 to 879 before settling at 960 |
| Lenis anchor navigation | `#how-it-works` updated the fragment; the anchored heading moved from 910 px to 64 px over the smooth transition with Lenis active |
| Reduced-motion stability | After 3 seconds, no active animations or cursor; workflow stayed final, Lenis was absent and WebGL stayed stopped |
| Continuous workflows | All four independently completed two cursor/UI cycles while visible; moving away settled each to its static final state |
| Cursor-tracking shader | Instrumented live WebGL `uLamp` followed the cursor from x=0.146 to x=0.806; motion smear was nonzero, the pixel sample changed by 5,380 and one click ripple was recorded |
| Global pause | Pause stopped Lenis, all scene loops and WebGL; native scrolling remained available |
| Hidden-document signal (fault injection) | `visibilitychange` stops canvas; native browser tab-switch automation is not claimed |
| Keyboard | Tab reached skip link, brand, navigation, login and hero actions; focus outline3px |
| Widths 320 / 390 / 768 / 1440 | Document scroll width matched each viewport; no broken images. Desktop and390px screenshots inspected |

JavaScript-disabled DOM/readability checks passed; that scenario's screenshot helper timed out. No full assistive-technology audit or field performance benchmark is claimed.
`q.tmp.ts` is an untouched local diagnostic importing a Linux-only deployed path (`/opt/kliseer/current/lib/db`); the root TypeScript build excludes only this temporary file. It was not executed.

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
