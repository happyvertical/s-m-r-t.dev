<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-properties"
	description="Digital properties (websites, apps) with hierarchical zones for content and ad placement, plus AI summaries via the smrt-prompts registry."
	badges={['v0.29.34', 'Properties', 'Zones']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-properties</strong> manages digital properties (websites, apps, publications) and
			their hierarchical zones for content and ad placement. <code>Property</code> is STI-enabled
			with domain, URL, and optional repository/owner links. <code>Zone</code> forms an arbitrarily nested
			tree within each property, with in-memory depth caching to prevent N+1 queries during tree operations.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>
					<code>Property</code> (STI) with <code>domain</code>, <code>url</code>,
					<code>status</code> (active/inactive/pending)
				</li>
				<li>Zone hierarchy via <code>parentId</code> with tree operations and cycle detection</li>
				<li>
					Dimension tracking (width/height, nullable independently) and <code>allowedFormats</code> per
					zone
				</li>
				<li>Empty <code>allowedFormats</code> = all formats allowed (no restrictions)</li>
				<li>
					<code>deleteZone(cascade=false)</code> orphans children to parent, doesn't delete them
				</li>
				<li>In-memory depth caching prevents N+1 queries during tree operations</li>
				<li>Methods dynamically import <code>ZoneCollection</code> for lazy loading</li>
				<li>AI: <code>Property.summarize()</code> via the smrt-prompts registry</li>
			</ul>
		</aside>

		<h3>Tenancy</h3>
		<p>
			Both <code>Property</code> and <code>Zone</code> use
			<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>. Use
			<code>ZoneCollection.findWithGlobals(tenantId)</code> to include global zones with tenant ones —
			common for shared zone templates.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-properties`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { PropertyCollection, ZoneCollection } from '@happyvertical/smrt-properties';

const properties = await PropertyCollection.create({ db });
const zones = await ZoneCollection.create({ db });

// Create property
const site = await properties.create({
  name: 'Oak Creek News',
  domain: 'oakcreeknews.com',
  url: 'https://oakcreeknews.com',
  status: 'active',
});
await site.save();

// Create page zone
const homePage = await zones.create({
  propertyId: site.id,
  name: 'Home Page',
  type: 'page',
  path: '/',
});
await homePage.save();

// Create ad slot
const headerSlot = await zones.create({
  propertyId: site.id,
  parentId: homePage.id,
  name: 'Header Leaderboard',
  type: 'slot',
  width: 728,
  height: 90,
  allowedFormats: ['display', 'video'],
});
await headerSlot.save();

// Get zone tree (cached depth lookups, no N+1)
const tree = await zones.getTree(site.id);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Property</h3>
		<CodeBlock
			code={`class Property extends SmrtObject {
  name: string
  domain: string
  url: string
  status: 'active' | 'inactive' | 'pending'
  ownerId?: string          // Optional profile link
  repositoryId?: string     // Optional project link
  metadata?: Record<string, any>

  // ZoneCollection wrappers loaded lazily via dynamic import
  async getZones(): Promise<Zone[]>
  async getZoneTree(): Promise<ZoneTree>
  async createZone(options): Promise<Zone>

  // Convenience
  isActive(): boolean

  // AI -- registered with smrt-prompts (see Prompt Registry below)
  async summarize(): Promise<string>
}`}
			language="typescript"
		/>

		<h3>Zone</h3>
		<CodeBlock
			code={`class Zone extends SmrtObject {
  propertyId: string
  parentId?: string         // Self-referencing hierarchy
  name: string
  type: string              // 'page' | 'section' | 'slot' | 'container' | 'widget'
  path?: string             // URL path pattern
  selector?: string         // CSS selector
  width?: number            // Nullable INDEPENDENTLY -- check hasDimensions()
  height?: number
  allowedFormats?: string[] // Empty array = no restrictions
  metadata?: Record<string, any>

  // Hierarchy traversal
  async getAncestors(): Promise<Zone[]>
  async getDescendants(): Promise<Zone[]>
  async getFullPath(): Promise<string>

  // Helpers
  isFormatAllowed(format: string): boolean
  hasDimensions(): boolean
  getDimensionString(): string | null   // null when dimensions are unset
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Prompt Registry</h2>
		<p>
			<code>Property.summarize()</code> is registered with
			<a href="/modules/smrt-prompts"><code>@happyvertical/smrt-prompts</code></a>
			so tenants can override the template, model, and params at runtime.
		</p>
		<CodeBlock
			code={`import { smrtPropertiesSummarizePrompt } from '@happyvertical/smrt-properties';

// key: 'smrtProperties.property.summarize'
//
// Variables passed to the AI provider (PII-conscious):
//   name, domain, description, status,
//   plus aggregate zone information (count + top-level zone names).
//
// Intentionally EXCLUDED:
//   ownerId, repositoryId, tenantId  (internal FKs)
//   metadata                         (may contain analytics IDs / private config)`}
			language="typescript"
		/>
		<p>
			See <a href="/modules/smrt-prompts">smrt-prompts</a> for the override workflow.
		</p>
	</section>

	<section>
		<h2>ZoneCollection Key Methods</h2>
		<CodeBlock
			code={`await zones.findByProperty(propertyId);
await zones.getTree(propertyId);          // builds nested structure (depth-cached)
await zones.getAncestors(zoneId);
await zones.getDescendants(zoneId);
await zones.moveZone(zoneId, newParentId?); // validates against descendant cycles
await zones.deleteZone(zoneId, cascade);    // cascade=false orphans children to parent
await zones.findWithGlobals(tenantId);      // tenant + global zones`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>Empty <code>allowedFormats</code> = all formats</strong>: an empty array means no
				restrictions, NOT "no formats"
			</li>
			<li>
				<strong>Zone dimensions nullable independently</strong>: check <code>hasDimensions()</code>
				before using <code>width</code>/<code>height</code>
			</li>
			<li>
				<strong><code>deleteZone(cascade=false)</code></strong>: doesn't delete children — moves
				them to the parent (orphan pattern)
			</li>
			<li><strong>Optional tenancy</strong> on both <code>Property</code> and <code>Zone</code></li>
		</ul>
	</section>

	<section>
		<h2>Best Practices</h2>
		<div>
			<div>
				<h3>DOs</h3>
				<ul>
					<li>Save properties before creating zones</li>
					<li>
						Use <code>getTree()</code> over repeated <code>getChildren()</code> calls — it's depth-cached
					</li>
					<li>
						Use <code>moveZone()</code> for reparenting — it validates against descendant cycles
					</li>
					<li>Validate formats with <code>isFormatAllowed()</code> before assignment</li>
					<li>
						Override <code>summarize()</code> at the tenant level via smrt-prompts instead of subclassing
					</li>
				</ul>
			</div>
			<div>
				<h3>DON'Ts</h3>
				<ul>
					<li>Don't manually set <code>parentId</code> to a descendant — causes cycles</li>
					<li>Don't delete properties without handling zones first</li>
					<li>
						Don't query zones repeatedly in loops — use <code>getTree()</code> or batch operations
					</li>
					<li>
						Don't put PII or sensitive analytics IDs in <code>metadata</code> if you plan to surface
						<code>summarize()</code> publicly
					</li>
				</ul>
			</div>
		</div>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Base classes and database operations</p>
			</a>
			<a href="/modules/smrt-profiles">
				<h3>smrt-profiles</h3>
				<p>Property owner profile links</p>
			</a>
			<a href="/modules/smrt-prompts">
				<h3>smrt-prompts</h3>
				<p>Overridable prompt for <code>Property.summarize()</code></p>
			</a>
			<a href="/modules/smrt-ads">
				<h3>smrt-ads</h3>
				<p>Ad placement in zones</p>
			</a>
		</div>
	</section>

	<nav>
		<a href="/modules">← Back to Modules</a>
	</nav>
</ModulePage>
