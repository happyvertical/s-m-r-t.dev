# Epic — s-m-r-t.dev → SMRT 0.37.x + SAADL homepage

**Goal.** Bring the demo site in line with the current framework (0.29.34 → 0.37.2) and
ship the new SAADL positioning: new hero, homepage copy, and the human/agent duality
demo — every on-page claim re-verified against 0.37 source.

**Why now.** Two drifts compounded: (1) the framework moved to **npmjs** and advanced to
**0.37.2**, while the site still authenticated to **GitHub Packages** (frozen at 0.29.41)
and pinned `^0.29.34`; (2) the homepage predates the SAADL framing and slightly overreaches
(e.g. "typed UI"). Fix both in one pass.

## Verified setup facts (2026-07-01)

- All `@happyvertical/*` deps are public on **npmjs**: `smrt-*` at **0.37.2** (lockstep),
  SDK (`ai`/`sql`/`utils`/`logger`/`files`) at **0.76.0**. One `.npmrc` scope repoint serves all.
- Site directly pins **11** registry `smrt-*` packages + `@happyvertical/smrt-docs` as
  `file:../smrt/docs` (locally versioned **0.4.1**, skipped by the bump).
- In a worktree, `file:../smrt/docs` needs `../smrt` to resolve — symlink
  `.claude/worktrees/smrt → repos/smrt` (done for this worktree).

## Workstreams → issues

**A · Registry + dependency migration**

- `.npmrc`: repoint `@happyvertical:registry` → `https://registry.npmjs.org`. ✅ (done)
- `scripts/update-smrt.mjs`: repoint `REGISTRY` + temp-npmrc to npmjs; make the auth
  token optional (public reads need none). Keeps Renovate/manual bumps working.
- Bump all registry `smrt-*` 0.29.34 → **^0.37.2**; refresh `pnpm-lock.yaml`.
- Green gate: `pnpm test` + `pnpm run build` + `pnpm run check:templates`.

**B · API-drift reconciliation (0.29 → 0.37)**

- Re-verify demo/doc pages against the 0.37 API (the 0.29 bump already touched ~96/173
  pages — expect drift: imports, props, type signatures, subpath exports). Size after
  the bump reveals the diff.

**C · Homepage copy + SAADL**

- Implement the locked deck (below) into `Hero.svelte`, the `Section` blocks,
  `GetStarted`, and `<svelte:head>` meta/OG.
- Add the one clinical SAADL definition line; eyebrow → "SAADL framework".
- `src/lib/version.ts` `SMRT_VERSION` → match the pinned version (0.37.2).

**D · Hero demo + Reveal (keep both)**

- Hero demo: one object → **two surfaces** (human UI vs agent tools); richer example
  incl. `@field({ sensitive })` absent from both.
- Keep `Reveal`: one object → **four generated artifacts**. Trim overlap so hero =
  _who operates it_, Reveal = _what's generated_.

**E · Corrections (honesty)**

- "typed UI" → "components you compose"; "56+ components" → ~80; any stale v0.24.12 badge → current.
- If cited: ledger epsilon **0.001** (not 0.01); **9** contract types (not 5).

## Locked copy

### Hero

- Eyebrow: `v0.37.2 · SAADL framework`
- Headline: **Built for human users and agent operators.**
- Subhead: Define your domain once — a single `@smrt()` TypeScript class — and SMRT
  generates the database schema, REST API, CLI, and MCP server. Swap AI provider or
  database with one field; auth, multi-tenancy, billing, and durable jobs come included.
- CTAs: `Start from the SaaS starter` · `Read the docs`

### Sections (eyebrow — title — intro)

1. _One model, every interface_ — **One object, reached over HTTP, the CLI, and as MCP tools.**
   A `Product` is one class. People reach it over HTTP or the CLI; an agent calls it as an
   MCP tool like `product_create`. Every surface resolves to the same collection — turn each
   on with a flag on `@smrt()`, no adapter code.
2. _Built-in AI methods_ — **Every object has `is()` and `do()`.**
   `await product.is('priced below market')` returns a boolean; `await product.do('write the
launch blurb')` returns the model's text. Your object's own methods are passed to the model
   as callable tools — the instruction goes to the model, not the object's data.
3. _Batteries included_ — **Thirty-nine packages, released in lockstep.**
   Auth with four-level RBAC, multi-tenancy that filters every query, double-entry billing,
   vector search, background jobs, content, messaging, assets. They share one ORM, one
   inheritance model, and one dispatch bus.
4. _The component library_ — **~80 Svelte components you compose — not a UI you hand-build.**
   smrt-svelte ships forms, tables, badges, cards, modals, navigation, calendar, chat, and
   auth components — typed, themeable, accessibility-tested. The framework generates your API
   and agent tools; you compose the screens from parts that already match your data. Three
   theme presets, light and dark, switchable at runtime.
5. _AI, on the server and in the browser_ — **Inference and embeddings on the server; models in the browser.**
   Generate embeddings and run semantic search as ordinary collection queries. In the browser,
   run Whisper speech-to-text, Web-Speech text-to-speech, and a small on-device LLM
   (Qwen2.5-1.5B or Llama-3.2-1B via WebGPU) — cached so the model downloads once.
6. _No lock-in_ — **Swap your AI provider or database with one field.**
   Point a model at SQLite, Postgres, DuckDB, or JSON. Pick OpenAI, Anthropic, Gemini, Bedrock,
   Hugging Face, Ollama, or your local Claude CLI — same code either way. Run entirely on your
   own machine with Ollama or the Claude CLI, no API key required.
7. _Durable background jobs_ — **Background work that survives a restart.**
   Defer any object method with `obj.bg('generateSummary')`. Jobs persist to your database, get
   claimed atomically across workers, and recover if a worker dies — with retries, priorities,
   and timeouts you configure.
8. **Get started** — keep existing `GetStarted`.

### SAADL line (once, clinical)

SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same
operations to human users (UI, HTTP, CLI) and to software agents (callable tools).
s-m-r-t is a SAADL framework.

### Microcopy

- Repo/tagline: Software as Agentic Domain Logic — built for human users and agent operators.
- Meta/OG: A TypeScript framework for software that people and agents both operate. Define a
  domain model once; generate its database schema, REST API, CLI, and MCP tools. Swap AI
  providers and databases with one field.

## 0.37 re-verification checklist (before ship)

Every figure was verified against **0.29.x** — reconfirm against 0.37 source:

- [ ] Package count (was 39) · component count (was ~80)
- [ ] AI providers (was 10; 7 named) · DB engines (was 4)
- [ ] `is()`/`do()` signatures + "instruction, not object data" behavior
- [ ] `remember()`/`recall()` — confirm they exist before using any memory line
- [ ] Browser-AI models (Qwen2.5-1.5B / Llama-3.2-1B) still current
- [ ] Don't-claim list still accurate

## Don't claim (0.29 stubs/partial — recheck at 0.37)

Working social posting/OAuth · live voice or video render pipeline · live GA4/Plausible
integration · smrt-gnode · "smrt-products is a catalog."

## Done when

- Site builds + tests green on **0.37.2**; badges read the pinned version.
- Homepage ships the locked copy + both demos.
- Every on-page claim reconfirmed against 0.37 source.
