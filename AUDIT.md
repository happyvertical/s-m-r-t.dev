# havesmrt.com Documentation Audit Report

**Date**: 2026-03-03
**Audited against**: SMRT monorepo @ branch `docs/claude-md-audit-cleanup`
**Current package version**: v0.20.41

---

## Executive Summary

This audit compared all documentation on havesmrt.com against the current SMRT monorepo source code (38 packages at v0.20.41). The findings are severe — the documentation site is substantially out of date across nearly every page.

### Key Metrics

| Category | Count |
|----------|-------|
| Total issues found | ~200+ |
| Stale version badges | 29 (all module pages) |
| Missing module pages | 10 packages with no docs page |
| Ghost/phantom pages | 2 (browser-ai, smrt-accounts) |
| Wrong API signatures | 80+ |
| Missing exports undocumented | 60+ |
| Fabricated features documented | 8+ (env vars in config, fixtures in vitest, MySQL support, etc.) |
| Broken links | 10+ |

### Critical Findings

1. **Every module page has a stale version badge** — showing v0.17.100 (core, types) or v0.19.0 (everything else) vs actual v0.20.41
2. **10 packages have no documentation page at all**: affiliates, chat, facts, images, jobs, secrets, sites, social, video, voice
3. **Ghost pages exist**: `browser-ai/` (consolidated into smrt-svelte), `accounts.md` (renamed to smrt-ledgers)
4. **Fabricated features**: smrt-config documents YAML/TOML support and `SMRT_*` env vars that don't exist; smrt-vitest documents fixtures/mocks/matchers that don't exist; FAQ claims MySQL support
5. **smrt-gnode documented as working** but is entirely stubs (all methods return null/empty)
6. **Component catalog lists 12 components** in 3 categories vs 44+ actual exports across 14+ categories
7. **Modules index claims 29 modules** but 38 packages exist; template package names use wrong prefix
8. **smrt-dev-mcp confused with runtime MCP** — docs describe Tier 1 features on the Tier 2 page
9. **smrt-svelte attributes 100 components** including ones from other packages (users, commerce, projects)
10. **Code examples use non-existent APIs**: `$ne`/`$lt` MongoDB operators, `@computed()` decorator, `createFixture()`, `npm create smrt-app`, `smrt migrations generate`

---

## Table of Contents

