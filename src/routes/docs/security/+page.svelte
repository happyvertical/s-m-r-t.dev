<script lang="ts">
	import { SMRT_VERSION_LABEL } from '$lib/version';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	// Default: private. No api.public → every route 401s without a principal.
	const privateByDefault = `@smrt({
  api: { include: ['list', 'get', 'create', 'update', 'delete'] }
})
export class Invoice extends SmrtObject {
  collection = 'invoices';
  amount: number = 0.0;
}

// No api.public is set, so PUBLIC_ACCESS === false.
// GET /invoices with no authenticated principal → 401.`;

	// Opting in to public access.
	const optingPublic = `// All routes public (reads AND writes):
@smrt({ api: { public: true } })

// Reads public, mutations still require auth:
@smrt({ api: { public: 'read' } })`;

	// The generated guard, verbatim shape.
	const authGuard = `// Generated into every route file.
const PUBLIC_ACCESS: boolean | 'read' = false;

function hasAuthenticatedPrincipal(locals: unknown): boolean {
  if (!locals || typeof locals !== 'object') return false;
  const l = locals as Record<string, unknown>;
  // Only a resolved, object-shaped principal counts. A callable auth() helper
  // (Auth.js puts one on every request, anonymous included) is intentionally
  // NOT treated as a signal — honoring it would fail OPEN.
  const isResolvedPrincipal = (v: unknown) =>
    typeof v === 'object' && v !== null;
  return (
    isResolvedPrincipal(l.user) ||
    isResolvedPrincipal(l.session) ||
    l.smrtAuth === true
  );
}

function requireRouteAuth(locals: unknown, mutating: boolean): void {
  if (PUBLIC_ACCESS === true) return;
  if (PUBLIC_ACCESS === 'read' && !mutating) return;
  if (!hasAuthenticatedPrincipal(locals)) {
    throw error(401, 'Authentication required');
  }
}`;

	// Sensitive field declaration.
	const sensitiveField = `import { SmrtObject, smrt, field } from '@happyvertical/smrt-core';

@smrt({ api: { public: 'read' } })
export class ApiKey extends SmrtObject {
  collection = 'api_keys';

  label: string = '';

  @field({ sensitive: true })
  secret: string = '';   // never serialized over the wire
}`;

	// toPublicJSON drops sensitive fields.
	const toPublicJson = `// toJSON()        → { id, label, secret }   (used for DB persistence)
// toPublicJSON()  → { id, label }           (used by every generated route)

// Generated routes ALWAYS serialize with toPublicJSON():
return json(item.toPublicJSON());`;

	// Sensitive fields rejected as WHERE filters.
	const sensitiveWhere = `// Allowed:
await apiKeys.list({ where: { label: 'production' } });

// Rejected — throws before the query runs:
await apiKeys.list({ where: { secret: 'guess-1' } });
// Error: Invalid WHERE clause field: 'secret'.
//        Filtering on sensitive fields is not allowed.`;

	// Readonly field + applyWritablePolicy strips it from bodies.
	const readonlyField = `@smrt({ api: { include: ['create', 'update'] } })
export class Account extends SmrtObject {
  collection = 'accounts';

  email: string = '';

  @field({ readonly: true })
  status: string = 'pending';   // server-controlled, not client-writable
}`;

	// applyWritablePolicy generated helper.
	const writablePolicy = `// Generated into every create/update route.
const WRITABLE_ALLOWLIST: string[] | null = null;
const READONLY_FIELDS: string[] = ['status'];
const SERVER_MANAGED_FIELDS = [
  'id', 'tenantId', 'tenant_id',
  'createdAt', 'created_at', 'updatedAt', 'updated_at',
];

function applyWritablePolicy(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {};
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('_')) continue;            // strip _-prefixed
    if (SERVER_MANAGED_FIELDS.includes(key)) continue;
    if (READONLY_FIELDS.includes(key)) continue;  // strip @field readonly
    if (WRITABLE_ALLOWLIST && !WRITABLE_ALLOWLIST.includes(key)) continue;
    result[key] = value;
  }
  return result;
}

// In the POST handler:
const data = applyWritablePolicy(await request.json());
const item = await collection.create(data);`;

	// Mass-assignment attempt is silently stripped.
	const massAssignment = `// Client sends:
POST /accounts
{ "email": "a@b.com", "status": "active", "id": "spoofed" }

// applyWritablePolicy strips status (readonly) and id (server-managed):
// → { email: "a@b.com" }
// The account is created as 'pending', with a server-generated id.`;

	// Optional allowlist.
	const allowlist = `@smrt({
  api: {
    include: ['create', 'update'],
    // Only these fields may be set from a request body.
    writable: ['email', 'displayName']
  }
})
export class Profile extends SmrtObject {
  collection = 'profiles';
  email: string = '';
  displayName: string = '';
  role: string = 'member';   // not in writable → can never be set via API
}`;
</script>

