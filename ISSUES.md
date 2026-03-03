# GitHub Issues for Documentation Audit

Run `gh auth login` first, then execute these commands from the havesmrt.com repo.

## Create PR

```bash
cd ~/Work/happyvertical/repos/havesmrt.com
gh pr create \
  --title "docs(audit): comprehensive documentation audit against SMRT v0.20.41" \
  --body "Full audit report in AUDIT.md. 200+ issues across 12 categories. See Epic issue for tracking."
```

## Create Epic Issue

```bash
gh issue create \
  --title "[Epic] Documentation Audit Remediation — SMRT v0.20.41" \
  --label "epic,documentation" \
  --body "$(cat <<'EOF'
# Documentation Audit Remediation

**Audit date**: 2026-03-03
**Source**: AUDIT.md on branch `docs/audit-report-2026-03-03`
**Monorepo version**: v0.20.41

## Summary

Comprehensive audit found **200+ discrepancies** between havesmrt.com and the SMRT monorepo source.

| Category | Count |
|----------|-------|
| Stale version badges | 29 |
| Wrong API signatures | 80+ |
| Missing exports undocumented | 60+ |
| Missing module pages | 10 packages |
| Ghost/phantom pages | 3 |
| Fabricated features | 8+ |
| Broken links | 10+ |
| Incorrect descriptions | 25+ |

## Child Issues

- [ ] #_1 Update all version badges to v0.20.41
- [ ] #_2 Fix wrong API signatures across module pages
- [ ] #_3 Create 10 missing module pages
- [ ] #_4 Remove/redirect ghost pages
- [ ] #_5 Fix component catalog (12 → 44+ components)
- [ ] #_6 Fix core docs (Getting Started, Objects, Collections)
- [ ] #_7 Fix Agents, Dispatch, Migration, Reference, FAQ pages
- [ ] #_8 Fix homepage, modules index, navigation
- [ ] #_9 Fix/rewrite markdown guides
- [ ] #_10 Regenerate TypeDoc API docs
- [ ] #_11 Remove fabricated features from docs
- [ ] #_12 Fix smrt-svelte page (wrong component ownership)
EOF
)"
```

## Create Child Issues

### Issue 1: Version Badges
```bash
gh issue create \
  --title "docs: update all 29 version badges from v0.17.100/v0.19.0 to v0.20.41" \
  --label "documentation,good first issue" \
  --body "$(cat <<'EOF'
All 29 module pages show stale version badges:
- smrt-core, smrt-types: v0.17.100
- All others: v0.19.0
- Actual: v0.20.41

**Files**: Every `+page.svelte` under `src/routes/modules/`

**Task**: Update badge version strings. Consider making version dynamic from package.json.
EOF
)"
```

### Issue 2: Wrong API Signatures
```bash
gh issue create \
  --title "docs: fix 80+ wrong API signatures across module pages" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
80+ API signatures, method names, import paths, and code examples are wrong.

**Critical examples:**
- smrt-config: YAML/TOML support and SMRT_* env vars documented but don't exist
- smrt-vitest: createFixture(), mocks, matchers documented but don't exist
- FAQ: MySQL support claimed, wrong migration commands, wrong DB config format
- Getting Started: MongoDB-style operators ($ne, $lt), npm create smrt-app (doesn't exist)
- All relationship examples use arrow thunks (@foreignKey(() => User)) — not supported
- smrt-dev-mcp: Tier 1 runtime MCP features on Tier 2 dev tool page
- smrt-gnode: Full API documented but package is entirely stubs

**See**: AUDIT.md sections 1-6, 9-10 for complete list with file:line references
EOF
)"
```

