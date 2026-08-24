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
	'aria-label',
	'ariaLabel',
	'backLabel',
	'content',
	'description',
	'placeholder',
	'subtitle',
	'title'
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
	const bindings = isDataFile ? extractScriptBindings(source, filename) : new Map();

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

function extractScriptBindings(source, filename) {
	const scriptKind = filename.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, scriptKind);
	const bindings = new Map();

	function visit(node) {
		if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
			const text = normalizeText(extractStaticTypeScriptText(node.initializer, bindings));
			if (text) bindings.set(node.name.text, text);
		}
		ts.forEachChild(node, visit);
	}

	if (ast.parseDiagnostics.length === 0) visit(ast);
	return bindings;
}

function extractExpressionText(node, bindings = new Map()) {
	if (!node || typeof node !== 'object') return '';
	switch (node.type) {
		case 'Literal':
			return typeof node.value === 'string' ? node.value : '';
		case 'Identifier':
			return bindings.get(node.name) ?? '';
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

function nodeText(node, bindings) {
	if (node?.type === 'Text') return node.data ?? node.raw ?? '';
	if (node?.expression) {
		const text = extractExpressionText(node.expression, bindings);
		return node.type === 'RawMustacheTag' ? text.replace(/<[^>]*>/gu, ' ') : text;
	}
	return '';
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
	for (const match of scripts) {
		for (const [name, text] of extractScriptBindings(match[1], filename)) bindings.set(name, text);
	}

	function visit(node, insideContentElement = false, activeBindings = bindings) {
		if (!node || typeof node !== 'object') return;
		let isContentElement = false;
		if (node.type === 'RawMustacheTag' && !insideContentElement) {
			const text = normalizeText(nodeText(node, activeBindings));
			if (text) passages.push({ file: filename, line: lineNumber(source, node.start), text });
		}
		if (node.type === 'EachBlock') {
			const eachBindings = new Map(activeBindings);
			if (node.context?.type === 'Identifier') {
				const text = normalizeText(extractExpressionText(node.expression, activeBindings));
				if (text) eachBindings.set(node.context.name, text);
			}
			for (const child of node.children ?? []) visit(child, insideContentElement, eachBindings);
			for (const child of node.else?.children ?? []) {
				visit(child, insideContentElement, activeBindings);
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
				insideContentElement = true;
			}

			for (const attribute of node.attributes ?? []) {
				if (!COPY_ATTRIBUTES.has(attribute.name) || !Array.isArray(attribute.value)) continue;
				const text = normalizeText(
					attribute.value.map((item) => nodeText(item, activeBindings)).join(' ')
				);
				if (text)
					passages.push({ file: filename, line: lineNumber(source, attribute.start), text });
			}
		}

		for (const child of node.children ?? node.nodes ?? []) {
			visit(child, insideContentElement, activeBindings);
		}
		for (const child of node.else?.children ?? []) {
			visit(child, insideContentElement, activeBindings);
		}
		for (const child of node.pending?.children ?? []) {
			visit(child, insideContentElement, activeBindings);
		}
		for (const child of node.then?.children ?? []) {
			visit(child, insideContentElement, activeBindings);
		}
		for (const child of node.catch?.children ?? []) {
			visit(child, insideContentElement, activeBindings);
		}
	}

	visit(ast.html);

	for (const match of scripts) {
		const scriptSource = match[1];
		const scriptOffset = match.index + match[0].indexOf(scriptSource);
		passages.push(
			...extractTypeScriptPassages(scriptSource, filename, lineNumber(source, scriptOffset))
		);
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

	return {
		files,
		passageCount: passages.filter((passage) => !passage.parseError && !passage.classificationError)
			.length,
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