<svelte:head>
	<title>Security | s-m-r-t</title>
	<meta
		name="description"
		content="The security defaults of SMRT's generated API surface: fail-closed 401 by default, sensitive fields excluded from responses and WHERE filters, readonly fields stripped from write bodies, and where your own auth layer fits."
	/>
</svelte:head>

<article class="prose">
	<div class="page-head">
		<h1>Security</h1>
		<span class="version-badge">{SMRT_VERSION_LABEL}</span>
	</div>
	<p class="lead">
		The routes SMRT generates ship with safe defaults baked in: private unless you opt out,
		secret fields that never leave the server, and write bodies that can't be used for
		mass-assignment. This page is the security model of the generated surface — what's protected
		automatically, and what you still own.
	</p>

	<Callout variant="note" title="Scope">
		This covers the <strong>generated REST routes</strong>. It is not a substitute for a threat
		model of your whole application. See <a href="/docs/how-it-works">How It Works</a> for how
		these routes are produced.
	</Callout>

	<h2 id="fail-closed">Fail-closed by default</h2>
	<p>
		If you do not set <code>api.public</code>, the generated posture is <code>false</code>: every
		route requires an authenticated principal. A request with no principal gets
		<code>401 Authentication required</code> — for reads as well as writes.
	</p>
	<CodeBlock code={privateByDefault} filename="src/lib/models/invoice.ts" />

	<h3 id="opt-in-public">Opting in to public access</h3>
	<p>You make a route public deliberately, per object, with <code>api.public</code>:</p>
	<table>
		<thead>
			<tr><th><code>api.public</code></th><th>Reads</th><th>Mutations</th></tr>
		</thead>
		<tbody>
			<tr><td>unset / <code>false</code></td><td>require auth</td><td>require auth</td></tr>
			<tr><td><code>'read'</code></td><td>public</td><td>require auth</td></tr>
			<tr><td><code>true</code></td><td>public</td><td>public</td></tr>
		</tbody>
	</table>
	<CodeBlock code={optingPublic} lang="typescript" />
	<p>
		Note that <code>'read'</code> opens reads but keeps every mutating verb
		(<code>POST</code>/<code>PUT</code>/<code>DELETE</code> and any non-<code>GET</code> custom
		action) behind auth.
	</p>

	<h3 id="what-counts">What counts as authenticated</h3>
	<p>
		The generated guard, <code>requireRouteAuth</code>, treats a request as authenticated only when
		<code>locals</code> carries a resolved, object-shaped principal — <code>locals.user</code> or
		<code>locals.session</code> as objects, or the explicit <code>locals.smrtAuth === true</code>
		marker. This is deliberately strict.
	</p>
	<CodeBlock code={authGuard} lang="typescript" />
	<Callout variant="security" title="It does not honor a callable auth() helper">
		Auth.js / SvelteKit put a callable <code>auth()</code> helper on
		<code>locals</code> for <em>every</em> request, anonymous ones included. Treating its presence
		as a signal would fail <strong>open</strong>, so the guard ignores it and a bare boolean. Your
		auth layer must populate <code>locals.user</code> / <code>locals.session</code> with a real
		object (or set <code>locals.smrtAuth = true</code>) for the principal to count.
	</Callout>

	<h2 id="sensitive">Sensitive fields never leave the server</h2>
	<p>
		Mark a field <code>@field({`{ sensitive: true }`})</code> and it is excluded from the public
		serialization used by every generated route.
	</p>
	<CodeBlock code={sensitiveField} filename="src/lib/models/api-key.ts" />

	<h3 id="excluded-response">Excluded from responses</h3>
	<p>
		<code>toJSON()</code> still carries sensitive fields for database persistence, but generated
		routes serialize exclusively with <code>toPublicJSON()</code>, which drops every sensitive
		field (including STI <code>@meta</code> fields nested under <code>_meta_data</code>). Custom
		action results are recursively routed through the same serializer, so a sensitive field can't
		leak through a method's return value either.
	</p>
	<CodeBlock code={toPublicJson} lang="typescript" />

	<h3 id="rejected-where">Rejected as WHERE filters</h3>
	<p>
		Hiding a field from responses isn't enough on its own: an attacker could otherwise probe its
		value by filtering — <code>where: {`{ secret: 'guess-1' }`}</code>, then
		<code>'guess-2'</code>, watching which query returns a row. SMRT closes that oracle.
		Filtering on a sensitive column <strong>throws</strong>, and the check runs
		<em>before</em> operator and field validation so the probe is blocked even for otherwise-valid
		operators.
	</p>
	<CodeBlock code={sensitiveWhere} lang="typescript" />
	<Callout variant="security" title="Both halves matter">
		A sensitive field is excluded from output <em>and</em> rejected as a filter. Excluding it from
		responses alone would still leak it through a value-probing query; rejecting the filter alone
		would still leak it in the response body. You need both, and you get both.
	</Callout>

	<h2 id="readonly">Read-only fields can't be written from the client</h2>
	<p>
		Mark a field <code>@field({`{ readonly: true }`})</code> for values the server controls —
		status, ownership, computed flags — and the generated create/update handlers strip it from the
		request body before it reaches the model.
	</p>
	<CodeBlock code={readonlyField} filename="src/lib/models/account.ts" />

	<h3 id="write-stripping">The write-stripping policy</h3>
	<p>
		Every generated <code>create</code> and <code>update</code> handler runs the request body
		through <code>applyWritablePolicy()</code> first. It removes <code>_</code>-prefixed keys,
		server-managed fields (<code>id</code>, <code>tenantId</code>, the timestamp columns), and
		every <code>@field({`{ readonly }`})</code> field.
	</p>
	<CodeBlock code={writablePolicy} lang="typescript" />

	<h3 id="mass-assignment">This blocks mass-assignment</h3>
	<p>
		Without this guard, a client could set fields you never intended to expose by stuffing them
		into the JSON body — the classic mass-assignment vulnerability. Because stripping happens
		server-side before <code>create()</code>/<code>update()</code>, extra keys are simply dropped.
	</p>
	<CodeBlock code={massAssignment} lang="text" />

	<h3 id="allowlist">Tightening further with an allowlist</h3>
	<p>
		Read-only stripping is a denylist. For a strict allowlist — only an explicit set of fields may
		ever be written from a request body — set <code>api.writable</code>. Anything not on the list
		is dropped, regardless of whether it is marked read-only.
	</p>
	<CodeBlock code={allowlist} filename="src/lib/models/profile.ts" />

	<h2 id="checklist">Shippable checklist</h2>
	<p>Before exposing a generated endpoint:</p>
	<ul class="checklist">
		<li>
			Confirm the object's <code>api.public</code> is what you intend. Default is private; only
			set <code>true</code> / <code>'read'</code> where you mean it.
		</li>
		<li>
			Mark every secret column (credentials, tokens, tax IDs) <code>@field({`{ sensitive: true }`})</code>.
			It is then absent from responses and unfilterable.
		</li>
		<li>
			Mark server-controlled columns <code>@field({`{ readonly: true }`})</code>, or use
			<code>api.writable</code> for a strict allowlist, so writes can't tamper with them.
		</li>
		<li>
			Wire your auth layer to populate <code>locals.user</code> / <code>locals.session</code> with
			a real object (or set <code>locals.smrtAuth = true</code>). The guard does not infer
			authentication from a callable helper.
		</li>
		<li>
			Remember mutations stay protected under <code>public: 'read'</code> — verify that matches
			the access you want.
		</li>
	</ul>

	<h2 id="your-layer">You still own your auth layer</h2>
	<Callout variant="warning" title="SMRT enforces a gate, not an identity">
		The generated guard answers one question: <em>is there an authenticated principal on
		<code>locals</code> for routes that require one?</em> It does <strong>not</strong>
		authenticate users, issue or validate sessions, check roles or permissions, enforce rate
		limits, or scope rows to a tenant by itself. Establishing identity — the SvelteKit
		<code>handle</code> hook that sets <code>locals.user</code> / <code>locals.session</code>,
		your session strategy, your authorization rules — is yours to build and own. SMRT gives you a
		fail-closed default and safe serialization on top of that foundation; it is not the foundation.
	</Callout>
	<p>
		For finer-grained, per-row authorization and tenant isolation, see the tenancy and users
		packages, which integrate with this guard (tenant-scoped objects additionally establish a
		tenant context inside each generated handler).
	</p>

	<p class="source-note">
		Grounded in <code>packages/core/src/object.ts</code>,
		<code>packages/core/src/collection.ts</code>, and
		<code>packages/core/src/vite-plugin/sveltekit-generator.ts</code> in the SMRT framework source.
	</p>
