<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import { ArticleCard, ArticleList, Markdown } from '@happyvertical/smrt-content/svelte';

	const sampleArticle = {
		id: '1',
		slug: 'getting-started-with-smrt',
		title: 'Getting Started with SMRT',
		excerpt: 'Learn how to build scalable applications with the SMRT framework. This guide covers installation, configuration, and best practices.',
		body: '<p>Full article content here...</p>',
		author: 'Jane Developer',
		publishedAt: new Date('2025-01-15'),
		tags: ['tutorial', 'beginner', 'framework'],
		status: 'published',
		createdAt: new Date('2025-01-10'),
		updatedAt: new Date('2025-01-15')
	};

	const sampleArticles = [
		sampleArticle,
		{
			id: '2',
			slug: 'advanced-patterns',
			title: 'Advanced SMRT Patterns',
			excerpt: 'Deep dive into advanced patterns for building complex applications with SMRT.',
			body: '<p>Advanced content...</p>',
			author: 'John Architect',
			publishedAt: new Date('2025-01-12'),
			tags: ['advanced', 'patterns'],
			status: 'published',
			createdAt: new Date('2025-01-08'),
			updatedAt: new Date('2025-01-12')
		},
		{
			id: '3',
			slug: 'content-management',
			title: 'Content Management Guide',
			excerpt: 'How to effectively manage content using the smrt-content module.',
			body: '<p>Content management...</p>',
			author: 'Sarah Writer',
			publishedAt: new Date('2025-01-10'),
			tags: ['content', 'cms'],
			status: 'published',
			createdAt: new Date('2025-01-05'),
			updatedAt: new Date('2025-01-10')
		}
	];

	const sampleMarkdown = `# Hello SMRT

This is **markdown** content rendered with the \`Markdown\` component.

## Features

- Lists
- **Bold** and *italic* text
- \`inline code\`

> Blockquotes work too!

\`\`\`typescript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
`;
</script>

<ModuleTabs
	name="smrt-content"
	description="STI content with contribution intake, governance workflows, AI reviews, fact-checking, corrections, versioning with transparency snapshots, and prompt-registered thumbnail generation."
	badges={['v0.24.12', 'Governance', 'Contributions', 'Prompt Registry']}
