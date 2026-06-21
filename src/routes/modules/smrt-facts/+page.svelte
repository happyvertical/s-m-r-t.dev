<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
</script>

<ModulePage
	name="smrt-facts"
	description="Distributed knowledge base with 3-zone semantic deduplication, evolution chains, provenance tracking, and confidence scoring."
	badges={['v0.29.34', 'Semantic Dedup', 'Evolution Chains', 'Confidence']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-facts</strong> provides a distributed knowledge base where facts are atomic units of
			knowledge with provenance tracking. Facts evolve through parent-child chains, undergo 3-zone semantic
			reconciliation (0.85 / 0.60 thresholds) to prevent duplicates, and carry confidence scores computed
			from source credibility, recency, and corroboration.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>3-zone semantic reconciliation (auto-merge, AI disambiguation, new fact)</li>
				<li>Evolution chains: correction, refinement, contradiction, extension</li>
				<li>Confidence scoring from source count, credibility, recency, and corroboration</li>
				<li>Polymorphic entity linking via <code>FactSubject</code> (string-based, no FK)</li>
				<li><code>FactContent</code> junction linking facts to Content</li>
				<li>
					<code>FactEvidence</code> provenance spans (quote + locator + verdict) backing each fact
				</li>
				<li>
					AI claim-extraction pipeline: <code>extractCandidatesFromText</code>,
					<code>extractArticleClaims</code>, and <code>assessClaimSupport</code>
				</li>
				<li>Auto-generated embeddings for semantic search (failures are non-fatal)</li>
				<li>
					Optional tenancy with <code>findWithGlobals(tenantId)</code> for tenant + global facts
				</li>
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

// Evolution: branch creates a successor linked via previousFactId
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
  textRaw: string             // Original, unprocessed input
  type: string                // assertion / observation / measurement / definition / relationship / event / opinion / prediction
  domain: string
  status: string              // pending / active / disputed / superseded / archived / retracted
  confidence: number          // 0-1, computed from sources
  sourceCount: number         // number of attached sources
  previousFactId: string      // @foreignKey('Fact') — evolution chain link (NOT a structural parent)
  evolutionType: string       // original / correction / refinement / contradiction / extension / merge

  // Auto-generated embeddings (@smrt embeddings config):
  //   fields: ['textRefined'], provider: 'auto', autoGenerate: true,
  //   combinedField: { name: 'full_context', template: '{textRefined}\\n\\nType: {type}\\nDomain: {domain}' }
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
  factId: string              // @foreignKey('Fact')
  entityType: string          // e.g. 'Place', 'Person'
  entityId: string            // Plain string ID -- NO FK (cross-package)
  role: string                // SubjectRole: subject / object / source / location / participant / related (default 'subject')

  // conflictColumns: ['fact_id', 'entity_type', 'entity_id']
}`}
			language="typescript"
		/>

		<h3>FactContent (Content Junction)</h3>
		<CodeBlock
			code={`class FactContent extends SmrtObject {
  factId: string              // @foreignKey('Fact')
  contentId: string           // Plain string ID to smrt-content -- NO FK (cross-package)
  relationship: string        // FactContentRelationship: extracted_from / referenced_in / supports / contradicts / related (default 'extracted_from')

  // conflictColumns: ['fact_id', 'content_id', 'relationship']
}`}
			language="typescript"
		/>

		<h3>FactEvidence (provenance spans)</h3>
		<p>
			<code>FactSource</code> is the coarse source summary; <code>FactEvidence</code> records the
			concrete excerpt/span/artifact that supports (or contradicts) a fact. Each evidence row carries
			a verdict <code>status</code> and the quote + locator it was drawn from, so a claim's support can
			be traced back to specific text.
		</p>
		<CodeBlock
			code={`// @TenantScoped({ mode: 'optional' });
