<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-gnode - Federation Library | SMRT Framework</title>
	<meta
		name="description"
		content="Federated local knowledge bases with P2P discovery, WebFinger, and cross-gnode communication."
	/>
</svelte:head>

<ModulePage
	name="smrt-gnode"
	description="Federation library for building federated local knowledge bases (gnodes) with P2P discovery and cross-gnode communication."
	badges={['v0.19.0', 'Federation', 'WebFinger', 'P2P']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-gnode</strong> enables federated local knowledge bases that transform government documents
			into accessible, multi-modal knowledge. Provides P2P discovery, peer exchange, and ActivityPub-inspired
			protocols.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>P2P peer discovery via WebFinger and DNS</li>
				<li>Peer exchange between gnodes</li>
				<li>ActivityPub-inspired federation protocols</li>
				<li>Cross-gnode queries and communication</li>
				<li>SMRT object federation</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-gnode`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { Federation, WebFingerProtocol } from '@happyvertical/smrt-gnode';

// Configure federation
const federation = new Federation({
  enabled: true,
  discoverability: 'public',
  peers: ['https://example.gnode'],
  autodiscovery: true,
  peerExchange: true
});

// Discover peers
const peers = await federation.discoverPeers();

// Use WebFinger for discovery
const gnodeInfo = await WebFingerProtocol.discover('example.com');
// Returns: {
//   subject: 'acct:gnode@example.com',
//   links: [{ rel: 'self', href: 'https://example.com/.well-known/gnode' }]
// }`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Federation Concepts</h2>

		<h3>Gnode (Local Knowledge Base)</h3>
		<p>A gnode is a federated local knowledge base that:</p>
		<ul>
			<li>Stores and indexes government documents</li>
			<li>Provides multi-modal access (web, API, voice)</li>
			<li>Discovers and communicates with peer gnodes</li>
			<li>Shares knowledge while maintaining local autonomy</li>
		</ul>

		<h3>Discovery Methods</h3>
		<CodeBlock
			code={`// WebFinger discovery
const info = await WebFingerProtocol.discover('city.gov');

// DNS-based discovery
const dnsRecords = await federation.discoverViaDNS('city.gov');

// Peer exchange
const morePeers = await federation.exchangePeersWithGnode('https://peer.gnode');`}
			language="typescript"
		/>

		<h3>Cross-Gnode Queries</h3>
		<CodeBlock
			code={`// Query remote gnode
const results = await federation.queryGnode('https://peer.gnode', {
  type: 'Meeting',
  filters: { date: { gte: '2025-01-01' } },
  limit: 10
});

// Aggregate from multiple gnodes
const allResults = await federation.queryMultiple(
  ['https://peer1.gnode', 'https://peer2.gnode'],
  { type: 'Resolution', status: 'passed' }
);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Federation Protocols</h2>

		<h3>WebFinger</h3>
		<p>RFC 7033 WebFinger protocol for resource discovery:</p>
		<CodeBlock
			code={`GET /.well-known/webfinger?resource=acct:gnode@example.com

Response:
{
  "subject": "acct:gnode@example.com",
  "links": [
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://example.com/.well-known/gnode"
    }
  ]
}`}
			language="json"
		/>

		<h3>Peer Exchange Protocol</h3>
		<CodeBlock
			code={`// Exchange peer lists
const exchange = await federation.peerExchange({
  myPeers: federation.getPeerList(),
  requestPeers: true
});

console.log(\`Learned about \${exchange.newPeers.length} new gnodes\`);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Use Cases</h2>
		<article>
			<h3>Municipal Government Networks</h3>
			<p>
				Connect city councils, county boards, and regional authorities for shared meeting minutes,
				resolutions, and public records.
			</p>
		</article>
		<article>
			<h3>Regional News Aggregation</h3>
			<p>
				Federate local news sources to provide comprehensive regional coverage while maintaining
				editorial independence.
			</p>
		</article>
		<article>
			<h3>Public Records Networks</h3>
			<p>
				Enable citizens to search across multiple jurisdictions for permits, planning documents, and
				public notices.
			</p>
		</article>
	</section>

	<section>
		<h2>Best Practices</h2>
		<section>
			<h3>DOs</h3>
			<ul>
				<li>Use WebFinger for standard-compliant discovery</li>
				<li>Enable peer exchange to grow the network</li>
				<li>Cache peer lists to reduce discovery overhead</li>
				<li>Implement rate limiting for cross-gnode queries</li>
				<li>Document your gnode's API endpoints</li>
			</ul>
		</section>
		<section>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't expose private data through federation</li>
				<li>Don't trust peer data without validation</li>
				<li>Don't implement custom protocols (use standards)</li>
				<li>Don't query peers excessively (implement caching)</li>
				<li>Don't ignore security headers and HTTPS</li>
			</ul>
		</section>
	</section>

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
