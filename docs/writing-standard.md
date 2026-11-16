# Voice guide

smrt is a friendly, approachable, proper framework, and the site should sound like one. The reference voice is the landing page, `src/routes/+page.svelte`. Read it before you write and match the author. Don't copy it.

## How we sound

- Use plain words, say "you", and use contractions when they read naturally.
- Be warm, not chatty. Say the useful thing, then stop.
- Understate and overdeliver. When two claims are both true, make the smaller one.
- A non-technical reader should be able to follow the welcome pages. Technical precision lives one click deeper.
- Be light-hearted where it doesn't diminish. The Acme doodads and the kitchen vocabulary stay. Humour is never at smrt's expense.

## Fixed wording

These apply to every page:

- Write `smrt` in lowercase in prose. The hostname s-m-r-t.dev and identifiers such as `SMRT_VERSION` are fine.
- Write `build-a-boilerplate` in lowercase, with hyphens.
- Say "agents", never "software agents".
- Lead with "agentic". smrt builds software, or agentic software. Never say it "builds business software".
- Never say "domain-specific" or "AI decision engine". Say "application logic", not "business logic".
- Don't put a version number in page copy. Import `SMRT_VERSION` from `$lib/version`.

## Check every claim

Check each claim against the installed packages under `node_modules/@happyvertical/*`. Their `AGENTS.md` files are the authority. Don't rely on a local smrt clone or on memory. When you reword a page, change the tone and leave the facts alone.

## Where the strict rules apply

The relaxed voice above covers the whole site, with one exception: the generated reference pages. Those are the package pages, the component pages and the API reference. They follow the strict rules below, in the style of ASD-STE100. The exact paths live in one place, the `STRICT_COPY_GLOBS` constant at the top of `scripts/check-copy.mjs`.

## Strict rules for reference pages

- Use American English spelling.
- Use active voice.
- Use no more than 20 words in a procedural sentence, and 25 in a descriptive one.
- Give each paragraph one topic and no more than six sentences.
- Use the terms below with these meanings only. Don't invent a synonym. Add a term here when the reference needs a new one.

Nouns:

- **agent**: software that can find and operate declared application capabilities under application policy.
- **application logic**: rules that define application behavior, decisions and data operations. Don't use "business logic".
- **component**: a reusable user-interface unit.
- **control**: an interactive user-interface element with declared behavior and policy.
- **framework**: the combined smrt packages, conventions and generated surfaces.
- **guide family**: a group of task-oriented guides for one subject.
- **interaction registry**: a catalog of controls and the operations that an adapter can request.
- **package**: a published software unit in the `@happyvertical/smrt-*` namespace.
- **playground**: the standalone application that demonstrates released framework behavior.
- **route**: a public URL path and its application handler or page.
- **shell**: the persistent user-interface structure around route content.
- **tenant**: an organization or scope that owns isolated application data.
- **workbench**: an interactive documentation view for one package or feature.

Verbs:

- **authenticate**: verify the identity of a person, agent or service.
- **authorize**: decide whether an authenticated actor can do an operation.
- **configure**: set declared options for an application or package.
- **deploy**: put a built application into a target environment.
- **hydrate**: add interactive client behavior to server-rendered or static markup.
- **query**: request selected data from a data source.
- **register**: add a declared item to a framework registry.
- **render**: produce visible user-interface output.
- **serialize**: convert data to a declared transport or storage format.
- **stage**: store a proposed value without changing the live value.
- **synchronize**: make declared records agree with their source. Use `sync` only in an API identifier, command or exact interface label.
- **validate**: check a value or artifact against declared rules.

## Exclusions

Don't rewrite these to satisfy a prose rule: code and code comments, identifiers and type names, package names and import paths, routes, URLs, commands and configuration keys, exact error messages and interface labels, quotations, and product or brand names.

## Automated checks

Run `pnpm run check:copy`. It also runs as part of `pnpm test`. It has two tiers:

- **Tier A** covers the fixed wording and the mechanical rules. It runs on the whole site and fails on an error. A product-name test backs it up.
- **Tier B** covers the strict rules: sentence and paragraph length, ambiguous pronouns, and filler phrases. It runs only on the strict reference paths, and its findings are advisory warnings.

A passing check doesn't prove the copy is good, so read the page too. A pull request that changes copy lists the pages you reviewed and the `check:copy` result in the review section of the pull request template.
