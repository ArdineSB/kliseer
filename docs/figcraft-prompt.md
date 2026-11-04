# Prompt desain Figcraft: Kliseer

Status: brief siap dicoba di FigCraft. Sumber keputusan: `decisions.md` (D-01, D-02, D-12, D-15, D-16 sampai D-23).

Acuan visual utama: [ref-1.png](../reference/ref-1.png) dan [ref-2.png](../reference/ref-2.png). Gunakan bersama [DESIGN.md](../DESIGN.md); nilai visual pada file FigCraft lama adalah snapshot, bukan pengganti kedua referensi ini.

## Cara pakai

1. Gunakan bagian **Prompt** sebagai brief saat membuat frame dan prototype di FigCraft.
2. Cek desain terhadap **Daftar layar dan state**. Buat dulu alur utama dari setup sampai detail prospek.
3. Simpan file `.figcraft`, lalu export hasil review sesuai **Export dan integrasi**.

## Prompt

```
Design a desktop-first web app called "Kliseer": a sales prospecting workspace
for US building-construction suppliers. Use reference/ref-1.png (gwift) and
reference/ref-2.png (Prompta) as the primary visual references: a light workspace,
pale gray navigation, white content surfaces, softly rounded cards, subtle
borders, generous space within groups, and a vivid purple accent used sparingly.
Use lavender selection backgrounds and quiet status colors. Keep prospect
tables compact while giving surrounding cards and controls breathing room.
Use solid colors as the baseline; small accent gradients are optional, never
large decorative backgrounds. Do not copy the reference brands, menus, pricing,
or prompt-library features into Kliseer.

The primary user is a sales rep who wants to describe their company and target
market, then review matching prospects. All product UI copy is in English.

Persistent app shell:
- Left sidebar with these tabs in this order: Home, Klise, Target, Seer,
  Signals, Competitors, Profiling, ICP. Highlight the active tab. Klise means
  company Background; Seer means Prospects.
- Main content in the center.
- Apply the references' header hierarchy: a slim contextual toolbar where
  useful, then page title, description and actions, filters, and content.
  This does not add global-search or account-menu features to the scope.
- A compact contextual chat on the right for every tab except Home. Keep it
  narrow enough that the main work area remains usable on a desktop screen.
  Each chat belongs to its tab and shows that tab's name.
- Home contains the global chat and conversation history grouped by tab. After
  initial setup, Home is available as the normal starting place for chat.
- Adapt the references' rounded composer and purple focus treatment to Home
  and the right chat panel. Do not place a floating composer over the Seer table.

First-use setup:
- A new user lands directly on the Company step.
- Show one setup step per screen with a clear progress indicator:
  Company → ICP → Target → Review. Completed steps can be revisited and edited.
- Map Company to Klise, ICP to ICP, and Target market to Target. Do not add a
  separate Goals step. Target means the companies, regions and buyer roles the
  rep wants to prospect, not a monthly meetings quota.
- The tab navigation remains visible during setup.
- The contextual chat asks questions and fills proposed drafts in the related
  structured fields. Keep fields visible and editable. Add a source marker to
  each chat-populated value that links back to its originating message.
- Review summarizes Company, ICP and Target with an Edit action on each
  section. This is a working design recommendation: make the primary action
  "Find prospects" and proceed to Seer.

Detailed screens for the main flow:
1. Klise / Company. Fields: company name, website, products and services,
   customer segments, existing customers, region and price range. Show empty,
   draft-filled and saved examples.
2. ICP. Criteria for industry, company size, region and event types. Show
   values, draft/approved status and edit controls.
3. Target. Fields for target company types, regions and buyer roles. Make it
   clear these define which prospects to find.
4. Review. Summary of Company, ICP and Target. Include Edit actions and the
   primary "Find prospects" action.
5. Seer / Prospects. Lead with three compact summary metrics: prospects found,
   Tier S prospects and new prospects. Below them, show search, filters and a
   table with company, domain, tier (S/A/B/C or dash), reason to buy, contact
   window, contact role, industry, status and source count. Filters: All, New
   this week, Tier S, Mine. Include loading progress by data source when
   prospect discovery is running.
6. Seer / Prospect detail. Working design recommendation: selecting a row
   opens the detail in the main content area while the sidebar and Seer chat
   stay visible. Show company name and tier; "Why now" signals with date, type,
   source and source link; decision makers with role, name, source URL and
   confidence; and contact window. If there is no tier, show: "Not enough
   corroborating signals from connected sources."

Basic supporting frames (keep these lighter than the main flow):
- Home: global chat, composer, three suggestion chips in the empty state, and
  conversation history grouped by tab.
- Signals: signal records grouped by source and sorted by date.
- Competitors: simple list or table.
- Profiling: simple company profile list or view.
- Use the shared sidebar and matching contextual chat in each tab.

Prototype interactions:
- Sidebar navigation switches tabs.
- Setup progress and step actions navigate through Company, ICP, Target and
  Review; completed steps can be revisited.
- Chat draft values appear in their fields and link to the source message.
- Edit actions return to the selected setup step.
- "Find prospects" opens Seer.
- Selecting a Seer row opens its detail view; provide a clear way back to the
  table.

States for the detailed screens: empty, loading with skeleton rows or fields,
error with a Retry action, and saved confirmation near the changed field.

Visual system:
- Match both references' light workspace tone, soft card shapes, quiet metadata,
  and clear hierarchy. Use white surfaces, a pale neutral sidebar, subtle borders,
  and purple for primary actions and active navigation. Prefer ref-2's lavender
  active item with purple text/icon and a small left indicator.
- Working color targets from DESIGN.md: primary #6D28D9, sidebar #F8F8F8,
  white workspace, active background #F3ECFF. These are normalized design choices,
  not claimed original tokens extracted from the reference products.
- Use distinct labeled Tier S/A/B/C badges; color must not be the only cue.
- Use Inter or a similar readable sans-serif; the exact fonts in the screenshots
  are unverified. Use tabular numerals for values, counts and dates.
- Use a 4px spacing rhythm, with 12-16px card gaps and 16-20px card padding.
  Working radii: 6px controls, 10px cards, 12px composer. Use subtle shadows on
  raised surfaces only. Keep table rows readable and avoid dense page-wide packing.
- Use reusable components and auto layout. Name frames by flow and state, e.g.
  "setup/company/empty", "setup/review/ready", "seer/table/loading", and
  "seer/detail/ready".

Create the frames and connect the primary interactions as a clickable
prototype. Prioritize the setup-to-Seer flow; supporting tabs only need a clear
base screen and navigation destination.
```

