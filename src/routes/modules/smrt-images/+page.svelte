<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-images"
	description="Image asset management with AI-powered categorization, editing, metadata extraction, and cross-package STI extending Asset."
	badges={['v0.20.44', 'AI Categorization', 'Image Editing', 'STI Asset']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-images</strong> extends the base Asset model from smrt-assets via cross-package
			STI, adding image-specific dimensions, AI-powered categorization, editing operations, and
			metadata extraction. Each editing operation creates a new derivative Image linked to its
			source via <code>parentId</code>.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Cross-package STI: Image extends Asset (stored in same <code>assets</code> table)</li>
				<li>AI categorization with auto-tagging, description, and confidence scoring</li>
				<li>Image editing: resize, crop, convert, thumbnail, and AI-powered edits</li>
				<li>Dimension-based queries: landscape, portrait, square, high-resolution</li>
				<li>Metadata extraction: dimensions, format, EXIF data</li>
				<li>External provider import with provenance tracking</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-images`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Image, ImageCollection,
  ImageCategorizer, ImageEditor, ImageDeriver,
  ImageMetadataExtractor, ImageSearch, UpstreamManager,
} from '@happyvertical/smrt-images';

// Create and query images
const images = new ImageCollection(db);
const image = await images.create({
  name: 'hero.jpg',
  url: 'https://cdn.example.com/hero.jpg',
  mimeType: 'image/jpeg',
  width: 1920,
  height: 1080,
});
await image.save();

// Computed properties from dimensions
image.isLandscape;  // true
image.aspectRatio;  // 1.778
image.isHighResolution();  // false (below 4K)

// AI-powered categorization
const categorizer = new ImageCategorizer({ ai: aiConfig });
const result = await categorizer.categorize(image);
// Auto-tag: applies tags and sets description/alt text
await categorizer.autoTag(image, assetCollection);

// AI alt text generation via this.do()
const altText = await image.generateAltText();

// Standard editing (each creates a derivative Image)
const editor = new ImageEditor(store, images, { ai: aiConfig });
const thumb = await editor.thumbnail(image, 256);
const resized = await editor.resize(image, 800, 600);
const webp = await editor.convert(image, 'webp');

// AI-powered editing and variation generation
const edited = await editor.edit(image, 'add warm sunset tones');
const variations = await editor.generateVariation(
  image, 'winter theme', { count: 3 }
);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Image (STI subclass of Asset)</h3>
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
  generateAltText(): Promise<string>  // AI via this.do()
}`}
			language="typescript"
		/>

		<h3>ImageCollection</h3>
		<CodeBlock
			code={`class ImageCollection extends SmrtCollection<Image> {
  getByMinDimensions(width: number, height: number): Promise<Image[]>
  getByAspectRatio(ratio: number, tolerance?: number): Promise<Image[]>
  getLandscape(): Promise<Image[]>
  getPortrait(): Promise<Image[]>
  getSquare(): Promise<Image[]>
  getHighResolution(): Promise<Image[]>
  getMissingAltText(): Promise<Image[]>
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Services</h2>
		<CodeBlock
			code={`// ImageCategorizer: AI vision analysis
const categorizer = new ImageCategorizer({ ai: aiConfig });
const result = await categorizer.categorize(image);
// Returns: { tags, description, confidence, subjects }

// ImageEditor: resize/crop/convert + AI editing
// Each operation creates a new Image linked via parentId
const editor = new ImageEditor(store, images, { ai: aiConfig });

// ImageMetadataExtractor: dimensions, format, EXIF
const extractor = new ImageMetadataExtractor();
const meta = await extractor.extract(imageBuffer);

// ImageSearch: text search with orientation filters
const search = new ImageSearch(images);
const results = await search.find({ query: 'sunset', orientation: 'landscape' });

// UpstreamManager: import from external providers
const upstream = new UpstreamManager(images, store);
await upstream.importFromSource(sourceAdapter, { provenance: true });`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>generateAltText()</code> to ensure accessibility for all images</li>
				<li>Use <code>autoTag()</code> for consistent AI categorization</li>
				<li>Create derivatives through ImageEditor (maintains parentId chain)</li>
				<li>Use dimension-based queries for responsive image selection</li>
				<li>Track provenance when importing from external sources</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't modify the Asset schema without considering cross-package STI impact</li>
				<li>Don't create Image instances directly (use ImageEditor for derivatives)</li>
				<li>Don't assume orientation filtering is indexed (it's in-memory)</li>
				<li>Don't skip the 3 DB calls for derivative creation (create + store + save)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>Base Asset model and AssetStore</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content with asset associations</p>
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
