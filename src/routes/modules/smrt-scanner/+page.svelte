<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-scanner | s-m-r-t</title>
</svelte:head>

<Grid>
	<div class="header">
		<div class="breadcrumb">
			<a href="/modules">Modules</a>
			<span class="separator">/</span>
			<span>smrt-scanner</span>
		</div>
		<h1>@happyvertical/smrt-scanner</h1>
		<p class="lead">
			High-performance TypeScript scanner using OXC for automatic SMRT class discovery, inheritance
			resolution, and manifest generation. 2-3x faster than TypeScript compiler.
		</p>
		<div class="badges">
			<span class="badge">v0.19.0</span>
			<span class="badge">Core Foundation</span>
			<span class="badge">Rust-powered</span>
		</div>
	</div>

	<section id="overview">
		<h2>Overview</h2>
		<p>
			The smrt-scanner package uses the blazing-fast Rust-based OXC parser to scan TypeScript
			projects and generate manifests for the SMRT framework. It automatically discovers classes,
			resolves inheritance hierarchies, and handles STI (Single Table Inheritance) field merging.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>2-3x faster</strong> than TypeScript compiler using Rust-based OXC parser</li>
			<li><strong>Automatic class discovery</strong> via <code>@smrt()</code> decorator detection</li>
			<li><strong>Inheritance resolution</strong> with full chain tracking</li>
			<li><strong>STI support</strong> with automatic field merging from parent classes</li>
			<li><strong>Field type inference</strong> from TypeScript annotations and helper functions</li>
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
			code={`import { OxcScanner } from '@happyvertical/smrt-scanner';

// Create scanner
const scanner = new OxcScanner({
  cwd: process.cwd(),
  include: ['src/**/*.ts'],
  exclude: ['**/*.test.ts']
});

// Scan and resolve inheritance
const { results, resolved } = await scanner.scanAndResolve();

console.log(\`Found \${resolved.length} SMRT classes\`);
resolved.forEach(cls => {
  console.log(\`- \${cls.className}: \${cls.fields.length} fields\`);
  if (cls.isSTI) {
    console.log(\`  STI base: \${cls.stiBase}\`);
  }
});`}
		/>

		<h3>CLI Usage</h3>
		<CodeBlock
			code={`# Basic scan
smrt-scan

# Custom directory and patterns
smrt-scan ./src -i "**/*.ts" -e "**/*.test.ts"

# Output manifest to file
smrt-scan -o manifest.json --stats

# Benchmark performance
smrt-scan --benchmark`}
		/>
	</section>

	<section id="architecture">
		<h2>Architecture</h2>

		<h3>Two-Phase Processing</h3>
		<ol>
			<li>
				<strong>Phase 1 - OXC Parsing</strong>: Fast syntactic extraction using Rust-based parser.
				Extracts class definitions, decorators, fields, and methods without semantic analysis.
			</li>
			<li>
				<strong>Phase 2 - Inheritance Resolution</strong>: Builds class hierarchy, resolves inheritance
				chains, merges STI fields, and identifies framework base classes.
			</li>
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
				<strong>Field decorators</strong>: <code>@foreignKey()</code>, <code>@field()</code>, <code>@oneToMany()</code>, <code>@manyToMany()</code>
			</li>
			<li>
				<strong>TypeScript annotations</strong> with 0 vs 0.0 heuristic for numbers
			</li>
			<li><strong>Default</strong>: 'text' type</li>
		</ol>

		<h3>STI (Single Table Inheritance)</h3>
		<p>
			Classes with <code>tableStrategy: 'sti'</code> automatically merge fields from their entire
			inheritance chain. All descendants inherit the STI strategy and share the same table.
		</p>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>OxcScanner Class</h3>

		<h4>Constructor</h4>
		<CodeBlock
			code={`new OxcScanner(options?: OxcScannerOptions)

interface OxcScannerOptions {
  include?: string[];                     // Glob patterns (default: ['**/*.ts', '**/*.tsx'])
  exclude?: string[];                     // Exclude patterns
  cwd?: string;                           // Base directory
  tsconfig?: string;                      // Path to tsconfig.json
  followImports?: boolean;                // Follow imports for base classes
  baseClasses?: string[];                 // Known base classes
  includePrivateMethods?: boolean;        // Include private methods
  includeStaticMethods?: boolean;         // Include static methods (default: true)
  externalManifests?: Map<string, ExternalManifest>;
}`}
		/>

		<h4>Key Methods</h4>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>scan()</code></td>
					<td><code>Promise&lt;ScanResults&gt;</code></td>
					<td>Parse files and extract raw class definitions</td>
				</tr>
				<tr>
					<td><code>resolve()</code></td>
					<td><code>ResolvedClassDefinition[]</code></td>
					<td>Resolve inheritance after scan()</td>
				</tr>
				<tr>
					<td><code>scanAndResolve()</code></td>
					<td><code>{'{ results, resolved }'}</code></td>
					<td>Combined scan + resolve operation</td>
				</tr>
				<tr>
					<td><code>addExternalManifest()</code></td>
					<td><code>void</code></td>
					<td>Add external package manifest</td>
				</tr>
				<tr>
					<td><code>getStats()</code></td>
					<td><code>Statistics</code></td>
					<td>Get performance statistics</td>
				</tr>
			</tbody>
		</table>

		<h3>Result Types</h3>
		<CodeBlock
			code={`interface ScanResults {
  files: FileScanResult[];           // Per-file results
  classes: RawClassDefinition[];     // All classes (flattened)
  errors: ScanError[];               // Parse errors
  totalParseTimeMs: number;          // Total parse duration
  fileCount: number;                 // Number of files scanned
}

interface ResolvedClassDefinition {
  className: string;
  filePath: string;
  extendsClause: string | null;
  inheritanceChain: string[];        // Full chain from base to this class
  stiBase: string | null;            // STI base if in STI hierarchy
  effectiveTableStrategy: 'sti' | 'cti';
  isSTI: boolean;
  isFrameworkBase: boolean;
  decoratorConfig: RawDecoratorConfig | null;
  fields: RawFieldDefinition[];
  allFields: RawFieldDefinition[];   // Merged fields for STI
  methods: RawMethodDefinition[];
}`}
		/>

		<h3>ManifestAdapter</h3>
		<CodeBlock
			code={`import { ManifestAdapter } from '@happyvertical/smrt-scanner';

const adapter = new ManifestAdapter();
const manifest = adapter.toManifest(resolvedClasses, {
  packageName: '@my/package',
  packageVersion: '1.0.0'
});

// Write to file
await fs.writeFile('manifest.json', JSON.stringify(manifest, null, 2));`}
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Basic Project Scanning</h3>

		<h4>Step 1: Create SMRT Classes</h4>
		<CodeBlock
			code={`// src/models/User.ts
import { SmrtObject, smrt } from '@happyvertical/smrt-core';

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
const { resolved } = await scanner.scanAndResolve();

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
  trunkSize: number = 0.0;
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
			code={`const { resolved } = await scanner.scanAndResolve();

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
			code={`import { OxcScanner, ManifestAdapter } from '@happyvertical/smrt-scanner';
import fs from 'fs/promises';

const scanner = new OxcScanner();
const { resolved } = await scanner.scanAndResolve();

const adapter = new ManifestAdapter();
const manifest = adapter.toManifest(resolved, {
  packageName: '@my/models',
  packageVersion: '1.0.0'
});

await fs.writeFile(
  'manifest.json',
  JSON.stringify(manifest, null, 2)
);

console.log('Manifest generated with', manifest.classes.size, 'classes');`}
		/>

		<h3>Tutorial 4: Cross-Package Resolution</h3>

		<h4>Step 1: Load External Manifest</h4>
		<CodeBlock
			code={`import externalManifest from '@external/package/manifest.json';

const scanner = new OxcScanner();
scanner.addExternalManifest({
  packageName: '@external/package',
  classes: new Map(Object.entries(externalManifest.classes))
});

// Now scanner can resolve classes extending @external/package classes
const { resolved } = await scanner.scanAndResolve();`}
		/>
	</section>

	<section id="examples">
		<h2>Examples</h2>

		<h3>Example 1: Find All STI Hierarchies</h3>
		<CodeBlock
			code={`const { resolved } = await scanner.scanAndResolve();
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
			code={`const { resolved } = await scanner.scanAndResolve();

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
			code={`const { resolved } = await scanner.scanAndResolve();

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
      const { resolved } = await scanner.scanAndResolve();

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
  const { resolved } = await scanner.scanAndResolve();
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
			<li>Use decorators (<code>@foreignKey()</code>, <code>@field()</code>) for relationships and constraints</li>
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
			<strong>Solution:</strong> Ensure classes have <code>@smrt()</code> decorator or extend SMRT
			base classes. Check include/exclude glob patterns.
		</p>

		<h3>Inheritance not resolved</h3>
		<p><strong>Problem:</strong> Parent classes in external packages not found.</p>
		<p><strong>Solution:</strong> Load external manifest via <code>addExternalManifest()</code>.</p>

		<h3>STI fields not merged</h3>
		<p><strong>Problem:</strong> <code>allFields</code> doesn't include parent fields.</p>
		<p>
			<strong>Solution:</strong> Use <code>scanAndResolve()</code> or call <code>resolve()</code> after
			<code>scan()</code>.
		</p>

		<h3>Parse errors</h3>
		<p><strong>Problem:</strong> Syntax errors in files.</p>
		<p>
			<strong>Solution:</strong> Check <code>results.errors</code> array for detailed error messages
			with file paths and line numbers.
		</p>

		<h3>Decimal/Integer confusion</h3>
		<p><strong>Problem:</strong> Wrong numeric types inferred.</p>
		<p>
			<strong>Solution:</strong> Use <code>0.0</code> for decimals, <code>0</code> for integers in default values.
			The scanner uses the presence of a decimal point to determine the column type.
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
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.breadcrumb {
		font-size: 0.875rem;
		margin-bottom: 16px;
		color: #666;
	}

	.breadcrumb a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.separator {
		margin: 0 8px;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		font-family: var(--font-mono);
	}

	.lead {
		font-size: 1.125rem;
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.badges {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		background: #f0f0f0;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
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
		color: #333;
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
		background: #f5f5f5;
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
