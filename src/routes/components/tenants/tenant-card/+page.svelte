<script lang="ts">
	import { TenantCard } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data
	const mockTenant = { id: 'tenant_1', name: 'Acme Corporation', slug: 'acme' } as any;
	const mockTenant2 = {
		id: 'tenant_2',
		name: 'TechStart Inc',
		slug: 'techstart',
		status: 'trial'
	} as any;
	const mockTenant3 = {
		id: 'tenant_3',
		name: 'Enterprise Co',
		slug: 'enterprise',
		status: 'active'
	} as any;

	let selectedTenant = $state<string | null>(null);

	const cardProps = [
		{
			name: 'tenant',
			type: 'Tenant',
			description: 'Tenant object with id, name, and slug',
			required: true
		},
		{
			name: 'status',
			type: 'string',
			description: 'Status badge (active, trial, suspended, etc.)'
		},
		{
			name: 'memberCount',
			type: 'number',
			description: 'Number of members in the tenant'
		},
		{
			name: 'onclick',
			type: '() => void',
			description: 'Click handler for interactive cards'
		},
		{
			name: 'selected',
			type: 'boolean',
			default: 'false',
			description: 'Whether the card is selected'
		}
	];
</script>

<svelte:head>
	<title>TenantCard | s-m-r-t Components</title>
	<meta
		name="description"
		content="Display tenant information in a card format with status and member count."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/tenants">Tenants</a>
		<span>/</span>
		<span>TenantCard</span>
	</nav>

	<h1>TenantCard</h1>
	<p class="lead">
		Display tenant organization information in a Material Design 3 card. Shows tenant name, slug,
		status badge, and member count with optional click interaction.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { TenantCard } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display tenant information in a simple card.</p>

	<ComponentExample code={`<TenantCard tenant={tenant} />`}>
		<TenantCard tenant={mockTenant} />
	</ComponentExample>

	<h2>With Status and Member Count</h2>
	<p>Add status badge and member count for more context.</p>

	<ComponentExample
		code={`<TenantCard
  tenant={tenant}
  status="active"
  memberCount={24}
/>
<TenantCard
  tenant={tenant}
  status="trial"
  memberCount={5}
/>`}
	>
		<div class="card-stack">
			<TenantCard tenant={mockTenant3} status="active" memberCount={24} />
			<TenantCard tenant={mockTenant2} status="trial" memberCount={5} />
		</div>
	</ComponentExample>

	<h2>Interactive Cards</h2>
	<p>Make cards clickable for tenant selection or navigation.</p>

	<ComponentExample
		code={`<script lang="ts">
  let selectedTenant = $state<string | null>(null);
</script>

<TenantCard
  tenant={tenant}
  onclick={() => selectedTenant = tenant.id}
  selected={selectedTenant === tenant.id}
  status="active"
  memberCount={24}
/>`}
	>
		<div class="card-stack">
			<TenantCard
				tenant={mockTenant}
				onclick={() => (selectedTenant = mockTenant.id)}
				selected={selectedTenant === mockTenant.id}
				status="active"
				memberCount={15}
			/>
			<TenantCard
				tenant={mockTenant2}
				onclick={() => (selectedTenant = mockTenant2.id)}
				selected={selectedTenant === mockTenant2.id}
				status="trial"
				memberCount={5}
			/>
			<TenantCard
				tenant={mockTenant3}
				onclick={() => (selectedTenant = mockTenant3.id)}
				selected={selectedTenant === mockTenant3.id}
				status="active"
				memberCount={24}
			/>
		</div>
		<p class="selection-info">Selected: {selectedTenant ?? 'None'}</p>
	</ComponentExample>

	<h2>Status Variants</h2>
	<p>Different status badges automatically style based on tenant state.</p>

	<ComponentExample
		code={`<TenantCard tenant={tenant} status="active" />
<TenantCard tenant={tenant} status="trial" />
<TenantCard tenant={tenant} status="suspended" />
<TenantCard tenant={tenant} status="inactive" />`}
	>
		<div class="card-stack">
			<TenantCard
				tenant={{ ...mockTenant, name: 'Active Tenant' }}
				status="active"
				memberCount={42}
			/>
			<TenantCard tenant={{ ...mockTenant, name: 'Trial Tenant' }} status="trial" memberCount={3} />
			<TenantCard
				tenant={{ ...mockTenant, name: 'Suspended Tenant' }}
				status="suspended"
				memberCount={18}
			/>
			<TenantCard
				tenant={{ ...mockTenant, name: 'Inactive Tenant' }}
				status="inactive"
				memberCount={0}
			/>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={cardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Tenant } from '@happyvertical/smrt-tenancy';

interface Props {
  tenant: Tenant;
  status?: string;
  memberCount?: number;
  onclick?: () => void;
  selected?: boolean;
}`}
		language="typescript"
	/>

	<h2>Multi-Tenancy Integration</h2>
	<p>TenantCard works seamlessly with the smrt-tenancy module:</p>

	<CodeBlock
		code={`import { TenantsCollection } from '@happyvertical/smrt-tenancy';

// List all tenants user has access to
const tenants = await TenantsCollection.create({ db });
const userTenants = await tenants.list({
  where: {
    memberships: {
      userId: currentUser.id,
      status: 'active'
    }
  }
});

// Display in cards
{#each userTenants as tenant}
  <TenantCard
    {tenant}
    status={tenant.status}
    memberCount={tenant.memberCount}
    onclick={() => switchTenant(tenant.id)}
  />
{/each}`}
		language="typescript"
	/>

	<h2>Use Cases</h2>
	<ul>
		<li>Tenant switcher dropdown or modal</li>
		<li>Admin dashboard showing all tenants</li>
		<li>Organization selector during onboarding</li>
		<li>Multi-tenant workspace navigation</li>
		<li>Tenant management interfaces</li>
	</ul>
</article>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

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
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.card-stack {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 400px;
	}

	.selection-info {
		margin-top: 16px;
		font-size: 0.875rem;
		color: #666;
	}
</style>
