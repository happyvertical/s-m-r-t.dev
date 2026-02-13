<script lang="ts">
	interface Props {
		code: string;
		language?: string;
		filename?: string;
	}

	let { code, language = 'typescript', filename }: Props = $props();
	let copied = $state(false);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="code-block">
	<div class="code-header">
		{#if filename}
			<span class="filename">{filename}</span>
		{:else if language}
			<span class="language">{language}</span>
		{/if}
		<button class="copy-btn" onclick={copyCode} aria-label="Copy code">
			{#if copied}
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
				<span>Copied!</span>
			{:else}
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
				</svg>
				<span>Copy</span>
			{/if}
		</button>
	</div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.code-block {
		background: var(--smrt-color-surface-container-highest, #1a1a1a);
		border-radius: var(--smrt-radius-md, 8px);
		overflow: hidden;
		margin: 16px 0 24px;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: var(--smrt-color-surface-container-high, #252525);
		border-bottom: 1px solid var(--smrt-color-outline-variant, #333);
	}

	.filename,
	.language {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--smrt-color-on-surface-variant, #888);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 1px solid var(--smrt-color-outline, #444);
		border-radius: var(--smrt-radius-sm, 4px);
		padding: 4px 10px;
		color: var(--smrt-color-on-surface-variant, #888);
		font-family: var(--font-sans);
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.copy-btn:hover {
		background: var(--smrt-color-surface-container, #333);
		color: var(--smrt-color-on-surface, #fff);
		border-color: var(--smrt-color-outline-variant, #555);
	}

	.copy-btn svg {
		flex-shrink: 0;
	}

	pre {
		margin: 0;
		padding: 20px;
		overflow-x: auto;
	}

	code {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--smrt-color-on-surface, #f0f0f0);
	}
</style>
