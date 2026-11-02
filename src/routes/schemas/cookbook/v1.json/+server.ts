import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { RequestHandler } from './$types';

// Every cookbook names this URL as its `$schema`, and the schema's own `$id`
// is this URL. It is read from the installed smrt-core at prerender time, so it
// always matches the release the site pins.
export const prerender = true;

const schemaPath = fileURLToPath(
	import.meta.resolve('@happyvertical/smrt-core/cookbook/v1.schema.json')
);

export const GET: RequestHandler = () =>
	new Response(readFileSync(schemaPath, 'utf8'), {
		headers: { 'content-type': 'application/schema+json; charset=utf-8' }
	});
