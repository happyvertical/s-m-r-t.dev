<script lang="ts">
	/**
	 * "A component library you don't have to build": faithful static previews of
	 * REAL smrt-svelte components (names verified against the package:
	 * MembershipCard, RoleBadge, MoneyInput, SummaryCard, CurrencyDisplay,
	 * StatusBadge). These are lightweight visual mockups — they match the shape
	 * of the shipped components without importing them, so the landing stays
	 * self-contained. Each is captioned with the real component name.
	 */
</script>

<div class="gallery">
	<!-- MembershipCard: avatar + name + role pill -->
	<figure class="demo">
		<div class="demo-stage">
			<div class="m-card">
				<span class="m-avatar" aria-hidden="true">AR</span>
				<div class="m-meta">
					<span class="m-name">Ada Reyes</span>
					<span class="m-email">ada@acme.dev</span>
				</div>
				<span class="role-pill role-owner">Owner</span>
			</div>
		</div>
		<figcaption>MembershipCard &middot; RoleBadge</figcaption>
	</figure>

	<!-- SummaryCard styled as an invoice line -->
	<figure class="demo">
		<div class="demo-stage">
			<div class="s-card">
				<div class="s-top">
					<span class="s-label">Invoice</span>
					<span class="s-num">#INV-2042</span>
				</div>
				<div class="s-amount">$1,280.00</div>
				<div class="s-bottom">
					<span class="status-badge status-paid">Paid</span>
					<span class="s-date">Due Jun 30</span>
				</div>
			</div>
		</div>
		<figcaption>SummaryCard &middot; CurrencyDisplay</figcaption>
	</figure>

	<!-- MoneyInput -->
	<figure class="demo">
		<div class="demo-stage">
			<label class="money">
				<span class="money-label">Price</span>
				<span class="money-field">
					<span class="money-sym">$</span>
					<span class="money-val">49.00</span>
					<span class="money-cur">USD</span>
				</span>
			</label>
		</div>
		<figcaption>MoneyInput</figcaption>
	</figure>

	<!-- StatusBadge cluster -->
	<figure class="demo">
		<div class="demo-stage">
			<div class="badge-cluster">
				<span class="status-badge status-active">Active</span>
				<span class="status-badge status-pending">Pending</span>
				<span class="status-badge status-archived">Archived</span>
				<span class="role-pill role-admin">Admin</span>
				<span class="role-pill role-member">Member</span>
			</div>
		</div>
		<figcaption>StatusBadge &middot; RoleBadge</figcaption>
	</figure>
</div>

<p class="gallery-foot">
	Real, themeable Svelte components &mdash;
	<a href="/components">see the full library &rarr;</a>
</p>

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 18px;
	}

	.demo {
		margin: 0;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface, #fff);
		overflow: hidden;
	}

	.demo-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 130px;
		padding: 24px;
		background:
			radial-gradient(
				circle at 50% 0%,
				color-mix(in srgb, var(--smrt-color-primary, #1976d2) 7%, transparent),
				transparent 70%
			),
			var(--smrt-color-surface-container, #f7f7f7);
	}

	figcaption {
		padding: 10px 16px;
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.78rem;
		color: var(--smrt-color-on-surface-variant, #888);
		border-top: 1px solid var(--smrt-color-outline-variant, #eee);
		text-align: center;
	}

	/* --- MembershipCard --- */
	.m-card {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		max-width: 320px;
		padding: 14px 16px;
		border-radius: var(--smrt-radius-md, 10px);
		background: var(--smrt-color-surface, #fff);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.m-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--smrt-color-primary, #1976d2);
		color: var(--smrt-color-on-primary, #fff);
		font-weight: 600;
		font-size: 0.85rem;
	}

	.m-meta {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.m-name {
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.m-email {
		font-size: 0.8rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	/* --- role pills (RoleBadge) --- */
	.role-pill {
		display: inline-flex;
		align-items: center;
		padding: 3px 10px;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.role-owner {
		background: color-mix(in srgb, var(--smrt-color-primary, #1976d2) 16%, transparent);
		color: var(--smrt-color-primary, #1976d2);
	}

	.role-admin {
		background: color-mix(in srgb, var(--smrt-color-tertiary, #7c3aed) 16%, transparent);
		color: var(--smrt-color-tertiary, #7c3aed);
	}

	.role-member {
		background: var(--smrt-color-surface-container-high, #ececec);
		color: var(--smrt-color-on-surface-variant, #555);
	}

	/* --- SummaryCard --- */
	.s-card {
		width: 100%;
		max-width: 260px;
		padding: 16px 18px;
		border-radius: var(--smrt-radius-md, 10px);
		background: var(--smrt-color-surface, #fff);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.s-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8px;
	}

	.s-label {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.s-num {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.78rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.s-amount {
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--smrt-color-on-surface, #1a1a1a);
		margin-bottom: 12px;
	}

	.s-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.s-date {
		font-size: 0.78rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	/* --- StatusBadge --- */
	.status-badge {
		display: inline-flex;
		align-items: center;
		padding: 3px 10px;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.status-paid,
	.status-active {
		background: color-mix(in srgb, var(--smrt-color-success, #059669) 15%, transparent);
		color: var(--smrt-color-success, #059669);
	}

	.status-pending {
		background: color-mix(in srgb, var(--smrt-color-warning, #d97706) 16%, transparent);
		color: var(--smrt-color-warning, #b45309);
	}

	.status-archived {
		background: var(--smrt-color-surface-container-high, #ececec);
		color: var(--smrt-color-on-surface-variant, #666);
	}

	/* --- MoneyInput --- */
	.money {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
		max-width: 240px;
	}

	.money-label {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.money-field {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 11px 14px;
		border: 1px solid var(--smrt-color-outline, #cfcfcf);
		border-radius: var(--smrt-radius-sm, 6px);
		background: var(--smrt-color-surface, #fff);
	}

	.money-sym {
		color: var(--smrt-color-on-surface-variant, #888);
		font-weight: 600;
	}

	.money-val {
		flex: 1;
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 1rem;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.money-cur {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 2px 7px;
		border-radius: 4px;
		background: var(--smrt-color-surface-container, #f1f1f1);
		color: var(--smrt-color-on-surface-variant, #777);
	}

	/* --- badge cluster --- */
	.badge-cluster {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
		max-width: 280px;
	}

	@media (max-width: 640px) {
		.gallery {
			grid-template-columns: 1fr;
		}
	}

	.gallery-foot {
		text-align: center;
		margin: 36px 0 0;
		font-size: 1rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.gallery-foot a {
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
		font-weight: 600;
	}

	.gallery-foot a:hover {
		text-decoration: underline;
	}
</style>
