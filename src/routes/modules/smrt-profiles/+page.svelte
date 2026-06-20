<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-profiles"
	description="Central identity system with multi-auth (Nostr/OIDC/API keys/magic links), bidirectional relationships, controlled metadata, and audit logging."
	badges={['v0.29.34', 'Identity', 'Auth', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-profiles</code> package provides central identity management
			with STI-based profiles (Person, Organization, Bot), multi-auth support, bidirectional
			relationships, controlled metadata via <code>ProfileMetafield</code> /
			<code>ProfileMetadata</code>, owned-asset joins via the dedicated
			<code>profile_assets</code> table, and audit logging.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>
				<strong>STI Profile Types</strong>: <code>Profile</code> base with <code>Bot</code>,
				<code>Organization</code>, <code>Person</code> subclasses, plus extensible types via
				<code>ProfileType</code>
			</li>
			<li>
				<strong>Controlled Metadata</strong>: <code>ProfileMetafield</code> (validated controlled
				vocabulary) + <code>ProfileMetadata</code> per-profile values. <code>Profile.metadata</code>
				is a <code>@oneToMany('ProfileMetadata')</code> relationship.
			</li>
			<li>
				<strong>ProfileAsset</strong> (new): dedicated owned-asset join in
				<code>profile_assets</code> with <code>relationship</code> and <code>sortOrder</code>.
				Replaces generic <code>AssetAssociation</code> for profile-owned assets;
				<code>AssetAssociation</code> remains for generic/provenance links only.
			</li>
			<li>
				<strong>Bidirectional Relationships</strong>: auto-creates reciprocal inverse, optional
				<code>contextProfileId</code> for tertiary, <code>ProfileRelationshipTerm</code> for start/end
				dates
			</li>
			<li>
				<strong>Multi-Provider Auth</strong>: OIDC (Keycloak/Google/GitHub), Nostr (AES-256-GCM
				encrypted keypairs, NIP-05), API keys (SHA-256 hashed, scoped, expiry), magic link tokens
			</li>
			<li>
				<strong>Audit Logging</strong>: action/resource trail with <code>source</code>
				(web/cli/ci/webhook/mcp), <code>onBehalfOfId</code> for CI pass-through identity,
				<code>allowSuperAdminBypass: true</code>
			</li>
		</ul>

		<h3>Tenancy</h3>
		<p>
			<code>Profile</code> uses <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> — a profile
			can be tenant-scoped or global. <code>AuditLog</code> is also optional-tenant and explicitly
			allows super-admin bypass (<code>allowSuperAdminBypass: true</code>) so platform operators can
			audit across tenants. Email is globally unique across all profiles (DB-level constraint),
			<strong>not</strong> per-tenant.
		</p>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<h3>Using pnpm (recommended)</h3>
		<CodeBlock code={`pnpm add @happyvertical/smrt-profiles`} language="bash" />

		<h3>Using npm</h3>
		<CodeBlock code={`npm install @happyvertical/smrt-profiles`} language="bash" />

		<h3>Peer Dependencies</h3>
		<p>
			Optional integration with <code>@happyvertical/smrt-tenancy</code> for tenant scoping. Nostr
			support requires <code>@noble/curves</code> and <code>bech32</code> (already declared as
			deps).
			<strong>Nostr decryption requires the <code>SERVER_MASTER_SECRET</code> env var.</strong>
		</p>
	</section>

	<section id="quick-start">
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create Profile Type and Profile</h3>
		<CodeBlock
			code={`import {
  ProfileCollection,
  ProfileTypeCollection
} from '@happyvertical/smrt-profiles';

const typeCollection = await ProfileTypeCollection.create({ db });
const humanType = await typeCollection.create({ name: 'Human' });
await humanType.save();

const profileCollection = await ProfileCollection.create({ db });
const person = await profileCollection.create({
  typeId: humanType.id,
  name: 'Alice Johnson',
  email: 'alice@example.com', // globally unique
  description: 'Software engineer'
});
await person.save();`}
			language="typescript"
		/>

		<h3>2. Generate a Bio (AI, prompt-overridable)</h3>
		<CodeBlock
			code={`// Uses the smrtProfiles.profile.generateBio prompt via @happyvertical/smrt-prompts.
// Tenants can override the template/model/params at runtime.
const bio = await person.generateBio();
console.log(bio);

// Check whether a profile matches a description (delegates to is())
const isEngineer = await person.matches('a senior software engineer with TypeScript expertise');`}
			language="typescript"
		/>

		<h3>3. Owned Assets via ProfileAsset (new)</h3>
		<CodeBlock
			code={`// profile_assets is the canonical join for profile-owned assets.
// AssetAssociation is reserved for generic / provenance links only.
// addAsset(asset, relationship?, sortOrder?) -- takes an Asset instance.
await person.addAsset(headshotAsset, 'avatar', 0);

const assets = await person.getAssets('avatar'); // relationship filter (string)
await person.removeAsset(headshotAsset.id);

// Reads via the collection (per profile id)
const ownedAssets = await profileCollection.getAssets(person.id, 'avatar');`}
			language="typescript"
		/>

		<h3>4. Controlled Metadata</h3>
		<CodeBlock
			code={`import { ProfileMetafieldCollection } from '@happyvertical/smrt-profiles';

const fieldCollection = await ProfileMetafieldCollection.create({ db });
const phone = await fieldCollection.create({
  name: 'Phone Number',
  validation: { type: 'string', pattern: '^\\\\+?[0-9]{10,15}$' }
});
await phone.save();

await person.addMetadata('phone-number', '+14155551234');
const metadata = await person.getMetadata();
// { 'phone-number': '+14155551234' }

// Bulk reads/writes
await profileCollection.batchGetMetadata([person.id, bob.id]);
await profileCollection.batchUpdateMetadata([{ profileId: person.id, data: { location: 'SF' } }]);`}
			language="typescript"
		/>

		<h3>5. Bidirectional Relationships</h3>
		<CodeBlock
			code={`import { ProfileRelationshipTypeCollection } from '@happyvertical/smrt-profiles';

const relTypeCollection = await ProfileRelationshipTypeCollection.create({ db });
const friendType = await relTypeCollection.create({
  name: 'Friend',
  reciprocal: true // auto-creates inverse
});
await friendType.save();

await person.addRelationship(bob, 'friend');
const friends = await person.getRelationships({ direction: 'all' });`}
			language="typescript"
		/>
	</section>

	<section id="prompt-registry">
		<h2>Prompt Registry</h2>
		<p>
			<code>Profile.generateBio()</code> is registered with
			<a href="/modules/smrt-prompts"><code>@happyvertical/smrt-prompts</code></a>
			so tenants can override the template, model, and params at runtime without forking the package.
		</p>
		<CodeBlock
			code={`import { smrtProfilesGenerateBioPrompt } from '@happyvertical/smrt-profiles';

// key: 'smrtProfiles.profile.generateBio'
// Variables passed to the prompt (PII-conscious surface):
//   name, description, profileType, relationshipsSummary (counts only)
//
// Intentionally excluded: email, tenantId, ownerId, raw metadata blobs.`}
			language="typescript"
		/>
		<p>
			See <a href="/modules/smrt-prompts">smrt-prompts</a> for the override workflow.
		</p>
	</section>

	<section id="auth-methods">
		<h2>Authentication Methods</h2>
		<table>
			<thead>
				<tr><th>Model</th><th>Pattern</th></tr>
			</thead>
			<tbody>
				<tr>
					<td>NostrIdentity</td>
					<td>
						Encrypted keypair (AES-256-GCM). Requires <code>SERVER_MASTER_SECRET</code> env var for decryption.
						NIP-05 address generation supported.
					</td>
				</tr>
				<tr>
					<td>OidcIdentity</td>
					<td>
						Multiple issuers (Keycloak/Google/GitHub). Lookup by <code>issuer + subject</code> pair.
						<code>findOrCreate()</code> for first login. Same subject from different issuers = different
						identities.
					</td>
				</tr>
				<tr>
					<td>ApiKey</td>
					<td>
						SHA-256 hashed. <strong>Plaintext returned once only</strong> on
						<code>generate()</code>. <code>keyPrefix</code> for identification. Scope-based with expiry.
					</td>
				</tr>
				<tr>
					<td>MagicLinkToken</td>
					<td>One-time token with expiry for passwordless auth.</td>
				</tr>
			</tbody>
		</table>

		<h3>resolveIdentity() Dispatcher</h3>
		<CodeBlock
			code={`import { resolveIdentity } from '@happyvertical/smrt-profiles';

// Top-level dispatcher: returns/creates a Profile from
// Nostr signatures, OIDC claims, magic link tokens, or API keys.
const result = await resolveIdentity({
  oidcSession: event.locals.session,
  apiKey: event.request.headers.get('X-API-Key'),
  db: event.locals.db
});
// Returns ResolveIdentityResult: { profile: Profile | null, source, ... }
// source: 'api_key' | 'oidc' | 'nostr' | 'actor' | 'none'`}
			language="typescript"
		/>

		<h3>Provider-specific Helpers</h3>
		<CodeBlock
			code={`import {
  createProfileFromOidc,
  createProfileFromNostr,
  ApiKey,
} from '@happyvertical/smrt-profiles';

// First-time OIDC sign-in -- (claims, provider, options)
const { profile, oidcIdentity, created } = await createProfileFromOidc(claims, provider, { db });

// Nostr-authenticated user -- (email, nostrData, options)
const { profile, nostrIdentity } = await createProfileFromNostr(email, nostrData, { db });

// Issue an API key -- plaintext returned ONCE
// generate(profile, { name, scopes?, expiresAt?, db? })
const { key, apiKey } = await ApiKey.generate(profile, {
  name: 'CI deploy key',
  scopes: ['read:profiles'],
  expiresAt: new Date('2026-12-31'),
});
console.log(key);             // store now, never returned again
console.log(apiKey.keyPrefix); // visible identifier later`}
			language="typescript"
		/>
	</section>

	<section id="audit-log">
		<h2>Audit Logging</h2>
		<p>
			<code>AuditLog</code> records actions, resource identifiers, and provenance. The
			<code>source</code> field tracks the entry point (<code>web</code>/<code>cli</code>/<code
				>ci</code
			>/<code>webhook</code>/<code>mcp</code>), and
			<code>onBehalfOfId</code> captures the human identity behind a CI/automation account (pass-through
			identity).
		</p>
		<CodeBlock
			code={`await profile.recordAction({
  action: 'patient_viewed',
  resourceType: 'Patient',
  resourceId: 'patient-123',
  source: 'web',           // web | cli | ci | webhook | mcp
  onBehalfOfId: actorProfileId, // CI bots run as a service account, log the human too
  metadata: { reason: 'Follow-up appointment' },
});`}
			language="typescript"
		/>
		<p>
			<code>AuditLog</code> sets <code>allowSuperAdminBypass: true</code> so platform admins can read
			across tenants for incident response.
		</p>
	</section>

	<section id="gotchas">
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong><code>SERVER_MASTER_SECRET</code> required</strong> for Nostr private-key decryption —
				centralized key management
			</li>
			<li>
				<strong>API key plaintext returned once</strong>: <code>ApiKey.generate()</code> returns it
				exactly one time; only <code>keyPrefix</code> is visible afterwards
			</li>
			<li>
				<strong>OIDC unique per <code>issuer + subject</code></strong>: same subject from different
				issuers = different identities
			</li>
			<li>
				<strong>Email globally unique</strong> across all profiles (DB-level constraint), not per-tenant
			</li>
			<li>
				Use <code>ProfileAsset</code> (<code>profile_assets</code>) for owned assets; reserve
				<code>AssetAssociation</code> for generic/provenance links
			</li>
		</ul>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>
		<ul>
			<li>
				Define <code>ProfileMetafield</code> upfront — adding metadata without a backing field skips validation
			</li>
			<li>
				Namespace metafield slugs with dot notation (<code>contact.phone</code>,
				<code>social.github</code>)
			</li>
			<li>
				Only link OIDC accounts with <code>email_verified: true</code> — same email across providers is
				the linking signal
			</li>
			<li>
				Always record sensitive actions via <code>recordAction()</code> — include
				<code>onBehalfOfId</code> for CI
			</li>
			<li>Implement regular API key rotation; use specific scopes rather than <code>*</code></li>
		</ul>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li>
				<a href="/modules/smrt-core">smrt-core</a> — SmrtObject, database persistence, AI integration
			</li>
			<li>
				<a href="/modules/smrt-users">smrt-users</a> — multi-tenant RBAC, sessions (consumes
				<code>profileId</code>)
			</li>
			<li>
				<a href="/modules/smrt-prompts">smrt-prompts</a> — overridable prompt for
				<code>generateBio()</code>
			</li>
			<li>
				<a href="/modules/smrt-assets">smrt-assets</a> — the asset records joined via
				<code>profile_assets</code>
			</li>
		</ul>
	</section>
</ModulePage>

<style>
	.diagram {
		background: #f8f8f8;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: 8px;
		padding: 16px;
		margin: 16px 0;
		overflow-x: auto;
	}

	.diagram pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.4;
	}
</style>
