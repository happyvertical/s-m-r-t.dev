<script lang="ts">
	import { DayView } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import type { DayEventDetail, DayForecast } from '@happyvertical/svelte';

	let lastClickedEvent = $state<string | null>(null);

	// Mock events data for demonstration
	const mockEvents: DayEventDetail[] = [
		{
			id: '1',
			slug: 'town-council-meeting',
			name: 'Town Council Meeting',
			type: 'meeting',
			startDate: '2026-01-15T19:00:00',
			startTime: '7:00 PM',
			venue: 'Town Hall',
			councilSlug: 'town-council'
		},
		{
			id: '2',
			slug: 'planning-committee',
			name: 'Planning Committee',
			type: 'meeting',
			startDate: '2026-01-15T18:00:00',
			startTime: '6:00 PM',
			venue: 'Council Chambers',
			councilSlug: 'planning-committee'
		}
	];

	const gameEvents: DayEventDetail[] = [
		{
			id: '3',
			slug: 'tigers-vs-bears',
			name: 'Tigers vs Bears',
			type: 'game',
			startDate: '2026-01-18T14:00:00',
			startTime: '2:00 PM',
			venue: 'Community Arena',
			homeTeam: 'Tigers',
			awayTeam: 'Bears'
		},
		{
			id: '4',
			slug: 'eagles-vs-hawks',
			name: 'Eagles vs Hawks',
			type: 'game',
			startDate: '2026-01-18T16:30:00',
			startTime: '4:30 PM',
			venue: 'Community Arena',
			homeTeam: 'Eagles',
			awayTeam: 'Hawks'
		}
	];

	const mixedEvents: DayEventDetail[] = [
		{
			id: '5',
			slug: 'winter-festival',
			name: 'Winter Festival Opening',
			type: 'event',
			startDate: '2026-01-20T10:00:00',
			startTime: '10:00 AM',
			venue: 'Main Street'
		},
		{
			id: '6',
			slug: 'tigers-vs-wolves',
			name: 'Tigers vs Wolves',
			type: 'game',
			startDate: '2026-01-20T14:00:00',
			startTime: '2:00 PM',
			venue: 'Community Arena',
			homeTeam: 'Tigers',
			awayTeam: 'Wolves'
		},
		{
			id: '7',
			slug: 'city-council-special',
			name: 'City Council Special Session',
			type: 'meeting',
			startDate: '2026-01-20T19:00:00',
			startTime: '7:00 PM',
			venue: 'City Hall',
			councilSlug: 'city-council'
		}
	];

	const mockForecast: DayForecast = {
		id: 'forecast-1',
		dayName: 'Wednesday',
		date: '2026-01-15',
		icon: '\u{2600}',
		high: 42,
		low: 28,
		hourlyData: []
	};

	const dayViewProps = [
		{
			name: 'date',
			type: 'Date',
			description: 'The date to display',
			required: true
		},
		{
			name: 'events',
			type: 'DayEventDetail[] | null',
			default: 'null',
			description: 'Array of events for the day'
		},
		{
			name: 'forecast',
			type: 'DayForecast | null',
			default: 'null',
			description: 'Weather forecast for the day'
		},
		{
			name: 'calendarUrl',
			type: 'string',
			default: "'/events'",
			description: 'URL for the "Back to Calendar" link'
		},
		{
			name: 'onEventClick',
			type: '(eventType: string, eventName: string) => void',
			default: 'undefined',
			description: 'Callback when an event card is clicked'
		}
	];

	function handleEventClick(eventType: string, eventName: string) {
		lastClickedEvent = `${eventType}: ${eventName}`;
	}
</script>

