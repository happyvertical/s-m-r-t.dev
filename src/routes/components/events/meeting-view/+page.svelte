<script lang="ts">
	import { MeetingView } from '@happyvertical/smrt-events/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head><title>MeetingView | s-m-r-t</title></svelte:head>

<article class="prose">
	<h1>MeetingView</h1>
	<p class="lead">Meeting details with links to agenda, minutes, video, and highlights.</p>
	<h2>Installation</h2>
	<CodeBlock
		code={`import { MeetingView } from '@happyvertical/smrt-events/svelte';`}
		language="typescript"
	/>
	<h2>Usage</h2>
	<CodeBlock
		code={`<MeetingView meeting={meeting} calendarUrl="https://example.com/calendar.ics" />`}
		language="svelte"
	/>
</article>

<style>
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
		border-bottom: 1px solid #e5e5e5;
	}
	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}
</style>
