<script lang="ts">
	import ReferenceFamilyBar from '$lib/components/ReferenceFamilyBar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	const surfaces = [
		{
			label: 'Generated interfaces',
			description: 'Learn the shared model contract behind REST, MCP, WebMCP, and CLI.',
			href: '/reference/interfaces'
		},
		{
			label: 'Package REST, MCP, WebMCP, and CLI tabs',
			description:
				'Choose a package and inspect each generated surface beside its source evidence.',
			href: '/reference/packages'
		},
		{
			label: 'Authorization and security',
			description:
				'Apply the permission catalog, guards, row security, and generated-route defaults.',
			href: '/reference/authorization'
		},
		{
			label: 'Field policy API',
			description: 'Resolve the field metadata that generated human interfaces consume.',
			href: '/reference/field-policies'
		},
		{
			label: 'Configuration',
			description: 'Set generated-surface options through the canonical configuration contract.',
			href: '/reference/configuration'
		},
		{
			label: 'Decorators',
			description: 'Declare the model and field metadata that generation reads.',
			href: '/reference/decorators'
		}
	];
</script>

<SEO
	title="s-m-r-t API reference"
	description="Find generated REST, MCP, WebMCP, CLI, authorization, field-policy, configuration, and decorator contracts."
	url="https://s-m-r-t.dev/reference/api"
/>

<ReferenceFamilyBar id="api" />

<article class="api-reference">
	<header>
		<p>Reference family</p>
		<h1>API Reference</h1>
		<span>
			Start with the generated-interface contract. Then choose a package or a supporting contract.
			The model metadata remains the source for each generated surface.
		</span>
	</header>

	<section>
		<h2>Choose the contract</h2>
		<div>
			{#each surfaces as surface (surface.href)}
				<a href={surface.href}>
					<strong>{surface.label}</strong>
					<span>{surface.description}</span>
					<b aria-hidden="true">→</b>
				</a>
			{/each}
		</div>
	</section>
</article>

<style>
	.api-reference {
		width: min(960px, calc(100% - 40px));
		margin: 0 auto;
		padding: 3rem 0 6rem;
	}

	header {
		max-width: 48rem;
		padding-bottom: 3rem;
	}

	header p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 0.7rem;
		font-size: clamp(2.25rem, 6vw, 4.25rem);
		letter-spacing: -0.05em;
		line-height: 1;
	}

	header span {
		display: block;
		margin-top: 1rem;
		color: var(--site-muted);
		line-height: 1.65;
	}

	section {
		padding-top: 2rem;
		border-top: 1px solid var(--site-line-strong);
	}

	section h2 {
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	section > div {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.65rem;
	}

	section a {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.45rem 1rem;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		color: var(--site-ink);
		text-decoration: none;
	}

	section a:hover {
		border-color: var(--site-accent-strong);
	}

	section strong {
		font-size: 0.82rem;
	}

	section span {
		grid-column: 1;
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.5;
	}

	section b {
		grid-column: 2;
		grid-row: 1 / span 2;
	}

	@media (max-width: 42rem) {
		.api-reference {
			width: min(100% - 28px, 960px);
		}

		section > div {
			grid-template-columns: 1fr;
		}
	}
</style>
