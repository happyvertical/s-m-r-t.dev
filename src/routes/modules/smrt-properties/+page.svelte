<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-properties - Digital Property Management | SMRT Framework</title>
  <meta name="description" content="Manage digital properties and hierarchical zones with flexible metadata and tree-structured organization." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-properties</h1>
    <p class="text-xl text-gray-600 mb-4">
      Digital property and zone management with hierarchical organization, dimension tracking,
      and format validation for websites, applications, and ad placement.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Properties</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Zones</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">ESM</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-properties</strong> manages digital properties (websites, applications) and their hierarchical
      zones (pages, sections, ad slots). It provides tree-structured organization with flexible metadata, dimension
      tracking, and format validation.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Property management with domain, URL, and status tracking</li>
        <li>Hierarchical zones with unlimited nesting depth</li>
        <li>Dimension tracking (width/height) for ad slots</li>
        <li>Format validation and allowed formats per zone</li>
        <li>Tree operations with cycle prevention</li>
        <li>Path traversal (ancestors/descendants)</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-properties`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Core Concepts</h2>

    <h3 class="text-2xl font-semibold mb-3">Property Model</h3>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Zone Model</h3>
    <CodeBlock
      code={`class Zone extends SmrtObject {
  propertyId: string
  parentId?: string         // Self-referencing hierarchy
  name: string
  type: string              // 'page', 'section', 'slot', etc.
  path?: string
  selector?: string         // CSS selector
  width?: number
  height?: number
  allowedFormats?: string[] // ['display', 'video', 'native']
  metadata?: Record<string, any>

  async getProperty(): Promise<Property>
  async getParent(): Promise<Zone | null>
  async getChildren(): Promise<Zone[]>
  async getAncestors(): Promise<Zone[]>
  async getDescendants(): Promise<Zone[]>
  async getFullPath(): string
  async getDepth(): number
  isFormatAllowed(format: string): boolean
  hasDimensions(): boolean
  getDimensionString(): string
}`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">API Reference</h2>

    <h3 class="text-2xl font-semibold mb-3">PropertyCollection</h3>
    <CodeBlock
      code={`await properties.findByDomain(domain: string)
await properties.findByOwner(ownerId: string)
await properties.findActive()
await properties.getOrCreateByDomain(domain, defaults)
await properties.countByStatus()`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">ZoneCollection</h3>
    <CodeBlock
      code={`await zones.findByProperty(propertyId: string)
await zones.findTopLevel(propertyId: string)
await zones.getTree(propertyId: string): Promise<ZoneTree>
await zones.getAncestors(zoneId: string)
await zones.getDescendants(zoneId: string)
await zones.moveZone(zoneId: string, newParentId?: string)
await zones.deleteZone(zoneId: string, cascade: boolean)`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Examples</h2>

    <h3 class="text-2xl font-semibold mb-3">Example 1: Multi-Zone Website</h3>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Example 2: Zone Traversal</h3>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Example 3: Format Validation</h3>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Best Practices</h2>
    <div class="space-y-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✓ DOs</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Save properties before creating zones</li>
          <li>Cache zone trees in-memory for performance</li>
          <li>Use moveZone() for reparenting (prevents cycles)</li>
          <li>Validate formats with isFormatAllowed() before assignment</li>
          <li>Use findByDimensions() to pre-filter ad slots</li>
        </ul>
      </div>
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✗ DON'Ts</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Don't manually set parentId to a descendant (causes cycles)</li>
          <li>Don't delete properties without handling zones first</li>
          <li>Don't assume unlimited nesting without depth checks</li>
          <li>Don't query zones repeatedly in loops (use batch operations)</li>
          <li>Don't skip save() after creation (id requires persistence)</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Base classes and database operations</p>
      </a>
      <a href="/modules/smrt-profiles" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-profiles</h3>
        <p class="text-sm text-gray-600">Property owner profile links</p>
      </a>
      <a href="/modules/smrt-projects" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-projects</h3>
        <p class="text-sm text-gray-600">Repository links for properties</p>
      </a>
      <a href="/modules/smrt-ads" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-ads</h3>
        <p class="text-sm text-gray-600">Ad placement in zones</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-commerce" class="text-blue-600 hover:underline">Next: smrt-commerce →</a>
    </div>
  </div>
</div>
