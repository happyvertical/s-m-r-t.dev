<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-dev-mcp"
	description="Tier 2 development MCP server for the SMRT framework — code generation and project introspection, read-only by design."
	badges={['v0.24.12', 'MCP', 'Tier 2 Dev Tool', 'Read-only']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-dev-mcp</strong> is the <strong>Tier 2 (Development)</strong> MCP
			server for the SMRT framework. It exposes two tools — <code>generate-smrt-class</code> and
			<code>introspect-project</code> — for use from Claude Desktop, Claude Code, or any MCP-aware
			client during day-to-day development. The server is <strong>strictly read-only</strong>: it
			never writes files, never executes generated code, and never hits a database.
		</p>
		<aside>
			<p><strong>MCP Tier Context.</strong> SMRT splits its MCP surface across three tiers so you can wire each tier into the right environment:</p>
			<ul>
				<li><strong>Tier 1 (Runtime)</strong>: auto-generated from <code>@smrt()</code> classes at build time — live CRUD/list/AI operations against your objects. See <a href="/modules/smrt-core">smrt-core</a>.</li>
				<li><strong>Tier 2 (Development)</strong>: <em>this package</em> — class generation and project introspection for IDE-side assistants.</li>
				<li><strong>Tier 3 (Docs)</strong>: <code>smrt-docs-mcp</code> — framework documentation lookup for assistants without local repo access.</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`pnpm install @happyvertical/smrt-dev-mcp`} language="bash" />
	</section>

	<section>
		<h2>Setup</h2>
		<p>Add to your <code>.mcp.json</code> or Claude Desktop config:</p>
		<CodeBlock
			code={`{
  "mcpServers": {
    "smrt-dev-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@happyvertical/smrt-dev-mcp"]
    }
  }
}`}
			language="json"
		/>
		<p>Set <code>DEBUG=true</code> in the environment to enable diagnostic logging.</p>
	</section>

	<section>
		<h2>Available Tools</h2>

		<h3><code>generate-smrt-class</code></h3>
		<p>Generate a complete SMRT class with <code>@smrt()</code> decorator, fields, and imports.</p>
		<table>
			<thead>
				<tr>
					<th>Parameter</th>
					<th>Type</th>
					<th>Required</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>className</code></td>
					<td>string</td>
					<td>Yes</td>
					<td>Class name (PascalCase)</td>
				</tr>
				<tr>
					<td><code>properties</code></td>
					<td>array</td>
					<td>Yes</td>
					<td>Property definitions (<code>name</code>, <code>type</code>, <code>required?</code>, <code>description?</code>)</td>
				</tr>
				<tr>
					<td><code>baseClass</code></td>
					<td>string</td>
					<td>No</td>
					<td><code>'SmrtObject'</code> (default) or <code>'SmrtCollection'</code></td>
				</tr>
				<tr>
					<td><code>includeApiConfig</code></td>
					<td>boolean</td>
					<td>No</td>
					<td>Include REST API config (default: true)</td>
				</tr>
				<tr>
					<td><code>includeMcpConfig</code></td>
					<td>boolean</td>
					<td>No</td>
					<td>Include MCP config (default: true)</td>
				</tr>
				<tr>
					<td><code>includeCliConfig</code></td>
					<td>boolean</td>
					<td>No</td>
					<td>Include CLI config (default: true)</td>
				</tr>
			</tbody>
		</table>
		<p>Supported property types: <code>text</code>, <code>integer</code>, <code>decimal</code>, <code>boolean</code>, <code>datetime</code>, <code>json</code>.</p>

		<h3><code>introspect-project</code></h3>
		<p>Scan a project directory for SMRT objects and return a class/field/relationship report.</p>
		<table>
			<thead>
				<tr>
					<th>Parameter</th>
					<th>Type</th>
					<th>Required</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>directory</code></td>
					<td>string</td>
					<td>No</td>
					<td>Project directory (default: cwd)</td>
				</tr>
				<tr>
					<td><code>includeFields</code></td>
					<td>boolean</td>
					<td>No</td>
					<td>Include field details</td>
				</tr>
				<tr>
					<td><code>includeRelationships</code></td>
					<td>boolean</td>
					<td>No</td>
					<td>Analyze relationships</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Important Notes</h2>
		<ul>
			<li>This is a <strong>Tier 2 dev tool</strong> -- it does NOT provide runtime data operations</li>
			<li>For runtime MCP (live CRUD on your objects), use Tier 1 auto-generated MCP from <code>@smrt({"{ mcp: true }"})</code></li>
			<li>Read-only: never writes files or executes generated code</li>
			<li>Field type mapping supports: <code>text</code>, <code>integer</code>, <code>decimal</code>, <code>boolean</code>, <code>datetime</code>, <code>json</code></li>
		</ul>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Core framework with @smrt decorator (generates Tier 1 MCP)</p>
			</a>
			<a href="/modules/smrt-cli" class="link-card">
				<h3>smrt-cli</h3>
				<p>Developer CLI for introspection and code generation</p>
			</a>
			<a href="/modules/smrt-scanner" class="link-card">
				<h3>smrt-scanner</h3>
				<p>AST scanning used by introspect-project</p>
			</a>
		</div>
	</section>

	<section>
		<div
			style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);"
		>
			<a href="/modules" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>← Back to Modules</a
			>
			<a
				href="/modules/smrt-vitest"
				style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>Next: smrt-vitest →</a
			>
		</div>
	</section>
</ModulePage>