### Issue 3: Missing Module Pages
```bash
gh issue create \
  --title "docs: create module pages for 10 undocumented packages" \
  --label "documentation,enhancement" \
  --body "$(cat <<'EOF'
10 packages at v0.20.41 have NO documentation page:

1. **smrt-affiliates** (12 exports) — revenue sharing, multi-tier commissions
2. **smrt-chat** (30 exports) — chat rooms, threads, agent sessions
3. **smrt-facts** (28 exports) — knowledge base, semantic dedup, evolution chains
4. **smrt-images** (15 exports) — AI image categorization, STI extending Asset
5. **smrt-jobs** (26 exports) — background execution, TaskRunner, ScheduleRunner
6. **smrt-secrets** (27 exports) — envelope encryption, key rotation, audit logging
7. **smrt-sites** (13 exports) — site lifecycle, agent bindings
8. **smrt-social** (12 exports) — YouTube/Threads/X/Bluesky OAuth, post scheduling
9. **smrt-video** (~60 exports) — video production, ComfyUI workflows
10. **smrt-voice** (8 exports) — TTS voice profiles, word timings for lip-sync

**See**: AUDIT.md section 7 for detailed export lists, key classes, and features per package
EOF
)"
```

### Issue 4: Ghost/Phantom Pages
```bash
gh issue create \
  --title "docs: remove or redirect 3 ghost pages (browser-ai, accounts, gnode-as-functional)" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
3 pages document non-existent or misleading content:

1. **browser-ai/** — consolidated into smrt-svelte in v0.20. Page exists as redirect but modules index still lists it as separate package with wrong name `@happyvertical/browser-ai`
2. **accounts.md** + api/accounts/ TypeDoc — `smrt-accounts` was renamed to `smrt-ledgers`. Documents `AccountTransaction`/`AccountTransactionEntry` which don't exist (actual: `Journal`/`JournalEntry`)
3. **smrt-gnode** — presented as fully functional federation library. **Reality: entirely stubs** (all methods return null/empty). Needs prominent "NOT IMPLEMENTED" warning

**See**: AUDIT.md sections 5 (gnode), 6 (browser-ai), 12 (accounts.md)
EOF
)"
```

### Issue 5: Component Catalog
```bash
gh issue create \
  --title "docs: expand component catalog from 12 to 44+ components across 14+ categories" \
  --label "documentation,enhancement" \
  --body "$(cat <<'EOF'
The component catalog (`src/lib/data/components.ts`) lists only 12 components in 3 categories. The actual smrt-svelte package exports 44+ components across 14+ categories.

**Problems:**
- 73%+ of components have no catalog entry
- Badge miscategorized (display → should be ui)
- ThemeSwitcher/ColorSchemeToggle miscategorized (display → should be theme)
- Showcase pages import from wrong paths (browser-ai components)
- 6 stale package.json export subpaths for moved components
- Showcase pages for other packages (agents, jobs, commerce, users, etc.) mixed in without clear attribution

**See**: AUDIT.md section 8 for complete component-by-component breakdown
EOF
)"
```

### Issue 6: Core Docs Pages
```bash
gh issue create \
  --title "docs: fix Getting Started, Objects, Collections pages" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
Core documentation pages have significant API errors:

**Getting Started:**
- npm create smrt-app — doesn't exist
- MongoDB operators ($ne, $lt) — not supported
- static itemClass — should be static readonly _itemClass
- defineConfig keys wrong (database/api/cli → smrt/modules/packages)
- AI auto-generated methods described — don't exist

**Objects:**
- Relationship fields as plain assignments — must be decorators
- getFields()/getRelationships() as static — wrong
- super.toJSON() shown as escape hatch — contradicts hard rule

**Collections:**
- WHERE operators missing 'not in' and 'contains'
- DuckDB/JSON conflated as one adapter

**See**: AUDIT.md section 9
EOF
)"
```

### Issue 7: Agent/Dispatch/Migration/Reference/FAQ
```bash
gh issue create \
  --title "docs: fix Agents, Dispatch, Migration, Reference, FAQ pages" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
**FAQ (most critical):**
- Claims MySQL support — not supported
- Wrong migration commands (smrt migrations generate → smrt db:diff --generate)
- createFixture import — doesn't exist
- Wrong DB config format (postgresql → postgres, host/port → url)

**Agents:**
- Missing TenantAgent, AgentSchedule, AgentConfig docs
- getDefaultConfig() shown but doesn't exist

**Dispatch:**
- CLI commands use wrong flag syntax (--signal-type → positional args)

**Migration:**
- No guide for post-0.20.0 changes

**See**: AUDIT.md section 10
EOF
)"
```

