#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PACKAGE_ROOT = join(ROOT, 'node_modules', '@happyvertical', 'smrt-ui');
const OUTPUT = join(ROOT, 'src', 'lib', 'data', 'ui-components.generated.ts');

const groups = [
	{
		id: 'forms',
		title: 'Forms and controls',
		importPath: '@happyvertical/smrt-ui/forms',
		barrels: ['dist/components/forms/index.d.ts']
	},
	{
		id: 'actions-display',
		title: 'Actions and display',
		importPath: '@happyvertical/smrt-ui/ui',
		barrels: ['dist/components/ui/index.d.ts']
	},
	{
		id: 'feedback-overlays',
		title: 'Feedback and overlays',
		importPath: '@happyvertical/smrt-ui/feedback',
		barrels: ['dist/components/feedback/index.d.ts']
	},
	{
		id: 'collections-tables',
		title: 'Collections and tables',
		importPath: '@happyvertical/smrt-ui/data',
		barrels: ['dist/components/data/index.d.ts']
	},
	{
		id: 'layout',
		title: 'Layout',
		importPath: '@happyvertical/smrt-ui/layout',
		barrels: ['dist/components/layout/index.d.ts']
	},
	{
		id: 'navigation',
		title: 'Navigation',
		importPath: '@happyvertical/smrt-ui',
		barrels: ['dist/components/nav/index.d.ts']
	},
	{
		id: 'display-status',
		title: 'Display and status',
		importPath: '@happyvertical/smrt-ui',
		barrels: ['dist/components/display/index.d.ts']
	},
	{
		id: 'calendar',
		title: 'Calendar',
		importPath: '@happyvertical/smrt-ui/calendar',
		barrels: ['dist/components/calendar/index.d.ts']
	},
	{
		id: 'chat',
		title: 'Chat',
		importPath: '@happyvertical/smrt-ui/chat',
		barrels: ['dist/components/chat/index.d.ts']
	},
	{
		id: 'internationalization',
		title: 'Internationalization',
		importPath: '@happyvertical/smrt-ui/i18n',
		barrels: ['dist/i18n/index.d.ts']
	},
	{
		id: 'membership-permissions',
		title: 'Membership and permissions',
		importPath: '@happyvertical/smrt-ui',
		components: [
			['MembershipCard', 'dist/components/memberships/MembershipCard.svelte.d.ts'],
			['MembershipList', 'dist/components/memberships/MembershipList.svelte.d.ts'],
			['PermissionCheck', 'dist/components/permissions/PermissionCheck.svelte.d.ts'],
			['RoleBadge', 'dist/components/roles/RoleBadge.svelte.d.ts'],
			['RoleSelector', 'dist/components/roles/RoleSelector.svelte.d.ts']
		]
	},
	{
		id: 'themes',
		title: 'Themes',
		importPath: '@happyvertical/smrt-ui/themes',
		components: [
			['ThemeProvider', 'dist/themes/ThemeProvider.svelte.d.ts'],
			['ColorSchemeToggle', 'dist/themes/components/ColorSchemeToggle.svelte.d.ts'],
			['ThemeSwitcher', 'dist/themes/components/ThemeSwitcher.svelte.d.ts']
		]
	}
];

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

function declarationsFromBarrel(barrelPath) {
	const source = ts.createSourceFile(
		barrelPath,
		readFileSync(barrelPath, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);
	const declarations = [];

	for (const statement of source.statements) {
		if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) continue;
		if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
		if (!statement.moduleSpecifier.text.endsWith('.svelte')) continue;
		if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;
		const declaration = resolve(dirname(barrelPath), `${statement.moduleSpecifier.text}.d.ts`);
		for (const element of statement.exportClause.elements) {
			if (element.propertyName?.text === 'default') {
				declarations.push([element.name.text, declaration]);
			}
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

function sourcePathFor(declarationPath) {
	const mapPath = `${declarationPath}.map`;
	if (existsSync(mapPath)) {
		const map = JSON.parse(readFileSync(mapPath, 'utf8'));
		const source = map.sources?.[0];
		if (source) {
			return relative(PACKAGE_ROOT, resolve(dirname(mapPath), source))
				.replaceAll('\\', '/')
				.replace(/\.svelte\.ts$/, '.svelte');
		}
	}
	return relative(PACKAGE_ROOT, declarationPath).replaceAll('\\', '/');
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
		source: sourcePathFor(declarationPath)
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

const SMRT_TREE = \`https://github.com/happyvertical/smrt/blob/v\${SMRT_VERSION}/packages/smrt-ui\`;

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

if (!existsSync(PACKAGE_ROOT)) {
	throw new Error('Install dependencies before generating the UI component reference.');
}

const components = groups
	.flatMap((group) => {
		const declarations = [
			...(group.barrels ?? []).flatMap((barrel) =>
				declarationsFromBarrel(join(PACKAGE_ROOT, barrel))
			),
			...(group.components ?? []).map(([name, path]) => [name, join(PACKAGE_ROOT, path)])
		];
		return declarations.map(([name, path]) => buildComponent(name, path, group));
	})
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
