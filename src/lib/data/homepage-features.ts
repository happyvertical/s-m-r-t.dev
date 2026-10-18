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

/**
 * The static, token-styled sketch drawn beside a section: a few short strings
 * laid out as stacked rows, an indented tree, or three doors. Decorative and
 * `aria-hidden`; the copy carries the meaning.
 */
export interface HomepageFeatureSketch {
	kind: 'rows' | 'tree' | 'doors';
	items: string[];
}

export interface HomepageFeature {
	/** Section anchor (`/#<id>`), also the search-index deep link. */
	id: string;
	/** Short label above the heading. */
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
	sketch: HomepageFeatureSketch;
}

export const homepageFeatures: HomepageFeature[] = [
	{
		id: 'assistant',
		eyebrow: 'An assistant in the app',
		title: 'An application can carry its own assistant',
		body: [
			'The assistant is a dock an application adds to its shell, with one recipe or by mounting it. It can read the records on the open page. It acts only as the signed-in person, within what the application allows; it has no permissions of its own. When it needs a decision, it asks with a short form whose options come from the application, not the model.',
			'It can run on a small model inside the browser, so nothing leaves the device; build-a-boilerplate works that way on this site.'
		],
		links: [
			{ label: 'Admin shell', href: '/capabilities/application-shell' },
			{ label: 'smrt-chat', href: '/reference/packages/smrt-chat' }
		],
		evidenceId: 'in-app-assistant',
		keywords: ['assistant', 'AssistantDock', 'chat', 'on-device', 'browser model', 'WebLLM'],
		sketch: {
			kind: 'rows',
			items: ['Overdue invoices?', 'Three. Remind them?', 'Yes · No']
		}
	},
	{
		id: 'agents-propose-people-confirm',
		eyebrow: 'Agents do the work. People make the call.',
		title: 'An agent can propose. A person confirms.',
		body: ['The same rule appears everywhere in the stack.'],
		points: [
			{
				label: 'Forms',
				body: 'An agent can set a proposed value beside the current one. Applying it takes a real click, which an agent cannot send; secret fields refuse the agent.'
			},
			{
				label: 'Approvals',
				body: 'A request is tied to one version of one record. Only people decide; an agent can ask, and can act on the answer once.'
			},
			{
				label: 'Agent instructions',
				body: 'An application’s agents learn from feedback and can propose changes to their instructions, with evidence. Nothing changes until a person activates the proposal.'
			},
			{
				label: 'Reports and paperwork',
				body: 'A report the assistant builds is saved only when a person confirms it. A document the inbox receives becomes a proposal a person reviews.'
			}
		],
		links: [
			{ label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
			{ label: 'Authority', href: '/interaction#consent-sensitivity-and-authority' },
			{ label: 'Learning agents', href: '/capabilities/learning-agents' },
			{ label: 'smrt-approvals', href: '/reference/packages/smrt-approvals' }
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
		],
		sketch: { kind: 'rows', items: ['Proposed 120.00', 'Current 110.00', 'Apply'] }
	},
	{
		id: 'ask-for-a-report',
		eyebrow: 'Ask for a report',
		title: 'Say what you want to see',
		body: [
			'“Sales by month, last quarter.” The assistant turns the sentence into a report description — data, not code or SQL — and previews it before anything is saved. Saved reports run under the permissions of whoever opens them, every time.'
		],
		links: [
			{ label: 'Reports', href: '/capabilities/reports' },
			{ label: 'smrt-reports', href: '/reference/packages/smrt-reports' }
		],
		evidenceId: 'runtime-reports',
		keywords: ['report', 'reports', 'runtime report', 'analytics', 'dashboard'],
		sketch: { kind: 'rows', items: ['Sales by month', 'Jul ▇▇ Aug ▇▇▇', 'Save?'] }
	},
	{
		id: 'paperwork-in-proposals-out',
		eyebrow: 'Paperwork in, proposals out',
		label: 'Preview',
		title: 'An inbox for the documents a business receives',
		body: [
			'Email, a watched folder, a supplier’s webhook, a photo from a phone. The original is kept as evidence and its text read out. An AI suggests what to do next from a list the application defines; a person approves or declines.',
			'Automation is off by design; this part of the stack is labeled preview while that stays true.'
		],
		links: [
			{ label: 'Modules', href: '/modules#content-and-media' },
			{ label: 'smrt-ingestion', href: '/reference/packages/smrt-ingestion' }
		],
		evidenceId: 'ingestion-preview',
		keywords: ['ingestion', 'inbox', 'intake', 'paperwork', 'documents', 'OCR', 'preview'],
		sketch: { kind: 'rows', items: ['invoice.pdf', 'Create a bill?', 'Approve'] }
	},
	{
		id: 'who-can-see-what',
		eyebrow: 'Who can see what',
		title: 'Rules about data live with the data',
		body: [
			'An application can hold many organizations, nested up to ten deep. Which records a request may see is decided where the data is read and written, not in page code. So the answer is the same for screens, the API, the command line and agent tools; on PostgreSQL the database enforces it too. A field can be required, read-only or secret on every surface. A change can record who made it and, for an agent, the person it acted for.'
		],
		links: [
			{ label: 'Tenants', href: '/foundations/tenants' },
			{ label: 'Field policies', href: '/capabilities/field-policies' },
			{ label: 'Security', href: '/reference/security' }
		],
		evidenceId: 'who-can-see-what',
		keywords: ['tenancy', 'tenants', 'permissions', 'row-level security', 'audit'],
		sketch: { kind: 'tree', items: ['Office', 'Region', 'Branch'] }
	},
	{
		id: 'outside-agents-same-rules',
		eyebrow: 'Outside agents, same rules',
		title: 'Three doors, and each one is a choice',
		body: [
			'An MCP endpoint for connected agents, a command line, and tools a browser agent can see on the page. Each door is turned on per application and names its operations. Browser tools and anonymous MCP start read-only; the command line carries the actions the application selected.',
			'Whatever the door, a change runs as a signed-in identity and passes the same checks as a click. Without a sign-in, a door shows only what the application marks public, and only to read.'
		],
		links: [
			{ label: 'Agents', href: '/agents#where-agents-connect' },
			{ label: 'App MCP', href: '/tooling/app-mcp' },
			{ label: 'WebMCP', href: '/capabilities/webmcp' }
		],
		evidenceId: 'agent-doors',
		keywords: ['MCP', 'WebMCP', 'CLI', 'agents', 'read-only'],
		sketch: { kind: 'doors', items: ['MCP', 'CLI', 'Browser'] }
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
	href: '/reference/packages/smrt-commerce'
};
