/**
 * The homepage's six feature sections (#321 slice B, proposal §4 sections 3–8).
 *
 * Each entry is one section: plain-language copy a non-technical visitor can
 * picture, links to the pages where the technical detail lives, and the id of
 * the `whySmrtClaims` row that holds the release-verified source for the
 * section's claims. `FeatureSections.svelte` renders the list; nothing here is
 * a route of its own.
 *
 * Every sentence was checked against the installed `@happyvertical/smrt-*`
 * `AGENTS.md` files (and, for packages the site does not install, the
 * upstream tree at the same release). Keep claims structural rather than
 * counted, and keep the register "inform, don't convince".
 */

export interface HomepageFeatureLink {
	label: string;
	href: string;
}

export interface HomepageFeaturePoint {
	label: string;
	body: string;
}

export interface HomepageFeature {
	/** Section anchor (`/#<id>`), also the search-index deep link. */
	id: string;
	/**
	 * Short label for the section. Since slice D it is not rendered on the
	 * page — the H2 stands alone — but the search palette uses it as the
	 * entry's breadcrumb (`Home · <eyebrow>`).
	 */
	eyebrow: string;
	/** Release-status label shown beside the eyebrow, when the feature carries one. */
	label?: 'Preview';
	/** The H2: a full sentence that stands alone. */
	title: string;
	/** One or two short paragraphs. */
	body: string[];
	/** Named instances of the idea, rendered as a list. */
	points?: HomepageFeaturePoint[];
	/** Where the technical detail lives; labels are nouns, never "learn more". */
	links: HomepageFeatureLink[];
	/** `whySmrtClaims` row holding this section's verified source. */
	evidenceId: string;
	/** Plain words a visitor might type into the palette for this section. */
	keywords: string[];
}

export const homepageFeatures: HomepageFeature[] = [
	{
		id: 'assistant',
		eyebrow: 'An assistant in the app',
		title: 'An application can carry its own assistant',
		body: [
			'An application adds the assistant to its shell with one recipe. It can read the records on the open page and acts only as the signed-in person. When it needs a decision, it asks with a short form whose options the application defines, not the model.',
			'The model can be small enough to run in the browser, with no key and no model server; build-a-boilerplate works that way here.'
		],
		links: [
			{ label: 'Admin shell', href: '/docs/capabilities/application-shell' },
			{ label: 'smrt-chat', href: '/docs/reference/packages/smrt-chat' }
		],
		evidenceId: 'in-app-assistant',
		keywords: ['assistant', 'AssistantDock', 'chat', 'on-device', 'browser model', 'WebLLM']
	},
	{
		id: 'agents-propose-people-confirm',
		eyebrow: 'Agents do the work. People make the call.',
		title: 'An agent can propose. A person confirms.',
		// The heading states the rule and the list shows where it recurs; an
		// introductory sentence would only restate the heading.
		body: [],
		points: [
			{
				label: 'Forms',
				body: 'An agent can set a proposed value beside the current one; applying it takes a click an agent cannot send. Secret fields refuse the agent.'
			},
			{
				label: 'Approvals',
				body: 'A request names one version of one record. Only people decide; an agent can ask, then act on the answer once.'
			},
			{
				label: 'Agent instructions',
				body: 'Agents learn from feedback and propose changes to their instructions, with evidence. Nothing changes until a person activates the proposal.'
			},
			{
				label: 'Reports and paperwork',
				body: 'A report the assistant builds is saved when a person confirms it; a received document becomes a proposal a person reviews.'
			}
		],
		links: [
			{ label: 'Agent-assisted forms', href: '/docs/capabilities/agent-assisted-forms' },
			{ label: 'Authority', href: '/docs/interaction#consent-sensitivity-and-authority' },
			{ label: 'Learning agents', href: '/docs/capabilities/learning-agents' },
			{ label: 'smrt-approvals', href: '/docs/reference/packages/smrt-approvals' }
		],
		evidenceId: 'propose-confirm',
		keywords: [
			'propose',
			'confirm',
			'approval',
			'approvals',
			'staged',
			'human in the loop',
			'directive'
		]
	},
	{
		id: 'ask-for-a-report',
		eyebrow: 'Ask for a report',
		title: 'Say what you want to see',
		body: [
			'“Sales by month, last quarter.” The assistant turns that into a report description — data, not code or SQL — and previews it before anything is saved. Saved reports run under the permissions of whoever opens them, every time.'
		],
		links: [
			{ label: 'Reports', href: '/docs/capabilities/reports' },
			{ label: 'smrt-reports', href: '/docs/reference/packages/smrt-reports' }
		],
		evidenceId: 'runtime-reports',
		keywords: ['report', 'reports', 'runtime report', 'analytics', 'dashboard']
	},
	{
		id: 'paperwork-in-proposals-out',
		eyebrow: 'Paperwork in, proposals out',
		label: 'Preview',
		title: 'An inbox for the documents a business receives',
		body: [
			'Email, a watched folder, a supplier’s webhook, a photo from a phone. The original is kept as evidence and its text read out. An AI suggests what to do next from a list the application defines; a person approves or declines.'
		],
		links: [
			{ label: 'Ingestion block', href: '/blocks/ingestion' },
			{ label: 'smrt-ingestion', href: '/docs/reference/packages/smrt-ingestion' }
		],
		evidenceId: 'ingestion-preview',
		keywords: ['ingestion', 'inbox', 'intake', 'paperwork', 'documents', 'OCR', 'preview']
	},
	{
		id: 'who-can-see-what',
		eyebrow: 'Who can see what',
		title: 'Rules about data live with the data',
		body: [
			'An application can hold many organizations. Which records a request may see is decided where data is read and written, not in page code. So the answer is the same for screens, the API, the command line and agent tools; on PostgreSQL the database enforces it too. A field can be required, read-only or secret on every surface. A change can record who made it and, for an agent, whom it acted for.'
		],
		links: [
			{ label: 'Tenants', href: '/docs/foundations/tenants' },
			{ label: 'Field policies', href: '/docs/capabilities/field-policies' },
			{ label: 'Security', href: '/docs/reference/security' }
		],
		evidenceId: 'who-can-see-what',
		keywords: ['tenancy', 'tenants', 'permissions', 'row-level security', 'audit']
	},
	{
		id: 'outside-agents-same-rules',
		eyebrow: 'Outside agents, same rules',
		title: 'Three doors, and each one is a choice',
		body: [
			'An MCP endpoint for connected agents, a command line, and tools a browser agent can see on the page. Each is turned on per application and names its operations. Browser tools start read-only; the command line carries the actions the application selected.'
		],
		links: [
			{ label: 'Agents', href: '/docs/agents#where-agents-connect' },
			{ label: 'App MCP', href: '/docs/tooling/app-mcp' },
			{ label: 'WebMCP', href: '/docs/capabilities/webmcp' }
		],
		evidenceId: 'agent-doors',
		keywords: ['MCP', 'WebMCP', 'CLI', 'agents', 'read-only']
	}
];

/**
 * The money model, as one sentence (#321: a full section only if the page
 * stays under ~1,100 words; the sentence is the default). The link moves to
 * the money guide when s-m-r-t.dev#309 ships it; until then it points at the
 * package whose `AGENTS.md` holds the rules.
 */
export const homepageMoneyNote = {
	body: 'Money is kept exactly: whole numbers in the currency’s smallest unit, invoice figures frozen once issued, ledger entries voided rather than edited.',
	linkLabel: 'smrt-commerce',
	href: '/docs/reference/packages/smrt-commerce'
};
