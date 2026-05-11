<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-events - Event Management | SMRT Framework</title>
	<meta
		name="description"
		content="Infinite-nesting event hierarchy with series, participant tracking, recurrence patterns, and a dedicated event-owned asset join."
	/>
</svelte:head>

<ModulePage
	name="smrt-events"
	description="Infinite-nesting event hierarchy with series, participant tracking, recurrence patterns, and a dedicated event-owned asset join."
	badges={['v0.24.12', 'Events', '1 Component']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-events</strong> provides infinite-nesting event hierarchy with series,
			participant tracking, recurrence patterns, and the new <code>EventAsset</code> join table for
			event-owned assets. Events can model anything from conferences with sessions to sports games
			with periods and goals.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Infinite hierarchical events via self-referencing <code>parentEventId</code> (games, quarters, goals)</li>
				<li>Event series with recurrence patterns (daily/weekly/monthly/yearly)</li>
				<li>Participant tracking with <code>role</code> (home/away/speaker/etc.), <code>placement</code> (numeric), and <code>groupId</code></li>
				<li><code>EventType</code> with JSON schema for custom fields per type</li>
				<li>Status lifecycle: scheduled, in_progress, completed, cancelled, postponed</li>
				<li><strong>EventAsset</strong> (new): dedicated owned-asset join in <code>event_assets</code> with <code>relationship</code> and <code>sortOrder</code></li>
				<li>Integration with smrt-places (venue via <code>placeId</code>) and smrt-profiles (participants via <code>profileId</code>)</li>
			</ul>
		</aside>

		<h3>Tenancy</h3>
		<p>
			All event models use <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> with a
			nullable <code>tenantId</code>. Global events (<code>tenantId = null</code>) are visible to
			every tenant — useful for shared reference calendars (public holidays, market hours).
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-events`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  EventCollection,
  EventSeriesCollection,
  EventParticipantCollection,
} from '@happyvertical/smrt-events';

const events = await EventCollection.create({ db });
const series = await EventSeriesCollection.create({ db });
const participants = await EventParticipantCollection.create({ db });

const playoffs = await series.create({
  name: 'NBA Playoffs 2026',
  typeId: tournamentTypeId,
  organizerId: nbaProfileId,
  startDate: new Date('2026-04-15'),
  endDate: new Date('2026-06-20'),
});
await playoffs.save();

const game = await events.create({
  name: 'Lakers vs Warriors',
  seriesId: playoffs.id,
  typeId: gameTypeId,
  placeId: arenaId, // FK to smrt-places (plain string, cross-package)
  startDate: new Date('2026-04-20T19:00:00'),
  endDate: new Date('2026-04-20T21:30:00'),
  status: 'scheduled',
});
await game.save();

await participants.create({
  eventId: game.id,
  profileId: lakersProfileId,
  role: 'home',
  placement: 0,
});
await participants.create({
  eventId: game.id,
  profileId: warriorsProfileId,
  role: 'away',
  placement: 1,
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Owned Assets via EventAsset (new)</h2>
		<p>
			<code>event_assets</code> is the canonical join for event-owned assets (recordings, slide
			decks, photos, agendas). Use the helpers on <code>Event</code> and
			<code>EventCollection</code>; reserve generic <code>AssetAssociation</code> for
			cross-cutting / provenance links that don't belong to a single owner.
		</p>
		<CodeBlock
			code={`await game.addAsset(recordingAssetId, {
  relationship: 'recording',
  sortOrder: 0,
});

const recordings = await game.getAssets({ relationship: 'recording' });
await game.removeAsset(recordingAssetId);

// Bulk reads
const byEvent = await events.getAssets([game.id, otherGame.id]);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Event (Hierarchical, STI)</h3>
		<CodeBlock
			code={`class Event extends SmrtObject {
  name: string
  seriesId?: string         // FK to EventSeries
  parentEventId?: string    // Self-referencing hierarchy (no depth limit!)
  typeId: string            // FK to EventType
  placeId?: string          // FK to Place (cross-package plain string)
  description?: string
  startDate?: Date
  endDate?: Date
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  metadata?: string         // JSON string with get/set/update helpers

  // Hierarchy navigation
  async getParent(): Promise<Event | null>
  async getChildren(): Promise<Event[]>
  async getAncestors(): Promise<Event[]>
  async getDescendants(): Promise<Event[]>
  async getRootEvent(): Promise<Event>
  async getHierarchy(): Promise<Event[]>

  // Participants
  async getParticipants(): Promise<EventParticipant[]>

  // Owned assets via event_assets
  async getAssets(opts?): Promise<Asset[]>
  async addAsset(assetId, opts?: { relationship?, sortOrder? }): Promise<void>
  async removeAsset(assetId): Promise<void>
}`}
			language="typescript"
		/>

		<h3>EventSeries (Recurring)</h3>
		<CodeBlock
			code={`class EventSeries extends SmrtObject {
  name: string
  typeId: string
  organizerId: string       // FK to Profile (cross-package plain string)
  recurrence?: RecurrencePattern
}

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval?: number
  count?: number
  until?: Date
  byDay?: string[]
  byMonthDay?: number[]
  byMonth?: number[]
}`}
			language="typescript"
		/>

		<h3>EventParticipant</h3>
		<CodeBlock
			code={`// conflictColumns: ['event_id', 'profile_id', 'role']
class EventParticipant extends SmrtObject {
  eventId: string           // FK to Event (cross-package plain string)
  profileId: string         // FK to Profile (cross-package plain string)
  role: string              // 'home' | 'away' | 'speaker' | 'panelist' | etc.
  placement?: number        // Numeric: 0=home, 1=away, or ranking position
  groupId?: string          // Logical grouping (e.g. team members in a game)
                            // NOT enforced at DB level
  metadata?: Record<string, any>
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Hierarchical Events</h2>
		<CodeBlock
			code={`// game → quarters → individual goal events
const q1 = await events.create({
  name: '1st Quarter',
  parentEventId: game.id,
  startDate: new Date('2026-04-20T19:00:00'),
  endDate: new Date('2026-04-20T19:12:00'),
  typeId: periodTypeId,
});
await q1.save();

const goal = await events.create({
  name: 'LeBron 3-pointer',
  parentEventId: q1.id,
  startDate: new Date('2026-04-20T19:05:23'),
  typeId: scoreTypeId,
  metadata: JSON.stringify({ points: 3, player: 'LeBron James' }),
});
await goal.save();

const ancestors = await goal.getAncestors(); // [q1, game]
const root = await goal.getRootEvent();      // game`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Gotchas</h2>
		<ul>
			<li><strong>No depth limit</strong> on event hierarchy — deep nesting can cause N+1 queries (load with <code>getDescendants()</code> in batch)</li>
			<li><strong><code>placement</code> is numeric</strong>: used for both team ordering (0=home, 1=away) and rankings — context-dependent</li>
			<li><strong><code>groupId</code> not enforced at DB level</strong>: for logical grouping only (e.g. team members in a game)</li>
			<li><strong>Optional tenancy</strong> with nullable <code>tenantId</code></li>
			<li><strong>Metadata stored as JSON string</strong> with get/set/update helpers — graceful parse-error handling</li>
			<li><strong>Owned asset helpers</strong>: use <code>Event.getAssets()</code> / <code>addAsset()</code> / <code>removeAsset()</code> or the matching <code>EventCollection</code> wrappers instead of generic <code>AssetAssociation</code></li>
		</ul>
	</section>

	<section>
		<h2>UI Components</h2>
		<p>
			The <code>@happyvertical/smrt-events</code> package includes a Svelte 5 component for
			displaying meeting information.
		</p>

		<h3>Available Components</h3>
		<div class="link-grid">
			<a href="/components/events/meeting-view" class="link-card">
				<h3>MeetingView</h3>
				<p>Display meeting details with agenda, minutes, and video links</p>
			</a>
		</div>

		<h3>Usage Example</h3>
		<CodeBlock
			code={`<script>
  import { MeetingView } from '@happyvertical/smrt-events/svelte';

  const meeting = {
    id: 'meeting-123',
    name: 'Town Council Meeting',
    startDate: '2026-01-15T19:00:00',
    status: 'scheduled',
    agendaUrl: '/docs/agenda.pdf',
    minutesUrl: '/docs/minutes.pdf',
    videoUrl: 'https://youtube.com/watch?v=...'
  };
</script>

<MeetingView {meeting} calendarUrl="/calendar" />`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use event series for recurring events</li>
				<li>Initialize default event types with <code>initializeDefaults()</code></li>
				<li>Use <code>placement</code> for home/away or speaker order — keep the convention consistent</li>
				<li>Use <code>event_assets</code> (via <code>addAsset()</code>) for recordings, agendas, slide decks</li>
				<li>Eager-load descendants in batch instead of recursing one level at a time</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't create circular hierarchies (parent referencing child)</li>
				<li>Don't store large binary data in metadata — use <code>event_assets</code></li>
				<li>Don't transition completed events back to other states</li>
				<li>Don't rely on <code>groupId</code> for referential integrity — it's not FK-enforced</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-places" class="link-card">
				<h3>smrt-places</h3>
				<p>Venue and location tracking (<code>placeId</code> FK)</p>
			</a>
			<a href="/modules/smrt-profiles" class="link-card">
				<h3>smrt-profiles</h3>
				<p>Participant and organizer profiles (<code>profileId</code> FK)</p>
			</a>
			<a href="/modules/smrt-assets" class="link-card">
				<h3>smrt-assets</h3>
				<p>Asset records joined via <code>event_assets</code></p>
			</a>
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Base classes and framework</p>
			</a>
		</div>
	</section>
</ModulePage>
