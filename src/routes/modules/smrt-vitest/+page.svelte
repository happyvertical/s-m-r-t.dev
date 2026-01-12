<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-vitest - Testing Utilities | SMRT Framework</title>
  <meta name="description" content="Vitest testing utilities for SMRT objects with fixtures, mocks, and assertions." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-vitest</h1>
    <p class="text-xl text-gray-600 mb-4">
      Testing utilities for SMRT objects including fixtures, mocks, test database setup, and custom assertions.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Testing</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Vitest</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-vitest</strong> provides testing utilities specifically designed for SMRT objects,
      including database setup, fixture generation, and custom matchers.
    </p>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install -D @happyvertical/smrt-vitest`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Key Features</h2>
    <ul class="list-disc list-inside space-y-2 mb-4">
      <li>Test database setup with automatic cleanup</li>
      <li>Fixture generation for SMRT objects</li>
      <li>Mock implementations for external services</li>
      <li>Custom Vitest matchers for SMRT assertions</li>
      <li>Transaction rollback for test isolation</li>
    </ul>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Core framework being tested</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-svelte" class="text-blue-600 hover:underline">Next: smrt-svelte →</a>
    </div>
  </div>
</div>
