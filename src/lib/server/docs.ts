import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const DOCS_PATH = path.resolve('node_modules/@happyvertical/smrt-docs/content');

export interface DocMetadata {
	title?: string;
	description?: string;
	[key: string]: any;
}

export interface DocContent {
	metadata: DocMetadata;
	html: string;
	slug: string;
}

export async function getDoc(slug: string): Promise<DocContent | null> {
	try {
		const filePath = path.join(DOCS_PATH, `${slug}.md`);

		if (!fs.existsSync(filePath)) {
			const indexPath = path.join(DOCS_PATH, slug, 'index.md');
			if (fs.existsSync(indexPath)) {
				return getDoc(`${slug}/index`);
			}
			return null;
		}

		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const { data, content } = matter(fileContent);
		const html = await marked.parse(content);

		return {
			metadata: data,
			html,
			slug
		};
	} catch (e) {
		console.error(`Error loading doc ${slug}:`, e);
		return null;
	}
}

export function listDocs(subdir = ''): string[] {
	const dirPath = path.join(DOCS_PATH, subdir);
	if (!fs.existsSync(dirPath)) return [];

	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.isDirectory()) {
			files.push(...listDocs(path.join(subdir, entry.name)));
		} else if (entry.name.endsWith('.md')) {
			files.push(path.join(subdir, entry.name).replace(/\.md$/, ''));
		}
	}

	return files;
}
