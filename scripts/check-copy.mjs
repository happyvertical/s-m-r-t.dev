#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { glob } from 'glob';
import { parse } from 'svelte/compiler';
import ts from 'typescript';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const COPY_GLOBS = [
	'src/routes/**/*.svelte',
	'src/routes/**/+page.ts',
	'src/lib/components/**/*.svelte',
	'src/lib/data/**/*.ts',
	'static/**/*.txt'
];

const COPY_IGNORES = [
	'**/*.test.*',
	'**/*.spec.*',
	'src/routes/**/+page.server.ts',
	'src/routes/**/+server.ts'
];

const PROSE_PROPERTIES = new Set([
	'body',
	'breadcrumb',
	'caption',
	'callout',
	'claim',
	'content',
	'description',
	'details',
	'deprecated',
	'external',
	'eyebrow',
	'foundation',
	'highlights',
	'intro',
	'label',
	'lede',
	'limit',
	'linkLabel',
	'name',
	'navTitle',
	'new',
	'note',
	'notice',
	'plainEnglish',
	'playgroundNote',
	'points',
	'private',
	'security',
	'stub',
	'summary',
	'surfaceNote',
	'title',
	'track',
	'version-added',
	'warning'
]);

const NON_PROSE_PROPERTIES = new Set([
	'base',
	'canonical',
	'code',
	'component',
	'componentGroups',
	'componentImport',
	'components',
	'demo',
	'eager',
	'exampleResource',
	'filename',
	'guides',
	'haystack',
	'href',
	'importPath',
	'items',
	'keywords',
	'kind',
	'lang',
	'links',
	'module',
	'next',
	'packages',
	'page',
	'pinnedVersion',
	'prev',
	'related',
	'score',
	'section',
	'sections',
	'slug',
	'slugs',
	'source',
	'sources',
	'status',
	'variant',
	'version',
	'visual'
]);

const CONTENT_ELEMENTS = new Set([
	'a',
	'blockquote',
	'button',
	'caption',
	'dd',
	'dt',
	'figcaption',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'label',
	'legend',
	'li',
	'option',
	'p',
	'summary',
	'td',
	'th',
	'title'
]);

const EXCLUDED_ELEMENTS = new Set(['code', 'pre', 'script', 'style', 'svg']);
const COPY_ATTRIBUTES = new Set([
	'alt',
	'aria-description',
	'aria-label',
	'aria-placeholder',
	'aria-roledescription',
	'aria-valuetext',
	'ariaLabel',
	'backLabel',
	'content',
	'description',
	'placeholder',
	'subtitle',
	'title'
]);

const COMPONENT_NON_COPY_ATTRIBUTES = new Set([
	'article',
	'backHref',
	'class',
	'code',
	'colorScheme',
	'compact',
	'filename',
	'guide',
	'id',
	'image',
	'lang',
	'language',
	'modules',
	'neighbors',
	'persist',
	'pkg',
	'preset',
	'showLabels',
	'slot',
	'standalone',
	'style',
	'type',
	'url',
	'variant',
	'visual'
]);

const IMPERATIVE_VERBS = new Set([
	'add',
	'apply',
	'attach',
	'build',
	'call',
	'check',
	'choose',
	'click',
	'close',
	'compare',
	'configure',
	'confirm',
	'connect',
	'continue',
	'create',
	'declare',
	'define',
	'delete',
	'deploy',
	'disable',
	'do',
	'enable',
	'enter',
	'expose',
	'find',
	'fix',
	'generate',
	'get',
	'give',
	'go',
	'hide',
	'import',
	'install',
	'keep',
	'link',
	'load',
	'make',
	'move',
	'mount',
	'name',
	'open',
	'pass',
	'put',
	'read',
	'record',
	'register',
	'release',
	'remove',
	'render',
	'replace',
	'resolve',
	'return',
	'review',
	'run',
	'select',
	'serve',
	'set',
	'show',
	'start',
	'stop',
	'store',
	'supply',
	'test',
	'treat',
	'turn',
	'update',
	'use',
	'validate',
	'verify',
	'wait',
	'wrap',
	'write'
]);

const PROHIBITED_TERMS = [
	{
		id: 'prohibited-business-logic',
		pattern: /\bbusiness(?:[\s-]+)logic\b/giu,
		message: 'Use the approved project term "application logic".'
	}
];

