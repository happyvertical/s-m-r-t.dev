<script lang="ts">
	import { Calendar } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import type { DayEventsData } from '@happyvertical/svelte';

	let selectedDate = $state<string | null>(null);
	let lastNavigation = $state<string | null>(null);

	// Mock events data for demonstration
	const mockEvents: DayEventsData[] = [
		{
			date: '2026-01-15',
			events: [
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
			]
		},
		{
			date: '2026-01-18',
			events: [
				{
					id: '2',
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
					id: '3',
					slug: 'winter-festival',
					name: 'Winter Festival',
					type: 'event',
					startDate: '2026-01-18T10:00:00',
					startTime: '10:00 AM',
					venue: 'Main Street'
				}
			]
		},
		{
			date: '2026-01-22',
			events: [
				{
					id: '4',
					slug: 'planning-committee',
					name: 'Planning Committee',
					type: 'meeting',
					startDate: '2026-01-22T18:30:00',
					startTime: '6:30 PM',
					venue: 'Town Hall',
					councilSlug: 'planning-committee'
				}
			]
		}
	];

	const calendarProps = [
		{
			name: 'events',
			type: 'DayEventsData[] | null',
			default: 'null',
			description: 'Array of events grouped by date for display indicators'
		},
		{
			name: 'year',
			type: 'number',
			default: 'new Date().getFullYear()',
			description: 'Initial year to display'
		},
		{
			name: 'month',
			type: 'number',
			default: 'new Date().getMonth()',
			description: 'Initial month to display (0-indexed, 0 = January)'
		},
		{
			name: 'baseUrl',
			type: 'string',
			default: "'/events'",
			description: 'Base URL for day links (e.g., /events/2026/1/15)'
		},
		{
			name: 'onMonthNavigate',
			type: '(direction: "prev" | "next", year: number, month: number) => void',
			default: 'undefined',
			description: 'Callback when navigating to prev/next month'
		},
		{
			name: 'onDateSelect',
			type: '(date: string, hasEvents: boolean) => void',
			default: 'undefined',
			description: 'Callback when a date cell is clicked'
		},
		{
			name: 'onTodayClick',
			type: '() => void',
			default: 'undefined',
			description: 'Callback when Today button is clicked'
		}
	];

	function handleDateSelect(date: string, hasEvents: boolean) {
		selectedDate = date;
	}

	function handleMonthNavigate(direction: 'prev' | 'next', year: number, month: number) {
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		lastNavigation = `Navigated ${direction} to ${months[month]} ${year}`;
	}
</script>

<svelte:head>
	<title>Calendar | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/calendar">Calendar</a>
		<span>/</span>
		<span>Calendar</span>
	</nav>

	<h1>Calendar</h1>
	<p class="lead">
		A month view calendar component with event indicators and day navigation. Displays events with
		type-specific icons and supports month/year selection.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Calendar } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The Calendar component displays a month view with navigation controls.</p>

	<ComponentExample
		code={`<Calendar />`}
	>
		<Calendar />
	</ComponentExample>

	<h2>With Events</h2>
	<p>
		Pass event data to display indicators on days with events. Events are displayed with
		type-specific icons: meetings, games, and general events.
	</p>

	<ComponentExample
		code={`<script lang="ts">
  import type { DayEventsData } from '@happyvertical/svelte';

  const events: DayEventsData[] = [
    {
      date: '2026-01-15',
      events: [
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
      ]
    },
    {
      date: '2026-01-18',
      events: [
        {
          id: '2',
          slug: 'tigers-vs-bears',
          name: 'Tigers vs Bears',
          type: 'game',
          startDate: '2026-01-18T14:00:00',
          startTime: '2:00 PM',
          homeTeam: 'Tigers',
          awayTeam: 'Bears'
        }
      ]
    }
  ];
</script>

<Calendar events={events} year={2026} month={0} />`}
	>
		<Calendar events={mockEvents} year={2026} month={0} />
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>
		Use callbacks to respond to user interactions. Click a date or navigate months to see the
		callbacks in action.
	</p>

	<ComponentExample
		code={`<script lang="ts">
  let selectedDate = $state<string | null>(null);
  let lastNavigation = $state<string | null>(null);

  function handleDateSelect(date: string, hasEvents: boolean) {
    selectedDate = date;
  }

  function handleMonthNavigate(direction: 'prev' | 'next', year: number, month: number) {
    lastNavigation = \`Navigated \${direction} to \${month + 1}/\${year}\`;
  }
</script>

<Calendar
  events={events}
  year={2026}
  month={0}
  onDateSelect={handleDateSelect}
  onMonthNavigate={handleMonthNavigate}
/>

{#if selectedDate}
  <p>Selected: {selectedDate}</p>
{/if}
{#if lastNavigation}
  <p>{lastNavigation}</p>
{/if}`}
	>
		<div class="interactive-demo">
			<Calendar
				events={mockEvents}
				year={2026}
				month={0}
				onDateSelect={handleDateSelect}
				onMonthNavigate={handleMonthNavigate}
			/>
			<div class="demo-output">
				{#if selectedDate}
					<p><strong>Selected:</strong> {selectedDate}</p>
				{/if}
				{#if lastNavigation}
					<p><strong>Navigation:</strong> {lastNavigation}</p>
				{/if}
				{#if !selectedDate && !lastNavigation}
					<p class="hint">Click a date or navigate months to see callbacks</p>
				{/if}
			</div>
		</div>
	</ComponentExample>

	<h2>Custom Base URL</h2>
	<p>
		The <code>baseUrl</code> prop controls the link destination for each day cell. Links are generated
		as <code>{'{baseUrl}/{year}/{month}/{day}'}</code>.
	</p>

	<ComponentExample
		code={`<Calendar baseUrl="/schedule" />`}
	>
		<Calendar baseUrl="/schedule" />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={calendarProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { DayEventsData, DayEventDetail } from '@happyvertical/svelte';

interface DayEventsData {
  date: string; // YYYY-MM-DD
  events: DayEventDetail[];
}

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
