<script lang="ts">
	import { WeatherHeader } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Extended forecast period type with localHour for hourly display
	interface WeatherHeaderPeriod {
		name: string;
		conditions: string;
		temperature: number;
		windSpeed: number;
		windDirection: number;
		humidity: number;
		precipProbability: number;
		localHour: number;
	}

	interface WeatherHeaderDay {
		day: string;
		icon: string;
		high: number;
		low: number;
		periods: WeatherHeaderPeriod[];
	}

	// Mock forecast data for WeatherHeader (requires localHour for hourly display)
	const mockForecast: WeatherHeaderDay[] = [
		{
			day: 'Mon',
			icon: '☀️',
			high: 22,
			low: 14,
			periods: [
				{ name: 'Morning', conditions: 'Sunny', temperature: 16, windSpeed: 12, windDirection: 180, humidity: 65, precipProbability: 0, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Sunny', temperature: 19, windSpeed: 14, windDirection: 190, humidity: 55, precipProbability: 0, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Mostly Sunny', temperature: 22, windSpeed: 15, windDirection: 200, humidity: 45, precipProbability: 5, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Sunny', temperature: 21, windSpeed: 13, windDirection: 205, humidity: 48, precipProbability: 0, localHour: 15 },
				{ name: 'Evening', conditions: 'Clear', temperature: 19, windSpeed: 10, windDirection: 210, humidity: 55, precipProbability: 0, localHour: 18 },
				{ name: 'Night', conditions: 'Clear', temperature: 15, windSpeed: 8, windDirection: 195, humidity: 65, precipProbability: 0, localHour: 21 }
			]
		},
		{
			day: 'Tue',
			icon: '⛅',
			high: 20,
			low: 12,
			periods: [
				{ name: 'Morning', conditions: 'Partly Cloudy', temperature: 14, windSpeed: 10, windDirection: 170, humidity: 70, precipProbability: 10, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Partly Cloudy', temperature: 17, windSpeed: 12, windDirection: 175, humidity: 60, precipProbability: 10, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Partly Cloudy', temperature: 20, windSpeed: 14, windDirection: 180, humidity: 50, precipProbability: 15, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Mostly Cloudy', temperature: 18, windSpeed: 13, windDirection: 185, humidity: 55, precipProbability: 20, localHour: 15 },
				{ name: 'Evening', conditions: 'Mostly Cloudy', temperature: 16, windSpeed: 11, windDirection: 190, humidity: 62, precipProbability: 15, localHour: 18 },
				{ name: 'Night', conditions: 'Cloudy', temperature: 13, windSpeed: 9, windDirection: 185, humidity: 72, precipProbability: 10, localHour: 21 }
			]
		},
		{
			day: 'Wed',
			icon: '🌧️',
			high: 18,
			low: 11,
			periods: [
				{ name: 'Morning', conditions: 'Light Rain', temperature: 13, windSpeed: 18, windDirection: 220, humidity: 85, precipProbability: 70, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Rain', temperature: 14, windSpeed: 20, windDirection: 225, humidity: 82, precipProbability: 80, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Rain', temperature: 16, windSpeed: 22, windDirection: 230, humidity: 80, precipProbability: 85, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Rain Showers', temperature: 15, windSpeed: 20, windDirection: 235, humidity: 82, precipProbability: 70, localHour: 15 },
				{ name: 'Evening', conditions: 'Light Rain', temperature: 13, windSpeed: 18, windDirection: 240, humidity: 85, precipProbability: 55, localHour: 18 },
				{ name: 'Night', conditions: 'Drizzle', temperature: 11, windSpeed: 14, windDirection: 225, humidity: 88, precipProbability: 40, localHour: 21 }
			]
		},
		{
			day: 'Thu',
			icon: '☁️',
			high: 17,
			low: 10,
			periods: [
				{ name: 'Morning', conditions: 'Overcast', temperature: 12, windSpeed: 14, windDirection: 200, humidity: 75, precipProbability: 20, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Cloudy', temperature: 14, windSpeed: 15, windDirection: 205, humidity: 68, precipProbability: 15, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Cloudy', temperature: 17, windSpeed: 16, windDirection: 210, humidity: 60, precipProbability: 10, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Mostly Cloudy', temperature: 16, windSpeed: 14, windDirection: 205, humidity: 62, precipProbability: 10, localHour: 15 },
				{ name: 'Evening', conditions: 'Mostly Cloudy', temperature: 14, windSpeed: 12, windDirection: 200, humidity: 68, precipProbability: 5, localHour: 18 },
				{ name: 'Night', conditions: 'Cloudy', temperature: 11, windSpeed: 10, windDirection: 195, humidity: 75, precipProbability: 5, localHour: 21 }
			]
		},
		{
			day: 'Fri',
			icon: '🌤️',
			high: 21,
			low: 13,
			periods: [
				{ name: 'Morning', conditions: 'Partly Sunny', temperature: 15, windSpeed: 10, windDirection: 180, humidity: 68, precipProbability: 5, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Mostly Sunny', temperature: 18, windSpeed: 11, windDirection: 185, humidity: 55, precipProbability: 0, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Mostly Sunny', temperature: 21, windSpeed: 12, windDirection: 190, humidity: 48, precipProbability: 0, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Sunny', temperature: 20, windSpeed: 10, windDirection: 195, humidity: 50, precipProbability: 0, localHour: 15 },
				{ name: 'Evening', conditions: 'Partly Cloudy', temperature: 17, windSpeed: 8, windDirection: 200, humidity: 58, precipProbability: 5, localHour: 18 },
				{ name: 'Night', conditions: 'Clear', temperature: 13, windSpeed: 6, windDirection: 185, humidity: 70, precipProbability: 0, localHour: 21 }
			]
		},
		{
			day: 'Sat',
			icon: '☀️',
			high: 24,
			low: 15,
			periods: [
				{ name: 'Morning', conditions: 'Sunny', temperature: 17, windSpeed: 8, windDirection: 175, humidity: 60, precipProbability: 0, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Sunny', temperature: 21, windSpeed: 10, windDirection: 180, humidity: 50, precipProbability: 0, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Sunny', temperature: 24, windSpeed: 12, windDirection: 185, humidity: 42, precipProbability: 0, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Sunny', temperature: 23, windSpeed: 10, windDirection: 190, humidity: 45, precipProbability: 0, localHour: 15 },
				{ name: 'Evening', conditions: 'Clear', temperature: 20, windSpeed: 8, windDirection: 195, humidity: 52, precipProbability: 0, localHour: 18 },
				{ name: 'Night', conditions: 'Clear', temperature: 16, windSpeed: 6, windDirection: 180, humidity: 65, precipProbability: 0, localHour: 21 }
			]
		},
		{
			day: 'Sun',
			icon: '⛅',
			high: 22,
			low: 14,
			periods: [
				{ name: 'Morning', conditions: 'Partly Cloudy', temperature: 16, windSpeed: 10, windDirection: 170, humidity: 65, precipProbability: 5, localHour: 6 },
				{ name: 'Late Morning', conditions: 'Mostly Sunny', temperature: 19, windSpeed: 12, windDirection: 175, humidity: 55, precipProbability: 5, localHour: 9 },
				{ name: 'Afternoon', conditions: 'Partly Cloudy', temperature: 22, windSpeed: 14, windDirection: 180, humidity: 48, precipProbability: 10, localHour: 12 },
				{ name: 'Late Afternoon', conditions: 'Partly Cloudy', temperature: 21, windSpeed: 12, windDirection: 185, humidity: 50, precipProbability: 10, localHour: 15 },
				{ name: 'Evening', conditions: 'Mostly Cloudy', temperature: 18, windSpeed: 10, windDirection: 190, humidity: 58, precipProbability: 15, localHour: 18 },
				{ name: 'Night', conditions: 'Cloudy', temperature: 14, windSpeed: 8, windDirection: 180, humidity: 68, precipProbability: 10, localHour: 21 }
			]
		}
	];

	const headerProps = [
		{
			name: 'forecast',
			type: 'ForecastDay[] | null',
			default: 'undefined',
			description: 'Array of forecast days. If not provided, displays mock data for demonstration.'
		}
	];

	const forecastPeriodType = [
		{
			name: 'name',
			type: 'string',
			description: 'Period name (e.g., "Morning", "Afternoon")'
		},
		{
			name: 'conditions',
			type: 'string',
			description: 'Weather conditions description'
		},
		{
			name: 'temperature',
			type: 'number',
			description: 'Temperature for this period'
		},
		{
			name: 'windSpeed',
			type: 'number',
			description: 'Wind speed in km/h'
		},
		{
			name: 'windDirection',
			type: 'number',
			description: 'Wind direction in degrees (0-360)'
		},
		{
			name: 'humidity',
			type: 'number',
			description: 'Humidity percentage'
		},
		{
			name: 'precipProbability',
			type: 'number',
			description: 'Precipitation probability percentage'
		},
		{
			name: 'localHour',
			type: 'number',
			description: 'Hour of the day (0-23) for hourly display'
		}
	];

	const dayForecastType = [
		{
			name: 'day',
			type: 'string',
			description: 'Short day name (e.g., "Mon", "Tue")'
		},
		{
			name: 'icon',
			type: 'string',
			description: 'Weather icon emoji'
		},
		{
			name: 'high',
			type: 'number',
			description: 'High temperature for the day'
		},
		{
			name: 'low',
			type: 'number',
			description: 'Low temperature for the day'
		},
		{
			name: 'periods',
			type: 'ForecastPeriod[]',
			description: 'Array of forecast periods with localHour for hourly display'
		}
	];
</script>

<svelte:head>
	<title>WeatherHeader | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/weather">Weather</a>
		<span>/</span>
		<span>WeatherHeader</span>
	</nav>

	<h1>WeatherHeader</h1>
	<p class="lead">
		An editorial-style weather widget with tab navigation for multi-day forecasts and expandable hourly detail panels. Features drag-to-scroll navigation and a clean, newspaper-inspired design.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { WeatherHeader } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The WeatherHeader displays a row of day tabs showing date, weather icon, and high/low temperatures. Click a tab to expand and view hourly forecasts for that day.</p>

	<ComponentExample
		code={`<script lang="ts">
  import { WeatherHeader } from '@happyvertical/svelte';
  import type { ForecastDay } from '@happyvertical/svelte';

  const forecast: ForecastDay[] = [
    {
      day: 'Mon',
      icon: '☀️',
      high: 22,
      low: 14,
      periods: [
        { name: 'Morning', conditions: 'Sunny', temperature: 16, windSpeed: 12, windDirection: 180, humidity: 65, precipProbability: 0, localHour: 6 },
        { name: 'Afternoon', conditions: 'Mostly Sunny', temperature: 22, windSpeed: 15, windDirection: 200, humidity: 45, precipProbability: 5, localHour: 12 },
        { name: 'Evening', conditions: 'Clear', temperature: 19, windSpeed: 10, windDirection: 210, humidity: 55, precipProbability: 0, localHour: 18 },
        // ... more periods
      ]
    },
    // ... more days
  ];
</script>

<WeatherHeader {forecast} />`}
	>
		<WeatherHeader forecast={mockForecast} />
	</ComponentExample>

	<h2>Features</h2>
	<ul>
		<li><strong>Tab Navigation:</strong> Click any day tab to expand and view hourly forecast details</li>
		<li><strong>Drag-to-Scroll:</strong> Horizontally scroll through days and hourly cards by dragging</li>
		<li><strong>Hourly Detail Panel:</strong> Shows temperature and "feels like" for each hour when expanded</li>
		<li><strong>Keyboard Navigation:</strong> Use arrow keys to scroll through tabs and hourly cards</li>
		<li><strong>Responsive Design:</strong> Adapts layout and sizing for mobile devices</li>
		<li><strong>Mock Data Fallback:</strong> Displays demonstration data when no forecast is provided</li>
	</ul>

	<h2>Mock Data Mode</h2>
	<p>When no forecast data is provided, the component displays mock data with 10 days of randomized weather:</p>

	<ComponentExample
		code={`<WeatherHeader />`}
	>
		<WeatherHeader />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={headerProps} />

	<h2>TypeScript Types</h2>
	<h3>ForecastDay (for WeatherHeader)</h3>
	<PropsTable props={dayForecastType} />

	<h3>ForecastPeriod (with localHour)</h3>
	<PropsTable props={forecastPeriodType} />

	<h2>Type Definitions</h2>
	<CodeBlock
		code={`import type { ForecastDay, ForecastPeriod } from '@happyvertical/svelte';

// Extended ForecastPeriod for WeatherHeader
interface ForecastPeriod {
  name: string;
  conditions: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipProbability: number;
  localHour: number;  // Required for hourly display
}

interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  periods: ForecastPeriod[];
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul>
		<li>Tab list uses proper ARIA <code>role="tablist"</code> and <code>role="tab"</code> attributes</li>
		<li>Hourly grid uses <code>role="list"</code> and <code>role="listitem"</code> for screen readers</li>
		<li>Keyboard navigation with arrow keys for scrolling</li>
		<li>Collapse button includes <code>aria-label</code> for screen reader users</li>
		<li>ARIA <code>aria-expanded</code> indicates tab expansion state</li>
	</ul>

	<h2>Styling</h2>
	<p>The component uses CSS custom properties that can be customized:</p>
	<CodeBlock
		code={`.weather-widget {
  --widget-radius: 12px;
  --widget-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  --color-warm-white: #faf9f7;
  --color-warm-gray: #f0efed;
  --color-ink: #2c2c2c;
  --color-ink-light: #6b6b6b;
  --color-ink-muted: #9a9a9a;
  --color-accent: #c9a962;
}`}
		language="css"
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

	.prose h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 12px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
