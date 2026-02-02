# SMRT Framework Context

This project uses the SMRT framework. Below are the conventions and patterns for the installed packages.

## Framework Documentation

---

### Framework Overview

_Source: CLAUDE.md_

# SMRT Framework: Architecture and Development Guide

## What is SMRT?

SMRT (Smart, Multi-modal, Real-time Transformation) is a TypeScript framework for building vertical AI agents with automatic code generation and AI-powered operations.

### Core Value Proposition

**Define business logic once, get everything else automatically:**

- Define TypeScript classes with properties
- Get REST APIs, CLI tools, and AI integration (MCP servers) automatically
- Built-in AI operations (`is()`, `do()` methods) on every object
- Database persistence with automatic schema generation
- Type-safe operations across all interfaces

### Design Philosophy

- **TypeScript-First**: Use native TypeScript types; field helpers only when needed
- **AI-Powered**: Built-in intelligent operations on every object
- **Code Generation**: APIs, CLIs, MCP servers generated automatically
- **Manifest-Based**: Schema generation from AST at build time (no runtime introspection)
- **Self-Contained**: Minimal external dependencies, focused framework
- **Developer Experience**: IntelliSense, type safety, hot reload

### When to Use SMRT

✅ **Perfect for:**

- Vertical AI agents (local news, research, content processing)
- Domain-specific applications with AI operations
- Rapid prototyping of AI-powered services
- Applications needing APIs, CLIs, and AI integration

❌ **Not ideal for:**

- Generic web frameworks (use SvelteKit, Next.js, etc.)
- Pure data processing without AI
- Applications requiring custom ORM behavior

---

## Quick Start

### Installation

```bash
# Install SMRT framework
npm install @happyvertical/smrt-core

# Or with pnpm
pnpm add @happyvertical/smrt-core
```

### Define Your First SMRT Object

Use TypeScript types for automatic schema generation:

```typescript
import { SmrtObject, smrt } from '@happyvertical/smrt-core';
import { foreignKey } from '@happyvertical/smrt-core/fields';

@smrt({
	api: { include: ['list', 'get', 'create', 'update'] },
	mcp: { include: ['list', 'get', 'analyze'] },
	cli: true
})
class Document extends SmrtObject {
	// TypeScript types → automatic schema generation
	title: string = '';
	content: string = '';
	wordCount: number = 0; // → INTEGER (no decimal point)
	rating: number = 0.0; // → DECIMAL (has decimal point)
	isPublished: boolean = false;
	publishedAt: Date = new Date();
	tags: string[] = [];

	// Field helpers for relationships and constraints
	categoryId = foreignKey(Category);

	constructor(options: any = {}) {
		super(options);
		Object.assign(this, options);
	}

	// AI-powered validation
	async isHighQuality(): Promise<boolean> {
		return await this.is(`
      - Contains more than 500 words
      - Has clear structure
      - Uses professional language
    `);
	}

	// AI-powered transformation
	async generateSummary(): Promise<string> {
		return await this.do(`
      Create a 2-sentence summary of this document.
      Focus on key points and conclusions.
    `);
	}
}
```

**⚠️ WARNING: Do Not Override toJSON()**

The `toJSON()` method in `SmrtObject` handles critical framework infrastructure. **DO NOT override** this method unless you call `super.toJSON()` first.

**What toJSON() handles:**

- **STI discriminator** (`_meta_type`) for polymorphic queries
- **Meta field extraction** (`_meta_data`) for child-specific fields
- **Automatic serialization** of all fields from manifest

**The Safe Way - Use transformJSON() Hook:**

```typescript
class Document extends SmrtObject {
	title: string = '';
	content: string = '';

	// ✅ CORRECT - Use transformJSON() hook
	protected transformJSON(data: any): any {
		return {
			...data,
			wordCount: this.content.split(/\s+/).length,
			preview: this.content.substring(0, 100)
		};
	}
}
```

**The Dangerous Way - Overriding toJSON():**

```typescript
// ❌ WRONG - breaks STI and meta fields
class Document extends SmrtObject {
	toJSON() {
		return { id: this.id, title: this.title };
		// Missing: _meta_type, _meta_data, other fields!
	}
}

// ✅ CORRECT - calls super if you must override
class Document extends SmrtObject {
	toJSON() {
		const data = super.toJSON();
		return { ...data, customField: 'value' };
	}
}
```

