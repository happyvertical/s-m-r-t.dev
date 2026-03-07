<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-tags"
	description="Hierarchical tagging with context-scoped slugs, multi-language aliases, and slug utilities."
	badges={['v0.20.44', 'Taxonomy', 'Multi-Language', 'ESM']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-tags</strong> provides hierarchical tagging with context-scoped slugs and
			multi-language aliases. Tag (STI) is identified by <code>slug</code> + <code>context</code>
			(default: 'global'). Hierarchical via <code>parentSlug</code>. Level is auto-calculated from parent.
		</p>
		<p>
			TagAlias provides language-specific translations/aliases using ISO 639-1 language codes with
			optional context scoping. Key collection methods include <code>moveTag()</code> (with circular
			reference detection and level recalculation), <code>mergeTag()</code> (moves children + aliases
			from source to target, then deletes source), and <code>cleanupUnused()</code>.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Tag (STI): identified by slug + context, hierarchical via parentSlug</li>
				<li>Context defaults to 'global' if not specified</li>
				<li>Multi-language aliases via TagAlias (ISO 639-1 language codes)</li>
				<li>moveTag(): circular reference detection, level recalculation</li>
				<li>mergeTag(): moves children + aliases from source to target, deletes source</li>
				<li>cleanupUnused(): deletes tags with no children AND no aliases</li>
				<li>findWithGlobals(tenantId): tenant + global tags</li>
				<li>Slug utilities: sanitizeSlug, validateSlug, generateUniqueSlug, hasCircularReference</li>
			</ul>
		</aside>
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
			The module depends on <code>@happyvertical/smrt-core</code> for base classes and database operations.
		</p>
	</section>

	<section>
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create Tags with Hierarchy</h3>
		<CodeBlock
			code={`import { TagCollection } from '@happyvertical/smrt-tags';

const tags = new TagCollection({ db: {...} });

// Create root tag
const electronics = await tags.create({
  slug: 'electronics',
  name: 'Electronics',
  context: 'products',
  level: 0
});

// Create child tag
const laptops = await tags.create({
  slug: 'laptops',
  name: 'Laptops',
  context: 'products',
  parentSlug: 'electronics',
  level: 1  // Auto-calculated if omitted
});

// Create grandchild tag
const gaming = await tags.create({
  slug: 'gaming-laptops',
  name: 'Gaming Laptops',
  context: 'products',
  parentSlug: 'laptops',
  level: 2  // Auto-calculated if omitted
});`}
			language="typescript"
		/>

		<h3>2. Add Multi-Language Aliases</h3>
		<CodeBlock
			code={`import { TagAliasCollection } from '@happyvertical/smrt-tags';

const aliases = new TagAliasCollection({ db: {...} });

// Add Spanish aliases
await aliases.addAlias('electronics', 'electrónica', 'es', 'products');
await aliases.addAlias('laptops', 'portátiles', 'es', 'products');

// Add French aliases
await aliases.addAlias('electronics', 'électronique', 'fr', 'products');
await aliases.addAlias('laptops', 'ordinateurs portables', 'fr', 'products');

// Search by alias
const results = await aliases.searchByAlias('portátiles', 'es');
console.log('Found tag:', results[0].name); // "Laptops"`}
			language="typescript"
		/>

		<h3>3. Use Metadata for UI Customization</h3>
		<CodeBlock
			code={`// Create tag with metadata
const featured = await tags.create({
  slug: 'featured',
  name: 'Featured',
  context: 'blog',
  metadata: {
    color: '#FF6B6B',
    backgroundColor: '#FFE5E5',
    icon: 'star',
    emoji: '⭐',
    featured: true,
    sortOrder: 1
  }
});

// Update metadata
const tag = await tags.get({ slug: 'featured', context: 'blog' });
tag.updateMetadata({
  usageCount: 42,
  lastUsed: new Date().toISOString()
});
await tags.update(tag);`}
			language="typescript"
		/>

		<h3>4. Query Tags by Context and Hierarchy</h3>
		<CodeBlock
			code={`// Get all root tags in context
const rootTags = await tags.getRootTags('products');

// Get tags by context
const blogTags = await tags.listByContext('blog');

// Get tags with specific parent
const laptopTags = await tags.listByContext('products', 'laptops');

// Traverse hierarchy
const tag = await tags.get({ slug: 'gaming-laptops', context: 'products' });
const ancestors = await tag.getAncestors();
// Returns: [{ slug: 'electronics', ... }, { slug: 'laptops', ... }]

const descendants = await tag.getDescendants();
// Returns all child tags recursively`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Concepts</h2>

		<h3>Tag Model Structure</h3>
		<p>
			Tags are identified by <code>slug</code> (URL-friendly unique identifier) within a
			<code>context</code>
			(namespace):
		</p>
		<CodeBlock
			code={`class Tag extends SmrtObject {
  // Note: slug stored in protected _slug (has override getter/setter)
  slug: string              // Unique identifier (lowercase, hyphens)
  name: string              // Display name (auto-generated from slug via getOrCreate)
  context: string           // Namespace isolation (default: 'global')
  parentSlug: string | null // Parent tag slug (for hierarchy)
  level: number             // Auto-calculated from parent (0 = root)
  description: string
  metadata: Record<string, any>  // JSON storage

  // Hierarchy navigation
  async getParent(): Promise<Tag | null>
  async getChildren(): Promise<Tag[]>
  async getAncestors(): Promise<Tag[]>
  async getDescendants(): Promise<Tag[]>

  // Metadata management
  getMetadata(): TagMetadata
  setMetadata(data: TagMetadata): void
  updateMetadata(updates: Partial<TagMetadata>): void
}`}
			language="typescript"
		/>

		<h3>Context Isolation</h3>
		<p>
			The <code>context</code> field provides namespace isolation. The same slug can exist in different
			contexts without conflicts:
		</p>
		<CodeBlock
			code={`// Create "featured" tag in blog context
await tags.create({ slug: 'featured', name: 'Featured', context: 'blog' });

// Create "featured" tag in marketplace context (no conflict)
await tags.create({ slug: 'featured', name: 'Featured Products', context: 'marketplace' });

// Query by context
const blogFeatured = await tags.get({ slug: 'featured', context: 'blog' });
const marketplaceFeatured = await tags.get({ slug: 'featured', context: 'marketplace' });

// Each context has its own isolated vocabulary
const blogTags = await tags.listByContext('blog');
const marketplaceTags = await tags.listByContext('marketplace');`}
			language="typescript"
		/>

		<h3>Multi-Language Support</h3>
		<p>
			The <code>TagAlias</code> model provides alternative names and translations using ISO 639-1 language
			codes:
		</p>
		<CodeBlock
			code={`// Add aliases for "technology" tag
await aliases.bulkAddAliases('technology', [
  { alias: 'tech', language: 'en' },
  { alias: 'tecnología', language: 'es' },
  { alias: 'technologie', language: 'fr' },
  { alias: 'technologie', language: 'de' },
  { alias: '技術', language: 'ja' }
]);

// Search by alias in specific language
const spanishResults = await aliases.searchByAlias('tecnología', 'es');

// Get all aliases for a tag grouped by language
const aliasesByLang = await aliases.getAliasesByLanguage('technology');
// Returns: Map { 'en' => ['tech'], 'es' => ['tecnología'], ... }`}
			language="typescript"
		/>

		<h3>Metadata and Custom Properties</h3>
		<p>
			Tags support flexible JSON metadata for UI rendering, usage statistics, and
			application-specific data:
		</p>
		<CodeBlock
			code={`interface TagMetadata {
  // UI properties
  color?: string                // Text color (#FF6B6B)
  backgroundColor?: string      // Background color (#FFE5E5)
  icon?: string                 // Icon name/class
  emoji?: string                // Emoji character (⭐)

  // Display configuration
  featured?: boolean            // Show prominently in UI
  sortOrder?: number            // Display order
  showInNav?: boolean           // Include in navigation

  // Usage statistics
  usageCount?: number           // Times this tag was used
  lastUsed?: string             // ISO timestamp
  trending?: boolean            // Trending status

  // AI metadata
  aiGenerated?: boolean         // Created by AI
  confidence?: number           // AI confidence score (0-1)
  reviewStatus?: 'pending' | 'approved' | 'rejected'

  // Custom properties (application-specific)
  [key: string]: any
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>API Reference</h2>

		<h3>TagCollection Methods</h3>
		<CodeBlock
			code={`// Get or create (idempotent, auto-generates name from slug)
await tags.getOrCreate(slug: string, options?): Promise<Tag>

// Query by context
await tags.listByContext(context: string, parentSlug?: string): Promise<Tag[]>

// Hierarchy operations
await tags.moveTag(slug, newParentSlug)     // Circular reference detection, level recalculation
await tags.mergeTag(sourceSlug, targetSlug)  // Moves children + aliases, then deletes source
await tags.cleanupUnused()                   // Deletes tags with no children AND no aliases

// Multi-tenant
await tags.findWithGlobals(tenantId)         // Tenant + global (tenantId=null) tags

// Standard CRUD
await tags.create(options: TagOptions): Promise<Tag>
await tags.get(query: { slug, context }): Promise<Tag | null>
await tags.update(tag: Tag): Promise<void>
await tags.delete(query: { slug, context }): Promise<void>`}
			language="typescript"
		/>

		<h3>TagAliasCollection Methods</h3>
		<CodeBlock
			code={`// Add single alias
await aliases.addAlias(
  tagSlug: string,
  alias: string,
  language?: string,
  context?: string
): Promise<TagAlias>

// Bulk add aliases
await aliases.bulkAddAliases(
  tagSlug: string,
  aliases: Array<{ alias, language? }>
): Promise<TagAlias[]>

// Search by alias
await aliases.searchByAlias(
  alias: string,
  language?: string
): Promise<Tag[]>

// Get aliases for tag
await aliases.getAliasesForTag(
  tagSlug: string,
  language?: string
): Promise<TagAlias[]>

// Group aliases by language
await aliases.getAliasesByLanguage(
  tagSlug: string
): Promise<Map<string, string[]>>

// Find matching aliases (case-insensitive)
await aliases.findMatchingAliases(
  query: string,
  language?: string
): Promise<TagAlias[]>`}
			language="typescript"
		/>

		<h3>Utility Functions</h3>
		<CodeBlock
			code={`import {
  sanitizeSlug,
  validateSlug,
  generateUniqueSlug,
  calculateLevel,
  hasCircularReference
} from '@happyvertical/smrt-tags';

// Sanitize user input to slug format
const slug = sanitizeSlug('My Cool Tag!'); // "my-cool-tag"

// Validate slug format
const isValid = validateSlug('my-tag'); // true
const invalid = validateSlug('My Tag!'); // false

// Generate unique slug
const unique = await generateUniqueSlug('technology', 'blog', tags);
// Returns: "technology-2" if "technology" exists

// Calculate hierarchy level
const level = await calculateLevel('electronics', tags);
// Returns: 1 (if electronics has parent at level 0)

// Check for circular reference before updating
const hasCircle = await hasCircularReference('parent-tag', 'child-tag', tags);
if (hasCircle) {
  throw new Error('Cannot create circular reference');
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Real-World Examples</h2>

		<h3>Example 1: E-Commerce Product Categorization</h3>
		<CodeBlock
			code={`// Create product taxonomy
const productTags = new TagCollection({ db: {...} });

// Root categories
await productTags.create({ slug: 'electronics', name: 'Electronics', context: 'products', level: 0 });
await productTags.create({ slug: 'clothing', name: 'Clothing', context: 'products', level: 0 });

// Electronics subcategories
await productTags.create({
  slug: 'smartphones',
  name: 'Smartphones',
  context: 'products',
  parentSlug: 'electronics',
  metadata: { icon: 'phone', color: '#4A90E2' }
});

await productTags.create({
  slug: 'tablets',
  name: 'Tablets',
  context: 'products',
  parentSlug: 'electronics',
  metadata: { icon: 'tablet', color: '#50C878' }
});

// Integration: Many-to-many via join table
// In your products module:
const product = await products.create({
  name: 'iPhone 15 Pro',
  price: 999
});

// Link product to tags (implement join table)
await db.execute(\`
  INSERT INTO product_tags (product_id, tag_slug, context)
  VALUES (\${product.id}, 'smartphones', 'products')
\`);

// Query products by tag
const smartphones = await db.query(\`
  SELECT p.*
  FROM products p
  JOIN product_tags pt ON p.id = pt.product_id
  WHERE pt.tag_slug = 'smartphones' AND pt.context = 'products'
\`);`}
			language="typescript"
		/>

		<h3>Example 2: Multi-Language Blog Tags</h3>
		<CodeBlock
			code={`const blogTags = new TagCollection({ db: {...} });
const aliases = new TagAliasCollection({ db: {...} });

// Create tags
await blogTags.create({ slug: 'technology', name: 'Technology', context: 'blog' });
await blogTags.create({ slug: 'ai', name: 'Artificial Intelligence', context: 'blog' });
await blogTags.create({ slug: 'web-dev', name: 'Web Development', context: 'blog' });

// Add multi-language aliases
await aliases.bulkAddAliases('technology', [
  { alias: 'tech', language: 'en' },
  { alias: 'tecnología', language: 'es' },
  { alias: 'technologie', language: 'fr' }
]);

await aliases.bulkAddAliases('ai', [
  { alias: 'artificial intelligence', language: 'en' },
  { alias: 'inteligencia artificial', language: 'es' },
  { alias: 'intelligence artificielle', language: 'fr' }
]);

// User searches in Spanish
const searchQuery = 'inteligencia artificial';
const results = await aliases.searchByAlias(searchQuery, 'es');
console.log('Found tag:', results[0].slug); // "ai"

// Display in user's language
const aliasesEs = await aliases.getAliasesForTag('ai', 'es');
console.log('Display as:', aliasesEs[0].alias); // "inteligencia artificial"`}
			language="typescript"
		/>

		<h3>Example 3: AI-Generated Tags with Review Workflow</h3>
		<CodeBlock
			code={`// AI generates tags from document content
const aiTags = [
  { slug: 'machine-learning', name: 'Machine Learning', confidence: 0.95 },
  { slug: 'neural-networks', name: 'Neural Networks', confidence: 0.88 },
  { slug: 'deep-learning', name: 'Deep Learning', confidence: 0.92 }
];

for (const aiTag of aiTags) {
  await blogTags.create({
    slug: aiTag.slug,
    name: aiTag.name,
    context: 'blog',
    metadata: {
      aiGenerated: true,
      confidence: aiTag.confidence,
      reviewStatus: 'pending',
      source: 'gpt-4',
      generatedAt: new Date().toISOString()
    }
  });
}

// Admin review workflow
const pendingTags = await blogTags.list({
  where: {
    context: 'blog',
    'metadata.reviewStatus': 'pending'
  }
});

for (const tag of pendingTags) {
  // Admin approves/rejects
  tag.updateMetadata({
    reviewStatus: 'approved',
    reviewedBy: 'admin-user-id',
    reviewedAt: new Date().toISOString()
  });
  await blogTags.update(tag);
}`}
			language="typescript"
		/>

		<h3>Example 4: Multi-Tenant SaaS with Context Isolation</h3>
		<CodeBlock
			code={`// Tenant A: blog application
await tags.create({ slug: 'featured', name: 'Featured', context: 'tenant-a-blog' });
await tags.create({ slug: 'news', name: 'News', context: 'tenant-a-blog' });

// Tenant B: blog application (same slugs, different context)
await tags.create({ slug: 'featured', name: 'Featured Posts', context: 'tenant-b-blog' });
await tags.create({ slug: 'news', name: 'Latest News', context: 'tenant-b-blog' });

// Shared global tags accessible to all tenants
await tags.create({ slug: 'programming', name: 'Programming', context: 'global' });

// Query tenant-specific tags
const tenantATags = await tags.listByContext('tenant-a-blog');
const tenantBTags = await tags.listByContext('tenant-b-blog');
const globalTags = await tags.listByContext('global');

// No conflicts: isolation prevents cross-tenant pollution
console.log('Tenant A has', tenantATags.length, 'tags');
console.log('Tenant B has', tenantBTags.length, 'tags');
console.log('Global has', globalTags.length, 'tags');`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Integration Patterns</h2>

		<h3>Join Table Pattern</h3>
		<p>Consuming packages implement many-to-many relationships via join tables:</p>
		<CodeBlock
			code={`-- Example: Asset tagging
CREATE TABLE asset_tags (
  asset_id VARCHAR(255) NOT NULL,
  tag_slug VARCHAR(255) NOT NULL,
  context VARCHAR(255) NOT NULL DEFAULT 'global',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (asset_id, tag_slug, context),
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_slug, context) REFERENCES tags(slug, context) ON DELETE CASCADE
);

-- Query assets by tag
SELECT a.*
FROM assets a
JOIN asset_tags at ON a.id = at.asset_id
WHERE at.tag_slug = 'featured' AND at.context = 'assets';

-- Get tags for an asset
SELECT t.*
FROM tags t
JOIN asset_tags at ON t.slug = at.tag_slug AND t.context = at.context
WHERE at.asset_id = 'asset-123';`}
			language="sql"
		/>

		<h3>REST API Auto-Generation</h3>
		<p>
			The <code>@smrt</code> decorator generates CRUD endpoints automatically:
		</p>
		<CodeBlock
			code={`// Endpoints generated:
GET    /api/v1/tags                  // List all tags
POST   /api/v1/tags                  // Create tag
GET    /api/v1/tags/:slug            // Get single tag
PUT    /api/v1/tags/:slug            // Update tag
DELETE /api/v1/tags/:slug            // Delete tag

// Query parameters:
GET /api/v1/tags?context=blog                    // Filter by context
GET /api/v1/tags?context=blog&parentSlug=tech    // Filter by parent
GET /api/v1/tags?level=0                         // Get root tags

// Example usage:
const response = await fetch('/api/v1/tags?context=blog');
const tags = await response.json();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>

		<article>
			<h3>✓ DOs</h3>
			<ul>
				<li>Use consistent slug format (lowercase, hyphens only)</li>
				<li>Sanitize user input with <code>sanitizeSlug()</code> before creating tags</li>
				<li>Use context scoping for multi-tenant or multi-domain applications</li>
				<li>Validate hierarchy with <code>hasCircularReference()</code> before updates</li>
				<li>Leverage metadata for UI rendering (colors, icons, sort order)</li>
				<li>Use <code>getOrCreate()</code> to prevent duplicate tags</li>
				<li>Batch alias operations with <code>bulkAddAliases()</code></li>
				<li>Store slugs in entities, not tag names (slugs are immutable)</li>
			</ul>
		</article>

		<article>
			<h3>✗ DON'Ts</h3>
			<ul>
				<li>Don't create deep hierarchies without purpose (limit to 3-4 levels)</li>
				<li>Don't use special characters or spaces in slugs</li>
				<li>Don't manually set <code>level</code> — let system auto-calculate</li>
				<li>Don't delete parent tags without handling orphaned children</li>
				<li>Don't store large data in metadata (keep {'<'} 1MB per tag)</li>
				<li>Don't assume slug uniqueness across contexts (always include context)</li>
				<li>Don't create circular references without validation</li>
			</ul>
		</article>

		<aside>
			<h3>⚡ Performance Tips</h3>
			<ul>
				<li>Index queries by <code>context</code> for fast filtering</li>
				<li>Use <code>listByContext()</code> for context + parent filtering</li>
				<li>Paginate large result sets with <code>limit</code> and <code>offset</code></li>
				<li>Cache root tags for frequently-accessed taxonomies</li>
				<li>Consider denormalizing high-cardinality metadata in join tables</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Common Issues and Troubleshooting</h2>

		<article>
			<h3>Issue: Slug conflicts across contexts</h3>
			<p><strong>Cause:</strong> Same slug exists in different contexts</p>
			<p>
				<strong>Solution:</strong> Always include context in queries:
				<code>{`tags.get({ slug, context })`}</code>
			</p>
		</article>

		<article>
			<h3>Issue: Circular reference when reassigning parent</h3>
			<p><strong>Cause:</strong> Setting a tag's own descendant as parent</p>
			<p>
				<strong>Solution:</strong> Call <code>hasCircularReference()</code> before updating parentSlug
			</p>
			<CodeBlock
				code={`const hasCircle = await hasCircularReference(tag.slug, newParentSlug, tags);
if (hasCircle) {
  throw new Error('Cannot create circular reference');
}
tag.parentSlug = newParentSlug;
await tags.update(tag);`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Orphaned children when deleting parent</h3>
			<p><strong>Cause:</strong> Deleting parent doesn't update child <code>parentSlug</code></p>
			<p>
				<strong>Solution:</strong> Query children first, reassign or delete explicitly
			</p>
			<CodeBlock
				code={`const children = await parentTag.getChildren();
for (const child of children) {
  child.parentSlug = null;  // Make orphans root-level
  await tags.update(child);
}
await tags.delete({ slug: parentTag.slug, context: parentTag.context });`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Metadata not persisting</h3>
			<p><strong>Cause:</strong> Metadata object passed but not saved</p>
			<p>
				<strong>Solution:</strong> Call <code>setMetadata()</code> then save with
				<code>update()</code>
			</p>
			<CodeBlock
				code={`tag.updateMetadata({ color: '#FF6B6B', featured: true });
await tags.update(tag);  // Must call update to persist`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Alias search not finding results</h3>
			<p><strong>Cause:</strong> Case sensitivity or language mismatch</p>
			<p>
				<strong>Solution:</strong> Use <code>findMatchingAliases()</code> for case-insensitive search
			</p>
			<CodeBlock
				code={`// Case-sensitive
const results1 = await aliases.searchByAlias('Technology', 'en'); // May not find

// Case-insensitive
const results2 = await aliases.findMatchingAliases('technology', 'en'); // Will find`}
				language="typescript"
			/>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Base classes, decorators, and database operations</p>
			</a>
			<a href="/modules/smrt-products" class="link-card">
				<h3>smrt-products</h3>
				<p>Product categorization with tags</p>
			</a>
			<a href="/modules/smrt-content" class="link-card">
				<h3>smrt-content</h3>
				<p>Content tagging and organization</p>
			</a>
			<a href="/modules/smrt-assets" class="link-card">
				<h3>smrt-assets</h3>
				<p>Asset tagging and classification</p>
			</a>
		</div>
	</section>
</ModulePage>
