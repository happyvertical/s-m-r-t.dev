#!/usr/bin/env node
/**
 * Renders the labeled stills a feature showcase shows where no package ships a
 * playground entry for the feature (#362). Each still is a small SVG card of
 * Acme Corp example data — widgets, gizmos, gadgets, nick-nacks and doodads —
 * so the frame is an honest illustration, never a mock of a real screen. The
 * stills are committed; `features.test.ts` requires one per `still` example.
 *
 *   node scripts/generate-feature-stills.mjs          # write static/stills/features/*.svg
 *   node scripts/generate-feature-stills.mjs --check  # exit 1 if any file would change
 *
 * Playground-backed features are skipped: the live component is the example.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(PROJECT_ROOT, 'static/stills/features');
const CHECK = process.argv.includes('--check');

/**
 * One card per still-backed feature: a kicker, a title, column headers and a
 * few rows. Rows are plain strings so the card reads at thumbnail size.
 */
const cards = {
	tools: {
		kicker: 'Generated tools · Acme Corp',
		title: 'widgets',
		columns: ['Tool', 'Surface', 'Effects'],
		rows: [
			['widgets.list', 'MCP · CLI · REST', 'read'],
			['widgets.get', 'MCP · CLI · REST', 'read'],
			['widgets.save', 'CLI · REST', 'write · scoped'],
			['gizmos.list', 'MCP (public)', 'read']
		]
	},
	memory: {
		kicker: 'Agent memory · Acme Corp',
		title: 'Restock assistant',
		columns: ['Memory', 'Confidence', 'Last used'],
		rows: [
			['Gizmo lead time is 12 days', '0.91', 'yesterday'],
			['Doodads ship in cases of 40', '0.84', '3 days ago'],
			['Widget supplier prefers Tuesday', '0.42', 'last week']
		]
	},
	approvals: {
		kicker: 'Approval requests · Acme Corp',
		title: 'Pending decisions',
		columns: ['Request', 'Quorum', 'Expires'],
		rows: [
			['Reorder 400 gizmos', '1 of 2', 'in 6 hours'],
			['Retire nick-nack SKU NK-07', '0 of 1', 'tomorrow'],
			['Raise doodad price 4%', '2 of 2 · approved', '—']
		]
	},
	voice: {
		kicker: 'Voice outputs · Acme Corp',
		title: 'Product announcements',
		columns: ['Profile', 'Text', 'Status'],
		rows: [
			['Acme narrator', 'New gizmo line, spring', 'rendered · 0:42'],
			['Acme narrator', 'Doodad recall notice', 'rendered · 0:18'],
			['Warehouse', 'Widget bay B is full', 'queued']
		]
	},
	video: {
		kicker: 'Video production · Acme Corp',
		title: 'Gadget launch film',
		columns: ['Sequence', 'Scenes', 'Shots'],
		rows: [
			['Opening', '2', '5'],
			['The gadget', '4', '11'],
			['Doodad accessories', '1', '3']
		]
	},
	comments: {
		kicker: 'Comments · Acme Corp',
		title: 'On purchase order PO-2291',
		columns: ['Who', 'Comment', 'When'],
		rows: [
			['Priya', 'Gizmo count is 400, not 40.', '09:14'],
			['Marcus', '@Priya fixed, thanks.', '09:20'],
			['Priya', 'Approving.', '09:21']
		]
	},
	social: {
		kicker: 'Scheduled posts · Acme Corp',
		title: 'Spring gadget launch',
		columns: ['Account', 'Post', 'Scheduled'],
		rows: [
			['@acmecorp', 'The new gadget is here.', 'Mon 09:00'],
			['@acmecorp', 'Doodads, now in six colors.', 'Wed 12:00'],
			['Acme on LinkedIn', 'Behind the gizmo line', 'Fri 10:00']
		]
	},
	products: {
		kicker: 'Catalog · Acme Corp',
		title: 'Widgets and their SKUs',
		columns: ['Product', 'Axis', 'SKU'],
		rows: [
			['Widget', 'size · M', 'WG-100-M'],
			['Widget', 'size · L', 'WG-100-L'],
			['Gizmo', 'finish · brushed', 'GZ-20-BR'],
			['Doodad', '—', 'DD-9']
		]
	},
	subscriptions: {
		kicker: 'Plans · Acme Corp',
		title: 'Gizmo Care',
		columns: ['Version', 'Entitlement', 'Usage charge'],
		rows: [
			['v3 · current', '2 gizmo repairs / year', '$12 per extra repair'],
			['v2', '1 gizmo repair / year', '$15 per extra repair'],
			['v1 · retired', '—', '—']
		]
	},
	inventory: {
		kicker: 'Stock movements · Acme Corp',
		title: 'Widget WG-100',
		columns: ['Movement', 'Location', 'Qty'],
		rows: [
			['receive', 'Leeds depot', '+500'],
			['transfer', 'Leeds → Bristol', '−120'],
			['reserve', 'Bristol', '−40'],
			['adjust', 'Leeds depot', '−2']
		]
	},
	support: {
		kicker: 'Support cases · Acme Corp',
		title: 'Open cases',
		columns: ['Case', 'From', 'Target'],
		rows: [
			['Gizmo will not pair', 'chat', '2 h left'],
			['Wrong doodad color', 'email', '1 day left'],
			['Widget manual missing', 'email', 'escalated']
		]
	},
	timesheets: {
		kicker: 'Timecard · Acme Corp',
		title: 'Week of 20 October',
		columns: ['Day', 'Entry', 'Status'],
		rows: [
			['Mon', 'Gizmo line · 7.5 h', 'approved'],
			['Tue', 'Widget QA · 8 h', 'approved'],
			['Wed', 'Doodad packing · 6 h', 'submitted']
		]
	},
	expenses: {
		kicker: 'Expenses · Acme Corp',
		title: 'Awaiting review',
		columns: ['Expense', 'Receipt', 'Amount'],
		rows: [
			['Gizmo trade show travel', 'attached', '$412.80'],
			['Widget samples', 'attached', '$96.00'],
			['Doodad courier', 'duplicate of #318', '$18.50']
		]
	},
	hr: {
		kicker: 'Employment · Acme Corp',
		title: 'Gizmo line team',
		columns: ['Person', 'Position', 'Since'],
		rows: [
			['Priya N.', 'Line lead', '2023-04-01'],
			['Marcus O.', 'Assembler', '2024-09-16'],
			['Lena K.', 'QA · forklift certified', '2025-02-03']
		]
	},
	campaigns: {
		kicker: 'Campaigns · Acme Corp',
		title: 'Spring gadget launch',
		columns: ['Channel', 'Budget', 'Pacing'],
		rows: [
			['Search', '$6,000', 'on track'],
			['Social', '$3,500', 'ahead'],
			['Email', '$400', 'behind']
		]
	},
	ads: {
		kicker: 'Ad delivery · Acme Corp',
		title: 'Gizmo banner, header zone',
		columns: ['Variation', 'Weight', 'Tier'],
		rows: [
			['Brushed finish', '60%', 'priority 1'],
			['Matte finish', '40%', 'priority 1'],
			['Doodad fallback', '—', 'priority 3']
		]
	},
	affiliates: {
		kicker: 'Referral commissions · Acme Corp',
		title: 'October',
		columns: ['Affiliate', 'Referrals', 'Commission'],
		rows: [
			['gadgetreviews.test', '42', '$630.00'],
			['doodadfans.test', '17', '$85.00'],
			['Acme newsletter', '9', '$108.00']
		]
	},
	places: {
		kicker: 'Places · Acme Corp',
		title: 'Leeds depot',
		columns: ['Place', 'Type', 'Coordinates'],
		rows: [
			['Leeds depot', 'building', '53.80, −1.55'],
			['Bay B', 'zone', '—'],
			['Widget shelf 4', 'room', '—']
		]
	},
	orders: {
		kicker: 'Orders · Acme Corp',
		title: 'Open orders',
		columns: ['Order', 'Customer', 'Status'],
		rows: [
			['SO-1042 · 12 widgets', 'Acme North', 'shipped'],
			['SO-1043 · 40 doodads', 'Gadget Hut', 'packing'],
			['SO-1044 · 3 gizmos', 'Nick-Nack Row', 'in cart']
		]
	},
	payments: {
		kicker: 'Payments · Acme Corp',
		title: 'Received this week',
		columns: ['Payment', 'Pays', 'Amount'],
		rows: [
			['Acme North · card', 'INV-2207', '$480.00'],
			['Gadget Hut · transfer', 'INV-2209, INV-2210', '$1,125.00'],
			['Nick-Nack Row · card', 'INV-2212 · part', '$60.00']
		]
	},
	assemblies: {
		kicker: 'Assemblies · Acme Corp',
		title: 'Gadget GD-200',
		columns: ['Part', 'Quantity', 'Step'],
		rows: [
			['Widget WG-100', '2', 'Mount'],
			['Gizmo GZ-10', '1', 'Wire'],
			['Doodad DD-9', '4', 'Fasten']
		]
	},
	production: {
		kicker: 'Production · Acme Corp',
		title: 'Runs this week',
		columns: ['Run', 'Makes', 'Status'],
		rows: [
			['PR-310', '50 gadgets GD-200', 'in progress · step 2 of 3'],
			['PR-311', '200 widgets WG-100', 'planned'],
			['PR-309', '20 gizmos GZ-10', 'done']
		]
	},
	stock: {
		kicker: 'Stock · Acme Corp',
		title: 'On hand, Leeds depot',
		columns: ['Item', 'On hand', 'Reserved'],
		rows: [
			['Widget WG-100', '1,240', '300'],
			['Gizmo GZ-10', '86', '12'],
			['Doodad DD-9', '2,400', '0']
		]
	},
	tasks: {
		kicker: 'Tasks · Acme Corp',
		title: 'Gadget relaunch board',
		columns: ['Task', 'Owner', 'Column'],
		rows: [
			['Order new gizmo housings', 'Priya', 'In progress'],
			['Update widget spec sheet', 'Sam', 'To do'],
			['Photograph doodad range', 'Lee', 'Done']
		]
	}
};

