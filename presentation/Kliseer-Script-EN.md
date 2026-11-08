# Kliseer — English presentation script

12 slides · 16:9 · target runtime 4:40 · 661 spoken words.

Only read the paragraphs under **Say**. Timing includes short pauses and cursor movements; rehearse once and advance manually. The same text is in PowerPoint Speaker Notes. No audio or video is embedded.

## Recording setup

- Record at 1920 × 1080. Use PowerPoint Record / Record Slide Show with Presenter View so notes stay off the audience display. Export as Full HD video after recording.
- Slides 4–8 are the demo segment. For a working-product demo, replace those visuals in the video edit with real app footage using the cues below, keeping the same time slots. Walkthrough stills are illustrations, not runtime proof.
- Start in a blank guest workspace and use **Load demo data** if needed. Harborline is fictional. Do not use private company documents in a public recording.
- Live signals and scores may differ. Slide 6 explicitly uses the November 7, 2026 snapshot; never call it a live score.
- Keep passwords, API keys, connection strings, and cloud-console secrets off screen. Do not send outreach.
- The separate 20-second opening-video project is optional and not embedded. Adding it without trimming puts the target at 5:00; shorten the body if you use it and want to stay under five minutes.
- Check the demo URL before publishing. No recorded audio, current deployment verification, or measured business results are implied by this deck.

## Timeline

| Slide | Time | Duration | Topic |
|---|---|---|---|
| 1 | 0:00–0:18 | 18s | From public signals to a smarter first move. |
| 2 | 0:18–0:41 | 23s | A prospect list is not a reason to reach out. |
| 3 | 0:41–1:03 | 22s | Klise understands you. Seer finds the signal. |
| 4 | 1:03–1:26 | 23s | Start with the business you already know. |
| 5 | 1:26–1:53 | 27s | Turn public activity into a shortlist. |
| 6 | 1:53–2:22 | 29s | Show the evidence behind the priority. |
| 7 | 2:22–2:47 | 25s | A next step you can review. Not autopilot. |
| 8 | 2:47–3:09 | 22s | Ask questions against your workspace. |
| 9 | 3:09–3:39 | 30s | Vultr powers the working system. |
| 10 | 3:39–4:00 | 21s | Useful AI has clear boundaries. |
| 11 | 4:00–4:22 | 22s | A clearer decision, not just more data. |
| 12 | 4:22–4:40 | 18s | Know why. Then make your move. |

## 01 — From public signals to a smarter first move.

**Time:** 0:00–0:18

**Say**

Sales teams do not need another list of company names. They need a reason to reach out. Kliseer connects seller context, dated public signals, and reviewable outreach, helping building-material and electrical suppliers decide where to focus next.

**Recording cue — do not read aloud**

Open on the title slide. Pause briefly after 'a reason to reach out'. Do not add the separate 20-second opening video to this timeline without shortening another section.

**Evidence / provenance**

- PRODUCT.md
- README.md

## 02 — A prospect list is not a reason to reach out.

**Time:** 0:18–0:41

**Say**

For a supplier, prospect research means connecting several pieces: what we sell, which companies fit, and what has recently happened. A public permit can be useful, but it still needs context. The challenge is turning that scattered information into a clear, defensible next step, without pretending that activity equals buying intent.

**Recording cue — do not read aloud**

Hold the three research questions on screen. Emphasize 'activity equals buying intent' as the risk, not as a product claim.

**Evidence / provenance**

- PRODUCT.md
- docs/scope.md

## 03 — Klise understands you. Seer finds the signal.

**Time:** 0:41–1:03

**Say**

Kliseer brings that work into one workspace. Klise helps turn company information into a profile and target criteria that the seller reviews. Seer surfaces prospects with dated evidence and explainable scores. From there, the seller can inspect contacts, ask questions, and prepare an outreach draft, while keeping control of the final decision.

**Recording cue — do not read aloud**

Introduce Klise first, then Seer. Pronunciation guide for rehearsal: Kliseer = 'klee-seer'; Klise = 'klees'; Seer = 'seer'.

**Evidence / provenance**

- PRODUCT.md
- README.md
- lib/score.ts

## 04 — Start with the business you already know.

**Time:** 1:03–1:26

**Say**

For this walkthrough, we use Harborline Electrical Supply, a fictional distributor serving New York and New Jersey. The seller can upload company materials or describe the business in chat. Klise prepares editable fields, including products and service regions. Each setup section is reviewed separately before approval, so an AI suggestion does not silently become an accepted fact.

**Recording cue — do not read aloud**

Recording cue: show the real app's Klise setup, review a draft field, then show its approval state. The slide contains a product-walkthrough still, not a live app recording. Use the existing demo profile; do not expose private documents.

**Evidence / provenance**

- README.md
- PRODUCT.md
- opening-video/README.md
- opening-video/review-01-company.png

## 05 — Turn public activity into a shortlist.

**Time:** 1:26–1:53

**Say**

Seer uses public permit sources from New York City, Austin, and Seattle. It surfaces companies with a signal in the last year, then applies rules for keyword matches, freshness, location, and target fit. These factors produce a score and tier. The language model does not assign those numbers. This is prioritization based on observable evidence, not a prediction that a company is ready to buy.

