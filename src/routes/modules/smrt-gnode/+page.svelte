<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-gnode - Federation Library | SMRT Framework</title>
	<meta
		name="description"
		content="Federation library for inter-gnode peer-to-peer discovery and communication. Stubs only -- not implemented."
	/>
</svelte:head>

<ModulePage
	name="smrt-gnode"
	description="Planned federation library for inter-gnode peer-to-peer discovery and communication. Currently ships stub implementations only — do not build against this API yet."
	badges={['v0.29.34', 'Stubs Only', 'Not Implemented', 'Library-stage']}
>
	<!-- Warning -->
	<section>
		<aside
			style="background: #fff3cd; border: 2px solid #ffc107; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;"
		>
			<h2 style="color: #856404; margin-top: 0;">Status: Stubs Only — Do Not Integrate Yet</h2>
			<p style="color: #856404; margin-bottom: 0.75rem;">
				<strong>This package is intentionally unimplemented as of v0.29.34.</strong> Every exported
				class is a stub: methods return empty arrays or <code>null</code>, no network calls happen,
				no SMRT models are present, and there is no persistence layer. The API shape described below
				is the <em>planned</em> architecture only.
			</p>
			<p style="color: #856404; margin-bottom: 0;">
				Do not write integration code against <code>smrt-gnode</code> today. If you need federation or
				peer exchange right now, build it in your own application layer and migrate when this package
				ships a real implementation.
			</p>
		</aside>
	</section>

	<!-- Overview -->
	<section>
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-gnode</strong> is positioned to provide federation protocols for inter-gnode
			peer-to-peer discovery and communication. A &quot;gnode&quot; is a federated local knowledge base;
			the long-term plan is to let independent gnodes discover each other, exchange peer lists, and run
			ActivityPub-inspired cross-gnode queries. None of that runs yet — see the status box above.
		</p>
	</section>

	<!-- Installation -->
	<section>
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-gnode`} language="bash" />
		<p>
			No runtime dependencies. Standalone stub package — installing it gives you the type signatures
			and no-op stubs only.
		</p>
	</section>

	<!-- Stub Exports -->
	<section>
		<h2>Exports (All Stubs)</h2>

		<h3>Classes</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Status</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Federation</code></td>
					<td>Stub</td>
					<td
						><code>discoverPeers()</code> and <code>exchangePeers()</code> return
						<code>[]</code></td
					>
				</tr>
				<tr>
					<td><code>WebFingerProtocol</code></td>
					<td>Stub</td>
					<td
						><code>.well-known/gnode</code> discovery. <code>discover()</code> returns
						<code>null</code></td
					>
				</tr>
				<tr>
					<td><code>PeerExchangeProtocol</code></td>
					<td>Stub</td>
					<td
						><code>/api/federation/peers</code> peer list exchange. <code>exchange()</code> returns
						<code>[]</code></td
					>
				</tr>
			</tbody>
		</table>

		<h3>Types</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>GnodePeer</code></td>
					<td
						>Peer descriptor: <code>url</code>, <code>name</code>, <code>discoveredAt</code>,
						<code>lastSeen?</code></td
					>
				</tr>
				<tr>
					<td><code>FederationConfig</code></td>
					<td
						>Config: <code>enabled</code>, <code>discoverability</code>, <code>peers</code>,
						<code>autodiscovery</code>, <code>peerExchange</code></td
					>
				</tr>
				<tr>
					<td><code>WebFingerResponse</code></td>
					<td>WebFinger response: <code>subject</code>, <code>links[]</code></td>
				</tr>
			</tbody>
		</table>

		<h3>Constants</h3>
		<p><code>version</code>: Package version string (<code>'0.1.0'</code>)</p>
	</section>

	<!-- Planned Architecture -->
	<section>
		<h2>Planned Architecture (Not Implemented)</h2>
		<p>
			These are the protocols the package <em>intends</em> to ship — none of them are wired up as of v0.29.34.
			The stubs above describe the shapes the future implementations will fill.
		</p>
		<ul>
			<li>
				<strong>Federation</strong> — orchestrator that runs peer discovery and exchange against a configured
				peer list
			</li>
			<li>
				<strong>WebFingerProtocol</strong> — WebFinger-based peer discovery via
				<code>GET /.well-known/gnode</code>
			</li>
			<li>
				<strong>PeerExchangeProtocol</strong> — peer-list exchange via
				<code>GET /api/federation/peers</code>
			</li>
			<li>ActivityPub-inspired cross-gnode queries (longer-term)</li>
		</ul>
	</section>

	<!-- Related Modules -->
	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Base framework for object federation</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content management for federated documents</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-cli">Next: smrt-cli →</a>
	</nav>
</ModulePage>
