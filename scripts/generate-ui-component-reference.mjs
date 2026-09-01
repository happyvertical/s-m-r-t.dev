#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT = join(ROOT, 'src', 'lib', 'data', 'ui-components.generated.ts');
const COVERAGE_BASELINE = join(ROOT, 'scripts', 'ui-reference-coverage.json');

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

/**
 * The `SmrtModuleMeta` a domain package ships in `dist/ui.js`, or null.
 *
 * Every slot in it carries an authored label and description — prose a person
 * wrote about the component, which no amount of reading declarations produces.
 * The module is plain data and imports nothing, so loading it costs nothing and
 * cannot drag a component tree into this script.
 */
async function moduleMetaFor(packageDir) {
	const entry = join(packageDir, 'dist', 'ui.js');
	if (!existsSync(entry)) return null;
	try {
		const loaded = await import(pathToFileURL(entry).href);
		for (const value of Object.values(loaded)) {
			if (value && typeof value === 'object' && 'displayName' in value) return value;
		}
	} catch {
		// A package whose module metadata cannot be loaded simply contributes none.
	}
	return null;
}

/** Slot records keyed by the slug of the component they describe. */
function slotsBySlug(meta) {
	const slots = new Map();
	for (const slot of Object.values(meta?.uiSlots ?? {})) {
		if (slot?.id) slots.set(slot.id, slot);
	}
	return slots;
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

	const pushMembers = (members) => {
		for (const member of members) {
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
	};

	const pushReference = (name) => {
		const imported = imports.get(name);
		if (imported) {
			const inherited = collectProps(imported.file, imported.name, seen);
			props.push(...inherited.props);
			inherits.push(...inherited.inherits);
			return true;
		}
		if (interfaceIn(file, name)) {
			const inherited = collectProps(file, name, seen);
			props.push(...inherited.props);
			inherits.push(...inherited.inherits);
			return true;
		}
		return false;
	};

	// `export type Props = Base & { ... }` is as common as an interface, and
	// reading only interfaces published those components with an empty contract.
	if (ts.isTypeAliasDeclaration(declaration)) {
		const fromType = (node) => {
			if (ts.isTypeLiteralNode(node)) return pushMembers(node.members);
			if (ts.isIntersectionTypeNode(node)) return node.types.forEach(fromType);
			if (ts.isParenthesizedTypeNode(node)) return fromType(node.type);
			if (ts.isTypeReferenceNode(node)) {
				const refName = node.typeName.getText(source);
				if (!pushReference(refName)) inherits.push(typeText(node, source));
				return;
			}
			// `Base & (ReadOnly | Movable)` describes one component with two legal
			// shapes. Publishing only the first branch dropped real callbacks, so
			// take every branch and mark them optional: which apply depends on how
			// the component is used. A `never` member is the branch that forbids
			// the prop, so the other branch's real type wins.
			if (ts.isUnionTypeNode(node)) {
				const before = props.length;
				node.types.forEach(fromType);
				for (let index = before; index < props.length; index += 1) {
					props[index] = { ...props[index], required: false };
				}
				const merged = new Map();
				for (const prop of props.splice(before)) {
					const held = merged.get(prop.name);
					if (!held || held.type === 'never') merged.set(prop.name, prop);
				}
				props.push(...merged.values());
				return;
			}
			inherits.push(typeText(node, source));
		};
		fromType(declaration.type);
	}

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

		pushMembers(declaration.members);
	}

	return {
		props: [...new Map(props.map((prop) => [prop.name, prop])).values()],
		inherits: [...new Set(inherits)]
	};
}

/**
 * Whether a prop's declared type is callable, following one level of named
 * alias. `onsubmit?: ObjectFormSubmitHandler` is as much a callback event as
 * `onchange?: (value: string) => void`, and matching only the inline arrow shape
 * dropped it from the events contract while the page still counted it as a prop.
 */
