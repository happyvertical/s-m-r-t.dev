import type { PlannerController, PlannerProps } from '@happyvertical/smrt-planner';
import type { Component } from 'svelte';
import { getContext, setContext } from 'svelte';

type CookbookModule = typeof import('@happyvertical/smrt-svelte/cookbook');

/**
 * What the planner layout hands the planner page once the framework shell
 * and the planner package have loaded in the browser. The layout owns the
 * loading because the `Planner` must mount inside the `AppShell` it edits
 * (`layout="shell"` reads the nearest shell's layout controller and throws
 * without one), so the page renders it only when `status` is `ready`.
 */
export interface PlannerHost {
	readonly status: 'loading' | 'ready' | 'failed';
	readonly error: string | null;
	readonly Planner: Component<PlannerProps> | null;
	readonly SectionPage: CookbookModule['CookbookSectionPage'] | null;
	readonly controller: PlannerController | null;
}

interface MutablePlannerHost {
	status: PlannerHost['status'];
	error: string | null;
	Planner: Component<PlannerProps> | null;
	SectionPage: CookbookModule['CookbookSectionPage'] | null;
	controller: PlannerController | null;
}

const KEY = Symbol('s-m-r-t planner host');

export function createPlannerHost() {
	const host = $state<MutablePlannerHost>({
		status: 'loading',
		error: null,
		Planner: null,
		SectionPage: null,
		controller: null
	});
	setContext<PlannerHost>(KEY, host);
	return {
		ready(parts: Pick<MutablePlannerHost, 'Planner' | 'SectionPage' | 'controller'>) {
			host.Planner = parts.Planner;
			host.SectionPage = parts.SectionPage;
			host.controller = parts.controller;
			host.status = 'ready';
		},
		fail(error: unknown) {
			host.error = error instanceof Error ? error.message : String(error);
			host.status = 'failed';
		}
	};
}

/** The planner host of the enclosing `/planner` layout; `null` outside it. */
export function getPlannerHost(): PlannerHost | null {
	return getContext<PlannerHost | undefined>(KEY) ?? null;
}
