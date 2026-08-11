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

The public documentation site for the SMRT framework, and the primary test bed for
`@happyvertical/smrt-svelte`. Framework functionality should be demonstrable here.

## Golden Rule: Always Fix Upstream

**NEVER implement local workarounds.** When you hit a problem in an
`@happyvertical/smrt-*` package: fix it in the `happyvertical/smrt` repo, release,
install the fixed version, and continue here. Where a defect blocks the site until
that release ships, record the exception as "Active upstream defects" describes.

Quick hacks hide real problems. This site exists to prove the framework is ready
for public consumption; a local patch defeats the point.

## Framework documentation

All 22 installed `@happyvertical/smrt-*` packages ship an `AGENTS.md` inside
`node_modules`, written against the version you actually have. Read
`node_modules/@happyvertical/<package>/AGENTS.md` before working on a package —
it is the authority on that package's API, and no summary here could stay true.
The site builds directly against `smrt-ui`, `smrt-svelte`, `smrt-playground`.

## Setup and validation

**`engines.node` is `>=24.18.0` and `.npmrc` sets `engine-strict=true`.** On an
older Node, `pnpm install` fails outright rather than warning. If the install
dies on an engine check, switch Node versions — that is the whole problem.

`package.json` names the commands. What it cannot tell you: the only CI on a
pull request is the `build` job in `build-deploy.yaml`, which runs `test`,
`check`, and `build` but **not `lint`** — `lint.yaml` runs that on pushes to
`main`, so running `lint` yourself before shipping is the only thing that keeps
`main` green. `pnpm run check` is at 0 errors, 0 warnings and must stay there;
it is the type-drift guard for framework bumps.

`check:templates` catches unescaped `{` / `}` inside `<code>` blocks, which Svelte
would otherwise parse as expressions and fail on at render time. Escape them as
`{'{'}` / `{'}'}`. `eslint`'s `no-undef` rule is load-bearing for the same reason —
it catches `{UndefinedVar}` in templates.

## How the content is authored

The site is data-driven, not page-per-file: the guide, reference, and package
pages are entries in `src/lib/data/`, served by two renderers —
`GuidePage.svelte` for the `Guide[]` modules, `PackageWorkbench.svelte` for
`packages.ts`. Adding one of those means adding a data entry, not a route; the
route's `entries()` prerenders it automatically. Editing a renderer changes
every page it serves, so check a few before assuming. Landing pages and section
indexes are ordinary hand-written `+page.svelte` files.

A new `Guide[]` route family is the exception — it needs a `[slug]` route of its
own plus registering by hand in `navigation.ts`, `search.ts`, and the sitemap.
Add the family and let `registration.test.ts` name what you missed; it discovers
the families, so it knows about yours before you have told it anything.

### Nothing regenerates that content, so it goes stale silently

`pnpm run audit:data -- --help` explains the drift check and how to refresh its
baseline. `.github/workflows/data-freshness.yaml` runs it weekly against one
tracking issue; it is **not** a gate — never on a pull request, cannot block a
merge, because a hash comparison is not qualified to reject prose.

## Legacy redirects are a contract

`src/routes/docs/[...legacy]/`, `src/routes/components/[...legacy]/`, and
`src/routes/modules/[slug]/` prerender 301 redirects for URLs the site used to serve.
The site is static, so a path with no prerendered redirect is a hard 404 in
production — **removing an entry silently breaks a live URL.**
Nothing on the site links to these paths, so a dropped entry produces no build
warning at all — `legacy-routes.test.ts` is the only signal. It holds the counts
and says what to do when one drops.

## Dependency policy

All 22 `@happyvertical/smrt-*` packages are public on npmjs and released in
lockstep; the project `.npmrc` pins that registry, so installs need no auth.

**They are pinned to exact versions, not caret ranges.** `smrt-fields` pins its own
smrt siblings exactly, so mixing exact and caret ranges lets pnpm install duplicate
`smrt-core` instances — and therefore duplicate `ObjectRegistry` singletons — in one
tree. Keep every smrt dependency on the same exact version.

`pnpm run update:smrt -- --help` covers bumping them. Renovate keeps them current
too; if it goes quiet, check it is not blocked before assuming the packages
stopped releasing.

## The rendered version number

**Never write a version number into page copy** — import `SMRT_VERSION` from
`$lib/version`. `pinned-versions.test.ts` enforces that across `src/lib/data`,
documents the deliberate exceptions, and records why the rule exists.

## Active upstream defects

Per-defect prose does **not** live here: `check-pr` caps this file at 12288 bytes
and this section grows with every defect. Record one in the **upstream issue**
(symptom and cause) and a **comment at the code site** (what looks wrong here and
why it is deliberate), plus a **repo issue** where a fix makes something here due.
Then one line below.

- `smrt-fields/playground` unregistered in `playgrounds.ts` —
  happyvertical/smrt#2272, re-add in #156.
- The MCP task guide pins `--output-path …/index.ts` and warns off `--version` and
  `generate:mcp` — happyvertical/smrt#2279, cleanup in #161.
- `reference.ts` documents `semanticSearch` rejecting a `combinedField` name —
  happyvertical/smrt#2281, rewording in #162.
- `scripts/check-data-freshness.mjs` stands in for `smrt dev:knowledge-check`,
  which exhausts the Node heap here — happyvertical/smrt#2275, delete it in #158.

## Agent lifecycle posture

- `.agents/project.yaml` is present: `hv-agent` claim/heartbeat/release work
  against this checkout directly — no scratch-directory manifest needed.
- This public repo intentionally has **no** lifecycle CI workflow
  (`.github/workflows/agent-policy.yml`) and no `github.required_status_checks`.
  Required checks would change merge behaviour for human contributors and need
  explicit confirmation first. So `hv-agent audit` and `check-pr` reporting that
  workflow missing is expected, and is the **only** error either should report —
  treat a second as real. Do not hand-write it; a confirmed cutover regenerates
  it via `hv-agent migrate-repo`.
- No workflow is required on a pull request; see "Setup and validation" for what
  runs where.
