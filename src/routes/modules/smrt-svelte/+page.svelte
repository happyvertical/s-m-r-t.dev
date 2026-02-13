<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-svelte"
	description="Svelte 5 component library with 100+ production-ready components, reactive stores, and module UI registry."
	badges={['v0.19.0', 'Svelte 5', '100 Components', 'Runes']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-svelte</strong> is a comprehensive Svelte 5 component library with reactive stores,
			form components, user management UI, and a module registry system. All components use Svelte 5 runes.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>100+ Svelte 5 components with runes</li>
				<li>Reactive stores for SMRT objects</li>
				<li>Form components (TextInput, SelectInput, DateTime, etc.)</li>
				<li>User/tenant/role management UI</li>
				<li>Module UI registry for dynamic component loading</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-svelte`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`<script>
  import { TextInput } from '@happyvertical/smrt-svelte';
  import { UserCard } from '@happyvertical/smrt-users/svelte';

  let name = $state('');
</script>

<!-- Form component -->
<TextInput
  bind:value={name}
  label="Full Name"
  placeholder="Enter name"
  required
/>

<!-- User component -->
<UserCard
  user={{
    id: 'user-1',
    displayName: 'John Doe',
    email: 'john@example.com'
  }}
/>`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Component Categories</h2>
		<p>
			Browse components by category. Each category includes multiple production-ready Svelte 5
			components with full TypeScript support.
		</p>

		<h3>Form Components</h3>
		<div class="link-grid">
			<a href="/components/forms/text-input" class="link-card"><h3>TextInput</h3><p>Text input with validation</p></a>
			<a href="/components/forms/smrt-select" class="link-card"><h3>SelectInput</h3><p>Select dropdown with search</p></a>
			<a href="/components/forms/checkbox" class="link-card"><h3>CheckboxInput</h3><p>Checkbox with label</p></a>
			<a href="/components/forms/datetime" class="link-card"><h3>DateTimeInput</h3><p>Date and time picker</p></a>
			<a href="/components/forms/address" class="link-card"><h3>AddressInput</h3><p>Address with autocomplete</p></a>
			<a href="/components/forms/money" class="link-card"><h3>MoneyInput</h3><p>Currency input in cents</p></a>
			<a href="/components/forms/phone" class="link-card"><h3>PhoneInput</h3><p>Phone with formatting</p></a>
			<a href="/components/forms/textarea" class="link-card"><h3>TextareaInput</h3><p>Multi-line text input</p></a>
			<a href="/components/forms/number" class="link-card"><h3>NumberInput</h3><p>Numeric input component</p></a>
			<a href="/components/forms/daterange" class="link-card"><h3>DateRangeInput</h3><p>Start/end date picker</p></a>
			<a href="/components/forms/measurement" class="link-card"><h3>MeasurementInput</h3><p>Measurement with units</p></a>
		</div>
		<p><a href="/components/forms">View all form components →</a></p>

		<h3>Display Components</h3>
		<div class="link-grid">
			<a href="/components/display/icon" class="link-card"><h3>Icon</h3><p>SVG icon component</p></a>
			<a href="/components/display/status-badge" class="link-card"><h3>StatusBadge</h3><p>Status indicator badge</p></a>
			<a href="/components/display/confidence-badge" class="link-card"><h3>ConfidenceBadge</h3><p>Confidence score badge</p></a>
			<a href="/components/display/date-display" class="link-card"><h3>DateDisplay</h3><p>Formatted date display</p></a>
			<a href="/components/display/currency-display" class="link-card"><h3>CurrencyDisplay</h3><p>Formatted currency display</p></a>
		</div>
		<p><a href="/components/display">View all display components →</a></p>

		<h3>User & Tenant Components</h3>
		<div class="link-grid">
			<a href="/components/users/user-card" class="link-card"><h3>UserCard</h3><p>User profile card</p></a>
			<a href="/components/users/user-avatar" class="link-card"><h3>UserAvatar</h3><p>User avatar with fallback</p></a>
			<a href="/components/users/user-list" class="link-card"><h3>UserList</h3><p>List of users</p></a>
			<a href="/components/tenants/tenant-card" class="link-card"><h3>TenantCard</h3><p>Tenant info card</p></a>
			<a href="/components/tenants/tenant-switcher" class="link-card"><h3>TenantSwitcher</h3><p>Tenant switcher dropdown</p></a>
			<a href="/components/roles/role-badge" class="link-card"><h3>RoleBadge</h3><p>User role badge</p></a>
		</div>
		<p><a href="/components/users">View all user components →</a></p>

		<h3>Commerce Components</h3>
		<div class="link-grid">
			<a href="/components/commerce/invoice-card" class="link-card"><h3>InvoiceCard</h3><p>Invoice summary card</p></a>
			<a href="/components/commerce/invoice-header" class="link-card"><h3>InvoiceHeader</h3><p>Invoice header display</p></a>
			<a href="/components/commerce/invoice-line-items" class="link-card"><h3>InvoiceLineItems</h3><p>Editable line items table</p></a>
			<a href="/components/commerce/invoice-totals" class="link-card"><h3>InvoiceTotals</h3><p>Totals calculation display</p></a>
			<a href="/components/commerce/invoice-actions" class="link-card"><h3>InvoiceActions</h3><p>Invoice action buttons</p></a>
		</div>
		<p><a href="/components/commerce">View all commerce components →</a></p>

		<h3>Project & Time Tracking Components</h3>
		<div class="link-grid">
			<a href="/components/projects/time-entry-card" class="link-card"><h3>TimeEntryCard</h3><p>Time entry display card</p></a>
			<a href="/components/projects/time-entry-list" class="link-card"><h3>TimeEntryList</h3><p>List of time entries</p></a>
			<a href="/components/projects/time-summary" class="link-card"><h3>TimeSummary</h3><p>Time statistics display</p></a>
			<a href="/components/projects/approval-actions" class="link-card"><h3>ApprovalActions</h3><p>Approve/reject actions</p></a>
			<a href="/components/projects/bulk-actions" class="link-card"><h3>BulkActions</h3><p>Batch operations UI</p></a>
		</div>
		<p><a href="/components/projects">View all project components →</a></p>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Core framework integration</p>
			</a>
			<a href="/components" class="link-card">
				<h3>Component Docs</h3>
				<p>Individual component documentation</p>
			</a>
		</div>
	</section>
</ModulePage>
