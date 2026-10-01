# Education material migration

Date: 2026-09-28 (America/Denver)

Source: [SublimeDelusion/moonshots](https://github.com/SublimeDelusion/moonshots) at commit `81e2b6e4dca8c63cbcf54c19c700f27639d4854d`.
Destination: SublimeDelusion/education-moonshot.

The core education documents, canonical story, and two images were moved from `Moonshots/University of Impact/` into this repository. Document wording was preserved; repository-root path references were shortened to match the new location. The earlier chat rewrite of the Student Q&A was not substituted for the committed working draft.

| Previous path | Destination | Original Git blob |
| --- | --- | --- |
| `Moonshots/University of Impact/Artifacts/four-year-operating-model.md` | `Artifacts/four-year-operating-model.md` | `884f6a8e95b0fc4178ae0aee07ba806cee71f524` |
| `Moonshots/University of Impact/Artifacts/student-qa.md` | `Artifacts/student-qa.md` | `368c3a309a0041b462ae4b51da4f1058936c0634` |
| `Moonshots/University of Impact/Content/anyas-ascent-university-of-impact.md` | `Content/anyas-ascent-university-of-impact.md` | `796bc608cce10ac393d31c2bd5ae4362effa3c3a` |
| `Moonshots/University of Impact/Content/portfolio-overview.md` | `Content/portfolio-overview.md` | `2e950b67d05c3514e8ab40228c797baff337b223` |
| `Moonshots/University of Impact/Content/university-of-impact-content-strategy.md` | `Content/university-of-impact-content-strategy.md` | `672a80431cbf30cd0cd851e346029d7ede606d7b` |
| `Moonshots/University of Impact/Content/university-of-impact-principles-and-open-ideas.md` | `Content/university-of-impact-principles-and-open-ideas.md` | `87e641ec3a51b3414bccfc3c9b935a4013b9cb9d` |
| `Moonshots/University of Impact/Content/university-of-impact-value-proposition-and-business-case.md` | `Content/university-of-impact-value-proposition-and-business-case.md` | `41efd73711aed339ecf4f251a62e974ae6bc693a` |
| `Moonshots/University of Impact/Images/impact-university-cta.webp` | `Images/impact-university-cta.webp` | `9f2e164c8b8d12c72524078f108511cc40b9d79c` |
| `Moonshots/University of Impact/Images/impact-university-hero.webp` | `Images/impact-university-hero.webp` | `885c39409d0e903bb80d4d24491d4d762752a773` |

The old document paths become forwarding notes after destination verification. Git history preserves previous content.

## Story ownership

Education Moonshot owns the canonical manuscript. Hopeful Dystopia retains its existing published reader edition and source snapshot, with source notes identifying the canonical manuscript. No narrative merge or website release is part of this migration.

## Retained material

Audio exports and three Git LFS-backed Audacity projects remain in the source repository's Media directory. They were not moved or deleted. Existing production references continue to work.

Summit campaign history remains in moonshots-summit. Abundance Education research was sourced from `Leads/Max Song/` at summit commit `ef07ebed724a29d8c63583f226e2947f1e2ac650` and is organized by program under `ref/abundance-education/`.

The initial migration transferred six Markdown files and two PDFs. Three PDFs remained at their original source paths because the GitHub connector returned empty content for files above 1 MB: abuundance-education.pdf, ae-priceofknowledge.pdf, and ae-scaling.pdf. On 2026-09-28, all five reference documents were rebuilt from user-supplied webpage HTML or text. At the user's request, the local PDF, HTML, and raw-text reference copies were removed; `ref/abundance-education/` now keeps only Markdown. The source repository PDFs and the original blob identifiers below remain provenance for the migration.

- `README.md`: original blob `835d549990127bba1f479b439613500ed0f255f5`.
- `abuundance-education.md`: original blob `7afed2887516dcee3132682e3267423584b8110c`.
- `abuundance-education.pdf`: original blob `8911c4181b867f0c14dfdb5392217db3d24901c9`.
- `ae-priceofknowledge.md`: original blob `ed7400640337811bd9178be96188e4f21486ac9a`.
- `ae-priceofknowledge.pdf`: original blob `85166d5f4b7094ed29333536d21f865603482c17`.
- `ae-scaling.md`: original blob `4e45d222ae580bb1e36c318e6662564fd35f2be8`.
- `ae-scaling.pdf`: original blob `24916babb79654f05d3fe3a03a0bbeae01029ca4`.
- `ae-timeline.md`: original blob `90c27ba0b52edbb5733de8ddfdd207386b4330b8`.
- `ae-timeline.pdf`: original blob `0dda9852494167b580565a0426aed6d6cd0f1440`.
- `ae-whatfailed.md`: original blob `45fa3c6a73b7bd34c1c21f132c85c3917cb30d00`.
- `ae-whatfailed.pdf`: original blob `d3ef898d1b51f11cf8783701faf3dfafb7ed3ca8`.

## Repository reorganization — September 28, 2026

The table above records the original import. Current paths:

| Imported path | Current home |
| --- | --- |
| Artifacts/four-year-operating-model.md | [src/model/operating-model.md](../src/model/operating-model.md); principles extracted to [src/model/founding-principles.md](../src/model/founding-principles.md) |
| Artifacts/student-qa.md | [src/student-qa.md](../src/student-qa.md) |
| Content/anyas-ascent-university-of-impact.md | [src/anyas-ascent.md](../src/anyas-ascent.md) |
| Content/university-of-impact-value-proposition-and-business-case.md | [src/value-proposition-and-business-case.md](../src/value-proposition-and-business-case.md) |
| Content/university-of-impact-principles-and-open-ideas.md | [concepts](../src/concepts/README.md); original compilation retained in [archive/concepts](concepts/principles-and-open-ideas.md) |
| Content/portfolio-overview.md | Restored in [Moonshots](https://github.com/SublimeDelusion/moonshots/blob/main/Moonshots/University%20of%20Impact/Content/portfolio-overview.md) |
| Content/university-of-impact-content-strategy.md | Unique presentation guidance moved to [Portfolio](https://github.com/SublimeDelusion/portfolio/blob/main/strategy/education/university-of-impact-presentation.md); eight verbatim story sections replaced with canonical manuscript links |
| Images/ | assets/images/ |

The manuscript, student Q&A, business case, and images retain their imported content. The principles and concept sections were reorganized without adopting unresolved mechanisms. The MIT implementation proposal and source record were added separately.
