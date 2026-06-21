<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-assets-ergot"
	description="Ergot-backed adapter for the SMRT asset runtime. Delegates MAM-backed search, cloud processors, generated candidates, and workflow jobs to Ergot while keeping smrt-assets as the app-facing API."
	badges={['v0.29.34', 'Asset Adapter', 'Ergot MAM', 'Cloud Processing']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-assets-ergot</strong> lets applications keep
			<code>@happyvertical/smrt-assets</code>
			as the app-facing asset API while delegating advanced media work to Ergot. Use it when an app needs
			MAM-backed search, cloud processors, generated candidates, workflow jobs, or synchronization with
			an Ergot media library.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Structurally-typed Ergot client surface — no hard dependency on a specific SDK</li>
				<li><code>sourceRef</code> for idempotent sync</li>
				<li><code>externalId</code> for upstream-supplied identifiers</li>
				<li>Variant URL mapping without copying bytes by default</li>
				<li>Workflow submission for generated candidates</li>
				<li>Nearby search and external sync provider capabilities</li>
				<li>Tenant-scoped Ergot requests by default</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-assets-ergot`} language="bash" />
		<p>
			Hosts must pass a compatible Ergot client into <code>createErgotAssetProcessor()</code>. The
			adapter is structurally typed around the consumer asset client surface, so the core SMRT
			assets package stays usable without Ergot.
		</p>
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { createErgotAssetProcessor } from '@happyvertical/smrt-assets-ergot';
import { createAssetRuntime } from '@happyvertical/smrt-assets';
import { ergotClient } from './my-ergot-client';   // host-supplied

// createErgotAssetProcessor returns an AssetCapabilityProvider.
// Options: { client: ErgotConsumerAssetClient; sourceSystem?: string }
const ergotProvider = createErgotAssetProcessor({
  client: ergotClient,
  sourceSystem: 'smrt-assets',   // optional; used to mint default source refs
});

// Register the provider with the SMRT asset runtime.
const runtime = await createAssetRuntime({ db, storage });
runtime.registerCapabilityProvider(ergotProvider);
// (or pass capabilityProviders: [ergotProvider] to createAssetRuntime)

// Sync a SMRT asset to Ergot (idempotent via sourceRef). Takes an Asset.
await runtime.syncExternalAsset(asset);

// Nearby search delegated to Ergot's consumer-scoped API
const nearby = await runtime.searchNearbyAssets({
  latitude: 40.7484,
  longitude: -73.9857,
  radiusMeters: 500,
});

// Resolve a variant (maps Ergot URLs into variant metadata, no byte copy)
const variant = await runtime.ensureVariant(asset, { variant: 'preview' });

// Submit a workflow (cloud processor / generated candidates)
const job = await runtime.submitAssetWorkflow(asset, {
  workflowSlug: 'background-removal',
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Source References</h2>
		<p>
			SMRT assets remain canonical inside SMRT. Ergot assets are connected through stable source
			references and external refs — <em>never</em> through shared primary keys.
		</p>
		<CodeBlock
			code={`// Use sourceRef for idempotent sync — re-syncing the same SMRT asset
// to Ergot should resolve to the same Ergot record. sourceRef is an
// AssetExternalSourceRef object: { system, id, kind? }.
await runtime.syncExternalAsset(asset, {
  sourceRef: { system: 'smrt-assets', kind: 'asset', id: asset.id },
});

// Use externalId only when the upstream consumer already has a stable
// external identifier (e.g. a CMS that minted the original asset).
await runtime.syncExternalAsset(asset, {
  externalId: 'cms-asset-2024-08-15-abc',
});

// NEVER assume SMRT asset id and Ergot asset id are interchangeable.`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Structural Client Typing</h2>
		<p>
			The adapter is structurally typed around the consumer asset client surface. That keeps core
			SMRT assets usable without Ergot and avoids forcing every SMRT consumer to install Ergot wire
			clients.
		</p>
		<CodeBlock
			code={`// The adapter-facing surface is small and stable. The exported
// interface is ErgotConsumerAssetClient:
interface ErgotConsumerAssetClient {
  listAssets(options?: {
    status?: string; limit?: number; cursor?: string;
    includeCandidates?: boolean; externalId?: string;
    sourceRef?: ErgotAssetSourceRef;
  }): Promise<ErgotAssetListResult>;
  listNearbyAssets(options: {
    latitude: number; longitude: number;
    radiusMeters: number; limit?: number;
  }): Promise<ErgotAssetListResult>;
  uploadAsset(input: { file: Blob; /* ...metadata */ }): Promise<ErgotAssetSummary>;
  submitJob(input: {
    workflowSlug: string; sourceAssetIds?: string[]; /* ... */
  }): Promise<{ job: ErgotJobSummary; idempotent: boolean }>;
}

// Tests should use fake clients that implement this small surface
// instead of reaching into Ergot internals.
const fakeClient: ErgotConsumerAssetClient = {
  listAssets: async () => ({ items: [], nextCursor: null }),
  // ...
};`}
			language="typescript"
		/>
		<p>
			When Ergot publishes a stable SDK, that SDK should implement the same client shape and may
			become a documented peer dependency.
		</p>
	</section>

	<section>
		<h2>Variants and Outputs</h2>
		<p>
			Prefer the shared SMRT variant names (<code>thumb</code>, <code>card</code>,
			<code>preview</code>, <code>publish</code>). Map Ergot sized image URLs into SMRT variant
			metadata <em>without copying bytes</em> unless the caller asks to materialize an output.
		</p>
		<CodeBlock
			code={`// ensureVariant(asset, request) maps the Ergot URL into a variant
// record. AssetVariantRequest: { variant, width?, height?, fit?, mimeType?, metadata? }.
const variant = await runtime.ensureVariant(asset, { variant: 'preview' });
// AssetVariantResult: { asset, variant, source, url?, metadata? }
console.log(variant.url);   // points at Ergot — no byte copy`}
			language="typescript"
		/>
		<p>
			Generated candidates are <em>not</em> final article assets until approved and materialized through
			the SMRT asset runtime. Workflow outputs preserve lineage back to the source asset and Ergot job
			metadata.
		</p>
	</section>

	<section>
		<h2>Provider Behavior</h2>
		<ul>
			<li>External sync, nearby search, variant resolution, and workflow submission</li>
			<li>
				Unsupported Ergot behavior surfaces as an unsupported capability or provider error — not as
				a dashboard-specific workaround
			</li>
			<li>
				Tenant scope must be present on every Ergot request that can expose or mutate tenant data
			</li>
			<li>
				List and nearby calls rely on Ergot's consumer-scoped API contract rather than private
				internals
			</li>
			<li>Direct asset and job lookups still need explicit tenant validation</li>
		</ul>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Pass tenant context on every Ergot request</li>
				<li>Use <code>sourceRef</code> for idempotent sync</li>
				<li>Map Ergot URLs into variants by default — only materialize bytes when needed</li>
				<li>Keep workflow outputs linked to source asset + Ergot job metadata</li>
				<li>Surface unsupported Ergot capabilities as provider errors</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>
					Don't put broad Ergot client contracts in this adapter — they belong in the Ergot SDK
				</li>
				<li>Don't put Anytown-specific content image behavior here</li>
				<li>Don't reach into Ergot database tables or private APIs from this package</li>
				<li>Don't assume SMRT and Ergot asset IDs are interchangeable</li>
				<li>
					Don't import this package from generic SMRT packages — only from Ergot-enabled hosts
				</li>
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
			<a href="/modules/smrt-assets-local">
				<h3>smrt-assets-local</h3>
				<p>Local Sharp/EXIF adapter</p>
			</a>
			<a href="/modules/smrt-images">
				<h3>smrt-images</h3>
				<p>Image ops, AI categorization, cross-package STI extending Asset</p>
			</a>
			<a href="/modules/smrt-jobs">
				<h3>smrt-jobs</h3>
				<p>Workflow execution runtime</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
