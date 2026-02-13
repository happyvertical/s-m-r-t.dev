<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		title?: string;
		description?: string;
		code: string;
		language?: string;
		children: Snippet;
	}

	let { title, description, code, language = 'svelte', children }: Props = $props();
	let showCode = $state(true);
</script>

<div class="example">
	{#if title}
		<h3 class="example-title">{title}</h3>
	{/if}
	{#if description}
		<p class="example-description">{description}</p>
	{/if}

	<div class="example-preview">
		{@render children()}
	</div>

	<div class="example-code">
		<button class="toggle-code" onclick={() => (showCode = !showCode)}>
			{showCode ? 'Hide' : 'Show'} Code
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class:rotated={showCode}
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</button>

		{#if showCode}
			<CodeBlock {code} {language} />
		{/if}
	</div>
</div>

<style>
	.example {
		margin: 24px 0;
	}

	.example-title {
		font-size: 1rem;
		font-weight: 600;
		padding: 16px 0;
		margin: 0;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.example-description {
		font-size: 0.9rem;
		color: var(--smrt-color-on-surface-variant, #666);
		padding: 0 0 16px 0;
		margin: 0;
	}

	.example-preview {
		padding: 32px;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: flex-start;
		min-height: 80px;
		background: var(--smrt-color-surface-container-low, #fafafa);
		border-radius: var(--smrt-radius-md, 8px);
	}

	.example-code {
		margin-top: 16px;
	}

	.toggle-code {
		display: flex;
		align-items: center;
		gap: 8px;
		width: auto;
		padding: 8px 16px;
		background: var(--smrt-color-surface-container, #f0f0f0);
		border: none;
		border-radius: var(--smrt-radius-md, 8px);
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface-variant, #666);
		cursor: pointer;
		text-align: left;
		transition: background 0.15s ease;
		margin-bottom: 12px;
	}

	.toggle-code:hover {
		background: var(--smrt-color-surface-container-high, #e8e8e8);
	}

	.toggle-code svg {
		transition: transform 0.15s ease;
	}

	.toggle-code svg.rotated {
		transform: rotate(180deg);
	}

	.example-code :global(.code-block) {
		margin: 0;
	}
</style>
