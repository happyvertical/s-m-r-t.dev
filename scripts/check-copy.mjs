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
	'src/lib/version.ts',
	'static/**/*.txt'
];

const COPY_IGNORES = [
	'**/*.test.*',
	'**/*.spec.*',
	'src/routes/**/+page.server.ts',
	'src/routes/**/+server.ts'
];

const PROSE_PROPERTIES = new Set([
	'actsAs',
	'ariaLabel',
	'body',
	'breadcrumb',
	'caption',
	'category',
	'callout',
	'changedBy',
	'chip',
	'claim',
	'content',
	'defaultValue',
	'description',
	'details',
	'deprecated',
	'display',
	'door',
	'external',
	'eyebrow',
	'foundation',
	'kicker',
	'heroLine',
	'highlights',
	'intro',
	'label',
	'layer',
	'lede',
	'limit',
	'linkLabel',
	'name',
	'navTitle',
	'new',
	'note',
	'notice',
	'displayName',
	'plainEnglish',
	'planeChip',
	'playgroundNote',
	'points',
	'prerequisites',
	'private',
	'purpose',
	'rows',
	'scopeCopy',
	'security',
	'stub',
	'subline',
	'summary',
	'concepts',
	'expectedResult',
	'surfaceNote',
	'title',
	'track',
	'version-added',
	'warning'
]);

