<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Project Components | s-m-r-t</title>
	<meta name="description" content="Time tracking and project management components." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-4">Project Components</h1>
	<p class="text-xl text-gray-600 mb-8">
		Time tracking and project management UI from smrt-projects module.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
		<a
			href="/components/projects/time-entry-card"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">TimeEntryCard</h3>
			<p class="text-gray-600">Display individual time entry</p>
		</a>
		<a
			href="/components/projects/time-entry-list"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">TimeEntryList</h3>
			<p class="text-gray-600">List of time entries with filtering</p>
		</a>
		<a
			href="/components/projects/time-summary"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">TimeSummary</h3>
			<p class="text-gray-600">Aggregated time statistics</p>
		</a>
		<a
			href="/components/projects/duration-display"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">DurationDisplay</h3>
			<p class="text-gray-600">Formatted duration with units</p>
		</a>
		<a
			href="/components/projects/approval-actions"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">ApprovalActions</h3>
			<p class="text-gray-600">Approve/reject time entries</p>
		</a>
		<a
			href="/components/projects/bulk-actions"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">BulkActions</h3>
			<p class="text-gray-600">Batch operations on entries</p>
		</a>
		<a
			href="/components/projects/reject-dialog"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">RejectDialog</h3>
			<p class="text-gray-600">Modal for rejection with reason</p>
		</a>
	</div>

	<section class="mb-12">
		<h2 class="text-2xl font-bold mb-4">Usage Example</h2>
		<CodeBlock
			code={`import {
  TimeEntryList,
  TimeSummary,
  ApprovalActions
} from '@happyvertical/smrt-svelte';

<!-- Time tracking dashboard -->
<TimeSummary entries={weekEntries} />
<TimeEntryList {entries} />
<ApprovalActions
  selectedIds={selected}
  onapprove={handleApprove}
  onreject={handleReject}
/>`}
			language="typescript"
		/>
	</section>

	<section>
		<h2 class="text-2xl font-bold mb-4">Related Module</h2>
		<a href="/modules/smrt-projects" class="text-blue-600 hover:underline">
			→ See smrt-projects module documentation
		</a>
	</section>
</div>
