<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-tags"
	description="Hierarchical tagging with context-scoped slugs, multi-language aliases, and slug utilities."
	badges={['v0.29.34', 'Taxonomy', 'Multi-Language', 'ESM']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-tags</strong> provides hierarchical tagging with context-scoped slugs and
			multi-language aliases. <code>Tag</code> (STI) is identified by <code>slug</code> +
			<code>context</code> (default: <code>'global'</code>) for its public natural key. Hierarchy is
			modelled via <code>parentId</code> (a UUID, inherited from <code>SmrtHierarchical</code>);
			<code>level</code> is a denormalised depth recalculated by <code>moveTag()</code> /
			<code>mergeTag()</code>. <code>TagCollection</code>'s public methods still accept slug strings
			and resolve them to ids internally.
		</p>
		<p>
			<code>TagAlias</code> provides language-specific translations using ISO 639-1
			<code>language</code> codes with optional context scoping. Collection helpers handle the
			tricky operations: <code>moveTag()</code> (circular reference detection, level recalculation),
			<code>mergeTag()</code>
			(moves children + aliases from source to target, then deletes the source), and
			<code>cleanupUnused()</code>.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>
					<code>Tag</code> (STI, extends <code>SmrtHierarchical</code>): identified by
					<code>slug + context</code>, hierarchical via <code>parentId</code> (UUID)
				</li>
				<li>
					<code>context</code> defaults to <code>'global'</code> — same slug in different contexts is
					fine
				</li>
				<li>
					Multi-language aliases via <code>TagAlias</code> (ISO 639-1 codes, language nullable)
				</li>
				<li><code>moveTag()</code>: circular reference detection, level recalculation</li>
				<li>
					<code>mergeTag()</code>: moves children + aliases from source to target, deletes source
				</li>
				<li><code>cleanupUnused()</code>: only deletes tags with no children AND no aliases</li>
				<li><code>findWithGlobals(tenantId)</code>: tenant + global tags</li>
				<li>
					Slug utilities: <code>sanitizeSlug</code>, <code>validateSlug</code>,
					<code>generateUniqueSlug</code>, <code>hasCircularReference</code>
				</li>
			</ul>
		</aside>

		<h3>Tenancy</h3>
		<p>
			<code>Tag</code> uses <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> with a nullable
			<code>tenantId</code>. Tags with <code>tenantId = null</code> are global — retrievable
			alongside tenant tags via <code>findWithGlobals(tenantId)</code>. A tenant-specific vocabulary
			can shadow a global slug by reusing the same slug within a tenant-scoped context.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-tags
# or
pnpm add @happyvertical/smrt-tags`}
			language="bash"
		/>
		<p>
			Depends on <code>@happyvertical/smrt-core</code> for base classes and database operations.
		</p>
	</section>

	<section>
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create Tags with Hierarchy</h3>
		<CodeBlock
			code={`import { TagCollection } from '@happyvertical/smrt-tags';

const tags = await TagCollection.create({ db });

// Root tag (create returns the saved instance with its persisted id)
const electronics = await tags.create({
  slug: 'electronics',
  name: 'Electronics',
  context: 'products',
  // level defaults to 0 (root); recalculated by moveTag/mergeTag on later moves
});

// Child tag -- reference the parent by its UUID (parentId)
const laptops = await tags.create({
  slug: 'laptops',
  name: 'Laptops',
  context: 'products',
  parentId: electronics.id,
  level: 1,
});

// getOrCreate(slug, context) -- idempotent, auto-generates name from slug
const gaming = await tags.getOrCreate('gaming-laptops', 'products');
// reparent under laptops afterwards (cycle-checked, recalculates level)
await tags.moveTag('gaming-laptops', 'laptops', 'products');`}
			language="typescript"
		/>

		<h3>2. Multi-Language Aliases</h3>
		<CodeBlock
			code={`import { TagAliasCollection } from '@happyvertical/smrt-tags';

const aliases = await TagAliasCollection.create({ db });

// Single alias
await aliases.addAlias('electronics', 'electrónica', 'es', 'products');

// Bulk
await aliases.bulkAddAliases('technology', [
  { alias: 'tech', language: 'en' },
  { alias: 'tecnología', language: 'es' },
  { alias: 'technologie', language: 'fr' },
  { alias: '技術', language: 'ja' },
]);

// Search by alias (case-sensitive)
const results = await aliases.searchByAlias('tecnología', 'es');

// Group all aliases for a tag by language
const byLang = await aliases.getAliasesByLanguage('technology');
// Map { 'en' => ['tech'], 'es' => ['tecnología'], ... }`}
			language="typescript"
		/>

		<h3>3. Hierarchy Operations</h3>
		<CodeBlock
			code={`// Move a tag to a new parent (validates against cycles, recalculates levels)
await tags.moveTag('gaming-laptops', 'computing');

// Merge: move children + aliases from source to target, then delete source
await tags.mergeTag('laptop-pcs', 'laptops');

// Cleanup unused tags (no children AND no aliases)
const removed = await tags.cleanupUnused();
console.log('Removed:', removed);

// Multi-tenant lookup
const visible = await tags.findWithGlobals(currentTenantId);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Tag Model</h2>
		<CodeBlock
			code={`class Tag extends SmrtHierarchical {
  // Stored in protected _slug -- has override getter/setter (non-standard slug behaviour)
  slug: string              // Identifier within (context, tenantId)
  name: string              // Display name (auto-generated from slug via getOrCreate)
  context: string           // Namespace isolation (default: 'global')
  parentId: string | null   // Parent tag UUID (inherited from SmrtHierarchical)
  level: number             // Denormalised depth (0 = root); recalculated by moveTag/mergeTag
  description: string
  metadata: string          // JSON metadata stored as text

  // Hierarchy navigation (inherited from SmrtHierarchical)
  async getParent(): Promise<Tag | null>
  async getChildren(): Promise<Tag[]>
  async getAncestors(): Promise<Tag[]>
  async getDescendants(): Promise<Tag[]>
  async getHierarchy(): Promise<{ ancestors; current; descendants }>
  async moveTo(parentId: string | null): Promise<void>

  // Metadata helpers (parse/serialize the JSON string field)
  getMetadata(): TagMetadata
  setMetadata(data: TagMetadata): void
  updateMetadata(updates: Partial<TagMetadata>): void
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Slug Utilities</h2>
		<CodeBlock
			code={`import {
  sanitizeSlug,
  validateSlug,
  generateUniqueSlug,
  calculateLevel,
  hasCircularReference,
} from '@happyvertical/smrt-tags';

const slug = sanitizeSlug('My Cool Tag!'); // 'my-cool-tag'
const ok = validateSlug('my-tag');         // true
const unique = await generateUniqueSlug('technology', 'blog', tags);
const level = await calculateLevel('electronics', tags);

// Check before reparenting (moveTag does this internally, but it's exported for callers)
const willCycle = await hasCircularReference('parent', 'child', tags);
if (willCycle) throw new Error('Circular reference');`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>Slug stored in protected <code>_slug</code></strong> with an override getter/setter
				— not standard <code>SmrtObject</code> slug behaviour
			</li>
			<li><strong>Context defaults to <code>'global'</code></strong> if not specified</li>
			<li>
				<strong>Optional tenancy</strong> with nullable <code>tenantId</code> — use
				<code>findWithGlobals()</code>
			</li>
			<li>
				<code>cleanupUnused()</code> only deletes tags with no children AND no aliases (it's not a cascading
				delete)
			</li>
		</ul>
	</section>

	<section>
		<h2>Best Practices</h2>

		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use consistent slug format (lowercase, hyphens only)</li>
				<li>Sanitize user input with <code>sanitizeSlug()</code> before creating tags</li>
				<li>Use context scoping for multi-tenant or multi-domain applications</li>
				<li>
					Use <code>moveTag()</code> / <code>mergeTag()</code> for reparenting — they validate cycles
				</li>
				<li>Leverage metadata for UI rendering (colors, icons, sort order)</li>
				<li>Use <code>getOrCreate()</code> to prevent duplicate tags</li>
				<li>Batch alias operations with <code>bulkAddAliases()</code></li>
			</ul>
		</article>

		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't create deep hierarchies without purpose (3-4 levels is usually plenty)</li>
				<li>Don't use special characters or spaces in slugs</li>
				<li>Don't manually set <code>level</code> — let the collection auto-calculate</li>
				<li>Don't delete parent tags without handling orphaned children</li>
				<li>Don't store large data in metadata (keep {'<'} 1MB per tag)</li>
				<li>Don't assume slug uniqueness across contexts — always include context in queries</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Base classes, decorators, and database operations</p>
			</a>
			<a href="/modules/smrt-content" class="link-card">
				<h3>smrt-content</h3>
				<p>Content tagging via consumer-defined join tables</p>
			</a>
			<a href="/modules/smrt-facts" class="link-card">
				<h3>smrt-facts</h3>
				<p>Fact tagging via FactTag</p>
			</a>
			<a href="/modules/smrt-tenancy" class="link-card">
				<h3>smrt-tenancy</h3>
				<p>Optional multi-tenant scoping</p>
			</a>
		</div>
	</section>
</ModulePage>