const NON_PROSE_PROPERTIES = new Set([
	'authoredSummaries',
	'base',
	'boundary',
	'browser',
	'candidate',
	'canonical',
	'chips',
	'code',
	'collections',
	'component',
	'componentGroups',
	'componentImport',
	'components',
	'demo',
	'decision',
	'describedProps',
	'difficulty',
	'eager',
	'entry',
	'entries',
	'entryId',
	'entryTitle',
	'exampleResource',
	'family',
	'filename',
	'guide',
	'guides',
	'group',
	'groups',
	'haystack',
	'href',
	'icon',
	'id',
	'importPath',
	'index',
	'installed',
	'items',
	'keywords',
	'kind',
	'lang',
	'links',
	'loadComponent',
	'models',
	'module',
	'mock',
	'modes',
	'next',
	'normalizedLabel',
	'packages',
	'page',
	'packageName',
	'pinnedVersion',
	'plane',
	'prev',
	'qualifiedId',
	'records',
	'related',
	'relatedModules',
	'relatedReference',
	'relatedUi',
	'score',
	'section',
	'sections',
	'server',
	'shortName',
	'slot',
	'slots',
	'slug',
	'slugs',
	'source',
	'sources',
	'status',
	'stepCount',
	'summarySynthesized',
	'supportRange',
	'task',
	'tags',
	'topics',
	'totalComponents',
	'totalProps',
	'uiDependencies',
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
	'text',
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
	'hash',
	'id',
	'image',
	'lang',
	'language',
	'modules',
	'neighbors',
	'pathname',
	'placement',
	'persist',
	'pkg',
	'preset',
	'showLabels',
	'sectionId',
	'selectedEntryId',
	'slot',
	'standalone',
	'state',
	'style',
	'storageKey',
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
const AUDITED_COLLECTION_METHODS = new Set(['filter', 'flatMap', 'map']);

function bindingNameContains(node, name) {
	if (ts.isIdentifier(node)) return node.text === name;
	if (ts.isObjectBindingPattern(node) || ts.isArrayBindingPattern(node)) {
		return node.elements.some(
			(element) => ts.isBindingElement(element) && bindingNameContains(element.name, name)
		);
	}
	return false;
}

function createAuditedSourceResolver(ast) {
	const importedBindings = new Set();
	const declarations = new Map();

	function collect(node) {
		if (
			ts.isImportDeclaration(node) &&
			ts.isStringLiteral(node.moduleSpecifier) &&
			node.moduleSpecifier.text.startsWith('$lib/data/')
		) {
			const clause = node.importClause;
			if (clause?.name && !clause.isTypeOnly) importedBindings.add(clause.name.text);
			if (clause?.namedBindings && !clause.isTypeOnly) {
				if (ts.isNamespaceImport(clause.namedBindings)) {
					importedBindings.add(clause.namedBindings.name.text);
				} else {
					for (const element of clause.namedBindings.elements) {
						if (!element.isTypeOnly) importedBindings.add(element.name.text);
					}
				}
			}
		}
		if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
			declarations.set(node.name.text, node.initializer);
		}
		ts.forEachChild(node, collect);
	}

	collect(ast);

	function enclosingParameter(node, name) {
		let current = node.parent;
		while (current) {
			if (ts.isFunctionLike(current)) {
				const parameterIndex = current.parameters.findIndex((parameter) =>
					bindingNameContains(parameter.name, name)
				);
				if (parameterIndex !== -1) return { functionNode: current, parameterIndex };
			}
			current = current.parent;
		}
		return undefined;
	}

	function localFunctionArguments(node, name) {
		const parameter = enclosingParameter(node, name);
		if (!parameter || !ts.isFunctionDeclaration(parameter.functionNode)) return undefined;
		const { functionNode, parameterIndex } = parameter;
		if (
			!functionNode.name ||
			functionNode.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
		) {
			return undefined;
		}
		const calls = [];
		let escaped = false;
		function collectCalls(current) {
			if (
				ts.isCallExpression(current) &&
				ts.isIdentifier(current.expression) &&
				current.expression.text === functionNode.name.text
			) {
				calls.push(
					current.arguments[parameterIndex] ?? functionNode.parameters[parameterIndex].initializer
				);
			}
			if (
				ts.isIdentifier(current) &&
				current.text === functionNode.name.text &&
				current !== functionNode.name &&
				!(ts.isCallExpression(current.parent) && current.parent.expression === current) &&
				!(ts.isPropertyAccessExpression(current.parent) && current.parent.name === current) &&
				!(
					(ts.isPropertyAssignment(current.parent) || ts.isMethodDeclaration(current.parent)) &&
					current.parent.name === current
				)
			) {
				escaped = true;
			}
			ts.forEachChild(current, collectCalls);
		}
		collectCalls(ast);
		return !escaped && calls.length > 0 && calls.every(Boolean) ? calls : undefined;
	}

	function isAuditedParameterReference(node, name, seen = new Set()) {
		const parameter = enclosingParameter(node, name);
		if (!parameter) return false;
		const localArguments = localFunctionArguments(node, name);
		if (
			localArguments &&
			localArguments.every((argument) => isAuditedSourceExpression(argument, seen))
		) {
			return true;
		}
		const { functionNode } = parameter;
		const call = functionNode.parent;
		if (!ts.isCallExpression(call) || !call.arguments.includes(functionNode)) return false;
		if (
			!ts.isPropertyAccessExpression(call.expression) ||
			!AUDITED_COLLECTION_METHODS.has(call.expression.name.text)
		) {
			return false;
		}
		return isAuditedSourceExpression(call.expression.expression, seen);
	}

	function isAuditedIterationReference(node, name, seen = new Set()) {
		let current = node.parent;
		while (current) {
			if (ts.isForOfStatement(current) || ts.isForInStatement(current)) {
				const initializer = current.initializer;
				if (
					ts.isVariableDeclarationList(initializer) &&
					initializer.declarations.some((declaration) =>
						bindingNameContains(declaration.name, name)
					) &&
					isAuditedSourceExpression(current.expression, seen)
				) {
					return true;
				}
			}
			current = current.parent;
		}
		return false;
	}

	function isAuditedSourceExpression(node, seen = new Set()) {
		if (!node) return false;
		if (
			ts.isParenthesizedExpression(node) ||
			ts.isAsExpression(node) ||
			ts.isSatisfiesExpression(node) ||
			ts.isNonNullExpression(node)
		) {
			return isAuditedSourceExpression(node.expression, seen);
		}
		if (
			ts.isStringLiteral(node) ||
			ts.isNoSubstitutionTemplateLiteral(node) ||
			ts.isNumericLiteral(node) ||
			node.kind === ts.SyntaxKind.TrueKeyword ||
			node.kind === ts.SyntaxKind.FalseKeyword ||
			node.kind === ts.SyntaxKind.NullKeyword ||
			node.kind === ts.SyntaxKind.UndefinedKeyword
		) {
			return true;
		}
		if (ts.isTemplateExpression(node)) {
			return node.templateSpans.every((span) => isAuditedSourceExpression(span.expression, seen));
		}
		if (ts.isArrayLiteralExpression(node)) {
			return node.elements.every((element) =>
				ts.isSpreadElement(element)
					? isAuditedSourceExpression(element.expression, seen)
					: isAuditedSourceExpression(element, seen)
			);
		}
		if (ts.isObjectLiteralExpression(node)) {
			return node.properties.every((property) => {
				if (ts.isPropertyAssignment(property)) {
					return isAuditedSourceExpression(property.initializer, seen);
				}
				if (ts.isShorthandPropertyAssignment(property)) {
					return isAuditedSourceExpression(property.name, seen);
				}
				if (ts.isSpreadAssignment(property)) {
					return isAuditedSourceExpression(property.expression, seen);
				}
				return false;
			});
		}
		if (ts.isIdentifier(node)) {
			if (importedBindings.has(node.text)) return true;
			if (isAuditedParameterReference(node, node.text, seen)) return true;
			if (isAuditedIterationReference(node, node.text, seen)) return true;
			if (seen.has(node.text)) return false;
			const initializer = declarations.get(node.text);
			if (!initializer) return false;
			return isAuditedSourceExpression(initializer, new Set(seen).add(node.text));
		}
		if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
			return isAuditedSourceExpression(node.expression, seen);
		}
		if (
			ts.isNewExpression(node) &&
			ts.isIdentifier(node.expression) &&
			['Map', 'Set'].includes(node.expression.text)
		) {
			return Boolean(node.arguments?.length && isAuditedSourceExpression(node.arguments[0], seen));
		}
		if (ts.isCallExpression(node)) {
			if (
				ts.isPropertyAccessExpression(node.expression) &&
				AUDITED_COLLECTION_METHODS.has(node.expression.name.text)
			) {
				return isAuditedSourceExpression(node.expression.expression, seen);
			}
			if (
				ts.isPropertyAccessExpression(node.expression) &&
				ts.isIdentifier(node.expression.expression) &&
				['Array', 'Object'].includes(node.expression.expression.text) &&
				['entries', 'from', 'keys', 'values'].includes(node.expression.name.text)
			) {
				return node.arguments.length > 0 && isAuditedSourceExpression(node.arguments[0], seen);
			}
			if (
				ts.isPropertyAccessExpression(node.expression) &&
				node.expression.name.text === 'glob' &&
				ts.isMetaProperty(node.expression.expression) &&
				node.expression.expression.keywordToken === ts.SyntaxKind.ImportKeyword
			) {
				return true;
			}
		}
		return false;
	}

	return {
		getLocalFunctionArguments: localFunctionArguments,
		isAuditedIterationReference,
		isAuditedParameterReference,
		isAuditedSourceExpression
	};
}

