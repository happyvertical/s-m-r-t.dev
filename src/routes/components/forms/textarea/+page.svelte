<script lang="ts">
	import { SMRTTextarea } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { SmrtProvider } from '@happyvertical/smrt-svelte';

	let basicValue = $state('');
	let bioValue = $state('Software developer passionate about building elegant solutions.');
	let limitedValue = $state('');
	let interactiveValue = $state('');

	const textareaProps = [
		{
			name: 'name',
			type: 'string',
			description: 'Field name for form submission',
			required: true
		},
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Field label displayed above the textarea'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for voice extraction context'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: 'undefined',
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Current text value (bindable)'
		},
		{
			name: 'rows',
			type: 'number',
			default: '4',
			description: 'Number of visible text rows'
		},
		{
			name: 'maxlength',
			type: 'number',
			default: 'undefined',
			description: 'Maximum character count'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the textarea'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks field as required'
		},
		{
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message to display'
		},
		{
			name: 'onchange',
			type: '(value: string) => void',
			default: 'undefined',
			description: 'Callback when value changes'
		}
	];
</script>

<svelte:head>
	<title>SMRTTextarea | SMRT Forms</title>
	<meta name="description" content="Multi-line text input component with character counting and voice input support." />
</svelte:head>

<SmrtProvider>
<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>SMRTTextarea</span>
	</nav>

	<h1>SMRTTextarea</h1>
	<p class="lead">
		A Material Design 3 styled multi-line text input with character counting, auto-resizing,
		and voice input support in SMRT mode for longer text content.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { SMRTTextarea } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple textarea with 4 rows by default.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<SMRTTextarea
  name="bio"
  label="Biography"
  placeholder="Tell us about yourself..."
  bind:value
/>`}
	>
		<SMRTTextarea
			name="bio"
			label="Biography"
			placeholder="Tell us about yourself..."
			bind:value={basicValue}
		/>
	</ComponentExample>

	<h2>With Default Value</h2>
	<p>Pre-populate the textarea with existing text.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="description"
  label="Description"
  value="Software developer passionate about building elegant solutions."
/>`}
	>
		<SMRTTextarea
			name="description"
			label="Description"
			bind:value={bioValue}
		/>
	</ComponentExample>

	<h2>Custom Height</h2>
	<p>Adjust the number of visible rows with the <code>rows</code> prop.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="comments"
  label="Comments"
  rows={8}
  placeholder="Enter your detailed feedback..."
/>`}
	>
		<SMRTTextarea
			name="comments"
			label="Comments"
			rows={8}
			placeholder="Enter your detailed feedback..."
		/>
	</ComponentExample>

	<h2>With Character Limit</h2>
	<p>Set <code>maxlength</code> to limit characters and show a counter.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="tweet"
  label="Twitter Post"
  maxlength={280}
  placeholder="What's happening?"
  bind:value
/>`}
	>
		<SMRTTextarea
			name="tweet"
			label="Twitter Post"
			maxlength={280}
			placeholder="What's happening?"
			bind:value={limitedValue}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="feedback"
  label="Feedback"
  placeholder="Please share your thoughts..."
  required
/>`}
	>
		<SMRTTextarea
			name="feedback"
			label="Feedback"
			placeholder="Please share your thoughts..."
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="readonly"
  label="Approved Content"
  value="This content has been approved and cannot be edited."
  disabled
/>`}
	>
		<SMRTTextarea
			name="readonly"
			label="Approved Content"
			value="This content has been approved and cannot be edited."
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="error-example"
  label="Description"
  value="Too short"
  error="Description must be at least 50 characters"
/>`}
	>
		<SMRTTextarea
			name="error-example"
			label="Description"
			value="Too short"
			error="Description must be at least 50 characters"
		/>
	</ComponentExample>

	<h2>With Description</h2>
	<p>Add a <code>description</code> for additional context.</p>

	<ComponentExample
		code={`<SMRTTextarea
  name="notes"
  label="Additional Notes"
  description="Any other information you'd like to share"
  placeholder="Optional notes..."
/>`}
	>
		<SMRTTextarea
			name="notes"
			label="Additional Notes"
			description="Any other information you'd like to share"
			placeholder="Optional notes..."
		/>
	</ComponentExample>

	<h2>Voice Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can dictate longer text content. The component supports:
	</p>
	<ul>
		<li>Continuous dictation for paragraphs</li>
		<li>Natural punctuation commands ("period", "comma", "question mark")</li>
		<li>Line break commands ("new line", "new paragraph")</li>
		<li>Automatic capitalization after punctuation</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: continuous dictation with natural punctuation -->
<SMRTTextarea
  name="voice"
  label="Article Content"
  description="The main body text of your article"
  rows={10}
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Type to see character count and value updates:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<SMRTTextarea
  name="interactive"
  label="Your Message"
  maxlength={200}
  bind:value
/>
<p>Length: {value.length} / 200</p>`}
	>
		<SMRTTextarea
			name="interactive"
			label="Your Message"
			maxlength={200}
			bind:value={interactiveValue}
		/>
		<p style="margin-top: 1rem; color: #666;">Length: {interactiveValue.length} / 200</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={textareaProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { SMRTTextarea } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  maxlength?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (value: string) => void;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<p>
		SMRTTextarea follows WCAG 2.1 AA guidelines:
	</p>
	<ul>
		<li>Proper ARIA labels for screen readers</li>
		<li>Keyboard navigation support (Tab, Shift+Tab)</li>
		<li>Character count announced to screen readers</li>
		<li>Error messages properly associated with input</li>
		<li>Focus indicators meet contrast requirements</li>
	</ul>
</article>
</SmrtProvider>

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