<svelte:head>
	<title>DayView | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/calendar">Calendar</a>
		<span>/</span>
		<span>DayView</span>
	</nav>

	<h1>DayView</h1>
	<p class="lead">
		A detailed day view component showing all events for a specific date. Events are grouped by
		type (meetings, games, events) with optional weather forecast display.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { DayView } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Pass a date and events array to display the day view.</p>

	<ComponentExample
		code={`<script lang="ts">
  import type { DayEventDetail } from '@happyvertical/svelte';

  const events: DayEventDetail[] = [
    {
      id: '1',
      slug: 'town-council-meeting',
      name: 'Town Council Meeting',
      type: 'meeting',
      startDate: '2026-01-15T19:00:00',
      startTime: '7:00 PM',
      venue: 'Town Hall',
      councilSlug: 'town-council'
    }
  ];
</script>

<DayView date={new Date('2026-01-15')} events={events} />`}
	>
		<DayView date={new Date('2026-01-15')} events={mockEvents} />
	</ComponentExample>

	<h2>Multiple Event Types</h2>
	<p>
		Events are automatically grouped by type: meetings, games, and general events. Each group has
		its own section with a count indicator.
	</p>

	<ComponentExample
		code={`<DayView
  date={new Date('2026-01-20')}
  events={[
    { type: 'event', name: 'Winter Festival', ... },
    { type: 'game', name: 'Tigers vs Wolves', ... },
    { type: 'meeting', name: 'City Council', ... }
  ]}
/>`}
	>
		<DayView date={new Date('2026-01-20')} events={mixedEvents} />
	</ComponentExample>

	<h2>Games Only</h2>
	<p>When showing game events, links to game detail pages are generated automatically.</p>

	<ComponentExample
		code={`<DayView
  date={new Date('2026-01-18')}
  events={[
    { type: 'game', name: 'Tigers vs Bears', ... },
    { type: 'game', name: 'Eagles vs Hawks', ... }
  ]}
/>`}
	>
		<DayView date={new Date('2026-01-18')} events={gameEvents} />
	</ComponentExample>

	<h2>With Weather Forecast</h2>
	<p>Include weather information by passing a forecast object.</p>

	<ComponentExample
		code={`<script lang="ts">
  import type { DayForecast } from '@happyvertical/svelte';

  const forecast: DayForecast = {
    id: 'forecast-1',
    dayName: 'Wednesday',
    date: '2026-01-15',
    icon: '\u{2600}',
    high: 42,
    low: 28,
    hourlyData: []
  };
</script>

<DayView
  date={new Date('2026-01-15')}
  events={events}
  forecast={forecast}
/>`}
	>
		<DayView date={new Date('2026-01-15')} events={mockEvents} forecast={mockForecast} />
	</ComponentExample>

	<h2>Empty State</h2>
	<p>When no events are scheduled, an empty state message is displayed.</p>

	<ComponentExample
		code={`<DayView date={new Date('2026-01-25')} events={[]} />`}
	>
		<DayView date={new Date('2026-01-25')} events={[]} />
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Use the <code>onEventClick</code> callback to respond to event card clicks.</p>

	<ComponentExample
		code={`<script lang="ts">
  let lastClickedEvent = $state<string | null>(null);

  function handleEventClick(eventType: string, eventName: string) {
    lastClickedEvent = \`\${eventType}: \${eventName}\`;
  }
</script>

<DayView
  date={new Date('2026-01-20')}
  events={mixedEvents}
  onEventClick={handleEventClick}
/>

{#if lastClickedEvent}
  <p>Clicked: {lastClickedEvent}</p>
{/if}`}
	>
		<div class="interactive-demo">
			<DayView
				date={new Date('2026-01-20')}
				events={mixedEvents}
				onEventClick={handleEventClick}
			/>
			<div class="demo-output">
				{#if lastClickedEvent}
					<p><strong>Clicked:</strong> {lastClickedEvent}</p>
				{:else}
					<p class="hint">Click an event card to see the callback</p>
				{/if}
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={dayViewProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { DayEventDetail, DayForecast } from '@happyvertical/svelte';

interface DayEventDetail {
  id: string;
  slug: string;
  name: string;
  type: 'game' | 'meeting' | 'event';
  startDate: string; // ISO datetime
  startTime: string; // "7:30 PM"
  venue?: string;
  venueSlug?: string;
  // Game-specific
  homeTeam?: string;
  awayTeam?: string;
  // Meeting-specific
  councilSlug?: string;
}

interface DayForecast {
  id: string;
  dayName: string;
  date: string;
  icon: string; // Weather emoji
  high: number;
  low: number;
  hourlyData: HourlyForecast[];
}`}
		language="typescript"
	/>
</article>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.interactive-demo {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.demo-output {
		padding: 12px 16px;
		background: #f9f9f9;
		border-radius: 6px;
		font-size: 0.9rem;
	}

	.demo-output p {
		margin: 4px 0;
		color: #333;
	}

	.demo-output .hint {
		color: #999;
		font-style: italic;
	}
</style>
