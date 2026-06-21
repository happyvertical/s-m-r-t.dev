<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const installCode = `pnpm add @happyvertical/smrt-app-mcp`;

	const serverCode = `// src/lib/server/mcp.ts
import { createMcpAppServer, McpAccessError } from '@happyvertical/smrt-app-mcp';
import { adminResources } from '$lib/admin/resources';
import { getDbConfig } from './db';

export const mcpServer = createMcpAppServer({
  // SMRT context bag (db, etc.), resolved lazily per call.
  smrtOptions: () => ({ db: getDbConfig() }),
  serverInfo: { name: 'my-app', version: '0.1.0' },
  // Only publish a subset of your @smrt() classes, not everything.
  allowedClassNames: adminResources.map((r) => r.className),
  // Read-only tools unauthenticated callers may use (default: none).
  publicToolPatterns: () =>
    (process.env.MY_APP_PUBLIC_MCP_TOOLS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  // Per-tool guards. Throw McpAccessError to reject; mutate args to
  // inject server-trusted fields.
  workflowAssertions: {
    application_update: (args, user) => {
      if (!user?.id) throw new McpAccessError(401, 'sign in first');
      args.approvedByUserId = user.id;
    },
  },
});`;

	const toolsRouteCode = `// src/routes/api/mcp/tools/+server.ts
import { mountMcpToolsRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const GET = mountMcpToolsRoute(mcpServer);`;

	const callRouteCode = `// src/routes/api/mcp/call/+server.ts
import { mountMcpCallRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const POST = mountMcpCallRoute(mcpServer);`;

	const callShapeCode = `// GET /api/mcp/tools        -> { tools: MCPTool[] }
// POST /api/mcp/call        body: { name, arguments }
//
// Authenticated callers see every allow-listed tool; anonymous callers
// see only read-only tools matching publicToolPatterns. A call to a
// non-public tool without a user throws McpAccessError(401).
fetch('/api/mcp/call', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    name: 'application_list',
    arguments: { limit: 20 },
  }),
});`;
</script>

