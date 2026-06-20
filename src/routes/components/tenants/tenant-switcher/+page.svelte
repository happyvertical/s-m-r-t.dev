<script lang="ts">
	import { TenantSwitcher } from '@happyvertical/smrt-tenancy/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data
	const mockTenants = new Map([
		['tenant_1', { id: 'tenant_1', name: 'Acme Corporation', slug: 'acme' }],
		['tenant_2', { id: 'tenant_2', name: 'TechStart Inc', slug: 'techstart' }],
		['tenant_3', { id: 'tenant_3', name: 'Enterprise Co', slug: 'enterprise' }]
	]) as any;

	const mockMemberships = [
		{ tenantId: 'tenant_1', role: 'admin' },
		{ tenantId: 'tenant_2', role: 'member' },
		{ tenantId: 'tenant_3', role: 'member' }
	] as any[];

	let currentTenant = $state('tenant_1');

	const switcherProps = [
		{
			name: 'memberships',
			type: 'Membership[]',
			description: "User's tenant memberships with role info",
			required: true
		},
		{
			name: 'tenants',
			type: 'Map<string, Tenant>',
			description: 'Map of tenant ID to tenant data',
			required: true
		},
		{
			name: 'currentTenantId',
			type: 'string',
			description: 'ID of currently selected tenant',
			required: true
		},
		{
			name: 'onchange',
			type: '(tenantId: string) => void',
			description: 'Callback when tenant is switched'
		}
	];
</script>

<svelte:head>
	<title>TenantSwitcher | s-m-r-t Components</title>
	<meta
		name="description"
		content="Dropdown component for switching between multiple tenant organizations."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/tenants">Tenants</a>
		<span>/</span>
		<span>TenantSwitcher</span>
	</nav>

	<h1>TenantSwitcher</h1>
	<p class="lead">
		A dropdown selector for switching between tenant organizations in multi-tenant applications.
		Displays current tenant and allows quick switching.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { TenantSwitcher } from '@happyvertical/smrt-tenancy/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple tenant switcher with callback handling.</p>

	<ComponentExample
		code={`<script lang="ts">
  import { TenantSwitcher } from '@happyvertical/smrt-tenancy/svelte';

  let currentTenantId = $state('tenant_1');

  const tenants = new Map([
    ['tenant_1', { id: 'tenant_1', name: 'Acme Corporation', slug: 'acme' }],
    ['tenant_2', { id: 'tenant_2', name: 'TechStart Inc', slug: 'techstart' }],
  ]);

  const memberships = [
    { tenantId: 'tenant_1', role: 'admin' },
    { tenantId: 'tenant_2', role: 'member' },
  ];
</script>

<TenantSwitcher
  {memberships}
  {tenants}
  currentTenantId={currentTenantId}
  onchange={(id) => (currentTenantId = id)}
/>`}
	>
		<TenantSwitcher
			memberships={mockMemberships}
			tenants={mockTenants}
			currentTenantId={currentTenant}
			onchange={(id) => (currentTenant = id)}
		/>
		<p style="margin-top: 1rem; color: #666;">Current tenant: {currentTenant}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={switcherProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Membership, Tenant } from '@happyvertical/smrt-users';

interface Props {
  memberships: Membership[];
  tenants: Map<string, Tenant>;
  currentTenantId: string;
  onchange?: (tenantId: string) => void;
}`}
		language="typescript"
	/>

	<h2>Integration with smrt-tenancy</h2>
	<p>Complete example with tenant context switching:</p>

	<CodeBlock
		code={`<script lang="ts">
  import { TenantSwitcher } from '@happyvertical/smrt-tenancy/svelte';
  import { getTenantId } from '@happyvertical/smrt-tenancy';
  import {
    MembershipCollection,
    TenantCollection
  } from '@happyvertical/smrt-users';
  import type { Membership, Tenant } from '@happyvertical/smrt-users';

  let tenants = $state<Map<string, Tenant>>(new Map());
  let memberships = $state<Membership[]>([]);
  let currentTenantId = $state('');

  // Load user's tenants
  onMount(async () => {
    const membershipCollection = await MembershipCollection.create({ db });
    memberships = await membershipCollection.list({
      where: { userId: currentUser.id, status: 'active' }
    });

    const tenantCollection = await TenantCollection.create({ db });
    for (const m of memberships) {
      const tenant = await tenantCollection.get(m.tenantId);
      if (tenant) tenants.set(tenant.id, tenant);
    }

    currentTenantId = getTenantId() ?? '';
  });

  async function handleTenantChange(tenantId: string) {
    // Persist the selection (cookie, server call, etc.) then navigate;
    // the SvelteKit handle re-establishes tenant context per request.
    window.location.href = '/' + tenantId + '/dashboard';
  }
</script>

<TenantSwitcher
  {memberships}
  {tenants}
  {currentTenantId}
  onchange={handleTenantChange}
/>`}
		language="typescript"
	/>

	<h2>Use Cases</h2>
	<ul>
		<li>Application header for quick tenant switching</li>
		<li>Sidebar navigation tenant selector</li>
		<li>Admin dashboard with multi-tenant access</li>
		<li>SaaS applications with workspace/organization switching</li>
		<li>User settings page showing available tenants</li>
	</ul>

	<h2>Accessibility</h2>
	<p>TenantSwitcher follows accessibility best practices:</p>
	<ul>
		<li>Keyboard navigation (Tab, Enter, Arrow keys)</li>
		<li>ARIA labels for screen readers</li>
		<li>Focus indicators on all interactive elements</li>
		<li>Escape key to close dropdown</li>
		<li>Proper role attributes (menu, menuitem)</li>
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
</style>
