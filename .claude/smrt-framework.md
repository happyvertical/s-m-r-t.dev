# SMRT Framework Context

This project uses the SMRT framework. Below are the conventions and patterns for the installed packages.

## Installed SMRT Packages

| Package | Version |
|---------|---------|
| @happyvertical/smrt-agents | 0.24.12 |
| @happyvertical/smrt-commerce | 0.24.12 |
| @happyvertical/smrt-content | 0.24.12 |
| @happyvertical/smrt-docs | 0.4.1 |
| @happyvertical/smrt-events | 0.24.12 |
| @happyvertical/smrt-jobs | 0.24.12 |
| @happyvertical/smrt-ledgers | 0.24.12 |
| @happyvertical/smrt-profiles | 0.24.12 |
| @happyvertical/smrt-projects | 0.24.12 |
| @happyvertical/smrt-svelte | 0.24.12 |
| @happyvertical/smrt-tenancy | 0.24.12 |
| @happyvertical/smrt-users | 0.24.12 |

---

## @happyvertical/smrt-agents

Agent framework for autonomous actors with inter-agent messaging, interest-based object discovery, scheduling, and multi-tenant bindings.

## Agent Lifecycle

`initialize()` → `validate()` → `run()` → `shutdown()`

- Extend `Agent` (which extends `SmrtObject`) and implement `run()`
- Status tracking: `idle → initializing → running → error/shutdown`
- `execute()` runs the full lifecycle automatically
- Process signal handling is opt-in via `manageProcessSignals: true` and is intended for single-agent processes

## DispatchBus — Inter-Agent Communication

Agents communicate via persistent async messaging through core's DispatchBus:

```typescript
// Emitting (in any agent)
const bus = await this.getDispatch();
await bus.emit('campaign.completed', { campaignId: '123' }, { source: 'Suasor' });

// Subscribing (in receiving agent)
async handleDispatch(payload: unknown, metadata: DispatchMetadata): Promise<void> {
  if (metadata.type === 'campaign.completed') await this.recordRevenue(payload);
}
async run() { await this.processDispatches(); } // processes via handleDispatch()
```

CLI: `smrt dispatch:list`, `dispatch:process --subscriber Fiscus`, `dispatch:retry`, `dispatch:cleanup`

## Interests — Object Discovery

Agents query objects they care about via declarative filters:

```typescript
constructor(options) {
  super({ ...options, interests: {
    objects: { Meeting: { filter: { status: 'upcoming' }, handler: async (m) => ({ action: 'recap' }) } },
    qualify: async (items) => items.filter(/* AI-based post-filter */),
  }});
}
async run() { for (const { type, data } of await this.interesting()) { ... } }
```

## Configuration

- **File-based**: `getModuleConfig('agent-name', defaults)` from `smrt.config.ts`
- **DB-persisted**: `saveSlotConfig(slotId, data)` for UI overrides
- **Merged**: `getMergedConfig('slotId')` — DB overrides file config
- **UI slots**: `static uiSlots` declares admin panels (id, label, icon, order)

## TenantAgent — Multi-Tenant Bindings

Junction table (`tenant_agents`) binding agents to tenants with permission overrides and hierarchy resolution:
- Explicit binding: row exists for tenant (source: 'explicit')
- Inherited: walks up tenant hierarchy (source: 'inherited')
- Permissions: manifest defaults merged with per-tenant overrides

## AgentSchedule

Cron-based scheduling stored in `_smrt_agent_schedules`. Fields: `agentType`, `cron`, `method` (default: 'run'), `maxConcurrent`, `timeout`. Executed by ScheduleRunner from smrt-jobs.

## Lazy agent_config Resolution (issue #1161)

Persisted `agent_config` snapshots env-derived values at sync time, so rotated env vars don't reach already-stored schedule rows. Two complementary mechanisms unfreeze them:

1. **`$env` sentinels in persisted config** — register a global resolver and reference it from the JSON:

   ```ts
   import { registerConfigResolver } from '@happyvertical/smrt-agents';
   registerConfigResolver('sharedAssetStorage', () => resolveSharedAssetStorage());
   // persisted: { "assetStorage": { "$env": "sharedAssetStorage" } }
   ```

2. **`static configResolvers` on the agent class** — declarative, discoverable via the class itself:

   ```ts
   class Praeco extends Agent {
     static override configResolvers = {
       assetStorage: () => resolveSharedAssetStorage(),
     };
   }
   ```

The TaskRunner calls `resolveLazyConfig()` immediately before constructing the agent, so live values always win over snapshotted ones. Re-exported from `@happyvertical/smrt-core` (`resolveLazyConfig`, `registerConfigResolver`, `getClassConfigResolvers`, …) for cases where agents isn't on the import path.

## Key Files

| File | Purpose |
|------|---------|
| `src/agent.ts` | Base Agent class — lifecycle, dispatch, interests, config |
| `src/schedule.ts` | AgentSchedule model — cron, execution tracking |
| `src/tenant-agent.ts` | TenantAgent — junction table, hierarchical resolution |
| `src/interests.ts` | Interest filter types and configuration |
| `src/config.ts` | File + DB config management, UI slots |

---

## @happyvertical/smrt-commerce

