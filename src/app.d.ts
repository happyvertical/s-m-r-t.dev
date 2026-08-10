// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	/**
	 * The installed smrt framework version, injected by the `define` block in
	 * `vite.config.ts` / `vitest.config.ts`. Read it through `$lib/version`
	 * rather than referencing this global directly.
	 */
	const __SMRT_VERSION__: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
