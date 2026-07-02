<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ColorSchemeToggle from '$lib/components/ColorSchemeToggle.svelte';

	const installCode = `npm install @happyvertical/smrt-ui`;

	const basicUsageCode = `<script>
  import { ThemeProvider } from '@happyvertical/smrt-ui/themes';
  import '@happyvertical/smrt-ui/themes/styles/all.css';
<\/script>

<ThemeProvider preset="material" colorScheme="system" persist={true}>
  <YourApp />
</ThemeProvider>`;

	const customThemeCode = `import { createTheme, registerTheme } from '@happyvertical/smrt-ui/themes';

const myTheme = createTheme({
  id: 'brand',
  name: 'Brand Theme',
  extend: 'material',
  light: {
    primary: '#ff6b35',
    background: '#fafafa',
    surface: '#ffffff',
  },
  dark: {
    primary: '#ff8c5a',
    background: '#0a0a0a',
    surface: '#1a1a1a',
  },
  fontFamily: 'Inter, sans-serif',
});

registerTheme(myTheme);

// Now usable as a preset
// <ThemeProvider preset="brand" />`;

	const cssOnlyCode = `/* Import base theme */
@import '@happyvertical/smrt-ui/themes/styles/material.css';

/* Override with custom values */
[data-theme="custom"] {
  --smrt-color-primary: #your-brand-color;
  --smrt-radius-md: 0.75rem;
}`;

	const colorTokens = [
		{ name: 'Primary', bg: 'var(--smrt-color-primary)', text: 'var(--smrt-color-on-primary)' },
		{
			name: 'Secondary',
			bg: 'var(--smrt-color-secondary)',
			text: 'var(--smrt-color-on-secondary)'
		},
		{ name: 'Tertiary', bg: 'var(--smrt-color-tertiary)', text: 'var(--smrt-color-on-tertiary)' },
		{ name: 'Error', bg: 'var(--smrt-color-error)', text: 'var(--smrt-color-on-error)' },
		{ name: 'Success', bg: 'var(--smrt-color-success)', text: 'var(--smrt-color-on-success)' },
		{ name: 'Warning', bg: 'var(--smrt-color-warning)', text: 'var(--smrt-color-on-warning)' }
	];

	const surfaceTokens = [
		{ name: 'Surface', bg: 'var(--smrt-color-surface)', text: 'var(--smrt-color-on-surface)' },
		{
			name: 'Surface Variant',
			bg: 'var(--smrt-color-surface-variant)',
			text: 'var(--smrt-color-on-surface-variant)'
		},
		{
			name: 'Background',
			bg: 'var(--smrt-color-background)',
			text: 'var(--smrt-color-on-background)'
		}
	];
</script>

