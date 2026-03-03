<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-social"
	description="Social media account management with OAuth, post scheduling, and analytics tracking across YouTube, Threads, X, and Bluesky."
	badges={['v0.20.44', 'OAuth', 'Post Scheduling', 'Multi-Platform']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-social</strong> manages social media connections and publishing across multiple
			platforms. It handles OAuth credential storage, post creation and scheduling, and per-post
			analytics tracking with PKCE support for secure OAuth flows.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Multi-platform: YouTube, Threads, X (Twitter), Bluesky</li>
				<li>OAuth flow with CSRF protection and PKCE support</li>
				<li>Post scheduling with draft/scheduled/published lifecycle</li>
				<li>Per-post analytics: views, likes, comments, shares, clicks</li>
				<li>Readiness gate: checks active + connected + token present + not expired</li>
				<li>Link behavior configuration: description, reply, or none</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-social`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { SocialAccount, SocialPost, OAuthState } from '@happyvertical/smrt-social';

// Connect a social account
const account = new SocialAccount({
  name: 'Bentley News YouTube',
  platform: 'youtube',
  platformUsername: 'Bentley News',
  accessToken: 'encrypted-token',
  refreshToken: 'encrypted-refresh',
  tokenExpiresAt: new Date('2026-06-01'),
  defaultHashtags: ['news', 'local'],
  linkBehavior: 'description',
});
await account.save();

// Check readiness before publishing
if (account.isReady) {
  const post = new SocialPost({
    socialAccountId: account.id,
    title: 'Breaking News from Bentley',
    description: 'Latest updates from the town council meeting.',
    hashtags: ['news', 'local', 'bentley'],
    linkUrl: 'https://example.com/article',
    scheduledAt: new Date('2026-03-05T18:00:00Z'),
    status: 'scheduled',
  });
  await post.save();
}

// OAuth flow: create state, redirect user, verify callback
const state = new OAuthState({
  platform: 'youtube',
  state: OAuthState.generateState(),
  codeVerifier: OAuthState.generateCodeVerifier(),
  redirectUri: 'https://app.example.com/oauth/callback',
  scopes: ['youtube.upload', 'youtube.readonly'],
});
await state.save();
// On callback: state.verifyState(callbackState)`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>SocialAccount (STI)</h3>
		<CodeBlock
			code={`class SocialAccount extends SmrtObject {
  name: string
  platform: 'youtube' | 'threads' | 'x' | 'bluesky'
  platformUsername?: string
  accessToken?: string
  refreshToken?: string
  tokenExpiresAt?: Date
  status: 'connected' | 'expired' | 'error'
  defaultHashtags?: string[]
  linkBehavior: 'description' | 'reply' | 'none'

  get isReady(): boolean       // active + connected + token + not expired
  get isTokenExpired(): boolean // 5-minute buffer before expiry
}`}
			language="typescript"
		/>
		<aside>
			<p><strong>Security note:</strong> OAuth tokens are stored as plain strings. For production deployments, consider integrating <a href="/modules/smrt-secrets">smrt-secrets</a> for envelope encryption of sensitive credentials.</p>
		</aside>

		<h3>SocialPost</h3>
		<CodeBlock
			code={`class SocialPost extends SmrtObject {
  socialAccountId: string
  title?: string
  description: string
  hashtags?: string[]
  linkUrl?: string
  scheduledAt?: Date
  publishedAt?: Date
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
  analytics: string            // JSON: views, likes, comments, shares, clicks

  get isEditable(): boolean    // true when draft or failed
  get fullText(): string       // description + formatted hashtags
}`}
			language="typescript"
		/>

		<h3>OAuthState (STI)</h3>
		<CodeBlock
			code={`class OAuthState extends SmrtObject {
  platform: string
  state: string                // CSRF token
  codeVerifier?: string        // PKCE code verifier
  redirectUri: string
  scopes?: string[]
  // 10-minute TTL

  get isValid(): boolean
  verifyState(callback: string): boolean
  static generateState(): string
  static generateCodeVerifier(): string
  static generateCodeChallenge(verifier: string): string  // S256
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Check <code>account.isReady</code> before attempting to publish</li>
				<li>Use <code>OAuthState.generateState()</code> for CSRF protection</li>
				<li>Use PKCE (<code>generateCodeVerifier</code>/<code>generateCodeChallenge</code>) for OAuth flows</li>
				<li>Implement a job runner to trigger publishing at <code>scheduledAt</code> time</li>
				<li>Clean up expired OAuthState records (10-minute TTL)</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't assume auto-publishing (scheduledAt is metadata only -- app must trigger)</li>
				<li>Don't expect analytics to auto-populate (must sync from platform APIs)</li>
				<li>Don't store tokens without encryption (currently plaintext -- integrate smrt-secrets)</li>
				<li>Don't skip the 5-minute token expiry buffer when checking readiness</li>
				<li>Don't extend the platform enum without code changes (hardcoded list)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content for social publishing</p>
			</a>
			<a href="/modules/smrt-video">
				<h3>smrt-video</h3>
				<p>Video content references</p>
			</a>
			<a href="/modules/smrt-secrets">
				<h3>smrt-secrets</h3>
				<p>Secure token storage</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Optional multi-tenant scoping</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
