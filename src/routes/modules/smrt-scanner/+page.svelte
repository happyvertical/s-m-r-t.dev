<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-scanner"
	description="AST-based scanner using oxc-parser (Rust) for class/field metadata extraction. Discovers @smrt() classes, resolves inheritance, and generates manifests for code generators."
	badges={['v0.20.44', 'Core Foundation', 'Rust-powered']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The smrt-scanner package uses the Rust-based OXC parser to scan TypeScript
			source files and extract class, field, method, and decorator metadata without executing them.
			It discovers <code>@smrt()</code> decorated classes, resolves inheritance hierarchies,
			and generates manifests consumed by code generators, the vitest plugin, and CLI.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>2-3x faster</strong> than TypeScript compiler using Rust-based OXC parser</li>
			<li>
				<strong>Automatic class discovery</strong> via <code>@smrt()</code> decorator detection
			</li>
			<li><strong>Inheritance resolution</strong> with full chain tracking</li>
			<li><strong>STI support</strong> with automatic field merging from parent classes</li>
			<li>
				<strong>Field type inference</strong> from TypeScript annotations and helper functions
			</li>
			<li><strong>Cross-package resolution</strong> via external manifests</li>
			<li><strong>CLI and programmatic API</strong> for flexible integration</li>
			<li><strong>Manifest generation</strong> compatible with smrt-core</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-scanner
# or
pnpm add @happyvertical/smrt-scanner
# or
bun add @happyvertical/smrt-scanner`}
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start (5 Minutes)</h2>

		<h3>Programmatic Usage</h3>
		<CodeBlock
			code={`import { OxcScanner, InheritanceResolver, ManifestAdapter } from '@happyvertical/smrt-scanner';
import { parseFile, parseSource, extractSmrtImports } from '@happyvertical/smrt-scanner';

// Scan a single file
const result = parseFile('/path/to/Product.ts');
// result.classes → RawClassDefinition[]

// Full scanner with glob support
const scanner = new OxcScanner({ include: ['src/**/*.ts'] });
const results = await scanner.scan();

// Resolve inheritance across files
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

// Convert to SMRT manifest format
const adapter = new ManifestAdapter();
const manifest = adapter.toManifest(resolved);`}
		/>

		<h3>CLI Usage</h3>
		<CodeBlock
			code={`# Scan and output manifest
smrt-scan src/**/*.ts`}
		/>
	</section>

	<section id="architecture">
		<h2>Architecture</h2>

		<h3>Processing Pipeline</h3>
		<ol>
			<li><strong>fast-glob</strong> finds <code>.ts</code> files matching include/exclude patterns</li>
			<li><strong>oxc-parser</strong> parses each file's AST</li>
			<li><strong>Extraction</strong>: <code>@smrt()</code> config, class hierarchy, field defaults (0 vs 0.0 heuristic), relationships, static properties</li>
			<li><strong>Manifest output</strong>: JSON consumed by code generators, vitest plugin, and CLI</li>
		</ol>

		<h3>Class Discovery</h3>
		<p>The scanner finds classes in three ways:</p>
		<ul>
			<li>Classes with <code>@smrt()</code> decorator</li>
			<li>Classes extending <code>SmrtObject</code></li>
			<li>Classes extending <code>SmrtCollection</code> or <code>SmrtClass</code></li>
		</ul>

		<h3>Field Type Inference</h3>
		<p>Type inference follows this priority:</p>
		<ol>
			<li>
				<strong>Helper functions</strong>: <code>text()</code>, <code>integer()</code>,
				<code>decimal()</code>, <code>foreignKey()</code>
			</li>
			<li>
				<strong>Field decorators</strong>: <code>@field({'{ type: "..." }'})</code>
			</li>
			<li>
				<strong>TypeScript annotations</strong> with 0 vs 0.0 heuristic for numbers
			</li>
			<li><strong>Default</strong>: 'text' type</li>
		</ol>

		<h3>STI (Single Table Inheritance)</h3>
		<p>
			Classes with <code>tableStrategy: 'sti'</code> automatically merge fields from their entire inheritance
			chain. All descendants inherit the STI strategy and share the same table.
		</p>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Exports</h3>

		<h4>Classes</h4>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>OxcScanner</code></td>
					<td>Scans TypeScript files for <code>@smrt()</code> decorated classes</td>
				</tr>
				<tr>
					<td><code>InheritanceResolver</code></td>
					<td>Resolves class inheritance chains across files</td>
				</tr>
				<tr>
					<td><code>ManifestAdapter</code></td>
					<td>Converts raw scan results to SMRT manifest format</td>
				</tr>
			</tbody>
		</table>

		<h4>Functions</h4>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>parseFile</code></td>
					<td>Parse a single TypeScript file and extract metadata</td>
				</tr>
				<tr>
					<td><code>parseSource</code></td>
					<td>Parse a TypeScript source string</td>
				</tr>
				<tr>
					<td><code>extractSmrtImports</code></td>
					<td>Extract SMRT-related imports from a file</td>
				</tr>
			</tbody>
		</table>

		<h3>Key Types</h3>
		<p>The following types are exported from the package:</p>
		<CodeBlock
			code={`// Core scan result types
RawClassDefinition
RawFieldDefinition
RawMethodDefinition
RawDecoratorConfig
ResolvedClassDefinition
ScanResults
FileScanResult
OxcScannerOptions

// Field type inference
InferredFieldType
FieldTypeInference`}
		/>

		<h3>ManifestAdapter</h3>
		<CodeBlock
			code={`import { OxcScanner, InheritanceResolver, ManifestAdapter } from '@happyvertical/smrt-scanner';

// Full pipeline: scan → resolve → manifest
const scanner = new OxcScanner({ include: ['src/**/*.ts'] });
const results = await scanner.scan();

const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

const adapter = new ManifestAdapter();
const manifest = adapter.toManifest(resolved);`}
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Basic Project Scanning</h3>

		<h4>Step 1: Create SMRT Classes</h4>
		<CodeBlock
			code={`// src/models/User.ts
import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt()
export class User extends SmrtObject {
  name: string = '';
  email: string = '';
  age: number = 0;
}`}
		/>

		<h4>Step 2: Run Scanner</h4>
		<CodeBlock
			code={`import { OxcScanner } from '@happyvertical/smrt-scanner';

const scanner = new OxcScanner({ cwd: './src' });
const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

const user = resolved.find(c => c.className === 'User');
console.log(\`User has \${user.fields.length} fields\`);
user.fields.forEach(f => {
  console.log(\`  - \${f.name}: \${f.typeAnnotation}\`);
});`}
		/>

		<h3>Tutorial 2: STI Hierarchy Management</h3>

		<h4>Step 1: Create STI Base</h4>
		<CodeBlock
			code={`// Base class with STI
@smrt({ tableStrategy: 'sti' })
export class Vehicle extends SmrtObject {
  make: string = '';
  model: string = '';
  year: number = 0;
}

// Car inherits STI strategy
@smrt()
export class Car extends Vehicle {
  numDoors: number = 0;
  trunkSize: number = 0.0;   // 0.0 → DECIMAL
}

// Truck also inherits STI
@smrt()
export class Truck extends Vehicle {
  bedLength: number = 0.0;
  towingCapacity: number = 0;
}`}
		/>

		<h4>Step 2: Scan and Examine</h4>
		<CodeBlock
			code={`const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

const car = resolved.find(c => c.className === 'Car');
console.log('Car inheritance chain:', car.inheritanceChain);
// ["SmrtObject", "Vehicle", "Car"]

console.log('Car is STI:', car.isSTI);
// true

console.log('STI base:', car.stiBase);
// "Vehicle"

console.log('All fields (merged from Vehicle):', car.allFields.length);
// 5 fields: make, model, year, numDoors, trunkSize`}
		/>

		<h3>Tutorial 3: Generating Manifests</h3>

		<h4>Step 1: Scan and Resolve</h4>
		<CodeBlock
			code={`import { OxcScanner, InheritanceResolver, ManifestAdapter } from '@happyvertical/smrt-scanner';
import fs from 'fs/promises';

const scanner = new OxcScanner({ include: ['src/**/*.ts'] });
const results = await scanner.scan();

const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

const adapter = new ManifestAdapter();
const manifest = adapter.toManifest(resolved);

await fs.writeFile(
  'manifest.json',
  JSON.stringify(manifest, null, 2)
);`}
		/>

		<h3>Key Files</h3>
		<ul>
			<li><code>src/oxc-scanner.ts</code> -- core AST scanning logic</li>
			<li><code>src/manifest-builder.ts</code> -- orchestrates scanning to manifest</li>
			<li><code>src/base-class-discovery.ts</code> -- resolves base classes from node_modules</li>
		</ul>

		<p>
			Internally, <code>ManifestBuilder</code> provides a high-level API that scans source files
			and builds a <code>SmartObjectManifest</code> in one call. It is used by <code>smrtVitestPlugin()</code>
			at startup to generate the build-time manifest.
		</p>
		/>
	</section>

	<section id="examples">
		<h2>Examples</h2>

		<h3>Example 1: Find All STI Hierarchies</h3>
		<CodeBlock
			code={`const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();
const stiClasses = resolved.filter(c => c.isSTI);

const hierarchies = new Map();
stiClasses.forEach(cls => {
  const base = cls.stiBase || cls.className;
  if (!hierarchies.has(base)) {
    hierarchies.set(base, []);
  }
  hierarchies.get(base).push(cls.className);
});

hierarchies.forEach((children, base) => {
  console.log(\`\${base} -> [\${children.join(', ')}]\`);
});`}
		/>

		<h3>Example 2: Analyze Field Types</h3>
		<CodeBlock
			code={`const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

resolved.forEach(cls => {
  const requiredFields = cls.fields.filter(f => !f.optional);
  const optionalFields = cls.fields.filter(f => f.optional);

  console.log(\`\${cls.className}:\`);
  console.log(\`  Required: \${requiredFields.map(f => f.name).join(', ')}\`);
  console.log(\`  Optional: \${optionalFields.map(f => f.name).join(', ')}\`);
});`}
		/>

		<h3>Example 3: Extract API Endpoints</h3>
		<CodeBlock
			code={`const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

resolved.forEach(cls => {
  const api = cls.decoratorConfig?.api;
  if (api?.include) {
    const basePath = cls.className.toLowerCase();
    api.include.forEach(endpoint => {
      console.log(\`GET /api/\${basePath}/\${endpoint}\`);
    });
  }
});`}
		/>
	</section>

	<section id="integration">
		<h2>Integration Patterns</h2>

		<h3>Vite Plugin Integration</h3>
		<CodeBlock
			code={`// vite.config.ts
import { defineConfig } from 'vite';
import { OxcScanner, ManifestAdapter } from '@happyvertical/smrt-scanner';

export default defineConfig({
  plugins: [{
    name: 'smrt-manifest',
    async buildStart() {
      const scanner = new OxcScanner({ cwd: './src' });
      const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();

      const adapter = new ManifestAdapter();
      const manifest = adapter.toManifest(resolved);

      await fs.writeFile(
        'src/generated/manifest.json',
        JSON.stringify(manifest, null, 2)
      );
    }
  }]
});`}
		/>

		<h3>Monorepo Scanning</h3>
		<CodeBlock
			code={`// Scan all packages in monorepo
const packages = ['packages/users', 'packages/commerce', 'packages/assets'];
const allClasses = [];

for (const pkg of packages) {
  const scanner = new OxcScanner({ cwd: pkg });
  const results = await scanner.scan();
const resolver = new InheritanceResolver();
resolver.addClasses(results.classes);
const resolved = resolver.resolveAll();
  allClasses.push(...resolved);
}

console.log(\`Total classes across monorepo: \${allClasses.length}\`);`}
		/>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>✅ DO</h3>
		<ul>
			<li>Always exclude test files: <code>**/*.test.ts</code>, <code>**/*.spec.ts</code></li>
			<li>Use <code>0.0</code> for decimal fields, <code>0</code> for integers in initializers</li>
			<li>
				Use helper functions (<code>text()</code>, <code>integer()</code>) for clearer type
				inference
			</li>
			<li>Specify <code>tableStrategy: 'sti'</code> on base class before extending</li>
			<li>Keep inheritance chains reasonably shallow (2-4 levels)</li>
			<li>Cache external manifests during build process</li>
			<li>Use <code>scanAndResolve()</code> for most use cases (convenience method)</li>
		</ul>

		<h3>❌ DON'T</h3>
		<ul>
			<li>Don't forget to add <code>@smrt()</code> decorator on SMRT classes</li>
			<li>Don't mix STI and CTI strategies in same hierarchy</li>
			<li>Don't scan unnecessary directories (use tight include/exclude patterns)</li>
			<li>Don't forget to resolve inheritance when working with STI classes</li>
			<li>Don't rely on external manifests being automatically discovered</li>
		</ul>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Classes not found</h3>
		<p><strong>Problem:</strong> Scanner doesn't detect SMRT classes.</p>
		<p>
			<strong>Solution:</strong> Ensure classes have <code>@smrt()</code> decorator or extend SMRT base
			classes. Check include/exclude glob patterns.
		</p>

		<h3>Inheritance not resolved</h3>
		<p><strong>Problem:</strong> Parent classes in external packages not found.</p>
		<p><strong>Solution:</strong> Load external manifest via <code>addExternalManifest()</code>.</p>

		<h3>STI fields not merged</h3>
		<p><strong>Problem:</strong> <code>allFields</code> doesn't include parent fields.</p>
		<p>
			<strong>Solution:</strong> Use <code>scanAndResolve()</code> or call <code>resolve()</code>
			after
			<code>scan()</code>.
		</p>

		<h3>Parse errors</h3>
		<p><strong>Problem:</strong> Syntax errors in files.</p>
		<p>
			<strong>Solution:</strong> Check <code>results.errors</code> array for detailed error messages with
			file paths and line numbers.
		</p>

		<h3>Decimal/Integer confusion</h3>
		<p><strong>Problem:</strong> Wrong numeric types inferred.</p>
		<p>
			<strong>Solution:</strong> Use <code>0.0</code> for decimals, <code>0</code> for integers, or
			use helper functions: <code>decimal()</code>, <code>integer()</code>.
		</p>
	</section>

	<section id="performance">
		<h2>Performance</h2>
		<p>
			The smrt-scanner is 2-3x faster than the TypeScript compiler thanks to the Rust-based OXC
			parser. Benchmark your project:
		</p>
		<CodeBlock code={`smrt-scan --benchmark`} />

		<h3>Performance Tips</h3>
		<ul>
			<li>Use tight include/exclude patterns to minimize files scanned</li>
			<li>Disable unused options like <code>includePrivateMethods</code></li>
			<li>Cache scan results when possible</li>
			<li>Use <code>cwd</code> to scope scanning to specific directories</li>
		</ul>
	</section>
</ModulePage>

<style>
	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	section:last-child {
		border-bottom: none;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 24px;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	h4 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 24px;
		margin-bottom: 12px;
		font-family: var(--font-mono);
	}

	p {
		margin-bottom: 16px;
		line-height: 1.7;
		color: var(--smrt-color-on-background, #333);
	}

	ul,
	ol {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	code {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.9em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 24px 0;
	}

	th,
	td {
		text-align: left;
		padding: 12px;
		border-bottom: 1px solid #e0e0e0;
	}

	th {
		font-weight: 600;
		background: #f9f9f9;
	}

	td code {
		white-space: nowrap;
	}
</style>
