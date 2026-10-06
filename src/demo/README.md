# Interactive credential specimen

The interactive diploma extends the existing three-page Alex Morgan credential concept. All people, organizations, work, metrics, references, and outcomes are fictional. This is a demonstrator, not a real qualification or a validated assessment instrument.

`graduate.json` is the canonical fictional evidence corpus. The original PDF supplies Alex's name, class, specialties, capstone roles, network composition, portfolio subjects, and coworker references. The detailed evidence records are new illustrative authoring.

The first Professional Agent is a local evidence-retrieval mock. It does not call an LLM, retain questions, or contact references. It searches this curated corpus and opens relevant evidence in the diploma. It states when the corpus cannot support an answer.

A later model-backed agent requires a separately hosted server endpoint. Keep the model key on the server. Retrieve only relevant approved records, require record IDs in structured responses, validate IDs before rendering navigation, and answer unsupported questions with an explicit limitation. Restrict the representative to this fictional graduate's record; distinguish a graduate's contribution from team outcomes. Model selection and deployment remain future implementation work.

## Agent presentation direction

The public diploma displays a compact Professional Agent introduction and editable prompt, with a disabled coming-soon button. The conversation is not active; no question is submitted or stored. The reusable panel is preserved in `professional-agent-panel.html`; the retrieval mock remains in the diploma script behind an optional form check.

The opening invites two paths: ask about the graduate’s experience and training, or introduce the visitor’s company and mission so the agent can surface relevant work. The company-and-mission matching behavior is a future capability, not a capability claimed by the current keyword mock.

## Knowledge and experience structure

Each of the six disciplines has six authored fictional subfields with uneven categorical depth, applied-experience months, and evidence references. These are illustrative profiles, not validated scores. Months overlap across skills; never sum them to infer total experience. The native modal explorer supports collapse, Escape, previous/next subjects, keyboard selection, and reduced-motion preferences.

Robotics is the highlighted professional specialty for Years 2–4. Formal capstone experience totals 24 consecutive months: SafeReach, August 2030–July 2031; Harvest Commons, August 2031–July 2032. Company missions, goals, outcomes, and personal accomplishments are hypothetical extensions of the credential specimen. Experience is organized by employer and role, with partner contributions and independent projects below.

## People and mission-driven ventures

The capstone company names and missions have been revised from the initial PDF specimen. SafeReach focuses on safer infrastructure inspection; Harvest Commons on surplus-food recovery. Alex contributes robotics and electronics within multidisciplinary teams. The former dissolved at graduation under an illustrative creators-rights agreement; the latter secured outside funding. These outcomes do not set institutional IP policy.

Home presents company affiliations, professional accomplishments, and mentorship highlights. Mentorship details distinguish Alex’s contribution from Maya Chen’s and Eli Park’s own accomplishments. Professional Network leads with references, then named contacts; a compact specialty sidebar sits beside the content. A proportional stacked bar shows relationship types and filters contacts within the selected specialty. No fourth detail tab is needed.

OpenShelf is the Summer Founders venture that was not selected as a capstone. The graduate distinction and company mark open its venture details. Repository code and full research manuscripts remain future specimen work; the current resource links resolve to locally generated summaries, not invented external sites.

## Profile polish and shared content

The public experience reads as Alex’s professional profile, without repeated fictional-callout text. Home holds Alex’s portrait, mission, summary, and Summer Founders distinction, which opens the OpenShelf details. Detail views share compact navigation directly above their content. The profile summary and all professional records are authored in `graduate.json`.

Supporting-work buttons open a screen-covering detail dialog. It can stack above the knowledge explorer without changing its discipline, selected subfield, or scroll position. Top and bottom discipline controls share one selection state. Subfield cards include received mentored-learning areas. Dossier links remain available in a new tab.

Each network group now owns named contacts, affiliations, university/external scope, and year first connected. Group totals, scope totals, and year counts are checked against those contact records. A specialty selection filters contacts and references; All restores the full network. Relationship selections filter the contacts within that specialty. Home accomplishments and mentorships remain independent of these filters. Specialty colors match contact cards, and external relationships carry a corner badge and thicker border. Year counts remain source metadata but are not displayed.

Company marks are local SVG assets in `docs/diploma/logos/`, reused on Home and Experience. These graphical identities are illustrative authoring for SafeReach, Harvest Commons, OpenShelf, and Common Motion.
