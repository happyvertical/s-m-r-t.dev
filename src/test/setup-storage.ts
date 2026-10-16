/**
 * Node >= 25 ships a built-in Web Storage global. Without `--localstorage-file`
 * its `localStorage` getter yields `undefined`, and it shadows the jsdom
 * implementation that vitest would otherwise install on the global. Code under
 * test that persists to `window.localStorage` (smrt-svelte's AdminShell
 * settings adapter) then throws in tests only; browsers are unaffected.
 *
 * Install an in-memory Storage when the global is unusable, for both
 * `localStorage` and `sessionStorage`.
 */
class MemoryStorage implements Storage {
	#items = new Map<string, string>();
	get length(): number {
		return this.#items.size;
	}
	clear(): void {
		this.#items.clear();
	}
	getItem(key: string): string | null {
		return this.#items.get(String(key)) ?? null;
	}
	key(index: number): string | null {
		return [...this.#items.keys()][index] ?? null;
	}
	removeItem(key: string): void {
		this.#items.delete(String(key));
	}
	setItem(key: string, value: string): void {
		this.#items.set(String(key), String(value));
	}
	[name: string]: unknown;
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
	let usable: boolean;
	try {
		usable = typeof globalThis[name]?.setItem === 'function';
	} catch {
		usable = false;
	}
	if (!usable) {
		const storage = new MemoryStorage();
		for (const target of [globalThis, globalThis.window].filter(Boolean)) {
			Object.defineProperty(target, name, { value: storage, configurable: true, writable: true });
		}
	}
}
