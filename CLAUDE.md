# havesmrt.com - SMRT Framework Documentation Site

## Purpose

This project serves as a **full-featured demo application** for the SMRT framework and as the primary test bed for `@happyvertical/smrt-svelte`. All framework functionality should be demonstrable here.

## Golden Rule: Always Fix Upstream

**NEVER implement local workarounds.** When encountering issues with smrt-svelte or browser-ai:

1. Document the issue in this file under "Current Issues to Fix Upstream"
2. Implement the proper fix in the upstream package (smrt repo)
3. Rebuild the upstream package
4. Continue development in havesmrt.com

This ensures we're building toward a production-ready framework suitable for public consumption. Quick hacks hide real problems.

## Development

```bash
pnpm install
npm run dev
```

## Keeping smrt up to date

The smrt framework ships as ~25 packages on GitHub Packages
(`https://npm.pkg.github.com`), released in lockstep. To pull every
`@happyvertical/smrt-*` registry dependency up to the latest published version
and refresh the lockfile in one command:

```bash
pnpm run update:smrt            # bump all to latest, refresh lockfile
pnpm run update:smrt -- --dry-run   # preview what would change
pnpm run update:smrt -- --to 0.29.34  # pin all smrt pkgs to a specific version
```

`scripts/update-smrt.mjs` authenticates to the registry via `gh auth token`
(needs the `read:packages` scope), so it works even when `~/.npmrc` is stale.
It skips `file:`/`link:`/`workspace:` specs (e.g. `@happyvertical/smrt-docs`,
which is sourced from the sibling smrt checkout).

After running it, verify with the CI gate (`pnpm test && pnpm run build`) and
commit `package.json` + `pnpm-lock.yaml`.

**Auth note:** Renovate normally keeps these current, but it authenticates with
a `${GH_PACKAGES_TOKEN}` substitution in the user/CI `.npmrc`. If that token is
unset or expired the registry returns 401 and updates silently stop landing —
which is how the project drifted from 0.24.x to 0.29.x. Keep that token fresh
(via Warden) so Renovate works; use `pnpm run update:smrt` for manual catch-ups.

**Local `file:../smrt/docs` dep:** `@happyvertical/smrt-docs` resolves against a
sibling smrt checkout. CI checks one out automatically; locally, ensure `../smrt`
(relative to this repo) points at your smrt clone (a symlink is fine) before
`pnpm install`.

## Stack

- SvelteKit
- `@happyvertical/smrt-*` packages from GitHub Packages (currently `^0.29.34`;
  bump with `pnpm run update:smrt` — see "Keeping smrt up to date")
- `@happyvertical/smrt-docs` is the exception: a `file:../smrt/docs` dep providing
  the markdown content rendered at `/docs`

## Resolved Issues

### Module page navigation failing due to unescaped curly braces in smrt-types

- **Location**: `/src/routes/modules/smrt-types/+page.svelte`
- **Problem**: Clicking smrt-types module link caused 500 error. Server error: "Signal is not defined" at line 322:69.
- **Root Cause**: The text `{ Signal }` inside a `<code>` block was being interpreted as a Svelte expression (Svelte uses `{expression}` for templating). Since `Signal` was not defined as a variable, it caused a runtime error.
- **Fix**: Escaped the curly braces using `{'{'} Signal {'}'}` syntax to prevent Svelte from interpreting them as expressions.
- **Lesson**: Always escape curly braces in Svelte templates when displaying code examples that contain braces.
- **Prevention**: Added `npm run check:templates` script that scans for unescaped braces in `<code>` blocks. Runs as part of `npm run lint` and `npm run build`.

### `smrt` component name capitalized to `Smrt`

- **Location**: `@happyvertical/smrt-svelte` exports `Smrt` component (was lowercase `smrt`)
- **Fix**: Renamed export from `smrt` to `Smrt` in smrt-svelte/src/components/ai/index.ts
- **Status**: Fixed - use `<Smrt>` wrapper component for app state context

### Transformers.js model loading now defaults to remote

- **Location**: `@happyvertical/browser-ai` and `@happyvertical/smrt-svelte`
- **Problem**: 404s for `/models/Xenova/whisper-tiny.en/*` - transformers.js tried local first
- **Fix**: Added `allowLocalModels` option to `BaseBrowserAIOptions` (browser-ai) and `STTConfig` (smrt-svelte). Defaults to `false` so models load from HuggingFace Hub CDN.
- **Status**: Fixed - models now load from remote by default, cached in IndexedDB

## Current Issues to Fix Upstream

(None at this time)

## Known Follow-ups

### Documentation drift: demo content still describes the 0.24 API

- **Context**: The dependencies were bumped 0.24.12 → 0.29.34 (`pnpm run update:smrt`).
  The app is functionally up to date — `pnpm test` and `pnpm run build` pass, every
  route prerenders, and the live site has no console errors.
- **What's stale**: Many demo pages document the _old_ 0.24 API inside their
  `code={...}` example strings, props tables, and type signatures. Examples found:
  removed exports (`VoiceInput`, `DownloadProgress`), changed `TenantContext` API
  (`setTenant`/`getCurrentTenantId` no longer exist), and the `RoleBadge` `role` prop
  tightened from `string` to a `Role` type. These are documentation accuracy issues,
  not runtime breakage (the site only _renders_ these as docs; it doesn't call them).
- **Next step**: A "refresh all docs for SMRT v0.29.x" pass (parallel to the earlier
  v0.24.12 docs refresh) to bring every demo page's examples in line with 0.29.

### `pnpm check` (svelte-check) is noisy on doc pages

- **Symptom**: svelte-check reports hundreds of `Cannot find name 'script'` /
  `Expression expected` errors. Root cause is svelte2tsx failing to transform
  `.svelte` files that embed `<script>` tags _inside_ `code={...}` template-literal
  example strings — it is pre-existing and version-independent (not caused by the
  smrt bump), and is **not** part of the CI gate (CI runs `pnpm test` + `pnpm run build`,
  not `pnpm check`). Fixing it cleanly would let `pnpm check` surface the real
  0.29 type drift above.
