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

## Stack

- SvelteKit
- @happyvertical/smrt-svelte (linked locally via `file:../smrt/packages/smrt-svelte`)

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
