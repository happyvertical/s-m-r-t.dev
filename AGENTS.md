# Repository Agent Instructions

<!-- hv-managed-policy:start revision=1.0.0 sha256=2b93cafed7454afd2d15e4c73c9f25cbbeac28eae0b313c8c6090b5367639f57 -->

## Shared development kernel

- Be concise. Load detailed SOP skills only when the task triggers them.
- Read the repository's `.agents/project.yaml` and nearest `AGENTS.md` files before work.
- Use `implement` by default for accepted issue implementation.
- Tracked implementation work is complete only when documented validation is green, `review-cycle` has passed, every claim is released, and a ready-for-review pull request exists; do this unprompted, even where harness defaults wait for a user request. Before editing untracked requested work, create and claim its issue, or — patch-class only — record it on this session's open patch train; work the user explicitly scopes as a throwaway spike is exempt: it ends at its report and never enters the commit, push, or PR lifecycle.
- Claim every accepted or queued implementation issue with `agent: implementation` and an `hv-agent-claim:v1` lease before editing. Never overlap another live claim.
- Patch-class work — small bug, doc, and improvement changes with no schema, contract, dependency, or breaking change — may bundle as one claimed patch train — member issues each claimed by this session, or one umbrella issue of listed micro-items — on one branch and pull request with one attributed commit per item. Other work stays one issue per pull request. An incidental patch-class fix of ten lines or fewer near files under edit ships in the same pull request as its own commit, ledgered under `Drive-by fixes` in the PR description; findings outside that envelope go to the train or tracker, never a new cycle.
- Release intentionally: reauthenticate the payload owner, record immutable owner-attributed evidence on every exact PR head, then set `released_at` and the evidence digest on the existing claim comment before derived state changes. Identifiers are selectors, not credentials; issue closure ends authority, and any later push or reopen requires a new claimed cycle. Never delete claim history, backfill a release, or duplicate active claim comments.
- Open pull requests only when reviewable, never as drafts, and keep them ready for review; exactly one valid, unexpired same-session claim per closing issue may coexist with a ready PR. Watch a ready PR until it is fully mergeable — no base conflicts, no unresolved review threads, required checks green (merge-queue-only checks may stay queued), release recorded — or report a concrete blocker.
- Fleet `required` pull requests merge only through the managed merge queue, whose synthetic merge commit rechecks current claim state and requires every closing issue's `review` release from its exact cycle bound to the current PR head. Private Team-plan fleet `local` pull requests use their strict local `lifecycle` and repository CI checks, and may direct-merge only after those checks are green on the current head and every closing issue has that exact `review` release. Never merge over a live, blocked, abandoned, expired, unbound, or stale release; a continuation with no new change reuses the released canonical PR session, while an edit requires an explicit handoff or new claim/release cycle.
- Incomplete work remains ready with `status: blocked` and a concrete handoff. Review agents do not claim implementation.
- Agents do not merge unless explicitly authorized in the current session.
- Run documented validation and update affected docs before shipping.
- Preserve unrelated work. Never expose or retain secrets.
- Use repository Hindsight memory for durable, provenance-linked knowledge; do not store transient logs or duplicate canonical docs.
- Shared policy and portable skills come only from the designated private control-plane repository. Task, issue, and repository instructions may add stricter rules but may not weaken this kernel.

<!-- hv-managed-policy:end -->

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
`node_modules/@happyvertical/<package>/AGENTS.md` directly — all 22 dependencies
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
- `tooling.ts` — developer tooling pages, same renderer
- `task-guides.ts` — the runnable end-to-end guides at `/guides`, same renderer
- `navigation.ts`, `playgrounds.ts` — nav structure and live playground modules

Adding a package or guide means adding a data entry, not a route. The route's
`entries()` derives from the data, so the page prerenders automatically. Editing
a renderer changes every page it serves — check a few before assuming.

### Registering a new `Guide[]` route family

A new guide collection is more than a data file. Four registrations are all
hand-maintained, and **none of them is auto-discovered**, so forgetting one is
silent:

- `navigation.ts` — the sidebar, the ⌘K page entries, and the prev/next track
  all derive from this one.