<ModulePage
	name="smrt-app-mcp"
	description="App-runtime MCP server scaffolding — expose your deployed SMRT app's Tier 1 runtime MCP surface (live CRUD / list / AI tools) over HTTP, then drive it from an MCP client."
	badges={['MCP', 'Tier 1 Runtime', 'App Server']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-app-mcp</strong> wraps the <strong>Tier 1 (Runtime)</strong> MCP
			surface that <a href="/modules/smrt-core">smrt-core</a> generates from your
			<code>@smrt()</code> classes and exposes it over HTTP from your deployed application. Where the
			Tier 1 tools themselves (one
			<code>&lt;class&gt;_list</code> / <code>&lt;class&gt;_get</code> / <code>&lt;class&gt;_create</code>
			/ ... per object) come from <code>MCPGenerator</code>, this package decides
			<em>which</em> of them an app publishes, who may call them, and what server-trusted fields get injected
			on the way through.
		</p>
		<p>It provides two things:</p>
		<ul>
			<li>
				<strong>Core</strong> — <code>createMcpAppServer(...)</code> returns a framework-agnostic
				<code>{'{ listTools, callTool }'}</code> server bound to your database and an allow-list of
				class names.
			</li>
			<li>
				<strong>SvelteKit adapters</strong> (<code>./sveltekit</code>) —
				<code>mountMcpToolsRoute</code> / <code>mountMcpCallRoute</code> turn that server into the
				GET/POST handlers a SvelteKit <code>+server.ts</code> expects. The core is deliberately
				transport-neutral, so additional adapters (standalone Node HTTP, serverless, Express/Hono)
				can be added as sibling subpaths without touching it.
			</li>
		</ul>
		<Callout variant="note" title="Runtime MCP vs. dev MCP">
			This is the <strong>runtime</strong> MCP server — live operations against your app's data. It is
			distinct from <a href="/modules/smrt-dev-mcp">smrt-dev-mcp</a>, the read-only
			<strong>Tier 2</strong> development server (class generation, project introspection) you wire
			into an editor assistant. An app typically ships this one in production and uses dev-mcp at
			build time.
		</Callout>
	</section>

	<section>
		<h2>Talk to your app from an MCP client</h2>
		<p>
			Once the two routes below are live, your deployed app speaks MCP over HTTP at
			<code>/api/mcp/tools</code> and <code>/api/mcp/call</code>. Point any MCP client that can reach
			those endpoints at them — for example a desktop assistant via a stdio-to-HTTP bridge — and it
			can list and invoke your app's published tools (subject to the same auth your routes enforce).
		</p>
		<Callout variant="note" title="Client-side bridge">
			Most desktop MCP clients speak <strong>stdio</strong>, not HTTP. The client-side counterpart
			that bridges a local stdio MCP client to a deployed app's HTTP MCP endpoints is tracked as
			<code>@happyvertical/smrt-app-cli</code>; this package owns the <em>server</em> half
			(the HTTP surface). Until the bridge ships, the endpoints are usable directly by any
			HTTP-capable MCP caller.
		</Callout>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={installCode} lang="bash" />
	</section>

	<section>
		<h2>Define the server</h2>
		<p>
			<code>createMcpAppServer</code> binds the generator to your database, an allow-list of class
			names, a public-tool policy, and optional per-tool workflow assertions:
		</p>
		<CodeBlock code={serverCode} lang="typescript" filename="src/lib/server/mcp.ts" />
		<h3>Options</h3>
		<table>
			<thead>
				<tr>
					<th>Option</th>
					<th>Type</th>
					<th>Required</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>smrtOptions</code></td>
					<td><code>() =&gt; Record&lt;string, unknown&gt;</code></td>
					<td>Yes</td>
					<td>
						Thunk returning the SMRT context bag (<code>db</code>, etc.) passed to the generator per
						call. A function so env vars resolve lazily at call time.
					</td>
				</tr>
				<tr>
					<td><code>serverInfo</code></td>
					<td><code>{'{ name, version, description? }'}</code></td>
					<td>Yes</td>
					<td>Server identity surfaced in the MCP protocol.</td>
				</tr>
				<tr>
					<td><code>allowedClassNames</code></td>
					<td><code>readonly string[]</code></td>
					<td>Yes</td>
					<td>
						SMRT class names the app publishes. Tools whose name does not start with one of these
						classes (lowercased + <code>_</code>) are filtered out, even if SMRT generated them.
					</td>
				</tr>
				<tr>
					<td><code>publicToolPatterns</code></td>
					<td><code>() =&gt; readonly string[]</code></td>
					<td>No</td>
					<td>
						Thunk of glob-ish patterns (<code>*</code> wildcards) for read-only tools anonymous
						callers may use. Defaults to empty — everything requires auth.
					</td>
				</tr>
				<tr>
					<td><code>workflowAssertions</code></td>
					<td><code>Record&lt;string, McpWorkflowAssertion&gt;</code></td>
					<td>No</td>
					<td>
						Per-tool guards keyed by tool name. Each runs after tool resolution and before the call;
						throw <code>McpAccessError</code> to reject, or mutate <code>args</code> to inject trusted
						fields.
					</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Mount the SvelteKit routes</h2>
		<p>Two thin route files turn the server into HTTP endpoints:</p>
		<CodeBlock code={toolsRouteCode} lang="typescript" filename="src/routes/api/mcp/tools/+server.ts" />
		<CodeBlock code={callRouteCode} lang="typescript" filename="src/routes/api/mcp/call/+server.ts" />
		<p>
			By default both adapters read the authenticated user from <code>event.locals.user</code>; pass
			<code>resolveUser</code> / <code>resolveAuthenticated</code> in the mount options to source it
			elsewhere.
		</p>
		<CodeBlock code={callShapeCode} lang="typescript" />
	</section>

	<section>
		<h2>Access model</h2>
		<p>The server enforces a three-layer policy on every request:</p>
		<ul>
			<li>
				<strong>Allow-list</strong> — only tools whose name starts with an
				<code>allowedClassNames</code> prefix are ever returned or callable, so decorating a class with
				<code>@smrt()</code> does not automatically expose it through this server.
			</li>
			<li>
				<strong>Public-tool policy</strong> — unauthenticated callers see only <em>read-only</em>
				tools (names ending in <code>_list</code> / <code>_get</code>) that also match a
				<code>publicToolPatterns</code> entry. A call to any non-public tool without a user throws
				<code>McpAccessError(401)</code>; an unknown tool throws <code>McpAccessError(404)</code>.
			</li>
			<li>
				<strong>Workflow assertions</strong> — per-tool hooks run last and can reject the call or
				clamp arguments (e.g. force <code>approvedByUserId</code> to the authenticated user's id),
				keeping that policy in your app rather than in the framework.
			</li>
		</ul>
		<Callout variant="security" title="Publish deliberately">
			Treat <code>allowedClassNames</code> and <code>publicToolPatterns</code> as your public API
			surface. Only read-only tools can ever be made public — write tools always require an
			authenticated user — but anything you allow-list is reachable by any authenticated caller, so
			keep the list to the objects you actually intend to expose.
		</Callout>
	</section>

	<section>
		<h2>Exports</h2>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>From</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>createMcpAppServer</code></td>
					<td><code>.</code></td>
					<td>Build the framework-agnostic server core.</td>
				</tr>
				<tr>
					<td><code>McpAccessError</code></td>
					<td><code>.</code></td>
					<td>Error carrying an HTTP <code>status</code>; thrown to reject a call.</td>
				</tr>
				<tr>
					<td>
						<code>matchesToolPattern</code>, <code>isReadOnlyToolName</code>,
						<code>isPublicToolName</code>, <code>isAllowedCoreTool</code>,
						<code>classNamePrefixes</code>
					</td>
					<td><code>.</code></td>
					<td>Tool-name policy helpers (also used internally) for custom transports.</td>
				</tr>
				<tr>
					<td><code>mountMcpToolsRoute</code>, <code>mountMcpCallRoute</code></td>
					<td><code>./sveltekit</code></td>
					<td>SvelteKit GET/POST adapters for an <code>McpAppServer</code>.</td>
				</tr>
			</tbody>
		</table>
		<p>
			Types: <code>CreateMcpAppServerOptions</code>, <code>McpAppServer</code>,
			<code>McpAppUser</code>, <code>McpWorkflowAssertion</code>, <code>CallToolInput</code>,
			<code>ListToolsInput</code>, and the two thunk aliases are all exported from the root entry.
		</p>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Generates the Tier 1 runtime MCP tools this server publishes.</p>
			</a>
			<a href="/modules/smrt-dev-mcp" class="link-card">
				<h3>smrt-dev-mcp</h3>
				<p>Tier 2 development MCP — code generation and introspection, read-only.</p>
			</a>
			<a href="/modules/smrt-users" class="link-card">
				<h3>smrt-users</h3>
				<p>Populates <code>event.locals.user</code> the adapters read for auth.</p>
			</a>
		</div>
	</section>

	<section>
		<div
			style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);"
		>
			<a href="/modules" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>&larr; Back to Modules</a
			>
			<a
				href="/modules/smrt-dev-mcp"
				style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>Next: smrt-dev-mcp &rarr;</a
			>
		</div>
	</section>
</ModulePage>
