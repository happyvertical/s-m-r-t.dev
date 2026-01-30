<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-gnode - Federation Library | SMRT Framework</title>
  <meta name="description" content="Federated local knowledge bases with P2P discovery, WebFinger, and cross-gnode communication." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-gnode</h1>
    <p class="text-xl text-gray-600 mb-4">
      Federation library for building federated local knowledge bases (gnodes) with P2P discovery and cross-gnode communication.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Federation</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">WebFinger</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">P2P</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-gnode</strong> enables federated local knowledge bases that transform government documents
      into accessible, multi-modal knowledge. Provides P2P discovery, peer exchange, and ActivityPub-inspired protocols.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>P2P peer discovery via WebFinger and DNS</li>
        <li>Peer exchange between gnodes</li>
        <li>ActivityPub-inspired federation protocols</li>
        <li>Cross-gnode queries and communication</li>
        <li>SMRT object federation</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-gnode`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Federation Concepts</h2>

    <h3 class="text-2xl font-semibold mb-3">Gnode (Local Knowledge Base)</h3>
    <p class="mb-4">
      A gnode is a federated local knowledge base that:
    </p>
    <ul class="list-disc list-inside mb-4 space-y-1">
      <li>Stores and indexes government documents</li>
      <li>Provides multi-modal access (web, API, voice)</li>
      <li>Discovers and communicates with peer gnodes</li>
      <li>Shares knowledge while maintaining local autonomy</li>
    </ul>

    <h3 class="text-2xl font-semibold mb-3 mt-6">Discovery Methods</h3>
    <CodeBlock
      code={`// WebFinger discovery
const info = await WebFingerProtocol.discover('city.gov');

// DNS-based discovery
const dnsRecords = await federation.discoverViaDNS('city.gov');

// Peer exchange
const morePeers = await federation.exchangePeersWithGnode('https://peer.gnode');`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">Cross-Gnode Queries</h3>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Federation Protocols</h2>

    <h3 class="text-2xl font-semibold mb-3">WebFinger</h3>
    <p class="mb-4">
      RFC 7033 WebFinger protocol for resource discovery:
    </p>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Peer Exchange Protocol</h3>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Use Cases</h2>
    <div class="space-y-4">
      <div class="p-4 border-l-4 border-blue-500 bg-gray-50">
        <h3 class="font-semibold mb-2">Municipal Government Networks</h3>
        <p class="text-sm">
          Connect city councils, county boards, and regional authorities for shared meeting minutes, resolutions, and public records.
        </p>
      </div>
      <div class="p-4 border-l-4 border-green-500 bg-gray-50">
        <h3 class="font-semibold mb-2">Regional News Aggregation</h3>
        <p class="text-sm">
          Federate local news sources to provide comprehensive regional coverage while maintaining editorial independence.
        </p>
      </div>
      <div class="p-4 border-l-4 border-purple-500 bg-gray-50">
        <h3 class="font-semibold mb-2">Public Records Networks</h3>
        <p class="text-sm">
          Enable citizens to search across multiple jurisdictions for permits, planning documents, and public notices.
        </p>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Best Practices</h2>
    <div class="space-y-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✓ DOs</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Use WebFinger for standard-compliant discovery</li>
          <li>Enable peer exchange to grow the network</li>
          <li>Cache peer lists to reduce discovery overhead</li>
          <li>Implement rate limiting for cross-gnode queries</li>
          <li>Document your gnode's API endpoints</li>
        </ul>
      </div>
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✗ DON'Ts</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Don't expose private data through federation</li>
          <li>Don't trust peer data without validation</li>
          <li>Don't implement custom protocols (use standards)</li>
          <li>Don't query peers excessively (implement caching)</li>
          <li>Don't ignore security headers and HTTPS</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Base framework for object federation</p>
      </a>
      <a href="/modules/smrt-content" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-content</h3>
        <p class="text-sm text-gray-600">Content management for federated documents</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-cli" class="text-blue-600 hover:underline">Next: smrt-cli →</a>
    </div>
  </div>
</div>
