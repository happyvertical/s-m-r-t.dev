<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			description: 'Form content (inputs and other elements)'
		},
		{
			name: 'showModeToggle',
			type: 'boolean',
			default: 'false',
			description: 'Show Dumb/SMRT mode toggle button'
		},
		{
			name: 'showFormListen',
			type: 'boolean',
			default: 'false',
			description: 'Show form-level "Speak all fields" button'
		},
		{
			name: 'silenceTimeout',
			type: 'number',
			default: '5',
			description: 'Seconds of silence before stopping listening'
		},
		{
			name: 'sttAdapter',
			type: 'STTAdapterType',
			default: "'whisper-wasm'",
			description: 'Speech-to-text adapter type'
		},
		{
			name: 'llmModel',
			type: 'LLMModelId',
			default: "'none'",
			description: "LLM model for field extraction ('none' uses regex-only)"
		},
		{
			name: 'onsubmit',
			type: '(data: Record<string, unknown>) => void',
			default: 'undefined',
			description: 'Callback on form submit (prevents native submission)'
		},
		{
			name: 'method',
			type: "'GET' | 'POST'",
			default: "'GET'",
			description: 'HTTP method for native form submission'
		},
		{
			name: 'action',
			type: 'string',
			default: 'undefined',
			description: 'Form action URL for native submission'
		}
	];
</script>

<svelte:head>
	<title>Form | s-m-r-t Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>Form</span>
	</nav>

	<h1>Form</h1>
	<p class="lead">
		A smart form wrapper that enables voice-powered form filling. In SMRT mode,
		users can speak to fill all fields at once. The Form component provides context
		to child inputs and manages the speech-to-text flow.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Form } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Wrap your form inputs to enable voice filling.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { Form, TextInput } from '@happyvertical/smrt-svelte';
</script>

<Form showModeToggle showFormListen>
  <TextInput name="firstName" label="First Name" />
  <TextInput name="lastName" label="Last Name" />
  <TextInput name="email" label="Email" type="email" />
</Form>`}
		language="svelte"
	/>

	<h2>How Voice Filling Works</h2>
	<ol>
		<li>User clicks "Speak all fields" button</li>
		<li>User speaks naturally: "First name John, last name Smith, email john at example dot com"</li>
		<li>User says "done" or waits for silence timeout</li>
		<li>Form extracts field values and populates inputs</li>
	</ol>

	<h2>With Custom Submit Handler</h2>
	<p>Handle form submission with JavaScript.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { Form, TextInput, Button } from '@happyvertical/smrt-svelte';

  function handleSubmit(data: Record<string, unknown>) {
    console.log('Form data:', data);
    // { firstName: 'John', lastName: 'Smith', email: 'john@example.com' }
  }
</script>

<Form onsubmit={handleSubmit} showFormListen>
  <TextInput name="firstName" label="First Name" />
  <TextInput name="lastName" label="Last Name" />
  <Button type="submit">Submit</Button>
</Form>`}
		language="svelte"
	/>

	<h2>With SvelteKit Form Actions</h2>
	<p>Works seamlessly with native form submissions.</p>

	<CodeBlock
		code={`<Form method="POST" action="?/save" showFormListen>
  <TextInput name="name" label="Name" />
  <Button type="submit">Save</Button>
</Form>`}
		language="svelte"
	/>

	<h2>STT Adapter Options</h2>
	<p>Choose between speech recognition backends.</p>

	<CodeBlock
		code={`<!-- Whisper WASM (default) - local, private, works offline -->
<Form sttAdapter="whisper-wasm" showFormListen>
  ...
</Form>

<!-- Browser Speech API - uses cloud services -->
<Form sttAdapter="browser-speech" showFormListen>
  ...
</Form>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Form } from '@happyvertical/smrt-svelte';

type STTAdapterType = 'whisper-wasm' | 'browser-speech';
type LLMModelId = 'none' | 'smollm' | 'llama-3.2-1B-Instruct' | string;

interface FormProps {
  children: Snippet;
  showModeToggle?: boolean;
  showFormListen?: boolean;
  silenceTimeout?: number;
  sttAdapter?: STTAdapterType;
  llmModel?: LLMModelId;
  onsubmit?: (data: Record<string, unknown>) => void;
  method?: 'GET' | 'POST';
  action?: string;
}`}
		language="typescript"
	/>

	<h2>Form Context</h2>
	<p>Child inputs can access the form context to participate in voice filling.</p>

	<CodeBlock
		code={`// Inside a form input component
import { tryGetFormContext } from '@happyvertical/smrt-svelte';

const formContext = tryGetFormContext();

// Register field for voice extraction
formContext?.registerField({
  name: 'email',
  label: 'Email Address',
  type: 'email',
  getValue: () => value,
  setValue: (v) => value = v
});`}
		language="typescript"
	/>

	<h2>Extraction Behavior</h2>
	<ul>
		<li><strong>Regex-based</strong> - Fast, reliable field matching using labels/names</li>
		<li><strong>Email handling</strong> - "at" → @, "dot" → .</li>
		<li><strong>Cleanup</strong> - Trailing punctuation and speech artifacts removed</li>
		<li><strong>Done keyword</strong> - Say "done" to stop listening early</li>
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

	.prose ul,
	.prose ol {
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
