<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Event Components | s-m-r-t</title>
	<meta name="description" content="Event and calendar components from smrt-events." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-4">Event Components</h1>
	<p class="text-xl text-gray-600 mb-8">
		Calendar and meeting UI components from smrt-events module.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
		<a
			href="/components/events/meeting-view"
			class="block p-6 border rounded hover:border-blue-500 transition"
		>
			<h3 class="text-xl font-semibold mb-2">MeetingView</h3>
			<p class="text-gray-600">Display meeting details with links to agenda, minutes, and video</p>
		</a>
	</div>

	<section class="mb-12">
		<h2 class="text-2xl font-bold mb-4">Usage Example</h2>
		<CodeBlock
			code={`import { MeetingView } from '@happyvertical/smrt-events/svelte';

<MeetingView
  meeting={meeting}
  calendarUrl="https://example.com/calendar.ics"
/>`}
			language="typescript"
		/>
	</section>

	<section>
		<h2 class="text-2xl font-bold mb-4">Related Module</h2>
		<a href="/modules/smrt-events" class="text-blue-600 hover:underline">
			→ See smrt-events module documentation
		</a>
	</section>
</div>
