#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT = join(ROOT, 'src', 'lib', 'data', 'ui-components.generated.ts');

const SCOPE_ROOT = join(ROOT, 'node_modules', '@happyvertical');

/**
 * Human titles for the declaration directories the packages ship. The directory
 * is the semantic axis a package already groups its components by, so deriving
 * sections from it keeps the reference readable without a hand-maintained table
 * that goes stale the moment a package adds a subpath.
 */
const DIRECTORY_TITLES = new Map([
	['forms', 'Forms and controls'],
	['ui', 'Actions and display'],
	['feedback', 'Feedback and overlays'],
	['data', 'Collections and tables'],
	['layout', 'Layout'],
	['nav', 'Navigation'],
	['display', 'Display and status'],
	['calendar', 'Calendar'],
	['chat', 'Chat'],
	['i18n', 'Internationalization'],
	['memberships', 'Membership and permissions'],
	['permissions', 'Membership and permissions'],
	['roles', 'Membership and permissions'],
	['themes', 'Themes'],
	['components', 'Components'],
	['svelte', 'Components'],
	['admin', 'Admin surfaces'],
	['workspace', 'Workspace'],
	['settings', 'Settings'],
	['board', 'Board']
]);

/**
 * Named in smrt-svelte's `dist/` but exported by no subpath, and its package doc
 * says not to document them as available API (happyvertical/smrt#2286). Exports
 * discovery excludes them already; the assertion keeps it that way.
 */
const UNEXPORTED = ['WorkspaceShell', 'RoleShell', 'NavTree', 'Breadcrumbs'];

function titleCase(value) {
	return value
		.split(/[-_]/)
		.filter(Boolean)
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

/** Every installed `@happyvertical/smrt-*` package, in a stable order. */
function installedPackages() {
	if (!existsSync(SCOPE_ROOT)) return [];
	return readdirSync(SCOPE_ROOT)
		.filter((name) => name.startsWith('smrt-'))
		.filter((name) => existsSync(join(SCOPE_ROOT, name, 'package.json')))
		.sort();
}

/**
 * The declaration entry points a package actually exposes, paired with the
 * import path a consumer writes to reach them. Wildcard subpaths are skipped:
 * they name no single module to read.
 */
function exportedEntries(packageDir, packageName) {
	const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
	const entries = [];
	for (const [subpath, value] of Object.entries(manifest.exports ?? {})) {
		if (subpath.includes('*')) continue;
		const target =
			typeof value === 'string' ? value : (value?.types ?? value?.svelte ?? value?.import);
		if (typeof target !== 'string') continue;
		const declaration = join(packageDir, target.replace(/\.js$/, '.d.ts'));
		if (!existsSync(declaration)) continue;
		entries.push({
			declaration,
			importPath: subpath === '.' ? packageName : `${packageName}/${subpath.slice(2)}`
		});
	}
	return entries;
}

const exampleByComponent = new Map([
	['Form', 'base-controls'],
	['Field', 'base-controls'],
	['FormGroup', 'base-controls'],
	['Input', 'base-controls'],
	['Textarea', 'base-controls'],
	['Select', 'base-controls'],
	['Toggle', 'base-controls'],
	['Button', 'base-controls'],
	['Badge', 'base-controls'],
	['StatusBadge', 'base-controls'],
	['Checkbox', 'interactive-controls'],
	['Combobox', 'interactive-controls'],
	['DatePicker', 'interactive-controls'],
	['FilePicker', 'interactive-controls'],
	['Listbox', 'interactive-controls'],
	['MultiSelect', 'interactive-controls'],
	['Radio', 'interactive-controls'],
	['RadioGroup', 'interactive-controls'],
	['RangeSlider', 'interactive-controls'],
	['SegmentedControl', 'interactive-controls'],
	['Slider', 'interactive-controls'],
	['Switch', 'interactive-controls'],
	['TagsInput', 'interactive-controls'],
	['TimePicker', 'interactive-controls'],
	['ToggleButton', 'interactive-controls'],
	['Alert', 'feedback-overlays'],
	['ConfirmDialog', 'feedback-overlays'],
	['Drawer', 'feedback-overlays'],
	['Sheet', 'feedback-overlays'],
	['LoadingOverlay', 'feedback-overlays'],
	['Meter', 'feedback-overlays'],
	['Modal', 'feedback-overlays'],
	['Progress', 'feedback-overlays'],
	['ProgressBar', 'feedback-overlays'],
	['Spinner', 'feedback-overlays'],
	['ToastViewport', 'feedback-overlays'],
	['Accordion', 'feedback-overlays'],
	['AccordionItem', 'feedback-overlays'],
	['Disclosure', 'feedback-overlays'],
	['Dropdown', 'feedback-overlays'],
	['Menu', 'feedback-overlays'],
	['Popover', 'feedback-overlays'],
	['CollectionList', 'collections'],
	['ContentList', 'collections'],
	['CollectionToolbar', 'collections'],
	['DataTable', 'data-table']
]);

const exampleLabels = {
	'base-controls': 'Base Controls',
	'interactive-controls': 'Interactive Controls',
	'feedback-overlays': 'Feedback & Overlays',
	collections: 'Collections & Content Lists',
	'data-table': 'Data Table'
};

function slugify(name) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
		.toLowerCase();
}

