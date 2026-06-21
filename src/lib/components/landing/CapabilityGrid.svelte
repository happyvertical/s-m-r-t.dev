<script lang="ts">
	/**
	 * "Batteries included" — capability cards. Each lists real, published
	 * package names (all under @happyvertical/smrt-*, verified against the smrt
	 * monorepo). Icons are inline SVG so there's no asset dependency.
	 */
	type Capability = {
		title: string;
		desc: string;
		packages: string[];
		icon: string; // key into the icon map below
	};

	const capabilities: Capability[] = [
		{
			title: 'Auth & access',
			desc: 'Users, sign-in, roles, and permissions.',
			packages: ['users', 'profiles'],
			icon: 'shield'
		},
		{
			title: 'Multi-tenancy',
			desc: 'Workspaces and per-tenant data scoping.',
			packages: ['tenancy'],
			icon: 'building'
		},
		{
			title: 'Agents & jobs',
			desc: 'Durable dispatch and background work.',
			packages: ['agents', 'jobs'],
			icon: 'bolt'
		},
		{
			title: 'Vector & memory',
			desc: 'Embeddings, semantic search, and recall.',
			packages: ['core', 'facts'],
			icon: 'brain'
		},
		{
			title: 'Commerce',
			desc: 'Products, carts, and double-entry ledgers.',
			packages: ['commerce', 'ledgers', 'products'],
			icon: 'cart'
		},
		{
			title: 'Content & media',
			desc: 'Documents, images, video, and voice.',
			packages: ['content', 'images', 'video', 'voice'],
			icon: 'media'
		},
		{
			title: 'Messaging & chat',
			desc: 'Threads, chat, and social graphs.',
			packages: ['messages', 'chat', 'social'],
			icon: 'chat'
		},
		{
			title: 'Secrets & flags',
			desc: 'Managed secrets and feature flags.',
			packages: ['secrets', 'features'],
			icon: 'key'
		},
		{
			title: 'UI components',
			desc: 'A typed Svelte component library.',
			packages: ['smrt-svelte'],
			icon: 'layout'
		}
	];

	const ICONS: Record<string, string> = {
		shield: 'M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z',
		building: 'M3 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M16 8h3a2 2 0 0 1 2 2v11M7 7h2M7 11h2M7 15h2',
		bolt: 'M13 2 3 14h7l-1 8 10-12h-7l1-8Z',
		brain: 'M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 5 1V3Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-5 1V3Z',
		cart: 'M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L23 6H6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
		media: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm6 3 6 4-6 4V8Z',
		chat: 'M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4A8.4 8.4 0 1 1 21 11.5Z',
		key: 'M15 2a7 7 0 0 0-6.7 9L2 17.3V22h4.7l1-1v-2h2v-2h2l1.3-1.3A7 7 0 1 0 15 2Zm2 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
		layout: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm0 5h18M9 21V10'
	};
</script>

<div class="cap-grid">
	{#each capabilities as cap (cap.title)}
		<article class="cap-card">
			<span class="cap-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
					<path d={ICONS[cap.icon]} />
				</svg>
			</span>
			<h3 class="cap-title">{cap.title}</h3>
			<p class="cap-desc">{cap.desc}</p>
			<ul class="cap-pkgs">
				{#each cap.packages as pkg}
					<li>smrt-{pkg}</li>
				{/each}
			</ul>
		</article>
	{/each}
</div>

<p class="cap-foot">
	One coherent ecosystem, versioned in lockstep &mdash;
	<a href="/modules">browse every module &rarr;</a>
</p>

<style>
	.cap-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.cap-card {
		padding: 22px;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface, #fff);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			border-color 0.15s ease;
	}

	.cap-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
		border-color: color-mix(in srgb, var(--smrt-color-primary, #1976d2) 40%, transparent);
	}

	.cap-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 42px;
		border-radius: var(--smrt-radius-sm, 6px);
		margin-bottom: 14px;
		background: color-mix(in srgb, var(--smrt-color-primary, #1976d2) 12%, transparent);
		color: var(--smrt-color-primary, #1976d2);
	}

	.cap-title {
		font-size: 1.05rem;
		font-weight: 600;
		margin: 0 0 6px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.cap-desc {
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0 0 14px;
	}

	.cap-pkgs {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 0;
		padding: 0;
	}

	.cap-pkgs li {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.72rem;
		padding: 3px 8px;
		border-radius: 4px;
		background: var(--smrt-color-surface-container, #f1f1f1);
		color: var(--smrt-color-on-surface-variant, #555);
	}

	.cap-foot {
		text-align: center;
		margin: 40px 0 0;
		font-size: 1rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.cap-foot a {
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
		font-weight: 600;
	}

	.cap-foot a:hover {
		text-decoration: underline;
	}

	@media (prefers-reduced-motion: reduce) {
		.cap-card {
			transition: none;
		}
		.cap-card:hover {
			transform: none;
		}
	}

	@media (max-width: 900px) {
		.cap-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 560px) {
		.cap-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
