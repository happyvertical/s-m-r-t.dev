<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const installCode = `pnpm add @happyvertical/smrt-inventory`;

	const setupCode = `import {
  createStockService,
  InventoryLocationCollection,
} from '@happyvertical/smrt-inventory';
// Catalog shapes (Sku, Product, ...) live in smrt-products. For
// server-side scripts, tests, and SSR runtimes that don't run the Vite
// plugin, import from the /collections subpath.
import { SkuCollection } from '@happyvertical/smrt-products/collections';

const db = { type: 'sqlite', url: 'app.db' };
const skus = await SkuCollection.create({ db });
const locations = await InventoryLocationCollection.create({ db });
const stock = await createStockService({ db });

const widget = await skus.create({
  productId: 'prod-1',
  code: 'WIDGET-001',
  attributes: { finish: 'matte' },
});
await widget.save();

const warehouse = await locations.create({
  code: 'WH-EAST',
  name: 'Warehouse East',
  kind: 'warehouse',
});
await warehouse.save();`;

	const lifecycleCode = `// Inbound receipt — +qty available.
await stock.receive(widget.id, warehouse.id, 100, {
  sourceType: 'PurchaseOrder',
  sourceId: po.id,
});

// Reserve against an order — available -> allocated.
// Throws InsufficientStockError if there isn't enough available.
await stock.reserve(widget.id, warehouse.id, 10, {
  sourceType: 'Contract',
  sourceId: order.id,
});

// Cancel a reservation — allocated -> available.
await stock.release(widget.id, warehouse.id, 4);

// Ship — removes from allocated, leaves the building.
await stock.fulfill(widget.id, warehouse.id, 6, {
  sourceType: 'Fulfillment',
  sourceId: shipment.id,
});

// Cycle count caught five extra units — non-zero signed delta.
await stock.adjust(widget.id, warehouse.id, 5, {
  sourceType: 'CycleCount',
  sourceId: count.id,
});

// Move stock between locations — writes transfer_out + transfer_in legs.
await stock.transfer(widget.id, warehouse.id, store.id, 12, {
  sourceType: 'TransferOrder',
  sourceId: xfer.id,
});`;

	const queryCode = `import {
  StockLevelCollection,
  StockMovementCollection,
} from '@happyvertical/smrt-inventory';

const levels = await StockLevelCollection.create({ db });
const movements = await StockMovementCollection.create({ db });

// What's on hand at this location across every state?
const here = await levels.findByLocation(warehouse.id);

// Available total for a SKU across all locations?
const availableTotal = await levels.totalForSku(widget.id, 'available');

// What movements were caused by a particular contract?
const audit = await movements.findBySource('Contract', order.id);`;

	const errorCode = `import { InsufficientStockError } from '@happyvertical/smrt-inventory';

try {
  await stock.reserve(widget.id, warehouse.id, 9999);
} catch (err) {
  if (err instanceof InsufficientStockError) {
    // err carries skuId, locationId, state, requested, available
    console.log(
      \`Only \${err.available} available for \${err.skuId}, requested \${err.requested}\`,
    );
  } else {
    throw err;
  }
}`;

	const txCode = `// Atomicity across multiple stock calls — e.g. reserve every line of
// an order in one indivisible step. A shortfall on line N rolls back
// lines 1..N-1. Individual methods are already atomic on their own; use
// withTransaction only for cross-call composition.
await stock.withTransaction(async (tx) => {
  for (const line of order.lines) {
    await tx.reserve(line.skuId, line.locationId, line.qty, {
      sourceType: 'Contract',
      sourceId: order.id,
    });
  }
});`;

	const dispatchCode = `import { createDispatchBus } from '@happyvertical/smrt-core';
import { installInventoryDispatchHandlers } from '@happyvertical/smrt-inventory';

const bus = await createDispatchBus({ db });

// Off by default — opt in explicitly in your smrt.ts.
const handlers = await installInventoryDispatchHandlers({
  dispatchBus: bus,
  db,
  // Per-handler toggles (both default true):
  installContractReserved: true,
  installFulfillmentShipped: true,
});

// In smrt-commerce (or your own code):
await bus.emit('contract:created', {
  contractId: order.id,
  lines: [{ skuId, locationId, qty }],
});

await bus.emit('fulfillment:shipped', {
  fulfillmentId: shipment.id,
  lines: [{ skuId, locationId, qty }],
});

// handlers.dispose() detaches the subscribers (tests / shutdown).`;

	const tenantCode = `import { withTenant } from '@happyvertical/smrt-tenancy';

await withTenant({ tenantId: 'tenant-a' }, async () => {
  // Every read/write through locations, levels, movements, and the
  // StockService is filtered by tenant_id = 'tenant-a'.
  await stock.receive(widget.id, warehouse.id, 100);
});`;
</script>