1. [Foundation Modules](#1-foundation-modules)
2. [User & Access Modules](#2-user--access-modules)
3. [Domain Modules — Part 1](#3-domain-modules--part-1)
4. [Domain Modules — Part 2](#4-domain-modules--part-2)
5. [Content, Agents, DevTools](#5-content-agents-devtools)
6. [UI, Templates, browser-ai](#6-ui-templates-browser-ai)
7. [Missing Module Pages](#7-missing-module-pages)
8. [Component Catalog & Showcase](#8-component-catalog--showcase)
9. [Core Docs — Getting Started, Objects, Collections](#9-core-docs--getting-started-objects-collections)
10. [Core Docs — Agents, Dispatch, Migration, Reference, FAQ](#10-core-docs--agents-dispatch-migration-reference-faq)
11. [Homepage, Themes, Navigation, Infrastructure](#11-homepage-themes-navigation-infrastructure)
12. [Markdown Docs Content](#12-markdown-docs-content)

---

## 1. Foundation Modules

### smrt-core (`src/routes/modules/smrt-core/`)
**Status**: outdated
**Version shown**: v0.17.100 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.17.100`; actual package version is `0.20.41` — `+page.svelte:9`
2. **[wrong-api]** Installation command uses `npm install` instead of `pnpm add` — `+page.svelte:38`
3. **[wrong-api]** Quick Start shows `await products.initialize()` as a separate step after `ProductCollection.create()` — `create()` already calls it internally — `+page.svelte:82`
4. **[wrong-api]** AI Operations section documents `describe()` as a primary AI operation alongside `is()` and `do()`. CLAUDE.md and README only describe `is()` and `do()` as primary — `+page.svelte:19, 126-130`
5. **[wrong-api]** Field helpers import path shown as `@happyvertical/smrt-core/decorators` — that subpath doesn't exist in `package.json` exports — `+page.svelte:188, 447, 463, 480`
6. **[wrong-api]** Another import path `@happyvertical/smrt-core/fields` also doesn't exist — `+page.svelte:245`
7. **[wrong-api]** `@smrt()` decorator options include `swagger: true` — no such option exists — `+page.svelte:315-324`
8. **[wrong-api]** `APIGenerator` shown with `.registerCollection()` and `.createServer()` — actual API is `createRestServer()` and `startRestServer()` — `+page.svelte:334-345`
9. **[wrong-api]** `MCPGenerator` shown with `.registerCollection()` and `.generateTools()` — doesn't match actual API — `+page.svelte:351-364`
10. **[wrong-api]** Vite Plugin config includes non-existent options (`generateTypes`, `hmr`, `svelteKit.objectsDir`) and wrong import path — `+page.svelte:541-557`
11. **[wrong-api]** Virtual module names (`@smrt/routes`, `@smrt/client`, etc.) may not reflect actual virtual module IDs — `+page.svelte:563-568`
12. **[wrong-api]** Eager Loading described as using "SQL JOINs" but implementation does separate queries per relationship — `+page.svelte:280-290`
13. **[missing-export]** `CLIGenerator` referenced but not actually exported from `packages/core/src/generators/index.ts`
14. **[missing-export]** DispatchBus (`DispatchBus`, `createDispatchBus`, `Dispatch`, `DispatchSubscription`) not documented at all
15. **[missing-export]** GlobalInterceptors plugin system not documented
16. **[missing-export]** `@TenantScoped`, `conflictColumns`, STI discriminator format, `transformJSON()` vs `toJSON()` gotcha, `@meta()` decorator, `hooks` option, `ai` option, `embeddings` option — all absent

### smrt-types (`src/routes/modules/smrt-types/`)
**Status**: outdated
**Version shown**: v0.17.100 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.17.100` — `+page.svelte:9`
2. **[missing-export]** Module UI types (`SmrtModuleMeta`, `ModuleUISlot`, `ModuleComponentType`, `ModuleUIBaseProps`, `ModuleUIRegistryInterface`) entirely absent
3. **[missing-export]** User/Tenant Status enums (`UserStatus`, `TenantStatus`, `MembershipStatus`, `SessionStatus`, `OverrideEffect`, `TenantPermissionEffect`) entirely absent
4. **[incorrect-description]** Overview says package "currently" exports only Signal System types — this is inaccurate — `+page.svelte:19-21`
5. **[wrong-api]** API Reference shows exports only from `./signals.js`; actual also exports from `./module.js` and `./user.js` — `+page.svelte:271-278`
6. **[wrong-api]** Usage examples access internal `_signalBus` property — not a supported public API — `+page.svelte:127-172`
7. **[incorrect-description]** Best Practices says "Don't install directly" but README provides install instructions — `+page.svelte:359-361`

### smrt-config (`src/routes/modules/smrt-config/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** Claims YAML and TOML support — cosmiconfig only searches `.js`, `.mjs`, `.cjs`, `.json` — `+page.svelte:21, 136-143`
3. **[wrong-api]** Documents `SMRT_*` environment variable system with prefix processing — **this entire feature does not exist** — `+page.svelte:127-131, 289-305`
4. **[wrong-api]** Tutorial uses env variable files with `SMRT_LOG_LEVEL=debug` — fabricated feature — `+page.svelte:333-353`
5. **[wrong-api]** Troubleshooting section has "Environment variables not working" entry for non-existent feature — `+page.svelte:533-545`
6. **[wrong-api]** `exportConfig()` signature shown wrong — takes `options?` not `(config, options?)` — `+page.svelte:270-285`
7. **[missing-export]** `mergeExportedConfig()` and `parseExportedConfig()` absent from docs

### smrt-scanner (`src/routes/modules/smrt-scanner/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** CLAUDE.md documents `ManifestBuilder` as primary export but it's NOT exported from `src/index.ts`
3. **[wrong-api]** CLAUDE.md documents `discoverBaseClasses({ cwd })` — not exported
4. **[wrong-api]** CLAUDE.md refers to `SmartObjectDefinition`/`FieldDefinition` — actual types are `RawClassDefinition`/`RawFieldDefinition`
5. **[wrong-api]** CLAUDE.md has wrong filenames (`src/oxc-scanner.ts` → actual `src/scanner.ts`, `src/manifest-builder.ts` → actual `src/manifest-adapter.ts`)
6. **[missing-export]** `scanDirectory()` convenience function not documented
7. **[missing-export]** `scanSmrtImports()` method not documented
8. **[missing-export]** `ScanError`, `RawDecorator`, `RawParameterDefinition` types not documented

---

## 2. User & Access Modules

### smrt-users (`src/routes/modules/smrt-users/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** Tutorial "Apply Tenant Policy" passes raw db config where `SmrtClassOptions` is needed — `+page.svelte:459`
3. **[wrong-api]** Session management tutorial mixes Express patterns with actual SvelteKit-only integration — `+page.svelte:477-488`
4. **[missing-export]** `TenantPermissionOverride` and `TenantPermissionOverrideCollection` not mentioned
5. **[incorrect-description]** "Four Permission Layers" cascade is wrong — omits tenant hierarchy as layer 1, miscounts layers — `+page.svelte:133-144`
6. **[missing-export]** `SessionService` (high-level API) not documented — only low-level `SessionCollection` shown
7. **[missing-export]** SvelteKit subpath `@happyvertical/smrt-users/sveltekit` completely absent
8. **[wrong-api]** Components tab claims `UserCard`, `UserAvatar`, etc. exist in this package — unverifiable — `+page.svelte:576-618`
9. **[incorrect-description]** Badge says "11 Components" — unverifiable count — `+page.svelte:9`
10. **[missing-export]** 22+ exports from `src/index.ts` entirely absent from docs (types, constants, functions)
11. **[wrong-api]** OIDC login example includes `picture` field not in `OidcClaims` interface — `+page.svelte:444-453`
12. **[missing-export]** Hierarchical tenants (`createChild()`, `moveToParent()`, `getTree()`) not documented

### smrt-profiles (`src/routes/modules/smrt-profiles/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** `getActiveTerm()` return type listed as `{ profile, source }` — actually `ProfileRelationshipTerm | null` — `+page.svelte:1152-1155`
3. **[wrong-api]** `getRelationshipNetwork()` shown as instance method on `Profile` — actually on `ProfileCollection` — `+page.svelte:735-737`
4. **[wrong-api]** `findMutualFriends(alice, bob)` shown as exported utility — doesn't exist — `+page.svelte:741`
5. **[missing-export]** STI subclasses `Bot`, `Organization`, `Person` never mentioned
6. **[missing-export]** `createProfileFromNostr` not documented
7. **[missing-export]** NIP-05 handler API (14 Nostr crypto utility functions) not documented
8. **[wrong-api]** `createMagicLinkToken`/`verifyMagicLinkToken` shown — don't exist; actual is `createMagicLinkService` factory — `+page.svelte:513-534`
9. **[wrong-api]** `generateNostrKeypair('user@example.com')` shown with email arg — takes no arguments — `+page.svelte:519`
10. **[wrong-api]** `ApiKey.verify(key)` missing required second `options` argument — `+page.svelte:483`

### smrt-tenancy (`src/routes/modules/smrt-tenancy/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** `tenantId = tenantId()` syntax shown throughout — correct is `@tenantId({ nullable: true })` property decorator — `+page.svelte:78-84, 114-121, 205-208`
3. **[missing-export]** 8+ exports absent: `withTenantSync`, `enterTenantContext`, `requireTenant()`, `hasTenantContext()`, `isSystemContext()`, `isSuperAdminBypass()`, `TenantContext`, `MinimalTenantContext`
4. **[missing-export]** Testing utilities `assertTenantIsolationViolation`, `testTenantIsolation` absent
5. **[missing-export]** Registry API (6 functions) not documented
6. **[wrong-api]** Integration section shows `resolvePermissions`/`isSuperAdmin` as `createSvelteKitHandle` options — not in actual type — `+page.svelte:307-333`
7. **[wrong-api]** UI Components import from `@happyvertical/smrt-users/components` — no such subpath — `+page.svelte:629`
8. **[incorrect-description]** Critical `withSuperAdminBypass()` vs `withSystemContext()` distinction not documented

---

## 3. Domain Modules — Part 1

### smrt-assets (`src/routes/modules/smrt-assets/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[ghost-page]** Page documents `Image`/`ImageCollection` throughout — these don't exist in this package (they're in `smrt-images`)
3. **[wrong-api]** Import statement has syntax error — `+page.svelte:72`
4. **[missing-export]** `AssetAssociation`/`AssetAssociationCollection` (polymorphic join — core feature) not mentioned
5. **[missing-export]** `Folder`/`FolderCollection` not documented
6. **[missing-export]** `AssetStore` not documented as API
7. **[wrong-api]** API Reference omits `getType()`, `getStatus()`, `getAssociations()`, `associateWith()`
8. **[wrong-api]** `initializeCommonTypes()`/`initializeCommonStatuses()` shown — don't exist — `+page.svelte troubleshooting`
9. **[incorrect-description]** Tag management described as smrt-tags integration but actually uses raw SQL against `asset_tags` join table
10. **[missing-export]** `AssetTypeCollection`, `AssetStatusCollection`, `AssetMetafieldCollection` never mentioned
11. **[missing-export]** `rollbackToVersion()`, `getByMimeType()`, `getByOwner()`, `findWithGlobals()`, `findGlobal()`, `findByTenant()` absent

### smrt-commerce (`src/routes/modules/smrt-commerce/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:49`
2. **[wrong-api]** `UnbilledItems` Svelte component missing from docs — `+page.svelte:6-11`
3. **[wrong-api]** Invoice status uses uppercase `'DRAFT'` — actual enum is lowercase `'draft'` — `+page.svelte:108`
4. **[wrong-api]** Payment method uses uppercase `'BANK_TRANSFER'` — actual is `'bank_transfer'` — `+page.svelte:130`
5. **[wrong-api]** `recognizeRevenue()` parameter names differ from actual (`arAccountId`/`taxAccountId` not `receivablesAccountId`/`taxPayableAccountId`) — `+page.svelte:272-277`
6. **[missing-export]** `ContractLineItem`, `FulfillmentLineItem`, `UNPAID_STATUSES`, `VendorCollection`, `FulfillmentCollection` absent
7. **[incorrect-description]** `recognizeRevenue()` described as returning `Promise<Journal>` — actually `Promise<Journal | null>` (returns null if ledgers unavailable)

### smrt-events (`src/routes/modules/smrt-events/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:17`
2. **[missing-export]** `EventType`/`EventTypeCollection` never documented
3. **[missing-export]** 9 of 11 utility exports undocumented (`calculateDuration`, `formatDuration`, `formatEventDateRange`, `generateEventSlug`, `getEventStatusFromDates`, `isEventNow`, `parseRecurrencePattern`, `sortEventsByDate`, `validateEventStatus`)
4. **[wrong-api]** Utility imports shown from `@happyvertical/smrt-events/utils` — no such subpath exists — `+page.svelte:242, 273`
5. **[wrong-api]** `initializeDefaults()` method referenced — doesn't exist on `EventTypeCollection` — `+page.svelte:327`

### smrt-ledgers (`src/routes/modules/smrt-ledgers/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:17`
2. **[wrong-api]** `Journal.summarize()` return type shown as `string` — actually `Promise<string>` — `+page.svelte:376`
3. **[wrong-api]** `Account.getBalance()` return type shown as `number` — actually `Promise<number>` — `+page.svelte:336`
4. **[missing-export]** Types `AccountTree`, `AccountTreeNode`, `CreateJournalData`, `JournalEntryData`, `TrialBalanceRow` absent
5. **[wrong-api]** `TrialBalanceRow` interface missing `accountId` and `type` fields — `+page.svelte:466-471`
6. **[incorrect-description]** Integration direction inverted — commerce depends on ledgers optionally, not vice versa

### smrt-places (`src/routes/modules/smrt-places/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** `PlaceTypeCollection.initializeDefaults()` may not exist — `+page.svelte:75, 384-386`
3. **[missing-export]** `findByCoordinates()`, `findWithGlobals()` absent from docs
4. **[missing-export]** `locationToGeoData`, `mapLocationTypeToPlaceType` utilities absent
5. **[wrong-api]** `places.findOne({ name: 'Warehouse A' })` — `findOne()` doesn't exist on `SmrtCollection` — `+page.svelte:814`
6. **[wrong-api]** Example uses `Array.filter` with async callback — broken JavaScript, always returns all items — `+page.svelte:600-603`

---

## 4. Domain Modules — Part 2

### smrt-products (`src/routes/modules/smrt-products/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** `createClient` import from `@happyvertical/smrt-products/client` — no such subpath — `+page.svelte:373`
3. **[wrong-api]** `Product.findByCategory()` called but doesn't exist — `+page.svelte:658, 713`
4. **[wrong-api]** `price = 0` (INTEGER) but docs describe it as "Decimal price" with `39.99` examples — `+page.svelte:222`
5. **[missing-export]** `ProductCatalog`/`CategoryManager` not exported from main entry point but docs import them from there — `+page.svelte:108, 568`
6. **[incorrect-description]** Tenancy section claims "Products isolated per tenant automatically" — neither `Product` nor `Category` has tenancy — `+page.svelte:776-784`

### smrt-projects (`src/routes/modules/smrt-projects/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:17`
2. **[wrong-api]** `incorporateFeedback()` options use wrong field names (`applyUpdate`→`apply`, `synthesisStrategy`→doesn't exist) — `+page.svelte:211-214`
3. **[wrong-api]** UI Components use Svelte 4 `<svelte:fragment slot="actions">` syntax — should be Svelte 5 snippets — `+page.svelte:341-348`
4. **[missing-export]** `Label`/`LabelCollection` not documented
5. **[missing-export]** `PullRequest` model and `PullRequestCollection` entirely absent from docs

### smrt-properties (`src/routes/modules/smrt-properties/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** `Zone.getFullPath()`/`getDepth()` return types shown as `string`/`number` — actually `Promise<string>`/`Promise<number>` — `+page.svelte:123-124`
3. **[missing-export]** `Property.description`, `Zone.position`, `Zone.defaultContentId` fields omitted
4. **[missing-export]** `ZoneCollection.findByDimensions()`/`findWithGlobals()` absent
5. **[missing-export]** Types `PropertyOptions`, `PropertyStatus`, `ZoneOptions`, `ZoneTree`, `ZoneTreeNode` absent

### smrt-tags (`src/routes/modules/smrt-tags/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** All examples use deprecated constructor pattern `new TagCollection({...})` instead of `await TagCollection.create()` — `+page.svelte:56, 89, 111, 431`
3. **[wrong-api]** `Tag.parentSlug` shown as `string | null` — actual is `string = ''` (non-nullable) — `+page.svelte:172`
4. **[wrong-api]** Comment says `level` is "Auto-calculated if omitted" — it's not, defaults to `0` — `+page.svelte:72-73`
5. **[missing-export]** `moveTag()`, `mergeTag()`, `cleanupUnused()`, `findWithGlobals()` absent from API Reference
6. **[missing-export]** `TagHierarchy` type absent

---

## 5. Content, Agents, DevTools

### smrt-content (`src/routes/modules/smrt-content/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:73`
2. **[missing-export]** `contentToString`/`stringToContent` utility functions absent
3. **[missing-export]** `ThumbnailGenerator` class absent
4. **[incorrect-description]** Status lifecycle omits `'review'` value — `+page.svelte:276-283`
5. **[missing-export]** `Contents.findWithGlobals(tenantId)` absent
6. **[incorrect-description]** Optional multi-tenancy behavior not mentioned

### smrt-messages (`src/routes/modules/smrt-messages/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:17`
2. **[incorrect-description]** Page title/description says "Email Management" — package is multi-channel (Email/Twitter/Slack STI hierarchy) — `+page.svelte:16`
3. **[missing-export]** Entire Twitter (`Tweet`/`TwitterAccount`/`TweetSender`) and Slack (`SlackMessage`/`SlackAccount`/`SlackSender`) STI types absent
4. **[missing-export]** Base `Message`/`Account` classes absent
5. **[wrong-api]** Shows `setSettings()` for credentials — actual security pattern is `setCredentials()` via envelope encryption — `+page.svelte:73-83`
6. **[incorrect-description]** Claims dependency on `@happyvertical/email` — actual key dependency is `@happyvertical/smrt-secrets` — `+page.svelte:52`
7. **[missing-export]** All 12 type exports absent
8. **[wrong-api]** `getByProviderType()` shown — actual method is `getByEmailProviderType()` — `+page.svelte:352`

### smrt-analytics (`src/routes/modules/smrt-analytics/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** Field name `providerType` shown — actual is `provider` — `+page.svelte:51,93`
3. **[wrong-api]** All enum values shown UPPERCASE — actual values are lowercase (`'ga4'`/`'plausible'`, `'pending'`/`'sent'`/`'failed'`, etc.) — `+page.svelte:114, 138-139`
4. **[missing-export]** All enum and SDK type exports absent
5. **[incorrect-description]** API secrets stored as plaintext not disclosed

### smrt-ads (`src/routes/modules/smrt-ads/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[wrong-api]** `AdGroup.tierName` documented — actual field is `tierId` — `+page.svelte:53,119`
3. **[wrong-api]** `AdGroup.zoneIds` shown as `string[]` — actual is JSON string with `getZoneIds()`/`setZoneIds()` accessors — `+page.svelte:55,121`
4. **[missing-export]** `AdFormat`/`AdFormatCollection` absent
5. **[missing-export]** All enum exports absent
6. **[incorrect-description]** `PricingModel` values shown uppercase — actual lowercase

### smrt-agents (`src/routes/modules/smrt-agents/`)
**Status**: mostly-current
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[missing-export]** `AgentConfig`/`AgentConfigCollection` absent
3. **[missing-export]** `AgentSchedule`/`AgentScheduleCollection` absent
4. **[missing-export]** `TenantAgent`/`TenantAgentCollection` absent
5. **[missing-export]** `/vite` sub-export (`vitePluginAgentRoutes`) absent
6. **[missing-export]** `/ui` sub-export (AgentUIRegistry) not documented
7. **[wrong-api]** Best-practices shows `getDefaultConfig()` override — doesn't exist on Agent base — `+page.svelte:567-583`
8. **[wrong-api]** Component badge says "4 Components" — actually 5 (missing `ScheduleStatusBadge`) — `+page.svelte:9`

### smrt-gnode (`src/routes/modules/smrt-gnode/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:17`
2. **[incorrect-description]** **CRITICAL**: Page presents smrt-gnode as functional — it is **entirely stubs** (all methods return null/empty arrays). Source CLAUDE.md: "Status: stubs only — all methods return empty arrays/nulls. Not implemented."
3. **[wrong-api]** Quick Start shows `new Federation({ enabled: true, discoverability: 'public', ... })` — constructor takes no arguments — `+page.svelte:88-143`
4. **[wrong-api]** Documents `discoverViaDNS()`, `exchangePeersWithGnode()`, `queryGnode()`, etc. — none exist. Only two stub methods: `discoverPeers()` and `exchangePeers()`
5. **[wrong-api]** `WebFingerProtocol.discover()` shown returning structured data — returns `null` (stub)

### smrt-cli (`src/routes/modules/smrt-cli/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:17`
2. **[missing-export]** Full command reference absent — only Overview/Installation/Quick Start/Config/Related shown. Missing: `smrt db:*`, `smrt introspect`, `smrt generate:*`, `smrt docs:claude`, `smrt dispatch:*`, `smrt gnode`
3. **[incorrect-description]** Quick Start shows space-separated syntax (`smrt events list`) — canonical is colon-separated (`events:list`) — `+page.svelte:40-57`
4. **[wrong-api]** Install command shows `npm install -g` — README says `pnpm add -D` (dev dependency) — `+page.svelte:30`

### smrt-dev-mcp (`src/routes/modules/smrt-dev-mcp/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0` — `+page.svelte:9`
2. **[incorrect-description]** **CRITICAL**: Entire page conflates Tier 2 dev MCP with Tier 1 runtime MCP. Overview describes "exposing SMRT objects to Claude Code for natural language DB interactions" — that's Tier 1. Actual package only has 2 tools: `generate-smrt-class` and `introspect-project` — `+page.svelte:14-15`
3. **[wrong-api]** Quick Start shows `@smrt({ mcp: true })` and `mcp: { enabled: true, port: 3100 }` — irrelevant to this package — `+page.svelte:27-48`
4. **[wrong-api]** Shows `npx smrt-dev-mcp start` — actual invocation is `npx -y @happyvertical/smrt-dev-mcp` (no `start` subcommand) — `+page.svelte:48`
5. **[missing-export]** `.mcp.json` configuration (actual usage method) not shown
6. **[incorrect-description]** Example interactions ("List all open issues", "Incorporate feedback") describe Tier 1 — impossible with Tier 2 — `+page.svelte:54-63`

---

## 6. UI, Templates, browser-ai

### smrt-svelte (`src/routes/modules/smrt-svelte/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0`
2. **[missing-export]** `Provider` component (root entry point) not mentioned anywhere
3. **[missing-export]** All 7 hooks (`useAuth`, `useSocket`, `useAppState`, `useSTT`, `useTTS`, `useLLM`, `useTheme`) absent
4. **[missing-export]** Entire `browser-ai` subpath (adapters + Svelte components) absent
5. **[incorrect-description]** Claims "reactive stores for SMRT objects" — no per-object stores exist
6. **[incorrect-description]** Lists User/Tenant components (`UserCard`, `UserAvatar`, `TenantCard`, `TenantSwitcher`) as smrt-svelte — they're in `@happyvertical/smrt-users/svelte`
7. **[incorrect-description]** Lists Commerce components as smrt-svelte — they're in `@happyvertical/smrt-commerce`
8. **[incorrect-description]** Lists Project components as smrt-svelte — they're in a separate package
9. **[incorrect-description]** Badge claims "100 Components" — actual `.svelte` file count is ~56 in `src/components/`
10. **[missing-export]** Warm client cache API absent
11. **[missing-export]** `permission` and `ripple` Svelte actions absent
12. **[missing-export]** Dual theme system (`/themes` subpath) absent
13. **[missing-export]** Module UI Registry absent

### smrt-vitest (`src/routes/modules/smrt-vitest/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0`
2. **[incorrect-description]** Description claims "fixtures, mocks, test database setup, and custom assertions" — **no fixtures, no mocks, no custom matchers exist**
3. **[wrong-api]** `createFixture` imported — **doesn't exist** — will throw runtime error
4. **[wrong-api]** `createTestDb()` result used as bare DB object — actually returns `{ config, cleanup }`
5. **[missing-export]** `smrtVitestPlugin()` (the primary export!) not mentioned at all
6. **[missing-export]** `setupSmrtManifests()` absent
7. **[missing-export]** `@happyvertical/smrt-vitest/setup` subpath absent
8. **[incorrect-description]** Three "Key Features" bullets are completely fabricated (fixtures, mocks, matchers)

### browser-ai (`src/routes/modules/browser-ai/`)
**Status**: ghost-page (consolidated into smrt-svelte)

#### Issues

1. **[wrong-api]** Migration guide shows imports from main `@happyvertical/smrt-svelte` — actual subpath is `@happyvertical/smrt-svelte/browser-ai/svelte`
2. **[wrong-api]** "Before" code references `@happyvertical/browser-ai` — that package never existed
3. **[missing-export]** `CapabilityGate` and `STTTest` components absent from migration guide
4. **[missing-export]** Framework-agnostic adapters at `browser-ai` subpath not mentioned

### template-sveltekit (`src/routes/modules/template-sveltekit/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0`
2. **[wrong-api]** Shows `npm create smrt-app@latest` — doesn't exist. Correct: `smrt gnode create my-app --template sveltekit`
3. **[incorrect-description]** Claims OIDC auth, Docker/K8s configs, multi-tenancy — none exist in template
4. **[incorrect-description]** Claims "PostgreSQL/SQLite database" — only basic smrt-core included

### template-site-static-json (`src/routes/modules/template-site-static-json/`)
**Status**: outdated
**Version shown**: v0.19.0 (actual: 0.20.41)

#### Issues

1. **[stale-version]** Badge shows `v0.19.0`
2. **[wrong-api]** Shows `npm create smrt-site@latest` — doesn't exist. Correct: `smrt gnode create my-town-site --template site-static-json --location "..." --lat X --lon Y`
3. **[incorrect-description]** Praeco (council scraping) and Caelus (weather) — the template's primary features — completely absent
4. **[incorrect-description]** Placeholder substitution system not documented
5. **[incorrect-description]** CDN-ready claim unsupported — no CDN configs present

---

## 7. Missing Module Pages

These 10 packages exist in the SMRT monorepo at v0.20.41 but have **no documentation page** on havesmrt.com:

### smrt-affiliates — NO DOCS PAGE
**Package**: `@happyvertical/smrt-affiliates`
**Export count**: 12 exports
**Key classes**: `Partner`, `Commission`, `Payout` + collections
**Key features**: Multi-type partners (publisher/salesperson/referrer), 4 commission types per ad event, parent commission share, immutable commission records, payout lifecycle (PENDING→APPROVED→PROCESSING→COMPLETED/FAILED)
**Dependencies**: smrt-core; peers: smrt-ads, smrt-commerce, smrt-profiles, smrt-properties

### smrt-chat — NO DOCS PAGE
**Package**: `@happyvertical/smrt-chat`
**Export count**: 30 exports
**Key classes**: `ChatRoom`, `ChatMessage`, `ChatParticipant`, `ChatThread`, `ChatReaction`, `AgentSession`, `ChatService` + collections
**Key features**: 4 room types (public/private/dm/agent), unified human+AI message model, threaded conversations, agent sessions with tool whitelisting, `ChatService` facade
**Dependencies**: smrt-core, smrt-tenancy, smrt-types; optional: smrt-agents, smrt-profiles, smrt-svelte

### smrt-facts — NO DOCS PAGE
**Package**: `@happyvertical/smrt-facts`
**Export count**: 28 exports
**Key classes**: `Fact`, `FactSource`, `FactSubject`, `FactContent`, `FactTag` + collections
**Key features**: 3-zone semantic reconciliation (>=0.85 auto-merge, 0.60-0.85 AI disambig, <0.60 new), evolution chains, confidence scoring, 8-value FactType enum
**Dependencies**: smrt-core, smrt-tenancy; @happyvertical/ai

### smrt-images — NO DOCS PAGE
**Package**: `@happyvertical/smrt-images`
**Export count**: 15 exports
**Key classes**: `Image` (STI subclass of Asset), `ImageCollection`, `ImageCategorizer`, `ImageEditor`, `ImageDeriver`, `ImageMetadataExtractor`, `ImageSearch`, `UpstreamManager`
**Key features**: Cross-package STI extending Asset, AI vision analysis, standard image ops + AI editing, dimension/orientation queries
**Dependencies**: smrt-core, smrt-assets, smrt-tenancy; @happyvertical/ai, @happyvertical/images

### smrt-jobs — NO DOCS PAGE
**Package**: `@happyvertical/smrt-jobs`
**Export count**: 26 exports
**Key classes**: `SmrtJob`, `JobBuilder`, `JobHandle`, `TaskRunner`, `ScheduleRunner`, `JobContextLogger`
**Key features**: Persistent job records in `_smrt_jobs`, polling-based TaskRunner, cron-based ScheduleRunner, fluent JobBuilder API (`.delay()`, `.priority()`, `.retries()`), `withBackgroundJobs()` mixin
**Dependencies**: smrt-core, smrt-config, smrt-types; @happyvertical/jobs, @happyvertical/sql

### smrt-secrets — NO DOCS PAGE
**Package**: `@happyvertical/smrt-secrets`
**Export count**: 27 exports
**Key classes**: `Secret`, `SecretAuditLog`, `TenantKey`, `SecretService` + collections
**Key features**: 3-layer envelope encryption (AMK→TDEK→secret), `SecretService` high-level API (store/retrieve/rotateKey/reencryptAll), audit logging of all operations, no API/MCP exposure (deliberate security restriction)
**Dependencies**: smrt-core, smrt-tenancy; @happyvertical/secrets

### smrt-sites — NO DOCS PAGE
**Package**: `@happyvertical/smrt-sites`
**Export count**: 13 exports
**Key classes**: `Site`, `SiteAgentBinding`, `SiteService` + collections
**Key features**: Domain-unique sites per tenant, tier system (free/standard/premium), provisioning lifecycle, agent binding with priority ordering, `SiteService` stateless lifecycle
**Dependencies**: smrt-core, smrt-tenancy; optional: smrt-agents

### smrt-social — NO DOCS PAGE
**Package**: `@happyvertical/smrt-social`
**Export count**: 12 exports
**Key classes**: `SocialAccount` (STI), `SocialPost`, `OAuthState` (STI)
**Key features**: YouTube/Threads/X/Bluesky support, PKCE OAuth with 10-min TTL, `isReady` computed gate, `linkBehavior` for post formatting, `scheduledAt` metadata-only scheduling
**Dependencies**: smrt-core, smrt-config, smrt-content, smrt-tenancy, smrt-video

### smrt-video — NO DOCS PAGE
**Package**: `@happyvertical/smrt-video`
**Export count**: ~60 exports
**Key classes**: `Character`, `Performer`, `Scene`, `VideoShot`, `VideoShotCharacter`, `VideoSequence`, `VideoComposition`, `VideoWorkflow`, `CompositeJob` + STI asset subclasses + collections
**Key features**: Production hierarchy (Composition→Sequence→Shot), Character virtual personas with branding, Performer face embeddings for IP-Adapter, Scene virtual backgrounds, ComfyUI workflow templates, frame-based durations
**Dependencies**: smrt-core, smrt-assets, smrt-config, smrt-content, smrt-profiles, smrt-tenancy, smrt-voice

### smrt-voice — NO DOCS PAGE
**Package**: `@happyvertical/smrt-voice`
**Export count**: 8 exports
**Key classes**: `VoiceProfile`, `VoiceSample`, `VoiceOutput`
**Key features**: Design vs clone voice creation modes, `VoiceSample` quality/duration validation, `VoiceOutput` with word timings for lip-sync, default TTS provider `qwen3-tts`
**Dependencies**: smrt-core, smrt-assets, smrt-config, smrt-content, smrt-tenancy

---

## 8. Component Catalog & Showcase

### Catalog Analysis (`src/lib/data/components.ts`)
- **Categories defined**: 3 (`layout`, `display`, `forms`)
- **Components listed**: 12 total
- **Actual smrt-svelte component exports**: 44+ across 14+ directories

### Major Discrepancies

#### Massive undercoverage
The catalog lists 12 components in 3 categories. The actual smrt-svelte package exports 44+ components across 14+ categories (admin, calendar, data, display, feedback, forms, layout, memberships, module, nav, permissions, roles, theme, ui). **73%+ of components have no catalog entry.**

#### Components in catalog but miscategorized
- **`Badge`**: Catalog puts it in `display` — actual location is `ui/` in smrt-svelte
- **`ThemeSwitcher`/`ColorSchemeToggle`**: Catalog puts them in `display` — they're theme controls at `@happyvertical/smrt-svelte/themes` subpath

#### Showcase pages from other packages
These showcase directories exist but reference components from **other packages**, not smrt-svelte:
- `/components/agents/` — from `@happyvertical/smrt-agents/svelte`
- `/components/jobs/` — from `@happyvertical/smrt-jobs/svelte`
- `/components/commerce/` — from `@happyvertical/smrt-commerce/svelte`
- `/components/content/` — from `@happyvertical/smrt-content/svelte`
- `/components/events/` — from `@happyvertical/smrt-events/svelte`
- `/components/projects/` — from `@happyvertical/smrt-projects/svelte`
- `/components/users/` — from `@happyvertical/smrt-users/svelte`
- `/components/tenants/` — from `@happyvertical/smrt-tenancy/svelte`

#### Wrong import paths in showcase
- `/components/ai/*` pages import from `@happyvertical/smrt-svelte` — actual subpath is `@happyvertical/smrt-svelte/browser-ai/svelte`
- `/components/theme/theme-switcher/` doesn't actually import `ThemeSwitcher` — simulates with `SelectInput`

#### Broken catalog link
- `Badge` linked to `/components/display/badge` — no such route. Actual: `/components/ui/badge`

#### Stale package.json exports
6 stale subpath entries in smrt-svelte `package.json` point to moved/deleted component directories: `./meetings`, `./town`, `./weather`, `./agents`, `./jobs`, `./content`

---

## 9. Core Docs — Getting Started, Objects, Collections

### Getting Started (`src/routes/docs/getting-started/`)
**Status**: outdated

#### Issues

1. **[wrong-api]** `npm create smrt-app@latest my-app` — no such package exists — `+page.svelte:54`
2. **[wrong-api]** `static itemClass = Task` — correct is `static readonly _itemClass = Task` — `+page.svelte:110`
3. **[wrong-api]** MongoDB-style operators `{ $ne: 'done' }`, `{ $lt: new Date() }` — don't exist. Correct: `{ 'status !=': 'done' }` — `+page.svelte:119-123`
4. **[wrong-api]** `@foreignKey(() => User)` / `@manyToMany(() => Tag, ...)` use arrow thunks — not supported, pass class directly — `+page.svelte:275-278`
5. **[wrong-api]** `defineConfig({ database: {...}, api: {...}, cli: {...}, mcp: {...} })` — these top-level keys don't exist in `SmrtConfig` — `+page.svelte:203-228`
6. **[wrong-api]** AI "auto-generated methods" (`summarize()`, `extractKeywords()`) described — no such auto-generation exists — `+page.svelte:308-316`
7. **[incorrect-description]** "Discover 29 production-ready modules" — actual count is 38 — `+page.svelte:257`

### Objects (`src/routes/docs/objects/`)
**Status**: mostly-current

#### Issues

1. **[wrong-api]** Relationship fields shown as plain assignments (`customerId = foreignKey(Customer)`) — must use decorator syntax (`@foreignKey(Customer)`) — `+page.svelte:108-111`
2. **[wrong-api]** `Product.getFields()` and `Product.getRelationships()` shown as static methods — `getFields()` is async instance, `getRelationships()` doesn't exist — `+page.svelte:265-274`
3. **[wrong-api]** `loadRelatedMany('orders')` — method name doesn't exist in public API — `+page.svelte:445-446`
4. **[wrong-api]** "Dangerous Pattern" section shows `super.toJSON()` as escape hatch — contradicts framework's hard "never override toJSON()" rule — `+page.svelte:412-419`

### Collections (`src/routes/docs/collections/`)
**Status**: mostly-current

#### Issues

1. **[wrong-api]** WHERE operators table missing `'not in'` and `'contains'` from `VALID_OPERATORS` — `+page.svelte:115-157`
2. **[wrong-api]** "DuckDB / JSON" section conflates two different adapters under one heading — `+page.svelte:287-296`
3. **[wrong-api]** `ai: { provider: 'openai', apiKey: ... }` shape may not be correct `SmrtClassOptions.ai` format — `+page.svelte:33-36`
4. **[wrong-api]** Transaction examples show raw `db.transaction()` without clarifying these are database adapter methods, not collection methods — `+page.svelte:298-320`

---

## 10. Core Docs — Agents, Dispatch, Migration, Reference, FAQ

### Agents Docs (`src/routes/docs/agents/`)
**Status**: mostly-current

#### Issues

1. **[wrong-api]** `config` property shown as plain object literal — actual canonical pattern uses `getModuleConfig()` from `@have/config`
2. **[missing-export]** `TenantAgent`/`TenantAgentCollection`, `AgentSchedule`/`AgentScheduleCollection` not mentioned
3. **[missing-export]** `adminRoutes` static property not documented
4. **[wrong-api]** `agent_configs` table docs omit `tenantId` column

### Dispatch Docs (`src/routes/docs/agents/dispatch/`)
**Status**: mostly-current

#### Issues

1. **[wrong-api]** CLI commands `dispatch:subscribe`/`dispatch:unsubscribe` shown with `--signal-type`/`--subscriber` flags — actual uses positional arguments
2. **[incorrect-description]** In-memory handlers described as "synchronous" — actually async fire-and-forget
3. **[missing-export]** `DispatchBusOptions.persistence` alias not documented

### Migration Docs (`src/routes/docs/migration/`)
**Status**: mostly-current

#### Issues

1. **[missing-page]** No migration guide for post-0.20.0 changes (currently at 0.20.41)
2. **[incorrect-description]** References `smrt-projects` which is not in CLAUDE.md package table

### Reference (`src/routes/reference/`)
**Status**: mostly-current

#### Issues

1. **[missing-export]** Core classes list omits `AgentConfig`, `AgentSchedule`, `TenantAgent`, `SchemaComparer`, `GlobalInterceptors`
2. **[missing-export]** Dispatch method list omits `on()` and `off()`

### FAQ (`src/routes/faq/`)
**Status**: outdated

#### Issues

1. **[wrong-api]** "How do I run migrations?" shows `smrt migrations generate`/`smrt migrations run` — **don't exist**. Correct: `smrt db:diff --generate`/`smrt db:migrate`
2. **[wrong-api]** Testing example imports `createFixture` — **doesn't exist** in smrt-vitest
3. **[wrong-api]** Database config shows `type: 'postgresql'` — correct is `'postgres'`; shows host/port/database fields — actual uses `url` string
4. **[wrong-api]** **Claims MySQL/MariaDB support** — not supported (only sqlite/postgres/duckdb/json)
5. **[wrong-api]** MCP section says `smrt-dev-mcp start` — wrong invocation
6. **[wrong-api]** Relationship example uses `@foreignKey(() => User)` thunk and `@manyToMany(() => Product, { through: '...' })` thunk — not how decorators work

---

## 11. Homepage, Themes, Navigation, Infrastructure

### Homepage (`src/routes/+page.svelte`)
**Status**: mostly-current

#### Issues

1. **[wrong-api]** "Advanced" decorator example uses fabricated options: `api.rateLimit`, `mcp.tools`, `@field({ index, precision, enum, encrypted })`, `@computed()`, `@action()` — none exist — `+page.svelte:112-135`
2. **[incorrect-description]** Quick Start omits required `TaskCollection` class declaration — misleading about boilerplate

### Modules Index (`src/routes/modules/+page.svelte`)
**Status**: outdated

#### Issues

1. **[stale-version]** Claims "29 SMRT modules" — actual is 38 packages — `+page.svelte:213`
2. **[missing-page]** 10 packages entirely absent from index
3. **[ghost-page]** `browser-ai` listed with wrong package name `@happyvertical/browser-ai`
4. **[wrong-api]** Template names use `@happyvertical/template-*` — actual is `@happyvertical/smrt-template-*`
5. **[incorrect-description]** `smrt-gnode` described as functional — it's stubs only
6. **[incorrect-description]** `smrt-messages` described as email-only — it's multi-channel

### Navigation
**Status**: accurate — all 6 nav links resolve correctly

### Themes (`src/routes/themes/`)
**Status**: mostly-current

#### Issues

1. **[incorrect-description]** Swiss theme shown as peer to built-in presets — it's a site-specific custom theme, not in npm package

### Package Dependencies (`package.json`)
**Status**: stale-version

#### Issues

1. **[stale-version]** All smrt dependencies pinned at `^0.20.1` — current is `0.20.41`
2. **[stale-version]** `@happyvertical/smrt-docs` at `0.4.1` — out of sync with monorepo `0.20.41`

---

## 12. Markdown Docs Content

### Guide: `index.md`
**Status**: outdated
- **[wrong-api]** Quick Start claims `@smrt()` decorator is optional — it's required for registration
- **[broken-link]** References `/core` and `/api/core` with unclear URL structure

### Guide: `accounts.md` + `api/accounts/`
**Status**: **GHOST** — `smrt-accounts` package doesn't exist (renamed to `smrt-ledgers`)
- **[missing-export]** Documents `AccountTransaction`/`AccountTransactionEntry` — don't exist. Actual: `Journal`/`JournalEntry`
- **[stale-version]** TypeDoc generated from deleted `packages/accounts/src/`

### Guide: `agents.md`
**Status**: mostly-current
- **[wrong-api]** Documents `@text()`, `@integer()`, `@datetime()`, `@json()` decorators — don't exist in smrt-core
- **[wrong-api]** `agents.load([...])` — not a collection method

### Guide: `assets.md`
**Status**: mostly-current
- **[missing-export]** `Folder`/`FolderCollection`, `AssetAssociation`/`AssetAssociationCollection`, `AssetStore` absent

### Guide: `content.md`
**Status**: outdated
- **[wrong-api]** Documents `context` field — actual field is `category`
- **[wrong-api]** Status lifecycle missing `'review'` value
- **[missing-export]** STI subclasses `Article`, `ContentDocument`, `Mirror` absent
- **[wrong-api]** References `@have/documents`, `@have/spider`, `@have/ocr`, `@have/pdf` — wrong/non-existent package names

### Guide: `core.md`
**Status**: outdated
- **[wrong-api]** Import from `@happyvertical/smrt-core/fields` — subpath doesn't exist (4 occurrences)
- **[missing-export]** `CLIGenerator` imported but not exported from generators
- **[wrong-api]** `APIGenerator`/`MCPGenerator` constructor options don't match actual configs
- **[wrong-api]** References `@have/sql`, `@have/spider`, `@have/pdf` — wrong package names
- **[broken-link]** Links to `./CLAUDE.md#...` anchors — broken in doc site

### Guide: `dispatch.md`
**Status**: accurate — no issues found

### Guide: `events.md`
**Status**: accurate — no issues found

### Guide: `gnode.md`
**Status**: outdated
- **[wrong-api]** Package named `@have/gnode` — actual is `@happyvertical/smrt-gnode`
- **[broken-link]** References `@have/smrt`, `@have/sql`, `@have/create-gnode` — wrong names
- **[broken-link]** Internal links to `./docs/vision.md`, `./docs/principles.md` — don't exist

### Guide: `places.md`
**Status**: accurate — no issues found

### Guide: `products.md`
**Status**: mostly-current
- **[wrong-api]** References `@have/smrt-template` — wrong package name
- **[wrong-api]** React components described — SMRT uses Svelte 5

### Guide: `profiles.md`
**Status**: outdated
- **[missing-export]** Entire auth module (Nostr, OIDC, API keys, magic links, audit logging) absent
- **[missing-export]** STI subclasses `Bot`, `Organization`, `Person` absent

### Guide: `tags.md`
**Status**: accurate — no issues found

### Guide: `types.md`
**Status**: outdated
- **[missing-export]** Only documents Signal types — Module UI types and User/Tenant enums absent

### Missing Guides (24 packages with no markdown guide)

smrt-ads, smrt-affiliates, smrt-analytics, smrt-chat, smrt-cli, smrt-commerce, smrt-config, smrt-facts, smrt-images, smrt-jobs, smrt-ledgers, smrt-messages, smrt-projects, smrt-properties, smrt-scanner, smrt-secrets, smrt-sites, smrt-social, smrt-svelte, smrt-tenancy, smrt-users, smrt-video, smrt-vitest, smrt-dev-mcp

### TypeDoc API Docs
**Status**: stale and incomplete
- `typedoc.tsconfig.json` references deleted `packages/accounts/src/`
- Only 12 of 38 packages have TypeDoc output
- `accounts` TypeDoc generated from deleted commit hash
- `gnode` TypeDoc references wrong package name `@have/gnode`
- `smrt-ledgers` (replacement for accounts) not included at all

---

## Issue Categories Summary

| Category | Count | Description |
|----------|-------|-------------|
| `stale-version` | 29+ | Version badges showing v0.17.100 or v0.19.0 |
| `wrong-api` | 80+ | Incorrect method signatures, non-existent methods, wrong import paths |
| `missing-export` | 60+ | Documented features/exports absent from docs |
| `missing-page` | 10 | Packages with no module page |
| `incorrect-description` | 25+ | Misleading or factually wrong descriptions |
| `ghost-page` | 3 | Pages for non-existent/renamed packages |
| `broken-link` | 10+ | Links to non-existent pages/anchors |
| `fabricated` | 8+ | Entire features documented that don't exist in source |
