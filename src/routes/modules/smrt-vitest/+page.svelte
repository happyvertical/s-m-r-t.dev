<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-vitest"
	description="Testing utilities for SMRT objects including fixtures, mocks, test database setup, and custom assertions."
	badges={['v0.19.0', 'Testing', 'Vitest']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-vitest</strong> provides testing utilities specifically designed for SMRT objects,
			including database setup, fixture generation, and custom matchers.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install -D @happyvertical/smrt-vitest`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { describe, it, expect } from 'vitest';
import { createTestDb, createFixture } from '@happyvertical/smrt-vitest';
import { ProfileCollection } from '@happyvertical/smrt-profiles';

describe('Profile Tests', () => {
  it('should create profile', async () => {
    // Setup test database
    const db = await createTestDb();
    const profiles = await ProfileCollection.create({ db });

    // Create test fixture
    const profile = await createFixture(profiles, 'Profile', {
      displayName: 'Test User',
      email: 'test@example.com'
    });

    expect(profile.displayName).toBe('Test User');
    expect(profile.id).toBeDefined();
  });
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Key Features</h2>
		<ul>
			<li>Test database setup with automatic cleanup</li>
			<li>Fixture generation for SMRT objects</li>
			<li>Mock implementations for external services</li>
			<li>Custom Vitest matchers for SMRT assertions</li>
			<li>Transaction rollback for test isolation</li>
		</ul>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Core framework being tested</p>
			</a>
		</div>
	</section>
</ModulePage>