const ADVISORY_PHRASES = [
	{
		id: 'phrase-in-order-to',
		pattern: /\bin order to\b/giu,
		message: 'Use "to" unless the longer phrase has a necessary literal meaning.'
	},
	{
		id: 'phrase-utilize',
		pattern: /\butili[sz](?:e|es|ed|ing)\b/giu,
		message: 'Use "use" with the applicable verb form.'
	},
	{
		id: 'phrase-simply',
		pattern: /\bsimply\b/giu,
		message: 'Remove "simply" or state the actual condition.'
	},
	{
		id: 'phrase-easy',
		pattern: /\beas(?:y|ier|iest|ily)\b/giu,
		message: 'State the measurable benefit instead of calling the task easy.'
	},
	{
		id: 'phrase-via',
		pattern: /\bvia\b/giu,
		message: 'Use a literal preposition such as "through", "with", or "by".'
	},
	{
		id: 'phrase-as-well-as',
		pattern: /\bas well as\b/giu,
		message: 'Use "and" or separate the two relationships.'
	},
	{
		id: 'ambiguous-pronoun',
		pattern: /\b(?:this|it) (?:allows?|enables?|makes?|means?|provides?|supports?)\b/giu,
		message: 'Replace the pronoun with its specific noun when the reference is not explicit.'
	},
	{
		id: 'spelling-catalog',
		pattern: /\bcatalogues?\b/giu,
		message: 'Use the American English spelling "catalog" or "catalogs".'
	},
	{
		id: 'spelling-label',
		pattern: /\b(?:labelled|labelling)\b/giu,
		message: 'Use the American English spelling "labeled" or "labeling".'
	},
	{
		id: 'spelling-color',
		pattern: /\bcolours?\b/giu,
		message: 'Use the American English spelling "color" or "colors".'
	},
	{
		id: 'spelling-behavior',
		pattern: /\bbehaviours?\b/giu,
		message: 'Use the American English spelling "behavior" or "behaviors".'
	},
	{
		id: 'spelling-honor',
		pattern: /\bhonours?(?:ed|ing)?\b/giu,
		message: 'Use the applicable American English form of "honor".'
	},
	{
		id: 'spelling-cancel',
		pattern: /\bcancell(?:ed|ing|ation)\b/giu,
		message: 'Use the applicable American English form of "cancel".'
	}
];

function lineNumber(source, offset) {
	return source.slice(0, offset).split('\n').length;
}

function normalizeText(value) {
	return value.replace(/\s+/gu, ' ').trim();
}

function propertyName(node) {
	if (!node) return undefined;
	if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
		return node.text;
	}
	if (ts.isComputedPropertyName(node)) return '[computed property]';
	return undefined;
}

function nearestProseProperty(node) {
	let current = node.parent;
	while (current) {
		if (ts.isPropertyAssignment(current)) {
			const name = propertyName(current.name);
			if (name) return name;
		}
		current = current.parent;
	}
	return undefined;
}

const SAFE_PROSE_METHODS = new Set(['get', 'toLowerCase', 'toUpperCase', 'trim']);

function bindingNameContains(node, name) {
	if (ts.isIdentifier(node)) return node.text === name;
	if (ts.isObjectBindingPattern(node) || ts.isArrayBindingPattern(node)) {
		return node.elements.some(
			(element) => ts.isBindingElement(element) && bindingNameContains(element.name, name)
		);
	}
	return false;
}

function isFunctionParameterReference(node, name) {
	let current = node.parent;
	while (current) {
		if (
			ts.isFunctionLike(current) &&
			current.parameters.some((parameter) => bindingNameContains(parameter.name, name))
		) {
			return true;
		}
		current = current.parent;
	}
	return false;
}

function isIterationBindingReference(node, name) {
	let current = node.parent;
	while (current) {
		if (ts.isForOfStatement(current) || ts.isForInStatement(current)) {
			const initializer = current.initializer;
			if (
				ts.isVariableDeclarationList(initializer) &&
				initializer.declarations.some((declaration) => bindingNameContains(declaration.name, name))
			) {
				return true;
			}
		}
		current = current.parent;
	}
	return false;
}

function typeScriptExpressionRootName(node) {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
		return typeScriptExpressionRootName(node.expression);
	}
	return undefined;
}

function isSupportedProseInitializer(node, bindings) {
	if (!node) return false;
	if (
		ts.isStringLiteral(node) ||
		ts.isNoSubstitutionTemplateLiteral(node) ||
		ts.isTemplateExpression(node) ||
		ts.isNumericLiteral(node) ||
		node.kind === ts.SyntaxKind.TrueKeyword ||
		node.kind === ts.SyntaxKind.FalseKeyword ||
		node.kind === ts.SyntaxKind.NullKeyword ||
		node.kind === ts.SyntaxKind.UndefinedKeyword
	) {
		return true;
	}
	if (ts.isIdentifier(node)) {
		return (
			node.text === 'undefined' ||
			bindingsHaveRoot(bindings, node.text) ||
			isFunctionParameterReference(node, node.text) ||
			isIterationBindingReference(node, node.text)
		);
	}
	if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
		const root = typeScriptExpressionRootName(node);
		return Boolean(
			root &&
			(bindingsHaveRoot(bindings, node.getText()) ||
				bindingsHaveRoot(bindings, root) ||
				isFunctionParameterReference(node, root) ||
				isIterationBindingReference(node, root))
		);
	}
	if (
		ts.isCallExpression(node) &&
		ts.isPropertyAccessExpression(node.expression) &&
		SAFE_PROSE_METHODS.has(node.expression.name.text)
	) {
		return true;
	}
	if (
		ts.isParenthesizedExpression(node) ||
		ts.isAsExpression(node) ||
		ts.isSatisfiesExpression(node) ||
		ts.isNonNullExpression(node)
	) {
		return isSupportedProseInitializer(node.expression, bindings);
	}
	if (ts.isConditionalExpression(node)) {
		return (
			isSupportedProseInitializer(node.whenTrue, bindings) &&
			isSupportedProseInitializer(node.whenFalse, bindings)
		);
	}
	if (ts.isBinaryExpression(node)) {
		return (
			isSupportedProseInitializer(node.left, bindings) &&
			isSupportedProseInitializer(node.right, bindings)
		);
	}
	if (ts.isArrayLiteralExpression(node)) {
		return node.elements.every((element) => isSupportedProseInitializer(element, bindings));
	}
	if (ts.isObjectLiteralExpression(node)) {
		return node.properties.every((property) => {
			if (ts.isPropertyAssignment(property)) {
				return isSupportedProseInitializer(property.initializer, bindings);
			}
			if (ts.isShorthandPropertyAssignment(property)) return true;
			if (ts.isSpreadAssignment(property)) {
				return isSupportedProseInitializer(property.expression, bindings);
			}
			return false;
		});
	}
	return false;
}

