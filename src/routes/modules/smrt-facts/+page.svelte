<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-facts"
	description="Knowledge base with semantic deduplication, provenance tracking, evolution chains, and confidence scoring."
	badges={['v0.20.44', 'Semantic Dedup', 'Evolution Chains', 'Confidence']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-facts</strong> provides a distributed knowledge base where facts are atomic units
			of knowledge with provenance tracking. Facts evolve through parent-child chains, undergo 3-zone
			semantic reconciliation to prevent duplicates, and carry confidence scores computed from source
			credibility.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>3-zone semantic reconciliation (auto-merge, AI disambiguation, new fact)</li>
				<li>Evolution chains: correction, refinement, contradiction, extension</li>
				<li>Confidence scoring from source count, credibility, recency, and corroboration</li>
				<li>Polymorphic entity linking via FactSubject</li>
				<li>Auto-generated embeddings for semantic search</li>
				<li>Optional tenancy with <code>findWithGlobals()</code> for tenant + global facts</li>
			</ul>
		</aside>
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
  calculateConfidence, normalizeText,
} from '@happyvertical/smrt-facts';

// Create a fact with provenance
const facts = new FactCollection(db);
const fact = await facts.create({
  textRefined: 'The Eiffel Tower is 330 meters tall',
  type: 'measurement',
  domain: 'landmarks',
  status: 'active',
});

// Attach a source with credibility score
const sources = new FactSourceCollection(db);
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

// Evolution chains: branch creates a child linked via parentId
const child = await facts.branch(fact.id, {
  textRefined: 'The Eiffel Tower is 330 meters tall including the antenna',
}, 'correction');

// Walk evolution: root -> current
const chain = await facts.getEvolutionChain(child.id);
const latest = await facts.getLatestInChain(fact.id);
const tree = await facts.getEvolutionTree(fact.id);

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
  type: string                // assertion/observation/measurement/definition/...
  domain?: string
  status: 'pending' | 'active' | 'disputed' | 'superseded' | 'archived' | 'retracted'
  confidence: number          // 0-1, computed from sources
  parentId?: string           // Evolution chain link

  // Auto-generated embeddings for semantic search
}`}
			language="typescript"
		/>

		<h3>FactSource</h3>
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
  entityType: string          // e.g., 'Place', 'Person'
  entityId: string            // Plain string ID (no FK)
  role?: string

  // conflictColumns: ['fact_id', 'entity_type', 'entity_id']
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Semantic Reconciliation</h2>
		<CodeBlock
			code={`// 3-zone similarity thresholds:
//
// >= 0.85: Auto-merge (same fact, update metadata)
// 0.60-0.85: AI disambiguation (model decides merge vs branch)
// < 0.60: Create new fact (no match)
//
// If AI disambiguation fails, defaults to branch (safer than merge)

const result = await facts.reconcile({
  rawInput: 'New fact text to reconcile',
  type: 'assertion',
  domain: 'science',
  source: { sourceUrl: 'https://source.com', credibility: 0.85 },
});

// Confidence formula (clamped 0-1):
// base 0.5
// + source volume (max 0.3)
// + avg credibility (0.2)
// + recency (0.1, decays over 10 days)
// + corroboration (0.1)`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>reconcile()</code> to prevent duplicate facts</li>
				<li>Attach sources with credibility scores for accurate confidence</li>
				<li>Use evolution chains for corrections and refinements</li>
				<li>Call <code>recalculateConfidence()</code> after adding new sources</li>
				<li>Use <code>findWithGlobals(tenantId)</code> to include global facts</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't skip reconciliation when ingesting facts (creates duplicates)</li>
				<li>Don't assume embedding generation blocks fact creation (failures are non-fatal)</li>
				<li>Don't manually set confidence (use <code>recalculateConfidence()</code>)</li>
				<li>Don't modify metadata fields directly (use getter/setter helpers)</li>
				<li>Don't create circular evolution chains (traversals use cycle detection)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content linked to facts via FactContent</p>
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
