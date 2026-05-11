<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-languages"
	description="Language string registry with a 5-layer cascade, locale fallback chains, and AI-driven auto-translation for missing locales with admin review."
	badges={['v0.24.12', 'i18n Registry', 'AI Auto-Translation', 'Locale Fallback']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-languages</strong> is the i18n companion to <code>smrt-prompts</code>. It uses
			the same 5-layer override cascade but is keyed by <code>(key, locale)</code> instead of just
			<code>key</code>. When a locale is missing, it walks a fallback chain (<code>fr-CA</code> to
			<code>fr</code> to default) and asynchronously enqueues an AI translation job so the next
			request returns the requested locale natively.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>5-layer cascade: code default to file config to app override to tenant override to runtime override</li>
				<li>Locale fallback chain: <code>fr-CA</code> to <code>fr</code> to default</li>
				<li>AI auto-translation queue with deterministic dedup IDs</li>
				<li><code>LanguageOverride.auto_generated</code> flag drives admin review</li>
				<li>Hash-gated re-translation — never time-based</li>
				<li>Human edits win permanently (<code>auto_generated: false</code> rows are never overwritten)</li>
				<li>Tenant glossary feeds the translation prompt for brand voice consistency</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-languages`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  defineLanguageString,
  resolveLanguageString,
  LanguageOverride,
  LanguageOverrideCollection,
  clearLanguageCache,
} from '@happyvertical/smrt-languages';

// 1. Register code defaults (typically at module load time)
defineLanguageString({
  key: 'users.role.member',
  locale: 'en',
  template: 'Member',
});

defineLanguageString({
  key: 'commerce.invoice.dueText',
  locale: 'en',
  template: 'Due by {{ date }}',
});

// 2. Resolve a string for the current tenant + locale
const text = await resolveLanguageString('users.role.member', {
  db,
  tenantId: 'tenant-a',
  locale: 'es',                // not registered — walks fallback chain
  vars: { name: 'Will' },
});
// First call: returns 'Member' with source: 'fallback'
// Async: enqueues translation job; result becomes app-level override
// Next call: returns the Spanish translation`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>The 5-Layer Cascade</h2>
		<p>Identical to <code>smrt-prompts</code>, but keyed by <code>(key, locale)</code>:</p>
		<CodeBlock
			code={`Priority (low to high)
  1. Code default       defineLanguageString({ key, locale, template })
  2. File / config      package config 'languages' overrides
  3. App-level stored   LanguageOverride row with tenantId = null
  4. Tenant-level       LanguageOverride row with current tenant
  5. Runtime override   resolveLanguageString({ overrides })

If no row exists for the exact (key, locale, tenantId), fall through to:
  - Same key with the requested locale's fallback chain (fr-CA -> fr -> default)
  - Return the first hit with source: 'fallback'
  - Fire-and-forget AI translation job for the missing target`}
			language="text"
		/>
	</section>

	<section>
		<h2>Locale-Miss Flow</h2>
		<CodeBlock
			code={`// When resolveLanguageString cannot find (key, locale, tenantId):

// 1. Walk locale fallback chain (buildLocaleFallbackChain)
//    fr-CA -> fr -> en (configured default)

// 2. Return the first hit immediately:
//    { value, source: 'fallback', resolvedLocale }

// 3. Fire-and-forget enqueueTranslationJob:
//    - Scoped to current tenant for glossary purposes
//    - Result is written app-level (tenantId: null) — reusable across tenants
//    - Job ID is deterministic, so concurrent misses collapse into one job

// 4. Subsequent requests hit the new app-level row at the requested locale.`}
			language="text"
		/>
	</section>

	<section>
		<h2>AI Translation Pipeline</h2>
		<p>The translation worker honors several invariants to avoid runaway costs and bad overwrites:</p>
		<ul>
			<li>Honors the <code>smrt-languages.auto_translate</code> feature flag (kill switch)</li>
			<li>Skips locales outside <code>supportedLocales</code> when configured</li>
			<li>Skips when a <code>LanguageOverride</code> already exists with a matching <code>source_hash</code> (hash-gated, never time-based)</li>
			<li>Never overwrites rows with <code>auto_generated: false</code> — human edits win permanently</li>
			<li>Pulls the tenant's existing overrides as a glossary so translations match tenant voice</li>
		</ul>
		<CodeBlock
			code={`// LanguageOverride model fields for the pipeline:
class LanguageOverride extends SmrtObject {
  key: string
  locale: string              // BCP-47, normalized (lowercase lang / uppercase region)
  context: string             // tenantId or '__app__' for unique upsert
  tenantId?: string | null
  template: string
  auto_generated: boolean     // true if produced by translation worker
  source_hash?: string        // hash of source template at translation time
  ai_model?: string           // which model produced the translation
  reviewed_at?: Date
  reviewed_by?: string        // userId of reviewer (admin review queue)
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Conventions</h2>
		<ul>
			<li>Keys are namespaced by package: <code>users.role.member</code>, <code>commerce.invoice.dueText</code></li>
			<li>Locales follow BCP-47 (<code>en</code>, <code>fr-CA</code>, <code>pt-BR</code>) and are normalized on persistence</li>
			<li>The translation prompt itself is registered with <code>smrt-prompts</code> under <code>smrt-languages.translation</code> — ops can tune wording without redeploying</li>
			<li>The <code>context</code> column carries <code>tenantId</code> or <code>'__app__'</code> so the <code>(key, locale, context)</code> upsert key remains unique even with a nullable <code>tenantId</code></li>
		</ul>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Register every user-visible string with <code>defineLanguageString</code> at the default locale</li>
				<li>Use the admin review queue to promote auto-generated translations to reviewed status</li>
				<li>Manage the kill switch via the <code>smrt-languages.auto_translate</code> feature flag</li>
				<li>Provide a tenant glossary by curating reviewed overrides — the translator uses them</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't translate user-supplied content with this package — it's for app strings only</li>
				<li>Don't set <code>auto_generated: false</code> on auto-produced rows until a human reviews</li>
				<li>Don't drop the <code>context</code> column — uniqueness depends on it</li>
				<li>Don't enqueue translations synchronously — fire-and-forget is the contract</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-prompts">
				<h3>smrt-prompts</h3>
				<p>Hosts the translation prompt; same cascade architecture</p>
			</a>
			<a href="/modules/smrt-features">
				<h3>smrt-features</h3>
				<p>Hosts the auto-translate kill switch</p>
			</a>
			<a href="/modules/smrt-jobs">
				<h3>smrt-jobs</h3>
				<p>Runs the translation worker queue</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Tenant context for glossary scoping</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
