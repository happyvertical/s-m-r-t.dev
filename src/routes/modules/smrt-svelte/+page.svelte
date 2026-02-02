<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-svelte - Component Library | SMRT Framework</title>
  <meta name="description" content="Svelte 5 component library with 100+ components, reactive stores, and UI registry." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-svelte</h1>
    <p class="text-xl text-gray-600 mb-4">
      Svelte 5 component library with 100+ production-ready components, reactive stores, and module UI registry.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Svelte 5</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">100 Components</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Runes</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-svelte</strong> is a comprehensive Svelte 5 component library with reactive stores,
      form components, user management UI, and a module registry system. All components use Svelte 5 runes.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>100+ Svelte 5 components with runes</li>
        <li>Reactive stores for SMRT objects</li>
        <li>Form components (TextInput, Select, DateTime, etc.)</li>
        <li>User/tenant/role management UI</li>
        <li>Module UI registry for dynamic component loading</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-svelte`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
    <CodeBlock
      code={`<script>
  import { TextInput, UserCard } from '@happyvertical/smrt-svelte';
  import { ModuleUIRegistry } from '@happyvertical/smrt-svelte/registry';
  import { createAppState, setAppStateContext } from '@happyvertical/smrt-svelte';

  // Initialize app state
  const appState = createAppState({
    initialMode: 'smrt',
    session: { user: null, isAuthenticated: false }
  });
  setAppStateContext(appState);

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
/>

<!-- Dynamic component loading -->
{#each ModuleUIRegistry.getComponents('@happyvertical/smrt-commerce') as component}
  <svelte:component this={component.component} {...props} />
{/each}`}
      language="svelte"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Component Categories</h2>

    <h3 class="text-2xl font-semibold mb-3">Form Components (11)</h3>
    <p class="mb-2">TextInput, SelectInput, CheckboxInput, DateTimeInput, AddressInput, MoneyInput, PhoneInput, TextareaInput, NumberInput, DateRangeInput, MeasurementInput</p>

    <h3 class="text-2xl font-semibold mb-3 mt-4">User Components (6)</h3>
    <p class="mb-2">UserCard, UserAvatar, UserList, UserForm, UserMenu, InviteUserModal</p>

    <h3 class="text-2xl font-semibold mb-3 mt-4">Tenant/Role Components (6)</h3>
    <p class="mb-2">TenantCard, TenantSwitcher, RoleBadge, RoleSelector, PermissionCheck, MembershipCard</p>

    <h3 class="text-2xl font-semibold mb-3 mt-4">Commerce Components (6 - NEW v0.19.0)</h3>
    <p class="mb-2">InvoiceCard, InvoiceHeader, InvoiceLineItems, InvoiceTotals, InvoiceActions, UnbilledItems</p>

    <h3 class="text-2xl font-semibold mb-3 mt-4">Project Components (7 - NEW v0.19.0)</h3>
    <p class="mb-2">TimeEntryCard, TimeEntryList, TimeSummary, DurationDisplay, ApprovalActions, BulkActions, RejectDialog</p>

    <h3 class="text-2xl font-semibold mb-3 mt-4">Event Components (1 - NEW v0.19.0)</h3>
    <p class="mb-2">MeetingView</p>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">App State Management</h2>
    <CodeBlock
      code={`import { createAppState, setAppStateContext, getAppStateContext } from '@happyvertical/smrt-svelte';

// Create app state manager
const appState = createAppState({
  initialMode: 'smrt',
  session: {
    user: null,
    isAuthenticated: false,
    permissions: [],
    preferences: {}
  },
  ai: {
    preload: 'idle',
    stt: { type: 'whisper-cpp' },
    showLoadingOverlay: true
  }
});

// Initialize and set context
await appState.initialize();
setAppStateContext(appState);

// Access state anywhere in the app
const state = getAppStateContext();
console.log(state.state); // Reactive SmrtAppState`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Module UI Registry</h2>
    <CodeBlock
      code={`import { ModuleUIRegistry } from '@happyvertical/smrt-svelte/registry';

// Register module components
ModuleUIRegistry.registerModule({
  name: '@happyvertical/smrt-commerce',
  displayName: 'Commerce',
  uiSlots: {
    'invoice-card': {
      id: 'invoice-card',
      label: 'Invoice Card',
      component: InvoiceCard
    }
  }
});

// Get components
const components = ModuleUIRegistry.getComponents('@happyvertical/smrt-commerce');
const invoiceCard = ModuleUIRegistry.getComponent('@happyvertical/smrt-commerce', 'invoice-card');`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Core framework integration</p>
      </a>
      <a href="/components" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">Component Docs</h3>
        <p class="text-sm text-gray-600">Individual component documentation</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/browser-ai" class="text-blue-600 hover:underline">Next: browser-ai →</a>
    </div>
  </div>
</div>
