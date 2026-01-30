<script lang="ts">
  import ModulePage from '$lib/components/ModulePage.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-events - Event Management | SMRT Framework</title>
  <meta name="description" content="Hierarchical event management with calendar integration, recurrence patterns, and participant tracking." />
</svelte:head>

<ModulePage 
  name="smrt-events" 
  description="Hierarchical event management with scheduling, ticketing, and calendar integration."
  badges={['v0.19.0', 'Events', 'Calendar']}
>
  <section>
    <h2>Overview</h2>
    <p>
      <strong>smrt-events</strong> provides comprehensive event management with infinite hierarchical nesting, recurring patterns,
      participant tracking, and conflict detection. Perfect for sports, entertainment, conferences, and municipal meetings.
    </p>
    <aside>
      <p><strong>Key Features:</strong></p>
      <ul>
        <li>Hierarchical events with unlimited nesting (games → quarters → goals)</li>
        <li>Event series with flexible recurrence patterns (iCal RRULE compatible)</li>
        <li>Participant tracking with roles, placement, and performance data</li>
        <li>Calendar integration with conflict detection</li>
        <li>MeetingView component (NEW v0.19.0)</li>
        <li>Integration with smrt-places for venue tracking</li>
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
      code={`class EventParticipant extends SmrtObject {
  eventId: string           // FK to Event
  profileId: string         // FK to Profile
  role: string              // 'home' | 'away' | 'speaker' | 'performer' | etc.
  placement?: number        // 0=home, 1=away, etc.
  groupId?: string          // Team/group identifier
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

    <h3>Date Range Queries</h3>
    <CodeBlock
      code={`// Get events for week
const weekEvents = await events.getByDateRange(
  new Date('2025-01-20'),
  new Date('2025-01-27')
);

// Get upcoming events
const upcoming = await events.getUpcoming(10);

// Get in-progress events
const inProgress = await events.getInProgress();

// Check scheduling conflict
import { checkSchedulingConflict } from '@happyvertical/smrt-events/utils';

const hasConflict = checkSchedulingConflict(
  event1Start, event1End,
  event2Start, event2End
);`}
      language="typescript"
    />

    <h3>Recurrence Patterns</h3>
    <CodeBlock
      code={`// Weekly meeting series
const weeklySeries = await series.create({
  name: 'Team Standup',
  recurrence: {
    frequency: 'weekly',
    byDay: ['MO', 'WE', 'FR'],
    until: new Date('2025-12-31')
  }
});

// Monthly board meeting
const monthlySeries = await series.create({
  name: 'Board Meeting',
  recurrence: {
    frequency: 'monthly',
    byMonthDay: [15],  // 15th of each month
    count: 12           // 12 occurrences
  }
});

// Calculate next occurrence
import { calculateNextOccurrence } from '@happyvertical/smrt-events/utils';
const nextDate = calculateNextOccurrence(pattern, new Date());`}
      language="typescript"
    />
  </section>

  <section>
    <h2>MeetingView Component (NEW v0.19.0)</h2>
    <CodeBlock
      code={`<script>
  import { MeetingView } from '@happyvertical/smrt-events/svelte';

  const meeting = {
    id: 'meeting-123',
    slug: 'town-council-2025-01-15',
    name: 'Town Council Meeting',
    startDate: '2025-01-15T19:00:00',
    status: 'scheduled',
    agendaUrl: '/docs/agenda.pdf',
    minutesUrl: '/docs/minutes.pdf',
    videoUrl: 'https://youtube.com/watch?v=...',
    council: {
      id: 'council-1',
      name: 'Oak Creek Town Council',
      timezone: 'America/Denver'
    }
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
    <nav>
      <a href="/modules/smrt-places">
        <h3>smrt-places</h3>
        <p>Venue and location tracking</p>
      </a>
      <a href="/modules/smrt-profiles">
        <h3>smrt-profiles</h3>
        <p>Participant and organizer profiles</p>
      </a>
      <a href="/modules/smrt-core">
        <h3>smrt-core</h3>
        <p>Base classes and framework</p>
      </a>
    </nav>
  </section>

  <nav>
    <a href="/modules">← Back to Modules</a>
    <a href="/modules/smrt-projects">Next: smrt-projects →</a>
  </nav>
</ModulePage>
