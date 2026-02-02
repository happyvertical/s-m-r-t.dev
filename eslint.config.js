import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			// Catch undefined variables - this will error on {UndefinedVar} in templates
			'no-undef': 'error',
			// Additional strictness for variable usage
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			// Prevent using variables before they're defined
			'no-use-before-define': ['error', { functions: false, classes: false }]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			// Svelte-specific rules to catch template issues
			'svelte/valid-compile': 'error',
			// This catches invalid expressions in templates
			'svelte/no-unused-svelte-ignore': 'error',
			// Ensure reactive values are properly used
			'svelte/require-reactive-cleanup': 'error'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
];