export function extractTypeScriptPassages(source, filename, baseLine = 1) {
	const scriptKind =
		filename.endsWith('.js') || filename.endsWith('.mjs') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, scriptKind);
	if (ast.parseDiagnostics.length > 0) {
		return ast.parseDiagnostics.map((diagnostic) => ({
			file: filename,
			line: baseLine + lineNumber(source, diagnostic.start ?? 0) - 1,
			text: '',
			parseError: `TypeScript parse error: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`
		}));
	}
	const passages = [];
	const isDataFile = filename.startsWith('src/lib/data/');
	const bindings = extractScriptBindings(source, filename);

	function visit(node) {
		if (ts.isPropertyAssignment(node)) {
			const name = propertyName(node.name);
			const classified =
				name !== undefined &&
				(PROSE_PROPERTIES.has(name) || NON_PROSE_PROPERTIES.has(name) || name.startsWith('smrt-'));
			if (isDataFile && !classified) {
				passages.push({
					file: filename,
					line: baseLine + lineNumber(source, node.name.getStart(ast)) - 1,
					text: '',
					classificationError: `Classify the data property "${name ?? '[unknown property]'}" as prose or an explicit exclusion.`
				});
			}
			if (name && PROSE_PROPERTIES.has(name) && ts.isIdentifier(node.initializer)) {
				const text = bindings.get(node.initializer.text);
				if (text) {
					passages.push({
						file: filename,
						line: baseLine + lineNumber(source, node.initializer.getStart(ast)) - 1,
						text
					});
				}
			}
			if (
				isDataFile &&
				name &&
				PROSE_PROPERTIES.has(name) &&
				!isSupportedProseInitializer(node.initializer, bindings)
			) {
				passages.push({
					file: filename,
					line: baseLine + lineNumber(source, node.initializer.getStart(ast)) - 1,
					text: '',
					extractionError: `Cannot statically audit the prose property "${name}" from this value expression.`,
					extractionErrorId: 'copy-prose-value-unextractable'
				});
			}
			visit(node.initializer);
			return;
		}
		const isStringValue =
			ts.isStringLiteral(node) ||
			ts.isNoSubstitutionTemplateLiteral(node) ||
			ts.isTemplateExpression(node);
		if (isStringValue) {
			const name = nearestProseProperty(node);
			if (!name || !PROSE_PROPERTIES.has(name)) {
				ts.forEachChild(node, visit);
				return;
			}
			const text = ts.isTemplateExpression(node)
				? node.head.text +
					` IDENTIFIER ` +
					node.templateSpans.map((span) => span.literal.text).join(' IDENTIFIER ')
				: node.text;
			passages.push({
				file: filename,
				line: baseLine + lineNumber(source, node.getStart(ast)) - 1,
				text
			});
		}
		ts.forEachChild(node, visit);
	}

	visit(ast);
	return passages;
}

function extractStaticTypeScriptText(node, bindings) {
	if (!node) return '';
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
	if (ts.isIdentifier(node)) return bindings.get(node.text) ?? '';
	if (ts.isParenthesizedExpression(node))
		return extractStaticTypeScriptText(node.expression, bindings);
	if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
		return extractStaticTypeScriptText(node.expression, bindings);
	}
	if (ts.isConditionalExpression(node)) {
		return `${extractStaticTypeScriptText(node.whenTrue, bindings)} ${extractStaticTypeScriptText(node.whenFalse, bindings)}`;
	}
	if (ts.isBinaryExpression(node)) {
		return `${extractStaticTypeScriptText(node.left, bindings)} ${extractStaticTypeScriptText(node.right, bindings)}`;
	}
	if (ts.isArrayLiteralExpression(node)) {
		return node.elements.map((element) => extractStaticTypeScriptText(element, bindings)).join(' ');
	}
	if (ts.isTemplateExpression(node)) {
		return (
			node.head.text +
			node.templateSpans
				.map(
					(span) =>
						` ${extractStaticTypeScriptText(span.expression, bindings) || 'IDENTIFIER'} ${span.literal.text}`
				)
				.join('')
		);
	}
	return '';
}

function appendBindingText(bindings, name, text) {
	const normalized = normalizeText(text);
	if (!normalized) return;
	bindings.set(name, normalizeText(`${bindings.get(name) ?? ''} ${normalized}`));
}

function collectStaticTypeScriptBindings(node, prefix, bindings) {
	if (ts.isArrayLiteralExpression(node)) {
		for (const [index, element] of node.elements.entries()) {
			collectStaticTypeScriptBindings(element, `${prefix}[${index}]`, bindings);
			appendBindingText(bindings, prefix, extractStaticTypeScriptText(element, bindings));
		}
		return;
	}
	if (ts.isObjectLiteralExpression(node)) {
		for (const property of node.properties) {
			if (!ts.isPropertyAssignment(property)) continue;
			const name = propertyName(property.name);
			if (!name || name === '[computed property]') continue;
			collectStaticTypeScriptBindings(property.initializer, `${prefix}.${name}`, bindings);
		}
		return;
	}
	appendBindingText(bindings, prefix, extractStaticTypeScriptText(node, bindings));
}

