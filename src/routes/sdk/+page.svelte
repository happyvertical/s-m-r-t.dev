<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const adapterCode = `import { getAI } from '@happyvertical/ai';
import { getDatabase } from '@happyvertical/sql';

// Adapters accept explicit config...
const ai = await getAI({ type: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY });
const db = await getDatabase({ type: 'postgres', url: process.env.DATABASE_URL });

// ...or auto-configure from HAVE_* environment variables.
// const ai = await getAI();
// const db = await getDatabase();

// When requirements change, swap providers without touching this code.
const summary = await ai.message('Summarize the latest trends in AI agents.');
await db.insert('summaries', { content: summary.content, created_at: new Date() });`;

	const aiProvidersCode = `import { getAI } from '@happyvertical/ai';

// OpenAI (default when type is omitted)
const openai = await getAI({ apiKey: process.env.OPENAI_API_KEY });

// Anthropic Claude
const claude = await getAI({ type: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY });

// Google Gemini
const gemini = await getAI({ type: 'gemini', apiKey: process.env.GEMINI_API_KEY });

// Ollama (local model, no key)
const ollama = await getAI({ type: 'ollama', baseUrl: 'http://localhost:11434' });

// Claude CLI (uses a Claude subscription, no API key)
const cli = await getAI({ type: 'claude-cli', defaultModel: 'sonnet' });

// Same interface regardless of provider:
const reply = await claude.message('Explain generics in one sentence');
for await (const chunk of ollama.stream([{ role: 'user', content: 'Hi' }])) {
  process.stdout.write(chunk.content ?? '');
}`;

	const aiUsageCode = `// Pace requests that share a provider budget, and observe every call.
const ai = await getAI({
  type: 'gemini',
  apiKey: process.env.GEMINI_API_KEY,
  defaultModel: 'gemini-2.5-flash',
  rateLimit: { key: 'gemini:shared-batch', requestsPerMinute: 60 },
  usageTags: { app: 'indagator', team: 'news' },
  onUsage: (event) => {
    // event => { provider, model, operation, usage?, duration, timestamp, tags? }
    console.log(
      \`[\${event.provider}/\${event.model}] \${event.operation}: \` +
        \`\${event.usage?.totalTokens} tokens in \${event.duration}ms\`,
    );
  },
});`;

	const sqlCode = `import { getDatabase } from '@happyvertical/sql';

const db = await getDatabase({ type: 'sqlite', url: 'file:./app.db' });

// Template-literal queries: interpolated values are ALWAYS parameterized
// (never string-concatenated), with per-adapter placeholder handling.
const status = 'active';
const users = await db.many\`
  SELECT id, email FROM users WHERE status = \${status} LIMIT 50
\`;

// CRUD helpers + transactions.
await db.transaction(async (tx) => {
  const id = await tx.insert('users', { email: 'a@b.com', status });
  await tx.update('profiles', { user_id: id }, { onboarded: true });
});`;

	const vectorCode = `// PostgreSQL exposes db.vector when pgvector is available.
const pg = await getDatabase({ type: 'postgres', url: process.env.DATABASE_URL });
if (pg.vector) {
  await pg.vector.ensureColumn('documents', 'embedding', 1536);
  const neighbors = await pg.vector.search(
    'documents',
    'embedding',
    queryEmbedding,
    { limit: 5 },
  );
}`;

	const cacheCode = `import { getCache } from '@happyvertical/cache';

const cache = await getCache({
  provider: 'redis',
  host: 'localhost',
  port: 6379,
  namespace: 'app',
  enableCompression: true,
});

await cache.set('user:123', { name: 'Alice' }, 3600); // TTL in seconds
const user = await cache.get('user:123');

// Same CacheProvider interface for memory, file, redis, and s3 — swap the
// provider, keep the code. Batch ops cut round-trips:
await cache.setMany([{ key: 'a', value: 1 }, { key: 'b', value: 2, ttl: 60 }]);`;

	const secretsCode = `import { getSecretStore } from '@happyvertical/secrets';
import { getDatabase } from '@happyvertical/sql';

const db = await getDatabase({ type: 'sqlite', url: ':memory:' });

// Envelope encryption: an Application Master Key wraps per-tenant Data
// Encryption Keys, which encrypt the secret values (AES-256-GCM).
const store = await getSecretStore({
  type: 'database',
  db,
  amk: { provider: 'env', keyEnvVar: 'MY_SECRET_KEY', keyId: 'amk-v1' },
});

await store.createTenantKey('tenant-123');
const envelope = await store.encrypt('tenant-123', 'api-key', 'sk_live_xxx');
const value = await store.decrypt('tenant-123', envelope);

// Rotate a tenant key without re-encrypting every secret or downtime.
await store.rotateTenantKey('tenant-123');`;

	const filesCode = `import { getFilesystem } from '@happyvertical/files';

// Local disk, Google Drive, or S3 — one interface.
const fs = await getFilesystem({ type: 'local', basePath: '/app/data' });

await fs.write('reports/q3.txt', 'hello');
const buf = await fs.read('reports/q3.txt');
const entries = await fs.list('reports/');`;

	const aiProviders = [
		{ type: "'openai'", note: 'Default when type is omitted; chat, embeddings, vision, image, TTS.' },
		{ type: "'litellm'", note: 'OpenAI-compatible gateway.' },
		{ type: "'bifrost'", note: 'OpenAI-compatible gateway with governance admin APIs (ai.admin).' },
		{ type: "'ollama'", note: 'Local-by-default models; remote/cloud hosts via baseUrl + key.' },
		{ type: "'anthropic'", note: 'Anthropic Claude.' },
		{ type: "'gemini'", note: 'Google Gemini.' },
		{ type: "'bedrock'", note: 'AWS Bedrock.' },
		{ type: "'huggingface'", note: 'Hugging Face Inference (apiToken).' },
		{ type: "'claude-cli'", note: 'Drives a local Claude CLI / subscription; no API key.' },
		{ type: "'qwen3-tts'", note: 'Text-to-speech only; local token-bucket pacing.' }
	];

	const sqlBackends = [
		{ name: 'SQLite', type: "'sqlite'", driver: 'LibSQL (@libsql/client)', note: ':memory:, file, and remote Turso URLs (authToken).' },
		{ name: 'PostgreSQL', type: "'postgres'", driver: 'pg Pool', note: 'Connection pooling; pgvector via db.vector.' },
		{ name: 'DuckDB', type: "'duckdb'", driver: '@duckdb/node-api', note: 'JSON file auto-registration, write-back strategies.' },
		{ name: 'JSON', type: "'json'", driver: 'DuckDB in-memory', note: 'Reads/writes JSON files as tables.' }
	];

	const cacheBackends = [
		{ name: 'Memory', provider: "'memory'", note: 'In-process; LRU/LFU/FIFO eviction, maxSize.' },
		{ name: 'File', provider: "'file'", note: 'On-disk, persists across restarts; optional gzip.' },
		{ name: 'Redis', provider: "'redis'", note: 'Distributed via the redis client; optional gzip.' },
		{ name: 'S3', provider: "'s3'", note: 'S3 objects; compression on by default (CI caches).' }
	];

	const secretStores = [
		{ type: "'database'", note: 'DB-backed wrapped-key storage (only wrapped keys hit the DB).' },
		{ type: "'aws-kms'", note: 'AWS KMS as the master-key provider.' },
		{ type: "'vault'", note: 'HashiCorp Vault.' },
		{ type: "'azure-keyvault'", note: 'Azure Key Vault.' }
	];

	const fileProviders = [
		{ type: "'local'", note: 'Local disk under a basePath.' },
		{ type: "'gdrive'", note: 'Google Drive.' },
		{ type: "'s3'", note: 'S3-compatible object storage.' }
	];

	// A representative slice of the rest of the ~30-package SDK.
	const morePackages = [
		{ name: '@happyvertical/utils', note: 'IDs, date parsing, URLs, string conversion, sandboxing, error classes.' },
		{ name: '@happyvertical/logger', note: 'Structured logging; SMRT signal adapter; optional Sentry.' },
		{ name: '@happyvertical/json', note: 'Drop-in JSON.parse/stringify with SIMD acceleration + JS fallback.' },
		{ name: '@happyvertical/documents', note: 'PDF / HTML / Markdown extraction; auto-detects CMS sources.' },
		{ name: '@happyvertical/encryption', note: 'PGP/OpenPGP, NaCl/libsodium, Node crypto: encrypt, sign, keys.' },
		{ name: '@happyvertical/auth', note: 'Keycloak (OIDC/OAuth2), AWS Cognito, Nostr identity.' },
		{ name: '@happyvertical/translator', note: 'Google Translate, DeepL, LibreTranslate; detection + batch.' },
		{ name: '@happyvertical/geo', note: 'Geocoding and static maps (Google, OSM/Nominatim, Mapbox).' },
		{ name: '@happyvertical/weather', note: 'Environment Canada (free) and OpenWeatherMap.' },
		{ name: '@happyvertical/social', note: 'Publish to YouTube, Threads, X, Bluesky; analytics.' },
		{ name: '@happyvertical/repos', note: 'GitHub issues, PRs, labels, comments, search.' },
		{ name: '@happyvertical/sdk-mcp', note: 'MCP server routing dev queries to package docs.' }
	];
