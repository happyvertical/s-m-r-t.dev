<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const installCode = `pnpm add @happyvertical/smrt-manufacturing`;

	const bomCode = `import {
  BillOfMaterialsCollection,
  BomLineCollection,
} from '@happyvertical/smrt-manufacturing';

const db = { type: 'sqlite', url: 'app.db' };
const boms = await BillOfMaterialsCollection.create({ db });
const lines = await BomLineCollection.create({ db });

const bom = await boms.create({
  productId: shirt.id, // upstream Product or any STI subtype
  version: 1,
  status: 'active',
  currency: 'USD',
});
await bom.save();

const fabric = await lines.create({
  bomId: bom.id,
  componentSkuId: fabricSku.id,
  qtyPerUnit: 2.0,
  uom: 'yards',
  wastePercent: 10, // 10% cutting waste
});
await fabric.save();

const buttons = await lines.create({
  bomId: bom.id,
  componentSkuId: buttonSku.id,
  qtyPerUnit: 4,
  uom: 'each',
});
await buttons.save();`;

	const costCode = `import { BomService } from '@happyvertical/smrt-manufacturing';

const service = await BomService.create({
  db,
  // Plug in any cost source: smrt-products Material.costPerUnit, a
  // purchase-order rolling average, a vendor price book, anything.
  // Returning null/undefined marks the line costUnavailable.
  costResolver: async (componentSkuId) => {
    const sku = await skus.get(componentSkuId);
    return sku ? Number(JSON.parse(sku.attributes ?? '{}').cost ?? 0) : null;
  },
});

const rollup = await service.computeMaterialCost(bom.id);
console.log(rollup.totalCost, rollup.currency);
// rollup also carries lineBreakdown[] (per-line cost incl. waste) and
// hasMissingCosts so a UI can warn when totalCost is a lower bound.`;

	const planCode = `// Shopping list to build 100 units (waste included, duplicate SKUs summed).
const requirements = await service.explodeRequirements(bom.id, 100);
// [{ componentSkuId: fabricSku.id, totalQty: 220, uom: 'yards' },
//  { componentSkuId: buttonSku.id, totalQty: 400, uom: 'each' }]

// Do we have enough available stock right now (summed across locations)?
const check = await service.canProduce(bom.id, 100);
if (!check.ok) {
  for (const shortage of check.shortages) {
    console.log(
      \`Need \${shortage.requested} of \${shortage.componentSkuId}, have \${shortage.available}\`,
    );
  }
}`;

	const productionCode = `import { ProductionService } from '@happyvertical/smrt-manufacturing';

const production = await ProductionService.create({ db });

// Pull materials from the factory (consume -> wip / out of available).
const consumed = await production.consumeMaterials(
  { id: order.id, productId: order.productId }, // ProductionOrder
  { locationId: factory.id, qty: 100 },         // explicit location
);

// Receive finished goods (+qty available for the finished SKU).
const produced = await production.produceFinishedGoods(
  { id: order.id, productId: order.productId },
  {
    locationId: factory.id,
    qty: 100,
    finishedSkuId: finishedVariant.id, // one productId can have many SKUs
  },
);

// Every emitted StockMovement is stamped sourceType: 'ProductionOrder'
// + sourceId: order.id, so you can reconstruct it later via
// StockMovementCollection.findBySource('ProductionOrder', order.id).`;

	const dispatchCode = `import { createDispatchBus } from '@happyvertical/smrt-core';
import { installInventoryDispatchHandlers } from '@happyvertical/smrt-inventory';
import { installManufacturingDispatchHandlers } from '@happyvertical/smrt-manufacturing';

const bus = await createDispatchBus({ db });

// Inventory handlers bridge contract:created and fulfillment:shipped.
await installInventoryDispatchHandlers({ dispatchBus: bus, db });

// Manufacturing handlers bridge production_order:posted (and optionally
// production_order:completed) to consume / produce.
await installManufacturingDispatchHandlers({
  dispatchBus: bus,
  db,
  // Consume AND produce in one shot when posted (make-to-stock).
  producedOnPosted: true,
  // Per-leg toggles: installProductionPosted, installProductionCompleted.
});

// Later, when a production order is posted:
await bus.emit('production_order:posted', {
  productionOrderId: order.id,
  productId: order.productId,
  locationId: factory.id,
  qty: 100,
  finishedSkuId: finishedVariant.id, // only when producedOnPosted: true
});`;
</script>

