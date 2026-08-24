import type { Guide } from '$lib/data/guides';

/**
 * Released s-m-r-t version every claim in this section was verified against.
 * When this moves, re-read the canonical sources listed on each page.
 */
export const TOOLING_PINNED_VERSION = '0.42.4';

/** Canonical upstream tree for the release above. */
const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${TOOLING_PINNED_VERSION}`;

export const toolingSurfaceBoundaries = [
	{
		label: 'CLI, templates, and scanner',
		eyebrow: 'Developers and CI',
		description:
			'Runs in the local workspace. Commands can create files, generate artifacts, inspect manifests, and apply migrations to the configured database.',
		plainEnglish:
			'You need to start an app, change its model, generate interfaces, verify it, or operate its development database.',
		href: '/tooling/development-workflow'
	},
	{
		label: 'Knowledge commands',
		eyebrow: 'Developers and coding agents',
		description:
			'Reads workspace files, generated knowledge, installed-package contracts, and git history. It does not inspect live application data.',
		plainEnglish:
			'You need a deterministic index, freshness result, change report, or review and architecture context.',
		href: '/tooling/knowledge'
	},
	{
		label: 'Development MCP',
		eyebrow: 'Coding agents',
		description:
			'Runs as a local, read-only stdio server. It inspects the workspace and installed packages but cannot access the running application.',
		plainEnglish:
			'A coding agent needs structured discovery, diagnostics, generation output, or review context through MCP.',
		href: '/tooling/dev-mcp'
	},
	{
		label: 'Generated local MCP',
		eyebrow: 'Local application agents',
		description:
			'Runs beside the application and operates live data. It gets credentials from its environment and has no per-request principal, so it stays local.',
		plainEnglish:
			'A trusted application agent on the same machine must use generated model operations.',
		href: '/tooling/app-mcp'
	},
	{
		label: 'Hosted application MCP',
		eyebrow: 'Remote application agents',
		description:
			'Runs as a stateless HTTP route. A gateway terminates authorization, and the application resolves a principal for each request.',
		plainEnglish:
			'A remote application agent needs permitted operations against a deployed application.',
		href: '/tooling/app-mcp'
	},
	{
		label: 'WebMCP',
		eyebrow: 'Browser-session application agents',
		description:
			'Registers tools in the browser page and calls the generated REST surface as the signed-in page user. It is not a separate server.',
		plainEnglish:
			'An application agent in the browser must use actions that the current page exposes.',
		href: '/capabilities/webmcp'
	},
	{
		label: 'Agent Plugin',
		eyebrow: 'Coding-agent clients',
		description:
			'Packages the same local Development MCP server with manifests, schemas, and skills. The client keeps credentials outside the package.',
		plainEnglish:
			'A compatible coding-agent client can discover the development integration from a package.',
		href: '/tooling/agent-plugin'
	}
] as const;

export const toolingGuides: Guide[] = [
	{
		slug: 'development-workflow',
		navTitle: 'CLI and local workflow',
		eyebrow: 'Developer tooling',
		title: 'Build, inspect, test, and run an application',
		lede: 'Use the application starters and the framework CLI for the local development loop. The scanner builds the shared manifest. The Vitest plugin gives tests the same model metadata.',
		plainEnglish:
			'This page connects the tools a developer uses from the first scaffold through model changes, tests, migrations, and local operation.',
		packages: ['smrt-cli', 'smrt-scanner', 'smrt-template-sveltekit', 'smrt-vitest'],
		pinnedVersion: TOOLING_PINNED_VERSION,
		sources: [
			{ label: 'CLI README', href: `${SMRT_TREE}/packages/cli/README.md` },
			{ label: 'CLI AGENTS.md', href: `${SMRT_TREE}/packages/cli/AGENTS.md` },
			{ label: 'Scanner AGENTS.md', href: `${SMRT_TREE}/packages/scanner/AGENTS.md` },
			{
				label: 'SvelteKit template AGENTS.md',
				href: `${SMRT_TREE}/packages/template-sveltekit/AGENTS.md`
			},
			{ label: 'Vitest AGENTS.md', href: `${SMRT_TREE}/packages/vitest/AGENTS.md` }
		],
		sections: [
			{
				title: 'Choose a supported starting point',
				intro:
					'The basic SvelteKit template is the small, ground-up path. It includes one model, SQLite, tenant and session hooks, the application shell, and generated interfaces. The SaaS starter is the production-shaped path with accounts, onboarding, subscriptions, workers, mobile clients, and deployment files.',
				points: [
					'Use the basic template when you want to learn or build a focused application.',
					'Use the SaaS starter when the product needs the common multi-tenant application systems from the start.',
					'Use smrt init only to add framework files to an existing SvelteKit project.'
				],
				links: [
					{ label: 'Compare the application starters', href: '/starters' },
					{ label: 'Ground-up SvelteKit guide', href: '/starters/ground-up' },
					{ label: 'SaaS starter guide', href: '/starters/saas' }
				]
			},
			{
				title: 'Keep one short local loop',
				intro:
					'Start the Vite development server while you change models and pages. The framework plugins scan the object sources and refresh the local manifest, registration, types, routes, and knowledge artifact. Restart the server after you add a new object or change scanner inputs if the generated view does not update.',
				filename: 'terminal',
				lang: 'bash',
				code: `pnpm dev

# In a second terminal, inspect the generated project view.
pnpm smrt introspect
pnpm smrt doctor