### Issue 8: Homepage/Modules Index/Navigation
```bash
gh issue create \
  --title "docs: fix homepage, modules index (29 → 38 packages), template names" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
**Modules Index:**
- Claims 29 modules — actual is 38 packages
- 10 packages missing from index
- Template names wrong: @happyvertical/template-* → @happyvertical/smrt-template-*
- browser-ai listed with wrong package name
- smrt-gnode described as functional (stubs only)
- smrt-messages described as email-only (actually multi-channel)

**Homepage:**
- Fabricated decorator options: @field({index, precision, enum, encrypted}), @computed(), @action()

**Package.json:**
- Dependencies pinned at ^0.20.1 vs current 0.20.41
- smrt-docs at 0.4.1 vs monorepo 0.20.41

**See**: AUDIT.md section 11
EOF
)"
```

### Issue 9: Markdown Guides
```bash
gh issue create \
  --title "docs: fix/rewrite markdown guides in docs/content/" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
**Critical:**
- accounts.md documents non-existent smrt-accounts package (renamed to smrt-ledgers)
- content.md documents wrong field name (context → category)
- core.md imports from non-existent subpath (@happyvertical/smrt-core/fields)
- Multiple guides use wrong package names (@have/sql, @have/spider, @have/pdf)
- agents.md documents non-existent decorators (@text(), @integer(), @datetime())
- gnode.md uses wrong package name (@have/gnode)

**24 packages have NO markdown guide at all**

**See**: AUDIT.md section 12
EOF
)"
```

### Issue 10: TypeDoc API Docs
```bash
gh issue create \
  --title "docs: regenerate TypeDoc API docs (12/38 packages covered, accounts/ stale)" \
  --label "documentation,enhancement" \
  --body "$(cat <<'EOF'
- typedoc.tsconfig.json references deleted packages/accounts/src/
- Only 12 of 38 packages have TypeDoc output
- accounts/ TypeDoc generated from deleted commit
- smrt-ledgers (replacement) not included
- gnode/ TypeDoc references wrong package name

**Task**: Update typedoc.tsconfig.json, regenerate for all 38 packages
EOF
)"
```

### Issue 11: Fabricated Features
```bash
gh issue create \
  --title "docs: remove 8+ fabricated features from documentation" \
  --label "documentation,bug,priority:high" \
  --body "$(cat <<'EOF'
These features are documented but DO NOT EXIST in source:

1. **smrt-config**: YAML/TOML file support (only JS/JSON supported)
2. **smrt-config**: SMRT_* environment variable overrides (entire feature fabricated)
3. **smrt-vitest**: createFixture() function
4. **smrt-vitest**: Mock implementations for external services
5. **smrt-vitest**: Custom Vitest matchers for SMRT assertions
6. **FAQ**: MySQL/MariaDB database support
7. **Homepage**: @computed() decorator, @action() decorator
8. **Homepage**: @field({index, precision, enum, encrypted}) options
9. **Getting Started**: npm create smrt-app scaffolding tool
10. **Getting Started**: AI auto-generated methods (summarize, extractKeywords)

These will actively mislead users and cause runtime errors.
EOF
)"
```

### Issue 12: smrt-svelte Component Ownership
```bash
gh issue create \
  --title "docs: fix smrt-svelte page — wrong component ownership, missing core features" \
  --label "documentation,bug" \
  --body "$(cat <<'EOF'
The smrt-svelte module page has critical ownership errors and missing features:

**Wrong ownership (components attributed to smrt-svelte that belong elsewhere):**
- UserCard, UserAvatar, UserList → @happyvertical/smrt-users/svelte
- TenantCard, TenantSwitcher → @happyvertical/smrt-tenancy/svelte
- InvoiceCard, etc. → @happyvertical/smrt-commerce/svelte
- TimeEntryCard, etc. → @happyvertical/smrt-projects/svelte

**Missing core features (not documented at all):**
- Provider component (root entry point!)
- 7 hooks (useAuth, useSocket, useAppState, useSTT, useTTS, useLLM, useTheme)
- browser-ai subpath (adapters + Svelte components)
- Warm client cache API
- permission/ripple Svelte actions
- Dual theme system (/themes subpath)
- Module UI Registry

**Badge claims 100 Components — actual is ~56**

**See**: AUDIT.md section 6
EOF
)"
```
