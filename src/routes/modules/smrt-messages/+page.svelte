<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-messages - Multi-Channel Messaging | SMRT Framework</title>
	<meta
		name="description"
		content="Multi-channel messaging with STI hierarchies for Email, Slack, Twitter (Tweet) and credential encryption via smrt-secrets."
	/>
</svelte:head>

<ModulePage
	name="smrt-messages"
	description="Multi-channel messaging with STI hierarchies for Email, Slack, and Twitter. Credential encryption via smrt-secrets and retry-aware send lifecycle."
	badges={['v0.29.34', 'Email', 'Slack', 'Twitter', 'Encrypted Credentials']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-messages</strong> provides unified multi-channel messaging using single-table
			inheritance on both messages and accounts. <code>Email</code>, <code>Tweet</code>, and
			<code>SlackMessage</code> all share the <code>messages</code> table, while
			<code>EmailAccount</code>, <code>SlackAccount</code>, and <code>TwitterAccount</code> share
			the <code>accounts</code> table. Credentials are stored exclusively via
			<a href="/modules/smrt-secrets">smrt-secrets</a> envelope encryption.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>
					STI message hierarchy: <code>Email</code>, <code>SlackMessage</code>, <code>Tweet</code>
					share <code>messages</code>
				</li>
				<li>
					STI account hierarchy: <code>EmailAccount</code>, <code>SlackAccount</code>,
					<code>TwitterAccount</code>
					share <code>accounts</code>
				</li>
				<li>Send lifecycle: <code>draft → sending → sent / failed</code> with retry budget</li>
				<li>Credential encryption via <code>credentialSecretId</code> → smrt-secrets</li>
				<li>
					Per-channel senders: <code>EmailSender</code>, <code>SlackSender</code>,
					<code>TweetSender</code>
				</li>
				<li>Email filtering via <code>Whitelist</code> / <code>Blacklist</code> models</li>
				<li>
					Attachment owner field renamed to <code>messageId</code> (with deprecation wrapper for the
					old <code>emailId</code>)
				</li>
				<li>
					Svelte 5 UI components including <code>EmailAccountManager</code> and
					<code>EmailFilterManager</code>
				</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-messages
# or
pnpm add @happyvertical/smrt-messages`}
			language="bash"
		/>
		<p>
			Depends on <code>@happyvertical/smrt-core</code>,
			<code>@happyvertical/smrt-secrets</code> (credential encryption), and
			<code>@happyvertical/email</code> (SMTP / IMAP client).
		</p>
	</section>

	<section>
		<h2>Quick Start</h2>

		<h3>1. Create an email account with encrypted credentials</h3>
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

		<h3>2. Send an email (and retry on failure)</h3>
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

// Retry respects maxRetries budget and increments retryCount
if (!result.success) {
  await email.retrySend();
}`}
			language="typescript"
		/>

		<h3>3. Query messages across all channels</h3>
		<CodeBlock
			code={`const messages = new MessageCollection(db);
const recent = await messages.list({
  orderBy: 'createdAt DESC',
  limit: 20,
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>STI hierarchies</h2>

		<h3>Messages (share <code>messages</code> table)</h3>
		<table>
			<thead>
				<tr><th>Type</th><th>STI discriminator</th><th>Key fields</th></tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Message</code></td>
					<td>(base)</td>
					<td
						>accountId, threadId, subject, body, fromAddress, toAddresses, sendStatus, retryCount</td
					>
				</tr>
				<tr>
					<td><code>Email</code></td>
					<td><code>@happyvertical/smrt-messages:Email</code></td>
					<td
						>messageId (RFC 822), inReplyTo, ccAddresses, bccAddresses, htmlBody, textBody,
						folderId, labels, headers</td
					>
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

		<h3>Accounts (share <code>accounts</code> table)</h3>
		<table>
			<thead>
				<tr><th>Type</th><th>STI discriminator</th><th>Notes</th></tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Account</code></td>
					<td>(base)</td>
					<td>providerType, credentialSecretId, isActive, lastSyncAt, settings</td>
				</tr>
				<tr>
					<td><code>EmailAccount</code></td>
					<td><code>@happyvertical/smrt-messages:EmailAccount</code></td>
					<td>SMTP / IMAP provider-specific fields + sync methods</td>
				</tr>
				<tr>
					<td><code>SlackAccount</code></td>
					<td><code>@happyvertical/smrt-messages:SlackAccount</code></td>
					<td>Slack workspace connection</td>
				</tr>
				<tr>
					<td><code>TwitterAccount</code></td>
					<td><code>@happyvertical/smrt-messages:TwitterAccount</code></td>
					<td>Twitter API connection</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Credential security</h2>
		<p>
			Account credentials are stored via <code>credentialSecretId</code> pointing into
			<a href="/modules/smrt-secrets">smrt-secrets</a> envelope encryption (AMK → TDEK → secret). Never
			store passwords as plain fields.
		</p>
		<CodeBlock
			code={`// Always use setCredentials / getCredentials
await account.setCredentials({
  host: 'smtp.example.com',
  user: 'support@example.com',
  pass: process.env.SMTP_PASSWORD,
});

const creds = await account.getCredentials();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Send lifecycle and senders</h2>
		<p>
			<code>message.send()</code> resolves the account, picks a provider-specific sender, and drives
			the status transition. Each channel has a dedicated sender implementing
			<code>MessageSenderInterface</code>:
		</p>
		<table>
			<thead>
				<tr><th>Sender</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>EmailSender</code></td><td
						>Send emails via the <code>@happyvertical/email</code> client</td
					></tr
				>
				<tr><td><code>SlackSender</code></td><td>Post Slack messages via API</td></tr>
				<tr><td><code>TweetSender</code></td><td>Post tweets via the Twitter API</td></tr>
			</tbody>
		</table>
		<p>
			<code>retryCount</code> is incremented on every retry and capped by <code>maxRetries</code>. A
			failed send leaves the message in <code>sendStatus = 'failed'</code> for inspection.
		</p>
	</section>

	<section>
		<h2>Attachments</h2>
		<p>
			Attachments now own a single <code>messageId</code> FK rather than the old
			<code>emailId</code>. The deprecated <code>emailId</code> getter / setter is preserved as a
			compatibility wrapper so legacy callers keep working — but new code should reference
			<code>messageId</code>.
		</p>
		<CodeBlock
			code={`const attachment = new Attachment({
  messageId: email.id,   // not emailId
  filename: 'report.pdf',
  mimeType: 'application/pdf',
  assetId: pdfAsset.id,  // stored via smrt-assets
});
await attachment.save();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Email filtering (Whitelist / Blacklist)</h2>
		<CodeBlock
			code={`import {
  Whitelist, WhitelistCollection,
  Blacklist, BlacklistCollection,
} from '@happyvertical/smrt-messages';

const whitelist = new WhitelistCollection(db);
await whitelist.create({ address: 'trusted@example.com' });

const blacklist = new BlacklistCollection(db);
await blacklist.create({ address: 'spam@example.com' });`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Svelte 5 Components</h2>
		<ul>
			<li>
				<strong>EmailAccountManager</strong>: admin UI for managing email account connections and
				credentials
			</li>
			<li>
				<strong>EmailFilterManager</strong>: admin UI for managing whitelist / blacklist rules
			</li>
			<li><strong>MessageCard</strong>, <strong>MessageList</strong>: display message summaries</li>
			<li>
				<strong>ComposeForm</strong>, <strong>ReplyForm</strong>, <strong>ForwardForm</strong>:
				message composition
			</li>
			<li><strong>ThreadView</strong>, <strong>MessageDetail</strong>: conversation display</li>
			<li><strong>FolderNav</strong>, <strong>MessageFilters</strong>: navigation and filtering</li>
			<li>
				<strong>AccountCard</strong>, <strong>AccountList</strong>, <strong>AccountAvatar</strong>:
				account management
			</li>
			<li>
				<strong>AttachmentChip</strong>, <strong>AttachmentUpload</strong>: attachment handling
			</li>
			<li>
				<strong>SendStatusBadge</strong>, <strong>MessageStatusIndicator</strong>,
				<strong>MessageTypeBadge</strong>: status display
			</li>
			<li>
				<strong>MessageToolbar</strong>, <strong>RecipientInput</strong>: toolbar and input
				components
			</li>
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

	<section>
		<h2>Collections</h2>
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

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>
					Always use <code>setCredentials()</code> / <code>getCredentials()</code> for account credentials
				</li>
				<li>
					Use JSON address helpers: <code>getToAddresses()</code>, <code>getCcAddresses()</code>
				</li>
				<li>
					Handle send failures with <code>retrySend()</code> (respects <code>maxRetries</code>)
				</li>
				<li>Use <code>MessageCollection</code> to query across all channel types</li>
				<li>Reference attachments via <code>messageId</code></li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't store passwords directly — always use smrt-secrets encryption</li>
				<li>
					Don't modify JSON fields directly — use accessor methods (<code>getX()</code> /
					<code>setX()</code>)
				</li>
				<li>Don't override <code>toJSON()</code> — use <code>transformJSON()</code></li>
				<li>Don't use the deprecated <code>emailId</code> on Attachment in new code</li>
				<li>Don't run concurrent syncs on the same account</li>
			</ul>
		</article>
	</section>

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

	<nav>
		<a href="/modules">← Back to Modules</a>
	</nav>
</ModulePage>