</article>

<style>
	.prose {
		max-width: 760px;
	}

	.page-head {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 0;
	}

	.version-badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: var(--smrt-radius-sm, 4px);
		color: var(--smrt-color-primary, #e63946);
		background: color-mix(in srgb, var(--smrt-color-primary, #e63946) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--smrt-color-primary, #e63946) 35%, transparent);
	}

	.lead {
		font-size: 1.15rem;
		line-height: 1.6;
		color: var(--smrt-color-on-surface-variant, #555);
		margin: 16px 0 32px;
	}

	.prose h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--smrt-color-outline-variant, #eee);
	}

	.prose h3 {
		font-size: 1.15rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 10px;
	}

	.prose p,
	.prose li {
		line-height: 1.7;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.prose ul,
	.prose ol {
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 10px;
	}

	.checklist {
		list-style: none;
		padding-left: 0;
	}

	.checklist li {
		position: relative;
		padding-left: 30px;
		margin-bottom: 14px;
	}

	.checklist li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 4px;
		width: 18px;
		height: 18px;
		border-radius: 4px;
		border: 2px solid var(--smrt-color-success, #059669);
		background:
			linear-gradient(45deg, transparent 45%, var(--smrt-color-success, #059669) 45%, var(--smrt-color-success, #059669) 55%, transparent 55%) no-repeat,
			linear-gradient(-45deg, transparent 45%, var(--smrt-color-success, #059669) 45%, var(--smrt-color-success, #059669) 55%, transparent 55%) no-repeat;
		background-size: 60% 60%;
		background-position: center;
	}

	.prose a {
		color: var(--smrt-color-primary, #e63946);
		text-decoration: none;
	}

	.prose a:hover {
		text-decoration: underline;
	}

	.prose :not(pre) > code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		padding: 1px 6px;
		border-radius: 3px;
		background: var(--smrt-color-surface-container, #f0f0f0);
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.prose table {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0 24px;
		font-size: 0.9rem;
	}

	.prose th,
	.prose td {
		text-align: left;
		padding: 8px 12px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #eee);
		vertical-align: top;
	}

	.prose th {
		font-weight: 600;
		color: var(--smrt-color-on-surface-variant, #555);
		border-bottom: 2px solid var(--smrt-color-outline, #ddd);
	}

	.source-note {
		margin-top: 48px;
		padding-top: 16px;
		border-top: 1px solid var(--smrt-color-outline-variant, #eee);
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	@media (max-width: 600px) {
		.prose h1 {
			font-size: 2rem;
		}
	}
</style>
