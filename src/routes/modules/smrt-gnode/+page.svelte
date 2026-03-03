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
	description="Federation library for inter-gnode peer-to-peer discovery and communication."
	badges={['v0.20.44', 'Stubs Only', 'Not Implemented']}
>
	<!-- Warning -->
	<section>
		<aside style="background: #fff3cd; border: 2px solid #ffc107; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
			<h2 style="color: #856404; margin-top: 0;">Not Implemented -- Stubs Only</h2>
			<p style="color: #856404; margin-bottom: 0;">
				This package contains <strong>stub implementations only</strong>. All methods return empty arrays
				or null. No SMRT models are present -- this is a library-stage package. The API surface described
				below represents the <em>planned</em> architecture, not current functionality.
			</p>
		</aside>
	</section>

	<!-- Overview -->
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-gnode</strong> is intended to provide federation protocols for inter-gnode
			peer-to-peer discovery and communication. Gnodes are federated local knowledge bases
			that will eventually support P2P discovery and cross-gnode communication.
		</p>
	</section>

	<!-- Installation -->
	<section>
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-gnode`} language="bash" />
		<p>No dependencies. Standalone stub package.</p>
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
					<td><code>discoverPeers()</code> and <code>exchangePeers()</code> return <code>[]</code></td>
				</tr>
				<tr>
					<td><code>WebFingerProtocol</code></td>
					<td>Stub</td>
					<td><code>.well-known/gnode</code> discovery. <code>discover()</code> returns <code>null</code></td>
				</tr>
				<tr>
					<td><code>PeerExchangeProtocol</code></td>
					<td>Stub</td>
					<td><code>/api/federation/peers</code> peer list exchange. <code>exchange()</code> returns <code>[]</code></td>
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
					<td>Peer descriptor: <code>url</code>, <code>name</code>, <code>discoveredAt</code>, <code>lastSeen?</code></td>
				</tr>
				<tr>
					<td><code>FederationConfig</code></td>
					<td>Config: <code>enabled</code>, <code>discoverability</code>, <code>peers</code>, <code>autodiscovery</code>, <code>peerExchange</code></td>
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
		<h2>Planned Architecture</h2>
		<ul>
			<li>WebFinger-based peer discovery via <code>GET /.well-known/gnode</code></li>
			<li>Peer exchange protocol via <code>GET /api/federation/peers</code></li>
			<li>ActivityPub-inspired cross-gnode queries</li>
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
