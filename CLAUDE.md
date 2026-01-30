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