<Grid>
	<section class="hero">
		<h1>Themes</h1>
		<p class="lead">
			A comprehensive theme system shipped in <code>@happyvertical/smrt-ui</code> with four
			built-in presets — Material, Glass, Studio, and SMRT. Every preset includes light and dark
			modes, exposes its design as CSS custom properties, and supports runtime switching via
			<code>&lt;ThemeProvider&gt;</code>. Register your own themes with <code>createTheme</code> to
			add them to the same picker.
		</p>
	</section>

	<section class="demo">
		<h2>Light &amp; dark</h2>
		<p>Toggle the color scheme — every token below updates live:</p>

		<div class="controls">
			<div class="control-group">
				<h3>Color Scheme</h3>
				<ColorSchemeToggle />
			</div>
		</div>
	</section>

	<section class="showcase">
		<h2>Color Palette</h2>
		<div class="color-grid">
			{#each colorTokens as token}
				<div class="color-swatch">
					<div class="color-block" style="background-color: {token.bg}; color: {token.text};">
						Aa
					</div>
					<span class="color-name">{token.name}</span>
				</div>
			{/each}
		</div>

		<h3>Surfaces</h3>
		<div class="surface-list">
			{#each surfaceTokens as token}
				<div class="surface-item" style="background-color: {token.bg}; color: {token.text};">
					{token.name}
				</div>
			{/each}
		</div>
	</section>

	<section class="themes-list">
		<h2>Built-in Themes</h2>
		<p>Four presets ship in the box (<code>availablePresets</code>):</p>

		<div class="theme-cards">
			<div class="theme-card">
				<h3>🔷 Material</h3>
				<p>
					Modern Google Material Design 3 with refined colors and typography. Features vibrant
					blues, OLED-friendly dark mode, and multi-layer shadows.
				</p>
				<code>preset="material"</code>
			</div>

			<div class="theme-card">
				<h3>💎 Glass</h3>
				<p>
					Apple-inspired glass morphism with backdrop blur effects. Translucent surfaces, system
					colors, and layered depth perception.
				</p>
				<code>preset="glass"</code>
			</div>

			<div class="theme-card">
				<h3>◻️ Studio</h3>
				<p>
					Google AI Studio flat design with minimal aesthetics. Monochromatic base with vibrant
					accents, minimal shadows.
				</p>
				<code>preset="studio"</code>
			</div>

			<div class="theme-card">
				<h3>⬛ SMRT</h3>
				<p>
					The framework's signature theme with a distinctive type stack and strong, grid-driven
					layout. Import <code>themes/styles/fonts.css</code> to pull in its font faces.
				</p>
				<code>preset="smrt"</code>
			</div>
		</div>

		<h3>Custom themes</h3>
		<p>
			This site ships its own <strong>Swiss</strong> theme — created with
			<code>createTheme</code> and added via <code>registerTheme</code>, then referenced as
			<code>preset="swiss"</code>. Any registered theme becomes selectable exactly like a built-in
			preset.
		</p>
	</section>

	<section class="installation">
		<h2>Installation</h2>
		<CodeBlock code={installCode} language="bash" />
	</section>

	<section class="usage">
		<h2>Basic Usage</h2>
		<CodeBlock code={basicUsageCode} language="svelte" />
	</section>

	<section class="custom">
		<h2>Creating Custom Themes</h2>
		<p>Use the <code>createTheme</code> helper to define your own theme:</p>
		<CodeBlock code={customThemeCode} language="typescript" />

		<h3>CSS-Only Approach</h3>
		<p>For simpler cases, you can define a theme entirely in CSS:</p>
		<CodeBlock code={cssOnlyCode} language="css" />
	</section>

	<section class="features">
		<h2>Features</h2>
		<ul>
			<li><strong>4 Built-in Themes:</strong> Material, Glass, Studio, and SMRT presets</li>
			<li><strong>Light & Dark Modes:</strong> Automatic system detection with manual override</li>
			<li>
				<strong>Runtime Switching:</strong> Change presets without a page reload via
				<code>&lt;ThemeProvider&gt;</code> / <code>&lt;ThemeSwitcher&gt;</code>
			</li>
			<li><strong>CSS Custom Properties:</strong> 100+ theme tokens exposed as CSS variables</li>
			<li><strong>Type-Safe:</strong> Full TypeScript support with theme definitions</li>
			<li>
				<strong>Persistent:</strong> Opt-in <code>persist</code> saves preferences to localStorage
			</li>
			<li>
				<strong>Custom Themes:</strong> Create with <code>createTheme</code> and add via
				<code>registerTheme</code>
			</li>
		</ul>
	</section>

	<section class="tokens">
		<h2>CSS Tokens</h2>
		<p>All themes expose CSS custom properties:</p>

		<h3>Colors</h3>
		<pre><code
				>--smrt-color-primary
--smrt-color-on-primary
--smrt-color-surface
--smrt-color-on-surface
--smrt-color-background
--smrt-color-error
--smrt-color-success
--smrt-color-warning</code
			></pre>

		<h3>Typography</h3>
		<pre><code
				>--smrt-typography-body-large-size
--smrt-typography-body-large-line-height
--smrt-typography-body-large-weight
--smrt-font-family</code
			></pre>

		<h3>Elevation</h3>
		<pre><code
				>--smrt-elevation-1
--smrt-elevation-2
--smrt-elevation-3</code
			></pre>
	</section>
</Grid>

<style>
	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline, #e5e5e5);
	}

	section:last-child {
		border-bottom: none;
	}

	h1 {
		font-size: var(--smrt-typography-display-small-size, 2.5rem);
		font-weight: var(--smrt-typography-display-small-weight, 600);
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	h2 {
		font-size: var(--smrt-typography-headline-medium-size, 1.75rem);
		font-weight: var(--smrt-typography-headline-medium-weight, 600);
		margin-bottom: 24px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	h3 {
		font-size: var(--smrt-typography-title-large-size, 1.25rem);
		font-weight: var(--smrt-typography-title-large-weight, 600);
		margin: 24px 0 16px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.lead {
		font-size: var(--smrt-typography-body-large-size, 1.125rem);
		line-height: 1.6;
		color: var(--smrt-color-on-surface-variant, #4a4a4a);
		max-width: 800px;
	}

	.demo {
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: var(--smrt-radius-lg, 0.75rem);
		padding: 32px;
		margin: 24px 0;
	}

	.controls {
		display: flex;
		gap: 32px;
		flex-wrap: wrap;
		margin: 24px 0;
	}

	.control-group h3 {
		margin-top: 0;
		font-size: var(--smrt-typography-label-large-size, 0.875rem);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--smrt-color-on-surface-variant, #4a4a4a);
	}

	.current-theme {
		margin-top: 24px;
		padding: 16px;
		background: var(--smrt-color-primary-container, #ffe5e7);
		border-radius: var(--smrt-radius-md, 0.5rem);
		color: var(--smrt-color-on-primary-container, #9d1c26);
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 16px;
		margin: 24px 0;
	}

	.color-swatch {
		text-align: center;
	}

	.color-block {
		aspect-ratio: 1;
		border-radius: var(--smrt-radius-md, 0.5rem);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: 8px;
	}

	.color-name {
		font-size: var(--smrt-typography-body-small-size, 0.875rem);
		color: var(--smrt-color-on-surface-variant, #4a4a4a);
	}

	.surface-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 400px;
	}

	.surface-item {
		padding: 16px;
		border-radius: var(--smrt-radius-md, 0.5rem);
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
	}

	.theme-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
	}

	.theme-card {
		padding: 24px;
		border: 2px solid var(--smrt-color-outline, #e5e5e5);
		border-radius: var(--smrt-radius-lg, 0.75rem);
		background: var(--smrt-color-surface, #ffffff);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.theme-card.active {
		border-color: var(--smrt-color-primary, #e63946);
		box-shadow: var(--smrt-elevation-2, 0 1px 3px rgba(0, 0, 0, 0.1));
	}

	.theme-card h3 {
		margin-top: 0;
		font-size: var(--smrt-typography-title-large-size, 1.25rem);
	}

	.theme-card p {
		color: var(--smrt-color-on-surface-variant, #4a4a4a);
		font-size: var(--smrt-typography-body-medium-size, 1rem);
		line-height: 1.5;
		margin-bottom: 16px;
	}

	.theme-card code {
		display: inline-block;
		padding: 4px 8px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: var(--smrt-radius-sm, 0.25rem);
		font-size: var(--smrt-typography-body-small-size, 0.875rem);
		font-family: var(--font-mono, monospace);
	}

	.features ul {
		list-style: none;
		padding: 0;
	}

	.features li {
		padding: 12px 0;
		padding-left: 24px;
		position: relative;
		font-size: var(--smrt-typography-body-medium-size, 1rem);
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.features li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--smrt-color-success, #059669);
		font-weight: bold;
	}

	token pre {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 16px;
		border-radius: var(--smrt-radius-md, 0.5rem);
		overflow-x: auto;
		font-family: var(--font-mono, monospace);
		font-size: var(--smrt-typography-body-small-size, 0.875rem);
		line-height: 1.6;
	}

	code {
		font-family: var(--font-mono, monospace);
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: var(--smrt-radius-sm, 0.25rem);
		font-size: 0.9em;
	}

	@media (max-width: 700px) {
		.controls {
			flex-direction: column;
			gap: 24px;
		}

		.color-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