<ModulePage
	name="smrt-inventory"
	description="Multi-location stock tracking — SKUs across locations, a materialized level view, an append-only movement ledger, and an ACID stock-mutation service. Strictly industry-neutral."
	badges={['Domain', 'Inventory', 'Multi-tenant', 'ACID ledger']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-inventory</strong> tracks discrete units across locations. It is
			deliberately industry-neutral — the same primitives serve apparel, furniture, automotive, CPG,
			electronics, or any vertical that counts units. Catalog shapes (<code>Product</code>,
			<code>Material</code>, <code>ProductVariant</code>, <code>Sku</code>) live in
			<a href="/modules/smrt-products">smrt-products</a>; this package adds the stock-motion layer on
			top.
		</p>
		<p>Three models, one service:</p>
		<ul>
			<li>
				<code>InventoryLocation</code> — a physical or virtual stocking site with an open-ended
				<code>kind</code>.
			</li>
			<li>
				<code>StockLevel</code> — the materialized <code>(skuId, locationId, state) &rarr; qty</code>
				view. <strong>Never mutated directly</strong> — only through the service.
			</li>
			<li>
				<code>StockMovement</code> — an append-only audit row. Exactly one per mutation; two for a
				transfer.
			</li>
		</ul>
		<Callout variant="warning" title="StockService is the only sanctioned mutation path">
			Reaching into the level or movement collections to change <code>qty</code> directly silently
			desyncs the audit ledger from the materialized balance and breaks cycle counts. Always go
			through <code>StockService</code>.
		</Callout>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={installCode} lang="bash" />
	</section>

	<section>
		<h2>Set up SKUs, locations, and a stock service</h2>
		<CodeBlock code={setupCode} lang="typescript" />
	</section>

	<section>
		<h2>Move stock through its lifecycle</h2>
		<p>
			Every method writes one (or two, for transfers) <code>StockMovement</code> audit rows so the
			ledger stays in lockstep with the materialized levels. The six methods are the entire mutation
			surface:
		</p>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>State transition</th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>receive</code></td>
					<td>&mdash; &rarr; available (+qty)</td>
					<td>Purchase-order receipts, returns, the "produce" leg of a build.</td>
				</tr>
				<tr>
					<td><code>reserve</code></td>
					<td>available &rarr; allocated</td>
					<td>Throws <code>InsufficientStockError</code> if available would go negative.</td>
				</tr>
				<tr>
					<td><code>release</code></td>
					<td>allocated &rarr; available</td>
					<td>Cancel a reservation; allocated stock returns to the pool.</td>
				</tr>
				<tr>
					<td><code>fulfill</code></td>
					<td>allocated &rarr; &mdash; (-qty)</td>
					<td>Stock ships / is consumed. Throws if allocated would go negative.</td>
				</tr>
				<tr>
					<td><code>transfer</code></td>
					<td>available@A &rarr; available@B</td>
					<td>Two legs (<code>transfer_out</code> + <code>transfer_in</code>) in one transaction.</td>
				</tr>
				<tr>
					<td><code>adjust</code></td>
					<td>signed delta on any state</td>
					<td>
						Cycle counts / corrections. Rejects a <code>0</code> delta; defaults to
						<code>available</code>, pass <code>state</code> to target another bucket.
					</td>
				</tr>
			</tbody>
		</table>
		<CodeBlock code={lifecycleCode} lang="typescript" />
		<p>
			Stock states are <code>available</code>, <code>allocated</code>, <code>wip</code>,
			<code>qc_hold</code>, and <code>damaged</code>; a single SKU at one location can hold non-zero
			quantities in several states at once.
		</p>
	</section>

	<section>
		<h2>Atomicity</h2>
		<p>
			Each mutation runs every write inside a single database transaction
			(<code>db.transaction(...)</code> on <a href="/sdk">@happyvertical/sql</a> &ge; 0.74.0). A
			partial failure — say the level write succeeds but the movement write throws — rolls the whole
			mutation back, so the materialized balance and the audit ledger never disagree. When you need
			atomicity <em>across</em> several stock calls, wrap them in <code>withTransaction</code>:
		</p>
		<CodeBlock code={txCode} lang="typescript" />
		<Callout variant="note" title="Concurrency caveat">
			Per-transaction locking guarantees atomicity of each individual call, not isolation across
			concurrent transactions. Awaited (serial) callers always see a consistent balance, but
			unawaited <code>Promise.all([reserve, reserve, ...])</code> against the same
			<code>(skuId, locationId)</code> can still over-allocate. Serialise upstream (e.g. via
			<a href="/modules/smrt-jobs">smrt-jobs</a>) if you need hard isolation. If the adapter lacks
			<code>transaction()</code>, the service degrades to serial writes with a one-time warning.
		</Callout>
	</section>

	<section>
		<h2>Query balances and the audit log</h2>
		<CodeBlock code={queryCode} lang="typescript" />
		<h3>Catch the insufficient-stock error</h3>
		<p>
			<code>InsufficientStockError</code> is thrown by <code>reserve</code>, <code>fulfill</code>,
			<code>transfer</code>, and a negative <code>adjust</code> when stock would go negative. It
			carries <code>skuId</code>, <code>locationId</code>, <code>state</code>,
			<code>requested</code>, and <code>available</code> so a UI can decide whether to retry,
			backorder, or cancel:
		</p>
		<CodeBlock code={errorCode} lang="typescript" />
	</section>

	<section>
		<h2>Opt-in DispatchBus wiring</h2>
		<p>
			The package ships handlers that bridge <code>contract:created</code> &rarr;
			<code>reserve()</code> and <code>fulfillment:shipped</code> &rarr; <code>fulfill()</code>. They
			are <strong>off by default</strong> — install them explicitly once you've decided you want
			automatic stock motion. Each event is processed atomically across its lines, so a shortfall on
			one line rolls back the rest; malformed payloads are logged with the specific reason rather
			than silently dropped.
		</p>
		<CodeBlock code={dispatchCode} lang="typescript" />
		<Callout variant="note" title="Where the manufacturing leg lives">
			The <code>production_order:posted</code> handler is intentionally <em>not</em> installed here —
			that bridge ships in <a href="/modules/smrt-manufacturing">smrt-manufacturing</a>, which depends
			on the BOM model.
		</Callout>
	</section>

	<section>
		<h2>Multi-tenancy</h2>
		<p>
			The three inventory models use <code>@TenantScoped({'{ mode: \'optional\' }'})</code> with a
			nullable <code>tenantId</code>. Wrap mutations in <code>withTenant()</code> from
			<a href="/modules/smrt-tenancy">smrt-tenancy</a> to scope reads and writes automatically:
		</p>
		<CodeBlock code={tenantCode} lang="typescript" />
	</section>

	<section>
		<h2>API surface</h2>
		<h3>Models &amp; collections</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>InventoryLocation</code></td>
					<td>Physical or virtual stocking site with open-ended <code>kind</code>.</td>
				</tr>
				<tr>
					<td><code>StockLevel</code></td>
					<td>Materialized <code>(skuId, locationId, state) &rarr; qty</code> row.</td>
				</tr>
				<tr>
					<td><code>StockMovement</code></td>
					<td>Append-only audit row; one per mutation, two for transfers.</td>
				</tr>
				<tr>
					<td><code>InventoryLocationCollection</code></td>
					<td><code>findByCode</code>, <code>findByKind</code>, <code>findByPlace</code>, <code>findActive</code></td>
				</tr>
				<tr>
					<td><code>StockLevelCollection</code></td>
					<td><code>getLevel</code>, <code>findBySku</code>, <code>findByLocation</code>, <code>totalForSku</code>, <code>totalForLocation</code></td>
				</tr>
				<tr>
					<td><code>StockMovementCollection</code></td>
					<td><code>findBySku</code>, <code>findByLocation</code>, <code>findBySource</code>, <code>findByReason</code></td>
				</tr>
			</tbody>
		</table>
		<h3>Service, errors &amp; types</h3>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>StockService</code></td>
					<td>The only sanctioned mutation surface — <code>receive</code>, <code>reserve</code>, <code>release</code>, <code>fulfill</code>, <code>transfer</code>, <code>adjust</code>, plus <code>withTransaction</code>.</td>
				</tr>
				<tr>
					<td><code>createStockService({'{ db }'})</code></td>
					<td>Convenience factory; shares one DB connection across the internal collections.</td>
				</tr>
				<tr>
					<td><code>InsufficientStockError</code></td>
					<td>Carries <code>skuId</code>, <code>locationId</code>, <code>state</code>, <code>requested</code>, <code>available</code>.</td>
				</tr>
				<tr>
					<td><code>installInventoryDispatchHandlers(...)</code></td>
					<td>Opt-in <code>contract:created</code> / <code>fulfillment:shipped</code> wiring.</td>
				</tr>
				<tr>
					<td><code>StockState</code></td>
					<td><code>'available' | 'allocated' | 'wip' | 'qc_hold' | 'damaged'</code></td>
				</tr>
				<tr>
					<td><code>StockMovementReason</code></td>
					<td>Canonical reason vocabulary (<code>'receipt'</code>, <code>'reservation'</code>, ...) plus free-form strings.</td>
				</tr>
				<tr>
					<td><code>InventoryLocationKind</code></td>
					<td>Open-ended classifier string (<code>warehouse</code>, <code>factory</code>, <code>retail</code>, ...).</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-products" class="link-card">
				<h3>smrt-products</h3>
				<p>Catalog shapes: Product, Material, ProductVariant, Sku.</p>
			</a>
			<a href="/modules/smrt-manufacturing" class="link-card">
				<h3>smrt-manufacturing</h3>
				<p>BOMs and production orders that consume / produce against this ledger.</p>
			</a>
			<a href="/modules/smrt-commerce" class="link-card">
				<h3>smrt-commerce</h3>
				<p>Contracts and fulfillments that emit the dispatch signals above.</p>
			</a>
		</div>
	</section>

	<section>
		<div
			style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);"
		>
			<a href="/modules" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>&larr; Back to Modules</a
			>
			<a
				href="/modules/smrt-manufacturing"
				style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>Next: smrt-manufacturing &rarr;</a
			>
		</div>
	</section>
</ModulePage>