</script>

<svelte:head>
	<title>HAVE SDK | s-m-r-t</title>
	<meta
		name="description"
		content="The HAppy VErtical SDK — the getX() adapter layer SMRT builds on. Swap AI, database, cache, secrets, and filesystem providers without touching application code."
	/>
</svelte:head>

<Grid>
	<div class="header">
		<nav class="breadcrumb">
			<a href="/">Home</a>
			<span>/</span>
			<span>SDK</span>
		</nav>
		<h1>The HAVE SDK</h1>
		<p class="lead">
			The <strong>HAppy VErtical SDK</strong> is the ~30-package adapter layer the
			<a href="/modules">SMRT framework</a> builds on — and that you can use entirely on its own. Every
			package exposes a single <code>getX(config)</code> factory returning a stable interface, so the
			provider behind a database, a model, or a cache is a configuration detail, not a code dependency.
		</p>
		<div class="badges">
			<span class="badge">~30 packages</span>
			<span class="badge">ESM-only</span>
			<span class="badge">Node 24+</span>
			<span class="badge">Adapter pattern</span>
		</div>
		<nav class="toc">
			<a href="#philosophy">Philosophy</a>
			<a href="#ai">ai</a>
			<a href="#sql">sql</a>
			<a href="#cache">cache</a>
			<a href="#secrets">secrets</a>
			<a href="#files">files</a>
			<a href="#more">More packages</a>
		</nav>
	</div>

	<section id="philosophy" class="section">
		<h2>The getX() adapter philosophy</h2>
		<p>
			The SDK isolates fundamental operations — querying a database, reading a file, generating an
			embedding — behind stable interfaces, so downstream code is insulated from provider
			deprecation, API churn, and shifting pricing. You state <em>what</em> you need; the adapter
			handles <em>how</em>.
		</p>
		<CodeBlock code={adapterCode} lang="typescript" />
		<div class="cards">
			<div class="card">
				<h3>Adapter pattern by default</h3>
				<p>
					<code>getAI()</code>, <code>getDatabase()</code>, <code>getFilesystem()</code>,
					<code>getCache()</code>, and <code>getSecretStore()</code> share one architectural shape:
					call the factory with a config object, get back an interface.
				</p>
			</div>
			<div class="card">
				<h3>Environment-variable driven</h3>
				<p>
					Packages read from <code>HAVE_&lt;PACKAGE&gt;_*</code> prefixes. The same config works
					whether it sits in a local <code>.env</code> or is injected by a secrets manager — pass it
					explicitly or let the factory auto-configure.
				</p>
			</div>
			<div class="card">
				<h3>Pay for what you use</h3>
				<p>
					Third-party vendor SDKs are <em>optional peer dependencies</em>. Install only the providers
					you actually use; the adapter interface stays the same either way.
				</p>
			</div>
			<div class="card">
				<h3>The "Day 2" swap</h3>
				<p>
					Prototype on a managed API on Day 1; when throughput spikes, moving (say) managed Redis to a
					self-hosted instance becomes a dependency swap, not a refactor.
				</p>
			</div>
		</div>
		<Callout variant="note" title="How SMRT uses the SDK">
			SMRT's <a href="/modules/smrt-core">smrt-core</a> resolves its database, AI, and secret backends
			through these same <code>getX()</code> factories. That is why a SMRT app can target SQLite in a
			test and Postgres in production, or swap model providers, without changing object code — the
			swap happens in SDK config. The domain modules build on it too: for example
			<a href="/modules/smrt-subscriptions">smrt-subscriptions</a> defers runtime billing-provider
			calls to the SDK accounting provider rather than baking them in.
		</Callout>
	</section>

	<section id="ai" class="section">
		<h2><code>ai</code> — one interface, 10 providers</h2>
		<p>
			<code>@happyvertical/ai</code> is a multi-provider client. One interface covers chat,
			<code>message</code>, streaming, embeddings, function calling, image operations, and
			text-to-speech where the provider supports them — pick the backend with <code>type</code>:
		</p>
		<CodeBlock code={aiProvidersCode} lang="typescript" />
		<table>
			<thead>
				<tr>
					<th><code>type</code></th>
					<th>Provider</th>
				</tr>
			</thead>
			<tbody>
				{#each aiProviders as p}
					<tr>
						<td><code>{p.type}</code></td>
						<td>{p.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<h3>Rate-limit pacing &amp; usage tracking</h3>
		<p>
			Use <code>rateLimit</code> to pace calls that share a provider budget (it respects
			<code>Retry-After</code>, falling back to a configurable delay), and <code>onUsage</code> to
			observe every call — tokens, cost, latency — with optional <code>usageTags</code> to correlate
			usage with features or users:
		</p>
		<CodeBlock code={aiUsageCode} lang="typescript" />
		<p>
			The <code>UsageEvent</code> carries <code>provider</code>, <code>model</code>,
			<code>operation</code>, optional <code>usage</code>
			(<code>{'{ promptTokens, completionTokens, totalTokens }'}</code>), <code>duration</code>,
			<code>timestamp</code>, and merged <code>tags</code>. Errors thrown inside
			<code>onUsage</code> are swallowed, so instrumentation never breaks a request.
		</p>
		<Callout variant="note" title="Powers the subscription AI quota">
			The same usage signal feeds the framework's tenant-scoped <code>_smrt_ai_usage</code> table that
			<a href="/modules/smrt-subscriptions">smrt-subscriptions</a> reads for AI-token-quota metering.
		</Callout>
	</section>

	<section id="sql" class="section">
		<h2><code>sql</code> — one database interface, four backends</h2>
		<p>
			<code>@happyvertical/sql</code> gives every backend the same <code>DatabaseInterface</code>:
			template-literal queries, CRUD helpers, transactions, schema synchronization, and vector
			search. Interpolated values in a tagged query are always parameterized — never
			string-concatenated:
		</p>
		<CodeBlock code={sqlCode} lang="typescript" />
		<table>
			<thead>
				<tr>
					<th>Backend</th>
					<th><code>type</code></th>
					<th>Driver</th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each sqlBackends as b}
					<tr>
						<td>{b.name}</td>
						<td><code>{b.type}</code></td>
						<td><code>{b.driver}</code></td>
						<td>{b.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<h3>Vector search (pgvector)</h3>
		<p>
			PostgreSQL adapters expose <code>db.vector</code> when pgvector is available — semantic search
			lives behind the same interface as the rest of your queries:
		</p>
		<CodeBlock code={vectorCode} lang="typescript" />
		<Callout variant="note" title="The backend behind SMRT objects">
			<code>SmrtObject</code> / <code>SmrtCollection</code> persist through this interface, which is
			why a SMRT app can run on SQLite locally and Postgres (with pgvector embeddings) in production
			by changing only the <code>db</code> config.
		</Callout>
	</section>

	<section id="cache" class="section">
		<h2><code>cache</code> — four backends, one interface</h2>
		<p>
			<code>@happyvertical/cache</code> implements the same <code>CacheProvider</code> across Memory,
			File, Redis, and S3, with TTL, eviction policies, batch operations, and optional gzip
			compression. TTL is always in seconds:
		</p>
		<CodeBlock code={cacheCode} lang="typescript" />
		<table>
			<thead>
				<tr>
					<th>Backend</th>
					<th><code>provider</code></th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each cacheBackends as b}
					<tr>
						<td>{b.name}</td>
						<td><code>{b.provider}</code></td>
						<td>{b.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section id="secrets" class="section">
		<h2><code>secrets</code> — envelope encryption, pluggable backends</h2>
		<p>
			<code>@happyvertical/secrets</code> does per-tenant secret management with a two-tier key
			hierarchy: an Application Master Key (AMK) wraps per-tenant Data Encryption Keys (TDEKs), which
			encrypt secret values with AES-256-GCM. Only wrapped keys are stored, and tenant keys rotate
			without re-encrypting every secret:
		</p>
		<CodeBlock code={secretsCode} lang="typescript" />
		<table>
			<thead>
				<tr>
					<th><code>type</code></th>
					<th>Backend</th>
				</tr>
			</thead>
			<tbody>
				{#each secretStores as s}
					<tr>
						<td><code>{s.type}</code></td>
						<td>{s.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<Callout variant="security" title="Master key lives outside the database">
			The database backend stores only wrapped keys. For production, source the AMK from a real KMS —
			AWS KMS, HashiCorp Vault, or Azure Key Vault — rather than an environment variable.
		</Callout>
	</section>

	<section id="files" class="section">
		<h2><code>files</code> — filesystem abstraction</h2>
		<p>
			<code>@happyvertical/files</code> abstracts file storage across local disk, Google Drive, and
			S3 behind one interface, and also ships rate-limited HTTP fetch utilities:
		</p>
		<CodeBlock code={filesCode} lang="typescript" />
		<table>
			<thead>
				<tr>
					<th><code>type</code></th>
					<th>Provider</th>
				</tr>
			</thead>
			<tbody>
				{#each fileProviders as f}
					<tr>
						<td><code>{f.type}</code></td>
						<td>{f.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section id="more" class="section last">
		<h2>The rest of the SDK</h2>
		<p>
			The five adapters above are the core SMRT leans on, but the SDK spans roughly 30 packages. A
			representative slice:
		</p>
		<div class="items">
			{#each morePackages as pkg}
				<div class="item">
					<code>{pkg.name}</code>
					<span>{pkg.note}</span>
				</div>
			{/each}
		</div>
		<p class="repo-link">
			Every package ships its own <code>README</code> and an <code>AGENT.md</code> for AI-assisted
			development. Full source:
			<a href="https://github.com/happyvertical/sdk" target="_blank" rel="noopener"
				>github.com/happyvertical/sdk &rarr;</a
			>
		</p>
	</section>
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
		padding: 48px 24px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.lead {
		font-size: 1.15rem;
		color: var(--smrt-color-on-surface-variant, #666);
		line-height: 1.6;
		margin-bottom: 24px;
	}

	.badges {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		padding-top: 20px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.toc a {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
	}

	.toc a:hover {
		text-decoration: underline;
	}

	.section {
		grid-column: 1 / -1;
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
		padding: 48px 24px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		scroll-margin-top: 24px;
	}

	.section.last {
		border-bottom: none;
	}

	.section h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.section h3 {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 12px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.section p {
		color: var(--smrt-color-on-surface-variant, #555);
		line-height: 1.7;
		margin-bottom: 16px;
	}

	.section :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0 8px;
	}

	.section :global(th),
	.section :global(td) {
		padding: 10px 12px;
		text-align: left;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		font-size: 0.9rem;
		color: var(--smrt-color-on-surface-variant, #555);
		vertical-align: top;
	}

	.section :global(th) {
		font-weight: 600;
		background: var(--smrt-color-surface-container, #f5f5f5);
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	code {
		font-family: var(--font-mono);
		font-size: 0.875em;
		padding: 2px 6px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 3px;
		color: var(--smrt-color-on-surface, #d63384);
	}

	.section :global(th) code,
	.section :global(td) code {
		background: color-mix(in srgb, var(--smrt-color-primary, #1976d2) 10%, transparent);
		color: inherit;
	}

	a {
		color: var(--smrt-color-primary, #1976d2);
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
		margin: 24px 0;
	}

	.card {
		padding: 20px;
		background: var(--smrt-color-surface-container, #fafafa);
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: 8px;
	}

	.card h3 {
		margin: 0 0 8px;
		font-size: 1rem;
		font-weight: 600;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.card p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.items {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
	}

	.item {
		display: flex;
		gap: 20px;
		padding: 12px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		align-items: baseline;
	}

	.item:last-child {
		border-bottom: none;
	}

	.item code {
		flex-shrink: 0;
		width: 260px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.item span {
		font-size: 0.9rem;
		color: var(--smrt-color-on-surface-variant, #555);
		line-height: 1.5;
	}

	.repo-link {
		margin-top: 24px;
	}

	@media (max-width: 768px) {
		.header h1 {
			font-size: 2rem;
		}

		.lead {
			font-size: 1rem;
		}

		.item {
			flex-direction: column;
			gap: 4px;
		}

		.item code {
			width: auto;
		}
	}
</style>
