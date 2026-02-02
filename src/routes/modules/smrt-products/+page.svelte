<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-products"
	description="Product catalog and inventory management with variants, pricing, and stock tracking."
	badges={['v0.19.0', 'Catalog', 'Inventory']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-products</strong> is a comprehensive product catalog management system built on the
			SMRT framework. It provides a complete solution for managing products, categories, inventory, and
			specifications with auto-generated REST APIs, MCP tools for AI integration, and reactive Svelte
			5 components.
		</p>
		<p>
			The module serves three purposes: (1) standalone application with its own dev server, (2)
			federated modules that can be consumed by other micro-frontends, and (3) NPM package for
			direct imports. All three consumption modes use the same source code, ensuring consistency and
			maintainability.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Hierarchical category system with parent-child relationships</li>
				<li>
					Comprehensive product model (name, description, price, stock status, specifications, tags)
				</li>
				<li>Extensible specifications system for product attributes</li>
				<li>Reactive Svelte 5 components with runes-based state management</li>
				<li>Auto-generated REST APIs (list, get, create, update)</li>
				<li>MCP tools for AI integration</li>
				<li>CLI commands for admin operations</li>
				<li>STI (Single Table Inheritance) pattern for extensibility</li>
			</ul>
		</aside>

		<h3>Architecture:</h3>
		<figure class="diagram">
			<pre>┌─────────────────────────────────────────┐
│     smrt-products Module                 │
├─────────────────────────────────────────┤
│  Models (Decorated with @smrt)           │
│  • Product (specifications, tags, price) │
│  • Category (hierarchical, counts)       │
├─────────────────────────────────────────┤
│  Auto-Generated (Vite Plugin)            │
│  • REST APIs                             │
│  • TypeScript Client                     │
│  • MCP Tools                             │
│  • Type Definitions                      │
├─────────────────────────────────────────┤
│  UI Components (Svelte 5)                │
│  • ProductCard, ProductForm              │
│  • ProductCatalog, CategoryManager       │
│  • Stores with runes                     │
├─────────────────────────────────────────┤
│  Consumption Modes                       │
│  • Standalone: npm run dev:standalone    │
│  • Federation: npm run dev:federation    │
│  • Library: npm package imports          │
└─────────────────────────────────────────┘</pre>
		</figure>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`# Using pnpm (recommended)
pnpm add @happyvertical/smrt-products

# Using npm
npm install @happyvertical/smrt-products`}
			language="bash"
		/>
		<p>
			The module depends on <code>@happyvertical/smrt-core</code> for base classes,
			<code>@happyvertical/ai</code> for AI operations, and <code>@happyvertical/sql</code>
			for database operations.
		</p>
	</section>

	<section>
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Initialize Product Store</h3>
		<CodeBlock
			code={`import { ProductStoreClass } from '@happyvertical/smrt-products';

// Create singleton store instance
const productStore = new ProductStoreClass();

// Load products from API
await productStore.loadProducts();

console.log('Products loaded:', productStore.items.length);
console.log('In stock:', productStore.inStockCount);
console.log('Total value:', productStore.totalValue);`}
			language="typescript"
		/>

		<h3>2. Display Product Catalog</h3>
		<CodeBlock
			code={`<script lang="ts">
  import { ProductCatalog } from '@happyvertical/smrt-products';
</script>

<!-- Complete catalog with search, filtering, CRUD -->
<ProductCatalog
  showCreateForm={true}
  readonly={false}
/>

<!-- Auto-displays: search, category filter, stats, product grid -->
<!-- Auto-handles: create, edit, delete, loading, error states -->`}
			language="svelte"
		/>

		<h3>3. Create Product with Form</h3>
		<CodeBlock
			code={`<script lang="ts">
  import { ProductForm } from '@happyvertical/smrt-products';

  let isSaving = false;

  async function handleSubmit(product) {
    isSaving = true;
    const result = await productStore.createProduct(product);
    if (result.success) {
      console.log('Product created:', result.data);
    } else {
      console.error('Error:', result.error);
    }
    isSaving = false;
  }
</script>

<ProductForm
  onSubmit={handleSubmit}
  loading={isSaving}
/>

<!-- Form includes: name, description, price, category, tags, inStock checkbox -->
<!-- Features: client-side validation, error display, loading state -->`}
			language="svelte"
		/>

		<h3>4. Search and Filter Products</h3>
		<CodeBlock
			code={`// Search by text (name, description, tags)
const results = productStore.searchProducts('laptop');

// Filter by category
const electronics = productStore.filterByCategory('Electronics');

// Filter in-stock only
const available = productStore.filterInStock();

// Access derived state
console.log('Total products:', productStore.items.length);
console.log('In stock:', productStore.inStockCount);
console.log('Total value:', productStore.totalValue);
console.log('Categories:', productStore.categories);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Concepts</h2>

		<h3>Product Model Structure</h3>
		<p>
			The <code>Product</code> class extends <code>SmrtObject</code> with comprehensive fields for e-commerce
			and inventory management:
		</p>
		<table>
			<thead>
				<tr>
					<th>Field</th>
					<th>Type</th>
					<th>Purpose</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>name</code></td>
					<td>string</td>
					<td>Product identifier</td>
					<td>"USB-C Hub"</td>
				</tr>
				<tr>
					<td><code>description</code></td>
					<td>string</td>
					<td>Detailed info</td>
					<td>"7-port hub with PD..."</td>
				</tr>
				<tr>
					<td><code>category</code></td>
					<td>string</td>
					<td>Category name</td>
					<td>"Electronics"</td>
				</tr>
				<tr>
					<td><code>manufacturer</code></td>
					<td>string</td>
					<td>Maker/brand</td>
					<td>"TechCorp"</td>
				</tr>
				<tr>
					<td><code>model</code></td>
					<td>string</td>
					<td>Model number</td>
					<td>"TC-HUB-7P"</td>
				</tr>
				<tr>
					<td><code>price</code></td>
					<td>number</td>
					<td>Decimal price</td>
					<td>39.99</td>
				</tr>
				<tr>
					<td><code>inStock</code></td>
					<td>boolean</td>
					<td>Availability</td>
					<td>true</td>
				</tr>
				<tr>
					<td><code>specifications</code></td>
					<td>Record</td>
					<td>Extensible attributes</td>
					<td>{'{'} weight: "1kg", ports: 7 {'}'}</td>
				</tr>
				<tr>
					<td><code>tags</code></td>
					<td>string[]</td>
					<td>Searchable keywords</td>
					<td>["usb", "hub", "adapter"]</td>
				</tr>
			</tbody>
		</table>

		<h3>Category System</h3>
		<p>Categories form a hierarchical structure for organizing products:</p>
		<CodeBlock
			code={`class Category extends SmrtObject {
  name: string
  description: string
  parentId: string | null       // Self-referencing hierarchy
  level: number                 // Depth in hierarchy (0 = root)
  productCount: number          // Cached count for performance
  active: boolean               // Soft delete flag

  // Methods
  async getProducts(): Promise<Product[]>
  async getSubcategories(): Promise<Category[]>
  async updateProductCount(): Promise<void>
  static async getRootCategories(): Promise<Category[]>
}`}
			language="typescript"
		/>

		<h3>Specifications System</h3>
		<p>
			Products have an extensible <code>specifications</code> field for storing arbitrary attributes:
		</p>
		<CodeBlock
			code={`// Store specifications
await product.updateSpecification('weight', '1.2kg');
await product.updateSpecification('warranty', 24); // months
await product.updateSpecification('colors', ['black', 'silver', 'gold']);

// Retrieve specifications
const weight = await product.getSpecification('weight');
const warranty = await product.getSpecification('warranty');

// Example specifications by product type:
// Electronics: weight, dimensions, power, warranty
// Clothing: size, material, care_instructions, colors
// Furniture: dimensions, weight_capacity, assembly_required, materials`}
			language="typescript"
		/>

		<h3>Reactive Store (Svelte 5 Runes)</h3>
		<p>
			The <code>ProductStoreClass</code> uses Svelte 5's runes for reactive state management:
		</p>
		<CodeBlock
			code={`export class ProductStoreClass {
  // Reactive state with $state rune
  items = $state<ProductData[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);
  selectedProduct = $state<ProductData | null>(null);

  // Derived state with $derived rune
  inStockCount = $derived(
    this.items.filter(p => p.inStock).length
  );

  totalValue = $derived(
    this.items.reduce((sum, p) => sum + (p.price || 0), 0)
  );

  categories = $derived(
    [...new Set(this.items.map(p => p.category).filter(Boolean))]
  );

  // Actions
  async loadProducts(): Promise<void>
  async createProduct(data): Promise<ApiResponse>
  async updateProduct(id, updates): Promise<ApiResponse>
  async deleteProduct(id): Promise<void>

  // Filters (return derived arrays)
  filterByCategory(category): ProductData[]
  filterInStock(): ProductData[]
  searchProducts(query): ProductData[]
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>API Reference</h2>

		<h3>Auto-Generated REST APIs</h3>
		<p>
			The <code>@smrt</code> decorator automatically generates REST endpoints:
		</p>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Endpoint</th>
					<th>Purpose</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>GET</code></td>
					<td>/api/v1/products</td>
					<td>List all products</td>
				</tr>
				<tr>
					<td><code>POST</code></td>
					<td>/api/v1/products</td>
					<td>Create new product</td>
				</tr>
				<tr>
					<td><code>GET</code></td>
					<td>/api/v1/products/:id</td>
					<td>Get single product</td>
				</tr>
				<tr>
					<td><code>PUT</code></td>
					<td>/api/v1/products/:id</td>
					<td>Update product</td>
				</tr>
				<tr>
					<td><code>GET</code></td>
					<td>/api/v1/categories</td>
					<td>List all categories</td>
				</tr>
			</tbody>
		</table>

		<h3>TypeScript Client</h3>
		<CodeBlock
			code={`import { createClient } from '@happyvertical/smrt-products/client';

const client = createClient('/api/v1');

// List products
const products = await client.products.list();

// Get single product
const product = await client.products.get(productId);

// Create product
const newProduct = await client.products.create({
  name: 'New Product',
  price: 29.99,
  inStock: true
});

// Update product
const updated = await client.products.update(productId, {
  price: 24.99,
  inStock: false
});`}
			language="typescript"
		/>

		<h3>Components API</h3>

		<h4>ProductCard</h4>
		<CodeBlock
			code={`<ProductCard
  product={productData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

<!-- Props:
  - product: ProductData (required)
  - onEdit?: (product: ProductData) => void
  - onDelete?: (product: ProductData) => void

  Displays: name, manufacturer, model, category, tags
  Actions: Edit/Delete buttons (if handlers provided)
-->`}
			language="svelte"
		/>

		<h4>ProductForm</h4>
		<CodeBlock
			code={`<ProductForm
  product={existingProduct}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  loading={isSaving}
/>

<!-- Props:
  - product?: ProductData (optional, for editing)
  - onSubmit: (product: Partial<ProductData>) => void | Promise<void>
  - onCancel?: () => void
  - loading?: boolean

  Fields: name (required), description, price (required, non-negative),
          category, tags (comma-separated), inStock (checkbox)
  Features: client-side validation, error display, loading state
-->`}
			language="svelte"
		/>

		<h4>ProductCatalog</h4>
		<CodeBlock
			code={`<ProductCatalog
  readonly={false}
  showCreateForm={true}
/>

<!-- Props:
  - readonly?: boolean (default: false)
  - showCreateForm?: boolean (default: false)

  Features:
  - Search bar (filters name, description, tags)
  - Category dropdown filter
  - Stats display (total, in stock, total value)
  - Product grid with ProductCard components
  - Create/Edit/Delete operations
  - Loading and error states
-->`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Tutorials</h2>

		<article>
			<h3>Tutorial 1: Creating and Managing Your Product Catalog (45-60 min)</h3>
			<p>Build a complete product catalog from scratch:</p>
			<ul>
				<li>Initialize ProductStore singleton in your app</li>
				<li>Create first product using ProductForm component</li>
				<li>Display catalog with ProductCatalog component</li>
				<li>Implement add/edit/delete operations</li>
				<li>Handle error states gracefully</li>
				<li>Deploy to production with persistence</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 2: Advanced Product Organization with Categories (45-60 min)</h3>
			<p>Organize products with hierarchical categories:</p>
			<ul>
				<li>Set up hierarchical category structure (Electronics {'>'} Accessories {'>'} Cables)</li>
				<li>Assign products to categories</li>
				<li>Display category-filtered product views</li>
				<li>Implement category-specific landing pages</li>
				<li>Calculate and display product counts per category</li>
				<li>Build category navigation menu</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 3: Product Search and Filtering (30-45 min)</h3>
			<p>Implement advanced search and filtering:</p>
			<ul>
				<li>Full-text search across name, description, and tags</li>
				<li>Category filters (single and multi-select)</li>
				<li>Availability filter (in-stock only checkbox)</li>
				<li>Combine multiple filters for precise results</li>
				<li>Display result counts and stats</li>
				<li>Clear all filters button</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 4: Specifications and Product Variants (45-60 min)</h3>
			<p>Handle product variants using specifications:</p>
			<ul>
				<li>Model product variants using specifications field</li>
				<li>Store variant combinations (size, color, material)</li>
				<li>Display variant selector UI in ProductCard</li>
				<li>Update inventory per variant</li>
				<li>Support dynamic specification schema per category</li>
				<li>Validate specification values before saving</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Real-World Examples</h2>

		<h3>Example 1: E-Commerce Product Catalog</h3>
		<CodeBlock
			code={`// Initialize store
const store = new ProductStoreClass();
await store.loadProducts();

// Create category
const electronics = await Category.create({
  name: 'Electronics',
  description: 'Electronic devices and accessories',
  level: 0
});

// Create product in category
const hub = await store.createProduct({
  name: 'USB-C Hub',
  description: '7-port hub with 100W Power Delivery',
  category: 'Electronics',
  manufacturer: 'TechCorp',
  model: 'TC-HUB-7P',
  price: 39.99,
  inStock: true,
  tags: ['usb', 'hub', 'adapter', 'usb-c'],
  specifications: {
    ports: 7,
    power_delivery: '100W',
    weight: '120g',
    warranty: 24
  }
});

// Search and filter
const hubs = store.searchProducts('hub');
const available = store.filterInStock();
const electronicsProducts = store.filterByCategory('Electronics');

console.log('Total products:', store.items.length);
console.log('In stock:', store.inStockCount);
console.log('Catalog value:', store.totalValue);`}
			language="typescript"
		/>

		<h3>Example 2: Product Inventory Dashboard</h3>
		<CodeBlock
			code={`<script lang="ts">
  import { ProductCatalog } from '@happyvertical/smrt-products';
  import { onMount } from 'svelte';

  onMount(() => {
    // Catalog auto-loads products on mount
  });
</script>

<div class="dashboard">
  <h1>Inventory Management</h1>

  <ProductCatalog
    showCreateForm={true}
    readonly={false}
  />

  <!-- Auto-displays:
    - Search bar (filters by text)
    - Category filter dropdown
    - Stats: total products, in stock, total value
    - Product grid with cards
    - Create/Edit/Delete operations
    - Loading and error states
  -->
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>`}
			language="svelte"
		/>

		<h3>Example 3: Admin Product Editor</h3>
		<CodeBlock
			code={`<script lang="ts">
  import { ProductForm } from '@happyvertical/smrt-products';
  import { productStore } from './stores/product-store';

  let selectedProduct = productStore.selectedProduct;
  let isSaving = false;

  async function handleSave(productData) {
    isSaving = true;

    try {
      if (selectedProduct?.id) {
        // Update existing
        await productStore.updateProduct(selectedProduct.id, productData);
      } else {
        // Create new
        await productStore.createProduct(productData);
      }
      handleCancel();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      isSaving = false;
    }
  }

  function handleCancel() {
    productStore.selectProduct(null);
  }
</script>

<div class="editor">
  <h2>{selectedProduct ? 'Edit' : 'Create'} Product</h2>

  <ProductForm
    product={selectedProduct}
    onSubmit={handleSave}
    onCancel={handleCancel}
    loading={isSaving}
  />
</div>`}
			language="svelte"
		/>

		<h3>Example 4: Manufacturer-Based Search</h3>
		<CodeBlock
			code={`import { Product } from '@happyvertical/smrt-products';

// Find all products by manufacturer
const techCorpProducts = await Product.findByManufacturer('TechCorp');

console.log('Found', techCorpProducts.length, 'TechCorp products');

// Compare specifications across products
for (const product of techCorpProducts) {
  const warranty = await product.getSpecification('warranty');
  const weight = await product.getSpecification('weight');

  console.log(product.name);
  console.log('  Price:', product.price);
  console.log('  Warranty:', warranty, 'months');
  console.log('  Weight:', weight);
  console.log('  In stock:', product.inStock);
  console.log('---');
}

// Calculate average price
const avgPrice = techCorpProducts.reduce((sum, p) => sum + p.price, 0) / techCorpProducts.length;
console.log('Average TechCorp product price:', avgPrice.toFixed(2));`}
			language="typescript"
		/>

		<h3>Example 5: Product Specifications System</h3>
		<CodeBlock
			code={`// Create product with specifications
const laptop = await Product.create({
  name: 'Pro Laptop 15"',
  manufacturer: 'TechCorp',
  model: 'PL-15-2024',
  price: 1299.99,
  inStock: true,
  category: 'Computers',
  specifications: {
    screen_size: '15.6 inches',
    resolution: '1920x1080',
    processor: 'Intel Core i7',
    ram: '16GB',
    storage: '512GB SSD',
    weight: '1.8kg',
    battery_life: '10 hours',
    warranty: 36
  }
});

// Update specifications
await laptop.updateSpecification('ram', '32GB');
await laptop.updateSpecification('storage', '1TB SSD');

// Retrieve specifications
const ram = await laptop.getSpecification('ram');
const processor = await laptop.getSpecification('processor');

console.log('Upgraded RAM:', ram);
console.log('Processor:', processor);

// Search products with specific specification
const allLaptops = await Product.findByCategory('Computers');
const highRamLaptops = [];

for (const product of allLaptops) {
  const ram = await product.getSpecification('ram');
  if (ram && parseInt(ram) >= 32) {
    highRamLaptops.push(product);
  }
}

console.log('Laptops with 32GB+ RAM:', highRamLaptops.length);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Integration Patterns</h2>

		<article>
			<h3>With smrt-core</h3>
			<ul>
				<li>Product and Category extend <code>SmrtObject</code> for ORM/persistence</li>
				<li><code>@smrt</code> decorator auto-generates REST APIs, CLI commands, MCP tools</li>
				<li>Inherits AI methods: <code>is()</code>, <code>do()</code>, <code>describe()</code></li>
				<li>Database schema auto-generated from TypeScript types</li>
				<li>Built-in validation and lifecycle hooks</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-commerce</h3>
			<ul>
				<li>Products feed into shopping cart and checkout</li>
				<li>Orders reference products via foreign keys</li>
				<li>Inventory sync with order transactions</li>
				<li>Price updates trigger commerce events</li>
				<li>Product availability affects checkout flow</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-assets</h3>
			<ul>
				<li>Product images/videos managed as assets</li>
				<li>ALT text auto-generated via AI for accessibility</li>
				<li>Asset versions for product photo updates</li>
				<li>Asset tagging aligns with product tags</li>
				<li>Derivatives (thumbnails, webp) generated automatically</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-ledgers</h3>
			<ul>
				<li>Product prices feed into accounting entries</li>
				<li>Revenue recognized per product/category</li>
				<li>Cost of goods sold tracking</li>
				<li>Inventory valuation for balance sheet</li>
				<li>Tax calculations based on product category</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-tenancy</h3>
			<ul>
				<li>Products isolated per tenant automatically</li>
				<li>Category hierarchies per tenant</li>
				<li>Separate product inventories</li>
				<li>Tenant-specific pricing and visibility</li>
				<li>Shared schema, separate data</li>
			</ul>
		</article>

		<article>
			<h3>Module Federation</h3>
			<ul>
				<li>ProductCard exported for consumption in other micro-frontends</li>
				<li>ProductCatalog embeddable in dashboards</li>
				<li>Product model definitions shared across services</li>
				<li>ProductStore accessible in federated apps</li>
				<li>Type safety maintained across boundaries</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Best Practices</h2>

		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use categories for organization (don't rely on tags alone)</li>
				<li>Cache derived data (inStockCount, totalValue) via store</li>
				<li>Validate product data before submission (form handles this)</li>
				<li>Use tags for searchable keywords and filtering</li>
				<li>Keep specifications schema consistent per product type</li>
				<li>Lazy-load products for large catalogs (implement pagination)</li>
				<li>Use the store for reactive state (not direct API calls)</li>
				<li>Implement pagination for large product lists (1000+ items)</li>
				<li>Use STI pattern for product variants/types</li>
			</ul>
		</article>

		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't store large files in specifications (use smrt-assets)</li>
				<li>Don't create deep category hierarchies ({'>'} 5 levels)</li>
				<li>Don't hard-code prices (use dynamic fields)</li>
				<li>Don't skip validation on forms</li>
				<li>Don't duplicate product data across services (use federation)</li>
				<li>Don't mutate store state directly (use provided actions)</li>
				<li>Don't fetch all products on page load without pagination</li>
				<li>Don't leave error states unhandled in UI</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Common Issues and Troubleshooting</h2>

		<article>
			<h3>Issue: Products not appearing in catalog</h3>
			<p><strong>Cause:</strong> Store not initialized or loadProducts() not called</p>
			<p><strong>Solution:</strong> Call loadProducts() in onMount or component initialization.</p>
			<CodeBlock
				code={`onMount(() => {
  productStore.loadProducts();
});`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Form validation errors</h3>
			<p><strong>Cause:</strong> Required fields empty (name, price) or invalid values</p>
			<p>
				<strong>Solution:</strong> ProductForm component handles validation. Check console for errors.
				Ensure name is non-empty and price is a positive number.
			</p>
		</article>

		<article>
			<h3>Issue: Specifications not saving</h3>
			<p><strong>Cause:</strong> Using wrong method or not awaiting promise</p>
			<p>
				<strong>Solution:</strong> Always await updateSpecification(), pass correct key/value types.
			</p>
			<CodeBlock
				code={`// Correct
await product.updateSpecification('weight', '1.2kg');

// Wrong: not awaiting
product.updateSpecification('weight', '1.2kg'); // Promise not resolved`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Search not finding results</h3>
			<p><strong>Cause:</strong> Search only looks at name, description, and tags</p>
			<p>
				<strong>Solution:</strong> Add relevant keywords to tags array for better searchability.
			</p>
		</article>

		<article>
			<h3>Issue: Category hierarchy confusion</h3>
			<p><strong>Cause:</strong> Not setting parentId correctly or level incorrect</p>
			<p>
				<strong>Solution:</strong> Use getRootCategories() for level=0. Set parentId for subcategories.
			</p>
		</article>

		<article>
			<h3>Issue: Performance with large catalogs</h3>
			<p><strong>Cause:</strong> Loading all products at once without pagination</p>
			<p>
				<strong>Solution:</strong> Implement API pagination. Filter/search client-side for small
				datasets ({'<'}1000 items), server-side for larger.
			</p>
		</article>

		<article>
			<h3>Issue: Module federation components not loading</h3>
			<p><strong>Cause:</strong> Expose config not exporting components</p>
			<p>
				<strong>Solution:</strong> Verify federation/expose.config.ts includes ProductCard, ProductCatalog
				exports.
			</p>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Base classes, decorators, and AI integration</p>
			</a>
			<a href="/modules/smrt-commerce" class="link-card">
				<h3>smrt-commerce</h3>
				<p>Shopping cart and checkout integration</p>
			</a>
			<a href="/modules/smrt-assets" class="link-card">
				<h3>smrt-assets</h3>
				<p>Product image and video management</p>
			</a>
			<a href="/modules/smrt-ledgers" class="link-card">
				<h3>smrt-ledgers</h3>
				<p>Accounting integration for revenue tracking</p>
			</a>
		</div>
	</section>

	<section>
		<nav aria-label="Footer navigation">
			<a href="/modules">← Back to Modules</a>
			<a href="/modules/smrt-tags">Next: smrt-tags →</a>
		</nav>
	</section>
</ModulePage>
