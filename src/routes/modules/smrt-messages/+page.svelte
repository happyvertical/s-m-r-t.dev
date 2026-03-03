<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-messages - Multi-Channel Messaging | SMRT Framework</title>
	<meta
		name="description"
		content="Unified multi-channel messaging with STI-based channel hierarchies for Email, Slack, and Twitter. Encrypted credential storage via smrt-secrets."
	/>
</svelte:head>

<ModulePage
	name="smrt-messages"
	description="Multi-channel messaging with STI hierarchies for Email, Slack, and Twitter. Credential encryption via smrt-secrets."
	badges={['v0.20.44', 'Email', 'Slack', 'Twitter']}
>
	<!-- Overview -->
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-messages</strong> provides unified multi-channel messaging with STI-based channel
			hierarchies. Messages and accounts each use single-table inheritance, so Email, SlackMessage,
			and Tweet all share a single <code>messages</code> table, while EmailAccount, SlackAccount, and
			TwitterAccount share a single <code>accounts</code> table.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>STI message hierarchy: Email, SlackMessage, Tweet (share <code>messages</code> table)</li>
				<li>STI account hierarchy: EmailAccount, SlackAccount, TwitterAccount (share <code>accounts</code> table)</li>
				<li>Send lifecycle: draft → sending → sent/failed with retry budget</li>
				<li>Credential encryption via <code>credentialSecretId</code> → smrt-secrets</li>
				<li>Per-channel senders: EmailSender, SlackSender, TweetSender</li>
				<li>Email filtering: Whitelist/Blacklist models for address-based filtering</li>
				<li>Svelte 5 UI components including EmailAccountManager and EmailFilterManager</li>
			</ul>
		</aside>
	</section>

	<!-- Installation -->
	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-messages
# or
pnpm add @happyvertical/smrt-messages`}
			language="bash"
		/>
		<p>
			Depends on <code>@happyvertical/smrt-core</code>, <code>@happyvertical/smrt-secrets</code> (credential encryption),
			and <code>@happyvertical/email</code> (SMTP/IMAP client).
		</p>
	</section>

	<!-- Quick Start -->
	<section>
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create an Email Account with Encrypted Credentials</h3>
		<CodeBlock
			code={`import {
  Email, EmailCollection,
  EmailAccount, EmailAccountCollection,
  EmailSender, MessageCollection,
} from '@happyvertical/smrt-messages';

const accounts = new EmailAccountCollection(db);
const account = await accounts.create({
  name: 'Support',
  providerType: 'smtp',
});

// Credentials stored via smrt-secrets envelope encryption
await account.setCredentials({
  host: 'smtp.example.com',
  user: 'support@example.com',
  pass: process.env.SMTP_PASSWORD,
});`}
			language="typescript"
		/>

		<h3>2. Send an Email</h3>
		<CodeBlock
			code={`const emails = new EmailCollection(db);
const email = await emails.create({
  accountId: account.id,
  subject: 'Welcome',
  toAddresses: JSON.stringify([{ address: 'user@example.com' }]),
  textBody: 'Thanks for signing up!',
});

// Send lifecycle: draft -> sending -> sent (or failed)
const result = await email.send();

// Retry a failed message (respects maxRetries budget)
if (!result.success) {
  await email.retrySend();
}`}
			language="typescript"
		/>

		<h3>3. Query Messages Across Channels</h3>
		<CodeBlock
			code={`// Query all messages (Email, Slack, Twitter) via base collection
const messages = new MessageCollection(db);
const recent = await messages.list({
  orderBy: 'createdAt DESC',
  limit: 20,
});`}
			language="typescript"
		/>
	</section>

	<!-- Core Concepts -->
	<section>
		<h2>Core Concepts</h2>

		<h3>STI Message Hierarchy</h3>
		<p>All message types share a single <code>messages</code> table via STI (<code>_meta_type</code> discriminator):</p>

		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>STI Discriminator</th>
					<th>Key Fields</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Message</code></td>
					<td>(base class)</td>
					<td>accountId, threadId, subject, body, fromAddress, toAddresses, sendStatus, retryCount</td>
				</tr>
				<tr>
					<td><code>Email</code></td>
					<td><code>@happyvertical/smrt-messages:Email</code></td>
					<td>messageId (RFC 822), inReplyTo, ccAddresses, bccAddresses, htmlBody, textBody, folderId, labels, headers</td>
				</tr>
				<tr>
					<td><code>Tweet</code></td>
					<td><code>@happyvertical/smrt-messages:Tweet</code></td>
					<td>tweetId, retweetCount, likeCount, mediaUrls, hashtags, mentions</td>
				</tr>
				<tr>
					<td><code>SlackMessage</code></td>
					<td><code>@happyvertical/smrt-messages:SlackMessage</code></td>
					<td>channelId, slackTs, slackThreadTs, reactions, blocks</td>
				</tr>
			</tbody>
		</table>

		<h3>STI Account Hierarchy</h3>
		<p>Accounts also use STI, sharing the <code>accounts</code> table:</p>

		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Key Fields</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Account</code></td>
					<td>providerType, credentialSecretId, isActive, lastSyncAt, settings</td>
				</tr>
				<tr>
					<td><code>EmailAccount</code></td>
					<td>SMTP/IMAP provider-specific fields + sync methods</td>
				</tr>
				<tr>
					<td><code>SlackAccount</code></td>
					<td>Slack workspace connection</td>
				</tr>
				<tr>
					<td><code>TwitterAccount</code></td>
					<td>Twitter API connection</td>
				</tr>
			</tbody>
		</table>

		<h3>Credential Security</h3>
		<p>
			Account credentials are stored via <code>credentialSecretId</code> pointing to
			smrt-secrets envelope encryption. Never store passwords as plain fields.
		</p>
		<CodeBlock
			code={`// Always use setCredentials/getCredentials
