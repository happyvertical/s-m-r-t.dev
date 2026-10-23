const origin = 'https://s-m-r-t.dev';
const organizationId = `${origin}/#organization`;
const websiteId = `${origin}/#website`;
const sourceId = `${origin}/#source`;

const sectionNames: Record<string, string> = {
	foundations: 'Foundations',
	capabilities: 'Capabilities',
	guides: 'Guides',
	tooling: 'Tooling',
	reference: 'Reference',
	packages: 'Packages',
	components: 'Components',
	starters: 'Starters'
};

export function isDocPath(pathname: string): boolean {
	return /^\/(foundations|capabilities|guides|tooling|reference|starters)(\/|$)/.test(pathname);
}

/** Escape HTML delimiters, not JSON quotes: the result remains parseable JSON. */
export function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value).replace(
		/[<>&]/g,
		(character) => ({ '<': '\\u003c', '>': '\\u003e', '&': '\\u0026' })[character]!
	);
}

export function structuredData(title: string, description: string, url: string) {
	const pathname = new URL(url).pathname;
	const graph: Record<string, unknown>[] = [
		{
			'@type': 'Organization',
			'@id': organizationId,
			name: 'HappyVertical',
			url: 'https://happyvertical.com',
			sameAs: ['https://github.com/happyvertical']
		},
		{
			'@type': 'WebSite',
			'@id': websiteId,
			name: 's-m-r-t',
			url: origin,
			publisher: { '@id': organizationId }
		},
		{
			'@type': 'SoftwareSourceCode',
			'@id': sourceId,
			name: 's-m-r-t',
			codeRepository: 'https://github.com/happyvertical/smrt',
			license: 'https://opensource.org/license/mit',
			programmingLanguage: 'TypeScript',
			publisher: { '@id': organizationId }
		}
	];
	if (isDocPath(pathname)) {
		const parts = pathname.split('/').filter(Boolean);
		graph.push(
			{
				'@type': 'TechArticle',
				'@id': `${url}#article`,
				headline: title,
				description,
				url,
				isPartOf: { '@id': websiteId },
				about: { '@id': sourceId },
				publisher: { '@id': organizationId },
				mainEntityOfPage: url
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${url}#breadcrumbs`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: origin },
					...parts.map((part, index) => ({
						'@type': 'ListItem',
						position: index + 2,
						name: index === parts.length - 1 ? title : (sectionNames[part] ?? part),
						item: `${origin}/${parts.slice(0, index + 1).join('/')}`
					}))
				]
			}
		);
	}
	return { '@context': 'https://schema.org', '@graph': graph };
}

/** A complete inert script for Svelte head insertion; content is escaped above. */
export function jsonLdScript(title: string, description: string, url: string): string {
	return `<script type="application/ld+json">${serializeJsonLd(structuredData(title, description, url))}</script>`;
}