function typeScriptExpressionRootName(node) {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
		return typeScriptExpressionRootName(node.expression);
	}
	return undefined;
}

function isSupportedProseInitializer(node, bindings, auditedSources) {
	if (!node) return false;
	if (
		ts.isStringLiteral(node) ||
		ts.isNoSubstitutionTemplateLiteral(node) ||
		ts.isNumericLiteral(node) ||
		node.kind === ts.SyntaxKind.TrueKeyword ||
		node.kind === ts.SyntaxKind.FalseKeyword ||
		node.kind === ts.SyntaxKind.NullKeyword ||
		node.kind === ts.SyntaxKind.UndefinedKeyword
	) {
		return true;
	}
	if (ts.isTemplateExpression(node)) {
		return node.templateSpans.every((span) =>
			isSupportedProseInitializer(span.expression, bindings, auditedSources)
		);
	}
	if (ts.isIdentifier(node)) {
		return (
			node.text === 'undefined' ||
			bindingsHaveRoot(bindings, node.text) ||
			auditedSources.isAuditedSourceExpression(node) ||
			auditedSources.isAuditedParameterReference(node, node.text) ||
			auditedSources.isAuditedIterationReference(node, node.text)
		);
	}
	if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
		const root = typeScriptExpressionRootName(node);
		return Boolean(
			root &&
			(bindingsHaveRoot(bindings, node.getText()) ||
				bindingsHaveRoot(bindings, root) ||
				auditedSources.isAuditedParameterReference(node, root) ||
				auditedSources.isAuditedIterationReference(node, root))
		);
	}
	if (
		ts.isCallExpression(node) &&
		ts.isPropertyAccessExpression(node.expression) &&
		SAFE_PROSE_METHODS.has(node.expression.name.text) &&
		(isSupportedProseInitializer(node.expression.expression, bindings, auditedSources) ||
			auditedSources.isAuditedSourceExpression(node.expression.expression))
	) {
		return true;
	}
	if (
		ts.isParenthesizedExpression(node) ||
		ts.isAsExpression(node) ||
		ts.isSatisfiesExpression(node) ||
		ts.isNonNullExpression(node)
	) {
		return isSupportedProseInitializer(node.expression, bindings, auditedSources);
	}
	if (ts.isConditionalExpression(node)) {
		return (
			isSupportedProseInitializer(node.whenTrue, bindings, auditedSources) &&
			isSupportedProseInitializer(node.whenFalse, bindings, auditedSources)
		);
	}
	if (ts.isBinaryExpression(node)) {
		return (
			isSupportedProseInitializer(node.left, bindings, auditedSources) &&
			isSupportedProseInitializer(node.right, bindings, auditedSources)
		);
	}
	if (ts.isArrayLiteralExpression(node)) {
		return node.elements.every((element) =>
			isSupportedProseInitializer(element, bindings, auditedSources)
		);
	}
	if (ts.isObjectLiteralExpression(node)) {
		return node.properties.every((property) => {
			if (ts.isPropertyAssignment(property)) {
				return isSupportedProseInitializer(property.initializer, bindings, auditedSources);
			}
			if (ts.isShorthandPropertyAssignment(property)) return true;
			if (ts.isSpreadAssignment(property)) {
				return isSupportedProseInitializer(property.expression, bindings, auditedSources);
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
	const auditedSources = createAuditedSourceResolver(ast);

	function appendProseIdentifierPassages(identifier) {
		const text = bindings.get(identifier.text);
		if (text) {
			passages.push({
				file: filename,
				line: baseLine + lineNumber(source, identifier.getStart(ast)) - 1,
				text
			});
			return;
		}
		for (const argument of auditedSources.getLocalFunctionArguments(identifier, identifier.text) ??
			[]) {
			const argumentText = normalizeText(extractStaticTypeScriptText(argument, bindings));
			if (!argumentText) continue;
			passages.push({
				file: filename,
				line: baseLine + lineNumber(source, argument.getStart(ast)) - 1,
				text: argumentText
			});
		}
	}

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
				appendProseIdentifierPassages(node.initializer);
			}
			if (
				isDataFile &&
				name &&
				PROSE_PROPERTIES.has(name) &&
				!isSupportedProseInitializer(node.initializer, bindings, auditedSources)
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
		if (ts.isShorthandPropertyAssignment(node)) {
			const name = node.name.text;
			const classified =
				PROSE_PROPERTIES.has(name) || NON_PROSE_PROPERTIES.has(name) || name.startsWith('smrt-');
			if (isDataFile && !classified) {
				passages.push({
					file: filename,
					line: baseLine + lineNumber(source, node.name.getStart(ast)) - 1,
					text: '',
					classificationError: `Classify the data property "${name}" as prose or an explicit exclusion.`
				});
			}
			if (PROSE_PROPERTIES.has(name)) {
				appendProseIdentifierPassages(node.name);
				if (!isSupportedProseInitializer(node.name, bindings, auditedSources)) {
					passages.push({
						file: filename,
						line: baseLine + lineNumber(source, node.name.getStart(ast)) - 1,
						text: '',
						extractionError: `Cannot statically audit the prose property "${name}" from this shorthand value.`,
						extractionErrorId: 'copy-prose-value-unextractable'
					});
				}
			}
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

function isAuditedCopyImport(source) {
	return source === '$lib/version' || source === '$lib/data' || source.startsWith('$lib/data/');
}

function extractAllowedDynamicNames(source, filename) {
	const scriptKind = filename.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, scriptKind);
	const names = new Set();

	function visit(node) {
		if (
			ts.isImportDeclaration(node) &&
			ts.isStringLiteral(node.moduleSpecifier) &&
			isAuditedCopyImport(node.moduleSpecifier.text) &&
			node.importClause &&
			!node.importClause.isTypeOnly
		) {
			if (node.importClause.name) names.add(node.importClause.name.text);
			const bindings = node.importClause.namedBindings;
			if (bindings && ts.isNamespaceImport(bindings)) names.add(bindings.name.text);
			if (bindings && ts.isNamedImports(bindings)) {
				for (const element of bindings.elements) {
					if (!element.isTypeOnly) names.add(element.name.text);
				}
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

function extractRuntimeValueBindings(source, filename) {
	const scriptKind = filename.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, scriptKind);
	const bindings = new Map();

	function visit(node) {
		if (
			ts.isImportDeclaration(node) &&
			ts.isStringLiteral(node.moduleSpecifier) &&
			node.moduleSpecifier.text === '$app/state' &&
			node.importClause?.namedBindings &&
			ts.isNamedImports(node.importClause.namedBindings)
		) {
			for (const element of node.importClause.namedBindings.elements) {
				const importedName = element.propertyName?.text ?? element.name.text;
				if (importedName !== 'page' || element.isTypeOnly) continue;
				bindings.set(`${element.name.text}.status`, '');
				bindings.set(`${element.name.text}.error.message`, '');
			}
		}
		ts.forEachChild(node, visit);
	}

	if (ast.parseDiagnostics.length === 0) visit(ast);
	return bindings;
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
	// EachBlock introduces its own item/index names, exactly like the main
	// `visit()` walk does. Without this, a nested `{#each}` inside a content
	// element (e.g. a `<li>` that aggregates its whole subtree in one pass)
	// checks the loop variable against the *outer* scope, which never has it,
	// and reports a false positive.
	if (node.type === 'EachBlock') {
		if (expressionHasUnextractableCopy(node.expression, bindings, allowedDynamicNames)) {
			return true;
		}
		const eachAllowedDynamicNames = new Set(allowedDynamicNames);
		if (node.context?.type === 'Identifier') eachAllowedDynamicNames.add(node.context.name);
		if (node.index) eachAllowedDynamicNames.add(node.index);
		const children = node.children ?? node.nodes ?? [];
		if (
			children.some((child) =>
				elementHasUnextractableCopy(child, bindings, eachAllowedDynamicNames)
			)
		) {
			return true;
		}
		const elseChildren = node.else?.children ?? [];
		return elseChildren.some((child) =>
			elementHasUnextractableCopy(child, bindings, allowedDynamicNames)
		);
	}
	const children = node.children ?? node.nodes ?? [];
	if (children.some((child) => elementHasUnextractableCopy(child, bindings, allowedDynamicNames))) {
		return true;
	}
	// IfBlock's `{:else}` branch lives under `.else.children` rather than
	// `.children` — check it too, so an else-branch mustache isn't silently
	// skipped.
	const elseChildren = node.else?.children ?? [];
	return elseChildren.some((child) =>
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

function isClassifiedComponentAttribute(attribute) {
	return (
		COPY_ATTRIBUTES.has(attribute.name) ||
		PROSE_PROPERTIES.has(attribute.name) ||
		NON_PROSE_PROPERTIES.has(attribute.name) ||
		COMPONENT_NON_COPY_ATTRIBUTES.has(attribute.name) ||
		attribute.name.startsWith('data-') ||
		attribute.name.startsWith('aria-')
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
		for (const [name, text] of extractRuntimeValueBindings(match[1], filename)) {
			bindings.set(name, text);
		}
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

			const isContentElement =
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
					!isClassifiedComponentAttribute(attribute)
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
	let fence;
	let paragraph = [];
	let paragraphOffset = 0;

	function flushParagraph() {
		const text = normalizeText(
			paragraph
				.join('\n')
				.replace(/^>\s?/gmu, '')
				.replace(/^[-*]\s+/gmu, '')
		);
		if (text) passages.push({ file: filename, line: lineNumber(source, paragraphOffset), text });
		paragraph = [];
	}

	for (const match of source.matchAll(/[^\n]*(?:\n|$)/gu)) {
		if (!match[0]) continue;
		const line = match[0].replace(/\n$/u, '');
		const trimmed = line.trim();

		const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
		if (fence) {
			if (
				fenceMatch &&
				fenceMatch[1][0] === fence.marker &&
				fenceMatch[1].length >= fence.length &&
				!fenceMatch[2].trim()
			) {
				fence = undefined;
			}
			continue;
		}
		if (fenceMatch) {
			flushParagraph();
			fence = {
				marker: fenceMatch[1][0],
				length: fenceMatch[1].length,
				offset: match.index
			};
			continue;
		}
		if (!trimmed || trimmed.startsWith('#')) {
			flushParagraph();
			continue;
		}
		if (paragraph.length === 0) paragraphOffset = match.index;
		paragraph.push(line);
	}
	flushParagraph();
	if (fence) {
		passages.push({
			file: filename,
			line: lineNumber(source, fence.offset),
			text: '',
			extractionError: 'Cannot statically audit plain text after an unclosed fenced code block.',
			extractionErrorId: 'copy-fence-unclosed'
		});
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
