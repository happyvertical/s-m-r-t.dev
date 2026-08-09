# s-m-r-t.dev — SMRT framework documentation site

## Purpose

This project is the public documentation site for the SMRT framework and the
primary test bed for `@happyvertical/smrt-svelte`. Framework functionality
should be demonstrable here.

## Golden Rule: Always Fix Upstream

**NEVER implement local workarounds.** When you hit a problem in an
`@happyvertical/smrt-*` package:

1. Document it below under "Current Issues to Fix Upstream"
2. Fix it properly in the upstream package (the `happyvertical/smrt` repo)
3. Release and install the fixed version
4. Continue development here

Quick hacks hide real problems. This site exists to prove the framework is ready
for public consumption; a local patch defeats the point.

## Framework documentation

Every installed `@happyvertical/smrt-*` package ships its own `AGENTS.md` and
`CLAUDE.md` inside `node_modules`, written against the version you actually have
installed. Read those instead of any summary — they are the authority on that
package's API.

The three this site builds against directly:

@./node_modules/@happyvertical/smrt-ui/AGENTS.md
@./node_modules/@happyvertical/smrt-svelte/AGENTS.md
@./node_modules/@happyvertical/smrt-playground/AGENTS.md

For any other package, read
`node_modules/@happyvertical/<package>/AGENTS.md` directly — all 21 dependencies
ship one. There is nothing to regenerate and nothing to keep in sync.

## First run

```bash
pnpm install
pnpm dev
```

**`engines.node` is `>=24.18.0` and `.npmrc` sets `engine-strict=true`.** On an
older Node, `pnpm install` fails outright rather than warning. If the install
dies on an engine check, switch Node versions — that is the whole problem.

## Validation

```bash
pnpm test          # vitest
pnpm run build     # check:templates + vite build (prerenders the whole site)
pnpm run lint      # prettier + eslint + check:templates
pnpm run check     # svelte-check
```

CI runs test, check, and build. `pnpm run check` is clean (0 errors, 0 warnings)
and is expected to stay that way — it is the type-drift guard for framework
bumps, so do not let it start reporting noise.

`check:templates` catches unescaped `{` / `}` inside `<code>` blocks, which
Svelte would otherwise parse as expressions and fail on at render time. Escape
them as `{'{'}` / `{'}'}`. `eslint`'s `no-undef` rule is load-bearing for the
same reason — it catches `{UndefinedVar}` in templates.

## How the content is authored

The site is data-driven, not page-per-file. Content lives in `src/lib/data/`:

- `packages.ts` — every `@happyvertical/smrt-*` package entry, rendered by
  `PackageWorkbench.svelte` at `/packages/[slug]`
- `guides.ts` — foundation and capability guides, rendered by `GuidePage.svelte`
- `reference.ts` — reference pages, same renderer
- `navigation.ts`, `playgrounds.ts` — nav structure and live playground modules

Adding a package or guide means adding a data entry, not a route. The route's
`entries()` derives from the data, so the page prerenders automatically. Editing
a renderer changes every page it serves — check a few before assuming.

## Legacy redirects are a contract

`src/routes/docs/[...legacy]/`, `src/routes/components/[...legacy]/`, and
`src/routes/modules/[slug]/` prerender 301 redirects for URLs the site used to
serve. The site is static, so a path with no prerendered redirect is a hard 404
in production — **removing an entry silently breaks a live URL.**

`src/lib/server/legacy-routes.test.ts` asserts the exact counts for the docs and
components maps. If that test fails, you deleted a redirect; restore it rather
than updating the count.

## Dependency policy

All 21 `@happyvertical/smrt-*` packages are public on npmjs, pinned by the
project `.npmrc`. No authentication is needed to install them.

**They are pinned to exact versions, not caret ranges.** `smrt-fields` pins its
own smrt siblings exactly, so mixing exact and caret ranges lets pnpm install
duplicate `smrt-core` instances — and therefore duplicate `ObjectRegistry`
singletons — in one tree. Keep every smrt dependency on the same exact version.

The packages release in lockstep, so bumping means moving all of them together:

```bash
pnpm run update:smrt                  # pin all to latest, refresh lockfile
pnpm run update:smrt -- --dry-run     # preview, touch nothing
pnpm run update:smrt -- --to 0.40.61  # pin all to a specific version
pnpm run update:smrt -- --caret       # opt out of exact pins (don't)
```

`scripts/update-smrt.mjs` resolves the registry from npm config for the
`@happyvertical` scope, so it follows `.npmrc` rather than hardcoding a host.
After running it, verify with the full gate above and commit `package.json` plus
`pnpm-lock.yaml`.

Renovate also keeps these current. If it ever goes quiet, check that it is not
being blocked before assuming the packages stopped releasing.

## The rendered version number

`$lib/version` exports `SMRT_VERSION`, injected at build time from the installed
framework tree (`scripts/smrt-version.js`, wired through the `define` block in
`vite.config.ts` and `vitest.config.ts`). **Never write a version number into
page copy** — import the constant. The site previously carried four different
hardcoded versions, none of them the one it was built against.

## Current Issues to Fix Upstream

(None at this time)
