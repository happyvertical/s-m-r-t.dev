<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage 
	name="smrt-assets" 
	description="Production-grade asset management with versioning, derivatives, hierarchical tagging, and AI-powered operations."
	badges={['v0.19.0', 'Asset Management', 'AI-Powered']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-assets</code> package provides sophisticated asset
			organization, versioning, and lifecycle management built on the SMRT framework.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>Flexible Asset Types</strong>: Images, videos, documents, audio with STI</li>
			<li><strong>Versioning System</strong>: Parent-child relationships for derivatives</li>
			<li><strong>Controlled Metadata</strong>: EAV pattern with validation</li>
			<li><strong>Hierarchical Tagging</strong>: Integration with smrt-tags</li>
			<li><strong>AI-Powered</strong>: Auto-generate alt text, descriptions, analysis</li>
			<li><strong>Storage Agnostic</strong>: Works with S3, local, CDN, etc.</li>
			<li><strong>Auto-Generated APIs</strong>: REST, CLI, MCP tools</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
┌─────────────────────────────────────────────┐
│        Asset Management System               │
├─────────────────────────────────────────────┤
│  SmrtObject (Base)                           │
│  • ORM capabilities                          │
│  • Auto-generated REST/CLI/MCP               │
│  • AI methods (is, do, describe)             │
├─────────────────────────────────────────────┤
│  Asset (Core Model)                          │
│  • name, slug, sourceUri                     │
│  • MIME type, versioning                     │
│  • parent/child relationships                │
│  • tag integration                           │
├─────────────────────────────────────────────┤
│  Image (Specialized)                         │
│  • width, height, alt text                   │
│  • aspect ratio calculations                 │
│  • AI alt text generation                    │
├─────────────────────────────────────────────┤
│  Collections                                 │
│  • AssetCollection - bulk operations         │
│  • ImageCollection - image queries           │
│  • Tag management                            │
│  • Version history                           │
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
			code={`import { AssetCollection, ImageCollection @happyvertical '@happyvertical/smrt-assets';

const assets = await AssetCollection.create({
  db: { type: \\'sqlite\\', url: \\'./assets.db\\' }
});

const images = await ImageCollection.create({
  db: { type: \\'sqlite\\', url: \\'./assets.db\\' }
});`}
			language="typescript"
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>1. Create Asset</h3>
		<CodeBlock
			code={`const asset = await assets.create({
  name: 'Product Photo',
  slug: 'product-photo-001',
  sourceUri: 's3://mybucket/products/photo.jpg',
  mimeType: 'image/jpeg',
  description: 'Main product photograph',
  typeSlug: 'image',
  statusSlug: 'published',
  version: 1
});`}
			language="typescript"
		/>

		<h3>2. Create Image with Dimensions</h3>
		<CodeBlock
			code={`const image = await images.create({
  name: 'hero-image.jpg',
  sourceUri: 'file:///images/hero.jpg',
  mimeType: 'image/jpeg',
  width: 1920,
  height: 1080,
  alt: 'Hero banner',
  typeSlug: 'image',
  statusSlug: 'published'
});

console.log(\`Aspect ratio: \${'${image.aspectRatio}\`);  // 1.777
console.log(\`Is landscape: \${'${image.isLandscape}\`);  // true`}
			language="typescript"
		/>

		<h3>3. Manage Versions</h3>
		<CodeBlock
			code={`// Create new version
const newVersion = await assets.createNewVersion(
  asset.id,
  's3://mybucket/products/photo-v2.jpg',
  { description: \\'Updated product photo\\' }
);

// Get latest version
const latest = await assets.getLatestVersion(asset.id);

// List all versions
const versions = await assets.listVersions(asset.id);`}
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
		<p>Track sequential evolution of assets:</p>

		<CodeBlock
			code={`// Version 1 created
const v1 = await assets.create({
  name: 'Photo',
  sourceUri: 'v1.jpg'
});
// primaryVersionId = v1.id

// Version 2 created
const v2 = await assets.createNewVersion(v1.id, 'v2.jpg');
// primaryVersionId = v1.id (same lineage)

// Get latest
const latest = await assets.getLatestVersion(v1.id);

// List history
const history = await assets.listVersions(v1.id);`}
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
{ type: \\'integer\\', minimum: 0, maximum: 10000 }
{ type: \\'string\\', enum: [\\'portrait\\', \\'landscape\\', \\'square\\'] }
{ type: \\'string\\', pattern: \\'^#[0-9A-Fa-f]{6}$\\' }`}
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

		<h3>Auto-Generate Alt Text</h3>
		<CodeBlock
			code={`const image = await images.get({ id: imageId });
const altText = await image.generateAltText();
image.alt = altText;
await image.save();`}
			language="typescript"
		/>

		<h3>Content Analysis</h3>
		<CodeBlock
			code={`// Boolean validation
const isHighQuality = await asset.is('a high-quality product image');
const isSafeForWork = await asset.is('appropriate for all audiences');
const containsPeople = await asset.is('contains human faces');

// Generate descriptions
const description = await asset.do('generate a brief caption');
const details = await asset.describe('what this image shows');`}
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
  { slug: \\'thumb\\', width: 150, height: 150 },
  { slug: \\'preview\\', width: 400, height: 300 },
  { slug: \\'full\\', width: 1000, height: 750 }
];

for (const size of sizes) {
  await images.create({
    name: \`\${'${master.name} - \${'${size.slug}\`,
    slug: \`\${'${master.slug}-\${'${size.slug}\`,
    sourceUri: \`s3://products/sneakers/xyz-\${'${size.slug}.jpg\`,
    mimeType: 'image/jpeg',
    width: size.width,
    height: size.height,
    parentId: master.id,
    typeSlug: 'product-image',
    statusSlug: 'published'
  });
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

		<h3>Tutorial 2: Auto-Processing Pipeline</h3>

		<CodeBlock
			code={`async function processUpload(file: File, userId: string) {
  // Create asset
  const asset = await assets.create({
    name: file.name,
    sourceUri: \`s3://uploads/\${'${file.name}\`,
    mimeType: file.type,
    typeSlug: detectAssetType(file.type),
    statusSlug: 'draft',
    ownerProfileId: userId
  });

  if (file.type.startsWith('image/')) {
    const image = asset as Image;

    // Generate alt text
    const altText = await image.generateAltText();
    image.alt = altText;

    // Validate quality
    const isHighQuality = await image.is(
      'high-quality image suitable for professional use'
    );

    image.statusSlug = isHighQuality ? 'published' : 'review';
    await image.save();
  }

  return asset;
}`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with Other Modules</h2>

		<h3>smrt-core</h3>
		<ul>
			<li>Asset extends <strong>SmrtObject</strong> for persistence</li>
			<li>STI support for Image specialization</li>
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

		<h3>Storage Backends</h3>
		<CodeBlock
			code={`// Storage-agnostic sourceUri
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

		<h3>Image Class</h3>
		<table>
			<thead>
				<tr>
					<th>Property/Method</th>
					<th>Type/Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>width</code></td>
					<td><code>number</code></td>
					<td>Image width in pixels</td>
				</tr>
				<tr>
					<td><code>height</code></td>
					<td><code>number</code></td>
					<td>Image height in pixels</td>
				</tr>
				<tr>
					<td><code>aspectRatio</code></td>
					<td><code>number</code></td>
					<td>Computed width / height</td>
				</tr>
				<tr>
					<td><code>isLandscape</code></td>
					<td><code>boolean</code></td>
					<td>Computed width > height</td>
				</tr>
				<tr>
					<td><code>generateAltText()</code></td>
					<td><code>Promise&lt;string&gt;</code></td>
					<td>AI alt text generation</td>
				</tr>
			</tbody>
		</table>

		<h3>AssetCollection</h3>
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
					<td><code>getByType(slug)</code></td>
					<td><code>Promise&lt;Asset[]&gt;</code></td>
					<td>Filter by type</td>
				</tr>
				<tr>
					<td><code>getByStatus(slug)</code></td>
					<td><code>Promise&lt;Asset[]&gt;</code></td>
					<td>Filter by status</td>
				</tr>
				<tr>
					<td><code>getByTag(slug)</code></td>
					<td><code>Promise&lt;Asset[]&gt;</code></td>
					<td>Filter by tag</td>
				</tr>
				<tr>
					<td><code>createNewVersion(id, uri, updates?)</code></td>
					<td><code>Promise&lt;Asset&gt;</code></td>
					<td>Create new version</td>
				</tr>
				<tr>
					<td><code>getLatestVersion(id)</code></td>
					<td><code>Promise&lt;Asset | null&gt;</code></td>
					<td>Get latest version</td>
				</tr>
				<tr>
					<td><code>listVersions(id)</code></td>
					<td><code>Promise&lt;Asset[]&gt;</code></td>
					<td>List all versions</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> - SmrtObject, STI support</li>
			<li><a href="/modules/smrt-tags">smrt-tags</a> - Hierarchical tagging</li>
			<li><a href="/modules/smrt-content">smrt-content</a> - Content management</li>
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
