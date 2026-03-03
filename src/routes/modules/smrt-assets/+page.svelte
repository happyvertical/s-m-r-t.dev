<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-assets"
	description="Provider-agnostic asset management with versioning, type classification, metadata fields, and polymorphic associations."
	badges={['v0.20.44', 'Asset Management', 'Provider-Agnostic']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-assets</code> package provides provider-agnostic asset management
			with versioning via <code>primaryVersionId</code> chains, hierarchical derivatives via <code>parentId</code>,
			polymorphic associations via <code>AssetAssociation</code>, and folder organization via STI.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>STI Asset Model</strong>: Asset base with Folder STI subclass for hierarchical organization</li>
			<li><strong>Versioning</strong>: Sequential via <code>primaryVersionId</code> chain + <code>version</code> number</li>
			<li><strong>Derivatives</strong>: Parent-child hierarchy via <code>parentId</code> for thumbnails, crops, format conversions</li>
			<li><strong>Polymorphic Association</strong>: <code>AssetAssociation</code> links assets to any SmrtObject via <code>metaType</code> + <code>metaId</code></li>
			<li><strong>Metadata Fields</strong>: <code>AssetMetafield</code> with JSON validation rules</li>
			<li><strong>Tag Integration</strong>: <code>addTag()</code>/<code>removeTag()</code> via raw join table</li>
			<li><strong>Provider-Agnostic</strong>: <code>AssetStore</code> abstraction for S3, local, GCS, CDN</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
┌─────────────────────────────────────────────┐
│        Asset Management System               │
├─────────────────────────────────────────────┤
│  Asset (STI base)                            │
│  • name, slug, sourceUri, mimeType           │
│  • versioning: primaryVersionId + version    │
│  • hierarchy: parentId (derivatives)         │
│  • ownerProfileId, typeSlug, statusSlug      │
├─────────────────────────────────────────────┤
│  Folder (STI subclass, typeSlug='folder')    │
│  • Hierarchical organization                 │
├─────────────────────────────────────────────┤
│  AssetAssociation (polymorphic join)         │
│  • assetId + metaType + metaId + role        │
│  • sortOrder for ordering                    │
├─────────────────────────────────────────────┤
│  Lookup Tables                               │
│  • AssetType - classification                │
│  • AssetStatus - lifecycle                   │
│  • AssetMetafield - custom metadata defs     │
├─────────────────────────────────────────────┤
│  AssetStore                                  │
│  • Provider-agnostic file I/O               │
│  • S3, local, GCS, CDN backends              │
└─────────────────────────────────────────────┘
			</pre>
		</div>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<h3>Using pnpm</h3>
		<CodeBlock code={`pnpm add @happyvertical/smrt-assets`} language="bash" />

		<h3>Using npm</h3>
		<CodeBlock code={`npm install @happyvertical/smrt-assets`} language="bash" />

		<h3>Setup</h3>
		<CodeBlock
			code={`import {
  Asset, AssetCollection,
  AssetAssociation, AssetAssociationCollection,
  AssetType, AssetStatus, AssetMetafield,
  Folder, FolderCollection,
  AssetStore
} from '@happyvertical/smrt-assets';

const assets = await AssetCollection.create({
  db: { type: 'sqlite', url: './assets.db' }
});`}
			language="typescript"
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>1. Create Asset</h3>
		<CodeBlock
			code={`// Create lookup records first
const imageType = new AssetType({ slug: 'image', name: 'Image' });
await imageType.save();

const published = new AssetStatus({ slug: 'published', name: 'Published' });
await published.save();

// Create an asset
const photo = new Asset({
  name: 'Product Photo',
  slug: 'product-photo-001',
  sourceUri: 's3://mybucket/products/photo.jpg',
  mimeType: 'image/jpeg',
  typeSlug: 'image',
  statusSlug: 'published',
  version: 1
});
await photo.save();`}
			language="typescript"
		/>

		<h3>2. Versioning (primaryVersionId chain)</h3>
		<CodeBlock
			code={`// Create version 2 -- chain via primaryVersionId
const v2 = new Asset({
  name: 'Product Photo',
  slug: 'product-photo-002',
  version: 2,
  primaryVersionId: photo.id,
  sourceUri: 's3://mybucket/products/photo-v2.jpg',
  mimeType: 'image/jpeg',
  typeSlug: 'image',
  statusSlug: 'published'
});
await v2.save();`}
			language="typescript"
		/>

		<h3>3. Derivatives via parentId</h3>
		<CodeBlock
			code={`// Create thumbnail derivative
const thumb = new Asset({
  name: 'Thumbnail',
  slug: 'product-photo-001-thumb',
  parentId: photo.id,
  sourceUri: 's3://mybucket/products/photo-001-thumb.jpg',
  mimeType: 'image/jpeg',
  typeSlug: 'image',
  statusSlug: 'published'
});
await thumb.save();`}
			language="typescript"
		/>

		<h3>3b. Polymorphic Association</h3>
		<CodeBlock
			code={`// Link asset to any SmrtObject via AssetAssociation
const assoc = new AssetAssociation({
  assetId: photo.id,
  metaType: '@happyvertical/smrt-content:Article',
  metaId: 'article-123',
  role: 'hero',
  sortOrder: 0
});
await assoc.save();`}
			language="typescript"
		/>

		<h3>4. Work with Tags</h3>
		<CodeBlock
			code={`// Add tags
await assets.addTag(asset.id, 'featured');
await assets.addTag(asset.id, 'products');

// Check tag
const isFeatured = await asset.hasTag('featured');

// Get all tags
const tags = await asset.getTags();

// Find assets by tag
const featuredAssets = await assets.getByTag('featured');`}
			language="typescript"
		/>
	</section>

	<section id="core-concepts">
		<h2>Core Concepts</h2>

		<h3>1. Versioning System</h3>
		<p>Track sequential evolution of assets via <code>primaryVersionId</code> chain and <code>version</code> number:</p>

		<CodeBlock
			code={`// Version 1 created
const v1 = new Asset({
  name: 'Photo', sourceUri: 'v1.jpg',
  mimeType: 'image/jpeg', typeSlug: 'image',
  statusSlug: 'published', version: 1
});
await v1.save();
// v1.primaryVersionId = v1.id (self-reference)

// Version 2 -- chain via primaryVersionId
const v2 = new Asset({
  ...v1, slug: 'photo-v2', version: 2,
  primaryVersionId: v1.id,
  sourceUri: 'v2.jpg'
});
await v2.save();

// findVersions() to retrieve history
const history = await collection.findVersions(v1.id);`}
			language="typescript"
		/>

		<h3>2. Parent-Child Relationships (Derivatives)</h3>
		<p>Parallel processing variants for different purposes:</p>

		<CodeBlock
			code={`// Original asset
const original = await assets.create({
  name: 'Original Photo',
  sourceUri: 's3://bucket/original.jpg'
});

// Create thumbnail derivative
const thumbnail = await assets.create({
  name: 'Original Photo Thumbnail',
  sourceUri: 's3://bucket/original-thumb.jpg',
  parentId: original.id
});

// Get all derivatives
const derivatives = await original.getChildren();

// Navigate back
const parent = await thumbnail.getParent();`}
			language="typescript"
		/>

		<h3>3. Asset Types and Statuses</h3>
		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Use Case</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>image</code></td>
					<td>Image files (JPEG, PNG, etc.)</td>
				</tr>
				<tr>
					<td><code>video</code></td>
					<td>Video files (MP4, MOV, etc.)</td>
				</tr>
				<tr>
					<td><code>document</code></td>
					<td>Document files (PDF, DOCX, etc.)</td>
				</tr>
				<tr>
					<td><code>audio</code></td>
					<td>Audio files (MP3, WAV, etc.)</td>
				</tr>
			</tbody>
		</table>

		<table>
			<thead>
				<tr>
					<th>Status</th>
					<th>Meaning</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>draft</code></td>
					<td>Work in progress</td>
				</tr>
				<tr>
					<td><code>published</code></td>
					<td>Live and available</td>
				</tr>
				<tr>
					<td><code>archived</code></td>
					<td>No longer active</td>
				</tr>
				<tr>
					<td><code>deleted</code></td>
					<td>Marked for deletion</td>
				</tr>
			</tbody>
		</table>

		<h3>4. Metadata System</h3>
		<p>Controlled vocabulary with validation:</p>

		<CodeBlock
			code={`// Define metadata field
const widthField = new AssetMetafield({
  slug: 'width',
  name: 'Width',
  validation: JSON.stringify({
    type: 'integer',
    minimum: 0,
    maximum: 10000
  })
});

// Validation examples
// { type: 'integer', minimum: 0, maximum: 10000 }
// { type: 'string', enum: ['portrait', 'landscape', 'square'] }
// { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }`}
			language="typescript"
		/>

		<h3>5. Hierarchical Tagging</h3>
		<CodeBlock
			code={`// Hierarchical tag structure
// category/products/shoes
// category/products/clothing
// featured/homepage
// featured/social-media

await assets.addTag(asset.id, 'category/products/shoes');
await assets.addTag(asset.id, 'featured/homepage');

// Query by tag
const products = await assets.getByTag('category/products');
const featured = await assets.getByTag('featured/homepage');`}
			language="typescript"
		/>
	</section>

	<section id="ai-features">
		<h2>AI-Powered Features</h2>
		<p>
			Assets inherit <code>is()</code> and <code>do()</code> from SmrtObject (smrt-core).
			Image-specific AI features (alt text generation, categorization) are provided by the
			<a href="/modules/smrt-images">smrt-images</a> package, which extends Asset via STI.
		</p>

		<h3>Content Analysis (via smrt-core)</h3>
		<CodeBlock
			code={`// Boolean validation (is)
const isHighQuality = await asset.is('a high-quality product image');

// Generate descriptions (do)
const description = await asset.do('generate a brief caption');`}
			language="typescript"
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: E-Commerce Product Images</h3>

		<h4>Step 1: Create Master Image</h4>
		<CodeBlock
			code={`const master = await images.create({
  name: 'Sneaker Model XYZ - White',
  slug: 'sneaker-xyz-white',
  sourceUri: 's3://products/sneakers/xyz-white.jpg',
  mimeType: 'image/jpeg',
  width: 2560,
  height: 1920,
  typeSlug: 'product-image',
  statusSlug: 'published'
});`}
			language="typescript"
		/>

		<h4>Step 2: Create Responsive Derivatives</h4>
		<CodeBlock
			code={`const sizes = [
  { slug: 'thumb', width: 150, height: 150 },
  { slug: 'preview', width: 400, height: 300 },
  { slug: 'full', width: 1000, height: 750 }
];

for (const size of sizes) {
  const deriv = new Asset({
    name: master.name + ' - ' + size.slug,
    slug: master.slug + '-' + size.slug,
    sourceUri: 's3://products/sneakers/xyz-' + size.slug + '.jpg',
    mimeType: 'image/jpeg',
    width: size.width,
    height: size.height,
    parentId: master.id,
    typeSlug: 'product-image',
    statusSlug: 'published'
  });
  await deriv.save();
}`}
			language="typescript"
		/>

		<h4>Step 3: Tag and Organize</h4>
		<CodeBlock
			code={`await assets.addTag(master.id, 'category/products/shoes');
await assets.addTag(master.id, 'brand/nike');
await assets.addTag(master.id, 'featured/homepage');`}
			language="typescript"
		/>

		<h3>Tutorial 2: AssetStore Pipeline</h3>

		<CodeBlock
			code={`import { AssetStore } from '@happyvertical/smrt-assets';

// AssetStore provides provider-agnostic file I/O
const store = new AssetStore({ collection, filesystem });

// Store writes buffer to storage and creates Asset record
const asset = await store.store({
  buffer: fileBuffer,
  mimeType: 'image/png',
  name: 'screenshot'
});

// Use Folder STI subclass for organization
const folder = new Folder({
  name: 'Product Images',
  slug: 'product-images'
});
await folder.save();`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with Other Modules</h2>

		<h3>smrt-core</h3>
		<ul>
			<li>Asset extends <strong>SmrtObject</strong> for persistence</li>
			<li>STI support (Folder subclass)</li>
			<li>Auto-generated REST API, CLI, MCP tools</li>
		</ul>

		<h3>smrt-tags</h3>
		<CodeBlock
			code={`// Hierarchical organization
await assets.addTag(assetId, 'media-type/image/product');
await assets.addTag(assetId, 'usage/ecommerce');
await assets.addTag(assetId, 'quality/high-res');

const products = await assets.getByTag('media-type/image/product');`}
			language="typescript"
		/>

		<h3>AssetStore (Provider-Agnostic File I/O)</h3>
		<CodeBlock
			code={`import { AssetStore } from '@happyvertical/smrt-assets';

// AssetStore writes buffers to storage and creates Asset records
const store = new AssetStore({ collection, filesystem });
await store.store({ buffer, mimeType: 'image/png', name: 'screenshot' });

// Storage-agnostic sourceUri formats
sourceUri: 's3://my-bucket/images/image.jpg'
sourceUri: 'file:///var/assets/image.jpg'
sourceUri: 'gs://my-bucket/images/image.jpg'
sourceUri: 'https://cdn.example.com/images/image.jpg'`}
			language="typescript"
		/>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>1. Asset Naming</h3>
		<CodeBlock
			code={`// Good: descriptive, semantic slugs
'product-photo-nike-shoes-white-001'
'blog-hero-smrt-framework-2024'
'screenshot-setup-step-03'

// Bad: generic names
'image1', 'photo', 'asset-123'`}
			language="typescript"
		/>

		<h3>2. Version vs Derivative Strategy</h3>
		<CodeBlock
			code={`// Use versions for:
// - Content/source URI changes
// - Tracking historical changes
// - Example: replacing outdated marketing image

// Use derivatives for:
// - Different sizes (responsive images)
// - Format conversions (JPEG, WebP, AVIF)
// - Quality levels (high-res, compressed)
// - Crops or effects`}
			language="typescript"
		/>

		<h3>3. Metadata Best Practices</h3>
		<CodeBlock
			code={`// Define fields with validation upfront
const widthField = await metafields.getOrCreate('width', 'Width', {
  type: 'integer',
  minimum: 0,
  maximum: 10000
});

// Then use validated metadata
metadata.width = 1920;  // Validated

// Avoid arbitrary metadata
metadata.w = 'really big';  // ✗ No validation`}
			language="typescript"
		/>

		<h3>4. Query Optimization</h3>
		<CodeBlock
			code={`// Good: Filter early in query
const images = await assets.list({
  where: {
    typeSlug: 'image',
    statusSlug: 'published',
    ownerProfileId: userId
  }
});

// Avoid: Load everything then filter
const allAssets = await assets.list({});
const filtered = allAssets.filter(a => a.typeSlug === 'image');`}
			language="typescript"
		/>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Image dimensions not saved</h3>
		<p><strong>Solution:</strong> Use collection.create()</p>
		<CodeBlock
			code={`// Good
const image = await images.create({
  name: 'test.jpg',
  width: 1920,
  mimeType: 'image/jpeg'
});

// Or ensure required fields
image.typeSlug = 'image';
image.statusSlug = 'published';
await image.save();`}
			language="typescript"
		/>

		<h3>Query returns empty results</h3>
		<p><strong>Solution:</strong> Initialize types and statuses</p>
		<CodeBlock
			code={`await types.initializeCommonTypes();
await statuses.initializeCommonStatuses();

// Then query
const images = await assets.getByType('image');`}
			language="typescript"
		/>

		<h3>Version tracking confusion</h3>
		<p><strong>Solution:</strong> primaryVersionId always points to first version</p>
		<CodeBlock
			code={`const v1 = await assets.create({...});  // primaryVersionId = v1.id
const v2 = await assets.createNewVersion(v1.id, 'v2.jpg');
// v2.primaryVersionId = v1.id

// Get all versions
const history = await assets.listVersions(v1.id);`}
			language="typescript"
		/>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Asset Class</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>getTags()</code></td>
					<td><code>Promise&lt;Tag[]&gt;</code></td>
					<td>Get all tags</td>
				</tr>
				<tr>
					<td><code>hasTag(slug)</code></td>
					<td><code>Promise&lt;boolean&gt;</code></td>
					<td>Check if has tag</td>
				</tr>
				<tr>
					<td><code>getParent()</code></td>
					<td><code>Promise&lt;Asset | null&gt;</code></td>
					<td>Get parent asset</td>
				</tr>
				<tr>
					<td><code>getChildren()</code></td>
					<td><code>Promise&lt;Asset[]&gt;</code></td>
					<td>Get derivative assets</td>
				</tr>
				<tr>
					<td><code>is(condition)</code></td>
					<td><code>Promise&lt;boolean&gt;</code></td>
					<td>AI validation</td>
				</tr>
				<tr>
					<td><code>do(action)</code></td>
					<td><code>Promise&lt;string&gt;</code></td>
					<td>AI action</td>
				</tr>
			</tbody>
		</table>

		<h3>Other Models</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>AssetAssociation</code></td>
					<td>Polymorphic join: assetId + metaType + metaId + role + sortOrder</td>
				</tr>
				<tr>
					<td><code>AssetType</code></td>
					<td>Lookup table for asset type classification</td>
				</tr>
				<tr>
					<td><code>AssetStatus</code></td>
					<td>Lookup table for lifecycle status</td>
				</tr>
				<tr>
					<td><code>AssetMetafield</code></td>
					<td>Custom metadata field definitions with JSON validation rules</td>
				</tr>
				<tr>
					<td><code>Folder</code></td>
					<td>STI subclass of Asset (typeSlug='folder') for hierarchical organization</td>
				</tr>
			</tbody>
		</table>

		<h3>Collections</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>AssetCollection</code></td>
					<td>CRUD for Asset</td>
				</tr>
				<tr>
					<td><code>AssetAssociationCollection</code></td>
					<td>CRUD for AssetAssociation</td>
				</tr>
				<tr>
					<td><code>AssetTypeCollection</code></td>
					<td>CRUD for AssetType</td>
				</tr>
				<tr>
					<td><code>AssetStatusCollection</code></td>
					<td>CRUD for AssetStatus</td>
				</tr>
				<tr>
					<td><code>AssetMetafieldCollection</code></td>
					<td>CRUD for AssetMetafield</td>
				</tr>
				<tr>
					<td><code>FolderCollection</code></td>
					<td>CRUD for Folder</td>
				</tr>
			</tbody>
		</table>

		<h3>Utilities</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>AssetStore</code></td>
					<td>Provider-agnostic file I/O that writes buffers to storage and creates Asset records</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> - SmrtObject, STI support</li>
			<li><a href="/modules/smrt-tags">smrt-tags</a> - Tag integration (addTag/removeTag)</li>
			<li><a href="/modules/smrt-images">smrt-images</a> - Image ops, AI categorization (extends Asset via STI)</li>
			<li><a href="/modules/smrt-tenancy">smrt-tenancy</a> - Optional tenant scoping</li>
		</ul>
	</section>
</ModulePage>

<style>
	section {
		margin-bottom: 3rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid #e5e5e5;
	}

	th {
		font-weight: 600;
		background-color: #f5f5f5;
	}

	code {
		background-color: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.diagram {
		background-color: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.diagram pre {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	h2 {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e5e5;
	}

	h3 {
		margin-top: 1.5rem;
	}

	h4 {
		margin-top: 1rem;
		font-size: 1rem;
	}
</style>