>
	{#snippet docs()}
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-content</code> is the framework's content engine. v0.24 grows the
			package well beyond CRUD: it now ships <strong>contribution intake</strong>,
			<strong>persisted governance</strong> (policy / profile / assignment), AI-driven
			<strong>reviews and corrections</strong>, <strong>versioning with frozen transparency</strong>,
			a dedicated <code>content_assets</code> noun join, and prompt-registered thumbnail strategies.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>STI hierarchy: <code>Article</code>, <code>ContentDocument</code>, <code>Mirror</code> share <code>contents</code></li>
			<li>Persisted governance: <code>ContentGovernancePolicy</code>, <code>ContentGovernanceProfile</code>, <code>ContentGovernanceAssignment</code></li>
			<li>AI reviews via <code>runReviewAction()</code> with fingerprint staleness detection</li>
			<li>Post-publication corrections: <code>ContentCorrection</code> (correction / retraction / update / clarification)</li>
			<li>Version snapshots: <code>ContentVersion</code> with frozen transparency on publication</li>
			<li>Contributions: <code>ContentContribution</code> + Contributor / Type / Revision / Attachment</li>
			<li>Dedicated <code>content_assets</code> noun join (replaces ad-hoc <code>AssetAssociation</code>)</li>
			<li>Thumbnail strategies: headline-card, static-map, AI-generate</li>
			<li>Prompt registry integration via <code>@happyvertical/smrt-prompts</code></li>
			<li>API contracts: <code>AssetAssociable</code>, <code>MetadataAccessor</code></li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-content`} language="bash" />

		<h3>Imports</h3>
		<CodeBlock
			code={`import {
  Content, Article, ContentDocument, Mirror,
  Contents,
  ContentReview, ContentCorrection, ContentVersion,
  ContentGovernancePolicy, ContentGovernanceProfile, ContentGovernanceAssignment,
  ContentContribution, ContentContributor,
  ContentContributionType, ContentContributionRevision, ContentContributionAttachment,
  ContentReference, ContentAsset,
  configureContentGovernance,
  smrtContentReviewPrompt,
  smrtContentApplyCorrectionPrompt,
  smrtContentThumbnailAIGeneratePrompt,
} from '@happyvertical/smrt-content';`}
			language="typescript"
		/>
	</section>

	<section id="sti-models">
		<h2>STI hierarchy and noun joins</h2>
		<p>
			Content uses single-table inheritance keyed by the qualified discriminator —
			e.g. <code>@happyvertical/smrt-content:Article</code> — and tenant scoping is optional
			(<code>tenantId=null</code> means global content).
		</p>

		<table>
			<thead>
				<tr><th>Class</th><th>STI discriminator</th></tr>
			</thead>
			<tbody>
				<tr><td><code>Content</code></td><td>(base)</td></tr>
				<tr><td><code>Article</code></td><td><code>@happyvertical/smrt-content:Article</code></td></tr>
				<tr><td><code>ContentDocument</code></td><td><code>@happyvertical/smrt-content:ContentDocument</code></td></tr>
				<tr><td><code>Mirror</code></td><td><code>@happyvertical/smrt-content:Mirror</code></td></tr>
			</tbody>
		</table>

		<h3>Dedicated noun joins</h3>
		<p>
			Content owns its asset relationships via <code>ContentAsset</code> (table
			<code>content_assets</code>) and its content-to-content references via
			<code>ContentReference</code> (table <code>content_references</code>). These replace any
			ad-hoc use of <code>AssetAssociation</code> for content-owned assets — keep
			<code>AssetAssociation</code> for generic / provenance links only.
		</p>

		<CodeBlock
			code={`await content.addAsset(image, 'thumbnail', 0);   // role, sortOrder
await content.getAssets('attachment');
await content.setThumbnail(image);              // convenience: addAsset + thumbnailAssetId
await content.addReference(otherContent);
await content.getReferences();`}
			language="typescript"
		/>
	</section>

	<section id="governance">
		<h2>Governance workflow</h2>
		<p>
			Governance is driven by three persisted models: <code>ContentGovernancePolicy</code> (review
			rules), <code>ContentGovernanceProfile</code> (named requirement bundles), and
			<code>ContentGovernanceAssignment</code> (type/variant → profile, feature flags). DB rows
			merge over static config.
		</p>

		<CodeBlock
			code={`// 1) Static defaults (optional)
configureContentGovernance({
  policies:    [/* ContentGovernancePolicy seeds */],
  profiles:    [/* ContentGovernanceProfile seeds */],
  assignments: [/* ContentGovernanceAssignment seeds */],
});

// 2) Resolve effective governance for a single content
const resolved = await article.resolveGovernance();
// { isGoverned, reviewPolicies, profileKeys, featureFlags }

// 3) Run an AI review tied to a policy
const review = await article.runReviewAction({
  policyKey: 'editorial.fact-check',
  kind: 'fact-check',
});

// 4) Evaluate a profile's requirements
const readiness = await article.evaluateReviewProfile('editorial.publish-ready');

// 5) Publication triggers ContentVersion + transparency snapshot when 'enforcePublishReadiness' is on
article.status = 'published';
await article.save();  // throws ValidationError if required reviews are missing/stale`}
			language="typescript"
		/>

		<p>
			<code>ContentReview</code> writes a fingerprint of the content state at review time. When the
			content changes, the fingerprint mismatch flags the review as stale.
		</p>
	</section>

	<section id="contributions">
		<h2>Contributions intake</h2>
		<p>
			The contribution family lets external collaborators submit drafts that are held until a
			human or workflow promotes them to live <code>Content</code>.
		</p>

		<table>
			<thead>
				<tr><th>Model</th><th>Purpose</th></tr>
			</thead>
			<tbody>
				<tr><td><code>ContentContribution</code></td><td>Held submission with lifecycle: submitted → approved / rejected / withdrawn → promoted</td></tr>
				<tr><td><code>ContentContributor</code></td><td>Profile resolved by email; trust level (standard / trusted / blocked)</td></tr>
				<tr><td><code>ContentContributionType</code></td><td>Channel configuration: rules and promotion mapping</td></tr>
				<tr><td><code>ContentContributionRevision</code></td><td>Revision history on a single submission</td></tr>
				<tr><td><code>ContentContributionAttachment</code></td><td>Held file; becomes an Asset on promotion</td></tr>
			</tbody>
		</table>

		<CodeBlock
			code={`// Submit a contribution
const submission = new ContentContribution({
  contributionTypeKey: 'community-tip',
  contributorEmail: 'tipster@example.org',
  title: 'Council just voted on the new park',
  body: '...',
});
await submission.save();

// Approve + promote -- materialises live Content + attachments become Assets
await submission.approve({ reviewerProfileId: 'editor-1' });
const live = await submission.promote();`}
			language="typescript"
		/>
	</section>

	<section id="corrections-versions">
		<h2>Corrections and versions</h2>

		<h3>Post-publication corrections</h3>
		<CodeBlock
			code={`// Issue a correction tied to the live content
await article.issueCorrectionAction({
  type: 'correction',         // 'correction' | 'retraction' | 'update' | 'clarification'
  summary: 'Fixed misspelled councilor name',
  note: 'Per email from press office, 2026-04-02',
});

const corrections = await article.listCorrections();`}
			language="typescript"
		/>

		<h3>Version snapshots</h3>
		<CodeBlock
			code={`// Manual snapshot
await article.mutateVersionAction({ kind: 'manual', summary: 'Before structural edit' });

// Publication snapshots are created automatically with transparency frozen in metadata
const versions = await article.listVersions();

// Two flavours of transparency
const publishedSnapshot = await article.getPublishedTransparencyAction();
const livePreview       = await article.previewTransparencyAction();`}
			language="typescript"
		/>
		<p>
			Use <code>getPublishedTransparencyAction()</code> for public display (frozen at publication)
			and <code>previewTransparencyAction()</code> for editor-side previews.
		</p>
	</section>

	<section id="thumbnails">
		<h2>Thumbnail generation</h2>
		<p>
			Three strategies via <code>ThumbnailGenerator</code>. The AI-generate strategy is wired
			through the prompt registry so tenants can override template/style at runtime.
		</p>

		<h3>headline-card</h3>
		<CodeBlock
			code={`await article.generateThumbnail({
  strategy: 'headline-card',
  brandColor: '#1a56db',
  subtitle: 'Civic News',
});`}
			language="typescript"
		/>

		<h3>static-map</h3>
		<p>Requires <code>metadata.latitude</code> + <code>metadata.longitude</code>; uses unary <code>+</code> for strict parsing.</p>
		<CodeBlock
			code={`event.metadata = { latitude: 40.7128, longitude: -74.006 };
await event.generateThumbnail({
  strategy: 'static-map',
  mapProvider: 'mapbox',
  zoom: 12,
  markerColor: 'red',
});`}
			language="typescript"
		/>

		<h3>ai-generate</h3>
		<CodeBlock
			code={`await article.generateThumbnail({
  strategy: 'ai-generate',
  style: 'photorealistic',
  styleHint: 'editorial newsroom photo',
});`}
			language="typescript"
		/>

		<h3>Bulk fill-in</h3>
		<CodeBlock
			code={`const result = await contents.generateMissingThumbnails({
  strategy: 'headline-card',
  where: { type: 'article', status: 'published' },
  brandColor: '#1a56db',
  limit: 100,
});`}
			language="typescript"
		/>
	</section>

	<section id="prompt-registry">
		<h2>Prompt Registry</h2>
		<p>
			Content's AI features are registered with
			<a href="/modules/smrt-prompts"><code>@happyvertical/smrt-prompts</code></a> so tenants can
			override template, profile, model, or parameters per environment.
		</p>

		<table>
			<thead>
				<tr><th>Key</th><th>Used by</th></tr>
			</thead>
			<tbody>
				<tr><td><code>smrtContent.review</code></td><td><code>runReviewAction()</code></td></tr>
				<tr><td><code>smrtContent.applyCorrection</code></td><td>Correction synthesis flows</td></tr>
				<tr><td><code>smrtContent.thumbnail.aiGenerate</code></td><td><code>ThumbnailGenerator</code> strategy <code>'ai-generate'</code></td></tr>
			</tbody>
		</table>

		<h3>PII contract for thumbnail.aiGenerate</h3>
		<p>
			Allow-listed variables: <code>style</code>, <code>title</code>, <code>styleHint</code>,
			<code>descriptionClause</code>. Excluded: <code>id</code>, <code>tenantId</code>, the
			free-form <code>metadata</code> blob (may carry tenant-private configuration or coordinates
			unrelated to the visual prompt).
		</p>

		<CodeBlock
			code={`import {
  smrtContentReviewPrompt,
  smrtContentApplyCorrectionPrompt,
  smrtContentThumbnailAIGeneratePrompt,
} from '@happyvertical/smrt-content';`}
			language="typescript"
		/>
	</section>

	<section id="api-contracts">
		<h2>API contracts: AssetAssociable + MetadataAccessor</h2>
		<p>
			<code>Content</code> implements two contracts (issue #1162). Consumers can type their
			parameters as the contract and rely on the methods existing without
			<code>typeof === 'function'</code> defensive checks:
		</p>

		<CodeBlock
			code={`import type { AssetAssociable, MetadataAccessor } from '@happyvertical/smrt-content';

async function attachThumbnail(doc: AssetAssociable, asset: Asset) {
  await doc.addAsset(asset, 'thumbnail', 0); // contract guaranteed
}

function bumpRevision(doc: MetadataAccessor) {
  const meta = doc.getMetadata();
  doc.updateMetadata({ revision: (meta.revision ?? 0) + 1 });
}`}
			language="typescript"
		/>
	</section>

	<section id="chat-integration">
		<h2>Chat integration</h2>
		<p>
			Content exposes <code>GET/POST /api/v1/contents/{'{'}id{'}'}/chat</code> which creates chat
			sessions via <a href="/modules/smrt-chat"><code>@happyvertical/smrt-chat</code></a>. The
			endpoint gracefully returns <code>session: null</code> with a notice when chat tables are not
			yet provisioned. Editor components support
			<code>onAssistantContextChange</code>; server-side consumers can reuse the exported helpers
			(<code>getOrCreateContentEditorChatSession</code>,
			<code>createContentEditorChatThread</code>,
			<code>listContentEditorChatThreadMessages</code>,
			<code>sendContentEditorChatThreadMessage</code>) for app-specific tenancy / AI route wiring.
		</p>
	</section>

	<section id="category">
		<h2>Category navigation</h2>
		<CodeBlock
			code={`content.category = 'technology/ai/nlp';

content.getCategorySegments();      // ['technology', 'ai', 'nlp']
content.getParentCategory();        // 'technology/ai'
content.getRootCategory();          // 'technology'
content.getAncestorPaths();         // ['technology', 'technology/ai', ...]
content.isInCategory('technology'); // true`}
			language="typescript"
		/>
	</section>

	<section id="gotchas">
		<h2>Gotchas</h2>
		<ul>
			<li><strong>Publish readiness enforcement</strong>: <code>save()</code> throws <code>ValidationError</code> if blocking requirements aren't met when setting status to <code>'published'</code>.</li>
			<li><strong>Stale reviews</strong>: detected by fingerprint mismatch on the content's reviewable state.</li>
			<li><strong>Transparency snapshots</strong>: published transparency is frozen in <code>ContentVersion.metadata.transparency</code> — use published for public display, preview for editors.</li>
			<li><strong>Metadata is primary extension pattern</strong>: prefer the JSON <code>metadata</code> field over additional class fields.</li>
			<li><strong>Static map coordinates</strong>: uses unary <code>+</code> for strict parsing (rejects <code>"45invalid"</code>).</li>
			<li><strong>content_assets, not AssetAssociation</strong>: use the dedicated noun join for content-owned assets; <code>AssetAssociation</code> is for generic / provenance only.</li>
		</ul>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> — SmrtObject base + STI</li>
			<li><a href="/modules/smrt-assets">smrt-assets</a> — Asset model + AssetRuntime; <code>content_assets</code> references Asset</li>
			<li><a href="/modules/smrt-images">smrt-images</a> — Image extends Asset; sets thumbnails on content</li>
			<li><a href="/modules/smrt-prompts">smrt-prompts</a> — Tenant-overridable AI prompt registry</li>
			<li><a href="/modules/smrt-chat">smrt-chat</a> — Per-content chat sessions</li>
			<li><a href="/modules/smrt-facts">smrt-facts</a> — Fact catalog linked to content</li>
		</ul>
	</section>
	{/snippet}

	{#snippet components()}
		<section>
			<h2>Content Components</h2>
			<p>
				The <code>@happyvertical/smrt-content</code> package includes 19 Svelte 5 components
				covering content lists, editing, governance, transparency reporting, and contribution
				management. The examples below render a few of the most common surfaces.
			</p>

			<h2>ArticleCard</h2>
			<p>Display a single article with title, excerpt, author, and metadata.</p>

			<ComponentExample
				code={`<script>
  const article = {
    title: 'Getting Started with SMRT',
    excerpt: 'Learn how to build scalable applications...',
    author: 'Jane Developer',
    publishedAt: new Date('2025-01-15'),
    tags: ['tutorial', 'beginner']
  };
</script>

<ArticleCard {article} showTags showDate showAuthor />`}
			>
				<ArticleCard article={sampleArticle} showTags showDate showAuthor />
			</ComponentExample>

			<h2>ArticleList</h2>
			<p>Display a grid of article cards.</p>

			<ComponentExample code={`<ArticleList articles={articles} columns={3} showTags />`}>
				<ArticleList articles={sampleArticles} columns={3} showTags />
			</ComponentExample>

			<h2>Markdown</h2>
			<p>Render markdown content with syntax highlighting.</p>

			<ComponentExample code={`<Markdown content={markdownText} />`}>
				<div class="markdown-wrapper">
					<Markdown content={sampleMarkdown} />
				</div>
			</ComponentExample>

			<h2>Component catalogue</h2>
			<ul>
				<li><strong>Content management</strong>: <code>ContentList</code>, <code>ContentEditor</code>, <code>GovernedContentEditor</code>, <code>ContentAgentChat</code>, <code>ArticleCard</code>, <code>ArticleList</code>, <code>ImageThumbnail</code>, <code>Markdown</code></li>
				<li><strong>Governance</strong>: <code>ContentGovernanceManager</code>, <code>ContentGovernancePanel</code>, <code>ContentGovernancePolicyEditor</code>, <code>ContentGovernanceProfileEditor</code>, <code>ContentGovernanceAssignmentEditor</code>, <code>ContentTransparencyReport</code></li>
				<li><strong>Contributions</strong>: <code>ContentContributionForm</code>, <code>ContentContributionInbox</code>, <code>ContentContributionPortal</code>, <code>ContentContributionTypeManager</code>, <code>ContentContributorManager</code></li>
			</ul>

			<CodeBlock
				code={`import {
  ArticleCard, ArticleList, Markdown,
  ContentEditor, GovernedContentEditor,
  ContentGovernanceManager, ContentTransparencyReport,
  ContentContributionInbox, ContentContributionForm,
} from '@happyvertical/smrt-content/svelte';`}
				language="typescript"
			/>

			<p>
				<a href="/components/content">View detailed component docs →</a>
			</p>
		</section>

		<section>
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-core" class="link-card">
					<h3>smrt-core</h3>
					<p>SmrtObject, STI support</p>
				</a>
				<a href="/modules/smrt-assets" class="link-card">
					<h3>smrt-assets</h3>
					<p>AssetRuntime + content_assets</p>
				</a>
				<a href="/modules/smrt-prompts" class="link-card">
					<h3>smrt-prompts</h3>
					<p>Tenant-overridable prompt registry</p>
				</a>
			</div>
		</section>
	{/snippet}
</ModuleTabs>