E-commerce with Contract STI hierarchy, invoice lifecycle, payment tracking, and optional ledger integration.

## Models

- **Customer** / **Vendor**: linked to Profile via string ID (not FK). Customer has creditLimit, paymentTerms. Vendor has leadTimeDays, minimumOrder.
- **Contract** (STI base → Estimate, Order, Lease, Agreement, PurchaseOrder): 5 contract types sharing one table.
- **ContractLineItem**: items on contracts.
- **Invoice**: status machine `DRAFT → SENT → VIEWED → PARTIAL → PAID` (also OVERDUE, CANCELLED, WRITTEN_OFF). `recognizeRevenue()` creates balanced AR journal entry (DR: Accounts Receivable, CR: Revenue, CR: Tax Payable).
- **InvoiceLineItem**: line items on invoices.
- **Payment** / **PaymentAllocation**: tracks payments against invoices. Status controlled by `Invoice.updatePaymentStatus()`, not Payment model.
- **Fulfillment** / **FulfillmentLineItem**: shipment/delivery tracking.

## Ledger Integration

Dynamic import of `@happyvertical/smrt-ledgers` — optional dependency. Invoice stores `arJournalId` and `revenueJournalId` as string references. `recognizeRevenue()` returns null if ledgers not available.

## Cross-Package References

- `customerId` → `@foreignKey('Customer')` (hard reference within package)
- `profileId` → plain string to smrt-profiles
- `arJournalId`, `revenueJournalId` → plain string to smrt-ledgers

## Gotchas

- **Optional tenancy**: all models `@TenantScoped({ mode: 'optional' })` + nullable tenantId
- **Currency in decimal fields**: price, taxAmount, totalAmount (not integer cents like affiliates)
- **Invoice controls payment status**: not the Payment model — use `Invoice.updatePaymentStatus()`
- **Tax rate is external**: no tax rate field on Invoice — rate must be calculated externally
- **Profile linking**: separate `ProfileCollection.create()` needed to fetch actual Profile object

---

## @happyvertical/smrt-content

STI content management with governance workflows, contribution intake, AI reviews, fact-checking, corrections, versioning, transparency reports, and thumbnail generation.

## Models

- **Content** (STI base): `type`, `variant` (generator:domain:specific format), `status` (published/draft/review/archived/deleted), `state`, `category` (hierarchical path with `/` separator), `metadata` JSON, `tags` array, `thumbnailAssetId`
- **Article**, **ContentDocument**, **Mirror**: STI subclasses — all share `contents` table via `_meta_type`
- **ContentReview**: AI review result tied to a governance policy. Fields: `contentId`, `policyKey`, `kind`, `status` (accepted/flagged/rejected), `findings`, `fingerprint`, `metadata`
- **ContentCorrection**: Post-publication change record. Fields: `contentId`, `type` (correction/retraction/update/clarification), `summary`, `note`, `status`, `metadata`
- **ContentVersion**: Content snapshot. Fields: `contentId`, `kind` (publication/manual), `versionNumber`, `summary`, `metadata` (includes `transparency` for publication versions)
- **ContentReference**: Junction model for content-to-content links (`content_references` table)
- **ContentGovernancePolicy**: Persisted review policy (key, label, kind, instructions)
- **ContentGovernanceProfile**: Persisted review profile (key, label, requirements array)
- **ContentGovernanceAssignment**: Governs content type/variant → profile mapping, feature flags
- **ContentContribution**: Held inbound submission with status lifecycle (submitted → approved/rejected/withdrawn → promoted)
- **ContentContributor**: Contributor profile resolved by email, with trust level (standard/trusted/blocked)
- **ContentContributionType**: Configures intake channels, rules, and promotion mapping
- **ContentContributionRevision**: Revision history for held submissions
- **ContentContributionAttachment**: Held file metadata; becomes an `Asset` on promotion

## Contents Collection

| Method | Purpose |
|--------|---------| 
| `mirror({ url })` | Downloads URL content, extracts text, creates `type: 'mirror'`. Idempotent. |
| `syncContentDir({ contentDir })` | Batch exports articles as markdown with YAML frontmatter |
| `generateMissingThumbnails(options)` | Bulk thumbnail generation for content missing `thumbnailAssetId` |
| `findWithGlobals(tenantId)` | Returns tenant-specific + global (tenantId=null) content |
| `getOrUpsert({ slug, context })` | Upsert by slug+context combination |
| `browseFacts()` | Browse fact catalog linked to content |
| `getGovernanceDefinitionsAction()` | Get all governance policy/profile/assignment definitions |
| `resolveGovernanceAction({ type, variant })` | Resolve effective governance for a content type |

## Content Instance Methods

