/**
 * The colour scheme the map follows: the site toggle first (the theme provider
 * stamps `data-color-scheme` on <html>), then a plain `data-theme="light|dark"`,
 * then the viewer's `prefers-color-scheme`.
 */

export type Scheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function currentScheme(root: HTMLElement = document.documentElement): Scheme {
	for (const value of [root.dataset.colorScheme, root.dataset.theme]) {
		if (value === 'light' || value === 'dark') return value;
	}
	return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/** Calls `onChange` when the preference or the toggle changes; returns a cleanup. */
export function watchScheme(onChange: (_scheme: Scheme) => void): () => void {
	const root = document.documentElement;
	const media = window.matchMedia(DARK_QUERY);
	const notify = () => onChange(currentScheme(root));
	media.addEventListener('change', notify);
	const observer = new MutationObserver(notify);
	observer.observe(root, {
		attributes: true,
		attributeFilter: ['data-theme', 'data-color-scheme']
	});
	return () => {
		media.removeEventListener('change', notify);
		observer.disconnect();
	};
}
