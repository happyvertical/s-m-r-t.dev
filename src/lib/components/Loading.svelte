<script lang="ts">
	interface LoadingProps {
		size?: 'sm' | 'md' | 'lg';
		text?: string;
	}

	let { size = 'md', text = 'Loading...' }: LoadingProps = $props();
</script>

<div class="loading {size}" role="status" aria-live="polite">
	<div class="spinner" aria-hidden="true"></div>
	<span class="text">{text}</span>
	<span class="sr-only">Loading content, please wait</span>
</div>

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 48px;
	}

	.spinner {
		border: 3px solid var(--color-grid);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.loading.sm .spinner {
		width: 24px;
		height: 24px;
		border-width: 2px;
	}

	.loading.md .spinner {
		width: 40px;
		height: 40px;
		border-width: 3px;
	}

	.loading.lg .spinner {
		width: 64px;
		height: 64px;
		border-width: 4px;
	}

	.text {
		font-size: 1rem;
		color: #666;
		font-weight: 500;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
