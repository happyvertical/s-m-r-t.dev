<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-chat"
	description="Chat rooms, DMs, threads, and agent conversations with tool whitelisting for the SMRT framework."
	badges={['v0.20.44', 'Rooms', 'Threads', 'Agent Sessions']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-chat</strong> provides multi-tenant chat infrastructure with support for public
			and private rooms, direct messages, threaded conversations, reactions, and AI agent sessions
			with configurable tool access.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Room types: public, private, DM, and agent</li>
				<li>Threaded conversations with resolve/reopen lifecycle</li>
				<li>Agent sessions with tool whitelisting and usage limits</li>
				<li>Unified message model for users and AI agents</li>
				<li>ChatService facade for high-level operations</li>
				<li>Emoji reactions and read tracking</li>
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

// Create a public room (creator added as owner)
const room = await chat.createRoom({
  tenantId: 'tenant-1',
  name: 'General',
  roomType: 'public',
  createdByProfileId: 'profile-1',
});

// Send a message
await chat.sendMessage({
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

		<h3>ChatMessage</h3>
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

		<h3>AgentSession</h3>
		<CodeBlock
			code={`class AgentSession extends SmrtObject {
  agentId: string             // String ref (not FK)
  roomId: string
  allowedTools: string        // JSON string array
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
		<h2>Agent Sessions</h2>
		<CodeBlock
			code={`// Create an agent session (auto-creates an agent-type room)
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

// Check session limits before allowing more messages
if (session.isActive()) {
  // Session has not expired or hit token/message limits
}

// Tool whitelisting is app-controlled:
// The framework stores the allowedTools list but
// the consuming app validates before execution`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>ChatService</code> facade for room creation and messaging</li>
				<li>Check <code>session.isActive()</code> before sending agent messages</li>
				<li>Use <code>getSessionContext()</code>/<code>updateSessionContext()</code> for agent memory</li>
				<li>Validate tool calls against <code>allowedTools</code> in your app logic</li>
				<li>Use <code>getOrCreateDM()</code> for direct message rooms</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't use <code>context</code> field directly (reserved for slug scoping -- use <code>sessionContext</code>)</li>
				<li>Don't skip session expiry checks (expiresAt or limit-based)</li>
				<li>Don't rely on framework for tool validation (app responsibility)</li>
				<li>Don't forget tenant context (ChatRoom requires tenant scoping)</li>
				<li>Don't create agent rooms manually (use <code>createAgentSession</code> which auto-creates them)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-agents">
				<h3>smrt-agents</h3>
				<p>Agent lifecycle and messaging</p>
			</a>
			<a href="/modules/smrt-profiles">
				<h3>smrt-profiles</h3>
				<p>User identity and auth</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Multi-tenant scoping</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