function extractScriptBindings(source, filename) {
	const scriptKind = filename.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, scriptKind);
	const bindings = new Map();

	function visit(node) {
		if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
			collectStaticTypeScriptBindings(node.initializer, node.name.text, bindings);
		}
		ts.forEachChild(node, visit);
	}

	if (ast.parseDiagnostics.length === 0) visit(ast);
	return bindings;
}

function collectBindingNames(node, names) {
	if (ts.isIdentifier(node)) {
		names.add(node.text);
		return;
	}
	if (ts.isObjectBindingPattern(node) || ts.isArrayBindingPattern(node)) {
		for (const element of node.elements) {
			if (ts.isBindingElement(element)) collectBindingNames(element.name, names);
		}
	}
}

function callRootName(node) {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
		return callRootName(node.expression);
	}
	return undefined;
}

function extractAllowedDynamicNames(source, filename) {
	const scriptKind = filename.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, scriptKind);
	const names = new Set();

	function visit(node) {
		if (ts.isImportDeclaration(node) && node.importClause) {
			if (node.importClause.name) names.add(node.importClause.name.text);
			const bindings = node.importClause.namedBindings;
			if (bindings && ts.isNamespaceImport(bindings)) names.add(bindings.name.text);
			if (bindings && ts.isNamedImports(bindings)) {
				for (const element of bindings.elements) names.add(element.name.text);
			}
		}
		if (
			ts.isVariableDeclaration(node) &&
			node.initializer &&
			ts.isCallExpression(node.initializer)
		) {
			const root = callRootName(node.initializer.expression);
			if (root === '$props' || root === '$derived' || root === '$state') {
				collectBindingNames(node.name, names);
			}
		}
		ts.forEachChild(node, visit);
	}

	if (ast.parseDiagnostics.length === 0) visit(ast);
	return names;
}

function expressionBindingPath(node) {
	if (node?.type === 'Identifier') return node.name;
	if (node?.type !== 'MemberExpression') return undefined;
	const object = expressionBindingPath(node.object);
	const property = node.computed
		? node.property?.type === 'Literal' && typeof node.property.value === 'string'
			? node.property.value
			: undefined
		: node.property?.type === 'Identifier'
			? node.property.name
			: undefined;
	return object && property ? `${object}.${property}` : undefined;
}

function extractExpressionText(node, bindings = new Map()) {
	if (!node || typeof node !== 'object') return '';
	switch (node.type) {
		case 'Literal':
			return typeof node.value === 'string' ? node.value : '';
		case 'Identifier':
			return bindings.get(node.name) ?? '';
		case 'MemberExpression':
			return bindings.get(expressionBindingPath(node)) ?? '';
		case 'TemplateLiteral':
			return node.quasis
				.map((quasi, index) => {
					const text = quasi.value?.cooked ?? quasi.value?.raw ?? '';
					const expression = node.expressions?.[index];
					return expression
						? `${text} ${extractExpressionText(expression, bindings) || 'IDENTIFIER'} `
						: text;
				})
				.join('');
		case 'ConditionalExpression':
			return `${extractExpressionText(node.consequent, bindings)} ${extractExpressionText(node.alternate, bindings)}`;
		case 'LogicalExpression':
		case 'BinaryExpression':
			return `${extractExpressionText(node.left, bindings)} ${extractExpressionText(node.right, bindings)}`;
		case 'ArrayExpression':
			return (node.elements ?? []).map((item) => extractExpressionText(item, bindings)).join(' ');
		case 'SequenceExpression':
			return (node.expressions ?? [])
				.map((item) => extractExpressionText(item, bindings))
				.join(' ');
		case 'AwaitExpression':
		case 'ChainExpression':
			return extractExpressionText(node.argument ?? node.expression, bindings);
		default:
			return '';
	}
}

const SAFE_DYNAMIC_FORMATTERS = new Set(['Boolean', 'Number', 'String']);

function bindingsHaveRoot(bindings, root) {
	if (bindings.has(root)) return true;
	for (const name of bindings.keys()) {
		if (name.startsWith(`${root}.`) || name.startsWith(`${root}[`)) return true;
	}
	return false;
}

function expressionRootName(node) {
	if (node?.type === 'Identifier') return node.name;
	if (node?.type === 'MemberExpression') return expressionRootName(node.object);
	if (node?.type === 'CallExpression') return expressionRootName(node.callee);
	if (node?.type === 'ChainExpression') return expressionRootName(node.expression);
	return undefined;
}