**Recording cue — do not read aloud**

Recording cue: open Seer, select a current prospect, and show the signal date and source. Live scores can differ from the historical example on the next slide. Do not promise nationwide coverage or guaranteed buying intent.

**Evidence / provenance**

- README.md
- lib/score.ts
- lib/prospects.ts

## 06 — Show the evidence behind the priority.

**Time:** 1:53–2:22

**Say**

Here is a concrete historical example: Hivolts Electrical in Brooklyn. In the November seventh snapshot, its score was sixteen out of twenty, or Tier S. The cited November first permit describes temporary power and generator-hoist work. That suggests relevance to an electrical supplier, but not a confirmed purchase. Target fit was only one out of five, so the seller can see both the supporting evidence and the limitation.

**Recording cue — do not read aloud**

Use the dated slide as the historical reference. If recording the app, show Analysis and Sources; read the actual current score rather than calling this snapshot live. The single cited permit is an example of evidence, not the sole basis of the aggregate score.

**Evidence / provenance**

- docs/sources.md:542-584
- opening-video/README.md
- https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=B01483138-I1-EL
- https://hivoltselectrical.com/

## 07 — A next step you can review. Not autopilot.

**Time:** 2:22–2:47

**Say**

Once a prospect looks relevant, the seller checks the available contact and its source. Kliseer can then draft a first-touch email using seller information and dated signals. The message stays editable, and Kliseer does not send it. Provider-supplied contact details are not treated as verified. The seller still needs to confirm the recipient, the facts, and whether the outreach makes sense.

**Recording cue — do not read aloud**

Recording cue: show a contact's source, open Email draft, then review the draft. Do not click an external mail client or send email. The still uses illustrative, unsent copy and a provider-supplied, unverified contact.

**Evidence / provenance**

- lib/draft.ts
- PRODUCT.md
- docs/sources.md:542-575
- opening-video/review-04-move.png

## 08 — Ask questions against your workspace.

**Time:** 2:47–3:09

**Say**

The chat also works with the current workspace: the seller profile, top Seer prospects, and sourced contact records. A rep can compare candidates, ask who has available contacts, or identify promising prospects that still need contact research. Missing details should remain missing, rather than being filled with a plausible-looking email address or an invented decision-maker.

**Recording cue — do not read aloud**

Recording cue: ask 'Which top prospects have no saved contacts?' in Home chat and show the returned records. Wait for the actual response; cut waiting time in editing, not the evidence. The slide's visual is an illustrative historical walkthrough.

**Evidence / provenance**

- README.md
- lib/chat.ts:57-96
- lib/chat-workspace.ts
- opening-video/review-05-chat.png

## 09 — Vultr powers the working system.

**Time:** 3:09–3:39

**Say**

Vultr is central to the backend, not just a place to host a page. Cloud Compute runs the Next.js application and the scheduled public-data ingestion. Supabase, deployed through Vultr Marketplace, stores profiles, conversations, companies, and signals. Vultr Serverless Inference supports AI drafting and contextual responses. The important separation is that application rules calculate scores, while the model helps interpret and communicate the supplied information.

**Recording cue — do not read aloud**

Return from the app recording to this technology slide. Point verbally to compute, storage, then inference. Do not show credentials, database connection strings, or the cloud console. Architecture reflects repository documentation, not a new deployment verification.

**Evidence / provenance**

- README.md:9-33
- lib/score.ts
- lib/chat.ts
- lib/draft.ts

## 10 — Useful AI has clear boundaries.

**Time:** 3:39–4:00

**Say**

Three boundaries matter. A relevance score is not buying intent. A sourced contact is not automatically a verified contact. And a generated draft is not a sent email. Kliseer makes these distinctions visible and keeps review with the seller. That is the product's approach: assist real sales work without disguising uncertainty as confidence.

**Recording cue — do not read aloud**

Use a short pause between the three distinctions. This is a product-boundary slide, not a claim that model hallucinations are impossible.

**Evidence / provenance**

- PRODUCT.md
- README.md
- opening-video/README.md

## 11 — A clearer decision, not just more data.

**Time:** 4:00–4:22

**Say**

The intended value is a more focused research workflow: understand the seller, prioritize with evidence, and prepare a relevant first conversation. We are not claiming measured revenue gains or hours saved. Those are things to validate. The next evaluation should measure time to a reviewed shortlist, evidence accuracy, and whether sales reps find the resulting drafts useful.

**Recording cue — do not read aloud**

Keep this as a value hypothesis and evaluation plan. Do not add traction, customer logos, revenue, conversion rates, or time-saving percentages without evidence.

**Evidence / provenance**

- PRODUCT.md
- README.md
- Proposed evaluation plan; no measured results claimed.

## 12 — Know why. Then make your move.

**Time:** 4:22–4:40

**Say**

Kliseer turns scattered business information into a reviewed path from context to outreach. Built on Vultr, it helps suppliers understand why a prospect deserves attention and what still needs checking. That is Kliseer: know why, then make your move. Thank you.

**Recording cue — do not read aloud**

Hold the closing slide for the remaining time. The demo URL comes from README.md; check that it is reachable before publishing the final video. End cleanly; do not add another summary slide.

**Evidence / provenance**

- README.md
- PRODUCT.md
