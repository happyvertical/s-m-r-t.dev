<script lang="ts">
	import { siteUrl } from '$lib/site';
	import SEO from '$lib/components/SEO.svelte';
	import { KITCHEN_COMMAND } from '$lib/commands';
	import { BUILD_PATH, DEMO_PATH, FEATURES_PATH } from '$lib/data/doors';
	import { featureSectionPath, featureSections, featuresInSection } from '$lib/data/features';

	// The landing page (#397). The hero panel is the one loud moment: one model,
	// answered for a person and for an agent. Every claim on this page was
	// checked against the installed packages or against copy the docs already
	// carry; the pull request lists the sources.

	type Token = [text: string, tone: 'key' | 'dim' | 'plain'];

	// The decorator form is the one the docs teach (`guides.ts`, "Define the
	// thing your app is about"). Held as tokens so the braces are never template
	// syntax.
	const model: Token[] = [
		['@smrt', 'key'],
		['({ api: ', 'plain'],
		['true', 'key'],
		[', mcp: ', 'plain'],
		['true', 'key'],
		[', cli: ', 'plain'],
		['true', 'key'],
		[' })\n', 'plain'],
		['export class', 'dim'],
		[' Widget ', 'plain'],
		['extends', 'dim'],
		[' SmrtObject {\n  name = ', 'plain'],
		["''", 'key'],
		[';\n  inStock = ', 'plain'],
		['0', 'key'],
		[';\n  leftHanded = ', 'plain'],
		['false', 'key'],
		[';\n}', 'plain']
	];

	// One list feeds both answers, so the screen and the tool result cannot
	// show different widgets.
	const widgets = [
		{ name: 'Left-handed doodad', inStock: 40, leftHanded: true },
		{ name: 'Gizmo, regular', inStock: 400, leftHanded: false },
		{ name: 'Nick-nack, assorted', inStock: 12, leftHanded: false }
	];

	// A generated tool is named after its record and action: a Widget's list
	// action is `widget_list` (`agents.ts`), and list normalizes to the
	// `widgets.read` permission on every surface (`reference.ts`).
	const result: Token[] = [
		['→ tool call', 'dim'],
		['  ', 'plain'],
		['widget_list', 'key'],
		['\n\n', 'plain'],
		['← result', 'dim'],
		['\n[\n', 'plain'],
		...widgets.flatMap((widget, index): Token[] => [
			['  { name: ', 'plain'],
			[JSON.stringify(widget.name), 'key'],
			[
				`, inStock: ${widget.inStock}, leftHanded: ${widget.leftHanded} }${
					index < widgets.length - 1 ? ',' : ''
				}\n`,
				'plain'
			]
		]),
		[']', 'plain']
	];

	// The agentic section (#411). Each line was checked against the installed
	// packages at the pinned release (smrt-chat for the dock, the page registry
	// it reads its browser tools from, and its approval holds, which run the
	// saved call once as the original requester; smrt-svelte and smrt-web for
	// page tools; smrt-agents and smrt-personas for schedules; smrt-reports for
	// runtime reports; smrt-core for usage rows and the four tiers, each bound
	// to one model) or, where the package is not a dependency of this site
	// (smrt-approvals, smrt-inference for model lists, smrt-ingestion), against
	// that package's README or agent docs at the same release (the failure
	// classes that trigger model fallback come from the agent docs).
	const agentic = [
		{
			name: 'An assistant on the page',
			line: 'A chat dock that works with the page you’re on, through that page’s own tools. Anything destructive waits for a person.',
			href: '/features/assistant'
		},
		{
			name: 'Page tools',
			line: 'In a browser that supports page tools (WebMCP), an agent works with the page as the signed-in person. Read-only until you allow more, and a person applies any form change.',
			href: '/docs/capabilities/webmcp'
		},
		{
			name: 'Agents on a schedule',
			line: 'Set an agent to run on a schedule. It works as the user it is bound to, with that user’s rights and only the tools you list.',
			href: '/features/assistant/agents'
		},
		{
			name: 'Approvals',
			line: 'Decide who has to say yes, and keep a record of every answer. The assistant’s destructive requests wait for a yes too. Each yes runs that one request, once, as the person who asked.',
			href: '/features/team/approvals'
		},
		{
			name: 'Reports on request',
			line: 'Describe a report, or let an agent draft one. It is saved only after a person confirms, and each run shows only what the person running it may see.',
			href: '/docs/capabilities/reports'
		},
		{
			name: 'AI usage',
			line: 'Every model call leaves a row: which prompt asked, which model answered, the tokens, an estimated cost and the time. One command turns the rows into a report.',
			href: '/docs/capabilities/ai-usage'
		},
		{
			name: 'Choose your models',
			line: 'Your code asks for a quality level, called a tier, from cheap to best. You pick the AI model behind each one. Add one package, smrt-inference, and a call that fails on a quota, a bad key or a missing model moves on to the next model in your list.',
			href: '/docs/capabilities/inference-tuning'
		},
		{
			name: 'Incoming files and email',
			line: 'Each one is kept as evidence, read when you ask, and turned into suggestions. A reviewer decides. This ships as a preview, with automation off.',
			href: '/docs/capabilities/ingestion'
		}
	];

	const alsoAgentic = [
		{ name: 'agent memory', href: '/features/assistant/memory' },
		{ name: 'search by meaning', href: '/docs/guides/semantic-search' },
		{ name: 'voice on the device', href: '/docs/ui#voice-and-browser-ai' }
	];

	let asking = $state<'person' | 'agent'>('person');