await account.setCredentials({
  host: 'smtp.example.com',
  user: 'support@example.com',
  pass: process.env.SMTP_PASSWORD,
});

const creds = await account.getCredentials();`}
			language="typescript"
		/>

		<h3>Send Lifecycle</h3>
		<p>
			<code>message.send()</code> resolves the account, creates a provider-specific sender,
			and transitions through send statuses:
		</p>
		<CodeBlock
			code={`// Status flow: draft -> sending -> sent (or failed)
const result = await email.send();

// Each channel has a dedicated sender
// EmailSender, SlackSender, TweetSender
// All implement MessageSenderInterface`}
			language="typescript"
		/>
	</section>

	<!-- Email Filtering -->
	<section>
		<h2>Email Filtering (Whitelist/Blacklist)</h2>
		<p>
			New in v0.20.42: Whitelist and Blacklist models for address-based email filtering.
		</p>
		<CodeBlock
			code={`import {
  Whitelist, WhitelistCollection,
  Blacklist, BlacklistCollection,
} from '@happyvertical/smrt-messages';

// Create whitelist/blacklist entries
const whitelist = new WhitelistCollection(db);
await whitelist.create({ address: 'trusted@example.com' });

const blacklist = new BlacklistCollection(db);
await blacklist.create({ address: 'spam@example.com' });`}
			language="typescript"
		/>
	</section>

	<!-- Per-Channel Senders -->
	<section>
		<h2>Per-Channel Senders</h2>
		<p>Each channel has a dedicated sender implementing <code>MessageSenderInterface</code>:</p>

		<table>
			<thead>
				<tr>
					<th>Sender</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>EmailSender</code></td>
					<td>Send emails via <code>@happyvertical/email</code> client</td>
				</tr>
				<tr>
					<td><code>SlackSender</code></td>
					<td>Send Slack messages via API</td>
				</tr>
				<tr>
					<td><code>TweetSender</code></td>
					<td>Post tweets via Twitter API</td>
				</tr>
			</tbody>
		</table>
	</section>

	<!-- Svelte Components -->
	<section>
		<h2>Svelte 5 Components</h2>
		<p>
			The package includes UI components for managing email accounts and filters:
		</p>
		<ul>
			<li><strong>EmailAccountManager</strong>: Admin UI for managing email account connections and credentials</li>
			<li><strong>EmailFilterManager</strong>: Admin UI for managing whitelist/blacklist rules</li>
			<li><strong>MessageCard</strong>, <strong>MessageList</strong>: Display message summaries</li>
			<li><strong>ComposeForm</strong>, <strong>ReplyForm</strong>, <strong>ForwardForm</strong>: Message composition</li>
			<li><strong>ThreadView</strong>, <strong>MessageDetail</strong>: Conversation display</li>
			<li><strong>FolderNav</strong>, <strong>MessageFilters</strong>: Navigation and filtering</li>
			<li><strong>AccountCard</strong>, <strong>AccountList</strong>, <strong>AccountAvatar</strong>: Account management</li>
			<li><strong>AttachmentChip</strong>, <strong>AttachmentUpload</strong>: Attachment handling</li>
			<li><strong>SendStatusBadge</strong>, <strong>MessageStatusIndicator</strong>, <strong>MessageTypeBadge</strong>: Status display</li>
			<li><strong>MessageToolbar</strong>, <strong>RecipientInput</strong>: Toolbar and input components</li>
		</ul>

		<CodeBlock
			code={`import {
  EmailAccountManager,
  EmailFilterManager,
  MessageCard,
  MessageList,
} from '@happyvertical/smrt-messages/svelte';`}
			language="typescript"
		/>
	</section>

	<!-- API Reference -->
	<section>
		<h2>API Reference</h2>

		<h3>Collections</h3>
		<CodeBlock
			code={`// Base collections (query across all channels)
MessageCollection
AccountCollection
AttachmentCollection

// Email-specific collections
EmailCollection
EmailAccountCollection
EmailAttachmentCollection
EmailFolderCollection

// Email filtering
WhitelistCollection
BlacklistCollection`}
			language="typescript"
		/>
	</section>

	<!-- Best Practices -->
	<section>
		<h2>Best Practices</h2>

		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>setCredentials()</code>/<code>getCredentials()</code> for all account credentials</li>
				<li>Use JSON address helpers: <code>getToAddresses()</code>, <code>getCcAddresses()</code></li>
				<li>Handle send failures with retry logic (<code>maxRetries</code> budget)</li>
				<li>Use <code>MessageCollection</code> to query across all channel types</li>
				<li>Store attachment references via <code>messageId</code> field</li>
			</ul>
		</article>

		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't store passwords directly -- always use smrt-secrets encryption</li>
				<li>Don't modify JSON fields directly -- use accessor methods (<code>getX()</code>/<code>setX()</code>)</li>
				<li>Don't override <code>toJSON()</code> -- use <code>transformJSON()</code></li>
				<li>Don't use <code>emailId</code> on Attachment -- use <code>messageId</code> (old field is deprecated)</li>
				<li>Don't run concurrent syncs on the same account</li>
			</ul>
		</article>
	</section>

	<!-- Related Modules -->
	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>ORM base classes and code generation</p>
			</a>
			<a href="/modules/smrt-secrets">
				<h3>smrt-secrets</h3>
				<p>Envelope encryption for credentials</p>
			</a>
			<a href="/modules/smrt-agents">
				<h3>smrt-agents</h3>
				<p>AI-powered message processing agents</p>
			</a>
		</nav>
	</section>

	<!-- Footer Navigation -->
	<nav>
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-properties">Next: smrt-properties →</a>
	</nav>
</ModulePage>
