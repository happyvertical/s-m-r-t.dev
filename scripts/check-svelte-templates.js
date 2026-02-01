#!/usr/bin/env node
/**
 * Custom script to check for unescaped curly braces in Svelte templates.
 *
 * In Svelte, {expression} is used for template expressions. When displaying
 * code examples in <code> blocks, curly braces must be escaped as {'{'} and {'}'}.
 *
 * This script catches the common anti-pattern: <code>{ foo }</code>
 * Which should be: <code>{'{'} foo {'}'}</code>
 */

import { glob } from 'glob';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const errors = [];

// Files that are allowed to have unescaped braces (component files that render props)
const ALLOWED_FILES = [
	'CodeBlock.svelte', // Renders {code} prop
	'Icon.svelte', // Renders {icon} prop
	'icon/+page.svelte' // Icon demo page renders {icon}
];

async function checkFiles() {
	const files = await glob('src/**/*.svelte', { cwd: projectRoot });

	for (const file of files) {
		// Skip allowed files
		if (ALLOWED_FILES.some((f) => file.includes(f))) {
			continue;
		}

		const content = readFileSync(join(projectRoot, file), 'utf-8');
		const lines = content.split('\n');

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const lineNum = i + 1;

			// Skip if line doesn't have <code>
			if (!line.includes('<code')) {
				continue;
			}

			// Skip if entire line is already escaped with {'{...}'} pattern
			if (line.includes("{'{") && line.includes("}'")) {
				continue;
			}

			// Skip if inside template literal {`...`}
			if (line.includes('{`') && line.includes('`}')) {
				continue;
			}

			// Extract content between <code> and </code>
			const codeMatches = [...line.matchAll(/<code[^>]*>(.*?)<\/code>/g)];

			for (const match of codeMatches) {
				const inner = match[1];

				// Skip empty
				if (!inner || inner.trim() === '') {
					continue;
				}

				// Skip if already escaped within the <code> content itself
				if (inner.includes("{'{")) {
					continue;
				}

				// Skip JSX-style prop={value} or prop="{value}" patterns
				// These are common in documentation showing React/Svelte component usage
				if (/^\s*\w+[\s=]+\{/.test(inner) || /^\s*\w+="\{/.test(inner)) {
					continue;
				}

				// Check for unescaped {identifier} or {id1, id2} patterns
				// These are patterns that look like destructuring or type imports
				// Also catch {(id1, id2)} which prettier may have transformed
				const problematicPattern =
					/\{\s*\(?\s*[A-Za-z_][A-Za-z0-9_]*\s*(,\s*[A-Za-z_][A-Za-z0-9_]*\s*)*\)?\s*\}/;
				if (problematicPattern.test(inner)) {
					errors.push({
						file,
						line: lineNum,
						content: line.trim(),
						desc: `Unescaped braces in <code>: "${inner.substring(0, 60)}${inner.length > 60 ? '...' : ''}"`
					});
				}
			}
		}
	}

	return errors;
}

const errorsFound = await checkFiles();

if (errorsFound.length > 0) {
	console.error('❌ Svelte template issues found:\n');
	for (const err of errorsFound) {
		console.error(`  ${err.file}:${err.line}`);
		console.error(`    ${err.desc}`);
		console.error(`    > ${err.content}\n`);
	}
	console.error(`\nTotal issues: ${errorsFound.length}`);
	console.error('\n💡 Fix: Escape curly braces in <code> blocks like this:');
	console.error("   <code>{'{'} Signal {'}'}</code>");
	console.error('\n   Or use template literals for code examples:');
	console.error('   <code>{`{ foo, bar }`}</code>');
	process.exit(1);
} else {
	console.log('✅ No unescaped curly braces found in Svelte templates');
	process.exit(0);
}
