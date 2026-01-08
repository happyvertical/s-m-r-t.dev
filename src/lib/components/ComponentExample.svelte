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
		border: 1px solid var(--color-grid);
		border-radius: 4px;
		margin: 24px 0;
	}

	.example-title {
		font-size: 1rem;
		font-weight: 600;
		padding: 16px 20px;
		margin: 0;
		border-bottom: 1px solid var(--color-grid);
		background: #fafafa;
	}

	.example-description {
		font-size: 0.9rem;
		color: #666;
		padding: 12px 20px;
		margin: 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.example-preview {
		padding: 32px 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: center;
		min-height: 80px;
		background: #fff;
	}

	.example-code {
		border-top: 1px solid var(--color-grid);
	}

	.toggle-code {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 12px 20px;
		background: #fafafa;
		border: none;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: #666;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s ease;
	}

	.toggle-code:hover {
		background: #f0f0f0;
	}

	.toggle-code svg {
		transition: transform 0.15s ease;
	}

	.toggle-code svg.rotated {
		transform: rotate(180deg);
	}

	.example-code :global(.code-block) {
		margin: 0;
		border-radius: 0;
	}
</style>