</script>

<SEO
	title="smrt framework"
	description="smrt is an MIT-licensed TypeScript framework for agentic software that people and agents use through the same screens, rules and permissions."
	url={siteUrl()}
/>

<div class="landing">
	<section class="hero">
		<div class="wrap hero-grid">
			<div class="hero-copy">
				<p class="kicker">TypeScript framework · MIT licensed</p>
				<h1>Build <em>agentic software</em> for people <em>and agents</em>.</h1>
				<p class="sub">
					Describe your models once. <b>smrt</b> gives you the screens people use and the tools agents
					use, and makes both play by the same rules.
				</p>
				<p class="cta">
					<a class="btn" href="/docs/getting-started">Get started</a>
					<a class="btn quiet" href={DEMO_PATH}>See the demo</a>
				</p>
				<div class="install">
					<p class="cmd"><code>{`${KITCHEN_COMMAND}`}</code></p>
					<p class="fine">
						Opens the planner in your browser. Pick your features, then send them to the kitchen.
					</p>
				</div>
			</div>

			<div class="panel">
				<div class="panel-top">
					<p class="file">src/lib/objects/Widget.ts</p>
					<!-- A scrollable region must be focusable (axe scrollable-region-focusable). -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<pre tabindex="0" role="group" aria-label="The Widget model"><code
							>{#each model as [text, tone], index (index)}<span class={tone}>{text}</span
								>{/each}</code
						></pre>
				</div>
				<div class="who">
					<span id="who-label">Who's asking?</span>
					<div class="seg" role="group" aria-labelledby="who-label">
						<button
							type="button"
							aria-pressed={asking === 'person'}
							onclick={() => (asking = 'person')}>A person</button
						>
						<button
							type="button"
							aria-pressed={asking === 'agent'}
							onclick={() => (asking = 'agent')}>An agent</button
						>
					</div>
				</div>
				<p class="sr" role="status">
					{asking === 'person' ? 'Showing what a person sees' : 'Showing what an agent sees'}
				</p>
				<div class="answer">
					<div class="screen" hidden={asking !== 'person'}>
						<table>
							<caption>
								<b>Widgets</b>
								<span>Acme Corp · 3 of 3</span>
							</caption>
							<thead class="sr">
								<tr
									><th scope="col">Name</th><th scope="col">Kind</th><th scope="col">In stock</th
									></tr
								>
							</thead>
							<tbody>
								{#each widgets as widget (widget.name)}
									<tr>
										<td>{widget.name}</td>
										<td class="kind">{widget.leftHanded ? 'left-handed' : ''}</td>
										<td class="count">{widget.inStock}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div hidden={asking !== 'agent'}>
						<!-- A scrollable region must be focusable (axe scrollable-region-focusable). -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<pre
							tabindex="0"
							role="group"
							aria-label="The widget_list tool call and its result"><code
								>{#each result as [text, tone], index (index)}<span class={tone}>{text}</span
									>{/each}</code
							></pre>
					</div>
				</div>
				<p class="same">
					<span>Same widgets. Same rules.</span>
					<span>One permission for both: <code>widgets.read</code></span>
				</p>
			</div>
		</div>
	</section>

	<section class="band lead" aria-labelledby="agentic-features">
		<div class="wrap">
			<div class="head">
				<h2 id="agentic-features">Agentic features, out of the box.</h2>
				<p>
					Here is what agents can do inside a smrt app, and how you stay in charge of them. An agent
					works as a user, with that user’s permissions and nothing more.
				</p>
			</div>
			<ul class="agentic">
				{#each agentic as item (item.href)}
					<li>
						<a class="feat" href={item.href}>
							<b>{item.name}</b>
							<span>{item.line}</span>
						</a>
					</li>
				{/each}
			</ul>
			<p class="also">
				Also in the box:
				{#each alsoAgentic as item, index (item.href)}<a href={item.href}>{item.name}</a>{index <
					alsoAgentic.length - 1
						? ', '
						: '.'}{/each}
			</p>
		</div>
	</section>

	<section class="band" aria-labelledby="already-built">
		<div class="wrap">
			<div class="head">
				<h2 id="already-built">The parts every app needs are already built.</h2>
				<p>
					Then there are the everyday parts: customers, invoices, timesheets, chat. Switch on what
					you need and save your energy for the part that is actually yours.
				</p>
			</div>
			<ul class="groups">
				{#each featureSections as section (section.id)}
					{@const items = featuresInSection(section.id)}
					<li>
						<a class="group" href={featureSectionPath(section)}>
							<b>{section.word}</b>
							<span class="words"
								>{#each items as item, index (item.id)}{item.word}{index < items.length - 1
										? ', '
										: ''}{/each}</span
							>
						</a>
					</li>
				{/each}
			</ul>
			<p class="more"><a href={FEATURES_PATH}>Browse all features →</a></p>
		</div>
	</section>

	<section class="band" aria-labelledby="every-way-in">
		<div class="wrap">
			<div class="head">
				<h2 id="every-way-in">One model, every way in.</h2>
				<p>
					You describe each thing in your app once, as a TypeScript class called a model. smrt reads
					it and generates the rest, so the screen a person uses and the tool an agent calls come
					from the same model.
				</p>
			</div>
			<ul class="ways-in">
				<li><b>A table</b><span>The fields tell smrt what to store.</span></li>
				<li><b>An API</b><span>Routes and clients for exactly the actions you allow.</span></li>
				<li>
					<b>Agent tools</b><span
						>The same actions, described so an agent knows when to use them.</span
					>
				</li>
				<li><b>Commands</b><span>For the terminal and for scripts.</span></li>
				<li><b>Forms</b><span>Fields and labels, straight from the model.</span></li>
				<li>
					<b>Permissions</b><span>However a request arrives, the same checks apply.</span>
				</li>
			</ul>
		</div>
	</section>

	<section class="band solid" aria-labelledby="three-ways">
		<div class="wrap">
			<div class="head">
				<h2 id="three-ways">Three ways to a running app.</h2>
				<p>They all end in the same place: a real project on your machine.</p>
			</div>
			<ul class="ways">
				<li class="way">
					<span class="tag">in the browser</span>
					<h3>Plan it first</h3>
					<p>
						Tick the features you want in build-a-boilerplate, poke at a working mock-up, and export
						it as a cookbook.
					</p>
					<a class="go" href={BUILD_PATH}>Open the planner →</a>
				</li>
				<li class="way">
					<span class="tag">one command</span>
					<h3>Start from a cookbook</h3>
					<p>
						A cookbook is a short file naming what your app is made of. The CLI turns it into a
						project. A bakery and a yoga studio are included.
					</p>
					<a class="go" href="/docs/getting-started#cookbook">Cook one →</a>
				</li>
				<li class="way">
					<span class="tag">from scratch</span>
					<h3>Clone the starter</h3>
					<p>
						The template on its own: one owner, a local database, a notes model and an assistant.
						Add things as you go.
					</p>
					<a class="go" href="/docs/getting-started/smrt-start">Get smrt-start →</a>
				</li>
			</ul>
		</div>
	</section>

	<section class="band" aria-labelledby="agents-welcome">
		<div class="wrap agents">
			<div class="head">
				<h2 id="agents-welcome">Agents are welcome here too.</h2>
				<p>
					Your coding agent should not have to guess how smrt works. This site is written for it,
					and for you.
				</p>
			</div>
			<ul class="list">
				<li>
					<a href="/llms.txt"><code>llms.txt</code></a>
					<span>A directory of the whole site, one line per page.</span>
				</li>
				<li>
					<code>any page + .md</code>
					<span>Every page has a Markdown copy at its address plus .md.</span>
				</li>
				<li>
					<a href="/docs/tooling/dev-mcp"><b>Development MCP</b></a>
					<span>Read-only knowledge of your workspace and installed packages.</span>
				</li>
				<li>
					<a href="/docs/tooling/app-mcp"><b>Application MCP</b></a>
					<span>The operations your app permits, offered to an agent as tools.</span>
				</li>
			</ul>
		</div>
	</section>
</div>

<style>
	.landing {
		/* The table inside the dark panel is a screenshot of a light app, so it
		   stays light in both schemes; no site token is fixed that way. */
		--screen-bg: #fbfcfa;
		--screen-ink: #17201f;
		--screen-muted: #5b6664;
		--screen-line: #e3e7e2;
		/* Hairlines and the switch track on the code panel, which is dark in both schemes. */
		--panel-line: rgb(255 255 255 / 8%);
		color: var(--site-ink);
		font-family: var(--site-font-sans);
		font-size: 1rem;
		line-height: 1.6;
	}

	.wrap {
		width: min(1120px, 100% - 32px);
		margin-inline: auto;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* hero */
	.hero {
		padding-block: 72px 80px;
	}
	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
		gap: 48px;
		align-items: center;
	}
	.hero-copy {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.kicker {
		color: var(--site-accent);
		font-family: var(--site-font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
	}
	h1 {
		font-size: clamp(2.3rem, 5.2vw, 3.9rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.02;
		text-wrap: balance;
	}
	h1 em {
		color: var(--site-accent);
		font-style: normal;
		text-decoration: underline;
		text-decoration-color: var(--site-brass);
		text-decoration-thickness: 0.09em;
		text-underline-offset: 0.1em;
		text-decoration-skip-ink: none;
	}
	.sub {
		max-width: 31em;
		color: var(--site-muted);
		font-size: 1.13rem;
	}
	.sub b {
		color: var(--site-ink);
		font-weight: 600;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 20px;
		border: 1px solid var(--site-fill);
		border-radius: 10px;
		background: var(--site-fill);
		color: var(--site-on-fill);
		font-size: 0.98rem;
		font-weight: 600;
		text-decoration: none;
	}
	.btn.quiet {
		border-color: var(--site-line);
		background: transparent;
		color: var(--site-ink);
	}
	.btn:hover {
		filter: brightness(1.08);
	}
	.btn.quiet:hover {
		border-color: var(--site-ink);
		filter: none;
	}
	.install {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.cmd {
		max-width: 100%;
		padding: 10px 14px;
		border: 1px solid var(--site-line);
		border-radius: 10px;
		background: var(--site-sunken);
		font-family: var(--site-font-mono);
		font-size: 0.86rem;
		overflow-wrap: anywhere;
	}
	.cmd::before {
		content: '$ ';
		color: var(--site-muted);
	}
	.cmd code {
		font: inherit;
	}
	.fine {
		color: var(--site-muted);
		font-size: 0.85rem;
	}

	/* hero panel: one model, two kinds of user */
	.panel {
		min-width: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
		background: var(--site-code-bg);
		color: var(--site-code-ink);
	}
	.panel-top {
		padding: 18px 20px 16px;
		border-bottom: 1px solid var(--panel-line);
	}
	.file {
		margin-bottom: 10px;
		color: var(--site-code-dim);
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
	}
	pre {
		overflow-x: auto;
		font-family: var(--site-font-mono);
		font-size: 0.82rem;
		line-height: 1.65;
	}
	pre code {
		font: inherit;
	}
	pre:focus-visible,
	.seg button:focus-visible {
		outline-color: var(--site-brass);
	}
	.key {
		color: var(--site-brass);
	}
	.dim {
		color: var(--site-code-dim);
	}
	.who {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		padding: 14px 20px;
		border-bottom: 1px solid var(--panel-line);
		color: var(--site-code-dim);
		font-size: 0.85rem;
	}
	.seg {
		display: inline-flex;
		padding: 3px;
		border-radius: 999px;
		background: var(--panel-line);
	}
	.seg button {
		min-height: 32px;
		padding: 5px 16px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--site-code-ink);
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
	}
	.seg button[aria-pressed='true'] {
		background: var(--site-brass);
		color: var(--site-code-bg);
	}
	.answer {
		min-height: 216px;
		padding: 18px 20px 20px;
	}
	.screen {
		padding: 14px 16px;
		border-radius: 10px;
		background: var(--screen-bg);
		color: var(--screen-ink);
		font-size: 0.85rem;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	caption {
		padding-bottom: 8px;
		text-align: start;
	}
	caption b {
		font-family: var(--site-font-display);
		font-size: 1.05rem;
	}
	caption span {
		float: inline-end;
		padding-top: 0.3em;
		color: var(--screen-muted);
		font-size: 0.78rem;
	}
	td {
		padding: 7px 0;
		border-top: 1px solid var(--screen-line);
	}
	td.kind {
		padding-inline: 16px;
		color: var(--screen-muted);
		text-align: end;
	}
	td.count {
		width: 1%;
		font-variant-numeric: tabular-nums;
		text-align: end;
	}
	.same {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 14px;
		padding: 12px 20px;
		border-top: 1px solid var(--panel-line);
		color: var(--site-code-dim);
		font-size: 0.82rem;
	}
	.same code {
		color: var(--site-brass);
		font-family: var(--site-font-mono);
	}

	/* sections */
	.band {
		padding-block: 72px;
		border-top: 1px solid var(--site-line);
	}
	.band.solid {
		border-top-color: transparent;
		background: var(--site-fill);
		color: var(--site-on-fill);
	}
	.head {
		max-width: 40em;
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 36px;
	}
	h2 {
		font-size: clamp(1.7rem, 3.4vw, 2.5rem);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.08;
		text-wrap: balance;
	}
	.head p {
		color: var(--site-muted);
		font-size: 1.05rem;
	}
	.band.solid .head p {
		color: var(--site-on-fill);
	}
	.band.solid .head::before {
		content: '';
		width: 56px;
		height: 6px;
		border-radius: 3px;
		background: var(--site-brass);
	}
	ul {
		list-style: none;
	}

	.ways-in {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border-top: 1px solid var(--site-line);
	}
	.ways-in li {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 20px 20px 20px 0;
		border-bottom: 1px solid var(--site-line);
	}
	.ways-in b {
		font-family: var(--site-font-display);
		font-size: 1.1rem;
		font-weight: 600;
	}
	.ways-in span {
		color: var(--site-muted);
		font-size: 0.93rem;
	}

	.agentic,
	.groups {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}
	.agentic {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
	.agentic li,
	.groups li {
		min-width: 0;
		display: flex;
	}
	.feat,
	.group {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 18px 20px;
		border: 1px solid var(--site-line);
		border-radius: 14px;
		background: var(--site-surface);
		color: inherit;
		text-decoration: none;
	}
	.feat:hover,
	.group:hover {
		border-color: var(--site-accent);
	}
	.feat {
		/* The one brass mark on a card: these lead the page. */
		border-top: 3px solid var(--site-brass);
	}
	.feat:hover {
		border-top-color: var(--site-brass);
	}
	.feat b {
		font-family: var(--site-font-display);
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.25;
	}
	.group b {
		font-family: var(--site-font-display);
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.feat span,
	.group .words {
		color: var(--site-muted);
		font-size: 0.92rem;
	}
	.also {
		margin-top: 24px;
		color: var(--site-muted);
		font-size: 0.95rem;
	}
	.more {
		margin-top: 24px;
		font-weight: 600;
	}
	.also a,
	.more a,
	.list a {
		color: var(--site-accent);
		text-decoration: none;
	}
	/* These sit inside a sentence, so color alone must not mark them as links. */
	.also a {
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}
	.also a:hover,
	.more a:hover,
	.list a:hover,
	.go:hover {
		text-decoration: underline;
	}

	.ways {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}
	.way {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 22px;
		border-radius: 14px;
		background: var(--site-surface);
		color: var(--site-ink);
	}
	.way .tag {
		color: var(--site-accent);
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
	}
	.way h3 {
		font-size: 1.3rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.way p {
		color: var(--site-muted);
		font-size: 0.95rem;
	}
	.go {
		margin-top: auto;
		color: var(--site-ink);
		font-size: 0.93rem;
		font-weight: 600;
		text-decoration: none;
	}

	.agents {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 48px;
		align-items: start;
	}
	.agents .head {
		margin-bottom: 0;
	}
	.list {
		border-top: 1px solid var(--site-line);
	}
	.list li {
		display: grid;
		grid-template-columns: minmax(0, 9em) minmax(0, 1fr);
		gap: 16px;
		padding: 14px 0;
		border-bottom: 1px solid var(--site-line);
		font-size: 0.95rem;
	}
	.list code {
		font-family: var(--site-font-mono);
		font-size: 0.85rem;
	}
	.list span {
		color: var(--site-muted);
	}

	@media (max-width: 1040px) {
		.agentic {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 860px) {
		.hero {
			padding-block: 44px 56px;
		}
		.hero-grid,
		.agents {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
		.band {
			padding-block: 52px;
		}
		.ways-in,
		.agentic,
		.groups {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.ways {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 560px) {
		.ways-in,
		.agentic,
		.groups {
			grid-template-columns: minmax(0, 1fr);
		}
		/* Eight cards in one column: keep them compact so the section stays
		   under two phone screens and the next one is within reach. */
		.lead {
			padding-block: 40px;
		}
		.lead .head {
			gap: 8px;
			margin-bottom: 20px;
		}
		.lead .head p {
			font-size: 1rem;
		}
		.also {
			margin-top: 16px;
		}
		.agentic {
			gap: 8px;
		}
		.feat {
			gap: 2px;
			padding: 11px 14px 12px;
		}
		.feat b {
			font-size: 1.1rem;
		}
		.feat span {
			font-size: 0.88rem;
			line-height: 1.4;
		}
	}
</style>
