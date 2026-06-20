<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-prompts"
	description="Tenant-aware prompt registry with a 5-layer override cascade. Code defines defaults; file config, app overrides, tenant overrides, and runtime overrides personalize at every level."
	badges={['v0.29.34', 'Prompt Registry', 'Tenant-Aware', '5-Layer Cascade']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-prompts</strong> is the Phase 2 centerpiece for prompt governance in SMRT. Prompt templates
			and AI model selection are defined in code, then layered with file configuration, app-wide overrides,
			tenant-scoped overrides, and runtime overrides — each layer overrides any subset of fields, so inheritance
			is field-by-field.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>
					5-layer resolution cascade: code default to file config to app override to tenant override
					to runtime override
				</li>
				<li><code>definePrompt()</code> registers code defaults in a global registry</li>
				<li><code>resolvePrompt()</code> merges all layers with field-by-field inheritance</li>
				<li>
					<code>PromptOverride</code> rows in <code>_smrt_prompt_overrides</code> store partial app- and
					tenant-level overrides
				</li>
				<li>
					Provider selection via profile indirection — prompts pick named profiles, profiles resolve
					to provider/model in <code>smrt-config</code>
				</li>
				<li>Per-<code>(key, tenantId)</code> TTL cache invalidated on override save/delete</li>
				<li><code>editable</code> flags lock specific fields against tenant override</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-prompts`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  definePrompt,
  resolvePrompt,
  PromptOverride,
  PromptOverrideCollection,
  clearPromptCache,
} from '@happyvertical/smrt-prompts';

// 1. Register a code default (typically at module load time)
definePrompt({
  key: 'content.summarize.headline',
  template: 'Write a concise headline for: {body}',
  ai: {
    profile: 'summarization',  // resolves via smrt-config
    params: { temperature: 0.7 },
  },
  editable: { template: true, params: true },  // tenants may NOT change profile
});

// 2. Resolve a prompt for the current tenant
const resolved = await resolvePrompt('content.summarize.headline', {
  db,
  tenantId: 'tenant-123',
  override: {
    // Runtime override — highest priority
    params: { temperature: 0.3 },
  },
});

// 3. Store a tenant-level override
const overrides = await PromptOverrideCollection.create({ db });
const override = await overrides.create({
  key: 'content.summarize.headline',
  tenantId: 'tenant-123',
  template: 'Generate a headline in our brand voice: {body}',
});
await override.save();
// Cache for (key, tenantId) is invalidated automatically`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>The 5-Layer Cascade</h2>
		<p>
			Layers compose from lowest (code) to highest (runtime). Each layer can override any subset of
			fields:
		</p>
		<CodeBlock
			code={`Priority (low to high)
  1. Code default       definePrompt({ key, template, ai })
  2. File / config      getPackageConfig<PromptPackageConfig>('prompts', defaults)
  3. App-level stored   PromptOverride row with tenantId = null
  4. Tenant-level       PromptOverride row with current tenant
  5. Runtime override   resolvePrompt(key, { override })

Each layer may override any subset of fields:
  - template          (the prompt body)
  - profile           (named AI profile to use)
  - model             (override the profile's model)
  - params            (temperature, max_tokens, etc.)

A null/undefined field at any layer means "fall through to the lower layer."`}
			language="text"
		/>
	</section>

	<section>
		<h2>Core API</h2>

		<h3>definePrompt</h3>
		<CodeBlock
			code={`definePrompt({
  key: 'projects.issue.incorporateFeedback',
  template: \`Incorporate this feedback into the issue body:
{feedback}

Current body:
{body}\`,
  ai: {
    profile: 'general-purpose',
    params: { temperature: 0.5 },
  },
  // editable: Partial<{ template, profile, model, params }> of booleans.
  // Every field defaults to false (locked) — opt fields IN explicitly.
  editable: { template: true, params: true },
});`}
			language="typescript"
		/>

		<h3>resolvePrompt</h3>
		<CodeBlock
			code={`const resolved = await resolvePrompt('projects.issue.incorporateFeedback', {
  db,
  tenantId,                       // optional — omit to read tenant from context
  override: { /* runtime */ },    // highest-priority partial override (singular)
  variables: { feedback, body },  // template variables for rendering
});

// resolved: ResolvedPrompt = {
//   key: string,
//   template: string,             // merged template (vars NOT yet applied)
//   text: string,                 // template with variables rendered
//   ai: {                         // ResolvedPromptAI
//     profile?: string,
//     provider?: string,          // resolved from the profile via smrt-config
//     model?: string,
//     params: Record<string, unknown>,
//     // ...plus flattened params (temperature, maxTokens, ...)
//   },
// }`}
			language="typescript"
		/>

		<h3>PromptOverride model</h3>
		<CodeBlock
			code={`class PromptOverride extends SmrtObject {
  key: string                     // matches definePrompt key
  tenantId: string | null         // null means app-level
  template: string | null
  profile: string | null
  model: string | null
  params: string | null           // JSON string

  // conflictColumns: ['key', 'context']
  //   context is set on save() to (tenantId ?? '__app__') so app-level
  //   rows stay unique despite the nullable tenantId.
  // Write-time validation against the prompt's editable config (booleans).
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Profile to Provider Indirection</h2>
		<p>
			Prompts never reference a provider directly. They select a <em>named profile</em>, and the
			profile resolves to a provider/model in <code>smrt-config</code>. This keeps tenant overrides
			safe — a tenant cannot accidentally point a prompt at an unapproved provider.
		</p>
		<CodeBlock
			code={`// smrt-config (app config layer)
{
  prompts: {
    profiles: {
      summarization: { provider: 'anthropic', model: 'claude-3-5-sonnet' },
      'general-purpose': { provider: 'openai', model: 'gpt-4o-mini' },
    }
  }
}

// Prompts pick profiles, not providers:
definePrompt({ key: '...', ai: { profile: 'summarization' } });

// A tenant override may change params or template,
// but cannot pick an unapproved provider directly.`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Caching</h2>
		<CodeBlock
			code={`// resolvePrompt() caches per (key, tenantId, db) with a TTL.
// Cache is invalidated automatically on:
//   - PromptOverride.save()
//   - PromptOverride.delete()
//
// Manual invalidation (e.g. in tests) — clearPromptCache takes no args
// and clears the entire process cache:
import { clearPromptCache, getPromptCacheTtlMs } from '@happyvertical/smrt-prompts';

clearPromptCache();              // clear everything
getPromptCacheTtlMs();           // inspect the configured TTL (ms)`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>
					Namespace keys by package or domain: <code>projects.issue.incorporateFeedback</code>
				</li>
				<li>Mark sensitive fields as non-editable via <code>editable</code></li>
				<li>Let stored overrides use null to fall through to the lower layer</li>
				<li>
					Pass <code>tenantId</code> on every <code>resolvePrompt</code> call inside a tenant context
				</li>
				<li>
					Use the runtime override layer for per-call adjustments (e.g. temperature for A/B tests)
				</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't reference provider/model directly in prompts — pick a profile</li>
				<li>
					Don't write <code>PromptOverride</code> rows that violate the definition's
					<code>editable</code> list (write-time validation will reject them)
				</li>
				<li>Don't include PII in prompt templates — overrides are stored in the tenant DB</li>
				<li>
					Don't bypass <code>resolvePrompt</code> by reading <code>PromptOverride</code> rows directly
				</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-languages">
				<h3>smrt-languages</h3>
				<p>Parallel registry for language strings (same cascade pattern)</p>
			</a>
			<a href="/modules/smrt-features">
				<h3>smrt-features</h3>
				<p>Parallel registry for feature flags</p>
			</a>
			<a href="/modules/smrt-config">
				<h3>smrt-config</h3>
				<p>File/config layer and profile-to-provider resolution</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Consumes prompts for summarization and headline generation</p>
			</a>
			<a href="/modules/smrt-images">
				<h3>smrt-images</h3>
				<p>Consumes prompts for AI image categorization</p>
			</a>
			<a href="/modules/smrt-ledgers">
				<h3>smrt-ledgers</h3>
				<p>Consumes prompts for transaction categorization</p>
			</a>
			<a href="/modules/smrt-analytics">
				<h3>smrt-analytics</h3>
				<p>Consumes prompts for AI-powered report generation</p>
			</a>
			<a href="/modules/smrt-properties">
				<h3>smrt-properties</h3>
				<p>Consumes prompts for property recommendations</p>
			</a>
			<a href="/modules/smrt-profiles">
				<h3>smrt-profiles</h3>
				<p>Consumes prompts for identity copy and onboarding</p>
			</a>
			<a href="/modules/smrt-projects">
				<h3>smrt-projects</h3>
				<p>Consumes prompts for issue feedback incorporation</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
