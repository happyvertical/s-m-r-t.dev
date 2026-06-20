<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-chat"
	description="Chat rooms, threads, and agent sessions with app-controlled tool whitelisting and a unified ChatMessage model for users and agents."
	badges={['v0.29.32', 'Rooms', 'Threads', 'Agent Sessions']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-chat</strong> provides multi-tenant chat infrastructure with public / private
			rooms, direct messages, threaded conversations, and AI agent sessions with configurable tool
			access. <code>ChatMessage</code> is shared by users and agents — there is no separate "agent
			message" type. The <code>allowedTools</code> whitelist is app-controlled, and the framework enforces
			it fail-closed when an agent reply emits a tool call (an empty or unparseable whitelist permits
			no tools).
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>
					Room types: <code>public</code>, <code>private</code>, <code>dm</code>, <code>agent</code>
				</li>
				<li>
					Threaded conversations (<code>rootMessageId</code>, <code>isResolved</code>,
					<code>messageCount</code>)
				</li>
				<li>
					Unified <code>ChatMessage</code> with <code>role</code> + <code>messageType</code> + tool-call
					JSON
				</li>
				<li>
					<code>AgentSession</code>: <code>allowedTools</code> whitelist plus <code>expiresAt</code>
					/ <code>maxTokens</code> / <code>maxMessages</code> budget
				</li>
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

// Create a public room. actorProfileId is the authenticated principal
// the route injects; that actor becomes the owner participant.
const room = await chat.createRoom({
  tenantId: 'tenant-1',
  name: 'General',
  roomType: 'public',
  actorProfileId: 'profile-1',
});

// Send a user message. The message is always authored as actorProfileId
// with role 'user' — the caller cannot supply a senderProfileId or role.
const message = await chat.sendMessage({
  tenantId: 'tenant-1',
  roomId: room.id,
  actorProfileId: 'profile-1',
  content: 'Hello, world!',
});

// Start a threaded conversation
const thread = await chat.startThread({
  tenantId: 'tenant-1',
  roomId: room.id,
  actorProfileId: 'profile-1',
  rootMessageId: message.id,
  title: 'Follow-up discussion',
});

// Reply within the thread
await chat.sendMessage({
  tenantId: 'tenant-1',
  roomId: room.id,
  actorProfileId: 'profile-2',
  content: 'Great point!',
  threadId: thread.id,
});

// Get or create a DM room between two profiles. The acting caller must be
// one of the two DM participants.
const dmRoom = await chat.getOrCreateDM({
  tenantId: 'tenant-1',
  actorProfileId: 'profile-1',
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
			<code>messageType</code> pair lets clients render and filter without branching on entity type.
			<code>toolCallData</code> holds JSON for tool calls and results when the message is part of an agent
			turn.
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
			The <code>agentId</code> is intentionally a plain string reference, not a foreign key, so chat
			is decoupled from any specific agent registry. Budgets are flexible: an agent can be limited
			by wall-clock (<code>expiresAt</code>), token spend (<code>maxTokens</code>), or message count
			(<code>maxMessages</code>) — singly or in combination.
		</p>
		<CodeBlock
			code={`class AgentSession extends SmrtObject {
  agentId: string                       // String ref (not FK)
  participantProfileId: string          // Profile cross-package ref
  chatRoomId: string | null             // FK to the linked agent room
  status: 'active' | 'closed' | 'expired'
  allowedTools: string                  // JSON array, default '[]' (app-controlled whitelist)
  sessionContext: string                // JSON, default '{}' (multi-turn memory)
  systemPrompt: string
  messageCount: number
  totalTokensUsed: number
  maxTokens: number                     // 0 = unlimited
  maxMessages: number                   // 0 = unlimited
  lastMessageAt: Date | null
  expiresAt: Date | null
  closedAt: Date | null

  isActive(): boolean
  isToolAllowed(toolName: string): boolean
  getAllowedTools(): string[]
  getSessionContext(): Record<string, unknown>
  setSessionContext(ctx: Record<string, unknown>): void
  updateSessionContext(updates: Record<string, unknown>): Promise<void>
  expire(): Promise<void>
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>App-controlled tool whitelisting</h2>
		<p>
			<code>allowedTools</code> is a simple JSON array your app populates on the session. The
			framework owns enforcement: agent-authored replies go through the internal
			<code>sendAgentReply()</code> path (reachable only via the
			<code>@happyvertical/smrt-chat/internal/agent-runtime</code> subpath by trusted in-process
			agent-runtime code), which checks each <code>tool</code> / <code>tool_call</code> message
			against the whitelist fail-closed before emitting it. An empty or unparseable whitelist
			permits no tools. Your app decides <em>which</em> tools an agent may use; SMRT guarantees an agent
			cannot emit a tool message outside that list.
		</p>

		<CodeBlock
			code={`// Create an agent session (auto-creates an agent-type room with maxParticipants=2).
// actorProfileId becomes the owning session participant — you cannot supply a
// participantProfileId to open a session on another profile's behalf.
const { session, room } = await chat.createAgentSession({
  tenantId: 'tenant-1',
  agentId: 'agent-summarizer',
  actorProfileId: 'profile-1',
  allowedTools: ['web-search', 'summarize'],
  systemPrompt: 'You are a research assistant.',
  maxMessages: 100,
});

// Send a USER message within the agent session. The message is always
// authored as the session participant — the caller cannot supply a
// senderProfileId or role (no impersonating the agent from a route).
await chat.sendAgentUserMessage({
  tenantId: 'tenant-1',
  agentSessionId: session.id,
  actorProfileId: 'profile-1',
  content: 'Summarize the latest news',
});

// Always gate sends on isActive() -- expiresAt OR token/message limits
if (session.isActive()) {
  // safe to dispatch
}

// Tool whitelisting is enforced by the framework: the internal agent-runtime
// reply path rejects any tool not in allowedTools, fail-closed. You can also
// inspect the list directly when configuring the agent.
if (session.isToolAllowed(requestedTool)) {
  // the agent runtime is permitted to emit this tool call
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>
					Use <code>ChatService</code> facade for room creation and messaging — it auto-creates participants
					and agent rooms
				</li>
				<li>Check <code>session.isActive()</code> before sending agent messages</li>
				<li>
					Use <code>getSessionContext()</code> / <code>updateSessionContext()</code> for multi-turn memory
				</li>
				<li>
					Populate <code>allowedTools</code> per session — the framework enforces it fail-closed on agent
					replies
				</li>
				<li>Use <code>getOrCreateDM()</code> for direct message rooms (idempotent)</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>
					Don't use the <code>context</code> field for session memory — it's reserved for slug
					scoping. Use <code>sessionContext</code>.
				</li>
				<li>Don't skip session expiry checks (<code>expiresAt</code> or budget limits)</li>
				<li>
					Don't try to author agent (<code>assistant</code>/<code>tool</code>) messages from a route
					— only the internal agent-runtime path may, via
					<code>@happyvertical/smrt-chat/internal/agent-runtime</code>
				</li>
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
