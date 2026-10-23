import { cleanup, render } from '@testing-library/svelte';
import { afterEach, expect, it } from 'vitest';
import SEO from './SEO.svelte';

afterEach(cleanup);

it('keeps JSON-LD inert and updates the head when page metadata changes', async () => {
	const title = '</script><img src=x onerror=alert(1)> & >';
	const { rerender } = render(SEO, {
		title,
		description: 'Initial description',
		url: 'https://s-m-r-t.dev/reference/security'
	});
	const readGraph = () => {
		const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
		expect(scripts).toHaveLength(1);
		return JSON.parse(scripts[0].textContent!);
	};
	expect(
		readGraph()['@graph'].find((node: Record<string, unknown>) => node['@type'] === 'TechArticle')
			.headline
	).toBe(title);
	expect(document.head.querySelector('img')).toBeNull();
	await rerender({
		title: 'Forms',
		description: 'Updated description',
		url: 'https://s-m-r-t.dev/capabilities/agent-assisted-forms'
	});
	expect(
		readGraph()['@graph'].find((node: Record<string, unknown>) => node['@type'] === 'TechArticle')
	).toMatchObject({
		headline: 'Forms',
		description: 'Updated description',
		url: 'https://s-m-r-t.dev/capabilities/agent-assisted-forms'
	});
});
