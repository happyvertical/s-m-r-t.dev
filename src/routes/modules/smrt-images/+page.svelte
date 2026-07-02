<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-images"
	description="Image management with AI categorization, alt-text via smrt-prompts, editor/deriver helpers, and a UI registry — Image extends Asset via cross-package STI."
	badges={['v0.29.34', 'Cross-Package STI', 'Prompt Registry', 'UI Registry']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-images</code> models <code>Image</code> as a cross-package STI
			subclass of <code>Asset</code> (from <a href="/modules/smrt-assets">smrt-assets</a>) — stored
			in the same <code>assets</code> table with <code>_meta_type='Image'</code>. It adds
			<code>width</code>, <code>height</code>, and <code>alt</code>, plus services for editing,
			derivation, AI categorization, metadata extraction, and search.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>
				Cross-package STI: <code>Image</code> extends <code>Asset</code> (shared table, qualified discriminator)
			</li>
			<li>AI alt-text via <code>generateAltText()</code> through the smrt-prompts registry</li>
			<li>
				<code>ImageCategorizer</code>: AI vision analysis → tags, description, confidence, subjects
			</li>
			<li>
				<code>ImageEditor</code>: resize / crop / convert / thumbnail / AI edits — derivatives
				linked via <code>parentId</code>
			</li>
			<li>
				<code>ImageDeriver</code>: AI-generated derivations; records source provenance via
				<code>AssetAssociation</code>
			</li>
			<li>
				<code>ImageMetadataExtractor</code>: dimensions, format, EXIF (via
				<code>@happyvertical/images</code>)
			</li>
			<li><code>ImageSearch</code>: text search with orientation filters</li>
			<li><code>UpstreamManager</code>: import from external providers with provenance tracking</li>
			<li>
				UI registry: <code>assets-gallery</code>, <code>image-editor</code>,
				<code>image-uploader</code> slots
			</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-images`} language="bash" />
		<CodeBlock code={`npm install @happyvertical/smrt-images`} language="bash" />
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Image, ImageCollection,
  ImageCategorizer, ImageEditor, ImageDeriver,
  ImageMetadataExtractor, ImageSearch, UpstreamManager,
} from '@happyvertical/smrt-images';
import { createAssetRuntime, ASSET_ROLES } from '@happyvertical/smrt-assets';

// Recommended: share an AssetRuntime across image + content + agents
const runtime = await createAssetRuntime({ db, storage });

// Create and query images
const images = new ImageCollection(db);
const image = await images.create({
  name: 'hero.jpg',
  sourceUri: 'https://cdn.example.com/hero.jpg',
  mimeType: 'image/jpeg',
  width: 1920,
  height: 1080,
});
await image.save();

// Computed properties from dimensions
image.isLandscape;       // true
image.aspectRatio;       // 1.778
image.isHighResolution();// false (below 4K)

// AI categorization
const categorizer = new ImageCategorizer({ ai });
const result = await categorizer.categorize(image);
await categorizer.autoTag(image, assetCollection);

// AI alt-text (via smrt-prompts)
const altText = await image.generateAltText();

// Editing -- each call creates a derivative Image linked via parentId.
// ImageEditor takes (store, collection, { ai? }); use runtime.store.
const editor = new ImageEditor(runtime.store, images, { ai });
const thumb   = await editor.thumbnail(image, 256);
const resized = await editor.resize(image, 800, 600);
const webp    = await editor.convert(image, 'webp');
const edited  = await editor.edit(image, 'add warm sunset tones');
const variations = await editor.generateVariation(image, 'winter theme', { count: 3 });`}
			language="typescript"
		/>
	</section>

	<section id="core-models">
		<h2>Core Models</h2>

		<h3>Image — cross-package STI subclass of Asset</h3>
		<p>
			Stored in the same <code>assets</code> table managed by
			<a href="/modules/smrt-assets">smrt-assets</a>. The STI discriminator is the qualified name:
			<code>@happyvertical/smrt-images:Image</code>.
		</p>
		<CodeBlock
			code={`class Image extends Asset {
  width: number
  height: number
  alt?: string

  // Computed properties
  get isLandscape(): boolean
  get isPortrait(): boolean
  get isSquare(): boolean
  get aspectRatio(): number
  isHighResolution(): boolean

  // AI via smrt-prompts (see Prompt Registry below)
  generateAltText(): Promise<string>
}`}
			language="typescript"
		/>

		<h3>ImageCollection</h3>
		<CodeBlock
			code={`class ImageCollection extends SmrtCollection<Image> {
  getByMinDimensions(width: number, height: number): Promise<Image[]>
  getByMaxDimensions(width: number, height: number): Promise<Image[]>
  getByAspectRatio(minRatio: number, maxRatio: number): Promise<Image[]>
  getLandscape(): Promise<Image[]>
  getPortrait(): Promise<Image[]>
  getSquare(): Promise<Image[]>
  getHighResolution(): Promise<Image[]>
  getMissingAltText(): Promise<Image[]>
}`}
			language="typescript"
		/>
	</section>

	<section id="services">
		<h2>Services</h2>
		<CodeBlock
			code={`// ImageCategorizer: AI vision analysis (tags, description, confidence, subjects)
const categorizer = new ImageCategorizer({ ai });
const result = await categorizer.categorize(image);

// ImageEditor: resize/crop/convert/thumbnail + AI edits, all create new Image
// records linked via parentId. Constructor: (store, collection, { ai? })
const editor = new ImageEditor(runtime.store, images, { ai });

// ImageDeriver: AI-generated derivations -- records provenance via AssetAssociation.
// Constructor: (store, collection, { ai }); derive() takes source images + a prompt.
const deriver = new ImageDeriver(runtime.store, images, { ai });
const derived = await deriver.derive([image], 'storybook style', { count: 1 });
// To also link sources via AssetAssociation, use deriveWithAssociations():
// await deriver.deriveWithAssociations([image], 'storybook style', associations);

// ImageMetadataExtractor: dimensions, format, EXIF
const extractor = new ImageMetadataExtractor();
const meta = await extractor.extract(imageBuffer);

// ImageSearch: text search with orientation filters.
// Constructor: (collection); search(query, options) — also findSimilar() / findByPrompt()
const search = new ImageSearch(images);
const results = await search.search('sunset', { orientation: 'landscape' });

// UpstreamManager: import from external providers.
// Constructor: (sources[], store, collection)
const upstream = new UpstreamManager([sourceAdapter], runtime.store, images);
const found = await upstream.search('mountains', { limit: 20 });
const imported = await upstream.import(found[0]);`}
			language="typescript"
		/>
	</section>

	<section id="prompt-registry">
		<h2>Prompt Registry</h2>
		<p>
			<code>Image.generateAltText()</code> is registered with
			<a href="/modules/smrt-prompts"><code>@happyvertical/smrt-prompts</code></a> so tenants can
			override template, model, or parameters at runtime. The method calls
			<code>resolvePrompt()</code> then dispatches through <code>getAiClient().message()</code>.
		</p>

		<CodeBlock
			code={`import { smrtImagesGenerateAltTextPrompt } from '@happyvertical/smrt-images';
// key: 'smrtImages.image.generateAltText'`}
			language="typescript"
		/>

		<h3>PII contract</h3>
		<p>Only non-PII metadata fields are passed to the AI provider:</p>
		<table>
			<thead>
				<tr><th>Allow-listed</th><th>Excluded</th><th>Reason</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>name</code></td><td><code>sourceUri</code></td><td
						>May embed signed/private bucket paths</td
					></tr
				>
				<tr
					><td><code>description</code></td><td><code>parentId</code>, <code>tenantId</code></td><td
						>Internal foreign-key fields</td
					></tr
				>
				<tr
					><td></td><td><code>metadata</code> (the JSON blob)</td><td
						>May contain EXIF GPS data or tenant-private configuration</td
					></tr
				>
			</tbody>
		</table>
	</section>

	<section id="ui-registry">
		<h2>UI Registry</h2>
		<p>
			Svelte components auto-register with <code>ModuleUIRegistry</code> on import of
			<code>@happyvertical/smrt-images/svelte</code>. UI slot declarations live in
			<code>src/ui.ts</code> and are exported via <code>@happyvertical/smrt-images/ui</code>.
		</p>

		<CodeBlock
			code={`import '@happyvertical/smrt-images/svelte'; // side-effect: ModuleUIRegistry.register(...)
import { ModuleUIRegistry } from '@happyvertical/smrt-ui';

const Gallery = ModuleUIRegistry.get('@happyvertical/smrt-images', 'assets-gallery');`}
			language="typescript"
		/>

		<table>
			<thead>
				<tr><th>Slot ID</th><th>Component</th><th>Purpose</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>assets-gallery</code></td><td><code>AssetsGallery.svelte</code></td><td
						>Image gallery list</td
					></tr
				>
				<tr
					><td><code>image-editor</code></td><td><code>ImageEditor.svelte</code></td><td
						>Inline editor surface</td
					></tr
				>
				<tr
					><td><code>image-uploader</code></td><td><code>ImageUploader.svelte</code></td><td
						>Upload form</td
					></tr
				>
			</tbody>
		</table>
	</section>

	<section id="derivation">
		<h2>Derivation and provenance</h2>
		<p>
			Derivative creation is a 3-step flow: <code>collection.create()</code> →
			<code>store.storeFile()</code> → <code>save()</code>. Each derivative carries
			<code>parentId</code> pointing at the source. When <code>ImageDeriver</code> records
			provenance, it writes an <code>AssetAssociation</code> with role
			<code>ASSET_ROLES.DERIVATION_SOURCE</code>. Image derivation intentionally uses
			<code>AssetAssociation</code> rather than an owner-side join because there is no single canonical
			owner.
		</p>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>generateAltText()</code> for accessibility on all images</li>
				<li>Use <code>autoTag()</code> for consistent AI categorization</li>
				<li>
					Create derivatives through <code>ImageEditor</code> / <code>ImageDeriver</code> (maintains parentId
					+ provenance)
				</li>
				<li>
					Use dimension-based queries (<code>getLandscape()</code>,
					<code>getHighResolution()</code>) for responsive selection
				</li>
				<li>Share a single <code>AssetRuntime</code> across image, content, and agents</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't bypass the Editor's create flow (skips collection validation)</li>
				<li>Don't modify the Asset schema without considering cross-package STI</li>
				<li>Don't assume orientation filtering is indexed — it filters in memory</li>
				<li>
					Don't pass raw <code>metadata</code> blobs to AI prompts (may contain EXIF GPS / tenant-private
					data)
				</li>
			</ul>
		</article>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>Base Asset model + AssetRuntime + serveAsset()</p>
			</a>
			<a href="/modules/smrt-prompts">
				<h3>smrt-prompts</h3>
				<p>Tenant-overridable prompt registry</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content with content_assets join</p>
			</a>
			<a href="/modules/smrt-video">
				<h3>smrt-video</h3>
				<p>Video production using image assets</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>

<style>
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
</style>
