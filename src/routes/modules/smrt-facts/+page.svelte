<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-facts"
	description="Distributed knowledge base with 3-zone semantic deduplication, evolution chains, provenance tracking, and confidence scoring."
	badges={['v0.24.12', 'Semantic Dedup', 'Evolution Chains', 'Confidence']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-facts</strong> provides a distributed knowledge base where facts are atomic
			units of knowledge with provenance tracking. Facts evolve through parent-child chains,
			undergo 3-zone semantic reconciliation (0.85 / 0.60 thresholds) to prevent duplicates, and
			carry confidence scores computed from source credibility, recency, and corroboration.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>3-zone semantic reconciliation (auto-merge, AI disambiguation, new fact)</li>
				<li>Evolution chains: correction, refinement, contradiction, extension</li>
				<li>Confidence scoring from source count, credibility, recency, and corroboration</li>
				<li>Polymorphic entity linking via <code>FactSubject</code> (string-based, no FK)</li>
				<li><code>FactContent</code> junction linking facts to Content</li>
				<li>Auto-generated embeddings for semantic search (failures are non-fatal)</li>
				<li>Optional tenancy with <code>findWithGlobals(tenantId)</code> for tenant + global facts</li>
			</ul>
		</aside>

		<h3>Tenancy</h3>
		<p>
			<code>Fact</code> uses <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> with a
			nullable <code>tenantId</code>. Global facts (<code>tenantId = null</code>) are visible to
			every tenant — useful for shared reference knowledge. Use
			<code>findWithGlobals(tenantId)</code> to retrieve tenant + global facts in one query.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-facts`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Fact, FactCollection,
  FactSource, FactSourceCollection,
  FactSubject, FactSubjectCollection,
} from '@happyvertical/smrt-facts';

// Create a fact with provenance
const facts = await FactCollection.create({ db });
const fact = await facts.create({
  textRefined: 'The Eiffel Tower is 330 meters tall',
  type: 'measurement',
  domain: 'landmarks',
  status: 'active',
});

// Attach a source with credibility score
const sources = await FactSourceCollection.create({ db });
await sources.create({
  factId: fact.id,
  sourceUrl: 'https://example.com/eiffel-tower',
  sourceTitle: 'Tourism Board',
  credibility: 0.9,
});

// Recalculate confidence from all sources
await facts.recalculateConfidence(fact.id);

// 3-zone semantic reconciliation
const result = await facts.reconcile({
  rawInput: 'The Eiffel Tower stands 330m tall',
  type: 'measurement',
  domain: 'landmarks',
  source: { sourceUrl: 'https://another-source.com', credibility: 0.8 },
});
// result.action: 'created' | 'merged' | 'branched'

// Evolution: branch creates a child linked via parentId
const child = await facts.branch(fact.id, {
  textRefined: 'The Eiffel Tower is 330 meters tall including the antenna',
}, 'correction');

// Walk evolution
const chain = await facts.getEvolutionChain(child.id); // root → current
const latest = await facts.getLatestInChain(fact.id);  // highest-confidence leaf
const tree = await facts.getEvolutionTree(fact.id);    // BFS all descendants

// Entity briefing: all facts for a given entity
const briefing = await facts.getEntityBriefing('Place', placeId);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Fact</h3>
		<CodeBlock
			code={`class Fact extends SmrtObject {
  textRefined: string         // Cleaned knowledge statement
  type: string                // assertion / observation / measurement / definition / ...
  domain?: string
  status: 'pending' | 'active' | 'disputed' | 'superseded' | 'archived' | 'retracted'
  confidence: number          // 0-1, computed from sources
  parentId?: string           // Evolution chain link

  // Auto-generated embeddings:
  //   fields: ['textRefined'], autoGenerate: true, combinedField: {...}
}`}
			language="typescript"
		/>

		<h3>FactSource (Provenance)</h3>
		<CodeBlock
			code={`class FactSource extends SmrtObject {
  factId: string
  sourceUrl: string
  sourceTitle?: string
  sourceType?: string
  credibility: number         // 0-1
  extractedAt?: Date
}`}
			language="typescript"
		/>

		<h3>FactSubject (Polymorphic Entity Link)</h3>
		<CodeBlock
			code={`class FactSubject extends SmrtObject {
  factId: string
  entityType: string          // e.g. 'Place', 'Person'
  entityId: string            // Plain string ID -- NO FK (cross-package)
  role?: string

  // conflictColumns: ['fact_id', 'entity_type', 'entity_id']
}`}
			language="typescript"
		/>

		<h3>FactContent (Content Junction)</h3>
		<CodeBlock
			code={`class FactContent extends SmrtObject {
  factId: string
  contentId: string           // FK to smrt-content (plain string, cross-package)
  relationship: string        // 'cites', 'derived-from', etc.

  // conflictColumns: ['fact_id', 'content_id', 'relationship']
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>3-Zone Semantic Reconciliation</h2>
		<CodeBlock
			code={`// Similarity zones:
//
//   >= 0.85   Auto-merge (same fact, update metadata)
//   0.60-0.85 AI disambiguation (model decides merge / branch / create)
//   <  0.60   New fact (no match)
//
// If AI disambiguation fails, defaults to BRANCH (safer than merge).

const result = await facts.reconcile({
  rawInput: 'New fact text to reconcile',
  type: 'assertion',
  domain: 'science',
  source: { sourceUrl: 'https://source.com', credibility: 0.85 },
});

// Confidence formula (clamped 0-1):
//   base 0.5
//   + source volume (max 0.3)
//   + avg credibility (max 0.2)
//   + recency (max 0.1, decays over 10 days)
//   + corroboration (max 0.1)`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Evolution Chains</h2>
		<p>
			All evolution traversals use a <code>visited</code> Set for cycle detection — circular chains
			won't blow the stack.
		</p>
		<CodeBlock
			code={`await facts.getEvolutionChain(factId);  // root → current (linear ancestry)
await facts.getLatestInChain(rootId);   // highest-confidence leaf
await facts.getEvolutionTree(rootId);   // BFS all descendants`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Gotchas</h2>
		<ul>
			<li><strong>Embedding failures are non-fatal</strong>: try/catch with silent fail — doesn't block fact creation</li>
			<li><strong>Metadata auto-stringify</strong>: constructor <code>JSON.stringify</code>s objects; getters return parsed objects</li>
			<li><strong>AI disambiguation fallback</strong>: if the model fails, the resolver defaults to <code>branch</code> (safer than <code>merge</code>)</li>
			<li><strong>Optional tenancy</strong> with nullable <code>tenantId</code> — use <code>findWithGlobals(tenantId)</code></li>
		</ul>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>reconcile()</code> to prevent duplicate facts on ingest</li>
				<li>Attach sources with credibility scores so confidence stays meaningful</li>
				<li>Use evolution chains for corrections and refinements (never silently overwrite)</li>
				<li>Call <code>recalculateConfidence()</code> after adding new sources</li>
				<li>Use <code>findWithGlobals(tenantId)</code> to include global facts</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't skip reconciliation when ingesting facts — creates duplicates</li>
				<li>Don't manually set <code>confidence</code> — use <code>recalculateConfidence()</code></li>
				<li>Don't modify metadata fields directly — use the getter/setter helpers</li>
				<li>Don't try to model circular evolution chains intentionally — traversals will short-circuit</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content linked to facts via <code>FactContent</code></p>
			</a>
			<a href="/modules/smrt-tags">
				<h3>smrt-tags</h3>
				<p>Tag associations via FactTag</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Optional multi-tenant scoping</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