| Method | Purpose |
|--------|---------|
| `resolveGovernance()` | Resolve effective governance config for this content |
| `runReviewAction(options)` | Run AI review against a policy; returns `ContentReview` |
| `listReviews()` | List all reviews for this content |
| `listReviewProfilesAction()` | Get readiness for all profiles |
| `evaluateReviewProfile(key)` | Evaluate one profile's requirements |
| `issueCorrectionAction(options)` | Issue a post-publication correction |
| `listCorrections()` | List corrections for this content |
| `listVersions()` | List version history |
| `mutateVersionAction(options)` | Create a version snapshot |
| `getPublishedTransparencyAction()` | Get frozen transparency from latest publication version |
| `previewTransparencyAction()` | Preview live transparency state |
| `addFact(factId, relationship)` | Link a fact (supports/contradicts/referenced_in) |
| `getFacts(options)` | Get linked facts |
| `getFactLinks()` | Get fact-content link records |
| `getFactsState()` / `syncFactsState(options)` | API-level facts get/sync |
| `addAsset(asset, relationship, sortOrder)` | Add asset association |
| `setThumbnail(image)` | Convenience: adds asset + updates `thumbnailAssetId` |
| `addReference(content)` | Link to another content |
| `getReferences()` | Get content references |

## Governance Workflow

1. `configureContentGovernance({ policies, profiles, assignments })` — static config
2. Or persist `ContentGovernancePolicy/Profile/Assignment` objects — DB overrides static
3. Effective config: DB layer merges over static defaults
4. `content.resolveGovernance()` → `ResolvedContentGovernance` with `isGoverned`, `reviewPolicies`, profile keys, feature flags
5. `content.runReviewAction()` creates a `ContentReview` with fingerprint for staleness detection
6. `content.evaluateReviewProfile(key)` checks all requirements
7. `content.save()` auto-validates publish readiness when `enforcePublishReadiness` is true
8. Publication auto-creates a `ContentVersion` with frozen transparency data

## Thumbnail Generation

Three strategies via ThumbnailGenerator:
- **headline-card**: title on branded background (via `@happyvertical/images`)
- **static-map**: requires `metadata.latitude`/`longitude` (via `@happyvertical/geo`)
- **ai-generate**: AI image generation (dynamic import of `@happyvertical/ai`)

## Svelte Components (19 total)

### Content Management
`ContentList`, `ContentEditor`, `GovernedContentEditor`, `ContentAgentChat`, `ArticleCard`, `ArticleList`, `ImageThumbnail`, `Markdown`

### Governance
`ContentGovernanceManager`, `ContentGovernancePanel`, `ContentGovernancePolicyEditor`, `ContentGovernanceProfileEditor`, `ContentGovernanceAssignmentEditor`, `ContentTransparencyReport`

### Contributions
`ContentContributionForm`, `ContentContributionInbox`, `ContentContributionPortal`, `ContentContributionTypeManager`, `ContentContributorManager`

## Dev Server

`npm run dev` starts SvelteKit at `localhost:5173` with 4 pages:

- `/` — Content catalog (CRUD, search, filters, card/list views)
- `/governance` — Policy/profile/assignment management
- `/contributions` — Inbox, submit form, contributor/type management
- `/api-explorer` — Browse 69 endpoints with try-it-live for GET

On startup, `hooks.server.ts` bootstraps schemas for all 13 local classes,
loads cross-package manifests, and seeds 3 sample content items.

## Chat Integration

Content `GET/POST /api/v1/contents/{id}/chat` endpoint creates
chat sessions via `@happyvertical/smrt-chat`. Gracefully handles
missing chat tables (returns `session: null` with notice).
`ContentAgentChat` Svelte component provides the UI.

For global assistant shells, `ContentEditor` and `GovernedContentEditor`
support `onAssistantContextChange`. The callback receives a serializable
`ContentEditorAssistantContext` plus local editor actions, and still fires when
`hideChat={true}`. `ContentAgentChat` can be mounted outside the editor with an
`assistantContext` prop. Server-side consumers can reuse the exported
`getOrCreateContentEditorChatSession`, `createContentEditorChatThread`,
`listContentEditorChatThreadMessages`, and
`sendContentEditorChatThreadMessage` helpers for app-specific tenancy/auth/AI
route wiring.

## Relationship Models

- **ContentReference**: SMRT junction model backing `content_references` for content-to-content links
- **ContentAsset**: dedicated SMRT junction model backing `content_assets` for content-owned asset links

```typescript
await content.addAsset(image, 'thumbnail', 0);  // relationship, sortOrder
await content.getAssets('attachment');
await content.setThumbnail(image);  // convenience: adds asset + updates thumbnailAssetId
await content.addReference(otherContent);
await content.getReferences();
```

## API Contracts

