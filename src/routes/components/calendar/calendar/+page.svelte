<script lang="ts">
	import { Calendar } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockEvents = [
		{
			date: new Date().toISOString().split('T')[0],
			events: [
				{ type: 'meeting' as const, name: 'Town Council Meeting', startTime: '7:00 PM' },
				{ type: 'event' as const, name: 'Community Event', startTime: '2:00 PM' }
			]
		},
		{
			date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			events: [{ type: 'game' as const, name: 'Hockey Game', startTime: '6:00 PM' }]
		},
		{
			date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			events: [
				{ type: 'meeting' as const, name: 'School Board Meeting', startTime: '6:30 PM' },
				{ type: 'event' as const, name: 'Farmers Market', startTime: '8:00 AM' },
				{ type: 'game' as const, name: 'Minor Hockey', startTime: '4:00 PM' },
				{ type: 'event' as const, name: 'Book Club', startTime: '7:00 PM' }
			]
		}
	];

	const calendarProps = [
		{
			name: 'events',
			type: 'DayEventsData[] | null',
			description: 'Array of day event data objects'
		},
		{
			name: 'year',
			type: 'number',
			default: 'current year',
			description: 'Initial year to display'
		},
		{
			name: 'month',
			type: 'number',
			default: 'current month',
			description: 'Initial month to display (0-indexed)'
		},
		{
			name: 'baseUrl',
			type: 'string',
			default: "'/events'",
			description: 'Base URL for day links'
		},
		{
			name: 'onMonthNavigate',
			type: "(direction: 'prev' | 'next', year: number, month: number) => void",
			description: 'Callback when navigating months'
		},
		{
			name: 'onDateSelect',
			type: '(date: string, hasEvents: boolean) => void',
			description: 'Callback when a date is clicked'
		},
		{
			name: 'onTodayClick',
			type: '() => void',
			description: 'Callback when Today button is clicked'
		}
	];
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
		Month view calendar with event indicators, navigation controls, and day linking. Perfect for
		local news sites, event calendars, and scheduling applications.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { Calendar } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple calendar without events.</p>

	<ComponentExample code={`<Calendar />`}>
		<Calendar />
	</ComponentExample>

	<h2>With Events</h2>
	<p>Display event indicators on days with events.</p>

	<ComponentExample
		code={`<Calendar events={[
  {
    date: '2025-01-20',
    events: [
      { type: 'meeting', name: 'Council Meeting', startTime: '7:00 PM' },
      { type: 'event', name: 'Community Event', startTime: '2:00 PM' }
    ]
  }
]} />`}
	>
		<Calendar events={mockEvents} />
	</ComponentExample>

	<h2>Event Types</h2>
	<p>Different icons for different event types.</p>

	<div class="event-types">
		<div class="event-type">
			<span class="event-icon">🏒</span>
			<span class="event-label">game - Sports events</span>
		</div>
		<div class="event-type">
			<span class="event-icon">🏛</span>
			<span class="event-label">meeting - Council/board meetings</span>
		</div>
		<div class="event-type">
			<span class="event-icon">📅</span>
			<span class="event-label">event - General events</span>
		</div>
	</div>

	<h2>Initial Date</h2>
	<p>Start the calendar on a specific month/year.</p>

	<ComponentExample code={`<Calendar year={2025} month={6} />  <!-- July 2025 -->`}>
		<Calendar year={2025} month={6} />
	</ComponentExample>

	<h2>Custom Base URL</h2>
	<p>Change the URL pattern for day links.</p>

	<ComponentExample code={`<Calendar baseUrl="/schedule" />`}>
		<div
			style="font-size: 0.875rem; color: #666; padding: 16px; background: #f5f5f5; border-radius: 4px;"
		>
			Day links will use pattern: <code>/schedule/2025/1/20</code>
		</div>
	</ComponentExample>

	<h2>Callbacks</h2>
	<p>Handle navigation and selection events.</p>

	<ComponentExample
		code={`<Calendar
  onMonthNavigate={(dir, year, month) => console.log(\`Navigated \${dir}\`)}
  onDateSelect={(date, hasEvents) => console.log(\`Selected \${date}\`)}
  onTodayClick={() => console.log('Today clicked')}
/>`}
	>
		<div
			style="font-size: 0.875rem; color: #666; padding: 16px; background: #f5f5f5; border-radius: 4px;"
		>
			<p style="margin: 0;">Callbacks available:</p>
			<ul style="margin: 8px 0 0 0; padding-left: 20px;">
				<li><code>onMonthNavigate</code> - When prev/next month clicked</li>
				<li><code>onDateSelect</code> - When a date cell is clicked</li>
				<li><code>onTodayClick</code> - When Today button is clicked</li>
			</ul>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={calendarProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Calendar } from '@happyvertical/smrt-svelte';

interface DayEventDetail {
  type: 'game' | 'meeting' | 'event';
  name: string;
  startTime: string;
  venue?: string;
  slug?: string;
  councilSlug?: string;
}

interface DayEventsData {
  date: string;  // YYYY-MM-DD
  events: DayEventDetail[];
}

interface Props {
  events?: DayEventsData[] | null;
  year?: number;
  month?: number;  // 0-indexed
  baseUrl?: string;
  onMonthNavigate?: (direction: 'prev' | 'next', year: number, month: number) => void;
  onDateSelect?: (date: string, hasEvents: boolean) => void;
  onTodayClick?: () => void;
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

	.event-types {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 16px 0 32px;
		padding: 20px;
		background: #fafafa;
		border-radius: 8px;
	}

	.event-type {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.event-icon {
		font-size: 1.5rem;
	}

	.event-label {
		color: #666;
		font-size: 0.9rem;
	}
</style>
