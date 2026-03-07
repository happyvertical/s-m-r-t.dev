<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-events - Event Management | SMRT Framework</title>
	<meta
		name="description"
		content="Infinite-nesting event hierarchy with series, participant tracking, and recurrence patterns."
	/>
</svelte:head>

<ModulePage
	name="smrt-events"
	description="Infinite-nesting event hierarchy with series, participant tracking, and recurrence patterns."
	badges={['v0.20.44', 'Events', '1 Component']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-events</strong> provides infinite-nesting event hierarchy with series, participant
			tracking, and recurrence patterns. Events can model anything from conferences with sessions to
			sports games with periods and goals.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Infinite hierarchical events via self-referencing <code>parentEventId</code> (games, quarters, goals)</li>
				<li>Event series with recurrence patterns (daily/weekly/monthly/yearly)</li>
				<li>Participant tracking with <code>role</code> (home/away/speaker/etc.), <code>placement</code> (numeric), and <code>groupId</code></li>
				<li>EventType with JSON schema for custom fields per type</li>
				<li>Status lifecycle: scheduled, in_progress, completed, cancelled, postponed</li>
				<li>Integration with smrt-places (venue via placeId) and smrt-profiles (participants via profileId)</li>
				<li>Utility functions: scheduling conflict detection, recurrence calculation, date formatting</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-events`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { EventCollection, EventSeriesCollection, EventParticipantCollection } from '@happyvertical/smrt-events';

// Initialize
const events = await EventCollection.create({ db: {...} });
const series = await EventSeriesCollection.create({ db: {...} });
const participants = await EventParticipantCollection.create({ db: {...} });

// Create event series
const playoffs = await series.create({
  name: 'NBA Playoffs 2025',
  typeId: tournamentTypeId,
  organizerId: nbaProfileId,
  startDate: new Date('2025-04-15'),
  endDate: new Date('2025-06-20')
});
await playoffs.save();

// Create game event
const game = await events.create({
  name: 'Lakers vs Warriors',
  seriesId: playoffs.id,
  typeId: gameTypeId,
  placeId: arenaId,
  startDate: new Date('2025-04-20T19:00:00'),
  endDate: new Date('2025-04-20T21:30:00'),
  status: 'scheduled',
  round: 1
});
await game.save();

// Add participants
const lakers = await participants.create({
  eventId: game.id,
  profileId: lakersProfileId,
  role: 'home',
  placement: 0
});
await lakers.save();

const warriors = await participants.create({
  eventId: game.id,
  profileId: warriorsProfileId,
  role: 'away',
  placement: 1
});
await warriors.save();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Event (Hierarchical)</h3>
		<CodeBlock
			code={`class Event extends SmrtObject {
  name: string
  seriesId?: string         // FK to EventSeries
  parentEventId?: string    // Self-referencing hierarchy
  typeId: string            // FK to EventType
  placeId?: string          // FK to Place
  description?: string
  startDate?: Date
  endDate?: Date
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  round?: number            // Sequence in series
  metadata?: Record<string, any>

  // Hierarchy navigation
  async getParent(): Promise<Event | null>
  async getChildren(): Promise<Event[]>
  async getAncestors(): Promise<Event[]>
  async getDescendants(): Promise<Event[]>
  async getRootEvent(): Promise<Event>
  async getHierarchy(): Promise<Event[]>

  // Participants
  async getParticipants(): Promise<EventParticipant[]>

  // Related data
  async getSeries(): Promise<EventSeries | null>
  async getType(): Promise<EventType | null>
  async getPlace(): Promise<Place | null>

  // Status
  updateStatus(newStatus: EventStatus): void
  isInProgress(): boolean
}`}
			language="typescript"
		/>

		<h3>EventSeries (Recurring)</h3>
		<CodeBlock
			code={`class EventSeries extends SmrtObject {
  name: string
  typeId: string
  organizerId: string       // FK to Profile
  description?: string
  startDate?: Date
  endDate?: Date
  recurrence?: RecurrencePattern
  metadata?: Record<string, any>

  async getOrganizer(): Promise<Profile | null>
  async getEvents(): Promise<Event[]>
}

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval?: number          // Every N periods
  count?: number             // Total occurrences
  until?: Date               // End date
  byDay?: string[]           // ['MO', 'WE', 'FR']
  byMonthDay?: number[]      // [1, 15]
  byMonth?: number[]         // [1-12]
}`}
			language="typescript"
		/>

		<h3>EventParticipant</h3>
		<CodeBlock
			code={`// conflictColumns: ['event_id', 'profile_id', 'role']