# Before review, check types and produce the static build.
pnpm check
pnpm build`,
				links: [{ label: 'Framework concepts', href: '/framework' }]
			},
			{
				title: 'Use the CLI as the developer control surface',
				intro:
					'The CLI discovers project and installed-package manifests. It can inspect objects, generate interfaces, scaffold playground files, run diagnostics, and operate the configured development database. Generated object commands use the action lists in the model manifest.',
				points: [
					'Use introspect, objects, schema, status, and doctor to inspect the project.',
					'Use generate-types, generate-routes, generate-register, and generate-mcp for explicit generation tasks.',
					'Use playground init, playground list, and playground dev for component and package previews.',
					'Use the knowledge command family when the output is evidence for a coding agent.'
				],
				links: [
					{ label: 'Deterministic knowledge commands', href: '/tooling/knowledge' },
					{ label: 'Working Playground', href: '/playground' }
				]
			},
			{
				title: 'Treat the manifest as generated evidence',
				intro:
					'The scanner parses TypeScript syntax and never executes the source. It resolves supported class inheritance and converts the result into the manifest shape that migrations, tests, and interface generators consume. A scan is not a full TypeScript type check. Rebuild after source changes before you trust a generated artifact.',
				points: [
					'The scanner excludes dependency, hidden, and generated directories by default.',
					'A scan diagnostic blocks production manifest generation instead of publishing a partial result.',
					'The runtime manifest supports registration. The separate knowledge artifact supports developer and coding-agent inspection.'
				],
				links: [
					{ label: 'Reference: decorators', href: '/reference/decorators' },
					{ label: 'Reference: generated interfaces', href: '/reference/interfaces' }
				]
			},
			{
				title: 'Make migrations follow the model',
				intro:
					'Schema migrations are generated from the current manifest. The CLI does not generate migration files. Build first so the manifest is current. Then inspect the status or diff before you apply the change. The basic template makes its db:migrate script build before it runs the migration command.',
				filename: 'terminal',
				lang: 'bash',
				code: `pnpm build
pnpm smrt db:status
pnpm smrt db:diff
pnpm smrt db:migrate --dry-run
pnpm smrt db:migrate`,
				links: [{ label: 'Reference: configuration', href: '/reference/configuration' }]
			},
			{
				title: 'Give tests the same generated model',
				intro:
					'Every framework test project uses smrtVitestPlugin. It scans source at Vitest startup, loads installed manifests, and registers the classes that tests use. Restart Vitest after you add a model or field. Use the isolated database helpers for model and policy tests.',
				filename: 'vitest.config.ts',
				code: `import { smrtVitestPlugin } from '@happyvertical/smrt-vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [smrtVitestPlugin()],
  test: {
    environment: 'node',
    setupFiles: ['@happyvertical/smrt-vitest/setup']
  }
});`,
				links: [
					{ label: 'Guide: test your application', href: '/guides/testing-your-app' },
					{ label: 'Reference: testing', href: '/reference/testing' }
				]
			}
		],
		related: [
			{ label: 'Framework overview', href: '/framework' },
			{ label: 'Application starters', href: '/starters' },
			{ label: 'Testing guide', href: '/guides/testing-your-app' },
			{ label: 'Generated interfaces reference', href: '/reference/interfaces' }
		]
	},
	{
		slug: 'knowledge',
		navTitle: 'Knowledge tooling',
		eyebrow: 'Developer tooling',
		title: 'Deterministic knowledge about your own workspace',
		lede: 'The knowledge commands build an index of the packages, objects, and authored documentation in a workspace, then report coverage, staleness, and what changed.',
		plainEnglish:
			'These commands answer "what is actually in this repository, and is the written description of it still true?" They compute the answer from the workspace rather than asking a model.',
		packages: ['smrt-dev-mcp', 'smrt-core', 'smrt-scanner'],
		pinnedVersion: TOOLING_PINNED_VERSION,
		sources: [
			{ label: 'smrt-dev-mcp README', href: `${SMRT_TREE}/packages/smrt-dev-mcp/README.md` },
			{ label: 'smrt-dev-mcp AGENTS.md', href: `${SMRT_TREE}/packages/smrt-dev-mcp/AGENTS.md` },
			{ label: 'CLI README', href: `${SMRT_TREE}/packages/cli/README.md` }
		],
		sections: [
			{
				title: 'Five commands, each with a shorter alias',
				intro:
					'The framework CLI ships as @happyvertical/smrt-cli and installs the smrt binary. Each knowledge command is registered under a dev: name with a knowledge: alias, so both spellings run the same handler.',
				points: [
					'dev:knowledge-index builds the composed index for a scope.',
					'dev:knowledge-check runs the deterministic freshness and stale-reference checks.',
					'dev:knowledge-diff reports what changed against a git base ref.',
					'dev:knowledge-review-context and dev:knowledge-architecture-context return prompt bundles.'
				],
				filename: 'knowledge-commands.sh',
				lang: 'bash',
				code: `# Build the composed index for the whole project.
smrt dev:knowledge-index --format json

# Deterministic freshness check; non-zero exit when it is not ok.
smrt knowledge:check --strict --format markdown

# What changed against a git base ref.
smrt knowledge:diff --base main --format markdown

