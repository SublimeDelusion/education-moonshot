# Interactive credential specimen

The interactive diploma extends the existing three-page Alex Morgan credential concept. All people, organizations, work, metrics, references, and outcomes are fictional. This is a demonstrator, not a real qualification or a validated assessment instrument.

`graduate.json` is the canonical fictional evidence corpus. The original PDF supplies Alex's name, class, specialties, capstone roles, network composition, portfolio subjects, and coworker references. The detailed evidence records are new illustrative authoring.

The first Professional Agent is a local evidence-retrieval mock. It does not call an LLM, retain questions, or contact references. It searches this curated corpus and opens relevant evidence in the diploma. It states when the corpus cannot support an answer.

A later model-backed agent requires a separately hosted server endpoint. Keep the model key on the server. Retrieve only relevant approved records, require record IDs in structured responses, validate IDs before rendering navigation, and answer unsupported questions with an explicit limitation. Restrict the representative to this fictional graduate's record; distinguish a graduate's contribution from team outcomes. Model selection and deployment remain future implementation work.

## Agent presentation direction

The public diploma no longer displays the mock conversation. A future callout will introduce the Professional Agent once it is ready. The reusable panel is preserved in `professional-agent-panel.html`; the retrieval mock remains in the diploma script behind an optional form check.

The opening invites two paths: ask about the graduate’s experience and training, or introduce the visitor’s company and mission so the agent can surface relevant work. The company-and-mission matching behavior is a future capability, not a capability claimed by the current keyword mock.
