<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Expose your app to Claude Desktop via MCP | SMRT Guides</title>
	<meta
		name="description"
		content="A runnable guide: expose a running SMRT app's objects as MCP tools with smrt-app-mcp, then connect Claude Desktop through the smrt-mcp-bridge stdio bridge."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Guides</span>
		<span>/</span>
		<span>Expose your app via MCP</span>
	</nav>

	<h1>Expose your app to Claude Desktop via MCP</h1>
	<p class="lead">
		<code>@happyvertical/smrt-app-mcp</code> turns your running SMRT app's objects into Model Context
		Protocol tools, served over HTTP from your own routes. A small stdio bridge then connects Claude Desktop
		to that HTTP surface. This guide wires both ends.
	</p>

	<Callout variant="note" title="Two pieces">
		<strong>Server side:</strong> mount <code>/api/mcp/tools</code> and <code>/api/mcp/call</code>
		in your SvelteKit app with <code>createMcpAppServer()</code>.
		<strong>Client side:</strong> point the generic <code>smrt-mcp-bridge</code> at that app so Claude
		Desktop can speak stdio MCP to it.
	</Callout>

	<section>
		<h2>How it fits together</h2>
		<CodeBlock
			code={`Claude Desktop ──stdio──► smrt-mcp-bridge ──HTTP──► your app
                                                  ├─ GET  /api/mcp/tools
                                                  └─ POST /api/mcp/call
                                                        │
                                                        ▼
                                            @smrt() objects → MCP tools`}
			language="text"
		/>
		<p>
			Why a bridge? Claude Desktop launches MCP servers as local processes that talk over stdio.
			Your app speaks HTTP. The bridge is a thin stdio-to-HTTP adapter that also attaches your auth
			token.
		</p>
	</section>

	<section>
		<h2>Step 1 — Make objects MCP-callable</h2>
		<p>
			Only objects you opt in are exposed. Set <code>mcp: true</code> on the
			<code>@smrt()</code> decorator (the same flag that powers the generated MCP tools).
		</p>
		<CodeBlock
			code={`// src/lib/models/Application.ts
import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt({ mcp: true })
export class Application extends SmrtObject {
  applicantName: string = '';
  status: string = 'submitted';
  approvedByUserId: string = '';
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Step 2 — Build the MCP server</h2>
		<p>
			<code>createMcpAppServer()</code> returns <code>{'{'} listTools, callTool {'}'}</code> wired
			to your objects. You decide which classes are reachable (<code>allowedClassNames</code>),
			which tools are public, and any per-tool guards (<code>workflowAssertions</code>).
		</p>
		<CodeBlock
			code={`// src/lib/server/mcp.ts
import { createMcpAppServer, McpAccessError } from '@happyvertical/smrt-app-mcp';

export const mcpServer = createMcpAppServer({
  // Thunk returning the SMRT options (db, ai, …) for each call.
  smrtOptions: () => ({ db: { type: 'postgres', url: process.env.DATABASE_URL! } }),

  serverInfo: { name: 'my-app', version: '0.1.0' },

  // Allow-list: only these classes' tools are reachable.
  allowedClassNames: ['Application'],

  // Tools matching these patterns are callable without auth (optional).
  publicToolPatterns: () => ['application_list'],

  // Per-tool guards run before a mutating tool executes.
  workflowAssertions: {
    application_update: (args, user) => {
      if (!user?.id) throw new McpAccessError(401, 'sign in first');
      args.approvedByUserId = user.id; // stamp the actor
    }
  }
});`}
			language="typescript"
		/>
		<Callout variant="security" title="Allow-list, don't expose everything">
			<code>allowedClassNames</code> is the security boundary — tools for any class not in the list
			are never served. Keep it to the objects you actually want an AI client to touch, and use
			<code>workflowAssertions</code> to enforce auth on writes.
		</Callout>
	</section>

	<section>
		<h2>Step 3 — Mount the routes</h2>
		<p>
			The <code>./sveltekit</code> subpath provides handlers for the two endpoints the bridge calls.
		</p>
		<CodeBlock
			code={`// src/routes/api/mcp/tools/+server.ts
import { mountMcpToolsRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const GET = mountMcpToolsRoute(mcpServer);`}
			language="typescript"
		/>
		<CodeBlock
			code={`// src/routes/api/mcp/call/+server.ts
import { mountMcpCallRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const POST = mountMcpCallRoute(mcpServer);`}
			language="typescript"
		/>
		<p>
			That is the whole server side. Run your app and the MCP surface is live at
			<code>/api/mcp/tools</code> and <code>/api/mcp/call</code>.
		</p>
	</section>

	<section>
		<h2>Step 4 — Install and authenticate the bridge</h2>
		<p>
			The client side uses <code>@happyvertical/smrt-app-cli</code>, which ships a generic
			<code>smrt-mcp-bridge</code> bin. It resolves the app URL and bearer token from environment
			variables prefixed by <code>--env-prefix</code>. Pick a prefix for your app (here:
			<code>MYAPP</code>) — it reads <code>MYAPP_SERVER_URL</code> and <code>MYAPP_TOKEN</code>.
		</p>
		<CodeBlock code={`pnpm add -g @happyvertical/smrt-app-cli`} language="bash" />
		<p>
			If your app requires auth, get a token through the device-code login flow shipped by
			<code>smrt-users</code> (this stores the token in <code>~/.config/&lt;app&gt;</code>):
		</p>
		<CodeBlock
			code={`# Either log in interactively (stores a token for the bridge to read) …
MYAPP_SERVER_URL=https://my-app.example.com smrt-app-cli auth login

# … or export the token directly for the bridge
export MYAPP_TOKEN=your-bearer-token`}
			language="bash"
		/>
		<Callout variant="note" title="Public tools need no token">
			If the only tools you exposed match <code>publicToolPatterns</code>, you can skip the token —
			the bridge simply omits the Authorization header.
		</Callout>
	</section>

	<section>
		<h2>Step 5 — Register with Claude Desktop</h2>
		<p>Add the bridge to Claude Desktop's config file:</p>
		<ul>
			<li>
				<strong>macOS</strong>:
				<code>~/Library/Application Support/Claude/claude_desktop_config.json</code>
			</li>
			<li><strong>Windows</strong>: <code>%APPDATA%\Claude\claude_desktop_config.json</code></li>
		</ul>
		<CodeBlock
			code={`{
  "mcpServers": {
    "my-app": {
      "command": "smrt-mcp-bridge",
      "args": ["--env-prefix=MYAPP", "--name=my-app", "--version=0.1.0"],
      "env": {
        "MYAPP_SERVER_URL": "https://my-app.example.com",
        "MYAPP_TOKEN": "your-bearer-token"
      }
    }
  }
}`}
			language="json"
		/>
		<p>
			Restart Claude Desktop. Your app's allow-listed objects now appear as tools (for example
			<code>application_list</code>, <code>application_get</code>, <code>application_update</code>),
			and Claude can call them in conversation.
		</p>
		<Callout variant="note" title="Branded bin (optional)">
			Apps that want their own command instead of the generic bin can call
			<code>runMcpStdioBridge({'{'} envPrefix, serverInfo {'}'})</code> from a one-line
			<code>bin/</code> script and ship it under their own name.
		</Callout>
	</section>

	<section>
		<h2>Defaults and overrides</h2>
		<table>
			<thead><tr><th>Setting</th><th>Source</th><th>Default</th></tr></thead>
			<tbody>
				<tr
					><td>App URL</td><td
						><code>${'{'}PREFIX{'}'}_SERVER_URL</code> → config file →
						<code>--default-server-url</code></td
					><td>local dev URL</td></tr
				>
				<tr
					><td>Auth token</td><td><code>${'{'}PREFIX{'}'}_TOKEN</code> → stored config</td><td
						>none (header omitted)</td
					></tr
				>
				<tr
					><td>Tools endpoint</td><td><code>toolsPath</code> option</td><td
						><code>/api/mcp/tools</code></td
					></tr
				>
				<tr
					><td>Call endpoint</td><td><code>callPath</code> option</td><td
						><code>/api/mcp/call</code></td
					></tr
				>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/modules/smrt-app-mcp">@happyvertical/smrt-app-mcp</a> — the server-side module reference.
			</li>
			<li>
				<a href="/docs/objects#auto-generated">Objects → Auto-Generated Interfaces</a> — where MCP tools
				come from.
			</li>
			<li>
				<a href="/docs/getting-started">Getting Started</a> — set up the app the tools live in.
			</li>
		</ul>
		<p class="version-note">Verified against SMRT {SMRT_VERSION_LABEL}.</p>
	</section>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.version-note {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #888);
		font-style: italic;
		margin-top: 32px;
	}
</style>
