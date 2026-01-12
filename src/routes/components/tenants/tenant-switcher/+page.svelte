<script lang="ts">
	import { TenantSwitcher } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data
	const mockTenants = [
		{ id: 'tenant_1', name: 'Acme Corporation', slug: 'acme' },
		{ id: 'tenant_2', name: 'TechStart Inc', slug: 'techstart' },
		{ id: 'tenant_3', name: 'Enterprise Co', slug: 'enterprise' }
	] as any[];

	let currentTenant = $state('tenant_1');

	const switcherProps = [
		{
			name: 'tenants',
			type: 'Tenant[]',
			description: 'Array of available tenants',
			required: true
		},
		{
			name: 'currentTenantId',
			type: 'string',
			description: 'ID of currently selected tenant',
			required: true
		},
		{
			name: 'onswitch',
			type: '(tenantId: string) => void',
			description: 'Callback when tenant is switched',
			required: true
		},
		{
			name: 'position',
			type: "'header' | 'dropdown'",
			default: "'dropdown'",
			description: 'Display position/style variant'
		},
		{
			name: 'showCreateNew',
			type: 'boolean',
			default: 'false',
			description: 'Show "Create New Tenant" option'
		},
		{
			name: 'oncreate',
			type: '() => void',
			default: 'undefined',
			description: 'Callback when "Create New" is clicked'
		}
	];
</script>

<svelte:head>
	<title>TenantSwitcher | SMRT Components</title>
	<meta name="description" content="Dropdown component for switching between multiple tenant organizations." />
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
		Displays current tenant and allows quick switching with optional create new tenant action.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { TenantSwitcher } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Simple tenant switcher with callback handling.</p>

	<ComponentExample
		code={`<script lang="ts">
  let currentTenant = $state('tenant_1');

  const tenants = [
    { id: 'tenant_1', name: 'Acme Corporation', slug: 'acme' },
    { id: 'tenant_2', name: 'TechStart Inc', slug: 'techstart' },
    { id: 'tenant_3', name: 'Enterprise Co', slug: 'enterprise' }
  ];

  function handleSwitch(tenantId: string) {
    currentTenant = tenantId;
    // Trigger tenant context switch
  }
</script>

<TenantSwitcher
  {tenants}
  currentTenantId={currentTenant}
  onswitch={handleSwitch}
/>`}
	>
		<TenantSwitcher
			tenants={mockTenants}
			currentTenantId={currentTenant}
			onswitch={(id) => currentTenant = id}
		/>
		<p style="margin-top: 1rem; color: #666;">Current tenant: {currentTenant}</p>
	</ComponentExample>

	<h2>Header Position Variant</h2>
	<p>Use <code>position="header"</code> for a compact header-friendly layout.</p>

	<ComponentExample
		code={`<TenantSwitcher
  {tenants}
  currentTenantId={currentTenant}
  onswitch={handleSwitch}
  position="header"
/>`}
	>
		<TenantSwitcher
			tenants={mockTenants}
			currentTenantId={currentTenant}
			onswitch={(id) => currentTenant = id}
			position="header"
		/>
	</ComponentExample>

	<h2>With Create New Option</h2>
	<p>Add <code>showCreateNew</code> to allow creating new tenants.</p>

	<ComponentExample
		code={`<TenantSwitcher
  {tenants}
  currentTenantId={currentTenant}
  onswitch={handleSwitch}
  showCreateNew={true}
  oncreate={() => {
    // Open create tenant modal
  }}
/>`}
	>
		<TenantSwitcher
			tenants={mockTenants}
			currentTenantId={currentTenant}
			onswitch={(id) => currentTenant = id}
			showCreateNew={true}
			oncreate={() => alert('Create new tenant clicked')}
		/>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={switcherProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Tenant } from '@happyvertical/smrt-tenancy';

interface Props {
  tenants: Tenant[];
  currentTenantId: string;
  onswitch: (tenantId: string) => void;
  position?: 'header' | 'dropdown';
  showCreateNew?: boolean;
  oncreate?: () => void;
}`}
		language="typescript"
	/>

	<h2>Integration with smrt-tenancy</h2>
	<p>
		Complete example with tenant context switching:
	</p>

	<CodeBlock
		code={`import { TenantSwitcher } from '@happyvertical/smrt-svelte';
import { TenantContext } from '@happyvertical/smrt-tenancy';

<script lang="ts">
  let tenants = $state([]);
  let currentTenantId = $state('');

  // Load user's tenants
  onMount(async () => {
    const memberships = await MembershipsCollection.create({ db });
    const userMemberships = await memberships.list({
      where: { userId: currentUser.id, status: 'active' }
    });

    tenants = await Promise.all(
      userMemberships.map(m =>
        TenantsCollection.get({ db }, m.tenantId)
      )
    );

    currentTenantId = TenantContext.getCurrentTenantId();
  });

  async function handleTenantSwitch(tenantId: string) {
    // Set tenant context
    await TenantContext.setTenant(tenantId);

    // Reload page or update app state
    window.location.href = \`/\${tenantId}/dashboard\`;
  }

  function handleCreateTenant() {
    goto('/tenants/new');
  }
</script>

<TenantSwitcher
  {tenants}
  {currentTenantId}
  onswitch={handleTenantSwitch}
  showCreateNew={true}
  oncreate={handleCreateTenant}
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
	<p>
		TenantSwitcher follows accessibility best practices:
	</p>
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
