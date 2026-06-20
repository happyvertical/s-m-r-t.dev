<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-assets-local"
	description="Local Sharp/EXIF processing adapter for the SMRT asset runtime. Deterministic variant generation, EXIF normalization, and local storage — without dragging Sharp into core."
	badges={['v0.29.32', 'Asset Adapter', 'Sharp + EXIF', 'Local Processing']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-assets-local</strong> is the lightweight local processing adapter for the SMRT
			asset runtime. It handles work that does not require a MAM or cloud processor: image metadata
			extraction, EXIF normalization, auto-orientation, dimensions, and standard image variants. It
			exists as a separate package so <code>smrt-assets</code> core stays free of Sharp and EXIF dependencies.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Local image metadata extraction (dimensions, EXIF, GPS)</li>
				<li>Auto-orientation normalization before reporting dimensions</li>
				<li>Decimal GPS coordinates preserved at full precision</li>
				<li>
					Deterministic variant generation (<code>thumb</code>, <code>card</code>,
					<code>preview</code>, <code>publish</code>)
				</li>
				<li>Cache-aware reuse of matching derived assets</li>
				<li>Variant lineage metadata back to the source asset</li>
				<li>Local storage backend — bytes stay on the host filesystem</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-assets-local`} language="bash" />
		<p>
			Pulls in <code>sharp</code> and EXIF parsing libraries. The core
			<code>@happyvertical/smrt-assets</code> package stays free of these so apps that don't need local
			processing can skip the heavy native dependency.
		</p>
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { createLocalAssetProcessor } from '@happyvertical/smrt-assets-local';
import { createAssetRuntime } from '@happyvertical/smrt-assets';

// createLocalAssetProcessor() returns an AssetCapabilityProvider.
// Register it with the asset runtime as a capability provider.
const runtime = await createAssetRuntime({
  db,
  storage: '/var/lib/smrt/assets',  // local filesystem basePath (or @happyvertical/files options)
  capabilityProviders: [
    createLocalAssetProcessor({
      quality: 82,  // WebP quality (default 82)
      // Optional: per-variant size overrides
      variants: {
        thumb:   { width: 200,  height: 200,  fit: 'cover' },
        card:    { width: 600,  height: 400,  fit: 'cover' },
        preview: { width: 1200, height: 800,  fit: 'inside' },
        publish: { width: 2400, height: 1600, fit: 'inside' },
      },
    }),
  ],
});

// (Alternatively, register after construction:)
// runtime.registerCapabilityProvider(createLocalAssetProcessor());

// Extract metadata + generate variants for a newly uploaded Asset.
// processAsset() takes the Asset instance, not its id.
await runtime.processAsset(asset);

// Ensure a specific variant exists (idempotent). The request is an
// AssetVariantRequest object keyed by variant name.
const result = await runtime.ensureVariant(asset, { variant: 'thumb' });`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Image Metadata Extraction</h2>
		<p>
			The adapter normalizes orientation before reporting dimensions and preserves GPS precision:
		</p>
		<CodeBlock
			code={`// extractAssetImageMetadataFromBuffer() returns a NormalizedAssetImageMetadata:
{
  width: 4032,          // After orientation normalization (or null)
  height: 3024,         // (or null)
  mimeType: 'image/jpeg',                      // (or null)
  capturedAt: '2024-08-15T14:23:11.000Z',      // Stable ISO format (or null)
  gps: {
    latitude: 40.7484405,    // Decimal, NOT rounded
    longitude: -73.9856644,
  },                          // (or null when no GPS present)
}

// processAsset() persists this on the asset's metadata sidecar under
// imageMetadata (with an imageMetadataUpdatedAt timestamp).`}
			language="json"
		/>
		<p>
			<strong>Note:</strong> GPS coordinates are preserved at full precision because nearby-photo search
			depends on it.
		</p>
	</section>

	<section>
		<h2>Variant Generation</h2>
		<p>Variant generation is deterministic for the same source version and request parameters:</p>
		<CodeBlock
			code={`// Standard variant names (shared SMRT vocabulary):
//   thumb   - small square preview   (default 160x160 cover)
//   card    - card-format preview    (default 480x270 cover)
//   preview - in-app preview size    (default 960x960 inside)
//   publish - distribution-ready out (default 1200x630 cover)
// Generated variants are always encoded as WebP.

// Deterministic for the same (source version, variant params):
const v1 = await runtime.ensureVariant(asset, { variant: 'thumb' });
const v2 = await runtime.ensureVariant(asset, { variant: 'thumb' });
// v2.source === 'cached' and v2.asset.id === v1.asset.id (cache reuse)

// Each result is an AssetVariantResult: { asset, variant, source, url, metadata }.
// Variants preserve lineage back to the source asset under
// the derived asset's metadata.assetVariant entry:
const lineage = v1.asset.getMetadata().assetVariant;
console.log(lineage.sourceAssetId);   // === asset.id
console.log(lineage.sourceVersion);   // version of source at variant time`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Runtime Role</h2>
		<p>
			The adapter implements provider capabilities such as <code>processAsset</code> and
			<code>ensureVariant</code>. It does <em>not</em> own asset identity, tenant policy, or
			publishing decisions — those belong in <code>@happyvertical/smrt-assets</code> and the host app.
		</p>
		<p>
			Generated bytes are local outputs. Callers may still choose to sync them to Ergot later via
			<code>@happyvertical/smrt-assets-ergot</code>.
		</p>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>
					Use the shared variant names (<code>thumb</code>, <code>card</code>, <code>preview</code>,
					<code>publish</code>)
				</li>
				<li>
					Return extraction failures as status + error metadata — let the host decide what to
					display
				</li>
				<li>Keep the provider deterministic enough for CI and local development to agree</li>
				<li>Build tiny fixture images in memory for tests; avoid checked-in binary fixtures</li>
				<li>Prefer cache reuse when a matching derived asset already exists</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't add Ergot-specific behavior here — use <code>smrt-assets-ergot</code></li>
				<li>Don't call dashboard APIs from this package</li>
				<li>Don't silently drop extraction failures</li>
				<li>Don't round GPS coordinates — nearby-photo search depends on precision</li>
				<li>Don't import Sharp from <code>smrt-assets</code> core — it must stay light</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>Asset core: identity, runtime, tenant policy</p>
			</a>
			<a href="/modules/smrt-assets-ergot">
				<h3>smrt-assets-ergot</h3>
				<p>Ergot MAM adapter for cloud processing</p>
			</a>
			<a href="/modules/smrt-images">
				<h3>smrt-images</h3>
				<p>Image ops, AI categorization, cross-package STI extending Asset</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content-owned asset joins via <code>content_assets</code></p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
