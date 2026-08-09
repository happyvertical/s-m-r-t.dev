import type { Guide } from '$lib/data/guides';

/**
 * Released s-m-r-t version every claim in this section was verified against.
 * When this moves, re-read the canonical sources listed on each page.
 */
export const TOOLING_PINNED_VERSION = '0.40.61';

const SMRT_TREE = 'https://github.com/happyvertical/smrt/blob/v0.40.61';

export const toolingGuides: Guide[] = [
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
					'--scope and --package are shared by all five commands. --scope defaults to project and accepts project, local, package, or sdk. The remaining options belong to specific commands, so a flag copied between them will not always apply.',
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
					'Package discovery reads the workspace globs rather than assuming a packages directory, so apps are indexed the same way packages are. Resolution runs in a fixed order: the packages list in pnpm-workspace.yaml, then workspaces in package.json, then packages/* as a last-resort fallback. Within each package, objects resolve from a domain artifact, then a package-local manifest, then a source scan, and the winner is recorded as objectSource with a reason.',
				points: [
					'objectSource is one of domain-artifact, manifest, scanner, or none.',
					'The workspace root is indexed when it has a package.json, with member directories excluded.',
					'Manifest objects belonging to another package are rejected rather than counted.',
					'Scanner-provenance packages carry no column type, so some schema facts are absent by design.'
				]
			},
			{
				title: 'Coverage and diagnostics instead of a silent empty answer',
				intro:
					'The index carries a coverage block and a diagnostics block at schemaVersion 2. Coverage names the workspace globs, where they were read from, the package directories found, and which packages have or lack objects with a reason and a remedy. Discovering zero objects is an error-grade diagnostic that names the roots and artifact paths checked, so an unreadable project is never reported as a project with no model.',
				points: [
					'Coverage and diagnostics are computed before scope filtering, because they describe discovery itself.',
					'Diagnostics propagate into the architecture, review, and reflection results.',
					'A response budget never trims diagnostics; only the objects payload is budgeted.'
				]
			},
			{
				title: 'Authored documentation is part of the contract',
				intro:
					'AGENTS.md chains are additive: a package carries its own instructions and an agent loads the chain it sits in. A package nested inside another workspace package deliberately carries no AGENTS.md or CLAUDE.md, because the agent would otherwise load the parent file and the child file together; that expertise belongs in the parent linked module docs instead.',
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
				title: 'When output looks stale',
				intro:
					'Stale output almost always means the artifact behind it is stale or was never built. Run the downstream build or dev server so the domain artifact exists, then re-run the checker. Because the checks are deterministic, the same workspace produces the same result, which makes a changed answer meaningful.',
				points: [
					'Run the app build first so .smrt/smrt-knowledge.json exists.',
					'Re-run smrt knowledge:check --strict after editing package docs.',
					'A wrong package set usually means the workspace globs resolved from an unexpected source; coverage reports which one.',
					'Very large or deeply nested workspaces can exhaust the traversal budget, which fails with a diagnostic instead of returning a partial package set.'
				]
			},
			{
				title: 'The same knowledge, two response sizes',
				intro:
					'CLI callers request the full detail level, so command output embeds authored documents and complete package records. MCP callers receive the budgeted summary by default and can opt into detail full. The underlying knowledge is identical; only the projection differs.',
				links: [{ label: 'Using it from an agent: smrt-dev-mcp', href: '/tooling/dev-mcp' }]
			}
		]
	},
	{
		slug: 'dev-mcp',
		navTitle: 'smrt-dev-mcp',
		eyebrow: 'Developer tooling',
		title: 'The development MCP server',
		lede: '@happyvertical/smrt-dev-mcp gives a coding agent the same deterministic workspace knowledge the CLI produces, plus class generation, project introspection, and portable review and architecture bundles.',
		plainEnglish:
			'This server helps an agent understand and change your codebase. It never touches your running application, its data, or your users.',
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
					{ label: 'The runtime plane: generated and application MCP', href: '/tooling/app-mcp' }
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
					'A user-level MCP client can start servers from repositories that do not install this package, and a package-manager launcher may run dependency-status or build-approval checks before the server starts. Install the package somewhere stable and point the client at the built server with an absolute path instead.',
				filename: 'config.toml',
				lang: 'toml',
				code: `[mcp_servers.smrt-dev-mcp]
command = "node"
args = ["/absolute/path/to/node_modules/@happyvertical/smrt-dev-mcp/dist/index.js"]`
			},
			{
				title: 'Fifteen tools in six groups',
				intro:
					'Tool names are stable strings. Generation and introspection cover the code itself; the knowledge tools mirror the CLI commands; the context builders return prompt bundles that can be sent to any model.',
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
					'The static tools and prompts catalogs advertise a one-day private cache lifetime. Workspace knowledge resources are also private but use a zero lifetime: they are rebuilt from the current workspace on every request and have no transport-visible invalidation signal that could make a longer promise honest.',
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
		]
	},
	{
		slug: 'app-mcp',
		navTitle: 'Generated and app MCP',
		eyebrow: 'Developer tooling',
		title: 'Exposing a running application over MCP',
		lede: 'The Tier 1 runtime surfaces are generated from the same @smrt() objects your application already uses, and served either over local stdio or as a stateless Streamable HTTP endpoint.',
		plainEnglish:
			'This is the plane where an agent performs real work on real data. Every call resolves through the same models, principals, tenants, and field policy as the rest of the application.',
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
					'createMcpAppServer wraps the generated core tools with an application allow-list and returns listTools and callTool. The allow-list decides which classes are reachable at all; public tool patterns decide what an unauthenticated caller may see; the tool policy decides per principal; workflow assertions run before generated dispatch.',
				filename: 'src/lib/server/mcp.ts',
				code: `import { createMcpAppServer, McpAccessError } from '@happyvertical/smrt-app-mcp';
import { adminResources } from '$lib/admin/resources';
import { getDbConfig } from './db';

export const mcpServer = createMcpAppServer({
  smrtOptions: () => ({ db: getDbConfig() }),
  serverInfo: { name: 'my-app', version: '0.1.0' },
  allowedClassNames: adminResources.map((r) => r.className),
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
					'mountMcpRoute is the modern, fetch-style Streamable HTTP endpoint. It serves server/discover, tools/list, and tools/call, and reports only the tools capability. Tool discovery is deterministically ordered by name.',
				filename: 'src/routes/api/mcp/+server.ts',
				code: `import { mountMcpRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const POST = mountMcpRoute(mcpServer);`,
				links: [{ label: 'Package reference', href: '/packages/smrt-app-mcp' }]
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
					'The tool policy is evaluated for every tool eligible under the allow-list and the base public or authenticated rule, on both discovery and a direct call. Returning false hides the tool from discovery and denies a direct call with the non-retryable mcp_tool_access_denied code. A thrown policy error is treated as a denial, so policy failures fail closed.',
				points: [
					'The failure envelope carries ok false, code, message, status, and retryable.',
					'It never includes tool, principal, scope, or policy-error detail.',
					'A tool outside the application allow-list receives the safe not-found behavior.',
					'Unauthenticated callers see only the tools selected by public tool patterns.'
				]
			},
			{
				title: 'Identity comes from the application',
				intro:
					'SvelteKit mounts resolve the request principal once and use it for both discovery and calls. McpAppPrincipal is deliberately unconstrained — an optional id, kind, roles, and scopes — so an application can represent a person or a scoped service without this package encoding its identity model. A missing principal means the request is unauthenticated.',
				points: [
					'resolvePrincipal is the current hook for applications that store the principal elsewhere.',
					'resolveUser remains as a legacy compatibility alias.',
					'resolveAuthenticated is a deprecated legacy gate and leaves the route principal unauthenticated.'
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
					'This package trusts the principal supplied by the application adapter. It does not implement an OAuth authorization server and does not validate bearer tokens itself. For a public deployment, terminate OAuth at the gateway, validate the token signature, issuer, audience or resource, expiry, and scopes, and populate the request principal, tenant, and permissions only after that validation succeeds.',
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
					'The generated stdio server is the other Tier 1 surface. It obtains credentials from its environment and has no per-request authorization principal, so it must not be exposed remotely. To reach a deployed application from a local stdio client, use the bridge that @happyvertical/smrt-app-cli publishes as the smrt-mcp-bridge binary, which authenticates through the first-party terminal device flow and sends stored tokens only to the server they were saved with.',
				links: [
					{
						label: 'Tutorial: expose an app via MCP (#98)',
						href: 'https://github.com/happyvertical/s-m-r-t.dev/issues/98',
						external: true
					},
					{ label: 'Reference: generated interfaces', href: '/reference/interfaces' },
					{ label: 'Capability: WebMCP in the browser', href: '/capabilities/webmcp' }
				]
			}
		]
	},
	{
		slug: 'agent-plugin',
		navTitle: 'Agent Plugin packaging',
		eyebrow: 'Developer tooling',
		title: 'The dev server ships as a portable plugin',
		lede: 'The published smrt-dev-mcp package root is a self-contained Agent Plugins 1.0.0 plugin, so a compatible client can install and discover it without hand-written MCP configuration.',
		plainEnglish:
			'Instead of writing a config file, a compatible client reads two small manifests from the installed package and learns how to launch the server and where the bundled skill lives.',
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
					'plugin.json carries no skills field. Bundled skills live under the fixed skills directory, which is the Agent Plugins discovery location, and the package ships exactly one: skills/smrt-code-review/SKILL.md with its referenced output guide. Each skill is plain Markdown with YAML frontmatter naming and describing it, so a skill-unaware harness can ignore the frontmatter and read the body.',
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
					'Packaging is a distribution convenience, not a different server. A client that reads the plugin manifests and a client configured by hand launch the same stdio binary and receive the same tools, prompts, and resources. Use direct configuration when your client does not support Agent Plugins, or when you need an absolute launcher path.',
				links: [{ label: 'Direct stdio configuration', href: '/tooling/dev-mcp' }]
			}
		]
	},
	{
		slug: 'compatibility',
		navTitle: 'Compatibility and operations',
		eyebrow: 'Developer tooling',
		title: 'Protocol support, conformance, and troubleshooting',
		lede: 'The MCP surfaces target the 2026-07-28 protocol revision through an exactly pinned scoped SDK, keep a bounded set of compatibility aliases, and are exercised by conformance checks in continuous integration.',
		plainEnglish:
			'This page records what the framework promises about protocol behavior, what it keeps only for migration, and what to check first when a server does not respond as expected.',
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
					'Both MCP packages depend on @modelcontextprotocol/server at exactly 2.0.0, with no range. The 2026-07-28 revision itself is owned and enforced by that SDK rather than declared as a framework constant, which is why the pin is exact: the protocol envelope, header validation, and error codes come from one known version.',
				points: [
					'The application HTTP mount serves the 2026-07-28 envelope and reports only the tools capability.',
					'Client-side pins in the framework test suites request the same revision explicitly.',
					'The scoped client and node packages are pinned to 2.0.0 as well.'
				]
			},
			{
				title: 'What conformance covers',
				intro:
					'The framework keeps a conformance fixture that runs a generated server against the pinned conformance suite in continuous integration, alongside a protocol hygiene check on every pull request. The suite exercises version negotiation against the pinned revision rather than accepting whatever a client offers.',
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
				title: 'Not part of this release',
				intro:
					'Durable MCP tasks backed by the jobs runtime, and field-policy usage learning, landed after the 0.40.61 release cut and are not present in the version this section documents. Treat them as unreleased until a published version contains them, and do not configure a client against them.',
				points: [
					'No task lifecycle, ownership, or resumption behavior is available in 0.40.61.',
					'The development plugin declares no streamable HTTP transport in this release.'
				]
			},
			{
				title: 'Local troubleshooting starts with the transport',
				intro:
					'A stdio MCP server speaks JSON-RPC on stdout, so anything else written there corrupts the channel. Framework code that writes progress lines through the SDK logger is therefore never called from a tool path, and suppressing console output is not a sufficient fix. Diagnostic logging belongs on stderr.',
				points: [
					'Set DEBUG to true in the server environment to enable diagnostic logging.',
					'A client that fails immediately after launch is usually launching the wrong path or the wrong Node runtime.',
					'A package-manager launcher can emit its own output before the server starts; prefer an absolute launcher.'
				]
			},
			{
				title: 'Remote failures are usually authorization, not protocol',
				intro:
					'On the HTTP surface, a rejected call is far more often an identity problem than a protocol one. A -32020 response means a required header was missing or disagreed with the body. A denial carries the non-retryable access-denied code and deliberately reveals nothing about the tool, principal, or policy, so the detail must come from your gateway logs.',
				points: [
					'Confirm the gateway validated the token before the request reached the route.',
					'Compare the response issuer and the discovered issuer as exact strings.',
					'A token minted for another issuer, audience, or resource must not dispatch.',
					'An empty discovery result usually means policy hid the tools rather than that none exist.'
				]
			},
			{
				title: 'Cache and tenancy safety',
				intro:
					'Catalogs are private by default on both planes. A shared catalog is an explicit opt-in that the server re-verifies and downgrades when the declared shape does not hold, so a tenant-scoped or principal-gated tool cannot end up in a shared cache. Workspace knowledge resources use a zero cache lifetime because they are rebuilt per request and carry no honest invalidation signal.',
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
		]
	}
];

export function getToolingGuide(slug: string): Guide | undefined {
	return toolingGuides.find((guide) => guide.slug === slug);
}