function expressionHasUnextractableCopy(node, bindings, allowedDynamicNames) {
	if (!node || typeof node !== 'object') return false;
	switch (node.type) {
		case 'Literal':
			return false;
		case 'Identifier':
			return !bindingsHaveRoot(bindings, node.name) && !allowedDynamicNames.has(node.name);
		case 'MemberExpression': {
			const path = expressionBindingPath(node);
			const root = expressionRootName(node);
			return (
				!(path && bindingsHaveRoot(bindings, path)) && !(root && allowedDynamicNames.has(root))
			);
		}
		case 'TemplateLiteral':
			return (node.expressions ?? []).some((expression) =>
				expressionHasUnextractableCopy(expression, bindings, allowedDynamicNames)
			);
		case 'ConditionalExpression':
			return (
				expressionHasUnextractableCopy(node.consequent, bindings, allowedDynamicNames) ||
				expressionHasUnextractableCopy(node.alternate, bindings, allowedDynamicNames)
			);
		case 'LogicalExpression':
		case 'BinaryExpression':
			return (
				expressionHasUnextractableCopy(node.left, bindings, allowedDynamicNames) ||
				expressionHasUnextractableCopy(node.right, bindings, allowedDynamicNames)
			);
		case 'ArrayExpression':
			return (node.elements ?? []).some((item) =>
				expressionHasUnextractableCopy(item, bindings, allowedDynamicNames)
			);
		case 'ObjectExpression':
			return (node.properties ?? []).some((property) => {
				if (property.type === 'Property') {
					return expressionHasUnextractableCopy(property.value, bindings, allowedDynamicNames);
				}
				return expressionHasUnextractableCopy(property.argument, bindings, allowedDynamicNames);
			});
		case 'SequenceExpression':
			return (node.expressions ?? []).some((item) =>
				expressionHasUnextractableCopy(item, bindings, allowedDynamicNames)
			);
		case 'AwaitExpression':
		case 'ChainExpression':
			return expressionHasUnextractableCopy(
				node.argument ?? node.expression,
				bindings,
				allowedDynamicNames
			);
		case 'CallExpression': {
			const root = expressionRootName(node);
			return !(root && (allowedDynamicNames.has(root) || SAFE_DYNAMIC_FORMATTERS.has(root)));
		}
		case 'UnaryExpression':
		case 'UpdateExpression':
			return false;
		default:
			return true;
	}
}

function collectExpressionBindings(node, prefix, targetBindings, sourceBindings) {
	if (node?.type === 'ArrayExpression') {
		for (const element of node.elements ?? []) {
			collectExpressionBindings(element, prefix, targetBindings, sourceBindings);
		}
		return;
	}
	if (node?.type === 'ObjectExpression') {
		for (const property of node.properties ?? []) {
			if (property.type !== 'Property') continue;
			const name = property.computed
				? property.key?.type === 'Literal' && typeof property.key.value === 'string'
					? property.key.value
					: undefined
				: (property.key?.name ?? property.key?.value);
			if (typeof name !== 'string') continue;
			collectExpressionBindings(
				property.value,
				`${prefix}.${name}`,
				targetBindings,
				sourceBindings
			);
		}
		return;
	}
	appendBindingText(targetBindings, prefix, extractExpressionText(node, sourceBindings));
}

function eachBindingSets(expression, contextName, sourceBindings) {
	if (expression?.type === 'ArrayExpression') {
		return (expression.elements ?? []).map((element) => {
			const bindings = new Map(sourceBindings);
			collectExpressionBindings(element, contextName, bindings, sourceBindings);
			return bindings;
		});
	}
	if (expression?.type === 'Identifier') {
		const indexed = new Map();
		const pattern = new RegExp(
			`^${expression.name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}\\[(\\d+)\\](.*)$`,
			'u'
		);
		for (const [name, text] of sourceBindings) {
			const match = name.match(pattern);
			if (!match) continue;
			const bindings = indexed.get(match[1]) ?? new Map(sourceBindings);
			appendBindingText(bindings, `${contextName}${match[2]}`, text);
			indexed.set(match[1], bindings);
		}
		if (indexed.size > 0) return [...indexed.values()];
	}
	const bindings = new Map(sourceBindings);
	collectExpressionBindings(expression, contextName, bindings, sourceBindings);
	return [bindings];
}

function nodeText(node, bindings) {
	if (node?.type === 'Text') return node.data ?? node.raw ?? '';
	if ((node?.type === 'MustacheTag' || node?.type === 'RawMustacheTag') && node.expression) {
		const text = extractExpressionText(node.expression, bindings);
		return node.type === 'RawMustacheTag' ? text.replace(/<[^>]*>/gu, ' ') : text;
	}
	return '';
}

function elementHasUnextractableCopy(node, bindings, allowedDynamicNames) {
	if (!node || EXCLUDED_ELEMENTS.has(node.name)) return false;
	if (
		(node.type === 'MustacheTag' || node.type === 'RawMustacheTag') &&
		node.expression &&
		expressionHasUnextractableCopy(node.expression, bindings, allowedDynamicNames)
	) {
		return true;
	}
	const children = node.children ?? node.nodes ?? [];
	return children.some((child) =>
		elementHasUnextractableCopy(child, bindings, allowedDynamicNames)
	);
}

function attributeText(attribute, bindings) {
	if (!Array.isArray(attribute?.value)) return '';
	return normalizeText(attribute.value.map((item) => nodeText(item, bindings)).join(' '));
}