# Portable prompt bundles for review and architecture work.
smrt knowledge:review-context --scope package --package content --format markdown
smrt knowledge:architecture-context "tenant-aware publishing workflow" --format json`
			},
			{
				title: 'Options differ per command',
				intro:
					'--scope and --package are shared by all five commands. --scope defaults to project and accepts project, local, package, sdk, or installed. The remaining options belong to specific commands, so a flag copied between them will not always apply.',
				points: [
					'--changed and --strict belong to dev:knowledge-check only.',
					'--base belongs to dev:knowledge-diff only and defaults to HEAD.',
					'--format is json by default for dev:knowledge-index and markdown for the other four.',
					'--json remains as a deprecated alias for --format json on every command except dev:knowledge-index.'
				]
			},
			{
				title: 'Where objects come from, and why that is recorded',
				intro:
					'Package discovery reads the workspace globs rather than assuming a packages directory, so apps are indexed the same way packages are. Resolution runs in a fixed order: the packages list in pnpm-workspace.yaml, then workspaces in package.json, then packages/* as a last-resort fallback. Within each package, objects resolve from a domain artifact, a package-local manifest, or a source scan. objectSource records the selected source and reason.',
				points: [
					'objectSource is one of domain-artifact, manifest, scanner, or none.',
					'The workspace root is indexed when it has a package.json, with member directories excluded.',
					'Manifest objects belonging to another package are rejected rather than counted.',
					'Scanner-provenance packages carry no column type, so some schema facts are absent by design.'
				]
			},
			{
				title: 'Consumer apps can inspect what they installed',
				intro:
					'A consumer application may author no framework package of its own, so workspace discovery alone cannot describe the SMRT surface it runs. schemaVersion 3 adds installedPackages: an enumerated, deduplicated view of installed @happyvertical/smrt-* and known SDK packages, available directly through --scope installed.',
				points: [
					'Each installed package records its version, isInstalledDependency, and agentDocSha256 for the shipped AGENTS.md.',
					'The documentation hash is the drift signal; a version change alone does not imply that the agent contract changed.',
					'Installed dependencies are indexed but skipped by the freshness gate, because a consumer cannot repair documentation inside a published package.',
					'Authored-package coverage remains separate, so installed objects cannot hide a broken workspace scan.'
				],
				filename: 'installed-knowledge.sh',
				lang: 'bash',
				code: `smrt dev:knowledge-index --scope installed --format json`
			},
			{
				title: 'Coverage and diagnostics instead of a silent empty answer',
				intro:
					'Coverage and diagnostics were added in schemaVersion 2. Coverage names the workspace globs, their source, and the package directories found. Coverage also identifies authored packages with and without objects and gives a reason and remedy. A zero-object result produces an error-grade diagnostic that names the checked roots and artifact paths. The tool never reports an unreadable project as a project with no model.',
				points: [
					'Coverage and diagnostics are computed before scope filtering, because they describe discovery itself.',
					'Diagnostics propagate into the architecture, review, and reflection results.',
					'A response budget never trims diagnostics; only the objects payload is budgeted.'
				]
			},
			{
				title: 'Authored documentation is part of the contract',
				intro:
					'AGENTS.md chains are additive: a package carries its own instructions and an agent loads the chain it sits in. A package nested inside another workspace package deliberately carries no AGENTS.md or CLAUDE.md. Otherwise, the agent would load the parent and child files together. Put that expertise in the linked module documentation for the parent.',
				points: [
					'Authored docs are required even for private packages.',
					'A reappearing nested AGENTS.md raises a nested-agents-md error.',
					'Summary responses list authored docs by path; full responses embed them.'
				]
			},
			{
				title: 'Generated artifacts and their discovery order',
				intro:
					'A package or app can publish its own scoped smrt-knowledge.json. Discovery prefers a local .smrt/smrt-knowledge.json, then dist/smrt-knowledge.json, then source manifest artifacts, before falling back to raw manifest and documentation scanning. The runtime manifest.json stays focused on object registration; smrt-knowledge.json is the artifact intended for developers and agents.',
				links: [
					{ label: 'Reference: generated interfaces', href: '/reference/interfaces' },
					{ label: 'Reference: decorators', href: '/reference/decorators' }
				]
			},
			{
				title: 'Know what the evidence can prove',
				intro:
					'The index reports declared workspace and installed-package facts. It records the selected source and diagnostics so a coding agent can tell generated evidence from a fallback scan. It does not prove that a deployed process loaded the same artifact. It also does not prove that a caller has authority to use a generated operation.',
				points: [
					'Package versions and AGENTS.md hashes identify the installed contract that the index read.',
					'Coverage and diagnostics identify missing or stale evidence instead of filling gaps with a model answer.',
					'Only an explicit runtime bridge can report observed process capabilities, and it must label them separately.',
					'Authentication, tenant scope, permission, and field policy remain runtime decisions.'
				],
				links: [
					{ label: 'Development MCP runtime boundary', href: '/tooling/dev-mcp' },
					{ label: 'Reference: security defaults', href: '/reference/security' }
				]
			},
			{
				title: 'When output looks stale',
				intro:
					'Stale output almost always means the artifact behind it is stale or was never built. Run the downstream build or dev server so the domain artifact exists, then re-run the checker. Because the checks are deterministic, the same workspace produces the same result, which makes a changed answer meaningful.',
				points: [
					'Run the app build first so .smrt/smrt-knowledge.json exists.',
					'Re-run smrt knowledge:check --strict after editing package docs.',
					'A wrong package set usually means the workspace globs resolved from an unexpected source; coverage reports which one.',
					'Broad or repeated globstars can exhaust the shared directory-entry budget, which fails with a diagnostic instead of returning a partial package set. The limit counts work performed rather than depth, so a deeply nested workspace is still supported.'
				]
			},
			{
				title: 'The same knowledge, two response sizes',
				intro:
					'CLI callers request the full detail level, so command output embeds authored documents and complete package records. MCP callers receive the budgeted summary by default and can opt into detail full. The underlying knowledge is identical; only the projection differs.',
				links: [{ label: 'Using it from an agent: smrt-dev-mcp', href: '/tooling/dev-mcp' }]
			}
		],
		related: [
			{ label: 'CLI and local workflow', href: '/tooling/development-workflow' },
			{ label: 'Development MCP', href: '/tooling/dev-mcp' },
			{ label: 'Framework overview', href: '/framework' },
			{ label: 'Generated interfaces reference', href: '/reference/interfaces' }
		]
	},
	{
		slug: 'dev-mcp',
		navTitle: 'smrt-dev-mcp',
		eyebrow: 'Developer tooling',
		title: 'The development MCP server',
		lede: '@happyvertical/smrt-dev-mcp gives a coding agent the same deterministic workspace and installed-package knowledge as the CLI. It also provides class generation, project introspection, and portable review and architecture bundles.',
		plainEnglish:
			'This read-only server helps a coding agent understand your codebase. It returns generated source as output but never writes it. It cannot touch your running application, its data, or its users.',
		packages: ['smrt-dev-mcp', 'smrt-scanner', 'smrt-core'],
		pinnedVersion: TOOLING_PINNED_VERSION,
		sources: [
			{ label: 'smrt-dev-mcp README', href: `${SMRT_TREE}/packages/smrt-dev-mcp/README.md` },
			{ label: 'smrt-dev-mcp AGENTS.md', href: `${SMRT_TREE}/packages/smrt-dev-mcp/AGENTS.md` }
		],
		sections: [
			{
				title: 'It is a development plane, not a runtime one',
				intro:
					'smrt-dev-mcp is the Tier 2 development server. It reads source, manifests, and authored documentation from a workspace on disk. It is read-only, never writes files, never executes generated code, and has no access to your application database, principals, or tenants. Live data operations belong to the Tier 1 generated and application MCP surfaces.',
				points: [
					'Tier 1 is generated from your @smrt() objects and performs live data operations.',
					'Tier 2 is this package: code generation and project analysis.',
					'Its review and architecture tools are model-agnostic and call no model provider.'
				],
				links: [
					{ label: 'The runtime plane: generated and application MCP', href: '/tooling/app-mcp' },
					{
						label: 'The broader pattern: agent-legible applications',
						href: '/capabilities/agent-legible-applications'
					}
				]
			},
			{
				title: 'Inspect the complete declared workspace view',
				intro:
					'A coding agent can inspect project source, runtime manifests, knowledge artifacts, and installed package contracts through structured tools and resources. The results identify packages, objects, fields, relationships, generated interfaces, and authored documentation. Coverage and diagnostics state what the server did not find.',
				points: [
					'Source and manifest paths show where each declared object came from.',
					'Object results include fields, relationships, methods, interface settings, and package identity when the selected evidence contains them.',
					'Installed package entries include the package version and the hash of its version-matched AGENTS.md.',
					'Review and architecture bundles carry the same coverage and diagnostics as the underlying index.'
				],
				links: [
					{ label: 'Knowledge evidence and discovery order', href: '/tooling/knowledge' },
					{ label: 'Reference: generated interfaces', href: '/reference/interfaces' }
				]
			},
			{
				title: 'Runtime awareness is a separate, optional bridge',
				intro:
					'The released development server does not connect to a running application or inspect its live ObjectRegistry. A future or application-provided connection can expose bounded runtime capability metadata beside the declared workspace view. Callers must discover that bridge before they use it.',
				points: [
					'Without a runtime bridge, the server remains fully useful and deterministic from source, manifests, generated knowledge, and installed package contracts.',
					'A runtime bridge should label observed facts separately from declared facts and expose capability metadata rather than application records or credentials.',
					'Live data operations remain on the Tier 1 application MCP surface and still resolve through principals, tenants, and policy.'
				],
				links: [
					{
						label: 'Upstream: optional read-only runtime diagnostics',
						href: 'https://github.com/happyvertical/smrt/issues/1824'
					},
					{
						label: 'Upstream: live runtime development plane',
						href: 'https://github.com/happyvertical/smrt/issues/1831'
					}
				]
			},
			{
				title: 'Install it and point a client at the stdio server',
				intro:
					'The package publishes a smrt-dev-mcp binary. For a project-local client, declaring the stdio server in .mcp.json is enough; a compatible client launches it on demand.',
				filename: '.mcp.json',
				lang: 'json',
				code: `{
  "mcpServers": {
    "smrt-dev-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@happyvertical/smrt-dev-mcp"]
    }
  }
}`
			},
			{
				title: 'Prefer an absolute launcher in global configuration',
				intro:
					'A user-level MCP client can start servers from repositories that do not install this package. A package-manager launcher can run dependency or build-approval checks before the server starts. Install the package in a stable location. Point the client at the built server with an absolute path.',
				filename: 'config.toml',
				lang: 'toml',
				code: `[mcp_servers.smrt-dev-mcp]
