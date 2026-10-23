# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Agent-readable documentation

`pnpm run build` generates `build/llms.txt`, a curated `build/llms-full.txt`, and
Markdown for every canonical page (`/path.md`, with `/index.md` for the homepage).
The generator reads the prerendered HTML and sitemap, so titles, descriptions,
code examples, tables, and prose share the browser's source. It fails when a
canonical page is missing from the sitemap or a sitemap URL has no built page.
Redirect aliases are intentionally excluded. These post-build files live in `build/`;
SvelteKit’s `vite preview` serves its internal output, so inspect the text files
with a static server pointed at `build/` or on the deployed site. Interactive tools export their
server-rendered documentation; running a mock-up still requires JavaScript.

The reviewed summary and permission boundaries live in
`scripts/agent-docs/source.txt`; its canonical links select the curated full-text
pages, supplemented by the API, package, component, and FAQ indexes. Edit page
content at its normal source, then rebuild; do not edit files in `build/`.

Every content page includes JSON-LD from its existing SEO metadata. Shared site,
organization, and source identities are supplemented by articles and breadcrumbs
on documentation routes. The layout advertises `/llms.txt`.

After building, run:

```sh
pnpm run check:agent-docs
node scripts/check-agent-metadata.mjs
```

To verify a deployed site (HTTP status, MIME types, every Markdown path, and
representative server-rendered metadata without JavaScript):

```sh
node scripts/check-agent-metadata.mjs --origin https://s-m-r-t.dev
```
