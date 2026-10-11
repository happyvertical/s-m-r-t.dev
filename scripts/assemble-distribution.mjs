#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build');

function packageFile(specifier) {
	return fileURLToPath(import.meta.resolve(specifier));
}

function copyRequired(source, destination, label) {
	if (!existsSync(source)) {
		throw new Error(`Missing ${label}: ${source}`);
	}
	mkdirSync(dirname(destination), { recursive: true });
	cpSync(source, destination, { recursive: true, force: true });
}

const plannerEntry = packageFile('@happyvertical/smrt-planner/app');
const plannerDir = join(dirname(plannerEntry), '..', '..', 'app');
copyRequired(plannerDir, join(buildDir, 'plan'), 'published planner app');

const cookbookSchema = packageFile('@happyvertical/smrt-core/cookbook/v1.schema.json');
copyRequired(
	cookbookSchema,
	join(buildDir, 'schemas', 'cookbook', 'v1.json'),
	'published cookbook v1 schema'
);
