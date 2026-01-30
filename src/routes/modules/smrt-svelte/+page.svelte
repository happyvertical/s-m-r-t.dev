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
  import { TextInput, UserCard, ModuleUIRegistry } from '@happyvertical/smrt-svelte';

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

    <h3>Form Components (11)</h3>
    <p>TextInput, SelectInput, CheckboxInput, DateTimeInput, AddressInput, MoneyInput, PhoneInput, TextareaInput, NumberInput, DateRangeInput, MeasurementInput</p>

    <h3>User Components (6)</h3>
    <p>UserCard, UserAvatar, UserList, UserForm, UserMenu, InviteUserModal</p>

    <h3>Tenant/Role Components (6)</h3>
    <p>TenantCard, TenantSwitcher, RoleBadge, RoleSelector, PermissionCheck, MembershipCard</p>

    <h3>Commerce Components (6 - NEW v0.19.0)</h3>
    <p>InvoiceCard, InvoiceHeader, InvoiceLineItems, InvoiceTotals, InvoiceActions, UnbilledItems</p>

    <h3>Project Components (7 - NEW v0.19.0)</h3>
    <p>TimeEntryCard, TimeEntryList, TimeSummary, DurationDisplay, ApprovalActions, BulkActions, RejectDialog</p>

    <h3>Event Components (1 - NEW v0.19.0)</h3>
    <p>MeetingView</p>
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