function svelteDeclarationFor(fromFile, specifier) {
	return `${resolve(dirname(fromFile), specifier.replace(/\.js$/, ''))}.d.ts`;
}

/**
 * Every Svelte component a declaration barrel exposes, as `[exportedName, path]`.
 *
 * Packages use two shapes to publish a component, and reading only the first
 * silently loses whole packages: content, messages, projects, fields, agents,
 * assets, analytics, jobs, users, images and tenancy all use the second.
 *
 *   export { default as Foo } from './Foo.svelte';   // re-export
 *   import Foo from './Foo.svelte'; export { Foo };  // import, then export
 *
 * `export * from './x'` is followed wholesale. A named re-export through a
 * non-Svelte module is followed too, then filtered to the names it actually
 * lists, so a component reachable only through some other subpath is not
 * published here under an import path that would not resolve.
 */
function declarationsFromBarrel(barrelPath, seen = new Set()) {
	if (!existsSync(barrelPath) || seen.has(barrelPath)) return [];
	seen.add(barrelPath);

	const source = ts.createSourceFile(
		barrelPath,
		readFileSync(barrelPath, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);
	const declarations = [];
	const importedComponents = new Map();

	for (const statement of source.statements) {
		if (!ts.isImportDeclaration(statement)) continue;
		if (!statement.importClause?.name) continue;
		if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
		if (!/\.svelte(\.js)?$/.test(statement.moduleSpecifier.text)) continue;
		importedComponents.set(
			statement.importClause.name.text,
			svelteDeclarationFor(barrelPath, statement.moduleSpecifier.text)
		);
	}

	for (const statement of source.statements) {
		if (!ts.isExportDeclaration(statement)) continue;
		const specifier =
			statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
				? statement.moduleSpecifier.text
				: null;
		const fromSvelte = specifier ? /\.svelte(\.js)?$/.test(specifier) : false;

		if (!statement.exportClause) {
			if (!specifier) continue;
			const next = resolveDeclarationModule(barrelPath, specifier);
			if (next) declarations.push(...declarationsFromBarrel(next, seen));
			continue;
		}
		if (!ts.isNamedExports(statement.exportClause)) continue;

		const elements = statement.exportClause.elements;
		if (fromSvelte) {
			for (const element of elements) {
				if ((element.propertyName ?? element.name).text !== 'default') continue;
				declarations.push([element.name.text, svelteDeclarationFor(barrelPath, specifier)]);
			}
			continue;
		}
		if (!specifier) {
			for (const element of elements) {
				const local = (element.propertyName ?? element.name).text;
				const declaration = importedComponents.get(local);
				if (declaration) declarations.push([element.name.text, declaration]);
			}
			continue;
		}

		const next = resolveDeclarationModule(barrelPath, specifier);
		if (!next) continue;
		const reachable = new Map(declarationsFromBarrel(next, new Set(seen)));
		for (const element of elements) {
			const local = (element.propertyName ?? element.name).text;
			if (reachable.has(local)) declarations.push([element.name.text, reachable.get(local)]);
		}
	}

	return declarations;
}

function resolveDeclarationModule(fromFile, specifier) {
	if (!specifier.startsWith('.')) return null;
	const base = resolve(dirname(fromFile), specifier.replace(/\.js$/, ''));
	for (const candidate of [`${base}.d.ts`, join(base, 'index.d.ts')]) {
		if (existsSync(candidate)) return candidate;
	}
	return null;
}

function interfaceIn(file, name) {
	const source = ts.createSourceFile(
		file,
		readFileSync(file, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);
	const declaration = source.statements.find(
		(statement) =>
			(ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) &&
			statement.name.text === name
	);
	return declaration ? { declaration, source } : null;
}

function importsIn(source, fromFile) {
	const imports = new Map();
	for (const statement of source.statements) {
		if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings) continue;
		if (!ts.isNamedImports(statement.importClause.namedBindings)) continue;
		const target = resolveDeclarationModule(fromFile, statement.moduleSpecifier.text);
		if (!target) continue;
		for (const element of statement.importClause.namedBindings.elements) {
			imports.set(element.name.text, {
				name: element.propertyName?.text ?? element.name.text,
				file: target
			});
		}
	}
	return imports;
}

function typeText(node, source) {
	return node ? node.getText(source).replace(/\s+/g, ' ').trim() : 'unknown';
}

/**
 * Prose from a JSDoc block attached to a declaration. `svelte-package` preserves
 * these comments into the shipped `.d.ts`, so roughly half the props in the
 * installed tree already describe themselves and only needed reading.
 */
function jsDocText(node) {
	for (const doc of ts.getJSDocCommentsAndTags(node)) {
		if (!ts.isJSDoc(doc)) continue;
		const text = ts.getTextOfJSDocComment(doc.comment);
		if (text) return text.replace(/\s+/g, ' ').trim();
	}
	return '';
}

/**
 * Prose from the JSDoc block at the top of a declaration file, which is where a
 * component describes itself rather than its individual props. Tag sections are
 * dropped; `@example` bodies are code, not summary prose.
 */
function fileDocText(sourceText) {
	for (const range of ts.getLeadingCommentRanges(sourceText, 0) ?? []) {
		const raw = sourceText.slice(range.pos, range.end);
		if (!raw.startsWith('/**')) continue;
		const prose = raw
			.slice(3, -2)
			.split('\n')
			.map((line) => line.replace(/^\s*\*?\s?/, ''))
			.join('\n')
			.split(/\n\s*@/)[0]
			.replace(/\s+/g, ' ')
			.trim();
		if (prose) return prose;
	}
	return '';
}

/**
 * A component's own description, preferring the file header (which describes the
 * component) over the props interface (which describes its options bag).
 */
function componentSummary(file, interfaceName) {
	const header = fileDocText(readFileSync(file, 'utf8'));
	if (header) return header;
	if (!interfaceName) return '';
	const found = interfaceIn(file, interfaceName);
	return found ? jsDocText(found.declaration) : '';
}

function collectProps(file, name, seen = new Set()) {
	const key = `${file}:${name}`;
	if (seen.has(key)) return { props: [], inherits: [] };
	seen.add(key);

	const found = interfaceIn(file, name);
	if (!found) return { props: [], inherits: [] };
	const { declaration, source } = found;
	const props = [];
	const inherits = [];
	const imports = importsIn(source, file);

	if (ts.isInterfaceDeclaration(declaration)) {
		for (const heritage of declaration.heritageClauses ?? []) {
			for (const type of heritage.types) {
				const baseName = type.expression.getText(source);
				const imported = imports.get(baseName);
				const local = interfaceIn(file, baseName);
				if (imported) {
					const inherited = collectProps(imported.file, imported.name, seen);
					props.push(...inherited.props);
					inherits.push(...inherited.inherits);
				} else if (local) {
					const inherited = collectProps(file, baseName, seen);
					props.push(...inherited.props);
					inherits.push(...inherited.inherits);
				} else {
					inherits.push(type.getText(source).replace(/\s+/g, ' '));
				}
			}
		}

		for (const member of declaration.members) {
			if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) continue;
			const propName = member.name?.getText(source).replace(/^['"]|['"]$/g, '');
			if (!propName) continue;
			props.push({
				name: propName,
				type: ts.isMethodSignature(member)
					? member
							.getText(source)
							.replace(/^[^(]+/, '')
							.replace(/;$/, '')
					: typeText(member.type, source),
				required: !member.questionToken,
				doc: jsDocText(member)
			});
		}
	}

	return {
		props: [...new Map(props.map((prop) => [prop.name, prop])).values()],
		inherits: [...new Set(inherits)]
	};
}

function propsInterface(file) {
	const source = ts.createSourceFile(
		file,
		readFileSync(file, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);
	const names = source.statements
		.filter(ts.isInterfaceDeclaration)
		.map((statement) => statement.name.text);
	return names.includes('Props')
		? 'Props'
		: (names.find((name) => /Props$/.test(name)) ?? names.find((name) => /Properties$/.test(name)));
}

function bindingsIn(file) {
	const source = ts.createSourceFile(
		file,
		readFileSync(file, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);
	const bindings = new Set();
	const collect = (node) => {
		if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
			bindings.add(node.literal.text);
		} else if (ts.isUnionTypeNode(node)) {
			for (const type of node.types) collect(type);
		}
	};
	const visit = (node) => {
		if (
			(ts.isPropertySignature(node) || ts.isMethodSignature(node)) &&
			node.name?.getText(source) === 'bindings' &&
			node.type
		) {
			collect(node.type);
		}
		if (ts.isTypeReferenceNode(node) && node.typeName.getText(source).endsWith('Component')) {
			const bindingType = node.typeArguments?.[2];
			if (bindingType) collect(bindingType);
		}
		ts.forEachChild(node, visit);
	};
	visit(source);
	return [...bindings];
}

/** Path to a component's real source, relative to the smrt monorepo root. */
function sourcePathFor(declarationPath, group) {
	const within = (target) =>
		`${group.repoDirectory}/${relative(group.packageDir, target).replaceAll('\\', '/')}`;
	const mapPath = `${declarationPath}.map`;
	if (existsSync(mapPath)) {
		const map = JSON.parse(readFileSync(mapPath, 'utf8'));
		const source = map.sources?.[0];
		if (source)
			return within(resolve(dirname(mapPath), source)).replace(/\.svelte\.ts$/, '.svelte');
	}
	return within(declarationPath);
}

function buildComponent(name, declarationPath, group) {
	if (!existsSync(declarationPath))
		throw new Error(`Missing declaration for ${name}: ${declarationPath}`);
	const interfaceName = propsInterface(declarationPath);
	const { props, inherits } = interfaceName
		? collectProps(declarationPath, interfaceName)
		: { props: [], inherits: [] };
	const bindingNames = bindingsIn(declarationPath);
	const bindingSet = new Set(bindingNames);
	const eventProps = props.filter(
		(prop) => prop.name.startsWith('on') && /=>|EventHandler|Callback/.test(prop.type)
	);
	const exampleId = exampleByComponent.get(name);
	const authoredSummary = componentSummary(declarationPath, interfaceName);
	const member = (prop) => ({
		name: prop.name,
		code: prop.type,
		status: prop.required,
		description: prop.doc ?? ''
	});

	return {
		slug: slugify(name),
		name,
		family: group.id,
		category: group.title,
		importPath: group.importPath,
		summary:
			authoredSummary || `${name} is part of the ${group.title.toLowerCase()} component family.`,
		summarySynthesized: !authoredSummary,
		details: props.map(member),
		sources: inherits,
		sections: props.filter((prop) => bindingSet.has(prop.name)).map(member),
		items: eventProps.map(member),
		components: bindingNames,
		demo: exampleId
			? { id: exampleId, label: exampleLabels[exampleId], href: `/playground` }
			: null,
		related: { label: 'UI showcase', href: '/ui' },
		source: sourcePathFor(declarationPath, group)
	};
}

function render(components) {
	const serialized = JSON.stringify(components, null, '\t');
	return `/**
 * Generated from the public declaration barrels shipped by
 * \`@happyvertical/smrt-ui\`. Run \`pnpm run generate:ui-reference\` after a
 * framework update. Do not edit this file by hand.
 */
import { SMRT_VERSION } from '$lib/version';

export interface UiComponentMember {
	name: string;
	code: string;
	status: boolean;
	description: string;
}

export interface UiComponentReference {
	slug: string;
	name: string;
	family: string;
	category: string;
	importPath: string;
	summary: string;
	/** True when no package prose was found and \`summary\` is a generated placeholder. */
	summarySynthesized: boolean;
	details: UiComponentMember[];
	sources: string[];
	sections: UiComponentMember[];
	items: UiComponentMember[];
	components: string[];
	demo: { id: string; label: string; href: string } | null;
	related: { label: string; href: string };
	source: string;
}

const SMRT_TREE = \`https://github.com/happyvertical/smrt/blob/v\${SMRT_VERSION}\`;

export const uiComponents: UiComponentReference[] = ${serialized};

export const uiComponentGroups = [...new Map(
	uiComponents.map((component) => [component.family, component.category] as const)
)].map(([id, title]) => ({ id, title }));

export function getUiComponent(slug: string): UiComponentReference | undefined {
	return uiComponents.find((component) => component.slug === slug);
}

export function uiComponentSource(component: UiComponentReference): string {
	return \`\${SMRT_TREE}/\${component.source}\`;
}
`;
}

if (!existsSync(SCOPE_ROOT)) {
	throw new Error('Install dependencies before generating the UI component reference.');
}

/**
 * The section a component belongs to, taken from the directory its declaration
 * ships in. `components` is a container, not a subject, so step past it.
 */
function sectionFor(packageDir, declarationPath) {
	const segments = relative(packageDir, declarationPath).replaceAll('\\', '/').split('/');
	const afterDist = segments[0] === 'dist' ? segments.slice(1) : segments;
	const directories = afterDist.slice(0, -1);
	return directories.find((segment) => segment !== 'components') ?? directories[0] ?? 'components';
}

// smrt-ui and smrt-svelte are the framework's own component surfaces and keep
// unprefixed sections and slugs; every other package is labelled by name.
const PACKAGE_ORDER = ['smrt-ui', 'smrt-svelte'];

const discovered = [];
for (const packageName of installedPackages().sort((a, b) => {
	const rank = (name) => {
		const index = PACKAGE_ORDER.indexOf(name);
		return index === -1 ? PACKAGE_ORDER.length : index;
	};
	return rank(a) - rank(b) || a.localeCompare(b);
})) {
	const packageDir = join(SCOPE_ROOT, packageName);
	const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
	const repoDirectory = manifest.repository?.directory ?? `packages/${packageName}`;
	const label = packageName === 'smrt-ui' ? null : titleCase(packageName.replace(/^smrt-/, ''));

	for (const entry of exportedEntries(packageDir, `@happyvertical/${packageName}`)) {
		for (const [name, declaration] of declarationsFromBarrel(entry.declaration)) {
			if (!existsSync(declaration)) continue;
			const section = sectionFor(packageDir, declaration);
			const sectionTitle = DIRECTORY_TITLES.get(section) ?? titleCase(section);
			discovered.push({
				name,
				declaration,
				packageName,
				group: {
					id: slugify(`${packageName}-${section}`),
					title: label ? `${label} · ${sectionTitle}` : sectionTitle,
					importPath: entry.importPath,
					packageDir,
					repoDirectory
				}
			});
		}
	}
}

// One record per component. A component re-exported from both the package root
// and a narrower subpath is published under the narrower one, which is the
// import a consumer should write.
const chosen = new Map();
for (const candidate of discovered) {
	const key = `${candidate.packageName}:${candidate.name}`;
	const held = chosen.get(key);
	if (!held || candidate.group.importPath.length > held.group.importPath.length) {
		chosen.set(key, candidate);
	}
}

const unexported = UNEXPORTED.filter((name) =>
	[...chosen.values()].some((candidate) => candidate.name === name)
);
if (unexported.length)
	throw new Error(
		`Published components that no subpath exports: ${unexported.join(', ')}. ` +
			'See happyvertical/smrt#2286.'
	);

// Existing component URLs are a contract, so the first claimant of a slug keeps
// it and a later package qualifies its own. PACKAGE_ORDER puts smrt-ui first,
// which is what holds today's 85 published paths stable.
const claimed = new Set();
const components = [...chosen.values()]
	.map((candidate) => {
		const bare = slugify(candidate.name);
		const slug = claimed.has(bare)
			? `${candidate.packageName.replace(/^smrt-/, '')}-${bare}`
			: bare;
		claimed.add(slug);
		return { candidate, slug };
	})
	.map(({ candidate, slug }) => ({
		...buildComponent(candidate.name, candidate.declaration, candidate.group),
		slug
	}))
	.sort((a, b) => a.family.localeCompare(b.family) || a.name.localeCompare(b.name));

const duplicateSlugs = components
	.map((component) => component.slug)
	.filter((slug, index, slugs) => slugs.indexOf(slug) !== index);
if (duplicateSlugs.length)
	throw new Error(`Duplicate component slugs: ${duplicateSlugs.join(', ')}`);

const prettierConfig = (await resolveConfig(OUTPUT)) ?? {};
const output = await format(render(components), { ...prettierConfig, filepath: OUTPUT });
if (process.argv.includes('--check')) {
	if (!existsSync(OUTPUT) || readFileSync(OUTPUT, 'utf8') !== output) {
		console.error('UI component reference is stale. Run pnpm run generate:ui-reference.');
		process.exit(1);
	}
	console.log(`UI component reference is current (${components.length} exports).`);
} else {
	writeFileSync(OUTPUT, output);
	console.log(`Wrote ${relative(ROOT, OUTPUT)} with ${components.length} exports.`);
}