// conflictColumns: ['fact_id', 'evidence_key']
class FactEvidence extends SmrtObject {
  factId: string              // @foreignKey('Fact', { required: true })
  evidenceKey: string         // stable per-fact dedup key (required)
  status: FactEvidenceStatus  // 'supports' | 'contradicts' | 'unclear' | 'irrelevant' | 'invalid'
  sourceKind: string          // e.g. 'article' | 'transcript' | 'dataset'
  sourceId: string            // plain string ref (cross-package)
  sourceUrl: string
  sourceTitle: string
  quote: string               // the supporting excerpt
  locator: string             // page / timestamp / selector
  extractionMethod: string    // how the span was obtained
  confidence: number          // 0-1
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Claim extraction pipeline</h2>
		<p>
			<code>FactCollection</code> exposes an AI-assisted pipeline for turning unstructured text into
			reviewable fact candidates and for checking whether a claim is actually supported. These methods
			call the configured AI client's <code>message()</code> with a fact-extraction prompt (resolved
			through <a href="/modules/smrt-prompts">smrt-prompts</a>, so tenants can override it) — they are
			<strong>not</strong> persistent: callers review, reconcile, link, or discard the returned
			candidates per their own workflow.
		</p>

		<h3>Two extractors</h3>
		<p>
			The two extractors are intentionally separate: <code>extractCandidatesFromText</code> finds
			evidence-backed facts <em>in</em> a source, while <code>extractArticleClaims</code> finds the
			material claims an article draft itself needs to justify.
		</p>
		<CodeBlock
			code={`// 1) Extract atomic facts from source material (agenda, minutes, transcript…)
const candidates = await facts.extractCandidatesFromText(sourceText, {
  domain: 'civic',
  sourceType: 'minutes',
  maxFacts: 12,                 // default 12
  // allowedTypes: ['assertion', 'measurement', ...]
});

// 2) Extract the claims an article makes (what the draft must justify)
const claims = await facts.extractArticleClaims(articleBody, {
  domain: 'civic',
  maxFacts: 24,                 // default 24
});

// FactExtractionCandidate:
// { statement, type?, sourceExcerpt?, confidence?, metadata? }`}
			language="typescript"
		/>

		<h3>Assessing claim support</h3>
		<p>
			Given a claim and candidate facts (each optionally carrying <code>FactEvidence</code>),
			<code>assessClaimSupport</code> classifies whether the claim holds. It returns a status plus the
			fact/evidence ids that matched and a rationale — the audit trail for a fact-check.
		</p>
		<CodeBlock
			code={`const assessment = await facts.assessClaimSupport(claim, candidateFacts);

// FactClaimSupportAssessment:
// {
//   status: 'supported' | 'unsupported' | 'contradicted' | 'needs_review',
//   matchedFactIds: string[],
//   matchedEvidenceIds: string[],
//   rationale: string,
//   confidence?: number,
// }`}
			language="typescript"
		/>
		<Callout variant="note" title="Extraction sends the source text, not the fact graph">
			These helpers send the supplied <code>text</code> (plus your domain/context hints) to the model
			through a registered prompt and parse the JSON response. They don't introspect the stored fact
			graph — pass candidate facts explicitly to <code>assessClaimSupport</code> when you want the
			model to reason over existing knowledge. Extraction calls require an AI client with a
			<code>message()</code> method and throw otherwise.
		</Callout>
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
			All evolution traversals use a <code>visited</code> Set for cycle detection — circular chains won't
			blow the stack.
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
			<li>
				<strong>Embedding failures are non-fatal</strong>: try/catch with silent fail — doesn't
				block fact creation
			</li>
			<li>
				<strong>Metadata auto-stringify</strong>: constructor <code>JSON.stringify</code>s objects;
				getters return parsed objects
			</li>
			<li>
				<strong>AI disambiguation fallback</strong>: if the model fails, the resolver defaults to
				<code>branch</code>
				(safer than <code>merge</code>)
			</li>
			<li>
				<strong>Optional tenancy</strong> with nullable <code>tenantId</code> — use
				<code>findWithGlobals(tenantId)</code>
			</li>
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
				<li>
					Don't manually set <code>confidence</code> — use <code>recalculateConfidence()</code>
				</li>
				<li>Don't modify metadata fields directly — use the getter/setter helpers</li>
				<li>
					Don't try to model circular evolution chains intentionally — traversals will short-circuit
				</li>
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
			<a href="/modules/smrt-prompts">
				<h3>smrt-prompts</h3>
				<p>Tenant-overridable prompts for claim extraction</p>
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
