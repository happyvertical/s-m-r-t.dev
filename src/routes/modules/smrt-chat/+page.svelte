<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-chat"
	description="Chat rooms, threads, and agent sessions with app-controlled tool whitelisting and a unified ChatMessage model for users and agents."
	badges={['v0.24.12', 'Rooms', 'Threads', 'Agent Sessions']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-chat</strong> provides multi-tenant chat infrastructure with public / private
			rooms, direct messages, threaded conversations, and AI agent sessions with configurable tool
			access. <code>ChatMessage</code> is shared by users and agents — there is no separate "agent
			message" type. Tool whitelisting is intentionally a contract owned by the consuming app:
			the framework stores the whitelist but does not enforce or scope tool tiers.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Room types: <code>public</code>, <code>private</code>, <code>dm</code>, <code>agent</code></li>
				<li>Threaded conversations (<code>rootMessageId</code>, <code>isResolved</code>, <code>messageCount</code>)</li>
				<li>Unified <code>ChatMessage</code> with <code>role</code> + <code>messageType</code> + tool-call JSON</li>
				<li><code>AgentSession</code>: <code>allowedTools</code> whitelist plus <code>expiresAt</code> / <code>maxTokens</code> / <code>maxMessages</code> budget</li>
				<li><code>ChatService</code> facade for rooms, sessions, and message dispatch</li>
				<li>Tenant scoping required on rooms; optional on agent sessions</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-chat`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { ChatService } from '@happyvertical/smrt-chat';

const chat = await ChatService.create({
  persistence: { type: 'sql', url: 'chat.db' },
});

// Create a public room (creator added as owner participant)
const room = await chat.createRoom({
  tenantId: 'tenant-1',
  name: 'General',
  roomType: 'public',
  createdByProfileId: 'profile-1',
});

// Send a user message
const message = await chat.sendMessage({
  tenantId: 'tenant-1',
  roomId: room.id,
  senderProfileId: 'profile-1',
  content: 'Hello, world!',
});

// Start a threaded conversation
const thread = await chat.startThread({
  tenantId: 'tenant-1',
  roomId: room.id,
  rootMessageId: message.id,
  title: 'Follow-up discussion',
});

// Reply within the thread
await chat.sendMessage({
  tenantId: 'tenant-1',
  roomId: room.id,
  senderProfileId: 'profile-2',
  content: 'Great point!',
  threadId: thread.id,
});

// Get or create a DM room between two profiles
const dmRoom = await chat.getOrCreateDM({
  tenantId: 'tenant-1',
  profileId1: 'profile-1',
  profileId2: 'profile-2',
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>ChatRoom</h3>
		<CodeBlock
			code={`class ChatRoom extends SmrtObject {
  name: string
  roomType: 'public' | 'private' | 'dm' | 'agent'
  status: string
  topic?: string
  maxParticipants?: number
  lastMessageAt?: Date

  // Tenant-scoped (required)
}`}
			language="typescript"
		/>

		<h3>ChatMessage — unified for users and agents</h3>
		<p>
			A single model carries both human and agent traffic. The <code>role</code> +
			<code>messageType</code> pair lets clients render and filter without branching on entity
			type. <code>toolCallData</code> holds JSON for tool calls and results when the message is
			part of an agent turn.
		</p>
		<CodeBlock
			code={`class ChatMessage extends SmrtObject {
  roomId: string
  senderProfileId: string
  content: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  messageType: 'text' | 'system' | 'action' | 'file' | 'tool_call' | 'tool_result'
  threadId?: string
  replyToMessageId?: string
  toolCallData?: string       // JSON for tool interactions
}`}
			language="typescript"
		/>

		<h3>ChatParticipant</h3>
		<CodeBlock
			code={`class ChatParticipant extends SmrtObject {
  roomId: string
  profileId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  onlineStatus: string
  lastReadMessageId?: string
  isMuted: boolean
}`}
			language="typescript"
		/>

		<h3>ChatThread</h3>
		<CodeBlock
			code={`class ChatThread extends SmrtObject {
  roomId: string
  rootMessageId: string
  isResolved: boolean
  messageCount: number
}`}
			language="typescript"
		/>

		<h3>AgentSession</h3>
		<p>
			The <code>agentId</code> is intentionally a plain string reference, not a foreign key, so
			chat is decoupled from any specific agent registry. Budgets are flexible: an agent can be
			limited by wall-clock (<code>expiresAt</code>), token spend (<code>maxTokens</code>), or
			message count (<code>maxMessages</code>) — singly or in combination.
		</p>
		<CodeBlock
			code={`class AgentSession extends SmrtObject {
  agentId: string             // String ref (not FK)
  roomId: string
  allowedTools: string        // JSON string array (app-controlled whitelist)
  sessionContext: string      // JSON for multi-turn memory
  systemPrompt?: string
  maxTokens?: number
  maxMessages?: number
  expiresAt?: Date
  status: string

  isActive(): boolean
  getAllowedTools(): string[]
  getSessionContext(): Record<string, any>
  updateSessionContext(updates: Record<string, any>): void
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>App-controlled tool whitelisting</h2>
		<p>
			<code>allowedTools</code> is a simple JSON array stored on the session. The framework does
			not enforce, scope, or tier the list — that's the app's job. The deliberate framing is:
			your app decides what tools agents can access, then validates each tool call before
			execution. This keeps SMRT agent integrations free of opinion about MCP / tool taxonomies.
		</p>

		<CodeBlock
			code={`// Create an agent session (auto-creates an agent-type room with maxParticipants=2)
const { session, room } = await chat.createAgentSession({
  tenantId: 'tenant-1',
  agentId: 'agent-summarizer',
  participantProfileId: 'profile-1',
  allowedTools: ['web-search', 'summarize'],
  systemPrompt: 'You are a research assistant.',
  maxMessages: 100,
});

// Send a message within the agent session
await chat.sendAgentMessage({
  tenantId: 'tenant-1',
  agentSessionId: session.id,
  senderProfileId: 'profile-1',
  content: 'Summarize the latest news',
  role: 'user',
});

// Always gate sends on isActive() -- expiresAt OR token/message limits
if (session.isActive()) {
  // safe to dispatch
}

// Tool validation is YOUR responsibility:
// Check the whitelist before invoking any tool the agent requests.
const allowed = session.getAllowedTools();
if (!allowed.includes(requestedTool)) {
  throw new Error('Tool not in whitelist');
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>ChatService</code> facade for room creation and messaging — it auto-creates participants and agent rooms</li>
				<li>Check <code>session.isActive()</code> before sending agent messages</li>
				<li>Use <code>getSessionContext()</code> / <code>updateSessionContext()</code> for multi-turn memory</li>
				<li>Validate tool calls against <code>allowedTools</code> in your app logic</li>
				<li>Use <code>getOrCreateDM()</code> for direct message rooms (idempotent)</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't use the <code>context</code> field for session memory — it's reserved for slug scoping. Use <code>sessionContext</code>.</li>
				<li>Don't skip session expiry checks (<code>expiresAt</code> or budget limits)</li>
				<li>Don't rely on the framework for tool validation (app responsibility)</li>
				<li>Don't forget tenant context — <code>ChatRoom</code> requires tenant scoping</li>
				<li>Don't create agent rooms manually — use <code>createAgentSession()</code></li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-agents">
				<h3>smrt-agents</h3>
				<p>Agent lifecycle and DispatchBus messaging</p>
			</a>
			<a href="/modules/smrt-profiles">
				<h3>smrt-profiles</h3>
				<p>User identity and auth</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Multi-tenant scoping</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Per-content chat sessions via Content's chat endpoints</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
