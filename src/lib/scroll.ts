export type ShellNavigationType = 'enter' | 'form' | 'goto' | 'link' | 'popstate';

export function createShellScrollMemory() {
	const positions = new Map<string, number>();

	function key(url: URL) {
		return `${url.pathname}${url.search}${url.hash}`;
	}

	return {
		capture(url: URL, scrollTop: number) {
			positions.set(key(url), scrollTop);
		},
		destination(url: URL, type: ShellNavigationType): number | null {
			if (url.hash) return null;
			return type === 'popstate' ? (positions.get(key(url)) ?? 0) : 0;
		}
	};
}
