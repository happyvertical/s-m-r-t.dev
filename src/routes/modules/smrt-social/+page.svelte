<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-social"
	description="Social media account management with OAuth and post scheduling across YouTube, Threads, X, Bluesky, and Facebook."
	badges={['v0.29.32', 'OAuth', 'Post Scheduling', 'Multi-Platform', 'Optional Tenancy']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-social</strong> manages social media connections and publishing across multiple platforms.
			It handles OAuth credential storage (CSRF + PKCE), post creation and scheduling, and per-post analytics
			tracking. The platform enum is hardcoded — extending it requires code changes.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>
					<strong>Multi-platform STI</strong>: YouTube, Threads, X (Twitter), Bluesky, Facebook —
					hardcoded enum
				</li>
				<li>
					<strong>OAuth flow with CSRF + PKCE</strong>: <code>OAuthState</code> stores state +
					<code>codeVerifier</code> with a 10-minute TTL
				</li>
				<li>
					<strong>Post lifecycle</strong>:
					<code
						>draft → pending_approval → approved → scheduled → publishing → dry_run/staged →
						published</code
					>
					(or <code>failed</code> / <code>cancelled</code>) — <code>scheduledAt</code> is metadata only;
					the app must run a job to publish
				</li>
				<li>
					<strong>Per-post analytics</strong>: <code>views</code>, <code>impressions</code>,
					<code>likes</code>, <code>comments</code>, <code>shares</code>, <code>clicks</code> — synced
					manually from platform APIs, not auto-populated
				</li>
				<li>
					<strong>Readiness gate</strong> (<code>isReady</code>): active + connected + credentials
					present + no missing permissions + not expired (5-min buffer) + public-publishing latch
					satisfied
				</li>
				<li>
					<strong>Publish-mode safety</strong> (<code>publishMode</code>): <code>dry_run</code>,
					<code>stage_remote</code>, <code>private_or_scheduled</code>, or <code>public</code> —
					<code>public</code>
					additionally requires the <code>publicPublishingAllowed</code> latch
				</li>
				<li>
					<strong>Link behavior</strong>: <code>description</code>, <code>inline</code>,
					<code>attachment</code>, <code>reply</code>, or <code>none</code>
				</li>
				<li>
					<strong>Optional tenancy</strong>: all models use
					<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>
				</li>
				<li>
					<strong>First-class secrets</strong>: credentials live in
					<a href="/modules/smrt-secrets">smrt-secrets</a>
					via <code>credentialSecretId</code> / <code>setCredentials()</code>; the legacy plaintext
					<code>accessToken</code>
					/ <code>refreshToken</code> columns are deprecated
				</li>
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

// Connect a social account. Prefer storing credentials in smrt-secrets
// via setCredentials() rather than the deprecated plaintext token columns.
const account = new SocialAccount({
  name: 'Bentley News YouTube',
  platform: 'youtube',
  platformUsername: 'Bentley News',
  tokenExpiresAt: new Date('2026-06-01'),
  defaultHashtags: ['news', 'local'],
  linkBehavior: 'description',
  publishMode: 'dry_run',          // safety default; gate 'public' behind publicPublishingAllowed
});
await account.save();

// Store the OAuth payload in smrt-secrets (sets credentialSecretId on the account)
await account.setCredentials({
  accessToken: '...',
  refreshToken: '...',
});

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
  platform: 'youtube' | 'threads' | 'x' | 'bluesky' | 'facebook'
  platformUserId: string | null
  platformUsername: string | null
  platformUrl: string | null
  accessToken: string | null        // deprecated: prefer credentialSecretId/setCredentials()
  refreshToken: string | null       // deprecated
  credentialSecretId: string | null // smrt-secrets reference for the credential payload
  accessTokenSecretName: string | null
  refreshTokenSecretName: string | null
  tokenExpiresAt: Date | null
  isActive: boolean
  status: 'connected' | 'disconnected' | 'expired' | 'missing_permissions' | 'error'
  defaultHashtags: string[]
  scopes: string[]
  linkBehavior: 'description' | 'inline' | 'attachment' | 'reply' | 'none'
  publishMode: 'dry_run' | 'stage_remote' | 'private_or_scheduled' | 'public'
  publicPublishingAllowed: boolean  // latch required before publishMode 'public' takes effect
  errorMessage: string | null

  get isReady(): boolean             // active + connected + credentials + no missing perms + not expired + publish latch
  get isTokenExpired(): boolean      // 5-minute buffer before expiry
  get hasCredentials(): boolean      // any usable credential reference present
  get needsAttention(): boolean
  get effectivePublishMode(): PublishMode  // downgrades 'public' to 'dry_run' until the latch is set
  async setCredentials(credentials: Record<string, unknown>, options?): Promise<void>
}`}
			language="typescript"
		/>
		<aside>
			<p>
				<strong>Security note:</strong> Store credentials in
				<a href="/modules/smrt-secrets">smrt-secrets</a>
				via <code>setCredentials()</code> / <code>credentialSecretId</code> rather than the
				deprecated plaintext <code>accessToken</code> / <code>refreshToken</code> columns.
				<code>isReady</code> accepts any usable credential reference, so a secrets-backed account is publish-ready
				without populating the plaintext fields.
			</p>
		</aside>

		<h3>SocialPost</h3>
		<CodeBlock
			code={`class SocialPost extends SmrtObject {
  socialAccountId: string | null
  postType: 'text' | 'link' | 'image' | 'video'
  title: string | null
  description: string
  hashtags: string[]
  linkUrl: string | null
  platformPostId: string | null   // id assigned by the platform after publish
  scheduledAt: Date | null
  publishedAt: Date | null
  status: 'draft' | 'pending_approval' | 'approved' | 'scheduled'
        | 'publishing' | 'dry_run' | 'staged' | 'published'
        | 'failed' | 'cancelled'
  errorMessage: string | null
  analytics: PostAnalytics        // object: views, impressions, likes, comments, shares, clicks, raw, lastUpdated
  analyticsLastSyncedAt: Date | null

  get isEditable(): boolean       // true when draft, pending_approval, or failed
  get isScheduled(): boolean
  get isPublished(): boolean
  get fullText(): string          // description + formatted hashtags
}`}
			language="typescript"
		/>

		<h3>OAuthState (STI)</h3>
		<CodeBlock
			code={`class OAuthState extends SmrtObject {
  platform: 'youtube' | 'threads' | 'x' | 'bluesky' | 'facebook'
  state: string                // CSRF token
  codeVerifier: string | null  // PKCE code verifier
  redirectUri: string
  scopes: string[]
  expiresAt: Date              // defaults to now + 10 minutes (10-minute TTL)

  get isExpired(): boolean
  get isValid(): boolean       // not expired and state is set
  verifyState(callbackState: string): boolean
  static generateState(): string
  static generateCodeVerifier(): string
  static async generateCodeChallenge(verifier: string): Promise<string>  // S256
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
				<li>
					Use PKCE (<code>generateCodeVerifier</code>/<code>generateCodeChallenge</code>) for OAuth
					flows
				</li>
				<li>Implement a job runner to trigger publishing at <code>scheduledAt</code> time</li>
				<li>Clean up expired OAuthState records (10-minute TTL)</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't assume auto-publishing (scheduledAt is metadata only -- app must trigger)</li>
				<li>Don't expect analytics to auto-populate (must sync from platform APIs)</li>
				<li>
					Don't write OAuth tokens into the deprecated plaintext <code>accessToken</code>/<code
						>refreshToken</code
					>
					columns -- use <code>setCredentials()</code> (smrt-secrets)
				</li>
				<li>
					Don't enable <code>publishMode: 'public'</code> without also setting
					<code>publicPublishingAllowed</code> (the latch gates real public publishing)
				</li>
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
