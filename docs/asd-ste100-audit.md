# ASD-STE100 baseline audit

Audit date: 2026-08-24

The counts in this record are a dated baseline snapshot. Run the checker for the current result.

Issue: [#177](https://github.com/happyvertical/s-m-r-t.dev/issues/177)

Standard: [ASD-STE100 Simplified Technical English, Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)

## Scope

The baseline audit covers public prose in these locations:

- Route pages and metadata
- Data-driven guides and reference entries
- Navigation and search descriptions
- Callouts and package summaries
- Shared page components
- `static/llms.txt`

The audit excludes code examples, API identifiers, package names, routes, exact messages, external quotations, and brand names.

## Automated result

`pnpm run check:copy` scanned 56 files and 2,235 prose passages. The final result was 0 errors and 0 warnings.

The checker found public copy through route, component, data, and static-text source patterns. Its tests confirm that each source group stays in scope. The checker rejects prohibited project terminology and source parse failures. It reports advisory findings for sentence length, paragraph length, selected phrases, ambiguous pronouns, and common non-American spellings.

Automated checks do not prove full ASD-STE100 conformity. Sentence classification and pronoun meaning require manual review.

## Manual result

The manual baseline review covered all page groups in the audit scope. It gave additional attention to the corrected copy in these files:

- `src/lib/data/guides.ts`
- `src/lib/data/packages.ts`
- `src/lib/data/reference.ts`
- `src/lib/data/task-guides.ts`
- `src/lib/data/tooling.ts`
- `src/routes/+page.svelte`
- `src/routes/guides/+page.svelte`
- `src/routes/packages/+page.svelte`
- `src/routes/tooling/+page.svelte`
- `static/llms.txt`

The review corrected long sentences, long paragraphs, ambiguous pronouns, disallowed phrases, and non-American spellings. It replaced compound instructions with separate imperative sentences where necessary. It also confirmed one topic for each corrected paragraph and literal use of approved project terms.

The review found no accepted checker warnings. Searches found no `business logic` phrase in public site copy. The approved `application logic` term remains in the site copy.

The review preserved statements about authentication, authorization, tenant isolation, writable-field policy, secret handling, confirmation, released features, and unreleased runtime bridges. Code examples, identifiers, package names, routes, exact interface text, external quotations, and brand names remained unchanged unless an adjacent prose correction required formatting.

This record describes the baseline review. It does not claim that automation proves full ASD-STE100 conformity. Future documentation pull requests must record a new manual review for changed copy.