function isCallableType(typeText, file, seen = new Set()) {
	if (/=>/.test(typeText)) return true;
	const named = typeText.match(/^([A-Za-z_$][\w$]*)(?:<.*>)?$/);
	if (!named) return false;
	const name = named[1];
	const key = `${file}:${name}`;
	if (seen.has(key)) return false;
	seen.add(key);

	const source = ts.createSourceFile(
		file,
		readFileSync(file, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);
	const alias = source.statements.find(
		(statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === name
	);
	if (alias) {
		if (ts.isFunctionTypeNode(alias.type)) return true;
		return isCallableType(typeText2(alias.type, source), file, seen);
	}
	// An interface with only a call signature is callable too.
	const iface = source.statements.find(
		(statement) => ts.isInterfaceDeclaration(statement) && statement.name.text === name
	);
	if (iface) return iface.members.some((member) => ts.isCallSignatureDeclaration(member));

	const imported = importsIn(source, file).get(name);
	return imported ? isCallableType(imported.name, imported.file, seen) : false;
}

function typeText2(node, source) {
	return node ? node.getText(source).replace(/\s+/g, ' ').trim() : 'unknown';
}

/**
 * The declaration that actually describes a component's props, as
 * `{ file, name }`.
 *
 * `declare const X: import('svelte').Component<Props, ...>` names the real type
 * wherever it was declared, so read that first and follow it through imports.
 * Guessing a local interface by name published an empty contract for every
 * component whose props live in a sibling `types.ts`.
 */
function propsDeclaration(file) {
	const source = ts.createSourceFile(
		file,
		readFileSync(file, 'utf8'),
		ts.ScriptTarget.Latest,
		true
	);

	// Read the component's own declaration, not the first `Component<...>` found
	// anywhere: a props type or snippet elsewhere in the file also mentions one,
	// and taking that emptied the contract for DataTable and its siblings.
	//   declare const X: Component<Props, ...>
	//   declare const X: import('svelte').Component<Props, ...>
	let declared = null;
	for (const statement of source.statements) {
		if (!ts.isVariableStatement(statement)) continue;
		for (const variable of statement.declarationList.declarations) {
			const node = variable.type;
			if (!node) continue;
			const namesComponent =
				(ts.isTypeReferenceNode(node) && node.typeName.getText(source).endsWith('Component')) ||
				(ts.isImportTypeNode(node) && node.qualifier?.getText(source).endsWith('Component'));
			if (!namesComponent) continue;
			const argument = node.typeArguments?.[0];
			if (argument && ts.isTypeReferenceNode(argument)) {
				declared = argument.typeName.getText(source);
			}
		}
		if (declared) break;
	}

	// A generic component compiles to the `$$IsomorphicComponent` shape instead,
	// where the props type is the `props` member of `$$render`'s return type.
	if (!declared) {
		const render = source.statements.find(
			(statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === '$$render'
		);
		const returned = render?.type;
		if (returned && ts.isTypeLiteralNode(returned)) {
			const member = returned.members.find(
				(entry) => ts.isPropertySignature(entry) && entry.name?.getText(source) === 'props'
			);
			if (member?.type && ts.isTypeReferenceNode(member.type)) {
				declared = member.type.typeName.getText(source);
			}
		}
	}

	const local = source.statements
		.filter(
			(statement) => ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)
		)
		.map((statement) => statement.name.text);
	const fallback = local.includes('Props')
		? 'Props'
		: (local.find((name) => /Props$/.test(name)) ?? local.find((name) => /Properties$/.test(name)));

	const target = declared ?? fallback;
	if (!target) return null;
	if (local.includes(target)) return { file, name: target };
	const imported = importsIn(source, file).get(target);
	return imported ? { file: imported.file, name: imported.name } : null;
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

function buildComponent(name, declarationPath, group, slot = null) {
	if (!existsSync(declarationPath))
		throw new Error(`Missing declaration for ${name}: ${declarationPath}`);
	const declared = propsDeclaration(declarationPath);
	const { props, inherits } = declared
		? collectProps(declared.file, declared.name)
		: { props: [], inherits: [] };
	const bindingNames = bindingsIn(declarationPath);
	const bindingSet = new Set(bindingNames);
	const eventProps = props.filter(
		(prop) =>
			prop.name.startsWith('on') &&
			(/=>|EventHandler|Callback/.test(prop.type) || isCallableType(prop.type, declarationPath))
	);
	const exampleId = exampleByComponent.get(name);
	// A component's own file header first, then the description its module wrote
	// for the slot it fills. Both are authored; only the placeholder is not.
	const authoredSummary =
		componentSummary(declarationPath, declared?.name) || (slot?.description ?? '');
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
		slot: slot
			? { id: slot.id, label: slot.label, icon: slot.icon ?? '', category: slot.category ?? '' }
			: null,
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

function render(components, modules, coverage) {
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
	/** The ModuleUIRegistry slot this component fills, when its package declares one. */
	slot: { id: string; label: string; icon: string; category: string } | null;
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

export interface UiModuleReference {
	slug: string;
	importPath: string;
	displayName: string;
	summary: string;
	models: string[];
	collections: string[];
	uiDependencies: string[];
	slots: number;
}

export const uiModules: UiModuleReference[] = ${JSON.stringify(modules, null, '\t')};

export function getUiModule(slug: string): UiModuleReference | undefined {
	return uiModules.find((module) => module.slug === slug);
}

export interface UiCoverage {
	describedProps: number;
	totalProps: number;
	authoredSummaries: number;
	totalComponents: number;
}

/**
 * Coverage of the published reference at generation time. Every described prop
 * and authored summary comes from prose shipped inside a package.
 */
export const uiCoverage: UiCoverage = ${JSON.stringify(coverage, null, '\t')};

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
const modules = [];
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
	const meta = await moduleMetaFor(packageDir);
	const slots = slotsBySlug(meta);
	if (meta) {
		modules.push({
			slug: packageName,
			importPath: `@happyvertical/${packageName}`,
			displayName: meta.displayName ?? titleCase(packageName.replace(/^smrt-/, '')),
			summary: meta.description ?? '',
			models: [...(meta.models ?? [])].sort(),
			collections: [...(meta.collections ?? [])].sort(),
			uiDependencies: [...(meta.uiDependencies ?? [])].sort(),
			slots: [...slots.values()].length
		});
	}

	for (const entry of exportedEntries(packageDir, `@happyvertical/${packageName}`)) {
		for (const [name, declaration] of declarationsFromBarrel(entry.declaration)) {
			if (!existsSync(declaration)) continue;
			const section = sectionFor(packageDir, declaration);
			const slot = slots.get(slugify(name)) ?? null;
			const sectionTitle = DIRECTORY_TITLES.get(section) ?? titleCase(section);
			discovered.push({
				name,
				declaration,
				packageName,
				slot,
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
		...buildComponent(candidate.name, candidate.declaration, candidate.group, candidate.slot),
		slug
	}))
	.sort((a, b) => a.family.localeCompare(b.family) || a.name.localeCompare(b.name));

const duplicateSlugs = components
	.map((component) => component.slug)
	.filter((slug, index, slugs) => slugs.indexOf(slug) !== index);
if (duplicateSlugs.length)
	throw new Error(`Duplicate component slugs: ${duplicateSlugs.join(', ')}`);

/**
 * How much of the published reference is actually explained, as opposed to
 * merely listed. Both numbers come from prose the packages ship; neither is
 * written here.
 */
function coverageOf(records) {
	const props = records.flatMap((record) => record.details);
	return {
		describedProps: props.filter((prop) => prop.description).length,
		totalProps: props.length,
		authoredSummaries: records.filter((record) => !record.summarySynthesized).length,
		totalComponents: records.length
	};
}

const coverage = coverageOf(components);
const ratios = (value) => ({
	props: value.totalProps ? value.describedProps / value.totalProps : 0,
	summaries: value.totalComponents ? value.authoredSummaries / value.totalComponents : 0
});
const percent = (value) => `${(value * 100).toFixed(1)}%`;

const baseline = existsSync(COVERAGE_BASELINE)
	? JSON.parse(readFileSync(COVERAGE_BASELINE, 'utf8'))
	: null;
const current = ratios(coverage);
const previous = baseline ? ratios(baseline) : { props: 0, summaries: 0 };

const prettierConfig = (await resolveConfig(OUTPUT)) ?? {};
const output = await format(render(components, modules, coverage), {
	...prettierConfig,
	filepath: OUTPUT
});
const summary =
	`${components.length} exports; ` +
	`${coverage.describedProps}/${coverage.totalProps} props described (${percent(current.props)}), ` +
	`${coverage.authoredSummaries}/${coverage.totalComponents} summaries authored (${percent(current.summaries)})`;

if (process.argv.includes('--check')) {
	if (!existsSync(OUTPUT) || readFileSync(OUTPUT, 'utf8') !== output) {
		console.error('UI component reference is stale. Run pnpm run generate:ui-reference.');
		process.exit(1);
	}

	// A ratchet, not a gate. Being short of complete is the normal state and is
	// reported by `uiCoverage`; going backwards is a regression, and a framework
	// bump that adds undocumented components should say so on that pull request
	// rather than surface a release later.
	const dropped = [];
	if (current.props < previous.props)
		dropped.push(`props described ${percent(previous.props)} -> ${percent(current.props)}`);
	if (current.summaries < previous.summaries)
		dropped.push(
			`summaries authored ${percent(previous.summaries)} -> ${percent(current.summaries)}`
		);
	if (dropped.length) {
		console.error(`UI reference documentation coverage dropped: ${dropped.join('; ')}.`);
		console.error(
			'Restore the prose upstream, or accept the drop deliberately with ' +
				`\`pnpm run generate:ui-reference -- --accept-coverage-drop\` and commit ` +
				`${relative(ROOT, COVERAGE_BASELINE)} with the reason.`
		);
		process.exit(1);
	}
	console.log(`UI component reference is current (${summary}).`);
} else {
	writeFileSync(OUTPUT, output);
	// Each metric ratchets on its own. Raising the whole baseline whenever either
	// one improved would quietly bake in a drop in the other, which is exactly
	// the regression --check exists to catch.
	if (!baseline || process.argv.includes('--accept-coverage-drop')) {
		// The only path that may lower the baseline, and it has to be asked for.
		writeFileSync(COVERAGE_BASELINE, `${JSON.stringify(coverage, null, '\t')}\n`);
	} else {
		const raised = { ...baseline };
		if (current.props > previous.props) {
			raised.describedProps = coverage.describedProps;
			raised.totalProps = coverage.totalProps;
		}
		if (current.summaries > previous.summaries) {
			raised.authoredSummaries = coverage.authoredSummaries;
			raised.totalComponents = coverage.totalComponents;
		}
		if (JSON.stringify(raised) !== JSON.stringify(baseline)) {
			writeFileSync(COVERAGE_BASELINE, `${JSON.stringify(raised, null, '\t')}\n`);
		}
	}
	console.log(`Wrote ${relative(ROOT, OUTPUT)} with ${summary}.`);
}