## Daftar layar dan state

Cek hasil Figcraft terhadap daftar ini sebelum export.

| Layar | Kosong | Loading | Error | Tersimpan |
|---|---|---|---|---|
| Setup: Company | ✓ | ✓ | ✓ | ✓ |
| Setup: ICP | ✓ | ✓ | ✓ | ✓ |
| Setup: Target | ✓ | ✓ | ✓ | ✓ |
| Setup: Review | ✓ | — | — | — |
| Seer (tabel) | ✓ | ✓ | ✓ | — |
| Seer (detail) | — | ✓ | ✓ | ✓ |
| Home | ✓ | ✓ | ✓ | — |
| Signals, Competitors, Profiling | ✓ | ✓ | ✓ | — |

Tiap tab selain Home perlu satu frame dasar dengan chat panel terisi, supaya lebar panel terlihat dengan konten nyata.

## Export dan integrasi

### Yang perlu diexport

1. Simpan sumber desain `.figcraft`.
2. Export screenshot PNG untuk frame utama, dengan nama yang sama seperti di prompt.
3. Bila berguna untuk handoff, export SVG atau PDF. FigCraft mendokumentasikan export gambar PNG, SVG, JPG, WebP, dan PDF.
4. Catat warna, font, spacing, radius, dan ukuran komponen sebagai design tokens/spec. Jangan mengandalkan ekspor token JSON khusus sebelum memverifikasi fitur tersebut di aplikasi.

### Cara masuk ke kode

- Token warna dan font masuk ke `globals.css` sebagai CSS variables bergaya shadcn (`--background`, `--primary`, `--border`, dan seterusnya), lalu Tailwind membacanya.
- Jangan pakai generator kode otomatis sebagai hasil akhir. Hasilnya biasanya div absolut dan inline style. Pakai sebagai referensi, lalu tulis ulang dengan komponen.
- Pemetaan komponen (usulan):

| Di Figcraft | Di kode |
|---|---|
| Button | `Button` (shadcn) |
| Tabs (sidebar) | `Tabs` atau daftar link dengan state aktif |
| Tabel prospect | `Table` (shadcn), dengan TanStack Table kalau perlu sort dan filter |
| Badge tier | `Badge` dengan variant per tier |
| Form field | `Input`, `Select`, `Textarea` |
| Detail panel | `Sheet` |
| Konfirmasi | `Dialog` |
| Loading | `Skeleton` |
| Notifikasi | `Sonner` (toast) |

- Di Figcraft, beri nama variant sama seperti props shadcn: `default`, `outline`, `ghost`, dan `size` `sm` atau `md`. Dengan begitu mapping-nya langsung.

### Stack frontend (usulan, belum disetujui)

Vite, React 19, TypeScript, Tailwind CSS, shadcn/ui (dibangun di atas Radix), Lucide icons. Recharts hanya kalau ada grafik. Stack ini mirip `apps/web` yang lama, tapi komponen dan layoutnya dibangun ulang dari desain baru. Komponen lama tidak disalin.

## Alur setelah desain jadi

1. Export masuk ke `kliseer-v2/design/` (token, PNG, spec).
2. Gua baca token dan screenshot, lalu menulis daftar komponen dan route.
3. Gua bangun frontend di folder scratch, di luar repo submission. Tidak ada commit sebelum kickoff 3 Nov 15:00Z.
4. Setiap layar dicek terhadap screenshot dan daftar state di atas.

## Yang belum diputuskan

- Framework dan stack implementasi React/Next.js belum dipilih; tentukan setelah desain FigCraft disetujui.
- Export token JSON khusus belum diverifikasi. Gunakan file `.figcraft`, PNG, dan catatan token/spec sebagai handoff awal.
- Nama tab "Klise" dan "Seer" dipakai sebagai label sidebar, sesuai keputusan D-01.
- Aturan penentuan tier S, A, B, C belum ditulis. Engine Phase 3 masih memakai HOT, WARM, COLD, unknown. Pemetaan keduanya belum diputuskan.
