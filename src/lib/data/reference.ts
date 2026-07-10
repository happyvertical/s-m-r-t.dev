import type { Guide } from '$lib/data/guides';

export const referenceGuides: Guide[] = [
	{
		slug: 'saadl',
		navTitle: 'What is a SAADL?',
		eyebrow: 'Framework concept',
		title: 'Software as Agentic Domain Logic',
		lede: 'A SAADL application exposes the same domain operations to people and software agents instead of maintaining a separate, reduced bot interface.',
		plainEnglish:
			'Define the work once. People can reach it through pages, HTTP, or the command line, while agents receive callable tools that resolve to the same models, permissions, and field policies.',
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-app-cli', 'smrt-web'],
		visual: 'surfaces',
		sections: [
			{
				title: 'One definition, several ways to operate it',
				intro:
					'The domain model is the source of truth. REST routes, CLI commands, MCP and WebMCP tools, and human interfaces are projections of that same model rather than independent implementations that drift apart.'
			},
			{
				title: 'Useful to operators and builders',
				intro:
					'An operating agent receives the same permitted capabilities as a person. A coding agent receives a manifest of the objects, fields, relationships, and generated tools, so it can understand and change one definition instead of rediscovering every interface.'
			},
			{
				title: 'What does not count',
				intro:
					'A chatbot beside an application is not automatically SAADL. Neither is an agent-only tool or a generated UI. The defining property is parity: human and agent operations resolve through the same domain logic and security boundaries.'
			},
			{
				title: 'Why s-m-r-t uses this shape',
				intro:
					'One model reduces duplicated code and review, keeps the codebase map current, makes infrastructure replaceable, and lets hardening flow from shared framework packages into each application.'
			}
		]
	},
	{
		slug: 'security',
		navTitle: 'Security defaults',
		eyebrow: 'Reference',
		title: 'Generated interfaces fail closed',
		lede: 'Generated routes require an authenticated principal unless public access is explicitly declared, and field policy is applied before data leaves or enters the application.',
		plainEnglish:
			'Private is the default. Secret fields stay out of responses and filters, while read-only and server-managed fields are removed from client writes.',
		packages: ['smrt-core', 'smrt-users', 'smrt-tenancy'],
		sections: [
			{
				title: 'Authentication is the default',
				intro:
					'When api.public is not set, generated reads and writes require a resolved principal. Use public: "read" to open only reads or public: true when every generated action is intentionally public.',
				filename: 'Invoice.ts',
				code: `@smrt({\n  api: { include: ['list', 'get', 'create', 'update'] }\n})\nclass Invoice extends SmrtObject {\n  amount = 0;\n}\n\n// No api.public declaration: generated routes require authentication.`
			},
			{
				title: 'Sensitive fields close both read paths',
				intro:
					'A sensitive field is removed from public serialization and rejected in collection filters. Both protections matter: hiding output alone would still allow a caller to probe a secret value through repeated where clauses.'
			},
			{
				title: 'Write policy blocks mass assignment',
				intro:
					'Generated create and update handlers strip read-only fields, IDs, timestamps, tenant IDs, underscore-prefixed keys, and anything outside an optional writable allowlist before the model sees the request body.'
			},
			{
				title: 'Application code still owns its boundary',
				intro:
					'Generated routes enforce these defaults. Custom actions, jobs, direct collection calls, external callbacks, and product-specific threat models still need deliberate principal, tenant, permission, and input checks.'
			}
		]
	},
	{
		slug: 'have-sdk',
		navTitle: 'HAVE SDK',
		eyebrow: 'Underlying SDK',
		title: 'The adapter layer beneath s-m-r-t',
		lede: 'The HAppy VErtical SDK provides stable getX() interfaces for infrastructure such as AI, databases, caches, secrets, and files.',
		plainEnglish:
			's-m-r-t uses small adapter packages so changing a database, model provider, cache, or file store is primarily a configuration decision instead of an application rewrite.',
		packages: [],
		sections: [
			{
				title: 'Ask for a capability, then choose a provider',
				intro:
					'getAI(), getDatabase(), getCache(), getSecretStore(), and getFilesystem() return stable interfaces. Applications can pass explicit typed configuration or let the package read its documented HAVE_* environment values.',
				filename: 'adapters.ts',
				code: `import { getAI } from '@happyvertical/ai';\nimport { getDatabase } from '@happyvertical/sql';\n\nconst ai = await getAI({ type: 'anthropic' });\nconst db = await getDatabase({ type: 'postgres' });\n\nconst reply = await ai.message('Summarize this record');\nawait db.insert('summaries', { content: reply.content });`
			},
			{
				title: 'Install only the providers you use',
				intro:
					'Vendor SDKs remain optional peer dependencies where possible. The application depends on the adapter contract and adds the concrete database, model, cache, secret, or file provider it actually deploys.'
			},
			{
				title: 'The SDK also works without s-m-r-t',
				intro:
					'The adapter packages are independently useful. s-m-r-t composes them into its model, agent, persistence, and web runtimes, but ordinary TypeScript applications can call them directly.'
			}
		]
	},
	{
		slug: 'ai-and-retrieval',
		navTitle: 'AI and retrieval',
		eyebrow: 'Reference',
		title: 'Context memory and semantic search',
		lede: 's-m-r-t can store durable context and search records by meaning while keeping those operations inside normal object and collection boundaries.',
		plainEnglish:
			'Context memory remembers useful facts or strategies. Semantic search finds records whose meaning is close to a query, even when the words do not match exactly.',
		packages: ['smrt-core', 'smrt-agents'],
		sections: [
			{
				title: 'Context memory is durable application data',
				intro:
					'Store scoped facts, summaries, or strategies with ownership, confidence, expiry, and tenant boundaries. Agent learning builds on this foundation but adds outcome tracking and persona-specific recall.'
			},
			{
				title: 'Semantic search belongs in collections',
				intro:
					'Generate embeddings for selected content, store them through the configured database adapter, and query for nearby records through the collection API so tenant and field policy remain in the path.'
			},
			{
				title: 'Retrieval is not authority',
				intro:
					'A relevant result is still filtered by the active principal, tenant, sensitive-field policy, and the operations the caller may perform. Similarity does not widen access.'
			}
		]
	},
	{
		slug: 'testing',
		navTitle: 'Testing',
		eyebrow: 'Reference',
		title: 'Test through the same contracts applications use',
		lede: 'Use package test helpers, temporary databases, generated manifests, and focused component tests instead of replacing framework behavior with unrelated mocks.',
		plainEnglish:
			'Tests should exercise the real model, collection, permission, tenant, and component contracts at the narrowest useful level.',
		packages: ['smrt-vitest', 'smrt-core', 'smrt-ui'],
		sections: [
			{
				title: 'Start with the smallest real boundary',
				intro:
					'Unit-test pure model behavior directly, use the collection and temporary database helpers for persistence, and add route or browser tests only when the behavior crosses those interfaces.'
			},
			{
				title: 'Generate the manifest in tests',
				intro:
					'Test setup should scan the objects under test and load consumed package manifests so decorators, inheritance, interfaces, and migrations behave as they do in the application build.'
			},
			{
				title: 'Test security decisions explicitly',
				intro:
					'Cover anonymous, permitted, denied, cross-tenant, sensitive-field, read-only-field, and agent-confirmation cases. A passing happy path is not evidence that the boundary fails closed.'
			}
		]
	},
	{
		slug: 'configuration',
		navTitle: 'Configuration',
		eyebrow: 'Reference',
		title: 'Configuration',
		lede: 'Keep framework and package settings in one typed configuration tree, then pass the relevant branch to collections, services, and generated runtimes.',
		plainEnglish:
			'Configuration tells each package how your application connects to databases, services, models, and runtime options. Secrets should remain references or environment values, not committed strings.',
		packages: ['smrt-config', 'smrt-core'],
		sections: [
			{
				title: 'Application configuration',
				intro:
					'Define the application defaults once. Package configuration can extend or override that tree without requiring each call site to interpret environment variables.'
			},
			{
				title: 'Build configuration',
				intro:
					'The Vite plugin scans local objects, merges consumed package manifests, writes generated types and routes, and makes the virtual web module available.'
			},
			{
				title: 'Safe configuration boundaries',
				intro:
					'Keep browser-safe values separate from server-only values. Resolve secrets through the secret provider at the boundary that uses them.'
			}
		]
	},
	{
		slug: 'decorators',
		navTitle: 'Decorators',
		eyebrow: 'Reference',
		title: 'Decorators',
		lede: 'Decorators add metadata that cannot be inferred safely from field defaults: interfaces, relationships, tenant scope, sensitive fields, reports, and other package behavior.',
		plainEnglish:
			'A decorator is a short note attached to a class or field. The scanner records that note in the manifest so migrations and runtimes make the same decision.',
		packages: ['smrt-core', 'smrt-tenancy', 'smrt-reports'],
		sections: [
			{
				title: '@smrt()',
				intro:
					'Marks a model for scanning and declares which actions appear in REST, MCP, WebMCP definitions, and CLI. Use include, exclude, and writable lists instead of exposing every method by accident.'
			},
			{
				title: 'Relationships',
				intro:
					'Use foreignKey for a same-package relationship and crossPackageRef when the target comes from another package. The manifest records the target and the collection can batch-load named relationships.'
			},
			{
				title: 'Tenant scope',
				intro:
					'TenantScoped selects required, optional, or global behavior. The tenantId field decorator records the storage field used by automatic query interceptors.'
			},
			{
				title: 'Report fields',
				intro:
					'smrt-reports adds group, time bucket, and measure decorators so aggregate specifications remain beside the report model.'
			}
		]
	},
	{
		slug: 'collections',
		navTitle: 'Collections',
		eyebrow: 'Reference',
		title: 'Collections and list()',
		lede: 'Collections are the typed entry point for creating, finding, listing, counting, and relating objects.',
		plainEnglish:
			'Use a normal list when you need real objects and their methods. Use select when a page or report only needs a few plain fields.',
		packages: ['smrt-core', 'smrt-tenancy'],
		visual: 'collections',
		sections: [
			{
				title: 'Hydrated objects',
				intro:
					'list(), get(), and related reads normally turn rows into the correct object or STI subclass. Use include to batch-load named relationships without N+1 queries.'
			},
			{
				title: 'Projected rows',
				intro:
					'list({ select }) validates logical field names and returns precisely typed plain rows. Projection and relationship inclusion are intentionally separate modes.',
				code: `const rows = await items.list({\n  select: ['id', 'title', 'status'] as const,\n  where: { status: 'open' },\n  orderBy: 'created_at DESC',\n  limit: 50\n});`,
				filename: 'list-items.ts'
			},
			{
				title: 'Tenant and cache behavior',
				intro:
					'Tenant interceptors run for list, get, count, and related reads. Read caching is opt-in; writes invalidate affected entries, while count always checks the database.'
			}
		]
	},
	{
		slug: 'interfaces',
		navTitle: 'Generated interfaces',
		eyebrow: 'Reference',
		title: 'REST, MCP, WebMCP, and CLI',
		lede: 'Each generated interface is a view over the capabilities declared on your object. They share metadata but can expose different action sets.',
		plainEnglish:
			'REST serves application clients, MCP serves connected agents, WebMCP serves agents in the browser page, and CLI serves people or scripts in a terminal.',
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-app-cli', 'smrt-web'],
		visual: 'surfaces',
		sections: [
			{
				title: 'REST',
				intro:
					'Generated SvelteKit routes use manifest schemas, writable-field policy, authentication, tenant scope, and operation permissions. Package pages show the representative route shape.'
			},
			{
				title: 'MCP',
				intro:
					'Tool names, descriptions, and JSON Schema inputs are generated from explicitly included model actions. Agent and persona tool ceilings can narrow what a principal may call.'
			},
			{
				title: 'WebMCP',
				intro:
					'The browser registers selected generated descriptors with document.modelContext. Calls use the signed-in page session and generated REST fetchers; the server remains the security boundary.'
			},
			{
				title: 'CLI',
				intro:
					'Application CLIs turn manifest resources into predictable commands and can add model-specific operations. The framework CLI also owns migration, scanning, generation, and introspection workflows.'
			}
		]
	},
	{
		slug: 'terminology',
		navTitle: 'Terminology',
		eyebrow: 'Reference',
		title: 'Terminology',
		lede: 'A short map of the words used throughout the framework and these docs.',
		plainEnglish:
			'These names describe different jobs. Keeping them distinct makes data, identity, and authority easier to discuss.',
		packages: [],
		sections: [
			{
				title: 'Object, collection, and manifest',
				intro:
					'An object is one typed record with behavior. A collection works with many objects. The manifest is the scanned description used by build tools and runtimes.'
			},
			{
				title: 'Tenant, user, profile, and membership',
				intro:
					'A tenant is a data and authority boundary. A user authenticates. A profile represents a person, organization, or agent in the product. A membership connects a user to a tenant.'
			},
			{
				title: 'Role, permission, and principal',
				intro:
					'A role groups permissions inside a tenant. A permission names an operation. A principal is the resolved identity and authority carried into a request, job, or agent call.'
			},
			{
				title: 'Agent, persona, and learning memory',
				intro:
					'An agent is executable behavior. A persona is one durable tenant-owned instance with its own instructions and tool ceiling. Learning memory stores outcome-scored experience for later recall.'
			},
			{
				title: 'SSR, hydration, and live collection',
				intro:
					'Server-side rendering supplies the first HTML and data. Hydration hands those rows to browser state. A live collection can then receive changes and replay offline writes.'
			}
		]
	}
];

export function getReferenceGuide(slug: string) {
	return referenceGuides.find((guide) => guide.slug === slug);
}