command = "node"
args = ["/absolute/path/to/node_modules/@happyvertical/smrt-dev-mcp/dist/index.js"]`
			},
			{
				title: 'Fifteen tools in six groups',
				intro:
					'Tool names are stable strings. Generation and introspection cover the code. The knowledge tools mirror the CLI commands. The context builders return prompt bundles for any model.',
				points: [
					'Generation and introspection: generate-smrt-class, introspect-project, review-smrt-project.',
					'Knowledge reflection: reflect-knowledge, reflect-domain-knowledge.',
					'Freshness: check-knowledge-freshness, check-domain-knowledge.',
					'Review context: build-review-context, build-domain-review-context, smrt-review.',
					'Architecture context: build-architecture-context, build-domain-architecture-context, smrt-architecture.',
					'Bundled skills: list-agent-skills, get-agent-skill.'
				]
			},
			{
				title: 'Every tool declares the same result envelope',
				intro:
					'Each tool publishes an output schema requiring ok, coverage, diagnostics, and data, and returns that object as structured content beside the human-readable text result. data preserves the tool payload unchanged, while coverage and diagnostics are promoted only when the underlying result reports them. A failure returns ok false with an error-severity diagnostic rather than an empty success.',
				filename: 'tool-result.json',
				lang: 'json',
				code: `{
  "ok": true,
  "coverage": {
    "workspaceGlobs": ["packages/*", "apps/*"],
    "workspaceGlobSource": "pnpm-workspace.yaml",
    "packageDirs": ["packages/billing", "packages/ui"],
    "packagesWithObjects": ["@acme/billing (7, domain-artifact)"],
    "packagesWithoutObjects": [
      {
        "name": "@acme/ui",
        "reason": "no-smrt-objects-in-sources",
        "checkedPaths": [],
        "remedy": "No @smrt() classes were found in this package. Expected if it is a UI, contract, or tooling package."
      }
    ]
  },
  "diagnostics": [],
  "data": {}
}`
			},
			{
				title: 'Responses are budgeted, and the budget is honest',
				intro:
					'Knowledge and introspection tools return a summary by default and accept detail full for the complete payload. An introspection response that exceeds its character budget reports a truncated block naming the omitted count and how to filter, rather than being silently cut. Project metadata and diagnostics are always returned in full, because a diagnostic is how discovery reports that it found nothing.',
				points: [
					'maxChars overrides the introspection budget and applies to the objects payload.',
					'Summary architecture and review results list authored docs by path instead of embedding them.',
					'The equivalent CLI commands request full detail, so their output is unaffected.'
				]
			},
			{
				title: 'Catalogs are cached privately',
				intro:
					'The static tools and prompts catalogs advertise a one-day private cache lifetime. Workspace knowledge resources are also private, but they use a zero lifetime. The server rebuilds them from the current workspace for every request. The transport has no visible invalidation signal to support a longer lifetime.',
				links: [
					{ label: 'Shared catalogs on the runtime plane', href: '/tooling/app-mcp' },
					{ label: 'Cache and tenancy safety', href: '/tooling/compatibility' }
				]
			},
			{
				title: 'A downstream review workflow',
				intro:
					'The tools compose into a repeatable loop. Deterministic context comes first, the model reads the actual diff, and the checker runs again after the edits land.',
				points: [
					'Run the downstream build or dev server so the domain artifact exists.',
					'Call reflect-domain-knowledge to confirm package and SDK coverage.',
					'Call build-domain-review-context or smrt-review with the changed files, scope, and optional package.',
					'Send the returned prompt bundle to the model of your choice.',
					'Re-run check-domain-knowledge after the edits.'
				],
				links: [
					{ label: 'The commands behind these tools', href: '/tooling/knowledge' },
					{ label: 'Package reference', href: '/packages/smrt-dev-mcp' }
				]
			},
			{
				title: 'Resources, prompts, and the bundled skill',
				intro:
					'Besides tools, the server exposes the composed project knowledge and package-scoped knowledge as resources, and publishes review and architecture prompts. It also ships one harness-agnostic agent skill, smrt-code-review, which get-agent-skill returns as Markdown with YAML frontmatter that skill-unaware harnesses can ignore.',
				links: [{ label: 'How the skill is packaged', href: '/tooling/agent-plugin' }]
			}
		],
		related: [
			{ label: 'Agent-legible applications', href: '/capabilities/agent-legible-applications' },
			{ label: 'Knowledge tooling', href: '/tooling/knowledge' },
			{ label: 'Generated and app MCP', href: '/tooling/app-mcp' }
		]
	},
	{
		slug: 'app-mcp',
		navTitle: 'Generated and app MCP',
		eyebrow: 'Developer tooling',
		title: 'Runtime MCP surfaces for application agents',
		lede: 'Generated local MCP, hosted application MCP, and WebMCP use the same @smrt() model. They run at different boundaries and do not give an application agent the same identity or authority.',
		plainEnglish:
			'These surfaces let an application agent operate real data. Local stdio gets credentials from its environment. Hosted MCP resolves a principal per request. WebMCP uses the signed-in browser session.',
		packages: ['smrt-app-mcp', 'smrt-core', 'smrt-app-cli'],
		pinnedVersion: TOOLING_PINNED_VERSION,
		sources: [
			{ label: 'smrt-app-mcp README', href: `${SMRT_TREE}/packages/smrt-app-mcp/README.md` },
			{ label: 'smrt-app-mcp AGENTS.md', href: `${SMRT_TREE}/packages/smrt-app-mcp/AGENTS.md` },
			{
				label: 'Remote MCP authorization contract',
				href: `${SMRT_TREE}/docs/content/architecture/remote-mcp-authorization.md`
			}
		],
		sections: [
			{
				title: 'Describe the server once',
				intro:
					'createMcpAppServer wraps the generated core tools with an application allow-list and returns listTools and callTool. The allow-list determines which classes are reachable. Public tool patterns determine what an unauthenticated caller can see. The tool policy evaluates each principal. Workflow assertions run before generated dispatch.',
				filename: 'src/lib/server/mcp.ts',
				code: `import { createMcpAppServer, McpAccessError } from '@happyvertical/smrt-app-mcp';
