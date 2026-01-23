<script lang="ts">
	import { Smrt, SelectInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { theme, type Theme } from '$lib/stores/theme';

	const themeOptions = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	function handleThemeChange(value: string) {
		theme.set(value as Theme);
	}

	const storeProps = [
		{
			name: 'theme',
			type: "writable<'light' | 'dark' | 'system'>",
			description: 'The theme store. Subscribe to get current value, use .set() to change.'
		},
		{
			name: 'applyTheme',
			type: "(theme: Theme) => void",
			description: 'Apply a theme to the document. Call on mount and when theme changes.'
		},
		{
			name: 'getEffectiveTheme',
			type: "(theme: Theme) => 'light' | 'dark'",
			description: 'Resolves "system" to the actual light/dark value based on OS preference.'
		}
	];
</script>

<svelte:head>
	<title>ThemeSwitcher | s-m-r-t Theme</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/theme">Theme</a>
		<span>/</span>
		<span>ThemeSwitcher</span>
	</nav>

	<h1>ThemeSwitcher</h1>
	<p class="lead">
		A SelectInput-based theme selector that allows users to choose between light, dark,
		and system themes. Persists to localStorage and respects OS preferences.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { SelectInput } from '@happyvertical/smrt-svelte';
import { theme, applyTheme, type Theme } from '$lib/stores/theme';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Use SelectInput with the theme store for a simple theme switcher.</p>

	<Smrt>
		<ComponentExample
			code={`<script lang="ts">
  import { SelectInput } from '@happyvertical/smrt-svelte';
  import { theme, type Theme } from '$lib/stores/theme';

  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  function handleChange(value: string) {
    theme.set(value as Theme);
  }
</script>

<SelectInput
  name="theme"
  label="Theme"
  options={options}
  value={$theme}
  onchange={handleChange}
/>`}
		>
			<SelectInput
				name="theme-demo"
				label="Theme"
				options={themeOptions}
				value={$theme}
				onchange={handleThemeChange}
			/>
		</ComponentExample>
	</Smrt>

	<h2>Compact Header Variant</h2>
	<p>For use in headers, hide the label and use a smaller width.</p>

	<Smrt>
		<ComponentExample
			code={`<div style="width: 120px;">
  <SelectInput
    name="theme"
    options={options}
    value={$theme}
    onchange={handleChange}
  />
</div>`}
		>
			<div style="width: 120px;">
				<SelectInput
					name="theme-compact"
					options={themeOptions}
					value={$theme}
					onchange={handleThemeChange}
				/>
			</div>
		</ComponentExample>
	</Smrt>

	<h2>Theme Store Setup</h2>
	<p>
		Create a theme store in <code>$lib/stores/theme.ts</code> to manage theme state.
	</p>

	<CodeBlock
		code={`import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'smrt-theme';

function getInitialTheme(): Theme {
  if (!browser) return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function getSystemTheme(): 'light' | 'dark' {
  if (!browser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(getInitialTheme());

  return {
    subscribe,
    set: (value: Theme) => {
      if (browser) {
        localStorage.setItem(STORAGE_KEY, value);
        applyTheme(value);
      }
      set(value);
    },
    toggle: () => {
      update((current) => {
        const effective = getEffectiveTheme(current);
        const next = effective === 'light' ? 'dark' : 'light';
        if (browser) {
          localStorage.setItem(STORAGE_KEY, next);
          applyTheme(next);
        }
        return next;
      });
    }
  };
}

export function applyTheme(theme: Theme) {
  if (!browser) return;
  const effective = getEffectiveTheme(theme);
  document.documentElement.setAttribute('data-theme', effective);
}

export const theme = createThemeStore();`}
		language="typescript"
	/>

	<h2>Root Layout Integration</h2>
	<p>Apply the theme on mount in your root layout.</p>

	<CodeBlock
		code={`<script>
  import { onMount } from 'svelte';
  import { theme, applyTheme } from '$lib/stores/theme';

  let { children } = $props();

  onMount(() => {
    applyTheme($theme);

    // React to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if ($theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  });
</script>

{@render children()}`}
		language="svelte"
	/>

	<h2>CSS Variables</h2>
	<p>
		Add dark theme CSS variables to your stylesheet. The theme is applied via the
		<code>data-theme</code> attribute on the <code>html</code> element.
	</p>

	<CodeBlock
		code={`:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #ff3e00;
  --color-grid: #e5e5e5;
}

:root[data-theme='dark'] {
  --color-bg: #121212;
  --color-text: #e0e0e0;
  --color-accent: #ff6b3d;
  --color-grid: #2a2a2a;
}`}
		language="css"
	/>

	<h2>Store API</h2>
	<PropsTable props={storeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { theme, applyTheme, getEffectiveTheme, type Theme } from '$lib/stores/theme';

// Subscribe to theme changes
const unsubscribe = theme.subscribe((value) => {
  console.log('Theme changed to:', value);
});

// Set theme programmatically
theme.set('dark');

// Toggle between light and dark
theme.toggle();

// Get the resolved theme (light or dark, never system)
const effective = getEffectiveTheme($theme);`}
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
</style>
