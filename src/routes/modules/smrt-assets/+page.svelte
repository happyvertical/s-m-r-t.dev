<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-assets"
	description="Provider-agnostic asset management with versioning, derivatives, an AssetRuntime + serveAsset() public surface, and a Svelte UI registry."
	badges={['v0.29.34', 'AssetRuntime', 'serveAsset()', 'STI Asset', 'UI Registry']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-assets</code> is the canonical asset layer for SMRT apps. It models
			<strong>Asset</strong> as an STI base with versioning, hierarchical derivatives, lookup
			tables, a generic <code>AssetAssociation</code> for provenance, and a <code>Folder</code>
			subclass for organisation. v0.24 promotes two new public surfaces: <code>AssetRuntime</code>
			for I/O and
			<code>serveAsset()</code> for HTTP delivery.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>
				<strong>STI Asset</strong>: base with <code>Folder</code> subclass; cross-package STI (Image extends
				Asset)
			</li>
			<li>
				<strong>Versioning</strong>: sequential via <code>primaryVersionId</code> chain +
				<code>version</code> number
			</li>
			<li>
				<strong>Derivatives</strong>: source/derived via <code>sourceAssetId</code> (renamed from
				<code>parentId</code>) for thumbnails, crops, format conversions
			</li>
			<li>
				<strong>AssetRuntime</strong>: bundles collection, association collection, and store with
				helpers for source/derived writes and extraction status
			</li>
			<li>
				<strong>serveAsset()</strong>: standard Web <code>Response</code> for SvelteKit, Hono, and any
				Node 18+ runtime
			</li>
			<li><strong>ASSET_ROLES</strong> vocabulary so cross-package tooling agrees on meaning</li>
			<li>
				<strong>Generic associations</strong>: <code>AssetAssociation</code> for provenance / non-owner
				links (image derivation, fact proofs)
			</li>
			<li>
				<strong>Ownership rule</strong>: base/domain-owned assets live on dedicated joins (<code
					>content_assets</code
				>, <code>profile_assets</code>, <code>event_assets</code>, <code>place_assets</code>,
				<code>product_assets</code>)
			</li>
			<li>
				<strong>UI registry</strong>: discoverable Svelte slots via
				<code>@happyvertical/smrt-assets/ui</code>
			</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
+---------------------------------------------+
|             Asset Public Surface            |
+---------------------------------------------+
|  Models                                      |
|  - Asset (STI base) + Folder subclass        |
|  - AssetType / AssetStatus (lookups)         |
|  - AssetMetafield (validation)               |
|  - AssetAssociation (generic/provenance)     |
+---------------------------------------------+
|  AssetRuntime  (createAssetRuntime)          |
|  - storeSourceAsset                          |
|  - storeDerivedAsset (sourceAssetId + role)  |
|  - linkDerivation                            |
|  - setExtractionStatus                       |
+---------------------------------------------+
|  Serving                                     |
|  - serveAsset(options) -> Web Response       |
|  - resolveAssetForServing(...) -> bytes      |
|  - remoteMode: proxy | redirect | error      |
+---------------------------------------------+
|  Ownership Joins (in consumer packages)      |
|  - content_assets, profile_assets, etc.      |
|  - asset_associations: generic/provenance    |
+---------------------------------------------+
			</pre>
		</div>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<CodeBlock code={`pnpm add @happyvertical/smrt-assets`} language="bash" />
		<CodeBlock code={`npm install @happyvertical/smrt-assets`} language="bash" />

		<h3>Imports</h3>
		<CodeBlock
			code={`import {
  Asset, AssetCollection,
  AssetAssociation, AssetAssociationCollection,
  AssetType, AssetStatus, AssetMetafield,
  Folder, FolderCollection,
  AssetStore,
  createAssetRuntime,
  serveAsset, resolveAssetForServing, AssetServeError,
  ASSET_ROLES, ASSET_METADATA_KEYS, ASSET_EXTRACTION_STATUS,
} from '@happyvertical/smrt-assets';`}
			language="typescript"
		/>
	</section>

	<section id="runtime-surface">
		<h2>AssetRuntime — the public runtime surface</h2>
		<p>
			Apps and agents should depend on <code>createAssetRuntime</code> instead of hand-wiring an
			<code>AssetCollection</code> and an <code>AssetStore</code> per-package (#1128). The runtime bundles
			collection, association collection, and an initialised store, and offers four high-level helpers.
		</p>

		<CodeBlock
			code={`import { createAssetRuntime, ASSET_ROLES } from '@happyvertical/smrt-assets';

const runtime = await createAssetRuntime({
  db: { type: 'sqlite', url: './data.db' },
  storage: { type: 's3', bucket: 'my-bucket', region: 'us-east-1' },
});

// 1) Store an upstream document as a source asset
const sourceDoc = await runtime.storeSourceAsset(
  'agenda.pdf',
  pdfBytes,
  { mimeType: 'application/pdf', typeSlug: 'document' },
);

// 2) Store a derivative -- automatically sets sourceAssetId + a provenance link
const pageImage = await runtime.storeDerivedAsset(
  sourceDoc,
  'agenda-page-1.png',
  pngBytes,
  { mimeType: 'image/png', role: ASSET_ROLES.DOCUMENT_IMAGE },
);

// 3) Record provenance only (no byte write)
await runtime.linkDerivation(sourceDoc, pageImage, {
  role: ASSET_ROLES.DERIVATION_SOURCE,
});

// 4) Write canonical extraction metadata into description JSON
await runtime.setExtractionStatus(sourceDoc, 'succeeded', {
  extractedAt: new Date(),
});`}
			language="typescript"
		/>

		<p>
			<code>setExtractionStatus</code> is non-destructive: if <code>description</code> is free-form
			prose or non-object JSON, the original value is preserved under the reserved <code>text</code>
			key. Existing JSON objects are merged into.
		</p>

		<p>
			Agents that need asset I/O should accept an <code>AssetRuntimeLike</code> in their options rather
			than asking callers to pass a store + collection separately.
		</p>
	</section>

	<section id="serving-contract">
		<h2>Serving contract — serveAsset()</h2>
		<p>
			<code>serveAsset</code> returns a standard Web <code>Response</code> with consistent status
			codes for missing assets, tenant mismatches, access denials, remote-origin failures, and store
			read errors. It works in SvelteKit <code>+server.ts</code>, Hono, and any Node 18+ runtime
			with a global <code>Response</code>. For older runtimes pass <code>responseCtor</code>.
		</p>

		<CodeBlock
			code={`// SvelteKit +server.ts
import { serveAsset } from '@happyvertical/smrt-assets';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const asset = await locals.runtime.collection.get(params.id);
  return serveAsset({
    runtime: locals.runtime,
    asset,
    tenantId: locals.tenantId,
    canAccess: (a) => locals.user.canRead(a),
    disposition: 'inline',
    remoteMode: 'error', // default; opt into 'proxy' | 'redirect' for remote sourceUri
  });
};`}
			language="typescript"
		/>

		<h3>Status semantics</h3>
		<table>
			<thead>
				<tr><th>Code</th><th>Trigger</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>200</code></td><td
						>Bytes returned; <code>Content-Type</code>, <code>Content-Length</code>,
						<code>Content-Disposition</code> set</td
					></tr
				>
				<tr
					><td><code>302</code></td><td
						><code>remoteMode: 'redirect'</code> and <code>sourceUri</code> is
						<code>http(s)</code></td
					></tr
				>
				<tr><td><code>403</code></td><td>Tenant mismatch or <code>canAccess()</code> denies</td></tr
				>
				<tr><td><code>404</code></td><td>Asset id doesn't resolve</td></tr>
				<tr
					><td><code>500</code></td><td
						>Store read error or unexpected failure (generic body; details logged)</td
					></tr
				>
				<tr
					><td><code>502</code></td><td><code>remoteMode: 'proxy'</code> and origin fetch failed</td
					></tr
				>
			</tbody>
		</table>

		<h3>Remote assets</h3>
		<p>
			Assets whose <code>sourceUri</code> is <code>http(s)</code> are supported via
			<code>remoteMode</code>:
			<code>'error'</code> (default) treats a remote URI as an error to avoid SSRF,
			<code>'proxy'</code> fetches and returns bytes (with SSRF guards), and <code>'redirect'</code>
			issues a 302 to the origin. Pass <code>fetchImpl</code> to swap the fetch client.
		</p>

		<h3>Header sanitisation</h3>
		<p>
			<code>Content-Disposition</code> filenames are sanitised (control characters stripped;
			<code>"</code>, <code>\</code>, <code>/</code> replaced) so untrusted asset names cannot
			inject headers. The 500 body is a generic <code>'Internal error serving asset'</code>;
			underlying errors are logged via <code>console.error</code> so operators can debug without leaking
			paths/bucket names to clients.
		</p>

		<h3>Bring-your-own response shell</h3>
		<CodeBlock
			code={`import { resolveAssetForServing, AssetServeError } from '@happyvertical/smrt-assets';

try {
  const { asset, data, contentType, filename, size } = await resolveAssetForServing({
    runtime,
    asset,
    tenantId,
  });
  // Build the framework's native response yourself.
} catch (err) {
  if (err instanceof AssetServeError) {
    return makeResponseFor(err.status);
  }
  throw err;
}`}
			language="typescript"
		/>
	</section>

	<section id="vocab">
		<h2>Source / derived vocabulary</h2>
		<p>
			Roles, metadata keys, and extraction status values are exported as named constants so
			cross-package tooling (serving, UI pickers, agents) agrees on meaning. Prefer them over ad-hoc
			strings.
		</p>

		<h3>ASSET_ROLES</h3>
		<table>
			<thead>
				<tr><th>Role</th><th>Use</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>source_document</code></td><td
						>Original upstream document (agenda PDF, minutes)</td
					></tr
				>
				<tr
					><td><code>document_image</code></td><td
						>Page/extracted image derived from a source document</td
					></tr
				>
				<tr><td><code>thumbnail</code></td><td>Preview rendition of another asset</td></tr>
				<tr
					><td><code>asset_variant</code></td><td>Deterministic sized rendition of another asset</td
					></tr
				>
				<tr><td><code>proof</code></td><td>Non-canonical evidence asset backing a fact</td></tr>
				<tr><td><code>derivation_source</code></td><td>"Came from" link on generated media</td></tr>
				<tr><td><code>attachment</code></td><td>Generic owner-join link</td></tr>
				<tr><td><code>hero</code></td><td>Primary/featured asset on an owner</td></tr>
			</tbody>
		</table>

		<h3>ASSET_METADATA_KEYS</h3>
		<p>Canonical keys read/written by extractors and serving helpers:</p>
		<ul>
			<li><code>extractionStatus</code>, <code>extractionError</code>, <code>extractedAt</code></li>
			<li><code>sourceUrl</code>, <code>sourceHash</code></li>
			<li><code>pageNumber</code></li>
		</ul>

		<h3>ASSET_EXTRACTION_STATUS</h3>
		<p>
			Lifecycle values: <code>pending</code>, <code>running</code>, <code>succeeded</code>,
			<code>failed</code>.
		</p>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>1. Create lookup records</h3>
		<CodeBlock
			code={`const imageType = new AssetType({ slug: 'image', name: 'Image' });
await imageType.save();

const published = new AssetStatus({ slug: 'published', name: 'Published' });
await published.save();`}
			language="typescript"
		/>

		<h3>2. Create a source asset</h3>
		<CodeBlock
			code={`const photo = new Asset({
  name: 'Product Photo',
  slug: 'product-photo-001',
  sourceUri: 's3://mybucket/products/photo.jpg',
  mimeType: 'image/jpeg',
  typeSlug: 'image',
  statusSlug: 'published',
  version: 1,
});
await photo.save();`}
			language="typescript"
		/>

		<h3>3. Version 2 — chain via primaryVersionId</h3>
		<CodeBlock
			code={`const v2 = new Asset({
  name: 'Product Photo',
  slug: 'product-photo-002',
  version: 2,
  primaryVersionId: photo.id,
  sourceUri: 's3://mybucket/products/photo-v2.jpg',
  mimeType: 'image/jpeg',
  typeSlug: 'image',
  statusSlug: 'published',
});
await v2.save();`}
			language="typescript"
		/>

		<h3>4. Derivative via sourceAssetId (or runtime helper)</h3>
		<CodeBlock
			code={`// Manual form
const thumb = new Asset({
  name: 'Thumbnail',
  slug: 'product-photo-001-thumb',
  sourceAssetId: photo.id,
  sourceUri: 's3://mybucket/products/photo-001-thumb.jpg',
  mimeType: 'image/jpeg',
  typeSlug: 'image',
  statusSlug: 'published',
});
await thumb.save();

// Preferred: runtime helper writes bytes + sets sourceAssetId + records provenance
const thumb2 = await runtime.storeDerivedAsset(photo, 'thumb.jpg', thumbBytes, {
  mimeType: 'image/jpeg',
  role: ASSET_ROLES.THUMBNAIL,
});`}
			language="typescript"
		/>

		<h3>5. Generic association (for provenance / non-owner links)</h3>
		<CodeBlock
			code={`// AssetAssociation is for generic/provenance links only.
// Owner-side noun joins (content_assets, profile_assets, ...) belong in the owning package.
const assoc = new AssetAssociation({
  assetId: derivedImage.id,
  metaType: '@happyvertical/smrt-assets:Asset',
  metaId: sourceDoc.id,
  role: 'derivation_source',
  sortOrder: 0,
});
await assoc.save();`}
			language="typescript"
		/>
	</section>

	<section id="ownership">
		<h2>Ownership rule (and what AssetAssociation is not)</h2>
		<p>
			Base/domain-owned asset relationships belong on dedicated noun join tables in the owning
			package: <code>content_assets</code>, <code>profile_assets</code>, <code>event_assets</code>,
			<code>place_assets</code>, <code>product_assets</code>. Those tables are typed, indexed, and
			tenanted by the consumer.
		</p>
		<p>
			<code>AssetAssociation</code> remains for <strong>generic/provenance</strong> links — e.g. image
			derivation chains, fact proofs, "came-from" relationships — where there is no natural owner table.
		</p>
	</section>

	<section id="versioning">
		<h2>Versioning and derivatives</h2>

		<h3>Sequential versions</h3>
		<CodeBlock
			code={`// v1 is its own primary version
const v1 = new Asset({
  name: 'Photo', slug: 'photo-v1',
  sourceUri: 'v1.jpg', mimeType: 'image/jpeg',
  typeSlug: 'image', statusSlug: 'published', version: 1,
});
await v1.save();

// v2 chains via primaryVersionId = v1.id
const v2 = new Asset({
  name: 'Photo', slug: 'photo-v2',
  sourceUri: 'v2.jpg', mimeType: 'image/jpeg',
  typeSlug: 'image', statusSlug: 'published',
  version: 2, primaryVersionId: v1.id,
});
await v2.save();

// listVersions() walks the chain (by primary version id)
const history = await collection.listVersions(v1.id);`}
			language="typescript"
		/>

		<h3>Derivatives (source/derived)</h3>
		<p>
			Parallel processing variants — thumbnails, format conversions, crops — keyed by <code
				>sourceAssetId</code
			>
			(renamed from <code>parentId</code>):
		</p>
		<CodeBlock
			code={`const derivatives = await original.getDerivatives(); // was getChildren()
const source = await thumbnail.getSource();          // was getParent()`}
			language="typescript"
		/>
	</section>

	<section id="metadata">
		<h2>Metadata fields</h2>
		<p>
			<code>AssetMetafield</code> declares custom metadata definitions with JSON validation rules so values
			stay typed and bounded.
		</p>
		<CodeBlock
			code={`const widthField = new AssetMetafield({
  slug: 'width',
  name: 'Width',
  validation: JSON.stringify({ type: 'integer', minimum: 0, maximum: 10000 }),
});

// Example validation shapes
// { type: 'integer', minimum: 0, maximum: 10000 }
// { type: 'string', enum: ['portrait', 'landscape', 'square'] }
// { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }`}
			language="typescript"
		/>

		<h3>Canonical extraction metadata</h3>
		<p>
			Extractors should write the keys defined by <code>ASSET_METADATA_KEYS</code> through
			<code>runtime.setExtractionStatus()</code> so serving + UI tooling can rely on consistent names.
		</p>
	</section>

	<section id="ui-registry">
		<h2>UI Registry</h2>
		<p>
			The <code>./ui</code> subpath exports <code>ASSETS_MODULE_META</code> and
			<code>ASSETS_UI_SLOTS</code> so registry-driven hosts (smrt-chat, dynamic admin shells) can
			discover the package's Svelte components without a hard import. Side-effect-importing
			<code>@happyvertical/smrt-assets/svelte</code> registers them with
			<code>ModuleUIRegistry</code>.
		</p>

		<CodeBlock
			code={`import { ASSETS_MODULE_META, ASSETS_UI_SLOTS } from '@happyvertical/smrt-assets/ui';
import '@happyvertical/smrt-assets/svelte'; // side-effect: ModuleUIRegistry.register(...)
import { ModuleUIRegistry } from '@happyvertical/smrt-svelte/registry';

const AssetManager = ModuleUIRegistry.get('@happyvertical/smrt-assets', 'asset-manager');`}
			language="typescript"
		/>

		<h3>Registered slots</h3>
		<table>
			<thead>
				<tr><th>Slot ID</th><th>Purpose</th></tr>
			</thead>
			<tbody>
				<tr><td><code>asset-manager</code></td><td>Admin shell — full CRUD surface</td></tr>
				<tr><td><code>asset-grid</code></td><td>List view: card grid</td></tr>
				<tr><td><code>asset-list</code></td><td>List view: table rows</td></tr>
				<tr><td><code>asset-detail</code></td><td>Detail/preview view</td></tr>
				<tr><td><code>asset-toolbar</code></td><td>Action surface above list views</td></tr>
				<tr><td><code>asset-action-bar</code></td><td>Selection-aware bulk actions</td></tr>
				<tr><td><code>asset-create-modal</code></td><td>Upload/create form</td></tr>
			</tbody>
		</table>
		<p>Slot IDs are stable contracts — host apps reference them by string.</p>
	</section>

	<section id="tags">
		<h2>Tags (raw join)</h2>
		<p>
			Tag wiring is implemented via raw <code>db.upsert()</code> on the <code>asset_tags</code> join table
			— not via an SMRT model. The helpers below cover the day-to-day flow.
		</p>
		<CodeBlock
			code={`await assets.addTag(asset.id, 'category/products/shoes');
await assets.addTag(asset.id, 'featured/homepage');

const isFeatured = await asset.hasTag('featured/homepage');
const tags = await asset.getTags();
const featured = await assets.getByTag('featured/homepage');`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with other modules</h2>

		<h3>smrt-images (cross-package STI)</h3>
		<p>
			<code>Image</code> in <code>@happyvertical/smrt-images</code> extends Asset and shares the
			<code>assets</code> table via <code>_meta_type='Image'</code>. Image derivation uses
			<code>AssetAssociation</code> for provenance (role <code>derivation_source</code>).
		</p>

		<h3>smrt-content</h3>
		<p>
			Content uses the dedicated <code>content_assets</code> noun join — owner-side attachments,
			heroes, thumbnails — not <code>AssetAssociation</code>. Both ends agree on role names via
			<code>ASSET_ROLES</code>.
		</p>

		<h3>smrt-video / smrt-voice</h3>
		<p>
			Domain noun joins (<code>character_assets</code>, <code>performer_assets</code>,
			<code>scene_assets</code>) own their links; video shots inherit <code>content_assets</code>
			through their Content base.
		</p>

		<h3>smrt-facts</h3>
		<p>
			Facts attach evidence via <code>AssetAssociation</code> with role <code>proof</code>.
		</p>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Runtime + serving exports</h3>
		<table>
			<thead>
				<tr><th>Export</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>createAssetRuntime(options)</code></td><td
						>Returns an <code>AssetRuntime</code></td
					></tr
				>
				<tr
					><td><code>AssetRuntime</code></td><td
						>Bundles collection, association collection, store</td
					></tr
				>
				<tr
					><td><code>storeSourceAsset(name, data, opts)</code></td><td
						>Create a source asset (record + bytes)</td
					></tr
				>
				<tr
					><td><code>storeDerivedAsset(source, name, data, opts)</code></td><td
						>Create a derivative with parentId + provenance link</td
					></tr
				>
				<tr
					><td><code>linkDerivation(source, derivative, opts)</code></td><td
						>Record provenance without writing bytes</td
					></tr
				>
				<tr
					><td><code>setExtractionStatus(asset, status, opts?)</code></td><td
						>Write canonical extraction metadata into <code>description</code> JSON</td
					></tr
				>
				<tr
					><td><code>serveAsset(options)</code></td><td
						>Web <code>Response</code> with full status semantics</td
					></tr
				>
				<tr
					><td><code>resolveAssetForServing(options)</code></td><td
						>Resolve asset bytes for custom response shells</td
					></tr
				>
				<tr
					><td><code>AssetServeError</code></td><td>Thrown by resolver on the same failure modes</td
					></tr
				>
			</tbody>
		</table>

		<h3>Models</h3>
		<table>
			<thead>
				<tr><th>Export</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr><td><code>Asset</code></td><td>STI base — versioning, derivatives, lookup FKs</td></tr>
				<tr><td><code>Folder</code></td><td>STI subclass for hierarchical organisation</td></tr>
				<tr
					><td><code>AssetAssociation</code></td><td
						>Generic/provenance join: <code>assetId + metaType + metaId + role + sortOrder</code
						></td
					></tr
				>
				<tr
					><td><code>AssetType</code> / <code>AssetStatus</code></td><td
						>Classification + lifecycle lookups</td
					></tr
				>
				<tr
					><td><code>AssetMetafield</code></td><td
						>Custom metadata definitions with JSON validation</td
					></tr
				>
			</tbody>
		</table>

		<h3>Vocab exports</h3>
		<table>
			<thead>
				<tr><th>Export</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>ASSET_ROLES</code></td><td
						>Canonical role names (<code>source_document</code>, <code>document_image</code>,
						<code>thumbnail</code>, <code>asset_variant</code>, <code>proof</code>,
						<code>derivation_source</code>, <code>attachment</code>, <code>hero</code>)</td
					></tr
				>
				<tr><td><code>ASSET_METADATA_KEYS</code></td><td>Canonical metadata field names</td></tr>
				<tr
					><td><code>ASSET_EXTRACTION_STATUS</code></td><td
						><code>pending | running | succeeded | failed</code></td
					></tr
				>
				<tr
					><td><code>ASSETS_MODULE_META</code> / <code>ASSETS_UI_SLOTS</code></td><td
						>From <code>./ui</code>: registry-driven UI discovery</td
					></tr
				>
			</tbody>
		</table>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>SmrtObject, STI support, code generation</p>
			</a>
			<a href="/modules/smrt-images">
				<h3>smrt-images</h3>
				<p>Image extends Asset via cross-package STI</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Owner-side <code>content_assets</code> join</p>
			</a>
			<a href="/modules/smrt-svelte">
				<h3>smrt-svelte</h3>
				<p>ModuleUIRegistry consumes the asset slots</p>
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

	.diagram {
		background-color: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	.diagram pre {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}
</style>