import { adminResources } from '$lib/admin/resources';
import { getDbConfig } from './db';

export const mcpServer = createMcpAppServer({
  smrtOptions: () => ({ db: getDbConfig() }),
  serverInfo: { name: 'my-app', version: '0.1.0' },
  allowedClassNames: adminResources.map((r) => r.className),
  // Empty by default, so nothing is anonymous until an operator opts in.
  // Until a pattern is listed, no tool passes the base rule for a caller with
  // no principal, and the unauthenticated branch below is never reached.
  publicToolPatterns: () =>
    (process.env.MY_APP_PUBLIC_MCP_TOOLS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  toolPolicy: ({ tool, principal }) => {
    if (!principal) return tool.name === 'application_get';
    if (principal.kind === 'human') return principal.roles?.includes('admin') ?? false;
    return principal.kind === 'service' && principal.scopes?.includes('mcp:applications') === true;
  },
  workflowAssertions: {
    application_update: (args, user) => {
      if (!user?.id) throw new McpAccessError(401, 'sign in first');
      args.approvedByUserId = user.id;
    }
  }
});`
			},
			{
				title: 'Mount it as one route',
				intro:
					'mountMcpRoute is the modern, fetch-style Streamable HTTP endpoint. It serves server/discover, tools/list, and tools/call. The tools capability is always present; the optional tasks extension is advertised only when an allowed object enables a task action. Tool discovery is deterministically ordered by name.',
				filename: 'src/routes/api/mcp/+server.ts',
				code: `import { mountMcpRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const POST = mountMcpRoute(mcpServer);`,
				links: [{ label: 'Package reference', href: '/packages/smrt-app-mcp' }]
			},
			{
				title: 'Opt long-running actions into durable tasks',
				intro:
					'Long-running item actions can opt into the experimental io.modelcontextprotocol/tasks extension. Tasks are disabled by default. List each task action in the object’s MCP configuration. Align the jobs runner dispatch allowlist when the class uses backgroundEligible markers.',
				filename: 'Report.ts',
				code: `import { backgroundEligible } from '@happyvertical/smrt-jobs';

@smrt({
  mcp: { include: ['generateReport'], tasks: ['generateReport'] }
})
class Report extends SmrtObject {
  @backgroundEligible()
  async generateReport() {
    return buildReport(this.id);
  }
}`,
				points: [
					'Task-aware clients use tasks/get, tasks/update, and tasks/cancel to observe or control the durable job.',
					'An application deployment must run a TaskRunner for the mcp-tasks queue; generated stdio servers start that worker automatically.',
					'Task lifecycle calls require a stable authenticated principal id, plus tenantId for tenant-scoped objects.',
					'backgroundEligible is restrictive once the first method is marked, so mark every method the TaskRunner may dispatch.'
				]
			},
			{
				title: 'Stateless by construction',
				intro:
					'The route builds a fresh protocol server for every HTTP request. It does not issue or depend on a session id, sticky load-balancer routing, or a held event stream, so it runs behind ordinary round-robin deployment. The mount exposes no subscription capability, and subscription requests are refused as a JSON-RPC error before any stream opens.',
				points: [
					'Persist multi-step workflow progress in application objects.',
					'Pass the explicit object id back into the next tool call.',
					'Neither MCP sessions nor request principal state are held between nodes.'
				]
			},
			{
				title: 'Request metadata is validated, not trusted',
				intro:
					'Stock MCP clients send a required Mcp-Method header, and Mcp-Name for a tool call. The mount validates them against the JSON-RPC body and returns the protocol HeaderMismatch error, code -32020 with HTTP 400, for a missing or mismatched header. Header presence is not authentication.',
				links: [{ label: 'Protocol and conformance detail', href: '/tooling/compatibility' }]
			},
			{
				title: 'Policy runs on discovery and on the call',
				intro:
					'The tool policy evaluates every tool that passes the allow-list and the base public or authenticated rule. The policy runs during discovery and direct calls. Returning false hides the tool from discovery and denies a direct call with the non-retryable mcp_tool_access_denied code. A thrown policy error is treated as a denial, so policy failures fail closed.',
				points: [
					'On the modern mount the denial arrives as a JSON-RPC protocol error carrying the code and a retryable flag in its data.',
					'The deprecated REST aliases instead return the older ok, code, message, status, and retryable body.',
					'Neither shape includes tool, principal, scope, or policy-error detail.',
					'A tool outside the application allow-list receives the safe not-found behavior.',
					'Unauthenticated callers see only the tools selected by public tool patterns.'
				]
			},
			{
				title: 'Identity comes from the application',
				intro:
					'SvelteKit mounts resolve the request principal once and use it for both discovery and calls. McpAppPrincipal has optional id, kind, roles, and scopes fields. This flexible shape represents a person or scoped service without encoding the application identity model. A missing principal means the request is unauthenticated.',
				points: [
					'resolvePrincipal is the current hook for applications that store the principal elsewhere.',
					'resolveUser remains as a legacy compatibility alias.',
					'resolveAuthenticated is a deprecated legacy boolean gate, consulted only when resolvePrincipal is absent. Only a false result clears the principal. An older mount that returns true keeps its calls without a user. Discovery then uses the old boolean behavior. Migrate the mount to resolvePrincipal.'
				]
			},
			{
				title: 'Catalog caching is private until proven shareable',
				intro:
					'tools/list emits the required cache metadata with a one-day private default. Shared caching is intentionally exceptional: a public catalog must be a reviewed set where every allowed tool is unauthenticated, read-only, and global. The server verifies that shape, including the absence of tenant-scoped tools and principal-aware policy, and falls back to private otherwise.',
				filename: 'public-catalog.ts',
				code: `// Only for a reviewed catalog with no tenant-scoped or principal-gated tools.
toolListCache: { cacheScope: 'public', publicCatalog: true }`
			},
			{
				title: 'Authorization is terminated in front of the route',
				intro:
					'This package trusts the principal supplied by the application adapter. It does not implement an OAuth authorization server and does not validate bearer tokens itself. For a public deployment, terminate OAuth at the gateway. Validate the token signature, issuer, audience or resource, expiry, and scopes. Populate the request principal, tenant, and permissions only after validation succeeds.',
				points: [
					'Use one stable HTTPS issuer identifier per authorization server.',
					'Issuer values are compared as exact strings; a trailing-slash difference aborts the grant.',
					'Prefer a pre-registered client, then a Client ID Metadata Document, then dynamic registration.',
					'Keep public tool patterns empty unless anonymous read access is deliberate.',
					'Preserve tenant isolation and the allow-list for every invocation.'
				]
			},
			{
				title: 'Generated stdio stays local',
				intro:
					'The generated stdio server is the other Tier 1 surface. It obtains credentials from its environment and has no per-request authorization principal, so it must not be exposed remotely. Use the smrt-mcp-bridge binary to reach a deployed application from a local stdio client. @happyvertical/smrt-app-cli publishes this bridge. It authenticates through the first-party terminal device flow. The bridge sends stored tokens only to their associated server.',
				links: [
					{
						label: 'Task guide: expose your app over MCP',
						href: '/guides/expose-your-app-over-mcp'
					},
					{ label: 'Reference: generated interfaces', href: '/reference/interfaces' },
					{ label: 'Capability: WebMCP in the browser', href: '/capabilities/webmcp' }
				]
			},
			{
				title: 'WebMCP stays in the browser session',
				intro:
					'WebMCP is not the local stdio server and it is not the hosted application MCP route. The page registers selected tool descriptions in a compatible browser. Tool execution uses the generated REST client as the signed-in page user. Existing authentication, tenant, permission, writable-field, and field-policy checks stay in the request path.',
				points: [
					'The browser page selects which generated tool descriptions it registers.',
					'The page session supplies the application identity. WebMCP does not introduce a coding-agent identity.',
					'The browser surface does not give the Development MCP server access to application data.',
					'Use hosted application MCP when a remote agent runs outside the browser session.'
				],
				links: [
					{ label: 'WebMCP capability', href: '/capabilities/webmcp' },
					{ label: 'Reference: generated interfaces', href: '/reference/interfaces' },
					{ label: 'Reference: security defaults', href: '/reference/security' }
				]
			}
		],
		related: [
			{ label: 'Expose an application over MCP', href: '/guides/expose-your-app-over-mcp' },
			{ label: 'Generated interfaces reference', href: '/reference/interfaces' },
			{ label: 'Security reference', href: '/reference/security' },
			{ label: 'Development MCP', href: '/tooling/dev-mcp' }
		]
	},
	{
		slug: 'agent-plugin',
		navTitle: 'Agent Plugin packaging',
		eyebrow: 'Developer tooling',
		title: 'The development server ships as an Agent Plugin',
		lede: 'Agent Plugin is the precise name for the portable coding-agent integration package at the smrt-dev-mcp package root. A compatible client can discover it without hand-written MCP configuration.',
		plainEnglish:
			'A compatible coding-agent client can read two small manifests instead of a configuration file. The manifests identify the local server launcher and the bundled skill location.',
		packages: ['smrt-dev-mcp'],
		pinnedVersion: TOOLING_PINNED_VERSION,
		sources: [
			{ label: 'smrt-dev-mcp README', href: `${SMRT_TREE}/packages/smrt-dev-mcp/README.md` },
			{ label: 'smrt-dev-mcp AGENTS.md', href: `${SMRT_TREE}/packages/smrt-dev-mcp/AGENTS.md` }
		],
		sections: [
			{
				title: 'Two manifests at the package root',
				intro:
					'plugin.json identifies the plugin against the canonical 1.0.0 schema. mcp.json declares how to launch it. Both are published in the package files list, so they are present in the installed package rather than only in the source repository.',
				filename: 'plugin.json',
				lang: 'json',
				code: `{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "smrt-dev-mcp",
  "description": "Development MCP server and SMRT code-review skill."
}`
			},
			{
				title: 'The declared server is local and plugin-relative',
				intro:
					'mcp.json declares one stdio server whose command stays inside the resolved plugin root. The executable path must remain contained after resolution.',
				filename: 'mcp.json',
				lang: 'json',
				code: `{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "smrt-dev-mcp": {
      "type": "stdio",
      "command": "./dist/index.js"
    }
  }
}`
			},
			{
				title: 'Skills are found by location, not by declaration',
				intro:
					'plugin.json carries no skills field. Bundled skills live under the fixed skills directory for Agent Plugins discovery. The package ships skills/smrt-code-review/SKILL.md and its referenced output guide. Each skill is plain Markdown with YAML frontmatter naming and describing it. A skill-unaware harness can ignore the frontmatter and read the body.',
				points: [
					'Skill-aware clients discover the file directly from the installed package root.',
					'Other MCP clients can reach the same content through the get-agent-skill tool.',
					'It is also published as a prompt and as a resource for native MCP clients.'
				],
				links: [{ label: 'Calling it as a tool', href: '/tooling/dev-mcp' }]
			},
			{
				title: 'Schemas are pinned for offline validation',
				intro:
					'The package ships byte-for-byte snapshots of the 1.0.0 plugin and mcp schemas under a versioned schemas directory, with their recorded digests. Clients validate against those local copies; loading a plugin must not fetch a schema over the network.',
				points: [
					'The manifests stay pinned to the canonical 1.0.0 schema identifiers.',
					'Agent Plugins 1.0.0 is a Working Draft, and this package targets only that revision.'
				]
			},
			{
				title: 'Credentials stay with the client',
				intro:
					'Portable configuration contains no credentials, secrets, authorization headers, or OAuth settings. The client provides the reserved plugin root and persistent plugin data directories; the package neither sets nor overrides them. Clients own authorization interaction and credential storage.',
				points: [
					'Do not add secret-bearing environment variables or headers to portable configuration.',
					'The plugin declares no HTTP transport; only the local stdio server is shipped.'
				]
			},
			{
				title: 'How this relates to direct MCP configuration',
				intro:
					'Packaging is a distribution convenience, not a different server. Manifest-based and manually configured clients launch the same stdio binary. Both clients receive the same tools, prompts, and resources. Use direct configuration when your client does not support Agent Plugins or needs an absolute launcher path.',
				links: [{ label: 'Direct stdio configuration', href: '/tooling/dev-mcp' }]
			}
		],
		related: [
			{ label: 'Development MCP', href: '/tooling/dev-mcp' },
			{ label: 'Knowledge tooling', href: '/tooling/knowledge' },
			{ label: 'Compatibility and operations', href: '/tooling/compatibility' }
		]
	},
	{
		slug: 'compatibility',
		navTitle: 'Compatibility and operations',
		eyebrow: 'Developer tooling',
		title: 'Protocol support, conformance, and troubleshooting',
		lede: 'The MCP surfaces target the 2026-07-28 protocol revision through an exactly pinned scoped SDK. They keep a bounded set of compatibility aliases. Continuous integration runs conformance checks.',
		plainEnglish:
			'This page records the framework promises for protocol behavior and migration compatibility. It also lists the first checks for an unresponsive server.',
		packages: ['smrt-app-mcp', 'smrt-dev-mcp', 'smrt-core'],
		pinnedVersion: TOOLING_PINNED_VERSION,
		sources: [
			{ label: 'smrt-app-mcp README', href: `${SMRT_TREE}/packages/smrt-app-mcp/README.md` },
			{ label: 'smrt-dev-mcp README', href: `${SMRT_TREE}/packages/smrt-dev-mcp/README.md` },
			{
				label: 'Remote MCP authorization contract',
				href: `${SMRT_TREE}/docs/content/architecture/remote-mcp-authorization.md`
			}
		],
		sections: [
			{
				title: 'One protocol revision, one pinned SDK',
				intro:
					'Both MCP packages depend on @modelcontextprotocol/server at exactly 2.0.0, with no range. That SDK owns and enforces the 2026-07-28 revision. The framework does not declare the revision as a constant. The exact pin provides one known source for the protocol envelope, header validation, and error codes.',
				points: [
					'The application HTTP mount serves the 2026-07-28 envelope, always reports tools, and advertises the optional tasks extension only when configured.',
					'Client-side pins in the framework test suites request the same revision explicitly.',
					'The scoped client and node packages are pinned to 2.0.0 as well.'
				]
			},
			{
				title: 'What conformance covers',
				intro:
					'Continuous integration runs a generated server against the pinned conformance suite. Every pull request also runs a protocol hygiene check. The suite tests version negotiation against the pinned revision and rejects unsupported client revisions.',
				points: [
					'Conformance tooling is pinned exactly, like the SDK itself.',
					'Header validation and the mismatch error are covered by transport tests.',
					'Deterministic tool ordering is part of the expected discovery output.'
				]
			},
			{
				title: 'Compatibility that is deliberate and bounded',
				intro:
					'A small number of older shapes remain available so applications can migrate without a coordinated cutover. Each is documented as deprecated, and none of them is a second supported transport.',
				points: [
					'mountMcpToolsRoute and mountMcpCallRoute are REST-shaped aliases retained for one release.',
					'They are not an MCP transport; new work should mount the single modern route.',
					'resolveUser and resolveAuthenticated remain as legacy identity hooks.',
					'The modern mount rejects legacy protocol handling rather than negotiating down.',
					'Development tools return structured content beside the original text payload, so text-only clients keep working.'
				],
				links: [{ label: 'The current mount', href: '/tooling/app-mcp' }]
			},
			{
				title: 'Optional capabilities stay explicit',
				intro:
					'Durable MCP tasks are available as an experimental, opt-in extension. Their capability is absent unless an allowed object declares at least one task action, so an ordinary tools-only client sees the same surface as before.',
				points: [
					'Task lifecycle state lives in the jobs runtime rather than an MCP transport session.',
					'Application deployments must run the mcp-tasks worker and provide a stable principal identity for lifecycle operations.',
					'The development plugin declares no streamable HTTP transport in this release.'
				]
			},
			{
				title: 'Local troubleshooting starts with the transport',
				intro:
					'A stdio MCP server speaks JSON-RPC on stdout, so anything else written there corrupts the channel. Do not call framework code that writes SDK logger progress from a tool path. Suppressing console output does not fix the problem. Write diagnostic logs to stderr.',
				points: [
					'Set DEBUG to true in the server environment to enable diagnostic logging.',
					'A client that fails immediately after launch is usually launching the wrong path or the wrong Node runtime.',
					'A package-manager launcher can emit its own output before the server starts; prefer an absolute launcher.'
				]
			},
			{
				title: 'Remote failures are usually authorization, not protocol',
				intro:
					'On the HTTP surface, a rejected call is far more often an identity problem than a protocol one. A -32020 response means a required header was missing or disagreed with the body. A denial carries the non-retryable access-denied code. The denial reveals nothing about the tool, principal, or policy. Find the details in your gateway logs.',
				points: [
					'Confirm the gateway validated the token before the request reached the route.',
					'Compare the response issuer and the discovered issuer as exact strings.',
					'A token minted for another issuer, audience, or resource must not dispatch.',
					'An empty discovery result usually means policy hid the tools rather than that none exist.'
				]
			},
			{
				title: 'Keep deployment and authorization boundaries explicit',
				intro:
					'Each surface has one supported deployment boundary. Development MCP and the Agent Plugin run locally for a coding-agent client. Generated stdio runs locally beside the application. Hosted application MCP runs behind a gateway that terminates authorization. WebMCP runs in the signed-in browser session.',
				points: [
					'Do not expose Development MCP or generated stdio as a remote server.',
					'The hosted route trusts the principal that the application adapter supplies. It does not validate bearer tokens.',
					'The gateway must validate the token before it creates the request principal.',
					'WebMCP sends operations through the generated REST boundary as the signed-in page user.',
					'The Agent Plugin manifest contains no credentials or remote transport settings.'
				],
				links: [
					{ label: 'Runtime MCP surfaces', href: '/tooling/app-mcp' },
					{ label: 'Agent Plugin credential boundary', href: '/tooling/agent-plugin' },
					{ label: 'Reference: security defaults', href: '/reference/security' }
				]
			},
			{
				title: 'Cache and tenancy safety',
				intro:
					'Catalogs are private by default on both planes. A shared catalog requires explicit opt-in. The server re-verifies the declared shape and downgrades invalid catalogs. This check prevents tenant-scoped or principal-gated tools from entering a shared cache. Workspace knowledge resources use a zero cache lifetime because the server rebuilds them per request. They carry no reliable invalidation signal.',
				points: [
					'Tenant interceptors and field policy stay in the path for every generated operation.',
					'Never expose the generated stdio server remotely; it has no per-request principal.',
					'Keep issuer metadata, client documents, and gateway policy in deployment source control.'
				],
				links: [
					{ label: 'Reference: security defaults', href: '/reference/security' },
					{ label: 'Runtime plane detail', href: '/tooling/app-mcp' }
				]
			}
		],
		related: [
			{ label: 'Runtime MCP surfaces', href: '/tooling/app-mcp' },
			{ label: 'Development MCP', href: '/tooling/dev-mcp' },
			{ label: 'Security reference', href: '/reference/security' },
			{ label: 'Application MCP guide', href: '/guides/expose-your-app-over-mcp' }
		]
	}
];

export function getToolingGuide(slug: string): Guide | undefined {
	return toolingGuides.find((guide) => guide.slug === slug);
}
