<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Component {
		name: string;
		description: string;
		href?: string;
	}

	interface Category {
		name: string;
		description: string;
		href?: string;
		components: Component[];
	}

	const categories: Category[] = [
		{
			name: 'Forms',
			description: 's-m-r-t form components with voice input support',
			href: '/components/forms',
			components: [
				{ name: 'TextInput', href: '/components/forms/text-input', description: 'Text input with voice support' },
				{ name: 'SelectInput', href: '/components/forms/smrt-select', description: 'Dropdown with voice selection' },
				{ name: 'CheckboxInput', href: '/components/forms/checkbox', description: 'Checkbox with voice control' },
				{ name: 'DateTimeInput', href: '/components/forms/datetime', description: 'Date/time with natural language' },
				{ name: 'AddressInput', href: '/components/forms/address', description: 'Address input with parsing' },
				{ name: 'MoneyInput', href: '/components/forms/money', description: 'Currency input in cents' }
			]
		},
		{
			name: 'UI',
			description: 'Core interface components',
			components: [
				{ name: 'Button', description: 'Versatile button with variants and sizes' },
				{ name: 'Badge', description: 'Status indicator with multiple variants' },
				{ name: 'Card', description: 'Flexible container with header/footer slots' },
				{ name: 'Input', description: 'Text input with validation states' },
				{ name: 'Select', description: 'Dropdown select component' },
				{ name: 'Textarea', description: 'Multiline text input' },
				{ name: 'Toggle', description: 'Toggle/checkbox component' },
				{ name: 'FormGroup', description: 'Form control wrapper with labels' },
				{ name: 'Pagination', description: 'Navigation pagination' }
			]
		},
		{
			name: 'Layout',
			description: 'Page structure components',
			components: [
				{ name: 'Header', description: 'Site header with logo and navigation' },
				{ name: 'Footer', description: 'Site footer component' },
				{ name: 'Container', description: 'Responsive content container' },
				{ name: 'Grid', description: 'Responsive grid layout' },
				{ name: 'Masthead', description: 'Newspaper-style header' }
			]
		},
		{
			name: 'Content',
			description: 'Content display components',
			components: [
				{ name: 'ArticleCard', description: 'Article preview card' },
				{ name: 'ArticleList', description: 'Grid of article cards' },
				{ name: 'Markdown', description: 'Markdown renderer' }
			]
		},
		{
			name: 'Calendar',
			description: 'Date and event components',
			components: [
				{ name: 'Calendar', description: 'Calendar view component' },
				{ name: 'DayView', description: 'Day-specific calendar view' }
			]
		},
		{
			name: 'Feedback',
			description: 'User feedback and progress components',
			components: [
				{ name: 'ProgressBar', href: '/components/feedback/progress-bar', description: 'Visual progress indicator' },
				{ name: 'ConfirmDialog', href: '/components/feedback/confirm-dialog', description: 'Confirmation modal dialog' }
			]
		},
		{
			name: 'Meetings',
			description: 'Meeting display components',
			components: [
				{ name: 'MeetingView', description: 'Meeting details display' }
			]
		}
	];
</script>

<SEO
	title="Components"
	description="Browse 37 production-ready Svelte 5 components for forms, user management, tenants, roles, commerce, projects, and events. All components use runes and Material Design 3."
	url="https://havesmrt.com/components"
	type="website"
/>

<Grid>
	<div class="header">
		<h1>Components</h1>
		<p>Svelte 5 component library with design tokens. Built for the SMRT ecosystem.</p>
	</div>

	<section class="install">
		<h2>Installation</h2>
		<pre><code>npm install @happyvertical/smrt-svelte</code></pre>
		<pre><code>{`// UI and form components
import { Button, Card, Badge, TextInput, StatusBadge } from '@happyvertical/smrt-svelte';

// Or import from specific subpaths
import { TextInput, SelectInput } from '@happyvertical/smrt-svelte/forms';
import { Button, Badge } from '@happyvertical/smrt-svelte/ui';`}</code></pre>
	</section>

	<section class="preview">
		<h2>Quick Preview</h2>
		<pre><code>{`<script>
  import { Button, Badge, Card } from '@happyvertical/smrt-svelte/ui';
</script>

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>`}</code></pre>
	</section>

	{#each categories as category}
		<section class="category">
			<h2>{category.name}</h2>
			<p class="category-desc">{category.description}</p>
			<div class="component-grid">
				{#each category.components as component}
					{#if component.href}
						<a href={component.href} class="component-card component-link">
							<h3>{component.name}</h3>
							<p>{component.description}</p>
						</a>
					{:else}
						<div class="component-card">
							<h3>{component.name}</h3>
							<p>{component.description}</p>
						</div>
					{/if}
				{/each}
			</div>
		</section>
	{/each}

	<section class="tokens">
		<h2>Design Tokens</h2>
		<p>Customize components with CSS custom properties:</p>
		<pre><code>{`:root {
  /* Colors */
  --color-primary: #ff3e00;
  --color-primary-light: #ff6b3d;
  --color-primary-dark: #cc3200;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}`}</code></pre>
	</section>
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.header p {
		font-size: 1.1rem;
		color: #666;
	}

	.install,
	.preview,
	.category,
	.tokens {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.tokens {
		border-bottom: none;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 16px;
	}

	.category-desc {
		color: #666;
		margin-bottom: 24px;
	}

	pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 16px 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		margin-bottom: 16px;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.component-card {
		padding: 20px;
		background: #fafafa;
	}

	.component-link {
		text-decoration: none;
		transition: all 0.2s;
	}

	.component-link:hover {
		background: #f0f0f0;
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.component-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 4px;
		color: #1a1a1a;
	}

	.component-link:hover h3 {
		color: var(--color-accent);
	}

	.component-card p {
		font-size: 0.85rem;
		color: #666;
	}

	@media (max-width: 800px) {
		.component-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
