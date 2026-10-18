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
		title: 'Every application comes with an assistant',
		body: [
			'The assistant sits in the application shell and can read the records on the open page. It runs only the operations the application allows it, and only as the signed-in person; it has no permissions of its own. When it needs a decision, it asks with a short form whose options come from the application, not from the model.',
			'It can run on a small model inside the browser, so nothing has to leave the device. Browser models answer in text only. build-a-boilerplate works that way on this site.'
		],
		links: [
			{ label: 'The admin shell', href: '/capabilities/application-shell' },
			{ label: 'smrt-chat', href: '/reference/packages/smrt-chat' }
		],
		evidenceId: 'in-app-assistant',
		keywords: ['assistant', 'AssistantDock', 'chat', 'on-device', 'browser model', 'WebLLM'],
		sketch: {
			kind: 'rows',
			items: ['Which invoices are overdue?', 'Three. Send reminders?', 'Yes · No']
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
				body: 'An agent can fill in a proposed value beside the current one. Applying it takes a real click, which an agent cannot send. Fields marked secret refuse the agent outright.'
			},
			{
				label: 'Approvals',
				body: 'A request is tied to one version of one record. Only people decide; an agent can ask, and can act on the answer once.'
			},
			{
				label: 'Agent instructions',
				body: 'An application’s own agents learn from feedback and can propose changes to their instructions, with the evidence. Nothing changes until someone activates the proposal.'
			},
			{
				label: 'Reports and paperwork',
				body: 'A report the assistant builds is saved only when a person confirms it. A document the inbox receives becomes a proposal a person reviews.'
			}
		],
		links: [
			{ label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
			{ label: 'Consent and authority', href: '/interaction#consent-sensitivity-and-authority' },
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
		sketch: { kind: 'rows', items: ['Proposed: 120.00', 'Current: 110.00', 'Apply · Discard'] }
	},
	{
		id: 'ask-for-a-report',
		eyebrow: 'Ask for a report',
		title: 'Say what you want to see',
		body: [
			'“Sales by month, last quarter.” The assistant turns the sentence into a report description — data, not code or SQL — and previews it before anything is saved. Saved reports run under the permissions of whoever opens them, every time.',
			'Reports that should always be current can instead be declared once and refreshed on a schedule.'
		],
		links: [
			{ label: 'Reports', href: '/capabilities/reports' },
			{ label: 'smrt-reports', href: '/reference/packages/smrt-reports' }
		],
		evidenceId: 'runtime-reports',
		keywords: ['report', 'reports', 'runtime report', 'analytics', 'dashboard'],
		sketch: { kind: 'rows', items: ['Sales by month', 'Jul ▇▇▇ Aug ▇▇▇▇ Sep ▇▇', 'Save report?'] }
	},
	{
		id: 'paperwork-in-proposals-out',
		eyebrow: 'Paperwork in, proposals out',
		label: 'Preview',
		title: 'An inbox for the documents a business receives',
		body: [
			'Email, a watched folder, a supplier’s webhook, a photo from a phone. The original is kept as evidence. Text is read out of it. An AI suggests what to do next from a list the application defines: create a bill, match a payment, open a job. A person approves or declines.',
			'Automation is switched off by design, and this part of the stack is labeled preview while that stays true.'
		],
		links: [
			{ label: 'Content and media modules', href: '/modules#content-and-media' },
			{ label: 'smrt-ingestion', href: '/reference/packages/smrt-ingestion' }
		],
		evidenceId: 'ingestion-preview',
		keywords: ['ingestion', 'inbox', 'intake', 'paperwork', 'documents', 'OCR', 'preview'],
		sketch: { kind: 'rows', items: ['invoice-0412.pdf', 'Create a bill?', 'Approve · Decline'] }
	},
	{
		id: 'who-can-see-what',
		eyebrow: 'Who can see what',
		title: 'Rules about data live with the data',
		body: [
			'An application can hold many organizations, nested up to ten deep. Which records a request may see is decided where the data is read and written, not in page code. So the same answer holds for screens, the API, the command line and agent tools; on PostgreSQL the database enforces it too.',
			'A field can be required, read-only or secret, and every surface honors that. A change can record who made it and, when an agent made it, the person it acted for.'
		],
		links: [
			{ label: 'Tenants', href: '/foundations/tenants' },
			{ label: 'Field policies', href: '/capabilities/field-policies' },
			{ label: 'Security defaults', href: '/reference/security' }
		],
		evidenceId: 'who-can-see-what',
		keywords: ['tenancy', 'tenants', 'permissions', 'row-level security', 'audit'],
		sketch: { kind: 'tree', items: ['Head office', 'Region', 'Branch'] }
	},
	{
		id: 'outside-agents-same-rules',
		eyebrow: 'Outside agents, same rules',
		title: 'Three doors, and each one is a choice',
		body: [
			'An MCP endpoint for connected agents, a command line, and tools a browser agent can see on the page. Each door is turned on per application, lists exactly which operations it offers, and starts read-only.',
			'Whatever the door, the request runs as a signed-in identity and passes the same checks as a click.'
		],
		links: [
			{ label: 'Where agents connect', href: '/agents#where-agents-connect' },
			{ label: 'Application MCP', href: '/tooling/app-mcp' },
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
