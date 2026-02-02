<script lang="ts">
	import { DayView } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const today = new Date();

	const mockEvents = [
		{
			type: 'meeting' as const,
			name: 'Town Council Meeting',
			startTime: '7:00 PM',
			venue: 'Town Hall'
		},
		{
			type: 'game' as const,
			name: 'Minor Hockey - Atoms vs Stars',
			startTime: '6:00 PM',
			venue: 'Community Arena',
			slug: 'atoms-vs-stars'
		},
		{ type: 'event' as const, name: 'Farmers Market', startTime: '8:00 AM', venue: 'Main Street' }
	];

	const mockForecast = {
		icon: '☀️',
		high: 5,
		low: -3
	};

	const dayViewProps = [
		{
			name: 'date',
			type: 'Date',
			description: 'Date to display',
			required: true
		},
		{
			name: 'events',
			type: 'DayEventDetail[] | null',
			description: 'Array of events for the day'
		},
		{
			name: 'forecast',
			type: 'DayForecast | null',
			description: 'Weather forecast for the day'
		},
		{
			name: 'calendarUrl',
			type: 'string',
			default: "'/events'",
			description: 'URL for back to calendar link'
		},
		{
			name: 'onEventClick',
			type: '(eventType: string, eventName: string) => void',
			description: 'Callback when an event card is clicked'
		}
	];
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
		Full event list for a specific day with optional weather forecast. Events are grouped by type
		and linkable events have detail pages.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { DayView } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display events for a specific date.</p>

	<ComponentExample code={`<DayView date={new Date()} events={events} />`}>
		<DayView date={today} events={mockEvents} />
	</ComponentExample>

	<h2>With Weather</h2>
	<p>Include weather forecast in the header.</p>

	<ComponentExample
		code={`<DayView
  date={new Date()}
  events={events}
  forecast={{ icon: '☀️', high: 5, low: -3 }}
/>`}
	>
		<DayView date={today} events={mockEvents} forecast={mockForecast} />
	</ComponentExample>

	<h2>Empty State</h2>
	<p>When no events are scheduled.</p>

	<ComponentExample code={`<DayView date={new Date()} events={[]} />`}>
		<DayView date={today} events={[]} />
	</ComponentExample>

	<h2>Event Grouping</h2>
	<p>Events are automatically grouped by type (games, meetings, events).</p>

	<ComponentExample
		code={`<DayView
  date={date}
  events={[
    { type: 'game', name: 'Hockey Game', startTime: '6:00 PM' },
    { type: 'game', name: 'Basketball Game', startTime: '8:00 PM' },
    { type: 'meeting', name: 'Council Meeting', startTime: '7:00 PM' }
  ]}
/>`}
	>
		<DayView
			date={today}
			events={[
				{
					type: 'game' as const,
					name: 'Atoms vs Stars',
					startTime: '6:00 PM',
					venue: 'Arena',
					slug: 'atoms-vs-stars'
				},
				{
					type: 'game' as const,
					name: 'Novice Tournament',
					startTime: '8:00 PM',
					venue: 'Arena',
					slug: 'novice-tournament'
				},
				{ type: 'meeting' as const, name: 'Town Council', startTime: '7:00 PM', venue: 'Town Hall' }
			]}
		/>
	</ComponentExample>

	<h2>Custom Calendar URL</h2>
	<p>Change the back link destination.</p>

	<ComponentExample code={`<DayView date={date} events={events} calendarUrl="/schedule" />`}>
		<div
			style="font-size: 0.875rem; color: #666; padding: 16px; background: #f5f5f5; border-radius: 4px;"
		>
			Back link will navigate to: <code>/schedule</code>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={dayViewProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { DayView } from '@happyvertical/smrt-svelte';

interface DayEventDetail {
  type: 'game' | 'meeting' | 'event';
  name: string;
  startTime: string;
  venue?: string;
  slug?: string;
  councilSlug?: string;
}

interface DayForecast {
  icon: string;  // Weather emoji
  high: number;  // Temperature high
  low: number;   // Temperature low
}

interface Props {
  date: Date;
  events?: DayEventDetail[] | null;
  forecast?: DayForecast | null;
  calendarUrl?: string;
  onEventClick?: (eventType: string, eventName: string) => void;
}`}
		language="typescript"
	/>

	<h2>Event Links</h2>
	<p>Events with slugs automatically link to detail pages:</p>
	<ul class="link-list">
		<li><strong>Games:</strong> <code>/sports/hockey/games/{'{slug}'}/</code></li>
		<li><strong>Meetings:</strong> <code>/meetings/{'{councilSlug}'}/{'{slug}'}/</code></li>
		<li><strong>Events:</strong> No detail pages (display only)</li>
	</ul>
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

	.link-list {
		margin-top: 16px;
		padding-left: 24px;
	}

	.link-list li {
		color: #666;
		margin-bottom: 8px;
		line-height: 1.6;
	}
</style>