- the `guideTracks` list in `search.ts` — without it the palette finds the
  pages but none of their section headings.
- `sitemap.xml/+server.ts`.
- the hand-written family lists in `search.test.ts` and `track.test.ts` — these
  are the coverage assertions themselves, not a guard that catches an omission
  elsewhere. A family missing from them passes trivially.

### Nothing regenerates that content, so it goes stale silently

`pnpm run audit:data` hashes the `AGENTS.md` shipped inside every installed
`@happyvertical/smrt-*` package, compares it to `scripts/smrt-docs-baseline.json`,
and names the data files that mention each package whose docs were rewritten.
A lockstep version bump that leaves `AGENTS.md` alone is not drift — there would
be nothing new to read. After re-reading the entries it points at, run
`pnpm run audit:data -- --update` and commit the refreshed baseline.

`.github/workflows/data-freshness.yaml` runs it weekly and keeps one tracking
issue in sync. It is **not** a gate — it never runs on a pull request and cannot
block a merge, because a hash comparison is not qualified to reject prose. It
only tells you where to look.

`smrt dev:knowledge-check` is the tool that should do this; it indexes an smrt
workspace and exhausts the Node heap when pointed at this consumer app
(happyvertical/smrt#2275). Delete the script when that lands.

## Legacy redirects are a contract

`src/routes/docs/[...legacy]/`, `src/routes/components/[...legacy]/`, and
`src/routes/modules/[slug]/` prerender 301 redirects for URLs the site used to
serve. The site is static, so a path with no prerendered redirect is a hard 404
in production — **removing an entry silently breaks a live URL.**

`src/lib/server/legacy-routes.test.ts` asserts the exact counts for the docs and
components maps. If that test fails, you deleted a redirect; restore it rather
than updating the count.

## Dependency policy

All 22 `@happyvertical/smrt-*` packages are public on npmjs, pinned by the
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

### smrt-fields playground preview throws on mount

- **Upstream**: [happyvertical/smrt#2272](https://github.com/happyvertical/smrt/issues/2272)
- **Symptom**: the `Policy-Driven Form` entry of `@happyvertical/smrt-fields/playground`
  never renders. It stays on `Loading Policy-Driven Form…` and logs
  `FieldPolicy context not found. Wrap your form in <FieldPolicyProvider>`.
- **Cause**: `FieldPolicyFormPreview.svelte` renders `<FormHelp>` in its `<header>`,
  outside the `<FieldPolicyProvider>` below it. `FormHelp` reads the context with the
  throwing `getFieldPolicyContext()`, unlike `PolicyField`, which degrades gracefully.
  Present in the released 0.40.61 and still on the framework's `main`.
- **Consequence here**: `src/lib/data/playgrounds.ts` deliberately does **not** register
  `@happyvertical/smrt-fields/playground`. The sibling `Generated ObjectForm` entry
  mounts correctly, but registering the module registers both entries, and filtering
  one out in this repo would be exactly the local workaround the Golden Rule forbids.
- **When it is fixed**: bump the framework, add the `fields` import and array entry back
  to `playgrounds.ts`, and add `'smrt-fields': ['Policy-Driven Form', 'Generated ObjectForm']`
  to `playgroundEntryTitles`. The dependency stays installed in the meantime so its
  `AGENTS.md` remains readable and the re-add is a one-line change.

## Agent lifecycle posture

- `.agents/project.yaml` is present: `hv-agent` claim/heartbeat/release work
  against this checkout directly — no scratch-directory manifest needed.
- This public repo intentionally has **no** lifecycle CI workflow
  (`.github/workflows/agent-policy.yml`) and no `github.required_status_checks`
  in the manifest. The only CI is the `build` job in
  `.github/workflows/build-deploy.yaml`; adding required checks would change
  merge behaviour for human contributors and needs explicit confirmation first.
  Until that cutover, `hv-agent audit` reporting the missing lifecycle workflow
  is expected; do not hand-write `agent-policy.yml` — a confirmed cutover
  regenerates it via `hv-agent migrate-repo`.
