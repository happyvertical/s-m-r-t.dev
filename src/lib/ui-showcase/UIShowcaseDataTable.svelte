<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DataTable,
		createDataTableController,
		type DataTableColumn
	} from '@happyvertical/smrt-ui/data';

	interface ReleaseSurface {
		id: string;
		title: string;
		scope: string;
		ownership: string;
		readiness: string;
		summary: string;
		failure: string;
	}

	const surfaces: ReleaseSurface[] = [
		{
			id: 'surface-table',
			title: 'DataTable',
			scope: 'Collection',
			ownership: 'Local or manual',
			readiness: 'Released',
			summary:
				'Search, filters, ordered sorting, paging, expansion, and selection share one controller. Density stays a presentational DataTable prop.',
			failure: 'Duplicate row identities fail closed.'
		},
		{
			id: 'surface-controls',
			title: 'Interaction registry',
			scope: 'Form',
			ownership: 'Application policy',
			readiness: 'Released',
			summary:
				'Stable control identities expose meaning, current state, constraints, and plain-data commands.',
			failure: 'Secret and non-writable controls refuse mutation.'
		},
		{
			id: 'surface-shell',
			title: 'AdminShell',
			scope: 'Workspace',
			ownership: 'ShellState',
			readiness: 'Released',
			summary:
				'Application, tenant, focus, and system scopes share responsive panels and explicit registration.',
			failure: 'Hidden edges do not claim inactive capabilities.'
		},
		{
			id: 'surface-chat',
			title: 'AgentChat',
			scope: 'Conversation',
			ownership: 'Host callbacks',
			readiness: 'Needs shared preview',
			summary:
				'Messages, tool calls, results, errors, loading, and proposed field changes stay visible.',
			failure: 'An inactive session disables submission.'
		},
		{
			id: 'surface-fields',
			title: 'Field policy',
			scope: 'Model form',
			ownership: 'Model and policy',
			readiness: 'Released',
			summary:
				'Model metadata and presentation policy compose rich inputs without replacing write authorization.',
			failure: 'A hidden field is not an authorization rule.'
		},
		{
			id: 'surface-browser-ai',
			title: 'Browser AI',
			scope: 'Browser capability',
			ownership: 'Configured adapter',
			readiness: 'Needs shared preview',
			summary:
				'Speech and local-model hooks expose capability, readiness, progress, generation, and errors.',
			failure: 'No adapter is selected without application configuration.'
		}
	];

	const columns: DataTableColumn<ReleaseSurface>[] = [
		{ id: 'title', label: 'Surface', sortable: true, minWidth: '11rem' },
		{ id: 'scope', label: 'Scope', sortable: true, minWidth: '9rem' },
		{ id: 'ownership', label: 'State owner', sortable: true, minWidth: '11rem' },
		{ id: 'readiness', label: 'Preview status', sortable: true, minWidth: '11rem' }
	];

	const controller = createDataTableController({
		columnIds: columns.map((column) => column.id),
		initialState: { pageSize: 3 }
	});
	let tableState = $state(controller.getState());
	let dense = $state(false);

	onMount(() =>
		controller.subscribe((transition) => {
			tableState = transition.next.state;
		})
	);

	function setSearch(event: Event) {
		controller.dispatch({
			type: 'setSearch',
			search: (event.currentTarget as HTMLInputElement).value
		});
	}

	function toggleReleasedFilter() {
		controller.dispatch({
			type: 'setFilters',
			filters: tableState.filters.length
				? []
				: [{ columnId: 'readiness', operator: 'equals', value: 'Released' }]
		});
	}

	function resetControllerState() {
		controller.dispatch({ type: 'reset' });
		controller.dispatch({ type: 'setPageSize', pageSize: 3 });
	}
</script>

