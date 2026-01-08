<script lang="ts">
	import { WeatherForecast } from '@happyvertical/svelte';
	import type { ForecastDay, ForecastPeriod } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock forecast data
	const mockForecast: ForecastDay[] = [
		{
			day: 'Mon',
			icon: '☀️',
			high: 22,
			low: 14,
			periods: [
				{ name: 'Morning (06:00)', conditions: 'Sunny', temperature: 16, windSpeed: 12, windDirection: 180, humidity: 65, precipProbability: 0 },
				{ name: 'Afternoon (12:00)', conditions: 'Mostly Sunny', temperature: 22, windSpeed: 15, windDirection: 200, humidity: 45, precipProbability: 5 },
				{ name: 'Evening (18:00)', conditions: 'Clear', temperature: 19, windSpeed: 10, windDirection: 210, humidity: 55, precipProbability: 0 },
				{ name: 'Night (00:00)', conditions: 'Clear night', temperature: 14, windSpeed: 8, windDirection: 190, humidity: 70, precipProbability: 0 }
			]
		},
		{
			day: 'Tue',
			icon: '⛅',
			high: 20,
			low: 12,
			periods: [
				{ name: 'Morning (06:00)', conditions: 'Partly Cloudy', temperature: 14, windSpeed: 10, windDirection: 170, humidity: 70, precipProbability: 10 },
				{ name: 'Afternoon (12:00)', conditions: 'Partly Cloudy', temperature: 20, windSpeed: 14, windDirection: 180, humidity: 50, precipProbability: 15 },
				{ name: 'Evening (18:00)', conditions: 'Mostly Cloudy', temperature: 17, windSpeed: 12, windDirection: 190, humidity: 60, precipProbability: 20 },
				{ name: 'Night (00:00)', conditions: 'Cloudy night', temperature: 12, windSpeed: 8, windDirection: 180, humidity: 75, precipProbability: 10 }
			]
		},
		{
			day: 'Wed',
			icon: '🌧️',
			high: 18,
			low: 11,
			periods: [
				{ name: 'Morning (06:00)', conditions: 'Light Rain', temperature: 13, windSpeed: 18, windDirection: 220, humidity: 85, precipProbability: 70 },
				{ name: 'Afternoon (12:00)', conditions: 'Rain', temperature: 16, windSpeed: 22, windDirection: 230, humidity: 80, precipProbability: 85 },
				{ name: 'Evening (18:00)', conditions: 'Rain Showers', temperature: 14, windSpeed: 20, windDirection: 240, humidity: 82, precipProbability: 60 },
				{ name: 'Night (00:00)', conditions: 'Light Rain night', temperature: 11, windSpeed: 15, windDirection: 220, humidity: 88, precipProbability: 40 }
			]
		},
		{
			day: 'Thu',
			icon: '☁️',
			high: 17,
			low: 10,
			periods: [
				{ name: 'Morning (06:00)', conditions: 'Overcast', temperature: 12, windSpeed: 14, windDirection: 200, humidity: 75, precipProbability: 20 },
				{ name: 'Afternoon (12:00)', conditions: 'Cloudy', temperature: 17, windSpeed: 16, windDirection: 210, humidity: 60, precipProbability: 15 },
				{ name: 'Evening (18:00)', conditions: 'Mostly Cloudy', temperature: 15, windSpeed: 12, windDirection: 200, humidity: 65, precipProbability: 10 },
				{ name: 'Night (00:00)', conditions: 'Cloudy night', temperature: 10, windSpeed: 10, windDirection: 190, humidity: 78, precipProbability: 5 }
			]
		},
		{
			day: 'Fri',
			icon: '🌤️',
			high: 21,
			low: 13,
			periods: [
				{ name: 'Morning (06:00)', conditions: 'Partly Sunny', temperature: 15, windSpeed: 10, windDirection: 180, humidity: 68, precipProbability: 5 },
				{ name: 'Afternoon (12:00)', conditions: 'Mostly Sunny', temperature: 21, windSpeed: 12, windDirection: 190, humidity: 48, precipProbability: 0 },
				{ name: 'Evening (18:00)', conditions: 'Partly Cloudy', temperature: 18, windSpeed: 8, windDirection: 200, humidity: 55, precipProbability: 5 },
				{ name: 'Night (00:00)', conditions: 'Clear night', temperature: 13, windSpeed: 6, windDirection: 180, humidity: 72, precipProbability: 0 }
			]
		}
	];

	const forecastProps = [
		{
			name: 'forecast',
			type: 'ForecastDay[] | null',
			default: 'undefined',
			description: 'Array of forecast days with periods, temperatures, and conditions'
		}
	];

	const forecastDayType = [
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
			description: 'Array of forecast periods throughout the day'
		}
	];

	const forecastPeriodType = [
		{
			name: 'name',
			type: 'string',
			description: 'Period name with time (e.g., "Morning (06:00)")'
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
		}
	];
