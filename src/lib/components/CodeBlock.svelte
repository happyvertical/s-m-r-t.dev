<script lang="ts">
	interface Props {
		code: string;
		language?: string;
		/** Alias for `language` (top-right label). Takes precedence when set. */
		lang?: string;
		filename?: string;
	}

	let { code, language = 'typescript', lang, filename }: Props = $props();
	let copied = $state(false);

	// Resolved language label shown top-right. `lang` wins over `language`.
	let langLabel = $derived(lang ?? language);

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
		{:else}
			<span class="spacer"></span>
		{/if}
		<div class="header-right">
			{#if langLabel}
				<span class="language">{langLabel}</span>
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
	</div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.code-block {
		background: #11150f;
		border: 1px solid rgb(255 255 255 / 9%);
		border-radius: var(--site-radius-md, 12px);
		overflow: hidden;
		margin: 16px 0 24px;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: #191f17;
		border-bottom: 1px solid rgb(255 255 255 / 9%);
	}

	.spacer {
		flex: 1;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.filename,
	.language {
		font-family: var(--site-font-mono);
		font-size: 0.75rem;
		color: #899081;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 1px solid rgb(255 255 255 / 14%);
		border-radius: 999px;
		padding: 4px 10px;
		color: #a5ab9e;
		font-family: var(--site-font-mono);
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.copy-btn:hover {
		background: #242b21;
		color: #fff;
		border-color: rgb(255 255 255 / 26%);
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
		font-family: var(--site-font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		color: #f2eee4;
	}
</style>