{#snippet expandedSurface({ row }: { row: ReleaseSurface })}
	<div class="expanded-surface">
		<p><strong>Contract:</strong> {row.summary}</p>
		<p><strong>Failure boundary:</strong> {row.failure}</p>
	</div>
{/snippet}

<div class="workbench">
	<div class="workbench-heading">
		<div>
			<p class="eyebrow">Released component</p>
			<h3>Operate a real DataTable</h3>
			<p>
				Controller-backed controls and programmatic commands update the same serializable state.
				Density demonstrates the separate presentational prop.
			</p>
		</div>
		<div class="state-summary" aria-live="polite">
			<strong>{tableState.selectedRowIds.length}</strong>
			<span>selected</span>
		</div>
	</div>

	<div class="table-controls" aria-label="DataTable controls">
		<label>
			<span>Search surfaces</span>
			<input type="search" value={tableState.search} oninput={setSearch} />
		</label>
		<button
			type="button"
			class:active={tableState.filters.length > 0}
			onclick={toggleReleasedFilter}
		>
			{tableState.filters.length ? 'Show every preview status' : 'Show released previews'}
		</button>
		<button type="button" class:active={dense} onclick={() => (dense = !dense)}>
			{dense ? 'Use comfortable rows' : 'Use dense rows'}
		</button>
		<button type="button" onclick={resetControllerState}>Reset controller state</button>
	</div>

	<div class="table-frame">
		<DataTable
			data={surfaces}
			{columns}
			rowKey="id"
			agentAddressable
			selectable
			sortable
			striped
			hoverable
			{dense}
			canExpand={() => true}
			expandedContent={expandedSurface}
			{controller}
			caption="Released SMRT UI surfaces"
		/>
	</div>

	<dl class="controller-state">
		<div>
			<dt>Search</dt>
			<dd>{tableState.search || 'None'}</dd>
		</div>
		<div>
			<dt>Filter</dt>
			<dd>{tableState.filters.length ? 'Released' : 'None'}</dd>
		</div>
		<div>
			<dt>Sort</dt>
			<dd>
				{tableState.sorting.length
					? tableState.sorting.map((rule) => `${rule.columnId} ${rule.direction}`).join(', ')
					: 'None'}
			</dd>
		</div>
		<div>
			<dt>Page</dt>
			<dd>{tableState.page}</dd>
		</div>
		<div>
			<dt>Expanded</dt>
			<dd>{tableState.expandedRowIds.length}</dd>
		</div>
	</dl>
</div>

<style>
	.workbench {
		display: grid;
		gap: var(--smrt-spacing-5, 1.25rem);
		padding: clamp(1rem, 3vw, 1.75rem);
		color: var(--smrt-color-on-surface, #18202b);
		background: var(--smrt-color-surface, #fff);
		border: 1px solid var(--smrt-color-border, #d7dde5);
		border-radius: var(--smrt-radius-xl, 1rem);
	}

	.workbench-heading {
		display: flex;
		gap: 1rem;
		align-items: start;
		justify-content: space-between;
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		color: var(--smrt-color-primary, #3757d5);
		font-size: 0.75rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	h3,
	p {
		margin: 0;
	}

	.workbench-heading p:last-child {
		max-width: 48rem;
		margin-top: 0.45rem;
		color: var(--smrt-color-on-surface-muted, #596474);
	}

	.state-summary {
		display: grid;
		min-width: 5.5rem;
		padding: 0.65rem 0.85rem;
		text-align: center;
		background: var(--smrt-color-surface-variant, #f1f4f8);
		border-radius: var(--smrt-radius-lg, 0.75rem);
	}

	.state-summary strong {
		font-size: 1.25rem;
	}

	.state-summary span {
		color: var(--smrt-color-on-surface-muted, #596474);
		font-size: 0.75rem;
	}

	.table-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		align-items: end;
	}

	.table-controls label {
		display: grid;
		flex: 1 1 14rem;
		gap: 0.35rem;
		font-size: 0.8rem;
		font-weight: 650;
	}

	.table-controls input,
	.table-controls button {
		min-height: 2.65rem;
		padding: 0.6rem 0.8rem;
		color: inherit;
		font: inherit;
		background: var(--smrt-color-surface, #fff);
		border: 1px solid var(--smrt-color-border, #c8d0da);
		border-radius: var(--smrt-radius-md, 0.55rem);
	}

	.table-controls button {
		cursor: pointer;
	}

	.table-controls button:hover,
	.table-controls button.active {
		color: var(--smrt-color-primary, #3757d5);
		border-color: currentColor;
	}

	.table-controls input:focus-visible,
	.table-controls button:focus-visible {
		outline: 3px solid var(--smrt-color-focus, #86a4ff);
		outline-offset: 2px;
	}

	.table-frame {
		overflow-x: auto;
	}

	.expanded-surface {
		display: grid;
		gap: 0.35rem;
		padding: 0.85rem 1rem;
		color: var(--smrt-color-on-surface-muted, #596474);
		background: var(--smrt-color-surface-variant, #f1f4f8);
	}

	.controller-state {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		margin: 0;
		border-top: 1px solid var(--smrt-color-border, #d7dde5);
	}

	.controller-state div {
		min-width: 0;
		padding: 0.8rem;
	}

	.controller-state dt {
		color: var(--smrt-color-on-surface-muted, #596474);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.controller-state dd {
		overflow: hidden;
		margin: 0.25rem 0 0;
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.78rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 720px) {
		.workbench-heading {
			align-items: stretch;
			flex-direction: column;
		}

		.state-summary {
			grid-template-columns: auto auto;
			justify-content: start;
			gap: 0.4rem;
		}

		.controller-state {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