function isCopyAttribute(node, attribute, bindings) {
	if (COPY_ATTRIBUTES.has(attribute.name)) return true;
	if (
		(node.type === 'Component' || node.type === 'InlineComponent') &&
		PROSE_PROPERTIES.has(attribute.name)
	) {
		return true;
	}
	if (attribute.name === 'label' && (node.name === 'optgroup' || node.name === 'track')) {
		return true;
	}
	if (attribute.name === 'abbr' && node.name === 'th') return true;
	if (attribute.name !== 'value' || node.name !== 'input') return false;
	const typeAttribute = (node.attributes ?? []).find(
		(item) => item.type === 'Attribute' && item.name === 'type'
	);
	if (!typeAttribute) return false;
	const inputType = attributeText(typeAttribute, bindings).toLowerCase();
	return !inputType || new Set(['button', 'image', 'reset', 'submit']).has(inputType);
}

function isClassifiedComponentAttribute(attribute, bindings, allowedDynamicNames) {
	const expressionItems = Array.isArray(attribute.value)
		? attribute.value.filter((item) => item.expression)
		: [];
	return (
		COPY_ATTRIBUTES.has(attribute.name) ||
		PROSE_PROPERTIES.has(attribute.name) ||
		NON_PROSE_PROPERTIES.has(attribute.name) ||
		COMPONENT_NON_COPY_ATTRIBUTES.has(attribute.name) ||
		attribute.name.startsWith('data-') ||
		attribute.name.startsWith('aria-') ||
		(expressionItems.length > 0 &&
			expressionItems.every(
				(item) => !expressionHasUnextractableCopy(item.expression, bindings, allowedDynamicNames)
			))
	);
}

function aggregateElementText(node, bindings) {
	if (!node || EXCLUDED_ELEMENTS.has(node.name)) return '';
	const directText = nodeText(node, bindings);
	if (directText) return directText;
	const children = node.children ?? node.nodes ?? [];
	return children.map((child) => aggregateElementText(child, bindings)).join(' ');
}

function hasDirectVisibleText(node, bindings) {
	return (node.children ?? node.nodes ?? []).some((child) =>
		normalizeText(nodeText(child, bindings))
	);
}

