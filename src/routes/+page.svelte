<script lang="ts">
	/**
	 * havesmrt.com landing page — an ecosystem overview of the SMRT framework.
	 *
	 * The site layout (+layout.svelte) already renders the Header and Footer, so
	 * this page begins at the hero. Everything is themed with --smrt-color-*
	 * tokens and works in both light and dark color schemes. Subtle motion (the
	 * staggered fade-in on the four surface panels) is gated behind
	 * prefers-reduced-motion inside the component.
	 *
	 * Honesty notes baked into the copy (verified against the smrt source):
	 *  - is()/do() send only the instruction to the model, not the object data.
	 *  - AI providers: OpenAI, Anthropic, Google (Gemini), AWS Bedrock, Hugging
	 *    Face, and a local Claude CLI — swapped by one config field.
	 *  - Databases: SQLite, Postgres, DuckDB.
	 *  - smrt-gnode is not featured (parked).
	 */
	import Hero from '$lib/components/landing/Hero.svelte';
	import Section from '$lib/components/landing/Section.svelte';
	import Reveal from '$lib/components/landing/Reveal.svelte';
	import ReachIt from '$lib/components/landing/ReachIt.svelte';
	import CapabilityGrid from '$lib/components/landing/CapabilityGrid.svelte';
	import ComponentGallery from '$lib/components/landing/ComponentGallery.svelte';
	import CardRow from '$lib/components/landing/CardRow.svelte';
	import type { LandingCard } from '$lib/components/landing/types';
	import GetStarted from '$lib/components/landing/GetStarted.svelte';

	// Section 6 — AI is built in.
	const aiCards: LandingCard[] = [
		{
			title: 'Vector & memory',
			body: 'Generate embeddings and run semantic search as ordinary SQL methods on your collections. Give any object a memory with remember() and recall() it later.',
			iconPath:
				'M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 5 1V3Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-5 1V3Z',
			tags: ['embeddings', 'semantic search', 'remember()', 'recall()']
		},
		{
			title: 'Agents & browser AI',
			body: 'Run agents on a durable dispatch bus with scheduled background jobs. In the browser, do speech-to-text, text-to-speech, and LLM inference on-device, with a warm model cache.',
			iconPath: 'M13 2 3 14h7l-1 8 10-12h-7l1-8Z',
			tags: ['durable dispatch', 'background jobs', 'in-browser STT/TTS/LLM']
		}
	];

	const aiNote =
		'Honest note: today is() and do() act on the instruction you pass them, not yet on the object’s own field data.';

	// Section 7 — Runs anywhere. No lock-in.
	const runsCards: LandingCard[] = [
		{
			title: 'getAI()',
			body: 'Pick a provider with one config field and keep the same code. Bedrock alone reaches dozens of underlying models.',
			iconPath:
				'M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8v1a4 4 0 0 0 8 0v-1a4 4 0 0 0 0-8V6a4 4 0 0 0-4-4Z',
			tags: ['OpenAI', 'Anthropic', 'Google', 'AWS Bedrock', 'Hugging Face', 'Claude CLI']
		},
		{
			title: 'getDatabase()',
			body: 'The same models persist to whichever engine you point them at — from a local file to a managed cluster.',
			iconPath:
				'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 6c0 1.7-3.6 3-8 3s-8-1.3-8-3m16 5c0 1.7-3.6 3-8 3s-8-1.3-8-3M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6',
			tags: ['SQLite', 'Postgres', 'DuckDB']
		}
	];

	const runsNote = 'The open-source stack or the big vendors — your call, same code either way.';
</script>

<svelte:head>
	<title>s-m-r-t — a batteries-included framework for AI apps</title>
	<meta
		name="description"
		content="Define a model once and SMRT generates your database schema, REST API, CLI, MCP tools, and typed UI — reachable by people and agents alike. Auth, tenants, payments, agents, and vector search included, with no vendor lock-in."
	/>
</svelte:head>

<Hero />

<Reveal />

<Section
	eyebrow="One model, many doors"
	title="Reach it however you work — or however your agent works"
	intro="The same Product is one object. People hit it over HTTP or the CLI; agents call it as an MCP tool; your app drops in a component. No glue code in between."
	tinted
>
	<ReachIt />
</Section>

<Section
	eyebrow="The ecosystem"
	title="Batteries included — one ecosystem, not forty dependencies"
	intro="Roughly 49 packages, designed together and released in lockstep. Compose the ones you need; they already know how to work with each other."
	wide
>
	<CapabilityGrid />
</Section>

<Section
	eyebrow="UI"
	title="A component library you don’t have to build"
	intro="smrt-svelte ships a typed, themeable component library — forms, badges, cards, tables, and more — so your generated data has a face from day one."
	tinted
>
	<ComponentGallery />
</Section>

<Section eyebrow="AI" title="AI is built in" wide>
	<CardRow cards={aiCards} note={aiNote} />
</Section>

<Section eyebrow="Portability" title="Runs anywhere. No lock-in." tinted wide>
	<CardRow cards={runsCards} note={runsNote} />
</Section>

<Section eyebrow="Start here" title="Get started" wide>
	<GetStarted />
</Section>