class EventParticipant extends SmrtObject {
  eventId: string           // FK to Event (plain string, cross-package)
  profileId: string         // FK to Profile (plain string, cross-package)
  role: string              // 'home' | 'away' | 'speaker' | 'panelist' | etc.
  placement?: number        // Numeric: 0=home, 1=away, or ranking position
  groupId?: string          // Logical grouping (e.g., team members in a game)
  metadata?: Record<string, any>

  isHome(): boolean         // placement === 0
  isAway(): boolean         // placement === 1
  async getEvent(): Promise<Event | null>
  async getProfile(): Promise<Profile | null>
  async getGroupParticipants(): Promise<EventParticipant[]>
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Hierarchical Events</h2>
		<CodeBlock
			code={`// Create hierarchical game structure
const game = await events.create({
  name: 'Lakers vs Warriors',
  startDate: new Date('2025-01-20T19:00:00'),
  status: 'scheduled'
});
await game.save();

// Create quarters
const q1 = await events.create({
  name: '1st Quarter',
  parentEventId: game.id,
  startDate: new Date('2025-01-20T19:00:00'),
  endDate: new Date('2025-01-20T19:12:00')
});
await q1.save();

// Create goal event
const goal = await events.create({
  name: 'LeBron 3-pointer',
  parentEventId: q1.id,
  startDate: new Date('2025-01-20T19:05:23'),
  metadata: { points: 3, player: 'LeBron James' }
});
await goal.save();

// Navigate hierarchy
const children = await game.getChildren(); // [q1, q2, q3, q4]
const ancestors = await goal.getAncestors(); // [q1, game]
const root = await goal.getRootEvent(); // game`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Calendar Integration</h2>

		<h3>Utility Functions</h3>
		<CodeBlock
			code={`import {
  checkSchedulingConflict,
  calculateNextOccurrence,
  formatEventDateRange,
  generateEventSlug,
  calculateDuration,
  formatDuration,
  isEventNow,
  getEventStatusFromDates,
  sortEventsByDate,
  validateEventStatus,
  parseRecurrencePattern
} from '@happyvertical/smrt-events';

// Check scheduling conflict
const hasConflict = checkSchedulingConflict(
  event1Start, event1End,
  event2Start, event2End
);

// Duration and formatting
const ms = calculateDuration(startDate, endDate);
const readable = formatDuration(ms); // "2h 30m"
const dateStr = formatEventDateRange(startDate, endDate);

// Status helpers
const status = getEventStatusFromDates(startDate, endDate);
const valid = validateEventStatus('scheduled', 'in_progress');`}
			language="typescript"
		/>

		<h3>Recurrence Patterns</h3>
		<CodeBlock
			code={`// Weekly meeting series
const weeklySeries = await series.create({
  name: 'Team Standup',
  slug: 'team-standup-2025',
  recurrence: {
    frequency: 'weekly',
    interval: 1,
    byDay: ['MO', 'WE', 'FR'],
    until: new Date('2025-12-31')
  }
});

// Monthly board meeting
const monthlySeries = await series.create({
  name: 'Board Meeting',
  slug: 'board-meeting-2025',
  recurrence: {
    frequency: 'monthly',
    byMonthDay: [15],  // 15th of each month
    count: 12           // 12 occurrences
  }
});

// Calculate next occurrence
import { calculateNextOccurrence } from '@happyvertical/smrt-events';
const nextDate = calculateNextOccurrence(pattern, new Date());`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>UI Components</h2>
		<p>
			The <code>@happyvertical/smrt-events</code> package includes Svelte 5 components for displaying
			event and meeting information.
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
    startDate: '2025-01-15T19:00:00',
    status: 'scheduled',
    agendaUrl: '/docs/agenda.pdf',
    minutesUrl: '/docs/minutes.pdf',
    videoUrl: 'https://youtube.com/watch?v=...'
  };
</script>

<MeetingView {meeting} calendarUrl="/calendar" />`}
			language="svelte"
		/>

		<p>
			<a href="/components/events">View all event components →</a>
		</p>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use event series for recurring events</li>
				<li>Check for conflicts before scheduling</li>
				<li>Store performance data in participant metadata</li>
				<li>Initialize default event types with initializeDefaults()</li>
				<li>Use placement field for home/away or speaker order</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't create circular hierarchies (parent references child)</li>
				<li>Don't transition completed events to other states</li>
				<li>Don't skip validation when changing event status</li>
				<li>Don't delete parent events without handling children</li>
				<li>Don't store large binary data in metadata (use smrt-assets)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-places" class="link-card">
				<h3>smrt-places</h3>
				<p>Venue and location tracking</p>
			</a>
			<a href="/modules/smrt-profiles" class="link-card">
				<h3>smrt-profiles</h3>
				<p>Participant and organizer profiles</p>
			</a>
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Base classes and framework</p>
			</a>
		</div>
	</section>
</ModulePage>
