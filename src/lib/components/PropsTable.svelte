<script lang="ts">
	interface Prop {
		name: string;
		type: string;
		default?: string;
		description: string;
		required?: boolean;
	}

	interface Props {
		props: Prop[];
	}

	let { props }: Props = $props();
</script>

<div class="props-table-wrapper">
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			{#each props as prop}
				<tr>
					<td class="prop-name">
						<code>{prop.name}</code>
						{#if prop.required}
							<span class="required">*</span>
						{/if}
					</td>
					<td class="prop-type"><code>{prop.type}</code></td>
					<td class="prop-default">
						{#if prop.default !== undefined}
							<code>{prop.default}</code>
						{:else}
							<span class="no-default">-</span>
						{/if}
					</td>
					<td class="prop-description">{prop.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.props-table-wrapper {
		overflow-x: auto;
		margin: 16px 0;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 12px 16px;
		border-bottom: 1px solid var(--color-grid);
	}

	.props-table th {
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
		background: #fafafa;
	}

	.props-table tbody tr:hover {
		background: #fafafa;
	}

	.prop-name {
		white-space: nowrap;
	}

	.prop-name code {
		font-weight: 600;
		color: var(--color-text);
	}

	.required {
		color: #dc2626;
		margin-left: 4px;
	}

	.prop-type code {
		color: #0ea5e9;
		font-size: 0.85rem;
	}

	.prop-default code {
		color: #666;
		font-size: 0.85rem;
	}

	.no-default {
		color: #999;
	}

	.prop-description {
		color: #666;
		line-height: 1.5;
	}

	code {
		font-family: var(--font-mono);
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
