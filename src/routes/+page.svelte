<script lang="ts">
	/**
	 * s-m-r-t.dev landing page — an ecosystem overview of the SMRT framework.
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
			title: 'Vector search',
			body: 'Generate embeddings and run semantic search as ordinary collection queries — the same models, the same query API, backed by your database.',
			iconPath:
				'M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 5 1V3Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-5 1V3Z',
			tags: ['embeddings', 'semantic search']
		},
		{
			title: 'Agents & browser AI',
			body: 'Run agents on a durable dispatch bus with scheduled background jobs. In the browser, do speech-to-text, text-to-speech, and LLM inference on-device, with a warm model cache.',
			iconPath: 'M13 2 3 14h7l-1 8 10-12h-7l1-8Z',
			tags: ['durable dispatch', 'background jobs', 'in-browser STT/TTS/LLM']
		}
	];

	// Section 7 — Runs anywhere. No lock-in.
	const runsCards: LandingCard[] = [
		{
			title: 'getAI()',
			body: 'Pick a provider with one config field and keep the same code. Bedrock alone reaches dozens of underlying models.',
			iconPath:
				'M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8v1a4 4 0 0 0 8 0v-1a4 4 0 0 0 0-8V6a4 4 0 0 0-4-4Z',
			tags: ['OpenAI', 'Anthropic', 'Google', 'AWS Bedrock', 'Hugging Face', 'Ollama', 'Claude CLI']
		},
		{
			title: 'getDatabase()',
			body: 'The same models persist to whichever engine you point them at — from a local file to a managed cluster.',
			iconPath:
				'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 6c0 1.7-3.6 3-8 3s-8-1.3-8-3m16 5c0 1.7-3.6 3-8 3s-8-1.3-8-3M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6',
			tags: ['SQLite', 'Postgres', 'DuckDB', 'JSON']
		}
	];

	const runsNote = 'The open-source stack or the big vendors — your call, same code either way.';
</script>

<svelte:head>
	<title>s-m-r-t — Software as Agentic Domain Logic</title>
	<meta
		name="description"
		content="A TypeScript framework for software that people and agents both operate. Define a domain model once; generate its database schema, REST API, CLI, and MCP tools. Swap AI providers and databases with one field."
	/>
</svelte:head>

<Hero />

<Reveal />

<div class="saadl-note">
	<p>
		<strong>SAADL</strong> — Software as Agentic Domain Logic: software whose domain logic exposes
		the same operations to human users (UI, HTTP, CLI) and to software agents (callable tools).
		<span class="wm">s-m-r-t</span> is a SAADL framework.
	</p>
</div>

<Section
	eyebrow="One model, every interface"
	title="One object, reached over HTTP, the CLI, and as MCP tools"
	intro="A Product is one class. People reach it over HTTP or the CLI; an agent calls it as an MCP tool like product_create. Every surface resolves to the same collection — turn each on with a flag on @smrt(), no adapter code."
	tinted
>
	<ReachIt />
</Section>

<Section
	eyebrow="Batteries included"
	title="Around forty packages, released in lockstep"
	intro="Auth with four-level RBAC, multi-tenancy that filters every query, double-entry billing, vector search, background jobs, content, messaging, assets. They share one ORM, one inheritance model, and one dispatch bus."
	wide
>
	<CapabilityGrid />
</Section>

<Section
	eyebrow="The component library"
	title="Around eighty components you compose — not a UI you hand-build"
	intro="Typed, themeable, accessibility-tested Svelte components — forms, tables, badges, cards, modals, navigation, calendar, chat. The framework generates your API and agent tools; you compose the human screens from parts that already match your data."
	tinted
>
	<ComponentGallery />
</Section>

<Section eyebrow="AI" title="AI, on the server and in the browser" wide>
	<CardRow cards={aiCards} />
</Section>

<Section eyebrow="No lock-in" title="Swap your AI provider or database with one field" tinted wide>
	<CardRow cards={runsCards} note={runsNote} />
</Section>

<Section eyebrow="Start here" title="Get started" wide>
	<GetStarted />
</Section>

<style>
	.saadl-note {
		max-width: 820px;
		margin: 0 auto;
		padding: 28px 24px 8px;
		text-align: center;
	}

	.saadl-note p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--smrt-color-on-surface-variant, #555);
	}

	.saadl-note strong {
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.saadl-note .wm {
		font-family: var(--smrt-font-family-mono, monospace);
		color: var(--smrt-color-primary, #1976d2);
		white-space: nowrap;
	}
</style>
