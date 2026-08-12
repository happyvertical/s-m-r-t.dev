<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { foundationGuides } from '$lib/data/guides';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';

	const updates = [
		{
			title: 'Agent-legible applications',
			body: 'Give agents bounded descriptions of the model, visible controls, and permitted operations.',
			href: '/capabilities/agent-legible-applications'
		},
		{
			title: 'Learning agents',
			body: 'Recall useful experience and propose instruction changes behind a human approval step.',
			href: '/capabilities/learning-agents'
		},
		{
			title: 'Reports',
			body: 'Define durable aggregate models with refreshes, schedules, watermarks, and tenant scope.',
			href: '/capabilities/reports'
		}
	];
</script>

<SEO
	title="Why s-m-r-t? Governed applications for people and agents"
	description="Build TypeScript and SvelteKit applications that people and software agents can understand and operate through the same governed domain logic."
	url="https://s-m-r-t.dev"
/>

<article class="why-smrt">
	<header class="hero">
		<p class="eyebrow">Why s-m-r-t?</p>
		<h1>Build applications humans and agents can understand and operate together.</h1>
		<p class="hero-copy">
			Define the domain once, then project it into forms, REST, CLI, MCP, WebMCP, and the
			permissions that govern each surface. The same discipline removes duplicated schemas, routes,
			validation, and permissions before an agent is ever added.
		</p>
		<a class="hero-link" href="#storyboard">See one governed interaction ↓</a>
	</header>

	<section class="qualification" aria-labelledby="qualification-heading">
		<h2 id="qualification-heading">A compact fit check</h2>
		<div class="qualification-grid">
			<p>
				<strong>Web stack</strong><span>TypeScript models and SvelteKit application surfaces.</span>
			</p>
			<p>
				<strong>Mobile</strong><span
					>Native Kotlin Multiplatform foundation with Compose and SwiftUI adapters; source
					distribution only, not published to npm or Maven.</span
				>
			</p>
			<p>
				<strong>Data &amp; deploy</strong><span
					>SQLite suits a small start; Postgres is the normal production path. Starters show both
					ends.</span
				>
			</p>
			<p>
				<strong>License &amp; maturity</strong><span
					>MIT-licensed and pre-1.0: evaluate the released contracts against your product.</span
				>
			</p>
			<p>
				<strong>Proof in use</strong><span
					>This public documentation site is the framework’s primary test bed and renders against
					the released UI and playground packages.</span
				>
			</p>
		</div>
		<p class="qualification-links">
			<a href="/starters/ground-up">Basic SvelteKit starter</a><span aria-hidden="true">·</span>
			<a href="/starters/saas">production-shaped starter</a><span aria-hidden="true">·</span>
			<a href="/capabilities/mobile">mobile foundation</a><span aria-hidden="true">·</span>
			<a href="https://github.com/happyvertical/s-m-r-t.dev">inspect this site’s source ↗</a>
		</p>
	</section>

	<section class="storyboard" id="storyboard" aria-labelledby="storyboard-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Released interaction pattern</p>
				<h2 id="storyboard-heading">One Article form. A successful proposal and a refusal.</h2>
			</div>
			<p>
				Static illustration — not a live LLM or registry demo. A deterministic interactive follow-up
				is tracked separately.
			</p>
		</div>

		<div class="storyboard-grid">
			<section class="story-card success" aria-labelledby="success-heading">
				<p class="card-label">Illustrated success</p>
				<h3 id="success-heading">A proposal stays separate until review</h3>
				<div class="transcript" aria-label="Successful Article form proposal">
					<p><strong>Editor</strong> Move publication date to Friday and feature this article.</p>
					<p>
						<strong>Adapter</strong> Found <code>ArticleForm</code>. Both controls are writable;
						validation passed.
					</p>
					<dl>
						<div>
							<dt>publicationDate</dt>
							<dd>Aug 12 <span aria-hidden="true">→</span> Aug 14</dd>
						</div>
						<div>
							<dt>featured</dt>
							<dd>No <span aria-hidden="true">→</span> Yes</dd>
						</div>
					</dl>
					<p class="pending">Proposed, not applied — review and confirmation still required.</p>
				</div>
			</section>

			<section class="story-card refusal" aria-labelledby="refusal-heading">
				<p class="card-label">Illustrated refusal</p>
				<h3 id="refusal-heading">A description is not permission</h3>
				<div class="transcript" aria-label="Refused Article form proposal">
					<p><strong>Adapter</strong> Find <code>authorNotes</code> and replace its value.</p>
					<p>
						<strong>ArticleForm</strong> <code>authorNotes</code> is classified secret and is not writable
						from this interaction.
					</p>
					<p class="denied">Refused — no value is revealed, staged, or changed.</p>
				</div>
				<p class="card-note">
					<strong>Awareness is not authority.</strong> Controls can be legible without becoming an unrestricted
					browser or bot API.
				</p>
			</section>
		</div>
		<p class="section-link">
			<a href="/capabilities/agent-assisted-forms">Read the agent-assisted forms contract →</a>
		</p>
	</section>

	<section class="model-section" aria-labelledby="model-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">One structural example</p>
				<h2 id="model-heading">Keep the Article’s meaning close to every way it is used.</h2>
			</div>
			<p>
				Not one magic decorator: one model, vocabulary, and security boundary projected into
				deliberate interfaces.
			</p>
		</div>
		<div class="model-map" aria-label="Article model projected into several interfaces">
			<div class="model-node">
				<span>Domain model</span><strong>Article</strong><small
					>title · publicationDate · featured · authorNotes</small
				>
			</div>
			<ul>
				<li><strong>Form</strong><span>human controls and validation</span></li>
				<li><strong>REST</strong><span>application clients</span></li>
				<li><strong>CLI</strong><span>operator and script commands</span></li>
				<li><strong>MCP</strong><span>selected structured tools</span></li>
				<li><strong>WebMCP</strong><span>page-appropriate browser tools</span></li>
			</ul>
		</div>
		<p class="model-copy">
			This is <a href="/reference/saadl">Software as Agentic Domain Logic (SAADL)</a>: people and
			software agents reach the same permitted domain operations, rather than a separate reduced bot
			interface that can drift.
		</p>
	</section>

	<section class="boundaries" aria-labelledby="boundaries-heading">
		<div>
			<p class="eyebrow">Governed by design</p>
			<h2 id="boundaries-heading">Awareness is not authority.</h2>
			<p>
				A tool, form control, or runtime description can say what exists without granting permission
				to use it. Application operations still resolve through explicit allowlists, the
				authenticated principal, tenant scope, operation permissions, writable-field rules, and
				confirmation policy.
			</p>
			<a href="/reference/security">Read the security defaults →</a>
		</div>
		<aside>
			<p class="card-label">Conditional runtime awareness</p>
			<h3>Useful when explicitly exposed — not assumed.</h3>
			<p>
				Released development tooling reads workspace and installed-package artifacts. Treat active
				runtime knowledge as available only when a runtime bridge explicitly exposes it; application
				data and mutations stay on authenticated application surfaces.
			</p>
			<a href="/capabilities/agent-legible-applications">See the runtime boundary →</a>
		</aside>
	</section>

	<section class="start-options" aria-labelledby="start-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Start here</p>
				<h2 id="start-heading">Choose a starting path</h2>
			</div>
			<p>
				Both paths keep the same model-first foundations; choose the amount of application shape you
				need.
			</p>
		</div>
		<div class="start-grid">
			<a href="/starters/ground-up">
				<span>Ground up</span>
				<h3>Basic SvelteKit template</h3>
				<p>
					Start small with one object, SQLite, current tenant and session boundaries, and generated
					interfaces.
				</p>
				<strong>Start with one object →</strong>
			</a>
			<a href="/starters/saas">
				<span>Production-shaped</span>
				<h3>s-m-r-t SaaS starter</h3>
				<p>
					Begin with accounts, tenant administration, billing, workers, mobile clients, and
					deployment manifests connected.
				</p>
				<strong>Tour the starter →</strong>
			</a>
		</div>
	</section>

	<section class="journey" aria-labelledby="journey-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Foundations</p>
				<h2 id="journey-heading">How an application comes together</h2>
			</div>
			<p>Enter at the foundation you need, or follow the path from product model to interfaces.</p>
		</div>
		<ol>
			{#each foundationGuides as guide, index (guide.slug)}
				<li>
					<a href={`/foundations/${guide.slug}`}
						><span>{String(index + 1).padStart(2, '0')}</span>
						<div>
							<h3>{guide.navTitle}</h3>
							<p>{guide.plainEnglish}</p>
						</div>
						<b>→</b></a
					>
				</li>
			{/each}
		</ol>
	</section>

	<section class="updates" aria-labelledby="updates-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Explore further</p>
				<h2 id="updates-heading">Focused capabilities</h2>
			</div>
			<p>Use these when the basic application path reaches the problem they solve.</p>
		</div>
		<div class="update-grid">
			{#each updates as update (update.href)}
				<a href={update.href}
					><h3>{update.title}</h3>
					<p>{update.body}</p>
					<span>Read more →</span></a
				>
			{/each}
		</div>
	</section>

	<section class="claims" aria-labelledby="claims-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Release-audit ledger</p>
				<h2 id="claims-heading">Where homepage claims are verified</h2>
			</div>
			<p>
				Canonical pages hold the technical detail. Recheck their documentation, source references,
				and demos at each release.
			</p>
		</div>
		<div class="claims-list">
			{#each whySmrtClaims as item (item.claim)}
				<article>
					<h3>{item.claim}</h3>
					<p>
						<a href={item.canonical.href}>{item.canonical.label}</a><span aria-hidden="true">
							·
						</span><a href={item.source.href}>{item.source.label}</a>{#if item.demo}<span
								aria-hidden="true"
							>
								·
							</span><a href={item.demo.href}>{item.demo.label}</a>{/if}
					</p>
				</article>
			{/each}
		</div>
	</section>

	<aside class="browse-callout">
		<div>
			<h2>Looking for a package or component?</h2>
			<p>
				The package browser keeps the overview, components, playground, REST, MCP, WebMCP, and CLI
				notes together.
			</p>
		</div>
		<a href="/packages">Browse all packages →</a>
	</aside>
</article>

<style>
	.why-smrt {
		width: min(1040px, calc(100% - 48px));
		margin: 0 auto;
		padding: 58px 0 88px;
	}
	.hero {
		max-width: 810px;
		padding: 0 0 44px;
	}
	.eyebrow,
	.card-label {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.055em;
		text-transform: uppercase;
	}
	h1 {
		max-width: 790px;
		margin-top: 14px;
		font-size: clamp(2.45rem, 5.6vw, 4rem);
		font-weight: 680;
		letter-spacing: -0.052em;
		line-height: 1.03;
	}
	.hero-copy {
		max-width: 730px;
		margin-top: 21px;
		color: var(--site-muted);
		font-size: 1.04rem;
		line-height: 1.7;
	}
	.hero-link,
	.section-link a,
	.boundaries a {
		display: inline-block;
		margin-top: 22px;
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
	}
	section {
		padding: 44px 0 54px;
		border-top: 1px solid var(--site-line);
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 36px;
		align-items: end;
		margin-bottom: 26px;
	}
	.section-heading h2,
	.browse-callout h2 {
		font-size: clamp(1.45rem, 3vw, 1.85rem);
		letter-spacing: -0.035em;
		line-height: 1.13;
	}
	.section-heading p:last-child {
		max-width: 430px;
		color: var(--site-muted);
		font-size: 0.84rem;
		line-height: 1.58;
	}
	.qualification {
		padding: 22px 0 28px;
	}
	.qualification h2 {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
	.qualification-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border: 1px solid var(--site-line-strong);
		background: var(--site-surface);
	}
	.qualification-grid p {
		min-height: 111px;
		padding: 15px;
		border-right: 1px solid var(--site-line);
	}
	.qualification-grid p:last-child {
		border-right: 0;
	}
	.qualification strong {
		display: block;
		font-size: 0.76rem;
	}
	.qualification-grid span {
		display: block;
		margin-top: 7px;
		color: var(--site-muted);
		font-size: 0.71rem;
		line-height: 1.48;
	}
	.qualification-links {
		margin-top: 12px;
		color: var(--site-muted);
		font-size: 0.73rem;
	}
	.qualification-links a {
		color: var(--site-ink);
	}
	.qualification-links span {
		padding: 0 8px;
	}
	.storyboard-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.story-card {
		padding: 22px;
		border: 1px solid var(--site-line-strong);
		background: var(--site-surface);
	}
	.story-card h3 {
		margin-top: 9px;
		font-size: 1.1rem;
		letter-spacing: -0.02em;
	}
	.success {
		border-top: 3px solid var(--site-accent);
	}
	.refusal {
		border-top: 3px solid var(--site-line-strong);
	}
	.transcript {
		margin-top: 18px;
		padding: 15px;
		border: 1px solid var(--site-line);
		background: var(--site-paper);
		font-size: 0.77rem;
		line-height: 1.55;
	}
	.transcript p + p {
		margin-top: 11px;
	}
	.transcript code {
		font-family: var(--site-font-mono);
		font-size: 0.9em;
	}
	.transcript dl {
		margin-top: 13px;
		border-top: 1px solid var(--site-line);
	}
	.transcript dl div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 0;
		border-bottom: 1px solid var(--site-line);
	}
	.transcript dt {
		font-family: var(--site-font-mono);
	}
	.transcript dd {
		color: var(--site-muted);
		text-align: right;
	}
	.pending,
	.denied {
		font-weight: 650;
	}
	.pending {
		color: var(--site-accent-strong);
	}
	.denied {
		color: var(--site-ink);
	}
	.card-note {
		margin-top: 15px;
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.55;
	}
	.model-map {
		display: grid;
		grid-template-columns: minmax(200px, 0.7fr) 1.3fr;
		gap: 0;
		border: 1px solid var(--site-line-strong);
		background: var(--site-surface);
	}
	.model-node {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 24px;
		border-right: 1px solid var(--site-line);
	}
	.model-node span {
		color: var(--site-muted);
		font: 700 0.63rem var(--site-font-mono);
		text-transform: uppercase;
	}
	.model-node strong {
		margin-top: 6px;
		font-size: 1.35rem;
	}
	.model-node small {
		margin-top: 8px;
		color: var(--site-muted);
		font: 0.68rem var(--site-font-mono);
		line-height: 1.5;
	}
	.model-map ul {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		list-style: none;
	}
	.model-map li {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 132px;
		padding: 13px;
		border-right: 1px solid var(--site-line);
	}
	.model-map li:last-child {
		border-right: 0;
	}
	.model-map li strong {
		font-size: 0.79rem;
	}
	.model-map li span {
		margin-top: 5px;
		color: var(--site-muted);
		font-size: 0.66rem;
		line-height: 1.42;
	}
	.model-copy {
		max-width: 720px;
		margin-top: 18px;
		color: var(--site-muted);
		font-size: 0.88rem;
		line-height: 1.65;
	}
	.model-copy a {
		color: var(--site-ink);
	}
	.boundaries {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 36px;
		align-items: start;
	}
	.boundaries h2 {
		margin-top: 9px;
		font-size: clamp(1.6rem, 3vw, 2rem);
		letter-spacing: -0.04em;
	}
	.boundaries > div > p:not(.eyebrow),
	.boundaries aside > p:not(.card-label) {
		margin-top: 14px;
		color: var(--site-muted);
		font-size: 0.88rem;
		line-height: 1.65;
	}
	.boundaries aside {
		padding: 20px;
		border: 1px dashed var(--site-line-strong);
		background: var(--site-surface);
	}
	.boundaries aside h3 {
		margin-top: 9px;
		font-size: 1rem;
	}
	.boundaries aside a {
		margin-top: 15px;
	}
	.start-grid,
	.update-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.start-grid a,
	.update-grid a {
		border: 1px solid var(--site-line-strong);
		border-radius: 9px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}
	.start-grid a {
		min-height: 210px;
		display: flex;
		flex-direction: column;
		padding: 24px;
	}
	.start-grid a:hover,
	.update-grid a:hover {
		border-color: var(--site-accent-strong);
	}
	.start-grid span,
	.update-grid span {
		color: var(--site-accent-strong);
		font: 700 0.65rem var(--site-font-mono);
		text-transform: uppercase;
	}
	.start-grid h3 {
		margin-top: 20px;
		font-size: 1.22rem;
	}
	.start-grid p,
	.update-grid p {
		margin-top: 10px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}
	.start-grid strong {
		margin-top: auto;
		padding-top: 22px;
		font-size: 0.78rem;
	}
	.journey ol {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	.journey li {
		border-bottom: 1px solid var(--site-line);
	}
	.journey a {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 20px;
		gap: 14px;
		align-items: start;
		padding: 15px 8px;
		color: var(--site-ink);
		text-decoration: none;
	}
	.journey a:hover {
		background: var(--site-surface);
	}
	.journey a > span {
		padding-top: 2px;
		color: var(--site-accent-strong);
		font: 0.66rem var(--site-font-mono);
	}
	.journey h3 {
		font-size: 0.92rem;
	}
	.journey p {
		margin-top: 3px;
		color: var(--site-muted);
		font-size: 0.77rem;
		line-height: 1.5;
	}
	.journey b {
		font-weight: 500;
	}
	.update-grid {
		grid-template-columns: repeat(3, 1fr);
	}
	.update-grid a {
		min-height: 180px;
		display: flex;
		flex-direction: column;
		padding: 18px;
	}
	.update-grid h3 {
		font-size: 0.98rem;
	}
	.update-grid span {
		margin-top: auto;
		padding-top: 18px;
		font-size: 0.6rem;
	}
	.claims-list {
		border-top: 1px solid var(--site-line);
	}
	.claims-list article {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(250px, 0.9fr);
		gap: 24px;
		padding: 16px 8px;
		border-bottom: 1px solid var(--site-line);
	}
	.claims-list h3 {
		font-size: 0.84rem;
		line-height: 1.45;
	}
	.claims-list p {
		color: var(--site-muted);
		font-size: 0.72rem;
		line-height: 1.5;
	}
	.claims-list a {
		color: var(--site-ink);
		font-weight: 650;
	}
	.browse-callout {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 30px;
		margin-top: 12px;
		padding: 26px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	.browse-callout p {
		max-width: 480px;
		margin-top: 7px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}
	.browse-callout a {
		flex: 0 0 auto;
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
	}
	@media (max-width: 820px) {
		.qualification-grid {
			grid-template-columns: 1fr 1fr;
		}
		.qualification-grid p {
			border-bottom: 1px solid var(--site-line);
		}
		.qualification-grid p:nth-child(2n) {
			border-right: 0;
		}
		.qualification-grid p:last-child {
			grid-column: 1 / -1;
			border-right: 0;
			border-bottom: 0;
		}
		.model-map {
			grid-template-columns: 1fr;
		}
		.model-node {
			border-right: 0;
			border-bottom: 1px solid var(--site-line);
		}
		.model-map ul {
			grid-template-columns: repeat(5, 1fr);
		}
	}
	@media (max-width: 680px) {
		.why-smrt {
			width: min(100% - 28px, 1040px);
			padding-top: 38px;
		}
		.section-heading,
		.browse-callout {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}
		.storyboard-grid,
		.start-grid,
		.update-grid,
		.boundaries {
			grid-template-columns: 1fr;
		}
		.model-map ul {
			grid-template-columns: 1fr 1fr;
		}
		.model-map li {
			min-height: 76px;
			border-bottom: 1px solid var(--site-line);
		}
		.model-map li:nth-child(2n) {
			border-right: 0;
		}
		.model-map li:last-child {
			border-bottom: 0;
		}
		.claims-list article {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
	@media (max-width: 430px) {
		.qualification-grid {
			grid-template-columns: 1fr;
		}
		.qualification-grid p,
		.qualification-grid p:nth-child(2) {
			min-height: 0;
			border-right: 0;
			border-bottom: 1px solid var(--site-line);
		}
		.qualification-grid p:last-child {
			grid-column: auto;
			border-bottom: 0;
		}
		.model-map ul {
			grid-template-columns: 1fr;
		}
		.model-map li,
		.model-map li:nth-child(2n) {
			border-right: 0;
		}
	}
</style>