export function extractSveltePassages(source, filename) {
	const ast = parse(source, { filename });
	const passages = [];
	const scripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/giu)];
	const bindings = new Map();
	const allowedDynamicNames = new Set();
	for (const match of scripts) {
		for (const [name, text] of extractScriptBindings(match[1], filename)) bindings.set(name, text);
		for (const name of extractAllowedDynamicNames(match[1], filename)) {
			allowedDynamicNames.add(name);
		}
	}
	function collectAllowedConstTags(node) {
		if (!node || typeof node !== 'object') return;
		if (
			node.type === 'ConstTag' &&
			node.expression?.left?.type === 'Identifier' &&
			!expressionHasUnextractableCopy(node.expression.right, bindings, allowedDynamicNames)
		) {
			allowedDynamicNames.add(node.expression.left.name);
		}
		for (const child of node.children ?? node.nodes ?? []) collectAllowedConstTags(child);
		for (const child of node.else?.children ?? []) collectAllowedConstTags(child);
	}
	collectAllowedConstTags(ast.html);

	function visit(
		node,
		insideContentElement = false,
		activeBindings = bindings,
		activeAllowedDynamicNames = allowedDynamicNames
	) {
		if (!node || typeof node !== 'object') return;
		let isContentElement = false;
		if (node.type === 'RawMustacheTag' && !insideContentElement) {
			const text = normalizeText(nodeText(node, activeBindings));
			if (text) passages.push({ file: filename, line: lineNumber(source, node.start), text });
			if (
				expressionHasUnextractableCopy(node.expression, activeBindings, activeAllowedDynamicNames)
			) {
				passages.push({
					file: filename,
					line: lineNumber(source, node.start),
					text: '',
					extractionError: 'Cannot statically audit this dynamic visible Svelte copy.',
					extractionErrorId: 'copy-svelte-expression-unextractable'
				});
			}
		}
		if (node.type === 'EachBlock') {
			const bindingSets =
				node.context?.type === 'Identifier'
					? eachBindingSets(node.expression, node.context.name, activeBindings)
					: [activeBindings];
			const eachAllowedDynamicNames = new Set(activeAllowedDynamicNames);
			const eachSourceIsUnextractable = expressionHasUnextractableCopy(
				node.expression,
				activeBindings,
				activeAllowedDynamicNames
			);
			if (node.context?.type === 'Identifier') {
				eachAllowedDynamicNames.add(node.context.name);
			}
			if (node.index) eachAllowedDynamicNames.add(node.index);
			if (eachSourceIsUnextractable) {
				passages.push({
					file: filename,
					line: lineNumber(source, node.start),
					text: '',
					extractionError: 'Cannot statically audit copy from this dynamic Svelte each source.',
					extractionErrorId: 'copy-svelte-expression-unextractable'
				});
			}
			for (const eachBindings of bindingSets) {
				for (const child of node.children ?? []) {
					visit(child, insideContentElement, eachBindings, eachAllowedDynamicNames);
				}
			}
			for (const child of node.else?.children ?? []) {
				visit(child, insideContentElement, activeBindings, activeAllowedDynamicNames);
			}
			return;
		}

		if (
			node.type === 'Element' ||
			node.type === 'InlineComponent' ||
			node.type === 'Component' ||
			node.type === 'Title'
		) {
			if (EXCLUDED_ELEMENTS.has(node.name)) return;

			isContentElement =
				CONTENT_ELEMENTS.has(node.name) || hasDirectVisibleText(node, activeBindings);
			const shouldAggregate = isContentElement && !insideContentElement;
			if (shouldAggregate) {
				const text = normalizeText(aggregateElementText(node, activeBindings));
				if (text) passages.push({ file: filename, line: lineNumber(source, node.start), text });
				if (elementHasUnextractableCopy(node, activeBindings, activeAllowedDynamicNames)) {
					passages.push({
						file: filename,
						line: lineNumber(source, node.start),
						text: '',
						extractionError: 'Cannot statically audit this dynamic visible Svelte copy.',
						extractionErrorId: 'copy-svelte-expression-unextractable'
					});
				}
				insideContentElement = true;
			}

			for (const attribute of node.attributes ?? []) {
				if (attribute.type === 'Spread') {
					passages.push({
						file: filename,
						line: lineNumber(source, attribute.start),
						text: '',
						extractionError: 'Cannot statically audit copy-capable Svelte spread attributes.',
						extractionErrorId: 'copy-svelte-spread-unextractable'
					});
					continue;
				}
				if (attribute.type !== 'Attribute') continue;
				if (
					(node.type === 'Component' || node.type === 'InlineComponent') &&
					!isClassifiedComponentAttribute(attribute, activeBindings, activeAllowedDynamicNames)
				) {
					passages.push({
						file: filename,
						line: lineNumber(source, attribute.start),
						text: '',
						classificationError: `Classify the component attribute "${attribute.name}" as prose or an explicit exclusion.`
					});
					continue;
				}
				if (!isCopyAttribute(node, attribute, activeBindings)) continue;
				if (!Array.isArray(attribute.value)) {
					passages.push({
						file: filename,
						line: lineNumber(source, attribute.start),
						text: '',
						extractionError: `Cannot extract the copy attribute "${attribute.name}" from its compiler value shape.`,
						extractionErrorId: 'copy-attribute-unextractable'
					});
					continue;
				}
				const text = normalizeText(
					attribute.value.map((item) => nodeText(item, activeBindings)).join(' ')
				);
				if (text)
					passages.push({ file: filename, line: lineNumber(source, attribute.start), text });
				if (
					attribute.value.some(
						(item) =>
							item.expression &&
							expressionHasUnextractableCopy(
								item.expression,
								activeBindings,
								activeAllowedDynamicNames
							)
					)
				) {
					passages.push({
						file: filename,
						line: lineNumber(source, attribute.start),
						text: '',
						extractionError: `Cannot statically audit the dynamic copy attribute "${attribute.name}".`,
						extractionErrorId: 'copy-svelte-expression-unextractable'
					});
				}
			}
		}

		for (const child of node.children ?? node.nodes ?? []) {
			visit(child, insideContentElement, activeBindings, activeAllowedDynamicNames);
		}
		for (const child of node.else?.children ?? []) {
			visit(child, insideContentElement, activeBindings, activeAllowedDynamicNames);
		}
		for (const child of node.pending?.children ?? []) {
			visit(child, insideContentElement, activeBindings, activeAllowedDynamicNames);
		}
		for (const child of node.then?.children ?? []) {
			visit(child, insideContentElement, activeBindings, activeAllowedDynamicNames);
		}
		for (const child of node.catch?.children ?? []) {
			visit(child, insideContentElement, activeBindings, activeAllowedDynamicNames);
		}
	}

	visit(ast.html);
	const renderedTexts = new Set(passages.map((passage) => passage.text).filter(Boolean));

	for (const match of scripts) {
		const scriptSource = match[1];
		const scriptOffset = match.index + match[0].indexOf(scriptSource);
		const scriptPassages = extractTypeScriptPassages(
			scriptSource,
			filename,
			lineNumber(source, scriptOffset)
		);
		for (const passage of scriptPassages) {
			const alreadyRendered = passage.text && renderedTexts.has(passage.text);
			if (!alreadyRendered) passages.push(passage);
		}
	}

	return passages;
}

function extractPlainTextPassages(source, filename) {
	const passages = [];
	let inFence = false;
	let offset = 0;

	for (const block of source.split(/\n\s*\n/gu)) {
		const trimmed = block.trim();
		if (trimmed.startsWith('```')) inFence = !inFence;
		if (!inFence && trimmed && !trimmed.startsWith('#')) {
			const text = normalizeText(trimmed.replace(/^>\s?/gmu, '').replace(/^[-*]\s+/gmu, ''));
			if (text) passages.push({ file: filename, line: lineNumber(source, offset), text });
		}
		offset += block.length + 2;
	}

	return passages;
}