</script>

<svelte:head>
	<title>WeatherForecast | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/weather">Weather</a>
		<span>/</span>
		<span>WeatherForecast</span>
	</nav>

	<h1>WeatherForecast</h1>
	<p class="lead">
		An interactive multi-day weather forecast component with expandable day details, tabbed views for day/night conditions, and temperature charts.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { WeatherForecast } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The WeatherForecast component displays a horizontal row of forecast days. Click on a day to expand and see detailed period information, including day/night conditions and a temperature chart.</p>

	<ComponentExample
		code={`<script lang="ts">
  import { WeatherForecast } from '@happyvertical/svelte';
  import type { ForecastDay } from '@happyvertical/svelte';

  const forecast: ForecastDay[] = [
    {
      day: 'Mon',
      icon: '☀️',
      high: 22,
      low: 14,
      periods: [
        { name: 'Morning (06:00)', conditions: 'Sunny', temperature: 16, windSpeed: 12, windDirection: 180, humidity: 65, precipProbability: 0 },
        { name: 'Afternoon (12:00)', conditions: 'Mostly Sunny', temperature: 22, windSpeed: 15, windDirection: 200, humidity: 45, precipProbability: 5 },
        { name: 'Night (00:00)', conditions: 'Clear night', temperature: 14, windSpeed: 8, windDirection: 190, humidity: 70, precipProbability: 0 }
      ]
    },
    // ... more days
  ];
</script>

<WeatherForecast {forecast} />`}
	>
		<WeatherForecast forecast={mockForecast} />
	</ComponentExample>

	<h2>Features</h2>
	<ul>
		<li><strong>Expandable Days:</strong> Click any day to expand and view detailed forecast information</li>
		<li><strong>Tabbed Views:</strong> Switch between Day, Night, and Chart views for each expanded day</li>
		<li><strong>Temperature Chart:</strong> SVG-based line chart showing temperature trends throughout the day</li>
		<li><strong>Wind Direction:</strong> Automatic conversion of wind direction degrees to compass directions (N, NE, E, etc.)</li>
		<li><strong>Today Detection:</strong> Automatically expands today's forecast on initial load</li>
	</ul>

	<h2>Empty State</h2>
	<p>When no forecast data is provided, the component renders nothing:</p>

	<ComponentExample
		code={`<WeatherForecast forecast={null} />`}
	>
		<div style="padding: 20px; color: #666; text-align: center;">
			<WeatherForecast forecast={null} />
			<em>(No content rendered when forecast is null)</em>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={forecastProps} />

	<h2>TypeScript Types</h2>
	<h3>ForecastDay</h3>
	<PropsTable props={forecastDayType} />

	<h3>ForecastPeriod</h3>
	<PropsTable props={forecastPeriodType} />

	<h2>Type Definitions</h2>
	<CodeBlock
		code={`import type { ForecastDay, ForecastPeriod } from '@happyvertical/svelte';

interface ForecastPeriod {
  name: string;
  conditions: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipProbability: number;
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