`Content` implements `AssetAssociable` and `MetadataAccessor` (issue #1162). Consumers can type their parameters as `Content` (or the interfaces directly) and rely on the methods existing without `typeof === 'function'` defensive checks:

```typescript
import type { AssetAssociable, MetadataAccessor } from '@happyvertical/smrt-content';

async function attachThumbnail(doc: AssetAssociable, asset: Asset) {
  await doc.addAsset(asset, 'thumbnail', 0); // contract guaranteed
}

function bumpRevision(doc: MetadataAccessor) {
  const meta = doc.getMetadata();
  doc.updateMetadata({ revision: (meta.revision ?? 0) + 1 });
}
```

## Category Navigation

`getCategorySegments()`, `getParentCategory()`, `getRootCategory()`, `getAncestorPaths()`, `isInCategory(path, includeChildren?)`

## Prompt Registry

Content prompts are registered with `@happyvertical/smrt-prompts` so tenants can override template/profile/model/params at runtime:

```typescript
import {
  smrtContentReviewPrompt,             // key: 'smrtContent.review'
  smrtContentApplyCorrectionPrompt,    // key: 'smrtContent.applyCorrection'
  smrtContentThumbnailAIGeneratePrompt, // key: 'smrtContent.thumbnail.aiGenerate'
} from '@happyvertical/smrt-content';
```

`smrtContent.thumbnail.aiGenerate` powers the AI image-generation prompt used by `ThumbnailGenerator` (strategy `'ai-generate'`). Variables substituted into the template: `style`, `title`, `styleHint`, `descriptionClause`. Internal foreign-key fields (`id`, `tenantId`) and the freeform `metadata` blob are intentionally excluded — `metadata` may carry tenant-private configuration or coordinates unrelated to the visual prompt.

## Gotchas

- **STI discriminator**: qualified names like `@happyvertical/smrt-content:Article`
- **Optional tenancy**: `@TenantScoped({ mode: 'optional' })` — null tenantId = global content
- **Metadata is primary extension pattern**: use JSON `metadata` field, not additional class fields
- **Static map coordinates**: uses unary `+` for strict parsing (rejects "45invalid" unlike parseFloat)
- **Review fingerprints**: reviews track content state at review time; stale reviews are detected by fingerprint mismatch
- **Publish readiness enforcement**: `save()` throws `ValidationError` if blocking requirements aren't met when setting status to `'published'`
- **Transparency snapshots**: published transparency is frozen into `ContentVersion.metadata.transparency` — use published for public display, preview for editors
- **Chat tables**: chat endpoint requires `@happyvertical/smrt-chat` tables; dev server handles missing tables gracefully
- **Dev server bootstraps all classes**: `hooks.server.ts` generates schemas for all 13 local `@smrt()` classes plus cross-package manifests

---

## @happyvertical/smrt-docs

*No CLAUDE.md found for this package.*

---

## @happyvertical/smrt-events

Infinite-nesting event hierarchy with series, types, participants, and role/placement management.

## Models

- **Event** (STI): self-referencing parent-child via `parentEventId`. Links to `seriesId`, `typeId`, `placeId`. Status: scheduled/in_progress/completed/cancelled/postponed. Hierarchy traversal: `getParent()`, `getChildren()`, `getAncestors()`, `getDescendants()`, `getRootEvent()`, `getHierarchy()`.
- **EventAsset**: dedicated owned-asset join in `event_assets` with `relationship` and `sortOrder`.
- **EventType**: classification with JSON schema for custom fields per type.
- **EventSeries**: recurrence patterns (daily/weekly/monthly/yearly).
- **EventParticipant**: junction with `role` (home/away/speaker/panelist/etc.), `placement` (numeric — team ordering and rankings), `groupId` (team grouping within event). `conflictColumns: ['event_id', 'profile_id', 'role']`.

## Gotchas

- **No depth limit** on event hierarchy — deep nesting can cause N+1 queries
- **Placement is numeric**: used for both team ordering (0=home, 1=away) and rankings — context-dependent
- **GroupId not enforced at DB level**: for logical grouping only (e.g., team members in a game)
- **Optional tenancy** with nullable tenantId
- **Metadata stored as JSON string** with get/set/update helpers
- **Owned asset helpers**: use `Event.getAssets()` / `addAsset()` / `removeAsset()` or the matching `EventCollection` wrappers instead of generic `AssetAssociation`

---

## @happyvertical/smrt-jobs

Background job execution with persistent queue, scheduling, and fluent builder API.

## Architecture

```
SmrtObject.bg('method') → SmrtJob (in _smrt_jobs) → TaskRunner picks up → executes via ObjectRegistry
AgentSchedule (cron) → ScheduleRunner creates SmrtJob → TaskRunner executes → ScheduleRunner updates
```

## SmrtJob

Persistent in `_smrt_jobs`. Fields: `queue` (default), `objectType`, `objectId`, `method`, `args`, `runAt`, `priority` (higher=sooner), `status`, `attempts`/`maxAttempts`, `timeout` (default 5min), `retryStrategy`, `workerId`, `workerHeartbeat`.

Status: `pending → running → completed/failed/cancelled`.

## TaskRunner

Polling-based execution engine. Config: `concurrency` (5), `pollInterval` (1s), `heartbeatInterval` (30s), `shutdownTimeout` (30s).

1. Polls `listReady()` for pending jobs (`runAt <= NOW`, ordered by `priority DESC, runAt ASC`)
2. Claims atomically: `status='running', workerId=this.id`
3. Resolves class via `ObjectRegistry.getClass(objectType)`, creates instance, calls method
4. **Internal args**: `_agentConfig` and `_scheduleId` stripped from args before calling method
5. Retry: uses strategy from `@happyvertical/jobs`, schedules future `runAt` on failure
6. Events: `job:started`, `job:completed`, `job:failed`, `job:retrying`, `runner:started/stopped`

## ScheduleRunner

Polls `_smrt_agent_schedules` every 60s for due entries. Creates SmrtJob with `queue='agents'`, `priority=75`. Wires to TaskRunner events for completion/failure tracking.

Custom cron parser: 5-field (minute hour dom month dow). `*`, ranges, lists, steps supported. **Not timezone-aware** (UTC).

## JobBuilder — Fluent API

```typescript
const handle = await doc.background('analyze', { detailed: true })
  .delay('5m').priority('high').retries(5).queue('analysis').timeout(600000).enqueue();

await handle.wait({ timeout: 60000, pollInterval: 100 }); // polling-based
```

`bg()` is shorthand: `await doc.bg('analyze', args)` → enqueues immediately, returns JobHandle.

## withBackgroundJobs(Class)

Mixin that adds `bg()` and `background()` to any SmrtObject. Uses WeakMap for collection caching per DB instance.

## Gotchas

- **Cron not timezone-aware**: all times treated as UTC
- **No dead letter queue**: failed jobs stay in DB with `status='failed'` — manual intervention
- **Result storage**: `resultPointer` is just a string — app must implement result backend
- **Lazy builder**: `background()` returns builder — nothing happens until `enqueue()`
- **wait() is polling**: JobHandle.wait() polls DB every 100ms (configurable)

---

## @happyvertical/smrt-ledgers

Double-entry accounting with chart of accounts, journal lifecycle, and balance enforcement.

## Models

- **Account**: 5 types (asset/liability/equity/revenue/expense). Hierarchical via `parentId`. Debit-normal (asset, expense) vs credit-normal (liability, equity, revenue). Methods: `getAncestors()`, `getFullPath()`, `toTreeNode()`, `getBalance(asOfDate?)`.
- **Journal**: lifecycle `draft → posted → voided`. **Immutable after posting** (can only void, not edit). `sourceModule`/`sourceRef` for cross-package attribution. Auto-numbered (e.g., "JNL-0001"). `summarize()` is AI-powered via the smrt-prompts registry (see Prompt Registry below).
- **JournalEntry**: debit XOR credit (not both, validated on save). Multi-currency via `exchangeRate`. Non-negative amounts required.

## Key Methods

- **`Journal.summarize()`**: Generates a natural-language summary via the registered `smrtLedgers.journal.summarize` prompt, resolved through `@happyvertical/smrt-prompts`. Tenants can override the template, model, temperature, or other params via `_smrt_prompt_overrides` without code changes. Only non-PII fields (number, date, description, status, aggregate total, entry count, balanced flag) reach the AI provider.

## Prompt Registry

Registered at module-load time via `definePrompt()` in `src/prompts.ts`. Side-effect imported from `src/index.ts` so consumers automatically see the prompts after importing any export from this package.

| Key | Method | Variables |
|-----|--------|-----------|
| `smrtLedgers.journal.summarize` | `Journal.summarize()` | `journalNumber`, `journalDate`, `journalDescription`, `journalStatus`, `journalTotal`, `entryCount`, `journalBalanced` |

PII-conscious variable selection: `tenantId`, `sourceRef` (may reference customer/vendor identifiers), per-entry `accountId`/`id`, and the extensible `metadata` blob are intentionally NOT exposed as prompt variables. Tenants who need richer context should override the template via `PromptOverride` and supply their own variables through a custom call site.

## Balance Enforcement

`journal.post()` validates `Math.abs(totalDebits - totalCredits) < BALANCE_EPSILON` where `BALANCE_EPSILON = 0.01` (float rounding tolerance). Unbalanced journals cannot be posted.

## Gotchas

- **Float tolerance**: 0.01 epsilon for balance check — not exact equality
- **Entry requires journalId**: save Journal first, then add entries
- **Posted journals cannot be modified**: only voided (`voidReason`, `voidedAt`)
- **Account types inherited by children**: child cannot differ from parent type
- **getBalance() is async**: requires JournalEntryCollection query (not stored on Account)
- **Optional tenancy** on all models

---

## @happyvertical/smrt-profiles

Central identity system with multi-auth, relationships, controlled metadata, and audit logging.

## Models

- **Profile** (STI base → Bot, Organization, Person): email (globally unique), `typeId` FK to ProfileType, plus a `metadata` `@oneToMany('ProfileMetadata')` relationship for controlled per-profile values.
- **ProfileAsset**: dedicated owned-asset join in `profile_assets` with `relationship` and `sortOrder`.
- **ProfileRelationship**: bidirectional — creating one auto-creates reciprocal inverse. `contextProfileId` for tertiary relationships. `ProfileRelationshipTerm` tracks start/end dates.
- **ProfileMetafield**: controlled vocabulary with `validationSchema`. **ProfileMetadata**: per-profile values linked to metafields.
- **AuditLog**: action, resourceType/Id, `source` (web/cli/ci/webhook/mcp), `onBehalfOfId` for CI pass-through identity. `allowSuperAdminBypass: true`.

## Auth Methods

| Model | Pattern |
|-------|---------|
| NostrIdentity | Encrypted keypair (AES-256-GCM). Requires `SERVER_MASTER_SECRET` env var for decryption. NIP-05 address generation. |
| OidcIdentity | Multiple issuers (Keycloak/Google/GitHub). Lookup by `issuer + subject` pair. `findOrCreate()` for first login. |
| ApiKey | SHA-256 hashed. **Plaintext returned once only** on `generate()`. `keyPrefix` for identification. Scope-based with expiry. |
| MagicLinkToken | One-time token with expiry for passwordless auth. |

## Identity Resolution

Auth helpers in `src/auth/` build profiles from external identity claims:

- `resolveIdentity()` — top-level dispatcher that returns/creates a Profile from Nostr signatures, OIDC claims, magic link tokens, or API keys.
- `createProfileFromOidc(claims, provider)` — creates `Profile` + `OidcIdentity` for first-time OIDC sign-in.
- `createProfileFromNostr(email, nostrData)` — creates `Profile` + `NostrIdentity` for Nostr-authenticated users.

## Key Methods

- `Profile.getAssets()` / `addAsset()` / `removeAsset()` and the matching `ProfileCollection` wrappers — canonical owned asset helpers backed by `profile_assets`.
- `Profile.addMetadata(metafieldSlug, value)` / `Profile.getMetadata()` — validates against metafield schema. `ProfileCollection.batchGetMetadata()` / `batchUpdateMetadata()` for bulk reads/writes.
- `Profile.getRelationships({ direction: 'from'|'to'|'all' })` — direction matters.
- AI: `generateBio()` (uses `smrtProfiles.profile.generateBio` prompt via `@happyvertical/smrt-prompts`), `matches(criteria)` (delegates to `is()`).

## Prompt Registry

`generateBio()` is registered with `@happyvertical/smrt-prompts` so tenants can override template/model/params at runtime:

```typescript
import { smrtProfilesGenerateBioPrompt } from '@happyvertical/smrt-profiles';
// key: 'smrtProfiles.profile.generateBio'
```

## Gotchas

- **SERVER_MASTER_SECRET required** for Nostr private key decryption — centralized key management
- **API key never returned again**: `ApiKey.generate()` returns plaintext once; only `keyPrefix` visible later
- **OIDC unique per issuer+subject**: same subject from different issuers = different identities
- **Email unique across all profiles**: DB-level unique constraint, not per-tenant
- **Optional tenancy** on Profile; AuditLog allows super-admin bypass

---

## @happyvertical/smrt-projects

Provider-agnostic project management — GitHub-style issues, PRs, projects, and repositories.

## Models

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **Repository** | `owner`, `name`, `providerType`, `tokenConfigKey` | `sync()`, `getIssues()`, `getPullRequests()` |
| **Issue** | `repositoryId` (FK), `number`, `title`, `body`, `state`, `labels[]` | `incorporateFeedback()`, `rollback()`, `suggestLabels()` |
| **PullRequest** | extends Issue + `headRef`, `baseRef`, `merged`, `draft` | STI on Issue table. `summarize()`, `merge()` |
| **Project** | `projectId`, `title`, `statuses[]`, `statusFieldId` | GitHub Projects V2. `addItem()`, `moveItem()`, `analyzeHealth()` |
| **Comment** | `issueId` (FK), `body`, `authorLogin` | AI analysis support |
| **Label** | `repositoryId` (FK), `name`, `color` | |

## Key Patterns

- **Token config reference**: stores env var name (`tokenConfigKey: 'GITHUB_TOKEN'`), not the token itself. Resolved at runtime from `process.env` or `getModuleConfig()`
- **Living spec** (`incorporateFeedback()`): AI synthesizes issue comments into updated body. Supports preview mode and `rollback()`
- **Provider-agnostic**: GitHub primary, GitLab/Bitbucket/Azure planned. Uses `@happyvertical/repos` and `@happyvertical/projects` SDK packages
- **PullRequest is STI on Issue**: shares table, discriminated by `_meta_type`

## Collection Methods

All collections provide: `discover({ repository, filters })`, `findByRepository(repoId)`, `findOpen(repoId?)`, `batchSync(repository)`.

## Gotchas

- **SDK dependency**: requires `@happyvertical/repos` and `@happyvertical/projects` from SDK
- **tokenConfigKey not tokenValue**: never store actual tokens in the database
- **synthesisCount tracks incorporateFeedback calls**: incremented on each apply

---

## @happyvertical/smrt-svelte

Svelte 5 components for SMRT: generic UI, forms, permissions, browser AI (STT/TTS/LLM), themes, and module UI registry.

## Provider (Root Component)

Wraps app in `+layout.svelte`. Provides auth state, permissions, WebSocket, and AI capabilities.

```svelte
<script>
  let { data, children } = $props();
</script>

<Provider user={data.user} permissions={data.permissions}
  ai={{ preload: 'idle', stt: { type: 'whisper-cpp' } }}>
  {@render children()}
</Provider>
```

## Hooks

| Hook | Returns |
|------|---------|
| `useAuth()` | `user`, `isAuthenticated`, `permissions`, `hasPermission()` |
| `useSocket()` | `status`, `isConnected`, `send()`, `reconnect()`, `disconnect()` |
| `useAppState()` | Full `SmrtAppStateManager` -- mode, AI adapters, capabilities |
| `useSTT()` | `start()`, `stop()`, `isListening`, `lastResult`, `interimResult` |
| `useTTS()` | `speak()`, `stop()`, `isSpeaking`, `getVoices()` |
| `useLLM()` | `chat()`, `initialize()`, `unload()`, `isGenerating`, `downloadProgress` |
| `useTheme()` | Theme context from `ThemeProvider` |

## AI System

- **Preload strategies**: `none`, `eager`, `idle` (recommended), `on-visible`
- **Warm client cache**: module-level Map survives navigation/remounts -- avoids re-downloading WASM/models
- **Adapters**: STT (browser-speech, whisper-cpp, whisper-wasm), TTS (browser-synthesis), LLM (webllm, transformers-llm)
- Cache API: `getCachedSTT()`, `getCachedTTS()`, `getCachedLLM()`, `getCacheStats()`, `clearAllCaches()`

## Components

| Category | Components |
|----------|------------|
| AI | `Provider`, `AILoadingOverlay`, `CapabilityGate`, `DownloadProgress`, `STTTest`, `VoiceInput` |
| Forms | `TextInput`, `Select`, `MoneyInput`, `DateTimeInput`, `Toggle`, `FileUpload`, `AddressInput`, + more |
| Layout | `Container`, `Grid`, `Header`, `Footer`, `Masthead`, `PageHeader`, `EmptyState`, `SummaryCard` |
| UI | `Button`, `Card`, `Badge`, `Pagination` |
| Display | `ConfidenceBadge`, `CurrencyDisplay`, `DateDisplay`, `Icon`, `StatusBadge` |
| Feedback | `ConfirmDialog`, `LoadingOverlay`, `Modal`, `ProgressBar` |
| Nav | `FilterChips`, `Tabs` |
| Permission | `PermissionCheck`, `RoleBadge`, `RoleSelector` |
| Admin | `AgentAdminPanel`, `AgentAdminTabs`, `AgentSettingsShell` |
| Other | `Calendar`, `DayView`, `MembershipCard`, `MembershipList`, `ModulePanel`, `DataTable` |

## Permission Action

```svelte
<div use:permission={{ slug: 'articles.delete', permissions: userPermissions }}>Delete</div>
<div use:permission={{ slug: 'articles.delete', permissions: userPermissions, hideOnly: true }}>Delete</div>
```

## Themes

Two theme systems: `src/theme/` (simple ThemeProvider with design tokens) and `src/themes/` (full preset system with material/glass/studio, CSS generation, runtime switching).

## Key Files

- `src/Provider.svelte` -- root component, state initialization
- `src/state/` -- SmrtAppStateManager ($state rune), warm client cache
- `src/hooks/` -- useAuth, useSocket, useAppState, useSTT, useTTS, useLLM, useTheme
- `src/components/` -- UI components by category
- `src/themes/` -- ThemeProvider, ThemeSwitcher, CSS presets
- `src/browser-ai/` -- STT/TTS/LLM adapters, capability detection (bundled, not external)
- `src/registry/` -- ModuleUIRegistry for cross-package component discovery

## Dependencies

- `@happyvertical/smrt-types` (shared types)
- Peer: `svelte` >=5.18.2, `@happyvertical/smrt-agents`, `@happyvertical/smrt-jobs`, `@happyvertical/smrt-profiles`, `@happyvertical/smrt-users` (all optional)

---

## @happyvertical/smrt-tenancy

Multi-tenancy via AsyncLocalStorage context propagation with automatic query filtering and tenant ID population.

## Context Propagation

```typescript
import { withTenant, getTenantId, withSystemContext } from '@happyvertical/smrt-tenancy';

await withTenant({ tenantId: 'tenant-123' }, async () => {
  // All SmrtCollection queries auto-filtered by tenantId
  // All creates auto-populate tenantId
  const docs = await collection.list({}); // WHERE tenant_id = 'tenant-123'
});

await withSystemContext(async () => { /* bypasses all tenant checks */ });
```

**Critical distinction**: `withSystemContext()` sets a SYSTEM_CONTEXT_MARKER sentinel — different from "no context" (undefined). Interceptor can distinguish intentional bypass from missing context.

## Interceptor System

Hooks into SmrtCollection via `GlobalInterceptors.register()` (priority 100, runs first):

| Hook | Behavior |
|------|----------|
| `beforeList` | Injects `tenantId` into WHERE clause; validates existing filters match context |
| `beforeGet` | Same — converts ID lookup to `{ id, tenantId }` |
| `beforeSave` | Auto-populates tenantId if empty + `autoPopulate: true`; validates if already set |
| `beforeDelete` | Validates instance.tenantId matches context |
| `beforeQuery` | Enforces raw SQL policy on tenant-scoped classes (`throw`/`warn`/`allow`) |
| `afterSave` | Emits `directory.<class>.created`/`updated` via `dispatchBus` for configured `directoryClasses` |
| `afterDelete` | Emits `directory.<class>.deleted` via `dispatchBus` for configured `directoryClasses` |

Mismatches throw `TenantIsolationError`. Missing required context throws `TenantContextError`.

## Registration — Two Patterns

```typescript
// Pattern 1: Tenancy decorator
@TenantScoped({ mode: 'optional' })
class Doc extends SmrtObject { @tenantId({ nullable: true }) tenantId: string | null = null; }

// Pattern 2: Core decorator (tenancy package reads this too)
@smrt({ tenantScoped: { mode: 'optional' } })
class Doc extends SmrtObject { tenantId: string | null = null; }
```

Modes: `'required'` (default — throws without context) or `'optional'` (passes through if no context).

## Adapters

- **Express**: `createExpressMiddleware()` — uses `enterTenantContext()` (not withTenant, because middleware returns before handlers run)
- **SvelteKit**: `createSvelteKitHandle()` — stores context in `event.locals`
- **CLI**: `createCliContext()` — `run()`, `runWithTenant()`, `runAsSystem()`, `runAsSuperAdmin()`

## Super Admin Bypass

`withSuperAdminBypass()` keeps tenant context but disables auto-filtering. Different from `withSystemContext()` which removes context entirely.

## Gotchas

- **Context lost in callbacks**: `setTimeout(() => getTenantId(), 100)` → undefined. Fix: `TenantContext.bind(fn)`
- **Nested contexts override**: inner `withTenant()` overrides outer; restores on exit
- **Auto-populate only if empty**: if tenantId already set, interceptor validates (not overwrites)
- **Isolation checked at query time**: `list({ where: { tenantId: 'other' } })` throws immediately
- **Testing**: `resetTenancy()` + `setupTestTenancy()` in beforeEach; `testTenantIsolation()` helper

## Known exceptions to monorepo standards

- **`serializeInstance()` in `src/interceptor.ts` calls `instance.toJSON()` directly** (standards.md §7 forbids this in favor of `transformJSON()`). The interceptor must serialize arbitrary instances handed to it — including workspace stubs and plain-object test doubles whose classes may not extend `SmrtObject` and therefore have no `transformJSON()` hook. The call is duck-typed and falls back to manual key iteration when `toJSON` is absent. See the inline comment at the call site for the full rationale.

---

## @happyvertical/smrt-users

Multi-tenant user management with RBAC, hierarchical tenants, session handling, and SvelteKit integration.

## Models (13)

| Model | Key Pattern |
|-------|-------------|
| User | Auth identity. `profileId` is plain string (not FK) to smrt-profiles. Email auto-lowercased. |
| Tenant | **STI** + hierarchical parent-child. `hierarchyPath` (materialized path), `hierarchyLevel`. Max depth 10. |
| Session | Server-side. Secure UUID. TTL in **seconds** (not ms). Status auto-updates to EXPIRED on access. |
| MagicLinkToken | Single-use email login token. Backed by `MagicLinkService`. |
| Role | `tenantId = null` → system role (available to all tenants). `isSystem: true` blocks deletion. |
| Permission | Slug format: `resource.action`. Parsed by PermissionResolver. |
| Membership | User + Tenant + Role junction. UNIQUE(userId, tenantId). |
| Group | Team within a tenant. Multiple roles via GroupRole. |
| GroupMember, GroupRole, RolePermission | Join tables. |
| MembershipOverride | Per-user permission grant/deny. **DENY always wins.** |
| TenantPermissionOverride | Tenant-level cascade overrides. Effect: INHERIT/GRANT/DENY. |

## Permission Resolution — 4-Level Cascade

PermissionResolver evaluates in order (each level can add/remove permissions):

1. **Tenant hierarchy** — walk ancestors, apply TenantPermissionOverride at each level
2. **Membership role** — base permissions from user's role in tenant
3. **Group roles** — permissions from all groups user belongs to **in that tenant**
4. **Membership overrides** — final GRANT/DENY per-user (DENY takes absolute precedence)

**Critical**: `getGroupIdsForTenant(userId, tenantId)` (joins with groups table to scope by tenant). Never use `getGroupIds()` — it's cross-tenant.

## Hierarchical Tenants

- `TenantCollection.createChild()` auto-calculates hierarchy fields, enforces depth limit
- `moveToParent()` updates tenant + ALL descendants' paths/levels
- `cascadePermissions` (parent pushes down) + `inheritPermissions` (child accepts) — both must be true
- `getTree(rootId?)` returns nested structure for UI

## SvelteKit Integration

```typescript
// hooks.server.ts
export const handle = createSessionHandler({ db, ttl: 604800, skipPaths: ['/api/public'] });
// Populates event.locals: { user, permissions: string[], tenantId, sessionId }

// +page.server.ts
await createSessionCookie(event, userId, tenantId, { db });
await destroySessionCookie(event, { db });
await switchSessionTenant(event, tenantId, { db });
```

## Gotchas

- **seedSystemRoles() required**: call `RoleCollection.seedSystemRoles()` at app init (creates owner/admin/member/viewer)
- **PermissionResolver casts `as any`**: collections have protected constructors — known framework limitation
- **Session TTL in seconds**: `DEFAULT_SESSION_TTL = 7 * 24 * 60 * 60` (not milliseconds)
- **Users are cross-tenant**: one user, many tenants via Membership. Email globally unique.
- **Batch permission queries**: resolver fetches all permission IDs in one query, then maps to slugs (avoids N+1)

---

## Contributing to This Documentation

If you discover gotchas, patterns, or information that should be included in the SMRT framework documentation, please submit an issue:

**https://github.com/happyvertical/smrt/issues**

Include:
- The package name (e.g., `@happyvertical/smrt-core`)
- Description of the gotcha or pattern
- Example code if applicable

---
*Generated by `smrt docs:claude` — regenerate after dependency updates*
