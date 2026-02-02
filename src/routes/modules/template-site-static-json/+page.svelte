<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="template-site-static-json"
	description="Static site template powered by JSON files, SvelteKit, and adapter-static for CDN deployment."
	badges={['v0.19.0', 'Template', 'Static', 'JSON']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>template-site-static-json</strong> is a SvelteKit template that generates static sites from
			JSON data files. Perfect for documentation sites, portfolios, and content sites deployable to any
			CDN.
		</p>
	</section>

	<section>
		<h2>Features</h2>
		<ul>
			<li>JSON-based content management</li>
			<li>Static site generation with SvelteKit</li>
			<li>CDN-ready (CloudFront, Netlify, Vercel)</li>
			<li>SEO optimized with meta tags</li>
			<li>Fast page loads with pre-rendering</li>
		</ul>
	</section>

	<section>
		<h2>Usage</h2>
		<CodeBlock
			code={`npm create smrt-site@latest my-site -- --template static-json
cd my-site
npm install
npm run dev`}
			language="bash"
		/>
	</section>
</ModulePage>