See [issue #377](https://github.com/happyvertical/smrt/issues/377) for details.

### Create and Use Collections

```typescript
import { SmrtCollection } from '@happyvertical/smrt-core';

class DocumentCollection extends SmrtCollection<Document> {
	static readonly _itemClass = Document;
}

// Create collection instance
const documents = await DocumentCollection.create({
	persistence: { type: 'sql', url: 'documents.db' },
	ai: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
});

// Create and save a document
const doc = await documents.create({
	title: 'Getting Started with SMRT',
	content: 'SMRT makes building AI agents simple...',
	wordCount: 1250,
	rating: 4.5
});
await doc.save();

// Query with advanced filters
const recentDocs = await documents.list({
	where: {
		'wordCount >': 1000,
		'publishedAt >': '2024-01-01'
	},
	orderBy: 'rating DESC',
	limit: 10
});

// Batch ID lookup (avoids N+1 queries)
const docIds = ['uuid-1', 'uuid-2', 'uuid-3'];
const batchDocs = await documents.listByIds(docIds);

// Alternative: implicit IN with array values
const sameDocs = await documents.list({
	where: { id: docIds } // Arrays auto-detect IN operator
});

// Raw SQL query for complex patterns (NOT EXISTS, JOINs, OR conditions, etc.)
const unpublished = await documents.query(
	`
  SELECT * FROM documents
  WHERE is_published = false
  AND NOT EXISTS (
    SELECT 1 FROM reviews r WHERE r.document_id = documents.id
  )
  ORDER BY created_at DESC
  LIMIT ?
`,
	[10]
);

// Use AI-powered operations
const isQuality = await doc.isHighQuality();
const summary = await doc.generateSummary();
```

**WHERE clause reference**: The `where` object supports 8 operators: `=`, `>`, `<`, `>=`, `<=`, `!=`, `in`, `like`. For complex queries (OR conditions, nested queries, array operations), use `collection.query()` with raw SQL. See [packages/core/CLAUDE.md](./packages/core/CLAUDE.md#where-clause-reference) for complete operator reference and limitations.

### Multi-Level Class Inheritance

SMRT supports multi-level class inheritance, allowing you to build class hierarchies where child classes automatically inherit fields and methods from parent classes:

```typescript
// Level 1: Base Content class (from @happyvertical/smrt-content)
@smrt()
class Content extends SmrtObject {
	title: string = '';
	body: string = '';
	publishedAt: Date | null = null;
	wordCount: number = 0;

	async generateSummary(): Promise<string> {
		return await this.do('Create a 2-sentence summary');
	}
}

// Level 2: Praeco Content extends Content (from praeco package)
@smrt()
class PraecoContent extends Content {
	sourceUrl: string = '';
	sentiment: string = '';

	async analyzeSentiment(): Promise<string> {
		return (await this.is('The content has positive sentiment')) ? 'positive' : 'negative';
	}
}

// Level 3: Bentley Content extends PraecoContent (from bentleyalberta.com)
@smrt()
class BentleyContent extends PraecoContent {
	localTags: string[] = [];
	featured: boolean = false;

	async analyzeLocalRelevance(): Promise<number> {
		// Custom local analysis
		return 0.95;
	}
}

// BentleyContent automatically inherits ALL fields and methods:
// - title, body, publishedAt, wordCount (from Content)
// - sourceUrl, sentiment (from PraecoContent)
// - localTags, featured (from BentleyContent)
// - generateSummary() (from Content)
// - analyzeSentiment() (from PraecoContent)
// - analyzeLocalRelevance() (from BentleyContent)

// Schema generation includes all inherited fields
const bentley = new BentleyContent({
	title: 'Local News',
	body: 'Story content...',
	sourceUrl: 'https://example.com',
	localTags: ['bentley', 'alberta'],
	db: { type: 'sqlite', url: 'bentley.db' }
});

await bentley.initialize();
await bentley.save(); // Table has ALL inherited columns

// Call methods from any level of the hierarchy
const summary = await bentley.generateSummary(); // Content
const sentiment = await bentley.analyzeSentiment(); // PraecoContent
const relevance = await bentley.analyzeLocalRelevance(); // BentleyContent
```

### Generate APIs, CLI, and MCP

The `@smrt()` decorator automatically configures code generation:

```typescript
// REST API endpoints generated:
// GET    /documents
// GET    /documents/:id
// POST   /documents
// PUT    /documents/:id

// CLI commands generated:
// smrt documents list
// smrt documents get <id>
// smrt documents create --title "..." --content "..."

// MCP tools generated (for AI integration):
// document_list, document_get, document_analyze
```

### Custom Method Discovery (Auto-Generated CLI Commands)

**New in v0.6+**: Custom methods are automatically discovered and exposed as CLI commands!

Define custom methods on your SMRT objects, and the CLI generator will automatically create corresponding commands:

```typescript
@smrt({
	cli: { include: ['list', 'get', 'research', 'report'] } // Include custom methods
})
class Agent extends SmrtObject {
	name: string = '';
	source: string = '';

	// Custom method with parameters
	async research(options: { query: string; depth?: number }) {
		return {
			action: 'research',
			query: options.query,
			depth: options.depth || 3,
			results: await this.do(`Research: ${options.query}`)
		};
	}

	// Another custom method
	async report(options: { type?: string }) {
		return {
			action: 'report',
			type: options.type || 'summary',
			content: await this.do(`Generate ${options.type} report for ${this.name}`)
		};
	}
}
```

**Auto-generated CLI commands:**

```bash
# Standard CRUD (as before)
smrt agent:list
smrt agent:get <id>

# Custom methods (auto-discovered! 🎉)
smrt agent:research <id> --query "AI safety research" --depth 5
smrt agent:report <id> --type detailed
```

**How it works:**

- CLI generator scans `ObjectRegistry.getMethods()` for public methods
- Method parameters are converted to kebab-case CLI options (`researchQuery` → `--research-query`)
- Include/exclude lists work for both CRUD commands and custom methods
- Only public methods are exposed (private/protected methods are skipped)

### Next Steps

- **Deep Dive**: [packages/core/CLAUDE.md](./packages/core/CLAUDE.md) - Comprehensive technical reference
- **API Reference**: [packages/core/README.md](./packages/core/README.md) - Complete API documentation
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- **Workflow**: [WORKFLOW.md](./WORKFLOW.md) - Development SOPs

---

## TypeScript Types vs Field Helpers

SMRT supports TypeScript-first development with automatic type inference.

### TypeScript Types (Primary Pattern)

Use TypeScript types for most properties - the AST scanner automatically generates database schema:

```typescript
class Product extends SmrtObject {
	// String → TEXT
	name: string = '';
	description: string = '';

	// Numbers with 0 vs 0.0 heuristic
	quantity: number = 0; // → INTEGER (no decimal point)
	price: number = 0.0; // → DECIMAL (has decimal point)
	rating: number = 4.5; // → DECIMAL (has decimal point)

	// Boolean → BOOLEAN
	active: boolean = true;

	// Date → DATETIME
	created: Date = new Date();

	// Arrays → JSON
	tags: string[] = [];
	metadata: Record<string, any> = {};
}
```

### The 0 vs 0.0 Heuristic

Numeric literals **without** decimal point → INTEGER:

- `count: number = 0` → INTEGER
- `quantity: number = 42` → INTEGER

Numeric literals **with** decimal point → DECIMAL:

- `price: number = 0.0` → DECIMAL
- `rating: number = 4.5` → DECIMAL

This semantic distinction enables proper database schema generation without field helpers.

### When to Use Field Helpers

Field helpers are **only required** for:

#### 1. Relationships

```typescript
class Order extends SmrtObject {
	customerId = foreignKey(Customer);
	items = oneToMany(OrderItem);
	relatedOrders = manyToMany(Order);
}
```

#### 2. Constraints and Validation

```typescript
class User extends SmrtObject {
	username = text({
		required: true,
		unique: true,
		minLength: 3,
		maxLength: 20
	});

	email = text({
		required: true,
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	});
}
```

#### 3. Nullable Decimals

```typescript
class Place extends SmrtObject {
	// Optional decimal needs explicit helper
	latitude = decimal({ nullable: true });
	longitude = decimal({ nullable: true });
}
```

### Decision Tree

```
Do you need to define a property?
│
├─ Is it a relationship?
│  └─ YES → Use field helper: foreignKey(), oneToMany(), manyToMany()
│
├─ Do you need constraints (required, unique, min, max, pattern)?
│  └─ YES → Use field helper: text({ required: true }), integer({ min: 0 })
│
├─ Is it an optional decimal number?
│  └─ YES → Use field helper: decimal({ nullable: true })
│
└─ NO → Use TypeScript types:
   - Strings: name: string = ''
   - Integers: count: number = 0
   - Decimals: price: number = 0.0
   - Booleans: active: boolean = true
   - Dates: created: Date = new Date()
```

For complete documentation, see [packages/core/CLAUDE.md#typescript-types-vs-field-helpers](./packages/core/CLAUDE.md#typescript-types-vs-field-helpers).

---

## Monorepo Structure

The SMRT framework is organized as a pnpm workspace:

### Core Framework Packages

**Foundation:**

- **types**: Shared TypeScript type definitions
- **config**: Configuration management with cosmiconfig
- **core**: Core framework with ORM, code generation, and AI integration

**Domain Modules:**

- **accounts**: Accounting ledger with multi-currency support
- **agents**: Agent framework for autonomous actors
- **assets**: Asset management with versioning and metadata
- **content**: Content processing (documents, PDFs, web)
- **events**: Event management with participants and hierarchies
- **gnode**: Federation library for local knowledge bases
- **places**: Place management with geo integration
- **products**: Product catalog and microservice template
- **profiles**: Profile management with relationships
- **tags**: Hierarchical tagging system

### External SDK Dependencies

Infrastructure packages from [@happyvertical/sdk](https://github.com/happyvertical/sdk):

- **@happyvertical/ai**: Multi-provider AI client (OpenAI, Anthropic, Google, AWS)
- **@happyvertical/files**: File system operations
- **@happyvertical/sql**: Database operations (SQLite, Postgres, DuckDB)
- **@happyvertical/utils**: Shared utilities
- **@happyvertical/logger**: Logging infrastructure

Standalone packages (separate repositories):

- **@happyvertical/spider**: Web content scraping
- **@happyvertical/pdf**: PDF text extraction
- **@happyvertical/ocr**: OCR text extraction

### Package Dependencies

**Within SMRT framework:**

- `@happyvertical/smrt-types`: No internal dependencies
- `@happyvertical/smrt-config`: No internal dependencies
- `@happyvertical/smrt-core`: Depends on types, config, and external SDK packages
- Domain modules: All depend on core; some have cross-dependencies

**Build order** (managed by Turborepo):

1. types, config (parallel)
2. core (depends on types + config)
3. Domain modules (depend on core)

---

## Development Setup

### Prerequisites

- **Node.js**: 24+ required
- **pnpm**: 9.0+ required
- **TypeScript**: Configured with strict type checking

### Installation

```bash
# Clone the repository
git clone https://github.com/happyvertical/smrt.git
cd smrt

# Install dependencies
pnpm install

# Build all packages (Turborepo with caching)
npm run build
# First run: ~8s, cached runs: ~80ms
```

### Common Commands

```bash
# Development mode with watch
npm run dev

# Run tests
npm test           # Uses 'smrt test' - generates manifests + runs tests
npm run test:watch # Watch mode

# Type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
npm run format-check

# Clean build artifacts
npm run clean
```

### ⚠️ CRITICAL: Running Tests

**ALWAYS use `smrt test` or `npm test` - NEVER use `npx vitest` directly!**

```bash
# ✅ CORRECT - Generates test manifest first
smrt test
npm test           # Aliases to 'smrt test'

# ❌ WRONG - Will fail with "unregistered class" errors
npx vitest
npx vitest run
```

**Why?** Tests require a manifest file that maps SMRT objects for schema generation. The `smrt test` command:

1. **Generates the test manifest** from `@smrt()` decorated classes
2. **Runs vitest** with the manifest loaded

Without the manifest, tests fail with errors like:

```
Cannot generate schema for unregistered class 'Council'.
Ensure the class is decorated with @smrt() for schema generation to work.
```

**For individual test files:**

```bash
# Generate manifest first, then run specific test
smrt test --manifest-only
npx vitest run src/specific-test.test.ts
```

**Database Adapter Testing:**

The framework includes comprehensive adapter parity tests to ensure consistent behavior across all database backends (SQLite, JSON/DuckDB). These tests verify:

- STI (Single Table Inheritance) operations
- UPSERT conflict resolution
- Type preservation across save/load cycles
- Query operations with filtering

See `packages/core/src/__tests__/sti-adapter-parity.test.ts` for the complete test suite that runs identical tests across all supported adapters.

### Testing Best Practices

SMRT provides the `@happyvertical/smrt-vitest` package for isolated test database setup:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createIsolatedTestDb } from '@happyvertical/smrt-vitest';
import { MyObject, MyCollection } from './my-object.js';

describe('MyObject', () => {
	let collection: MyCollection;

	beforeEach(async () => {
		// Creates isolated in-memory SQLite database
		const db = await createIsolatedTestDb();
		collection = await MyCollection.create({
			persistence: { type: 'sql', db }
		});
	});

	it('should create and save object', async () => {
		const obj = await collection.create({
			name: 'Test',
			value: 42
		});
		await obj.save();

		const loaded = await collection.get({ id: obj.id });
		expect(loaded?.name).toBe('Test');
		expect(loaded?.value).toBe(42);
	});
});
```

**Key patterns**:

- **Isolated databases**: Use `createIsolatedTestDb()` for each test suite
- **Real resources**: Prefer in-memory databases over mocks
- **Readable tests**: Tests should read like documentation
- **README examples**: All README code examples must have corresponding tests

**See also**: [TESTING_STANDARD.md](./TESTING_STANDARD.md) for complete testing guidelines.

### Build System

The framework uses **Turborepo** for intelligent task orchestration:

- Intelligent caching: Only rebuilds when dependencies change
- Parallel execution: Builds packages in parallel when possible
- GitHub Actions cache: CI/CD benefits from cached builds
- Dependency awareness: Automatically respects package dependencies

**Performance:**

- First build: ~8 seconds
- Cached builds: ~80ms (100x faster)

### Code Style

- Code formatting enforced by Biome
- 2 spaces for indentation
- Single quotes for strings
- 80-character line width
- ESM module format exclusively
- camelCase for variables/functions, PascalCase for classes

### Manifest-Based Schema Generation

SMRT uses **AST-based manifest generation** instead of runtime introspection:

**How it works:**

1. **Build Time**: AST scanner finds all `@smrt()` decorated classes
2. **Manifest Generation**: Creates JSON manifest with class metadata, fields, and types
3. **Schema Generation**: Uses manifest data to generate database schemas
4. **No Runtime Introspection**: All metadata determined at build time

**Benefits:**

- **Performance**: No runtime reflection overhead
- **Tree-Shaking**: Unused classes can be eliminated
- **Type Safety**: Full TypeScript type information preserved
- **Predictable**: Schema determined at build time, not runtime

**The Manifest Process:**

```bash
# During build
smrt scan           # Scans TypeScript AST
  → manifest.json   # Generated manifest with all metadata
  → schema.sql      # Generated database schema

# During runtime
ObjectRegistry      # Reads manifest.json
  → generateSchema  # Uses manifest data (no reflection)
```

**TypeScript Type Inference:**

```typescript
// AST scanner infers types from TypeScript
class Product extends SmrtObject {
	name: string = ''; // AST → TEXT column
	count: number = 0; // AST → INTEGER (no decimal)
	price: number = 0.0; // AST → DECIMAL (has decimal)
	active: boolean = true; // AST → BOOLEAN
	tags: string[] = []; // AST → JSON
}
```

### Tree Shaking for External Packages

When using external SMRT packages (e.g., `@happyvertical/smrt-profiles`), by default ALL objects from those packages are included in your manifest. This can lead to bloat if you only use a few classes.

**Tree shaking** filters external objects to only include what your project actually uses.

#### Enabling Tree Shaking

**Option 1: Import-Based (Automatic)**

```typescript
// smrt.config.js or ManifestBuilder options
{
  treeShake: true,  // Enable import analysis
  discoverExternalPackages: true
}
```

When enabled, the AST scanner analyzes your imports:

```typescript
// Your code
import { Person, Organization } from '@happyvertical/smrt-profiles';

// Only Person, Organization, and their dependencies are included
// Other classes like Team, Role, etc. are excluded
```

**Option 2: Explicit Whitelist**

```typescript
// smrt.config.js or ManifestBuilder options
{
  externalObjectsWhitelist: [
    'Person',
    'Organization',
    '@happyvertical/smrt-events:Meeting'  // Qualified names also work
  ],
  discoverExternalPackages: true
}
```

**Option 3: Combined (Imports + Whitelist)**

```typescript
// Both imported classes AND whitelisted classes are included
{
  treeShake: true,
  externalObjectsWhitelist: ['ExtraClass'],
  discoverExternalPackages: true
}
```

#### Transitive Dependency Resolution

Tree shaking automatically includes transitive dependencies:

- **Inheritance**: If `Meeting` extends `Event`, both are included
- **Foreign Keys**: If `Person` has `organizationId: foreignKey(Organization)`, both are included
- **STI Siblings**: If `Meeting` uses STI with `Event` as base, all `Event` subtypes are included

#### Configuration Options

| Option                     | Type     | Default | Description                         |
| -------------------------- | -------- | ------- | ----------------------------------- |
| `treeShake`                | boolean  | `false` | Enable import-based filtering       |
| `externalObjectsWhitelist` | string[] | `[]`    | Explicit list of classes to include |
| `discoverExternalPackages` | boolean  | `false` | Scan node_modules for SMRT packages |

#### Example Manifest Size Impact

| Configuration            | Objects Included             | Manifest Size |
| ------------------------ | ---------------------------- | ------------- |
| Default (no filtering)   | All 27 from smrt-profiles    | ~180KB        |
| treeShake with 3 imports | 5 (imports + dependencies)   | ~35KB         |
| Whitelist with 2 classes | 3 (whitelist + dependencies) | ~25KB         |

### Qualified Class Names (Namespace Isolation)

SMRT uses **qualified class names** to prevent collisions when multiple packages define classes with the same name. This enables true namespace isolation across packages.

**Format**: `@package/name:ClassName`

```typescript
// Examples of qualified names
'@happyvertical/smrt-core:Product';
'@happyvertical/smrt-profiles:Person';
'@happyvertical/praeco:Article';
```

**Why Qualified Names?**

Without qualified names, two packages defining `class Product` would collide:

```
Package A: class Product → manifest.objects["Product"]  ❌ Collision!
Package B: class Product → manifest.objects["Product"]  ❌
```

With qualified names:

```
Package A: class Product → manifest.objects["@pkg-a:Product"]  ✅
Package B: class Product → manifest.objects["@pkg-b:Product"]  ✅
```

**STI Discriminator Format**

The `_meta_type` discriminator column now uses qualified names:

```typescript
// Old format (no longer used)
{ _meta_type: 'Meeting', title: 'Standup' }

// New format (qualified)
{ _meta_type: '@happyvertical/smrt-events:Meeting', title: 'Standup' }
```

**Creating STI Objects**

When creating STI objects, use the qualified `_meta_type`:

```typescript
const event = await eventCollection.create({
	_meta_type: '@happyvertical/smrt-events:Meeting',
	title: 'Team Standup',
	location: 'Room A'
});
```

**Querying STI Objects**

Filter by qualified `_meta_type`:

```typescript
// Get all meetings
const meetings = await eventCollection.list({
	where: { _meta_type: '@happyvertical/smrt-events:Meeting' }
});
```

**Migration for Existing Databases**

If you have existing databases with unqualified `_meta_type` values, use the STI migration command:

```bash
# Preview migration without applying
smrt db:migrate --upgrade-sti --dry-run

# Apply STI discriminator migration
smrt db:migrate --upgrade-sti
```

This updates all `_meta_type` values from simple class names to qualified format:

```sql
-- Generated migration
UPDATE events SET _meta_type = '@happyvertical/smrt-events:Meeting'
WHERE _meta_type = 'Meeting';
```

**Registry Lookups**

The ObjectRegistry supports both qualified and simple name lookups:

```typescript
import { ObjectRegistry } from '@happyvertical/smrt-core';

// Qualified lookup (preferred)
const registered = ObjectRegistry.getClass('@happyvertical/smrt-core:Product');

// Simple name lookup (for convenience, searches by className)
const fields = ObjectRegistry.getFields('Product');
const methods = ObjectRegistry.getMethods('Product');
```

**Visibility Control**

Classes can specify visibility to control manifest inclusion:

```typescript
@smrt({ visibility: 'public' }) // Default - exported to consumers
class Product extends SmrtObject {}

@smrt({ visibility: 'internal' }) // Package-only, not in published manifest
class InternalHelper extends SmrtObject {}

@smrt({ visibility: 'test' }) // Test-only, never published
class TestFixture extends SmrtObject {}
```

Test files (`*.test.ts`, `__tests__/*`) automatically get `visibility: 'test'`.

---

## For Contributors

### Quick Links

- **Detailed Workflows**: [WORKFLOW.md](./WORKFLOW.md) - Step-by-step SOPs for development
- **Testing Standards**: [TESTING_STANDARD.md](../TESTING_STANDARD.md) - Testing requirements
- **Contributing Guide**: [CONTRIBUTING.md](./CONTRIBUTING.md) - High-level guidelines

### Contribution Workflow

1. **Find or create an issue** in [GitHub Issues](https://github.com/happyvertical/smrt/issues)
2. **Follow workflow SOPs** in [WORKFLOW.md](./WORKFLOW.md):
   - Pre-work checklist
   - Create feature branch: `{type}/issue-{number}-{description}`
   - Implement with tests
   - Run quality checks
   - Create PR
3. **Code review** and feedback
4. **Merge** after approval

### Git Branching Strategy

**Branch naming**: `{type}/issue-{number}-{short-description}`

- `feat/issue-123-new-feature`
- `fix/issue-45-bug-fix`
- `docs/issue-89-update-readme`

**Conventional commits**: All commits follow [Conventional Commits](https://www.conventionalcommits.org/)

For complete workflow details, see [WORKFLOW.md](./WORKFLOW.md).

### Changesets and Versioning

⚠️ **IMPORTANT: Changesets are auto-generated on merge to main**

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and package releases:

- **Automated Generation**: Changesets are auto-generated from conventional commits when PRs merge to main
- **No Changesets in PRs**: PRs do NOT contain changeset files - they're generated during publish workflow
- **PR Validation**: Only validates conventional commit format, not changeset presence
- **No Manual Creation**: Don't run `npx changeset` or create changeset files manually
- **Critical: Avoid `[skip ci]`**: Using `[skip ci]` in any commit message will prevent the on-merge-main workflow from running, which breaks package publishing

**Why this matters**: When a PR with `[skip ci]` in any commit is merged to main, GitHub Actions skips the entire merge workflow, including building and publishing packages. This requires manual intervention to trigger the publish workflow.

For complete changeset workflow and troubleshooting, see [CHANGESETS.md](./CHANGESETS.md).

### Adding New Packages

When creating a new package in the monorepo, you **MUST** complete these steps to ensure proper versioning and release:

#### 1. Add to Changeset Fixed Array

All packages must be added to the `fixed` array in `.changeset/config.json` to ensure they stay version-locked together:

```json
{
	"fixed": [
		[
			"@happyvertical/smrt-agents",
			"@happyvertical/smrt-assets",
			// ... existing packages ...
			"@happyvertical/smrt-YOUR-NEW-PACKAGE" // ADD HERE
		]
	]
}
```

#### 2. Match Current Version

Set the new package's version to match all other packages:

```json
{
	"name": "@happyvertical/smrt-your-package",
	"version": "0.17.34" // Match current version of other packages
}
```

Check current version: `node -p "require('./packages/core/package.json').version"`

#### 3. Required Package.json Fields

Ensure these fields are set correctly:

```json
{
	"name": "@happyvertical/smrt-your-package",
	"version": "0.17.34",
	"type": "module",
	"publishConfig": {
		"registry": "https://npm.pkg.github.com",
		"access": "public"
	}
}
```

#### Why This Matters

All `@happyvertical/smrt-*` packages are **version-locked** using Changeset's `fixed` configuration. This means:

- When ANY package in the fixed group gets a bump, ALL packages bump together
- This prevents version mismatches between interdependent packages (e.g., `smrt-core` vs `smrt-cli`)
- Downstream projects can reliably use `@happyvertical/smrt-*@0.17.x` knowing all packages are compatible

**Failure to add new packages to the fixed array** will cause them to drift to different versions, breaking compatibility.

### Testing Requirements

All code changes must include tests following [TESTING_STANDARD.md](../TESTING_STANDARD.md):

- Use real resources (in-memory DBs, temp files) over mocks
- Tests should read like documentation
- README examples must have corresponding tests
- Follow BDD/TDD for bug fixes

---

## Architecture & Advanced Topics

### Cross-Package Dependencies

When adding features, maintain the dependency hierarchy to avoid circular dependencies:

**Within SMRT framework:**

- `types`, `config` → No internal dependencies
- `core` → Depends on types, config, and external SDK packages
- Domain modules → Depend on core

**Cross-dependencies:**

- `assets` → depends on `tags`
- `events` → depends on `places`, `profiles`

### MCP Server Integration (3-Tier Architecture)

The SMRT framework provides three tiers of Model Context Protocol servers for AI integration:

**Tier 1: Auto-Generated Project MCP Servers**

- Runtime MCP servers generated from your SMRT objects
- Deploy alongside your application for AI-powered operations
- See [packages/core/CLAUDE.md](./packages/core/CLAUDE.md) for MCPGenerator API

**Tier 2: SMRT Advisor MCP** (`@happyvertical/smrt-dev-mcp`)

- Development-focused tools for code generation
- Tools: `generate-smrt-class`, `introspect-project`

**Tier 3: SMRT Documentation MCP** (`@happyvertical/smrt-docs-mcp`)

- Documentation and learning tools
- Tools: `search-docs`, `get-example`, `explain-concept`

**Example Development Flow:**

1. **Learn** (Tier 3): Query framework documentation
2. **Generate** (Tier 2): Create SMRT classes
3. **Develop**: Write business logic
4. **Deploy** (Tier 1): Generate project MCP server
5. **Operate** (Tier 1): AI interacts with live data

### TypeScript Project References

The framework uses TypeScript project references for proper type resolution across packages:

**Configuration requirements:**

- `composite: true` in tsconfig.json
- `outDir`, `rootDir`, and `tsBuildInfoFile` properly configured
- Entry in root tsconfig.json `references` array

### Performance Optimizations

**Registry Caching:**

- Class metadata cached on first access
- Field definitions analyzed once
- Collection instances use singleton pattern (60-80% faster)

**Query Optimization:**

- Eager loading with JOINs (40-70% improvement for relationship-heavy queries)
- Prepared statement reuse
- Result set streaming for large queries

**Build Caching:**

- Manifest generated once at build time
- Virtual modules cached by Vite
- Type declarations cached in `node_modules/.vite`

For detailed architecture documentation, see [packages/core/ARCHITECTURE.md](./packages/core/ARCHITECTURE.md).

---

## Database Migrations

SMRT includes a production-ready migration system for managing database schema changes with transaction wrapping, checksum-based idempotency, and drift detection.

### Migration Commands

```bash
# Check schema status - shows pending changes
smrt db:status
smrt db:status --verbose    # Show detailed column info
smrt db:status --json       # JSON output for CI

# Apply migrations with tracking
smrt db:migrate
smrt db:migrate --dry-run       # Preview without applying
smrt db:migrate --verbose       # Show SQL statements
smrt db:migrate --postgres-safe # Use CONCURRENTLY for indexes

# View migration history
smrt db:history
smrt db:history --limit 20    # Last 20 migrations
smrt db:history --json        # JSON output

# Generate migration files from schema changes
smrt db:diff
smrt db:diff --generate       # Create migration file
smrt db:diff --name add_users # Custom migration name
smrt db:diff --with-down      # Include rollback script

# Rollback migrations
smrt db:rollback
smrt db:rollback --steps 3    # Rollback last 3 migrations
smrt db:rollback --to 0005    # Rollback to specific version
smrt db:rollback --dry-run    # Preview rollback

# Create empty migration template
smrt db:generate add_user_roles
smrt db:generate add_user_roles --ts  # TypeScript format
```

### Migration Tracking

All migrations are tracked in the `_smrt_schema_migrations` table:

| Column              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `id`                | Unique identifier                               |
| `name`              | Migration name (e.g., `0001_initial_schema`)    |
| `checksum`          | SHA-256 of normalized SQL                       |
| `status`            | `pending`, `completed`, `failed`, `rolled_back` |
| `applied_at`        | When migration was applied                      |
| `execution_time_ms` | Execution duration                              |
| `is_reversible`     | Whether DOWN script exists                      |

### Migration File Formats

**SQL Format (Default):**

```sql
-- migrations/0001_add_users.sql
-- @id: 0001_add_users
-- @description: Add users table

-- @up
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);
CREATE INDEX idx_users_email ON users(email);

-- @down
DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users;
```

**TypeScript Format:**

```typescript
// migrations/0001_add_users.ts
import type { Migration } from '@happyvertical/smrt-core';

export default {
	id: '0001_add_users',
	description: 'Add users table',

	up: async (db) => {
		await db.query(`CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL)`);
		await db.query(`CREATE INDEX idx_users_email ON users(email)`);
	},

	down: async (db) => {
		await db.query(`DROP INDEX IF EXISTS idx_users_email`);
		await db.query(`DROP TABLE IF EXISTS users`);
	}
} satisfies Migration;
```

### Checksum-Based Idempotency

Migrations use SHA-256 checksums to ensure idempotency:

- **Same checksum**: Migration already applied, skip
- **Different checksum**: Error - migration file was modified after application
- **Checksums normalize**: Comments and whitespace differences are ignored

```typescript
// Normalized for checksum (comments removed, whitespace collapsed)
'CREATE TABLE users (id TEXT PRIMARY KEY);';
```

### PostgreSQL-Specific Handling

Use `--postgres-safe` for production PostgreSQL deployments:

```bash
smrt db:migrate --postgres-safe
```

This automatically:

- Uses `CREATE INDEX CONCURRENTLY` for non-blocking index creation
- Sets `lock_timeout` and `statement_timeout` for safer execution
- Handles CONCURRENTLY statements outside transactions (required by PostgreSQL)

### Configuration

Configure migrations in `smrt.config.js`:

```javascript
export default {
	packages: {
		cli: {
			database: {
				type: 'postgres',
				url: process.env.DATABASE_URL
			},
			migrations: {
				directory: './migrations',
				table: '_smrt_schema_migrations',
				format: 'sql', // 'sql' or 'typescript'
				naming: 'sequence', // 'sequence' (0001, 0002) or 'timestamp'
				autoGenerateDown: true,
				postgres: {
					useConcurrently: true,
					lockTimeout: '30s',
					statementTimeout: '60s'
				}
			}
		}
	}
};
```

### Programmatic API

Use the migration system programmatically:

```typescript
import {
	MigrationTracker,
	SchemaComparer,
	MigrationGenerator
} from '@happyvertical/smrt-core/migrations';
import { getDatabase } from '@happyvertical/sql';

// Initialize tracker
const db = await getDatabase({ type: 'sqlite', url: 'app.db' });
const tracker = new MigrationTracker({ db });
await tracker.initialize();

// Check pending migrations
const pending = await tracker.getPendingMigrations(migrationDir);

// Apply a migration
const result = await tracker.apply({
	id: '0001_initial',
	description: 'Initial schema',
	version: '1.0.0',
	up: ['CREATE TABLE users (id TEXT PRIMARY KEY);'],
	down: ['DROP TABLE users;']
});

if (result.success) {
	console.log(`Applied: ${result.name} in ${result.execution_time_ms}ms`);
}

// Compare manifest to database
const comparer = new SchemaComparer(db);
const diff = await comparer.compare(manifestSchemas);

if (diff.has_changes) {
	console.log(`New tables: ${diff.added_tables.length}`);
	console.log(`Changes: ${diff.changes.length}`);
}

// Generate migration file from diff
const generator = new MigrationGenerator({
	engine: 'sqlite',
	format: 'sql',
	includeDown: true
});

const migration = generator.generateFromDiff(diff, {
	name: '0002_add_profiles',
	description: 'Add profiles table'
});

console.log(migration.content);
```

### Best Practices

1. **Always use `--dry-run` first** in production
2. **Include DOWN scripts** for reversible migrations
3. **Use `--postgres-safe`** for PostgreSQL production deployments
4. **Don't modify applied migrations** - checksums will fail
5. **Use sequence naming** for team workflows (avoids merge conflicts)
6. **Commit migration files** to version control

---

## Issue Triage and Management

The SMRT repository uses automated AI-powered issue triage:

- **AI-Powered Triage**: Automatic analysis, labeling, and prioritization
- **Priority Levels**: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- **Issue Templates**: Structured bug reports and feature requests
- **Stale Management**: Automatic cleanup after 30+ days inactive

**Response Time Targets:**

- **P0-Critical**: < 1 hour (production outages, security issues)
- **P1-High**: < 4 hours (major functionality broken)
- **P2-Medium**: < 2 business days (non-blocking bugs)
- **P3-Low**: < 1 week (minor issues, enhancements)

See [.github/TRIAGE_SOP.md](.github/TRIAGE_SOP.md) for complete details.

---

## Release Management

The framework uses [Changesets](https://github.com/changesets/changesets) for automated versioning and publishing:

```bash
# Preview what will be released
pnpm run changeset:version  # Update package versions based on changesets

# Publish (handled automatically by CI on merge to main)
pnpm run changeset:publish  # Publish packages to registry
```

**Important**: Package releases are fully automated:

1. PRs generate changesets from conventional commits
2. Merging to main triggers the on-merge-main workflow
3. Workflow builds, versions, and publishes packages automatically
4. No manual `npm publish` needed

See [CHANGESETS.md](./CHANGESETS.md) for complete release workflow documentation.

---

## Dependency Management

The SMRT framework uses [Renovate CE](https://github.com/renovatebot/renovate) for automated dependency updates:

### How It Works

1. **Upstream Changes (SDK)**: When `@happyvertical/sdk` packages publish new versions, Renovate CE detects the update via GitHub webhooks
2. **PR Creation**: Renovate automatically creates a PR in SMRT with the updated dependencies
3. **Automerge**: Patch version updates are automatically merged after tests pass
4. **Downstream Propagation**: After SMRT publishes, Renovate detects the new version and creates PRs in downstream repos (praeco, caelus, etc.)

### Configuration

The Renovate configuration is defined in `renovate.json` and extends the shared config from [happyvertical/renovate-config](https://github.com/happyvertical/renovate-config):

```json
{
	"$schema": "https://docs.renovatebot.com/renovate-schema.json",
	"extends": ["local>happyvertical/renovate-config:smrt"]
}
```

### Expected Behavior

| Scenario                   | Renovate Action                            |
| -------------------------- | ------------------------------------------ |
| SDK patch release (0.x.Y)  | Auto-create PR, automerge after tests pass |
| SDK minor release (0.X.0)  | Create PR, requires manual review          |
| External dependency update | Grouped weekly PRs                         |
| Security vulnerability     | Immediate PR with priority label           |

### Dependency Flow

```
@happyvertical/sdk
        │
        ▼ (Renovate detects new version)
@happyvertical/smrt-* (this repo)
        │
        ▼ (Renovate detects new version)
praeco, caelus, create-gnode (downstream repos)
```

---

## Related Projects

- **[HAppyVertical SDK](https://github.com/happyvertical/sdk)**: Infrastructure packages that use SMRT
- **[create-gnode](https://github.com/happyvertical/create-gnode)**: CLI for creating federated local knowledge bases
- **[praeco](https://github.com/happyvertical/praeco)**: Local news agent built on SMRT

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contact

- **GitHub**: https://github.com/happyvertical/smrt
- **Issues**: https://github.com/happyvertical/smrt/issues
- **Discussions**: https://github.com/happyvertical/smrt/discussions

---

_This framework was split from the HAppyVertical SDK in October 2024 to create a focused, self-contained foundation for building vertical AI agents._

---

### Testing Guide

_Source: TESTING_STANDARD.md_

# SMRT Testing Standard

This document outlines testing standards and best practices for the SMRT framework.

## Philosophy

- **Use real resources over mocks**: Prefer in-memory databases and temp files over mock objects
- **Tests as documentation**: Tests should read like documentation and demonstrate usage patterns
- **BDD/TDD for bug fixes**: Write failing tests before fixing bugs
- **README parity**: All README code examples must have corresponding tests

## Running Tests

### ⚠️ CRITICAL: Always Use `smrt test`

**NEVER run `npx vitest` directly!** Always use `smrt test` or `npm test`:

```bash
# ✅ CORRECT - Generates test manifest first
smrt test
npm test           # Aliases to 'smrt test'

# ❌ WRONG - Will fail with "unregistered class" errors
npx vitest
npx vitest run
```

**Why?** Tests require a manifest file that maps SMRT objects for schema generation. The `smrt test` command:

1. Generates the test manifest from `@smrt()` decorated classes
2. Runs vitest with the manifest loaded

Without the manifest, tests fail with errors like:

```
Cannot generate schema for unregistered class 'Council'.
Ensure the class is decorated with @smrt() for schema generation to work.
```

### Watch Mode

```bash
npm run test:watch
```

### Individual Test Files

```bash
# Generate manifest first, then run specific test
smrt test --manifest-only
npx vitest run src/specific-test.test.ts
```

## Test File Structure

### Standard Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createIsolatedTestDb } from '@happyvertical/smrt-vitest';
import { MyObject, MyCollection } from './my-object.js';

describe('MyObject', () => {
	let collection: MyCollection;

	beforeEach(async () => {
		// Creates isolated in-memory SQLite database
		const db = await createIsolatedTestDb();
		collection = await MyCollection.create({
			persistence: { type: 'sql', db }
		});
	});

	describe('basic CRUD operations', () => {
		it('should create and save object', async () => {
			const obj = await collection.create({
				name: 'Test',
				value: 42
			});
			await obj.save();

			const loaded = await collection.get({ id: obj.id });
			expect(loaded?.name).toBe('Test');
			expect(loaded?.value).toBe(42);
		});

		it('should update object', async () => {
			const obj = await collection.create({ name: 'Initial' });
			await obj.save();

			obj.name = 'Updated';
			await obj.save();

			const loaded = await collection.get({ id: obj.id });
			expect(loaded?.name).toBe('Updated');
		});

		it('should delete object', async () => {
			const obj = await collection.create({ name: 'Delete Me' });
			await obj.save();

			await obj.delete();

			const loaded = await collection.get({ id: obj.id });
			expect(loaded).toBeUndefined();
		});
	});

	describe('querying', () => {
		it('should filter by field', async () => {
			await collection.create({ name: 'Active', status: 'active' }).then((o) => o.save());
			await collection.create({ name: 'Inactive', status: 'inactive' }).then((o) => o.save());

			const active = await collection.list({ where: { status: 'active' } });
			expect(active).toHaveLength(1);
			expect(active[0].name).toBe('Active');
		});

		it('should support comparison operators', async () => {
			await collection.create({ price: 50 }).then((o) => o.save());
			await collection.create({ price: 150 }).then((o) => o.save());
			await collection.create({ price: 250 }).then((o) => o.save());

			const expensive = await collection.list({ where: { 'price >': 100 } });
			expect(expensive).toHaveLength(2);
		});

		it('should support IN operator', async () => {
			await collection.create({ category: 'A' }).then((o) => o.save());
			await collection.create({ category: 'B' }).then((o) => o.save());
			await collection.create({ category: 'C' }).then((o) => o.save());

			const selected = await collection.list({
				where: { category: ['A', 'B'] }
			});
			expect(selected).toHaveLength(2);
		});
	});
});
```

## Isolated Test Databases

### Using `createIsolatedTestDb()`

The `@happyvertical/smrt-vitest` package provides `createIsolatedTestDb()` for creating isolated in-memory SQLite databases:

```typescript
import { createIsolatedTestDb } from '@happyvertical/smrt-vitest';

beforeEach(async () => {
	const db = await createIsolatedTestDb();
	collection = await MyCollection.create({
		persistence: { type: 'sql', db }
	});
});
```

**Benefits**:

- **Isolation**: Each test suite gets its own database
- **Speed**: In-memory databases are fast
- **Cleanup**: Automatically cleaned up after tests
- **No mocking**: Use real database operations

### Alternative: Temp Files

For testing file operations or when you need a file-based database:

```typescript
import { describe, it, beforeEach, afterEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rmSync } from 'node:fs';

describe('File-based tests', () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), 'smrt-test-'));
	});

	afterEach(() => {
		rmSync(tempDir, { recursive: true, force: true });
	});

	it('should work with temp files', async () => {
		const dbPath = join(tempDir, 'test.db');
		const collection = await MyCollection.create({
			persistence: { type: 'sql', url: dbPath }
		});
		// Test operations...
	});
});
```

## Testing Relationships

### Foreign Keys

```typescript
describe('relationships', () => {
	let authorCollection: AuthorCollection;
	let bookCollection: BookCollection;

	beforeEach(async () => {
		const db = await createIsolatedTestDb();
		authorCollection = await AuthorCollection.create({
			persistence: { type: 'sql', db }
		});
		bookCollection = await BookCollection.create({
			persistence: { type: 'sql', db }
		});
	});

	it('should load related objects', async () => {
		const author = await authorCollection.create({ name: 'Author' });
		await author.save();

		const book = await bookCollection.create({
			title: 'Book',
			authorId: author.id
		});
		await book.save();

		await book.loadRelated('authorId');
		const loadedAuthor = book.getRelated('authorId');
		expect(loadedAuthor?.name).toBe('Author');
	});

	it('should support eager loading', async () => {
		const author = await authorCollection.create({ name: 'Author' });
		await author.save();

		await bookCollection.create({ title: 'Book 1', authorId: author.id }).then((b) => b.save());
		await bookCollection.create({ title: 'Book 2', authorId: author.id }).then((b) => b.save());

		const books = await bookCollection.list({
			include: ['authorId']
		});

		expect(books).toHaveLength(2);
		for (const book of books) {
			const author = book.getRelated('authorId');
			expect(author).toBeDefined();
			expect(author?.name).toBe('Author');
		}
	});
});
```

## Testing STI (Single Table Inheritance)

```typescript
describe('STI polymorphism', () => {
	let eventCollection: EventCollection;

	beforeEach(async () => {
		const db = await createIsolatedTestDb();
		eventCollection = await EventCollection.create({
			persistence: { type: 'sql', db }
		});
	});

	it('should save and load correct subclass', async () => {
		const meeting = await eventCollection.create({
			_meta_type: '@my-package:Meeting',
			title: 'Team Standup',
			location: 'Room A'
		});
		await meeting.save();

		const loaded = await eventCollection.get({ id: meeting.id });
		expect(loaded).toBeInstanceOf(Meeting);
		expect(loaded?.title).toBe('Team Standup');
		expect(loaded?.location).toBe('Room A');
	});

	it('should filter by _meta_type', async () => {
		await eventCollection
			.create({
				_meta_type: '@my-package:Meeting',
				title: 'Meeting 1'
			})
			.then((e) => e.save());

		await eventCollection
			.create({
				_meta_type: '@my-package:Conference',
				title: 'Conference 1'
			})
			.then((e) => e.save());

		const meetings = await eventCollection.list({
			where: { _meta_type: '@my-package:Meeting' }
		});

		expect(meetings).toHaveLength(1);
		expect(meetings[0]).toBeInstanceOf(Meeting);
	});
});
```

## Testing AI-Powered Methods

When testing AI-powered methods (`is()`, `do()`), use test mode to avoid API calls:

```typescript
describe('AI operations', () => {
	it('should validate with is()', async () => {
		const doc = await collection.create({
			title: 'Test Doc',
			content: 'This is a test document with enough words to be quality content.'
		});

		// In tests, you may want to mock AI responses
		// Or use a test AI provider that returns deterministic results
		const isQuality = await doc.is('This document is high quality');
		expect(typeof isQuality).toBe('boolean');
	});

	it('should transform with do()', async () => {
		const doc = await collection.create({
			title: 'Test',
			content: 'Test content'
		});

		const summary = await doc.do('Create a summary');
		expect(typeof summary).toBe('string');
	});
});
```

**Note**: Consider adding a test mode flag or mock AI provider to avoid making real API calls during tests.

## Testing Error Conditions

```typescript
describe('error handling', () => {
	it('should throw on invalid data', async () => {
		await expect(async () => {
			await collection.create({ invalid: 'field' });
		}).rejects.toThrow();
	});

	it('should validate required fields', async () => {
		await expect(async () => {
			const obj = await collection.create({});
			await obj.save();
		}).rejects.toThrow();
	});

	it('should handle duplicate IDs', async () => {
		const obj1 = await collection.create({ id: 'duplicate' });
		await obj1.save();

		await expect(async () => {
			const obj2 = await collection.create({ id: 'duplicate' });
			await obj2.save();
		}).rejects.toThrow();
	});
});
```

## Testing Code Generation

### Testing CLI Commands

```typescript
import { describe, it, expect } from 'vitest';
import { CLIGenerator } from '@happyvertical/smrt-core/codegen';

describe('CLI generation', () => {
	it('should generate list command', () => {
		const generator = new CLIGenerator({
			className: 'Product',
			packageName: '@test/package'
		});

		const code = generator.generateCommand('list');
		expect(code).toContain('list');
		expect(code).toContain('Product');
	});
});
```

### Testing API Generation

```typescript
describe('API generation', () => {
	it('should generate REST endpoint', () => {
		const generator = new APIGenerator({
			className: 'Product',
			packageName: '@test/package'
		});

		const code = generator.generateEndpoint('list');
		expect(code).toContain('GET');
		expect(code).toContain('/products');
	});
});
```

## BDD/TDD for Bug Fixes

When fixing a bug, follow Test-Driven Development:

1. **Write a failing test** that reproduces the bug
2. **Run the test** to confirm it fails
3. **Fix the bug** in the implementation
4. **Run the test** to confirm it passes
5. **Refactor** if needed, keeping tests passing

**Example**:

```typescript
describe('Bug #123: WHERE clause with null', () => {
	it('should handle null equality checks', async () => {
		// Reproduce the bug with a test
		await collection.create({ name: 'Active', deleted_at: null }).then((o) => o.save());
		await collection.create({ name: 'Deleted', deleted_at: new Date() }).then((o) => o.save());

		const active = await collection.list({
			where: { deleted_at: null }
		});

		expect(active).toHaveLength(1);
		expect(active[0].name).toBe('Active');
	});
});
```

## README Example Parity

**Every code example in a README must have a corresponding test.**

This ensures:

- Examples are always accurate
- Breaking changes are caught
- Documentation stays in sync with code

**Template**:

```typescript
describe('README examples', () => {
	it('should match Quick Start example', async () => {
		// Copy-paste README example here and add assertions
		const collection = await MyCollection.create({
			persistence: { type: 'sql', url: ':memory:' }
		});

		const obj = await collection.create({ name: 'Test' });
		await obj.save();

		expect(obj.name).toBe('Test');
		expect(obj.id).toBeDefined();
	});
});
```

## Coverage Requirements

- **Minimum coverage**: 80% line coverage
- **Critical paths**: 100% coverage for core ORM operations
- **Error paths**: Test both success and failure cases
- **Edge cases**: Empty inputs, null values, boundary conditions

## Running Coverage Reports

```bash
npm run test:coverage
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [SMRT Testing Philosophy](./CLAUDE.md#testing-requirements)
- [packages/core/CLAUDE.md](./packages/core/CLAUDE.md) - Framework internals
- [WORKFLOW.md](./WORKFLOW.md) - Development workflows

---

### Contributing

_Source: CONTRIBUTING.md_

# Contributing to SMRT Framework

Thank you for your interest in contributing to the SMRT Framework! This document provides high-level guidelines for contributing. For detailed step-by-step workflows, see [WORKFLOW.md](./WORKFLOW.md).

## Quick Links

- **Detailed Workflows**: [WORKFLOW.md](./WORKFLOW.md) - Step-by-step SOPs for development
- **Testing Standards**: [TESTING_STANDARD.md](../TESTING_STANDARD.md) - Organization-wide testing requirements
- **Architecture**: [CLAUDE.md](./CLAUDE.md) - Framework overview and patterns
- **Core Documentation**: [packages/core/CLAUDE.md](./packages/core/CLAUDE.md) - Detailed technical reference

## Getting Started

### Prerequisites

- **Node.js**: 24+ required
- **pnpm**: 9.0+ required
- **Git**: For version control
- **GitHub CLI**: `gh` for PR management

### Installation

```bash
# Clone the repository
git clone https://github.com/happyvertical/smrt.git
cd smrt

# Install dependencies
pnpm install

# Build all packages
npm run build

# Run tests
npm test
```

## How to Contribute

### 1. Find or Create an Issue

- Browse [existing issues](https://github.com/happyvertical/smrt/issues)
- Check if your contribution addresses an existing issue
- If not, [create a new issue](https://github.com/happyvertical/smrt/issues/new) describing your proposal

### 2. Follow the Development Workflow

See [WORKFLOW.md](./WORKFLOW.md) for detailed SOPs:

- **Starting Work**: Pre-work checklist, git setup, branch creation, planning
- **Creating PRs**: Quality checks, commit squashing, PR description

**Quick Summary**:

1. Create feature branch: `{type}/issue-{number}-{short-description}`
2. Implement changes following coding standards
3. Write tests following [TESTING_STANDARD.md](../TESTING_STANDARD.md)
4. Run quality checks: `npm run lint && npm test`
5. Create PR with conventional commit message

### 3. Code Review

All contributions go through code review:

- Maintainers review PRs for quality, tests, and documentation
- Address feedback promptly
- Keep PRs focused and reasonably sized

## Code Standards

### Code Style

- **Format**: Biome for linting and formatting
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings
- **Line Width**: 80 characters maximum
- **Modules**: ESM only, no CommonJS

**Auto-format**:

```bash
npm run format       # Format all files
npm run lint --fix   # Auto-fix linting issues
```

### TypeScript

- Strict type checking enabled
- No `any` types without justification
- Full type coverage for public APIs
- Use TypeScript project references for cross-package types

### Testing Requirements

All code changes must include tests. See [TESTING_STANDARD.md](../TESTING_STANDARD.md) for complete requirements.

**Key Principles**:

- Use real resources (in-memory DBs, temp files) over mocks
- Tests should read like documentation
- Follow BDD/TDD for bug fixes
- README examples must have corresponding tests

**Test Types**:

- **Unit tests** (`*.test.ts`): Fast, isolated component tests
- **Integration tests** (`*.spec.ts`): Real resource integration
- **Example tests** (`*.examples.test.ts`): Demonstrate common patterns
- **Optional tests** (`*.optional.test.ts`): Expensive or external API tests

### SMRT-Specific Patterns

**TypeScript-First Approach**:

```typescript
// ✅ PREFERRED: Use TypeScript types for most properties
class Product extends SmrtObject {
	name: string = '';
	price: number = 0.0; // DECIMAL (has decimal point)
	quantity: number = 0; // INTEGER (no decimal point)

	// Field helpers only when needed
	categoryId = foreignKey(Category);
	sku = text({ required: true, unique: true });
}
```

**The 0 vs 0.0 Heuristic**:

- `number = 0` → INTEGER column (no decimal point)
- `number = 0.0` → DECIMAL column (has decimal point)

See [packages/core/CLAUDE.md](./packages/core/CLAUDE.md#typescript-types-vs-field-helpers) for complete guidance.

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features or APIs
- Change existing behavior
- Fix bugs that aren't obvious
- Add examples or patterns

### Documentation Files

- **CLAUDE.md files**: For AI assistants and contributors
- **README.md files**: User-facing API documentation
- **Code comments**: For complex logic or non-obvious decisions

### Documentation Style

- Clear, concise language
- Code examples for all APIs
- Link to related documentation
- Keep examples up-to-date

## Git Workflow

### Branch Naming

```
feat/issue-XXX-short-description      # New features
fix/issue-XXX-short-description       # Bug fixes
docs/issue-XXX-short-description      # Documentation
refactor/issue-XXX-short-description  # Refactoring
test/issue-XXX-short-description      # Tests
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

Closes #<issue-number>
```

**Examples**:

```
feat(core): add TypeScript-first pattern support
fix(agents): resolve memory leak in agent pool
docs(readme): update installation instructions
```

### Pull Requests

- One PR per issue/feature
- Squash commits before merging
- Include issue reference in commit
- Fill out PR template completely

See [WORKFLOW.md](./WORKFLOW.md#sop-creating-a-pull-request) for detailed PR creation process.

## Review Process

### What We Look For

✅ **Code Quality**:

- Follows TypeScript and ESM standards
- Proper error handling
- No security vulnerabilities

✅ **Testing**:

- All tests pass
- New code has test coverage
- Tests follow TESTING_STANDARD.md
- README examples have tests

✅ **Documentation**:

- API changes documented
- Examples provided
- CLAUDE.md updated if needed

✅ **Process**:

- Conventional commit message
- Issue referenced
- No unrelated changes

### Response Time Targets

- **P0-Critical**: < 1 hour
- **P1-High**: < 4 hours
- **P2-Medium**: < 2 business days
- **P3-Low**: < 1 week

## Common Contribution Scenarios

### Adding a New Feature

1. Create issue describing the feature
2. Get feedback from maintainers
3. Follow [WORKFLOW.md](./WORKFLOW.md) for implementation
4. Include tests and documentation
5. Create PR

### Fixing a Bug

1. Create issue with reproduction steps
2. Write failing test that reproduces bug (BDD/TDD)
3. Implement fix to make test pass
4. Verify fix doesn't break existing tests
5. Create PR

### Improving Documentation

1. Identify documentation gap or error
2. Create issue (optional for minor fixes)
3. Update relevant documentation files
4. Ensure examples are accurate
5. Create PR

### Adding Tests

1. Identify untested code
2. Write tests following TESTING_STANDARD.md
3. Ensure tests pass
4. Create PR

## Getting Help

- **Questions**: [GitHub Discussions](https://github.com/happyvertical/smrt/discussions)
- **Bugs**: [GitHub Issues](https://github.com/happyvertical/smrt/issues)
- **Documentation**: [CLAUDE.md](./CLAUDE.md) and [packages/core/CLAUDE.md](./packages/core/CLAUDE.md)
- **Workflow**: [WORKFLOW.md](./WORKFLOW.md)

## Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Welcome newcomers and help them learn
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SMRT! Your efforts help make this framework better for everyone. 🎉

---

### Development Workflow

_Source: WORKFLOW.md_

# SMRT Framework: Development Workflow Guide

This document contains the standard operating procedures (SOPs) for development workflows in the SMRT framework. These workflows are designed for Claude Code integration and ensure consistent, high-quality contributions.

## Table of Contents

- [Pre-Work Checklist](#pre-work-checklist)
- [SOP: Starting Work on an Issue](#sop-starting-work-on-an-issue)
- [SOP: Creating a Pull Request](#sop-creating-a-pull-request)
- [Git Branching Strategy](#git-branching-strategy)

---

## ⚠️ Pre-Work Checklist (READ FIRST)

**BEFORE MAKING ANY CHANGES, VERIFY:**

- [ ] **Am I on main branch?** → If YES, **STOP!** Create a feature branch first
- [ ] **Do I have an issue number?** → If NO, create one or work without (for minor changes)
- [ ] **Am I on a feature branch?** → If NO, create one following the naming convention below

**⚠️ NEVER PUSH DIRECTLY TO MAIN** - Always use feature branches and pull requests.

**Feature branch naming**: `{type}/issue-{number}-{short-description}`

- Examples: `feat/issue-123-new-feature`, `fix/issue-45-bug-fix`, `docs/issue-89-update-readme`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## SOP: Starting Work on an Issue

**IMPORTANT**: This SOP should be followed automatically whenever beginning implementation work, whether explicitly asked or implied.

**Related Standards**:

- [Organization-Wide Testing Standard](../TESTING_STANDARD.md) - Must be followed for all test writing
- [Definition of Ready](https://github.com/happyvertical/sdk/blob/main/docs/workflow/DEFINITION_OF_READY.md) - Issue readiness criteria
- [Definition of Done](https://github.com/happyvertical/sdk/blob/main/docs/workflow/DEFINITION_OF_DONE.md) - PR completion checklist

### When This SOP Triggers

This procedure triggers in these scenarios:

- User mentions implementing/working on an issue (e.g., "let's work on #270")
- User asks to start implementing a feature/fix
- Beginning any implementation work (even without explicit issue number)
- Returning to work after interruption

### Step 1: Verify Git State

Before any work begins, ensure a clean git state:

```bash
# Check current status
git status

# If there are uncommitted changes: STOP
# DO NOT PROCEED - inform user they must commit or stash changes first
```

**If uncommitted changes exist**:

- Stop the SOP immediately
- Inform the user: "You have uncommitted changes. Please commit or stash them before starting new work."
- Do not attempt to stash or commit automatically
- Wait for user to resolve

**If clean working tree**:

- Proceed to Step 2

### Step 2: Sync with Main Branch

Ensure local main is up-to-date:

```bash
# If not on main, checkout main
git checkout main

# Pull latest changes
git pull origin main
```

**If already on a feature branch**:

- First verify working tree is clean (Step 1)
- Then checkout main and sync
- Claude will create/checkout the correct feature branch in Step 4

### Step 3: Identify Issue(s) and Context

**Interactive Mode** (default):

- If no issue number mentioned, use wizard to ask which issue(s) to work on
- If user mentions issue(s), fetch issue details using `gh issue view #XXX`
- Read the issue description, labels, and comments for context

**Non-Interactive/CI Mode**:

- Issue number must be provided as input
- If missing, exit with error: "Issue number required for non-interactive mode"
- Fetch issue details using `gh issue view #XXX`

**Multiple Issues**:

- If working on multiple related issues, note all issue numbers
- Branch will be named: `{type}/issue-XXX-YYY-short-desc`
- PR will use: `Closes #XXX, Fixes #YYY` syntax

### Step 4: Create or Checkout Feature Branch

**Branch Naming Convention**:

```
{type}/issue-{numbers}-{short-description}

Examples:
feat/issue-270-testing-standard
fix/issue-123-database-connection
docs/issue-45-api-guide
refactor/issue-89-cleanup-cache
test/issue-67-integration-tests
feat/issue-270-271-combined-work  # Multiple issues
```

**Determining Branch Type**:

- Read issue labels and title to infer type (feat/fix/docs/refactor/test)
- Default to `feat` if unclear

**Branch Creation**:

```bash
# Check if branch already exists remotely
git fetch origin

# If branch exists, check it out
git checkout {type}/issue-XXX-short-desc

# If branch does not exist, create it
git checkout -b {type}/issue-XXX-short-desc

# If branch exists remotely but not locally
git checkout -b {type}/issue-XXX-short-desc origin/{type}/issue-XXX-short-desc
```

**Context Awareness**:

- If branch already exists: Assume continuing previous work
- Check last commit message to understand current state
- Review existing changes since branching from main

### Step 5: Planning Phase (Interactive Mode Only)

**IMPORTANT**: Use the AskUserQuestion wizard for ALL clarifying questions.

**Standard Questions to Ask** (use wizard):

1. **Implementation Approach**
   - Technical approach (architecture, design patterns)
   - Library/tool choices
   - Integration points

2. **Scope Clarification**
   - What's in scope vs. out of scope
   - Priority of sub-tasks
   - Must-haves vs. nice-to-haves

3. **SMRT-Specific Questions**:
   - **Agent Work**: Which agents affected? Impact on agent orchestration? Breaking changes to Agent interface?
   - **Smart Object Work**: Which smart objects affected? Decorator testing approach? Database schema changes?
   - **Code Generation Work**: What will be generated (API/CLI/MCP)? How to test generator vs generated code? Template changes needed?
   - **Framework Integration**: Integration with existing patterns? Backward compatibility concerns? Documentation updates?

4. **Test Strategy** (Always Ask):
   - What test types are needed? (unit/integration/examples/optional)
   - Should tests use real resources or mocks? (default: real resources per TESTING_STANDARD.md)
   - For agent creation: Test with real Agent instances, not mocks
   - For smart objects: Test with real database operations, mock AI providers only
   - For code generation: Test the generator code, verify generated code compiles/runs
   - Are README examples affected? (if yes, must add corresponding tests)
   - Is this fixing a bug? (if yes, write failing test first per BDD/TDD workflow)

**Wizard Question Format**:

```typescript
// Use AskUserQuestion with 1-4 questions
// Focus on decisions that can't be standardized
// Avoid asking questions with obvious answers from issue context
```

**Recording Planning Decisions**:
After wizard responses, post a comment to the issue:

```bash
gh issue comment {issue-number} --body "$(cat <<'EOF'
## Planning Notes

### Implementation Approach
[Summary of technical approach decided]

### Scope
- In scope: [list]
- Out of scope: [list]

### Key Decisions
1. [Decision 1 and rationale]
2. [Decision 2 and rationale]

### Test Strategy
Following [Organization-Wide Testing Standard](../TESTING_STANDARD.md):

**Test Types**:
- [ ] Unit tests (`*.test.ts`) - [if needed, describe what]
- [ ] Integration tests (`*.spec.ts`) - [describe real resources to use]
- [ ] Example tests (`*.examples.test.ts`) - [if demonstrating common patterns]
- [ ] Optional tests (`*.optional.test.ts`) - [if using external APIs/expensive resources]

**SMRT-Specific Testing**:
- Agent creation: [Testing with real instances or mock AI?]
- Smart objects: [Testing with real DB, mock AI providers?]
- Code generation: [Testing generator vs generated code?]

**Testing Approach**:
- Using real resources: [SQLite in-memory / temp directories / test server / Docker]
- Mocking only: [list exceptions with justification]
- README examples: [list examples that need corresponding tests]
- BDD/TDD: [if bug fix, describe failing test to write first]

**Test Verification**:
- [ ] Tests document behavior (not implementation)
- [ ] Tests read like executable examples
- [ ] README examples have corresponding tests
- [ ] Following package-specific guidelines (if applicable)

EOF
)"
```

### Step 6: Create Task List (If Applicable)

For complex issues with multiple steps, use TodoWrite to create task list:

```typescript
// Use TodoWrite tool
// Break down work into specific, actionable items
// Use both content (imperative) and activeForm (present continuous)
```

**When to use TodoWrite**:

- Issue has 3+ distinct steps
- Multi-package changes required
- Complex workflow with dependencies

**When to skip TodoWrite**:

- Single straightforward change
- Trivial update
- Simple bug fix

### Step 7: Begin Implementation

**Implementation Order** (following Testing Standard):

For **bug fixes**:

1. Write failing test that reproduces the issue (BDD/TDD approach)
2. Implement fix to make test pass
3. Verify test passes and provides regression protection

For **new features**:

1. Write tests from user stories (integration tests with real resources)
2. Implement feature to make tests pass
3. Add example tests for common usage patterns
4. Update README with examples (and corresponding tests)

For **SMRT-specific work**:

- **Agent features**: Test with real Agent instances, mock only external AI API calls
- **Smart objects**: Test with real database operations (in-memory SQLite), mock AI providers
- **Code generation**: Test the generator logic, verify generated code compiles and runs
- **Framework integration**: Test with real instances, avoid excessive mocking

For **all work**:

- Follow the plan established in Step 5
- Update TodoWrite task list as you progress
- Mark tasks as in_progress → completed as you work
- Follow standard coding conventions from CLAUDE.md
- Follow testing standards from TESTING_STANDARD.md:
  - Use real resources (in-memory DBs, temp files) over mocks
  - Write tests that read like documentation
  - Ensure README examples have corresponding tests
  - Test behavior, not implementation

### Exception Handling

**Merge Conflicts on Main Sync**:

- Stop SOP, inform user
- Ask user to resolve conflicts before continuing

**Branch Already Exists with Different Type**:

- Example: `fix/issue-270-X` exists but labels indicate `feat`
- Use existing branch (don't rename)
- Note the discrepancy for user

**Issue Not Found**:

- If `gh issue view` fails, stop SOP
- Inform user the issue doesn't exist or isn't accessible
- Ask user to verify issue number

**Multiple Remote Branches for Same Issue**:

- List branches and ask user which to use
- Use wizard to present options

---

## SOP: Creating a Pull Request

**IMPORTANT**: This SOP should be followed automatically when work is complete, before pushing changes.

**Related Standards**:

- [Organization-Wide Testing Standard](../TESTING_STANDARD.md) - Enforced by code reviewer
- [Definition of Done](https://github.com/happyvertical/sdk/blob/main/docs/workflow/DEFINITION_OF_DONE.md) - Verified before PR creation
- [Code Reviewer Agent](./.claude/agents/code-reviewer.md) - Automated review process

### When This SOP Triggers

This procedure triggers when:

- User indicates work is complete ("ready", "done", "create PR", etc.)
- User says "push" or "ready for review"
- Work appears complete based on context

**DO NOT trigger** when:

- Work is still in progress
- Tests are failing
- User is experimenting or exploring

### Step 1: Verify Work Completion

Before starting PR process, confirm:

```bash
# Check current branch
git branch --show-current

# Verify on feature branch (not main)
# If on main: Stop, inform user they need to be on a feature branch
```

**If not on feature branch**:

- Stop SOP immediately
- Inform user: "You're on main branch. Create a feature branch first."
- Reference "Start Work on Issue" SOP

**If on feature branch**:

- Proceed to Step 2

### Step 2: Run Quality Checks

Run all quality checks in sequence:

```bash
# 1. Lint
npm run lint

# 2. Format
npm run format

# 3. Type check
npm run typecheck || npm run build

# 4. Tests
npm test
```

**Track results**:

- Note which checks passed/failed
- Capture error messages for failed checks

### Step 3: Auto-Fix Issues (If Any)

**If lint or format failures**:

```bash
# Attempt auto-fix
npm run lint --fix
npm run format --fix

# Re-run checks
npm run lint
npm run format
```

**If auto-fix succeeds**:

- Continue to next check
- Note auto-fixes applied

**If auto-fix fails**:

- Stop SOP
- Show errors to user
- Message: "Please fix lint/format errors manually and try again"
- Exit

**If typecheck or tests fail**:

- Stop SOP immediately (cannot auto-fix)
- Show errors to user
- Message: "Fix TypeScript errors / failing tests before creating PR"
- Exit

**If all checks pass**:

- Proceed to Step 4

### Step 4: Run Code Review Agent (Optional)

**NOTE**: The code review agent from issue #39 is optional and may not be implemented yet. This step can be skipped if the agent is not available.

If code-reviewer agent exists, invoke it to verify quality standards:

```bash
# Invoke code-reviewer agent (via Task tool or direct delegation)
# See .claude/agents/code-reviewer.md for details
```

**Code Reviewer Checks** (when available):

1. Testing standards (TESTING_STANDARD.md)
2. Coding standards (CLAUDE.md)
3. Definition of Done
4. Gemini code review (non-trivial files only, via Gemini MCP)

**If blocking issues found**:

- Stop SOP
- Show code review report to user
- Message: "Code review found {N} blocking issues. Please fix and try again."
- Exit

**If code reviewer not available**:

- Skip this step and proceed to Step 5
- Manual review will happen during PR review process

### Step 5: Squash Commits

Combine all commits on the feature branch into a single commit:

```bash
# Get first commit on branch
FIRST_COMMIT=$(git merge-base main HEAD)

# Count commits to squash
COMMIT_COUNT=$(git rev-list --count ${FIRST_COMMIT}..HEAD)

# If more than 1 commit, squash using reset + commit approach
if [ $COMMIT_COUNT -gt 1 ]; then
  git reset --soft ${FIRST_COMMIT}
  git commit -m "$(generate_commit_message)"
fi
```

**Commit Message Format** (Conventional Commits):

```
{type}({scope}): {description}

{body}

Closes #{issue-number}
```

**Examples**:

```
feat(agents): add retry mechanism for failed operations

- Implement exponential backoff retry strategy
- Add configurable retry limits and delays
- Add integration tests with real Agent instances
- Add example tests for common retry patterns
- Update README with retry configuration examples

Closes #123

fix(core): handle null values in smart object upsert

Fixes issue where null values were being converted to undefined,
causing database constraint violations in DuckDB.

- Add null value handling in upsert method
- Add regression test reproducing the issue
- Verified fix with SQLite, Postgres, and DuckDB

Closes #45
```

**Generate commit message**:

- Use `{type}` from branch name (feat/fix/docs/refactor/test)
- Use `{scope}` from package name or area changed (agents, core, assets, etc.)
- Use `{description}` from issue title or summary
- Include `{body}` with bullet list of changes
- Include `Closes #{issue-number}` from issue

### Step 6: Create PR Body

Generate comprehensive PR description using this template:

```markdown
## Summary

{Summary of what was implemented, referencing planning notes from issue}

## Changes

{Bullet list of key changes:}

- {Feature/fix/refactor implemented}
- {Files modified or added}
- {Integration points}

## Testing

Following [Organization-Wide Testing Standard](../TESTING_STANDARD.md):

**Test Types Added**:

- [x] Unit tests (`*.test.ts`) - {describe what}
- [x] Integration tests (`*.spec.ts`) - {describe what}
- [x] Example tests (`*.examples.test.ts`) - {if applicable}
- [ ] Optional tests (`*.optional.test.ts`) - {if applicable}

**SMRT-Specific Testing**:

- Agent testing: {Real instances, mock AI providers, etc.}
- Smart object testing: {Real DB operations, mock AI, etc.}
- Code generation testing: {Generator tests, verification of generated code}

**Testing Approach**:

- Used real resources: {SQLite in-memory / temp directories / test server / etc.}
- Mocked only: {list exceptions with justification, or "None"}
- README examples: {list examples with corresponding tests, or "No examples affected"}
- BDD/TDD: {if bug fix, note regression test added}

**Test Results**:
```

✅ All tests pass (X passing)
✅ New tests: Y added
✅ Coverage: Z% of changed code

```

## Code Review

**Standards Verified**:
- ✅ Testing standards (TESTING_STANDARD.md)
- ✅ Coding standards (CLAUDE.md)
- ✅ Definition of Done

{If code reviewer agent was used, include its output here}

## Checklist

- [x] Tests pass
- [x] Code linted
- [x] Code formatted
- [x] TypeScript compiles
- [x] Documentation updated (if applicable)
- [x] Conventional commit message
- [x] Issue reference included

Closes #{issue-number}
```

**Variables to fill**:

- `{Summary}`: From issue planning notes or commit body
- `{Changes}`: Extract from git diff and commit message
- `{Test Types}`: Check which test files were added
- `{Testing Approach}`: Analyze test files for resource usage
- `{issue-number}`: From branch name or commits

### Step 7: Push and Create PR

Push the branch and create the pull request:

```bash
# Push branch to remote
git push origin $(git branch --show-current)

# Create PR with gh CLI
gh pr create \
  --title "$(git log -1 --pretty=%s)" \
  --body "$(cat <<'EOF'
{PR body from Step 6}
EOF
)"
```

**PR Title**: Use the commit subject line (first line of squashed commit)

**PR Labels** (auto-apply based on type):

- `feat/*` → label: `enhancement`
- `fix/*` → label: `bug`
- `docs/*` → label: `documentation`
- `refactor/*` → label: `refactoring`
- `test/*` → label: `testing`

### Step 8: Return to Main Branch

After PR created, return to main branch:

```bash
# Checkout main
git checkout main

# Pull latest (in case main was updated)
git pull origin main

# Inform user
echo "✅ PR created: {PR URL}"
echo "✅ Returned to main branch"
echo "You can continue with other work or wait for review feedback"
```

**Leave feature branch**:

- Feature branch remains on remote for review
- User can return to it if review feedback requires changes
- Branch will be deleted automatically after PR merge (GitHub setting)

### Exception Handling

**Not on Feature Branch**:

- Stop immediately
- Message: "You're on {branch}. Please create a feature branch first."
- Reference "Start Work on Issue" SOP

**Quality Checks Fail (Non-Auto-Fixable)**:

- Stop immediately
- Show errors clearly
- Message: "Fix {lint/typecheck/tests} errors and try again"
- Do not create PR

**Code Review Finds Blocking Issues**:

- Stop immediately
- Show code review report
- List each blocking issue with file:line
- Message: "Fix {N} blocking issues and run review again"

---

## Git Branching Strategy

**IMPORTANT**: Never push directly to `main`. Always use feature branches and pull requests.

### Branch Naming Convention

```
feat/issue-XXX-short-description      # New features
fix/issue-XXX-short-description       # Bug fixes
docs/issue-XXX-short-description      # Documentation updates
refactor/issue-XXX-short-description  # Code refactoring
test/issue-XXX-short-description      # Test additions/updates
```

### Conventional Commits

All commits must follow the Conventional Commits specification:

**Format**: `<type>(<scope>): <subject>`

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring (neither fixes bug nor adds feature)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Revert a previous commit

**Scope**: Package name or affected area (e.g., `core`, `agents`, `assets`)

**Examples**:

```
feat(core): add TypeScript-first pattern support
fix(agents): resolve memory leak in agent pool
docs(readme): update installation instructions
refactor(core): simplify database adapter interface
test(core): add integration tests for eager loading
```

For more info: https://www.conventionalcommits.org/

---

This workflow guide is optimized for Claude Code integration and ensures consistent, high-quality contributions to the SMRT framework. For high-level contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Package Documentation

## Installed Packages

| Package                    | Version |
| -------------------------- | ------- |
| @happyvertical/smrt-agents | 0.19.46 |
| @happyvertical/smrt-config | 0.19.46 |
| @happyvertical/smrt-core   | 0.19.46 |
| @happyvertical/smrt-types  | 0.19.46 |

---

## @happyvertical/smrt-agents

Agent framework for building autonomous actors with lifecycle management, status tracking, and graceful shutdown.

### Features

- **Lifecycle Management**: Initialize, validate, run, and shutdown hooks with automatic orchestration
- **Status Tracking**: Built-in status management (idle, initializing, running, error, shutdown)
- **Database Persistence**: All agent state automatically persisted via SmrtObject inheritance
- **Structured Logging**: Integrated logger with contextual information via `@have/logger`
- **Graceful Shutdown**: Automatic signal handling (SIGTERM, SIGINT) for clean termination
- **Configuration Management**: Abstract config property for agent-specific settings
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Status-aware error tracking with structured logging

### Patterns

#### Agent lifecycle

Agents have managed lifecycle with init, validate, run, and shutdown hooks.

```typescript
import { Agent } from '@happyvertical/smrt-agents';

class MyAgent extends Agent {
	async onInitialize() {
		// Setup resources
	}

	async onValidate(): Promise<boolean> {
		// Return true if ready to run
		return true;
	}

	async onRun() {
		// Main agent logic
	}

	async onShutdown() {
		// Cleanup resources
	}
}
```

#### Agent status

Built-in status tracking (idle, initializing, running, error, shutdown).

```typescript
const agent = await MyAgent.create({ name: 'worker-1' });
console.log(agent.status); // 'idle'

await agent.run();
console.log(agent.status); // 'running'
```

### Pitfalls

- Agents automatically handle SIGTERM/SIGINT for graceful shutdown
- Override onValidate() to prevent run() if preconditions aren't met
- Agent state is persisted to database via SmrtObject inheritance

### Key Exports

`Agent`, `AgentCollection`, `AgentStatus`

---

## @happyvertical/smrt-config

Configuration management for SMRT modules with support for multiple formats (JS, TS, JSON, YAML), environment variables, and type-safe configuration.

### Features

- 🎯 **Multiple formats** - JS, TS, JSON, YAML, TOML with auto-detection
- 🔐 **Secure** - Environment variable integration and async secrets management
- 🌐 **Remote config** - Load from APIs, feature flags, service discovery
- 🔄 **Hot reload** - Watch for config changes in development
- ✨ **Type-safe** - Full TypeScript support with auto-completion
- 🎭 **Orchestration** - Top-level await enables powerful composition patterns
- 📦 **Scoped** - Global, package, and module-level configuration
- ✅ **Validated** - Schema validation with Zod

### Patterns

#### Package configuration

Get configuration for a specific SMRT package with defaults.

```typescript
import { getPackageConfig } from '@happyvertical/smrt-config';

const config = getPackageConfig('cli', {
	database: { type: 'sqlite', url: ':memory:' }
});
```

#### Config file

Create smrt.config.js in project root for framework-wide configuration.

```typescript
// smrt.config.js
export default {
	packages: {
		cli: {
			database: { type: 'sqlite', url: 'app.db' }
		}
	}
};
```

### Pitfalls

- Config files are auto-detected from project root - ensure smrt.config.js is in the right location
- Environment variables override config file values

### Key Exports

`getPackageConfig`, `loadConfig`, `defineConfig`

---

## @happyvertical/smrt-core

Core AI agent framework with ORM, code generation, AI-powered operations, and automatic API/CLI/MCP server generation.

### Key Features

- **AI-First Object Framework**: Objects with built-in AI operations (`is()`, `do()` methods)
- **Object-Relational Mapping**: Automatic database schema generation from TypeScript classes
- **Standardized Collections**: Advanced CRUD operations with flexible querying
- **Code Generation**: CLI tools, REST APIs, and MCP servers generated from objects
- **Field System**: Type-safe field definitions with validation and constraints
- **Vite Plugin Integration**: Virtual modules for automatic service generation
- **AST Scanning**: Automatic discovery of SMRT objects in codebases
- **Cross-Package Integration**: Unified access to AI, files, database, and web capabilities

### Advanced Querying

Collections support flexible querying with multiple operators:

```typescript
const results = await collection.list({
	where: {
		'price >': 10, // Greater than
		'price <=': 100, // Less than or equal
		'name like': '%widget%', // Pattern matching
		'category in': ['A', 'B'], // IN operator
		active: true, // Equals (default)
		'deleted_at !=': null // Not equals
	},
	orderBy: ['price DESC', 'name ASC'],
	limit: 20,
	offset: 0
});

// Count records with same filtering
const total = await collection.count({
	where: { 'price >': 50 }
});
```

### Eager Loading (Preventing N+1 Queries)

SMRT supports eager loading to optimize queries that access related objects, solving the common "N+1 query problem":

```typescript
// Define relationships
class Order extends SmrtObject {
	customerId = foreignKey(Customer);
	productId = foreignKey(Product);
	status: string = 'pending';
}

// ❌ Without eager loading: N+1 queries (slow)
const orders = await orderCollection.list({ limit: 100 });
for (const order of orders) {
	const customer = await order.loadRelated('customerId'); // 100 separate queries!
	console.log(customer.name);
}

// ✅ With eager loading: Single query (fast)
const orders = await orderCollection.list({
	limit: 100,
	include: ['customerId', 'productId'] // Pre-load relationships
});

for (const order of orders) {
	const customer = order.getRelated('customerId'); // Already loaded!
	console.log(customer.name);
}
```

**Performance Impact**: 40-70% faster for relationship-heavy queries

**How it works**:

- **SQL adapters**: Generates efficient `LEFT JOIN` queries
- **REST adapters**: Uses batch loading for related objects
- Only works with `foreignKey` relationships
- Access pre-loaded data with `object.getRelated(fieldName)`

For more details, see the [full CLAUDE.md documentation](./CLAUDE.md#eager-loading-and-n1-query-prevention-phase-5).

### Direct SQL Access

All SMRT objects have public `db` property for direct database access via @have/sql. This enables custom queries, transactions, and advanced database operations:

```typescript
import { SmrtObject, SmrtCollection } from '@happyvertical/smrt-core';

class Product extends SmrtObject {
	name = text({ required: true });
	price = decimal({ required: true });
	category = text({ required: true });
}

const products = await ProductCollection.create({ db: 'products.db' });

// Direct SQL queries
const expensive = await products.db.many`
  SELECT * FROM products
  WHERE price > ${100}
  ORDER BY price DESC
  LIMIT 10
`;

// Execute custom updates
await products.db.execute`
  UPDATE products
  SET price = price * 0.9
  WHERE category = ${'electronics'}
`;

// Check query results
const count = await products.db.pluck`
  SELECT COUNT(*) FROM products WHERE price > ${50}
`;

// Use template literals for safe parameterization
const category = 'books';
const results = await products.db.query`
  SELECT * FROM products WHERE category = ${category}
`;
```

**Key Benefits**:

- **Direct database access**: Use any SQL query, not limited to ORM methods
- **Template literal safety**: Automatic SQL injection protection via tagged templates
- **Full @have/sql power**: Access all DatabaseInterface methods (many, single, pluck, execute)
- **Transaction support**: Use `db.transaction()` for atomic operations
- **Performance**: Direct queries can be more efficient for complex operations

**Configuration Options**:

```typescript
// String shortcut (auto-detects database type)
const collection = await ProductCollection.create({
	db: 'products.db'
});

// Config object (explicit type)
const collection = await ProductCollection.create({
	db: {
		type: 'sqlite',
		url: 'products.db'
	}
});

// DatabaseInterface instance (pre-configured)
import { getDatabase } from '@have/sql';
const db = await getDatabase({ type: 'postgres', url: 'postgres://...' });
const collection = await ProductCollection.create({ db });
```

### Troubleshooting

### Collection Table Names

**Issue**: Collections query incorrect table names (e.g., `place_collections` instead of `places`).

**Cause**: In versions before v0.32.1, collections used their own class name for table naming instead of the item class name.

**Fixed in v0.32.1**: Collections now correctly use the item class name for table naming:

```typescript
class PlaceCollection extends SmrtCollection<Place> {
	static readonly _itemClass = Place;
	// Table name: 'places' (from Place class), not 'place_collections'
}
```

**Migration**: If you have data in the incorrectly-named table:

```sql
-- Rename the table to match the item class name
ALTER TABLE place_collections RENAME TO places;
```

### Static Factory Pattern Required

**Issue**: TypeError when trying to instantiate collections with `new`.

**Cause**: Collection constructors are protected to prevent partially-initialized instances.

**Solution**: Always use the static `create()` factory method:

```typescript
// ✅ CORRECT - Fully initialized collection
const collection = await ProductCollection.create({
	db: { type: 'sqlite', url: 'products.db' }
});

// ❌ WRONG - Constructor is protected
const collection = new ProductCollection(options); // Error!
```

The static factory method ensures collections are fully initialized with database connections, AI clients, and file system access before use.

### Collection \_itemClass Requirement

**Issue**: Error "Collection must define a static \_itemClass property".

**Cause**: Collections require a static `_itemClass` property to know which object type they manage.

**Solution**: Always define the static \_itemClass:

```typescript
class DocumentCollection extends SmrtCollection<Document> {
	static readonly _itemClass = Document; // Required!
}
```

### Slug and Context Uniqueness

**Issue**: UNIQUE constraint violation when saving objects.

**Cause**: SMRT enforces a unique constraint on `(slug, context)` pairs.

**Understanding**: Objects can have the same slug if they have different contexts:

```typescript
// These are DIFFERENT objects (different contexts)
const blog = await collection.create({ slug: 'intro', context: '/blog' });
const docs = await collection.create({ slug: 'intro', context: '/docs' });

// This FAILS (same slug + context)
const blog2 = await collection.create({ slug: 'intro', context: '/blog' });
// Error: UNIQUE constraint failed: slug, context
```

**Solution**: Ensure unique slugs within the same context, or use different contexts for objects with the same slug.

### Patterns

#### @smrt() decorator

Registers class for automatic API/CLI/MCP generation. Configure which endpoints, tools, and commands to generate.

```typescript
@smrt({
	api: { include: ['list', 'get', 'create', 'update'] },
	mcp: { include: ['list', 'get', 'analyze'] },
	cli: true
})
class Product extends SmrtObject {
	name: string = '';
	price: number = 0.0;
}
```

#### TypeScript types for schema

Use TypeScript types for automatic database schema generation. The AST scanner infers column types from default values.

```typescript
class Product extends SmrtObject {
	name: string = ''; // TEXT
	quantity: number = 0; // INTEGER (no decimal)
	price: number = 0.0; // DECIMAL (has decimal)
	active: boolean = true; // BOOLEAN
	tags: string[] = []; // JSON
}
```

#### Static factory for collections

Collections use static create() method for guaranteed initialization. Never use 'new' directly.

```typescript
// Correct
const collection = await ProductCollection.create({
	db: { type: 'sqlite', url: 'products.db' }
});

// Wrong - constructor is protected
const collection = new ProductCollection(options); // Error!
```

#### AI-powered operations

Built-in is() and do() methods for AI-powered validation and transformation on every object.

```typescript
class Document extends SmrtObject {
	content: string = '';

	async isHighQuality(): Promise<boolean> {
		return await this.is('Content is well-written and professional');
	}

	async generateSummary(): Promise<string> {
		return await this.do('Create a 2-sentence summary');
	}
}
```

#### Custom action methods

Define custom methods on SMRT objects and expose them via API, MCP, or CLI by including them in the decorator config.

```typescript
@smrt({
	mcp: { include: ['list', 'get', 'research'] }
})
class Agent extends SmrtObject {
	async research(options: { query: string }) {
		return {
			action: 'research',
			results: await this.do(`Research: ${options.query}`)
		};
	}
}
```

### Pitfalls

- Always use `smrt test` instead of `npx vitest` directly - tests require manifest generation first
- Never override toJSON() without calling super.toJSON() - breaks STI and meta fields
- Collections require static \_itemClass property: `static readonly _itemClass = Product;`
- Always call initialize() after creating objects with 'new', or use collection.create() which calls it automatically
- UNIQUE constraint is on (slug, context) pair - same slug allowed in different contexts
- Query operators go in field name: `{ 'price >': 100 }` not `{ price: '> 100' }`
- Use 0 for integers (INTEGER) and 0.0 for decimals (DECIMAL) in default values

### Key Exports

`SmrtObject`, `SmrtCollection`, `SmrtClass`, `smrt`, `ObjectRegistry`, `CLIGenerator`, `APIGenerator`, `MCPGenerator`, `createDispatchBus`

---

## @happyvertical/smrt-types

Shared TypeScript type definitions for the SMRT framework. Prevents circular dependencies by centralizing types.

### Patterns

#### Import types

Import shared types from this package to avoid circular dependencies.

```typescript
import type { SmrtObjectOptions, FieldDefinition } from '@happyvertical/smrt-types';
```

### Pitfalls

- This package has zero runtime dependencies - only type definitions
- Use 'import type' for types to avoid runtime imports

### Key Exports

`SmrtObjectOptions`, `SmrtClassOptions`, `FieldDefinition`, `CollectionOptions`, `SignalType`

---

## Contributing to This Documentation

If you discover gotchas, patterns, or information that should be included in the SMRT framework documentation, please submit an issue:

**https://github.com/happyvertical/smrt/issues**

Include:

- The package name (e.g., `@happyvertical/smrt-core`)
- Description of the gotcha or pattern
- Example code if applicable

---

_Generated by `smrt docs:claude` — regenerate after dependency updates_
