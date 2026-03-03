<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-properties"
	description="Digital properties (websites, apps) with hierarchical zones for content and ad placement."
	badges={['v0.20.44', 'Properties', 'Zones']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-properties</strong> manages digital properties (websites, apps, publications) and
			their hierarchical zones for content and ad placement. Property is STI-enabled with domain, URL,
			and optional repository/owner links. Zones form an arbitrarily nested tree within each property.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Property (STI) with domain, URL, status (active/inactive/pending)</li>
				<li>Zone hierarchy via parentId with tree operations and cycle detection</li>
				<li>Zone types: page, section, slot, container, widget</li>
				<li>Dimension tracking (width/height) and allowedFormats per zone</li>
				<li>Empty allowedFormats = all formats allowed (no restrictions)</li>
				<li><code>deleteZone(cascade=false)</code> orphans children to parent, not deletes them</li>
				<li>In-memory depth caching prevents N+1 queries during tree operations</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-properties`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { PropertyCollection, ZoneCollection } from '@happyvertical/smrt-properties';

// Initialize collections
const properties = await PropertyCollection.create({ db: {...} });
const zones = await ZoneCollection.create({ db: {...} });

// Create property
const site = await properties.create({
  name: 'Oak Creek News',
  domain: 'oakcreeknews.com',
  url: 'https://oakcreeknews.com',
  status: 'active'
});
await site.save();

// Create page zone
const homePage = await zones.create({
  propertyId: site.id,
  name: 'Home Page',
  type: 'page',
  path: '/'
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
  allowedFormats: ['display', 'video']
});
await headerSlot.save();

// Get zone tree
const tree = await zones.getTree(site.id);
console.log(\`Property has \${tree.roots.length} top-level zones\`);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Concepts</h2>

		<h3>Property Model</h3>
		<CodeBlock
			code={`class Property extends SmrtObject {
  name: string
  domain: string
  url: string
  status: 'active' | 'inactive' | 'pending'
  ownerId?: string          // Optional profile link
  repositoryId?: string     // Optional project link
  metadata?: Record<string, any>

  async getZones(): Promise<Zone[]>
  async getZoneTree(): Promise<ZoneTree>
  async createZone(options): Promise<Zone>
  async summarize(): Promise<string>  // AI-powered
}`}
			language="typescript"
		/>

		<h3>Zone Model</h3>
		<CodeBlock
			code={`class Zone extends SmrtObject {
  propertyId: string
  parentId?: string         // Self-referencing hierarchy
  name: string
  type: string              // 'page', 'section', 'slot', 'container', 'widget'
  path?: string             // URL path pattern
  selector?: string         // CSS selector
  width?: number            // Nullable independently -- check hasDimensions()
  height?: number
  allowedFormats?: string[] // Empty array = all formats (no restrictions)
  metadata?: Record<string, any>

  // Hierarchy traversal
  async getAncestors(): Promise<Zone[]>
  async getDescendants(): Promise<Zone[]>
  async getFullPath(): string

  // Format/dimension helpers
  isFormatAllowed(format: string): boolean
  hasDimensions(): boolean   // Check before using width/height
  getDimensionString(): string
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>API Reference</h2>

		<h3>PropertyCollection</h3>
		<CodeBlock
			code={`await properties.findByDomain(domain: string)
await properties.findByOwner(ownerId: string)
await properties.findActive()
await properties.getOrCreateByDomain(domain, defaults)
await properties.countByStatus()`}
			language="typescript"
		/>

		<h3>ZoneCollection</h3>
		<CodeBlock
			code={`await zones.findByProperty(propertyId: string)
await zones.getTree(propertyId: string): Promise<ZoneTree>  // Builds nested structure
await zones.getAncestors(zoneId: string)
await zones.getDescendants(zoneId: string)
await zones.moveZone(zoneId: string, newParentId?: string)  // Validates against descendant cycles
await zones.deleteZone(zoneId: string, cascade: boolean)    // cascade=false orphans children to parent
await zones.findWithGlobals(tenantId: string)               // Tenant + global zones`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Examples</h2>

		<h3>Example 1: Multi-Zone Website</h3>
		<CodeBlock
			code={`// Create property
const site = await properties.create({
  name: 'News Site',
  domain: 'news.com',
  status: 'active'
});
await site.save();

// Create pages
const home = await zones.create({
  propertyId: site.id,
  name: 'Home',
  type: 'page',
  path: '/'
});
await home.save();

const articles = await zones.create({
  propertyId: site.id,
  name: 'Articles',
  type: 'page',
  path: '/articles/*'
});
await articles.save();

// Create slots
const headerAd = await zones.create({
  propertyId: site.id,
  parentId: home.id,
  name: 'Header Ad',
  type: 'slot',
  width: 728,
  height: 90
});
await headerAd.save();`}
			language="typescript"
		/>

		<h3>Example 2: Zone Traversal</h3>
		<CodeBlock
			code={`// Get tree structure
const tree = await zones.getTree(site.id);

// Get full path
const path = await headerAd.getFullPath(); // "Home > Header Ad"

// Get ancestors
const ancestors = await headerAd.getAncestors(); // [home]

// Get all descendants of page
const slots = await home.getDescendants();`}
			language="typescript"
		/>

		<h3>Example 3: Format Validation</h3>
		<CodeBlock
			code={`// Configure allowed formats
const videoSlot = await zones.create({
  propertyId: site.id,
  name: 'Video Player',
  allowedFormats: ['video', 'native']
});
await videoSlot.save();

// Check compatibility
if (videoSlot.isFormatAllowed('video')) {
  console.log('Video ads allowed');
}

// Find zones by dimensions
const leaderboards = await zones.list({
  where: {
    propertyId: site.id,
    width: 728,
    height: 90
  }
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<div>
			<div>
				<h3>✓ DOs</h3>
				<ul>
					<li>Save properties before creating zones</li>
					<li>Cache zone trees in-memory for performance</li>
					<li>Use moveZone() for reparenting (prevents cycles)</li>
					<li>Validate formats with isFormatAllowed() before assignment</li>
					<li>Use findByDimensions() to pre-filter ad slots</li>
				</ul>
			</div>
			<div>
				<h3>✗ DON'Ts</h3>
				<ul>
					<li>Don't manually set parentId to a descendant (causes cycles)</li>
					<li>Don't delete properties without handling zones first</li>
					<li>Don't assume unlimited nesting without depth checks</li>
					<li>Don't query zones repeatedly in loops (use batch operations)</li>
					<li>Don't skip save() after creation (id requires persistence)</li>
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
			<a href="/modules/smrt-projects">
				<h3>smrt-projects</h3>
				<p>Repository links for properties</p>
			</a>
			<a href="/modules/smrt-ads">
				<h3>smrt-ads</h3>
				<p>Ad placement in zones</p>
			</a>
		</div>
	</section>

	<nav>
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-commerce">Next: smrt-commerce →</a>
	</nav>
</ModulePage>