const WIDTH = 640;
const HEIGHT = 400;

function escapeXml(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function render(id, card) {
	const columnX = [40, 280, 470];
	const headerY = 150;
	const rowHeight = 44;
	const rows = card.rows
		.map((row, index) => {
			const y = headerY + rowHeight * (index + 1);
			const cells = row
				.map(
					(cell, column) =>
						`<text x="${columnX[column]}" y="${y}" class="cell">${escapeXml(cell)}</text>`
				)
				.join('');
			return `<line x1="40" x2="600" y1="${y + 14}" y2="${y + 14}" class="rule"/>${cells}`;
		})
		.join('\n    ');
	const headers = card.columns
		.map(
			(column, index) =>
				`<text x="${columnX[index]}" y="${headerY}" class="head">${escapeXml(column)}</text>`
		)
		.join('');
	const label = `${card.title} — ${card.kicker}, an illustration`;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-labelledby="title-${id}">
  <title id="title-${id}">${escapeXml(label)}</title>
  <style>
    .bg { fill: #fbf8f3; }
    .card { fill: #ffffff; stroke: #e3dbd0; }
    .kicker { font: 600 12px/1 ui-monospace, "JetBrains Mono", monospace; fill: #c2410c; letter-spacing: 0.08em; text-transform: uppercase; }
    .title { font: 600 24px/1 Avenir, Inter, system-ui, sans-serif; fill: #1c1917; }
    .head { font: 600 12px/1 Avenir, Inter, system-ui, sans-serif; fill: #78716c; letter-spacing: 0.04em; text-transform: uppercase; }
    .cell { font: 400 15px/1 Avenir, Inter, system-ui, sans-serif; fill: #292524; }
    .rule { stroke: #efe9e1; }
    .badge { font: 600 11px/1 ui-monospace, "JetBrains Mono", monospace; fill: #78716c; letter-spacing: 0.06em; }
  </style>
  <rect class="bg" width="${WIDTH}" height="${HEIGHT}"/>
  <rect class="card" x="20" y="20" width="${WIDTH - 40}" height="${HEIGHT - 40}" rx="16"/>
  <text x="40" y="64" class="kicker">${escapeXml(card.kicker)}</text>
  <text x="40" y="104" class="title">${escapeXml(card.title)}</text>
  <text x="${WIDTH - 40}" y="64" text-anchor="end" class="badge">ILLUSTRATION</text>
  <g>
    ${headers}
    ${rows}
  </g>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });
let changed = 0;
for (const [id, card] of Object.entries(cards)) {
	const file = path.join(OUT_DIR, `${id}.svg`);
	const next = render(id, card);
	const current = existsSync(file) ? readFileSync(file, 'utf8') : null;
	if (current === next) continue;
	changed += 1;
	if (CHECK) {
		console.error(`stale: ${path.relative(PROJECT_ROOT, file)}`);
	} else {
		writeFileSync(file, next);
		console.log(`wrote ${path.relative(PROJECT_ROOT, file)}`);
	}
}

if (CHECK && changed > 0) {
	console.error(`${changed} still(s) differ; run node scripts/generate-feature-stills.mjs`);
	process.exit(1);
}
if (!CHECK) console.log(`${Object.keys(cards).length} stills, ${changed} written`);
