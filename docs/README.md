# Education Moonshot website

GitHub Pages publishes the committed static website from **main /docs**.

The four public routes are the home page, `students/`, `parents/`, and `operating-model/`. All links work beneath the repository's GitHub Pages path.

Canonical copy remains in `src/`. Edit those documents, then run `npm install` and `npm run build` from the repository root. Commit the generated HTML with the source changes. Styling and the favicon live in `docs/assets/`; the generator lives in `tools/build-site.mjs`.

The parent Q&A is a first draft. The operating-model page displays its review status and omits the internal editorial preamble while retaining the substantive working model. The home page combines the thesis in `src/messaging/home.md` with the founding principles in `src/model/founding-principles.md`.

No build action is required for publishing: GitHub Pages serves these files directly. Set Settings → Pages → Deploy from a branch → main → /docs if that publishing target is not already selected.

The interactive credential specimen lives at `diploma/`. Its HTML, CSS, and JavaScript are authored there; the build copies its fictional corpus from `src/demo/graduate.json`. The Professional Agent currently runs a local retrieval mock, with no LLM call, server, or question storage. See `src/demo/README.md` for the model-backed implementation boundary.