function splitSentences(text) {
	const protectedText = text
		.replace(/^\d+\.(?=\s)/u, (value) => value.replace('.', '·'))
		.replace(/\.[a-z0-9]{1,5}\b/gu, (value) => value.replace('.', '·'))
		.replace(/https?:\/\/\S+/gu, (value) => value.replaceAll('.', '·'))
		.replace(/\b(?:[\p{L}\p{N}@_-]+\.)+[\p{L}\p{N}@_-]+\b/gu, (value) =>
			value.replaceAll('.', '·')
		);
	const expression = /[^.!?]+[.!?]+(?:["'’)]*)/gu;
	return [...protectedText.matchAll(expression)]
		.map((match) => text.slice(match.index, match.index + match[0].length).trim())
		.filter(Boolean);
}

function countWords(sentence) {
	const normalized = sentence
		.replace(/https?:\/\/\S+/gu, ' URL ')
		.replace(/`[^`]+`/gu, ' IDENTIFIER ')
		.replace(/(["“]).*?(["”])/gu, ' QUOTED_TEXT ')
		.replace(/\b\d+(?:\.\d+)?\s*(?:%|[a-zA-Z]{1,5})\b/gu, ' NUMBER_UNIT ');
	return normalized.match(/[\p{L}\p{N}][\p{L}\p{N}@_./:'’()-]*/gu)?.length ?? 0;
}

function isProcedural(sentence) {
	const firstWord = sentence.match(/^(?:\d+\.\s+)?([\p{L}]+)/u)?.[1]?.toLowerCase();
	return firstWord ? IMPERATIVE_VERBS.has(firstWord) : false;
}

function finding({ severity, id, message, passage, text = passage.text }) {
	return {
		severity,
		id,
		file: passage.file,
		line: passage.line,
		message,
		text: normalizeText(text)
	};
}

export function auditPassages(passages) {
	const findings = [];

	for (const passage of passages) {
		for (const rule of PROHIBITED_TERMS) {
			if (rule.pattern.test(passage.text)) {
				findings.push(finding({ severity: 'error', ...rule, passage }));
			}
			rule.pattern.lastIndex = 0;
		}

		for (const rule of ADVISORY_PHRASES) {
			if (rule.pattern.test(passage.text)) {
				findings.push(finding({ severity: 'warning', ...rule, passage }));
			}
			rule.pattern.lastIndex = 0;
		}

		const sentences = splitSentences(passage.text);
		if (sentences.length > 6) {
			findings.push(
				finding({
					severity: 'warning',
					id: 'descriptive-paragraph-length',
					message: `Descriptive paragraph has ${sentences.length} sentences; the project maximum is 6.`,
					passage
				})
			);
		}

		for (const sentence of sentences) {
			const wordCount = countWords(sentence);
			const procedural = isProcedural(sentence);
			const limit = procedural ? 20 : 25;
			if (wordCount > limit) {
				findings.push(
					finding({
						severity: 'warning',
						id: procedural ? 'procedural-sentence-length' : 'descriptive-sentence-length',
						message: `${procedural ? 'Procedural' : 'Descriptive'} sentence has ${wordCount} words; the project maximum is ${limit}.`,
						passage,
						text: sentence
					})
				);
			}
		}
	}

	return findings;
}

export async function findProjectCopySources(projectRoot = PROJECT_ROOT) {
	return glob(COPY_GLOBS, {
		cwd: projectRoot,
		ignore: COPY_IGNORES,
		nodir: true,
		posix: true
	}).then((files) => files.sort());
}

export async function extractProjectPassages(projectRoot = PROJECT_ROOT) {
	const files = await findProjectCopySources(projectRoot);
	const passages = [];

	for (const file of files) {
		const source = await readFile(path.join(projectRoot, file), 'utf8');
		try {
			if (file.endsWith('.svelte')) passages.push(...extractSveltePassages(source, file));
			else if (file.endsWith('.ts')) passages.push(...extractTypeScriptPassages(source, file));
			else passages.push(...extractPlainTextPassages(source, file));
		} catch (error) {
			passages.push({ file, line: 1, text: '' });
			passages.at(-1).parseError = error instanceof Error ? error.message : String(error);
		}
	}

	return { files, passages };
}

export async function runCopyCheck(projectRoot = PROJECT_ROOT) {
	const { files, passages } = await extractProjectPassages(projectRoot);
	const findings = auditPassages(passages);
	for (const passage of passages) {
		if (!passage.parseError) continue;
		findings.push(
			finding({
				severity: 'error',
				id: 'copy-source-parse',
				message: passage.parseError,
				passage
			})
		);
	}
	for (const passage of passages) {
		if (!passage.classificationError) continue;
		findings.push(
			finding({
				severity: 'error',
				id: 'copy-property-unclassified',
				message: passage.classificationError,
				passage
			})
		);
	}
	for (const passage of passages) {
		if (!passage.extractionError) continue;
		findings.push(
			finding({
				severity: 'error',
				id: passage.extractionErrorId ?? 'copy-source-unextractable',
				message: passage.extractionError,
				passage
			})
		);
	}

	return {
		files,
		passageCount: passages.filter(
			(passage) => !passage.parseError && !passage.classificationError && !passage.extractionError
		).length,
		findings,
		errors: findings.filter((item) => item.severity === 'error'),
		warnings: findings.filter((item) => item.severity === 'warning')
	};
}

function printHumanReport(result) {
	for (const item of result.findings) {
		console.log(
			`${item.severity.toUpperCase()} ${item.file}:${item.line} [${item.id}] ${item.message}`
		);
		console.log(`  ${item.text}`);
	}

	console.log(
		`Copy check scanned ${result.files.length} files and ${result.passageCount} prose passages: ${result.errors.length} errors, ${result.warnings.length} warnings.`
	);
	console.log(
		'Automated success does not prove full ASD-STE100 conformity. Record a manual review on each documentation pull request.'
	);
}

const isMain =
	process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
	const result = await runCopyCheck();
	if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2));
	else printHumanReport(result);
	process.exitCode = result.errors.length > 0 ? 1 : 0;
}
