# Third-party notices and scope

The root [`LICENSE`](LICENSE) grants MIT terms for original Kliseer-contributor-authored project source and documentation, including the application, landing page, and original video/presentation source. It does not relicense third-party materials, datasets, trademarks, dependencies, or generated voice recordings. The project package manifests declare MIT for first-party code and remain private to prevent accidental npm publication; `private` does not restrict the MIT permission grant.

## Fonts

- **Inter** — Copyright 2020 The Inter Project Authors. SIL Open Font License 1.1. The source notice and full license are preserved in [`design/fonts/Inter-OFL.txt`](design/fonts/Inter-OFL.txt); the landing copy also appears at `landing/public/fonts/OFL.txt`. Applies to the bundled Inter font files, including the static presentation instances and landing WOFF2.
- **Sora** — Copyright 2019 The Sora Project Authors. SIL Open Font License 1.1. The source notice and full license are preserved in [`design/fonts/Sora-OFL.txt`](design/fonts/Sora-OFL.txt), alongside the bundled Sora presentation font.

These fonts remain under their own OFL terms; this repository's MIT license does not replace or override those terms.

## Software dependencies and Remotion

Dependencies declared in the root, `opening-video`, and presentation tooling package manifests are separately licensed third-party software. Their package metadata and lockfiles are the starting point for identifying applicable notices; this file is not an exhaustive dependency inventory and does not represent every dependency as MIT-licensed. Preserve the applicable upstream notices when redistributing dependency code.

The project uses Remotion (`remotion` and `@remotion/*`) for the opening-video and presentation workflows. Remotion is not being declared MIT-licensed here. Its official [license FAQ](https://www.remotion.dev/docs/license/faq) describes free-use eligibility and Company License requirements, including eligibility based on organization/team size and use. Review the current Remotion terms for the actual users and use case before rendering or distributing with it.

## Generated narration

The English presentation audio was generated locally with Microsoft Zira Desktop through Windows speech synthesis, as documented in [`presentation/README.md`](presentation/README.md). The generated MP3 and WAV files are distributed artifacts, not source code covered as a blanket MIT grant. Microsoft voice/software terms and redistribution rights for those recordings have not been verified; confirm them before redistributing the audio or video containing it.

## Public data and brand references

The landing and presentation include a dated example based on a New York City permit record, with a link to the [NYC Open Data record](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=B01483138-I1-EL). Public datasets are not Kliseer-owned or relicensed by the MIT notice. The City says datasets are provided for informational purposes, disclaims warranties, and may require source, version, and modification identification when reused; see its [official public-policies and portal terms](https://cityofnewyork.github.io/opendatatsm/publicpolicies.html). Check the specific source and applicable terms for other public records.

Names, marks, and logos—including **Vultr**, **Inter**, **Sora**, and the referenced companies or public agencies—remain with their respective owners. This repository grants no trademark rights or endorsement. Product illustrations and historical data examples do not establish rights to reuse real-world company names, personal information, or linked records for every purpose.