<ModulePage
	name="smrt-manufacturing"
	description="Bills of materials, cost rollup, requirements explosion, and production-order consume / produce operations. Strictly industry-neutral — recipe-to-finished-goods for any vertical."
	badges={['Domain', 'Manufacturing', 'BOM', 'Multi-tenant']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-manufacturing</strong> turns a recipe into finished goods. It owns
			two models — <code>BillOfMaterials</code> (a versioned recipe for one product) and
			<code>BomLine</code> (one component, with waste) — and three services that plan and execute a
			build. It is industry-neutral: the same primitives serve apparel, furniture, automotive, CPG,
			electronics, food production, or custom hardware.
		</p>
		<p>
			The package never invents its own stock store — it mutates the
			<a href="/modules/smrt-inventory">smrt-inventory</a> ledger on a production order's behalf, and
			the <code>ProductionOrder</code> row itself lives in
			<a href="/modules/smrt-commerce">smrt-commerce</a> as a <code>Contract</code> subtype. This
			package supplies the BOM math and the consume / produce operations.
		</p>
		<Callout variant="note" title="Planning vs. execution">
			<code>BomService</code> only answers questions — cost, requirements, "can we make this?" — and
			never touches stock. <code>ProductionService</code> is the one that writes stock movements
			(consume materials, produce finished goods).
		</Callout>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={installCode} lang="bash" />
		<p>
			Depends on <a href="/modules/smrt-inventory">@happyvertical/smrt-inventory</a> (peer-installed
			via your workspace) for the stock operations it drives.
		</p>
	</section>

	<section>
		<h2>Define a BOM with components</h2>
		<p>
			A <code>BillOfMaterials</code> has a <code>draft</code> / <code>active</code> /
			<code>superseded</code> lifecycle; each <code>BomLine</code> carries a
			<code>qtyPerUnit</code> and an optional <code>wastePercent</code>. The line's
			<code>effectiveQtyPerUnit()</code> returns the quantity including waste, and every planning
			method works from that effective number.
		</p>
		<CodeBlock code={bomCode} lang="typescript" />
	</section>

	<section>
		<h2>Roll up material cost with waste</h2>
		<p>
			<code>computeMaterialCost(bomId)</code> walks every line, resolves each component's unit cost
			through a pluggable <code>costResolver</code>, applies waste, and returns the rolled-up cost per
			produced unit plus a per-line breakdown. Cost resolution is intentionally external — point it at
			<code>smrt-products</code> <code>Material.costPerUnit</code>, a rolling average, or a price book:
		</p>
		<CodeBlock code={costCode} lang="typescript" />
		<p>The returned <code>BomCostRollup</code> shape:</p>
		<table>
			<thead>
				<tr>
					<th>Field</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>bomId</code></td>
					<td>string</td>
					<td>The BOM that was rolled up.</td>
				</tr>
				<tr>
					<td><code>totalCost</code></td>
					<td>number</td>
					<td>Total material cost per produced unit.</td>
				</tr>
				<tr>
					<td><code>currency</code></td>
					<td>string</td>
					<td>ISO 4217 code; defaults to <code>'USD'</code>.</td>
				</tr>
				<tr>
					<td><code>lineBreakdown</code></td>
					<td><code>BomLineCost[]</code></td>
					<td>
						Per line: <code>qtyPerUnit</code>, <code>wastePercent</code>, <code>effectiveQty</code>,
						<code>unitCost</code>, <code>lineCost</code>, <code>uom</code>, <code>costUnavailable</code>.
					</td>
				</tr>
				<tr>
					<td><code>hasMissingCosts</code></td>
					<td>boolean</td>
					<td>
						<code>true</code> when any line's cost was unresolved; treat <code>totalCost</code> as a
						lower bound.
					</td>
				</tr>
			</tbody>
		</table>
		<Callout variant="note" title="Missing costs surface, never silently zero">
			When no resolver is supplied (or a resolver returns <code>null</code>/<code>undefined</code>),
			that line contributes <code>0</code> and sets <code>costUnavailable: true</code>, and the
			aggregate <code>hasMissingCosts</code> flips — so a UI shows "missing cost data" instead of a
			misleading $0 BOM.
		</Callout>
	</section>

	<section>
		<h2>Plan a production run</h2>
		<p>
			<code>explodeRequirements(bomId, qty)</code> returns a deduplicated shopping list (lines pointing
			at the same component SKU are summed), and <code>canProduce(bomId, qty)</code> checks it against
			available stock summed across every location. Neither mutates anything:
		</p>
		<CodeBlock code={planCode} lang="typescript" />
		<p>
			<code>canProduce</code> returns a discriminated <code>CanProduceResult</code>:
			<code>{'{ ok: true; shortages: [] }'}</code> or
			<code>{'{ ok: false; shortages: MaterialShortage[] }'}</code>, where each shortage carries
			<code>componentSkuId</code>, <code>requested</code>, and <code>available</code>.
		</p>
	</section>

	<section>
		<h2>Execute consume / produce</h2>
		<p>
			<code>ProductionService</code> is the operational surface — it writes stock movements against
			the inventory ledger. Locations and the finished SKU are passed explicitly (they are not stored
			on the order), so one <code>productId</code> can produce into many SKUs:
		</p>
		<CodeBlock code={productionCode} lang="typescript" />
		<Callout variant="note" title="No active BOM?">
			When a production-order operation needs a BOM but neither an explicit <code>bomId</code> nor an
			active BOM exists for the product, <code>ProductionService</code> throws
			<code>NoActiveBomForProductError</code> — activate a BOM for the product or pass one in.
		</Callout>
	</section>

	<section>
		<h2>Opt-in DispatchBus wiring</h2>
		<p>
			The package ships handlers that bridge production-order lifecycle events to the consume /
			produce flow. They are <strong>off by default</strong>; install them explicitly alongside the
			inventory handlers. The companion <code>contract:created</code> and
			<code>fulfillment:shipped</code> handlers live in <a href="/modules/smrt-inventory">smrt-inventory</a>.
		</p>
		<CodeBlock code={dispatchCode} lang="typescript" />
	</section>

	<section>
		<h2>Multi-tenancy</h2>
		<p>
			Both <code>BillOfMaterials</code> and <code>BomLine</code> use
			<code>@TenantScoped({'{ mode: \'optional\' }'})</code> with a nullable <code>tenantId</code>.
			Wrap operations in <code>withTenant()</code> from
			<a href="/modules/smrt-tenancy">smrt-tenancy</a> to auto-filter reads and writes by tenant.
		</p>
	</section>

	<section>
		<h2>API surface</h2>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>BillOfMaterials</code> / <code>BomLine</code></td>
					<td>Recipe + component models. <code>BomLine.effectiveQtyPerUnit()</code> includes waste.</td>
				</tr>
				<tr>
					<td><code>BillOfMaterialsCollection</code></td>
					<td><code>findByProduct</code>, <code>findActiveForProduct</code>, <code>findByStatus</code></td>
				</tr>
				<tr>
					<td><code>BomLineCollection</code></td>
					<td><code>findByBom</code>, <code>findByComponent</code></td>
				</tr>
				<tr>
					<td><code>BomService</code> / <code>createBomService(...)</code></td>
					<td><code>computeMaterialCost</code>, <code>explodeRequirements</code>, <code>canProduce</code> (read-only).</td>
				</tr>
				<tr>
					<td><code>ProductionService</code> / <code>createProductionService(...)</code></td>
					<td><code>consumeMaterials</code>, <code>produceFinishedGoods</code> (writes the ledger).</td>
				</tr>
				<tr>
					<td><code>installManufacturingDispatchHandlers(...)</code></td>
					<td>Opt-in <code>production_order:*</code> bus wiring.</td>
				</tr>
				<tr>
					<td><code>BomNotFoundError</code> / <code>NoActiveBomForProductError</code></td>
					<td>Thrown when a BOM id can't be resolved / no active BOM exists for a product.</td>
				</tr>
				<tr>
					<td>
						<code>BomStatus</code>, <code>BomCostRollup</code>, <code>BomLineCost</code>,
						<code>MaterialRequirement</code>, <code>MaterialShortage</code>,
						<code>CanProduceResult</code>, <code>ComponentCostResolver</code>
					</td>
					<td>Exported types.</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-inventory" class="link-card">
				<h3>smrt-inventory</h3>
				<p>The stock ledger this package consumes from and produces into.</p>
			</a>
			<a href="/modules/smrt-products" class="link-card">
				<h3>smrt-products</h3>
				<p>Product, Material, Sku — the catalog BOM lines reference.</p>
			</a>
			<a href="/modules/smrt-commerce" class="link-card">
				<h3>smrt-commerce</h3>
				<p>Hosts the ProductionOrder (a Contract subtype) these operations act on.</p>
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
				href="/modules/smrt-subscriptions"
				style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>Next: smrt-subscriptions &rarr;</a
			>
		</div>
	</section>
</ModulePage>
