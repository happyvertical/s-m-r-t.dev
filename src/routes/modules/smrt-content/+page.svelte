<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-content - Content Management System | SMRT Documentation</title>
	<meta
		name="description"
		content="Content management with flexible organization, publishing workflow, asset management, and AI-powered features."
	/>
</svelte:head>

<Grid>
	<nav class="breadcrumb" slot="header">
		<a href="/">Home</a>
		<span>/</span>
		<a href="/modules">Modules</a>
		<span>/</span>
		<span>smrt-content</span>
	</nav>

	<h1>smrt-content</h1>
	<p class="lead">
		Content management system with flexible organization, publishing workflows, asset management,
		and AI-powered analysis.
	</p>

	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-content</code> package provides a specialized content
			management and processing module within the SMRT framework.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>Flexible Content Types</strong>: Article, Document, Mirror with STI support</li>
			<li>
				<strong>Rich Organization</strong>: Context namespacing, hierarchical categories, tags
			</li>
			<li>
				<strong>Publishing Workflow</strong>: Draft → Published → Archived lifecycle
			</li>
			<li><strong>Asset Management</strong>: Thumbnails, attachments, media relationships</li>
			<li>
				<strong>AI-Powered</strong>: Analysis, summaries, translations with do()/is() methods
			</li>
			<li><strong>Markdown Export</strong>: YAML frontmatter + markdown for static sites</li>
			<li><strong>Content Mirroring</strong>: Scrape and cache external content</li>
			<li><strong>Thumbnail Generation</strong>: Headline cards, static maps, AI images</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
┌─────────────────────────────────────────────┐
│          Content Management System           │
├─────────────────────────────────────────────┤
│  Collections Layer (Contents)                │
│  • Batch operations, bulk queries            │
│  • Export/sync operations                    │
│  • Thumbnail generation                      │
├─────────────────────────────────────────────┤
│  Entity Layer (Content)                      │
│  • Single content object management          │
│  • Asset relationships                       │
│  • Reference tracking                        │
├─────────────────────────────────────────────┤
│  Subtypes (STI)                              │
│  • Article (blog posts, news)                │
│  • ContentDocument (PDFs, reports)           │
│  • Mirror (cached external content)          │
├─────────────────────────────────────────────┤
│  Integration Layer                           │
│  • SMRT Core (ORM, persistence)              │
│  • SMRT Assets (media management)            │
│  • External APIs (documents, spider, geo)    │
└─────────────────────────────────────────────┘
			</pre>
		</div>

		<h3>Use Cases</h3>
		<ul>
			<li>Blog and news publishing platforms</li>
			<li>Documentation sites with versioning</li>
			<li>Knowledge bases and wikis</li>
			<li>Content archival and web mirroring</li>
			<li>Location-based content (events, places)</li>
			<li>Multi-language content management</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<h3>Using pnpm (recommended)</h3>
		<CodeBlock code={`pnpm add @happyvertical/smrt-content`} language="bash" />

		<h3>Using npm</h3>
		<CodeBlock code={`npm install @happyvertical/smrt-content`} language="bash" />

		<h3>Using bun</h3>
		<CodeBlock code={`bun add @happyvertical/smrt-content`} language="bash" />

		<h3>Basic Setup</h3>
		<CodeBlock
			code={`import {'{ Contents, Content }'} from '@happyvertical/smrt-content';

// Create collection with database
const contents = await Contents.create({
  db: {'{ url: \'sqlite:./content.db\' }'},
  ai: {'{ type: \'openai\', apiKey: process.env.OPENAI_API_KEY }'}
});`}
			language="typescript"
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create and Save Content</h3>
		<CodeBlock
			code={`const article = new Content({
  title: 'Getting Started with SMRT',
  body: 'Learn how to build with the SMRT framework...',
  type: 'article',
  author: 'Dev Team',
  status: 'published',
  tags: ['smrt', 'tutorial'],
  metadata: {'{ difficulty: \'beginner\' }'}
});

await article.initialize();
await article.save();`}
			language="typescript"
		/>

		<h3>2. Query Content</h3>
		<CodeBlock
			code={`// Get single content
const article = await contents.get({'{ slug: \'my-article\' }'});

// List with filters
const published = await contents.list({
  where: {
    type: 'article',
    status: 'published',
    state: 'active'
  },
  limit: 10
});

// Count results
const total = await contents.count({'{ where: { type: \'article\' } }'});`}
			language="typescript"
		/>

		<h3>3. Use AI Features</h3>
		<CodeBlock
			code={`// Analyze content
const summary = await article.do('Create a 2-sentence summary');
const isAcademic = await article.is('written in academic style');
const topics = await article.do('Extract key topics as JSON array');

// Transform content
const simplified = await article.do('Rewrite at 5th grade reading level');
const spanish = await article.do('Translate to Spanish');`}
			language="typescript"
		/>

		<h3>4. Export to Markdown</h3>
		<CodeBlock
			code={`// Export single content
await contents.writeContentFile({
  content: article,
  contentDir: './exported'
});
// Creates: ./exported/{context}/{slug}/index.md

// Sync all articles
await contents.syncContentDir({
  contentDir: './site/content'
});`}
			language="typescript"
		/>
	</section>

	<section id="core-concepts">
		<h2>Core Concepts</h2>

		<h3>1. Content Types (STI)</h3>
		<p>Single Table Inheritance supports polymorphic content:</p>

		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Use Case</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Article</code></td>
					<td>Blog posts, news articles, editorial content</td>
				</tr>
				<tr>
					<td><code>ContentDocument</code></td>
					<td>PDFs, reports, structured documents</td>
				</tr>
				<tr>
					<td><code>Mirror</code></td>
					<td>Mirrored/cached external content</td>
				</tr>
			</tbody>
		</table>

		<CodeBlock
			code={`// All stored in single 'contents' table with _meta_type
const article = new Article({'{ title: \'...\', type: \'article\' }'});
const document = new ContentDocument({'{ title: \'...\', type: \'document\' }'});
const mirror = new Mirror({'{ title: \'...\', type: \'mirror\' }'});`}
			language="typescript"
		/>

		<h3>2. Status and State</h3>

		<h4>Status (Publication Lifecycle)</h4>
		<ul>
			<li><code>draft</code> - Work in progress, not visible</li>
			<li><code>published</code> - Live and visible</li>
			<li><code>archived</code> - Old, not visible but preserved</li>
			<li><code>deleted</code> - Soft delete marker</li>
		</ul>

		<h4>State (Quality Flag)</h4>
		<ul>
			<li><code>active</code> - Normal content</li>
			<li><code>deprecated</code> - Old version, may be replaced</li>
			<li><code>highlighted</code> - Featured/pinned content</li>
		</ul>

		<CodeBlock
			code={`// Draft workflow
const post = new Content({
  title: 'My Post',
  status: 'draft'
});
await post.save();

// Publish
post.status = 'published';
post.publish_date = new Date();
await post.save();

// Feature content
post.state = 'highlighted';
await post.save();`}
			language="typescript"
		/>

		<h3>3. Content Organization</h3>

		<h4>Context (Namespace)</h4>
		<CodeBlock
			code={`await contents.getOrUpsert({
  slug: 'best-practices',
  context: 'blog-posts',     // Different from 'documentation'
  title: 'Best Practices'
});
// Slug + context creates unique identity`}
			language="typescript"
		/>

		<h4>Category (Hierarchical)</h4>
		<CodeBlock
			code={`content.category = 'technology/ai/nlp';

content.getCategorySegments();      // ['technology', 'ai', 'nlp']
content.getParentCategory();        // 'technology/ai'
content.getRootCategory();          // 'technology'
content.getAncestorPaths();         // ['technology', 'technology/ai', ...]
content.isInCategory('technology'); // true`}
			language="typescript"
		/>

		<h4>Tags (Free-form)</h4>
		<CodeBlock
			code={`content.tags = ['ai', 'machine-learning', 'python', 'tutorial'];`}
			language="typescript"
		/>

		<h3>4. Content Variant</h3>
		<p>Namespaced classification for complex content organization:</p>

		<CodeBlock
			code={`// Format: generator:domain:specific-type

const upcoming = new Article({
  variant: 'praeco:meeting:upcoming',
  title: 'Council Meeting - Next Week'
});

const summary = new Article({
  variant: 'praeco:meeting:summary',
  title: 'Council Meeting Summary'
});

const transcript = new Article({
  variant: 'praeco:meeting:transcript',
  title: 'Meeting Transcript'
});`}
			language="typescript"
		/>

		<h3>5. Asset Relationships</h3>
		<CodeBlock
			code={`// Thumbnail (featured image)
await content.setThumbnail(image);
const thumb = await content.getThumbnail();

// Other attachments
await content.addAsset(pdf, 'attachment', 0);
await content.addAsset(image, 'inline', 1);

// Query by relationship type
const allAssets = await content.getAssets();
const attachments = await content.getAssets('attachment');`}
			language="typescript"
		/>
	</section>

	<section id="thumbnails">
		<h2>Thumbnail Generation</h2>
		<p>Three strategies for generating thumbnail images:</p>

		<h3>1. Headline Card</h3>
		<p>Draw title on branded background - ideal for blog posts and news</p>
		<CodeBlock
			code={`const thumbnail = await content.generateThumbnail({
  strategy: 'headline-card',
  brandColor: '#1a56db',
  backgroundColor: '#ffffff',
  subtitle: 'Blog Post'
});`}
			language="typescript"
		/>

		<h3>2. Static Map</h3>
		<p>Use static maps API for location-based content</p>
		<CodeBlock
			code={`// Requires latitude/longitude in metadata
content.metadata = {
  latitude: 40.7128,
  longitude: -74.0060
};

const mapThumbnail = await content.generateThumbnail({
  strategy: 'static-map',
  mapProvider: 'mapbox',
  zoom: 12,
  markerColor: 'red'
});`}
			language="typescript"
		/>

		<h3>3. AI Generate</h3>
		<p>AI image generation from content</p>
		<CodeBlock
			code={`const aiThumbnail = await content.generateThumbnail({
  strategy: 'ai-generate',
  style: 'photorealistic', // or 'illustration', 'abstract', 'minimal'
  ai: {'{ type: \'openai\', apiKey: process.env.OPENAI_API_KEY }'}
});`}
			language="typescript"
		/>

		<h3>Bulk Generation</h3>
		<CodeBlock
			code={`const result = await contents.generateMissingThumbnails({
  strategy: 'headline-card',
  where: {'{ type: \'article\', status: \'published\' }'},
  brandColor: '#1a56db',
  limit: 100
});

console.log(\`Generated \${'${result.images.length}'} thumbnails\`);
console.log(\`Failed: \${'${result.failed.length}'}\`);`}
			language="typescript"
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Building a Blog CMS</h3>

		<h4>Step 1: Create Blog Post Structure</h4>
		<CodeBlock
			code={`const post = await contents.getOrUpsert({
  type: 'article',
  title: 'New Blog Post',
  slug: 'new-blog-post',
  context: 'blog',
  author: 'Writer Name',
  status: 'draft',
  body: '# Introduction\\n\\nContent here...',
  tags: ['feature', 'announcement'],
  metadata: {'{ readingTime: 5 }'}
});`}
			language="typescript"
		/>

		<h4>Step 2: Add Featured Image</h4>
		<CodeBlock
			code={`const image = ...; // load or generate image
await post.setThumbnail(image);

// Or generate headline card
await post.generateThumbnail({
  strategy: 'headline-card',
  brandColor: '#0066cc'
});`}
			language="typescript"
		/>

		<h4>Step 3: Publish Content</h4>
		<CodeBlock
			code={`post.status = 'published';
post.publish_date = new Date();
await post.save();`}
			language="typescript"
		/>

		<h4>Step 4: Export to Static Site</h4>
		<CodeBlock
			code={`await contents.writeContentFile({
  content: post,
  contentDir: './public/blog'
});
// Creates: ./public/blog/blog/new-blog-post/index.md`}
			language="typescript"
		/>

		<h3>Tutorial 2: Content Mirroring</h3>

		<h4>Step 1: Mirror URL</h4>
		<CodeBlock
			code={`const mirrored = await contents.mirror({
  url: 'https://example.com/article.html',
  context: 'external-sources',
  mirrorDir: './cache'
});`}
			language="typescript"
		/>

		<h4>Step 2: Enhance with Metadata</h4>
		<CodeBlock
			code={`mirrored.type = 'document';
mirrored.tags = ['research', 'external'];
mirrored.metadata = {
  source: 'Example Corp',
  archiveDate: new Date()
};
await mirrored.save();`}
			language="typescript"
		/>

		<h4>Step 3: Generate Summary with AI</h4>
		<CodeBlock
			code={`const summary = await mirrored.do('Create a one-paragraph abstract');
mirrored.description = summary;
await mirrored.save();`}
			language="typescript"
		/>

		<h3>Tutorial 3: Location-based Content</h3>

		<h4>Step 1: Create Content with Location</h4>
		<CodeBlock
			code={`const event = new Article({
  title: 'Annual Conference 2024',
  type: 'article',
  category: 'events/conferences',
  body: 'Join us for our annual conference...',
  metadata: {
    latitude: 37.7749,
    longitude: -122.4194,
    venue: 'San Francisco Convention Center'
  }
});
await event.initialize();
await event.save();`}
			language="typescript"
		/>

		<h4>Step 2: Generate Map Thumbnail</h4>
		<CodeBlock
			code={`await event.generateThumbnail({
  strategy: 'static-map',
  mapProvider: 'mapbox',
  zoom: 13,
  markerColor: 'red'
});`}
			language="typescript"
		/>

		<h4>Step 3: Query by Category</h4>
		<CodeBlock
			code={`const conferences = await contents.list({
  where: {'{ category: \'events/conferences\' }'}
});

// Filter by ancestor category
const allEvents = await contents.list()
  .then(items => items.filter(c => c.isInCategory('events', true)));`}
			language="typescript"
		/>
	</section>

	<section id="examples">
		<h2>Examples</h2>

		<h3>Example 1: News Portal with Categories</h3>
		<CodeBlock
			code={`const story = new Article({
  type: 'article',
  title: 'Local Council Approves New Park',
  category: 'local/civic/parks',
  body: 'Full news story...',
  author: 'News Staff',
  status: 'published',
  metadata: {
    breaking: false,
    importance: 5
  }
});
await story.initialize();

// Generate headline card
await story.generateThumbnail({
  strategy: 'headline-card',
  brandColor: '#0066cc',
  subtitle: 'Civic News'
});

await story.save();

// Query civic news
const civicNews = await contents.list({
  where: {'{ category: \'local/civic\' }'}
}).then(items =>
  items.filter(c => c.isInCategory('local/civic', true))
);`}
			language="typescript"
		/>

		<h3>Example 2: Documentation with Variants</h3>
		<CodeBlock
			code={`// Create different documentation types
const getStarted = await contents.getOrUpsert({
  type: 'article',
  variant: 'docs:guide:getting-started',
  title: 'Getting Started',
  category: 'documentation/guides',
  body: '...'
});

const apiDocs = await contents.getOrUpsert({
  type: 'article',
  variant: 'docs:reference:api',
  title: 'API Reference',
  category: 'documentation/reference',
  body: '...'
});

// Query all documentation
const allDocs = await contents.list()
  .then(items => items.filter(c => c.variant?.startsWith('docs:')));

// Query specific variant
const guides = await contents.list({
  where: {'{ variant: \'docs:guide:getting-started\' }'}
});`}
			language="typescript"
		/>

		<h3>Example 3: Research Paper Archive</h3>
		<CodeBlock
			code={`// Mirror PDF from conference
const paper = await contents.mirror({
  url: 'https://conference.org/papers/2024-ai-research.pdf',
  context: 'conference-2024',
  mirrorDir: './cache'
});

// Enhance with metadata
paper.type = 'document';
paper.tags = ['ai', 'research', 'neural-networks'];
paper.metadata = {
  conference: 'NeurIPS 2024',
  authors: ['Author 1', 'Author 2'],
  pages: 12,
  doi: '10.1234/example'
};
await paper.save();

// Generate AI summary
const abstract = await paper.do('Create a one-paragraph abstract');
paper.description = abstract;
await paper.save();`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with Other Modules</h2>

		<h3>smrt-core</h3>
		<ul>
			<li>Content extends <strong>SmrtObject</strong> for automatic persistence</li>
			<li>STI support via <code>@smrt({'{ tableStrategy: \'sti\' }'})</code></li>
			<li>Auto-generated REST API, CLI commands, and MCP tools</li>
		</ul>

		<h3>smrt-assets</h3>
		<CodeBlock
			code={`// Link images and documents
const image = new Image({...});
await image.save();
await content.setThumbnail(image);

// Multiple assets with relationships
await content.addAsset(image, 'inline', 0);
await content.addAsset(pdf, 'attachment', 1);`}
			language="typescript"
		/>

		<h3>External Integrations</h3>
		<ul>
			<li><strong>@happyvertical/documents</strong>: PDF text extraction</li>
			<li><strong>@happyvertical/spider</strong>: Web scraping for mirroring</li>
			<li><strong>@happyvertical/geo</strong>: Geolocation for map thumbnails</li>
		</ul>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>1. Content Organization</h3>
		<CodeBlock
			code={`// DO: Use context for namespacing
const contexts = ['blog', 'documentation', 'news', 'archived-sources'];

// DO: Use hierarchical categories for navigation
const categories = ['tech/frontend/react', 'tech/backend/nodejs'];

// DO: Use tags for flexible filtering
content.tags = ['tutorial', 'intermediate', 'javascript'];

// DON'T: Mix namespacing mechanisms
// DON'T: Use categories for things better suited to tags`}
			language="typescript"
		/>

		<h3>2. Publishing Workflow</h3>
		<CodeBlock
			code={`// DO: Use status for publication state
content.status = 'draft';
// ... editorial review ...
content.status = 'published';
content.publish_date = new Date();

// DO: Use state for quality flagging
content.state = 'highlighted'; // Featured content

// DON'T: Update status manually in production without workflow`}
			language="typescript"
		/>

		<h3>3. Metadata Usage</h3>
		<CodeBlock
			code={`// DO: Store structured data as metadata
content.metadata = {
  readingTime: 15,
  difficulty: 'advanced',
  prerequisite: ['javascript-basics']
};

// DON'T: Overload metadata with things that should be columns
// DON'T: Query deeply nested metadata structures frequently`}
			language="typescript"
		/>

		<h3>4. AI Feature Usage</h3>
		<CodeBlock
			code={`// DO: Cache AI results
const summary = await content.do('Summarize in 2 sentences');
content.metadata.aiSummary = summary;
await content.save();

// DO: Use classification for automation
const isAcademic = await content.is('written in academic style');
if (isAcademic) {
  content.tags.push('academic-paper');
}

// DON'T: Call do()/is() repeatedly for same result`}
			language="typescript"
		/>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Duplicate Content on Mirror</h3>
		<p><strong>Solution:</strong> Check for existing content before mirroring</p>
		<CodeBlock
			code={`const existing = await contents.get({'{ url: mirrorUrl }'});
if (existing) {
  return existing;
}

// Or use getOrUpsert
const mirrored = await contents.getOrUpsert({
  url: mirrorUrl,
  slug: makeSlug(title),
  context: 'mirrors'
});`}
			language="typescript"
		/>

		<h3>Thumbnail Generation Fails</h3>
		<p><strong>Solution:</strong> Ensure required metadata is present</p>
		<CodeBlock
			code={`// For static-map: coordinates required
content.metadata = {
  latitude: 40.7128,
  longitude: -74.0060
};

// For headline-card: brand color required
content.generateThumbnail({
  strategy: 'headline-card',
  brandColor: '#1a56db'
});`}
			language="typescript"
		/>

		<h3>Export Creates Nested Directories</h3>
		<p><strong>Solution:</strong> Understand path structure</p>
		<CodeBlock
			code={`// Path: {contentDir}/{context}/{slug}/index.md

content.context = 'blog';        // → blog/slug/index.md
content.context = 'blog/tech';   // → blog/tech/slug/index.md
content.context = '';            // → slug/index.md`}
			language="typescript"
		/>

		<h3>AI Features Not Available</h3>
		<p><strong>Solution:</strong> Ensure AI config is passed</p>
		<CodeBlock
			code={`const contents = await Contents.create({
  db: {'{ url: \'sqlite:./content.db\' }'},
  ai: {
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY // Required
  }
});`}
			language="typescript"
		/>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Content Class</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>initialize()</code></td>
					<td><code>Promise&lt;this&gt;</code></td>
					<td>Initialize content before saving</td>
				</tr>
				<tr>
					<td><code>addReference(content)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Link related content</td>
				</tr>
				<tr>
					<td><code>getReferences()</code></td>
					<td><code>Promise&lt;Content[]&gt;</code></td>
					<td>Get linked content</td>
				</tr>
				<tr>
					<td><code>getAssets(relationship?)</code></td>
					<td><code>Promise&lt;Asset[]&gt;</code></td>
					<td>Get media assets</td>
				</tr>
				<tr>
					<td><code>addAsset(asset, relationship, order)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Link asset with relationship type</td>
				</tr>
				<tr>
					<td><code>getThumbnail()</code></td>
					<td><code>Promise&lt;Image | null&gt;</code></td>
					<td>Get featured image</td>
				</tr>
				<tr>
					<td><code>setThumbnail(image)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Set featured image</td>
				</tr>
				<tr>
					<td><code>generateThumbnail(options)</code></td>
					<td><code>Promise&lt;Image&gt;</code></td>
					<td>Generate thumbnail with strategy</td>
				</tr>
				<tr>
					<td><code>getCategorySegments()</code></td>
					<td><code>string[]</code></td>
					<td>Split category into array</td>
				</tr>
				<tr>
					<td><code>isInCategory(path, includeChildren?)</code></td>
					<td><code>boolean</code></td>
					<td>Check if in category hierarchy</td>
				</tr>
				<tr>
					<td><code>do(prompt)</code></td>
					<td><code>Promise&lt;string&gt;</code></td>
					<td>AI transformation/analysis</td>
				</tr>
				<tr>
					<td><code>is(question)</code></td>
					<td><code>Promise&lt;boolean&gt;</code></td>
					<td>AI classification</td>
				</tr>
			</tbody>
		</table>

		<h3>Contents Collection</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>create(options)</code></td>
					<td><code>Promise&lt;Contents&gt;</code></td>
					<td>Create collection instance</td>
				</tr>
				<tr>
					<td><code>get(where)</code></td>
					<td><code>Promise&lt;Content | null&gt;</code></td>
					<td>Get single content</td>
				</tr>
				<tr>
					<td><code>list(options)</code></td>
					<td><code>Promise&lt;Content[]&gt;</code></td>
					<td>Query multiple content</td>
				</tr>
				<tr>
					<td><code>count(options)</code></td>
					<td><code>Promise&lt;number&gt;</code></td>
					<td>Count matching content</td>
				</tr>
				<tr>
					<td><code>getOrUpsert(data)</code></td>
					<td><code>Promise&lt;Content&gt;</code></td>
					<td>Find or create content</td>
				</tr>
				<tr>
					<td><code>mirror(options)</code></td>
					<td><code>Promise&lt;Content | undefined&gt;</code></td>
					<td>Scrape and cache URL</td>
				</tr>
				<tr>
					<td><code>writeContentFile(options)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Export to markdown file</td>
				</tr>
				<tr>
					<td><code>syncContentDir(options)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Export all content to directory</td>
				</tr>
				<tr>
					<td><code>generateMissingThumbnails(options)</code></td>
					<td><code>Promise&lt;BulkResult&gt;</code></td>
					<td>Bulk thumbnail generation</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> - SmrtObject, STI support</li>
			<li><a href="/modules/smrt-assets">smrt-assets</a> - Media management</li>
			<li><a href="/modules/smrt-users">smrt-users</a> - Author profiles</li>
		</ul>
	</section>
</Grid>

<style>
	.lead {
		font-size: 1.25rem;
		margin-bottom: 2rem;
	}

	.breadcrumb {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: #666;
	}

	.breadcrumb a {
		color: #0066cc;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	section {
		margin-bottom: 3rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid #e5e5e5;
	}

	th {
		font-weight: 600;
		background-color: #f5f5f5;
	}

	code {
		background-color: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.diagram {
		background-color: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.diagram pre {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	h2 {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e5e5;
	}

	h3 {
		margin-top: 1.5rem;
	}

	h4 {
		margin-top: 1rem;
		font-size: 1rem;
	}
</style>
