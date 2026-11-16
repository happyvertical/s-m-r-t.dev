# s-m-r-t.dev

This is the documentation site for the smrt framework, published at
[s-m-r-t.dev](https://s-m-r-t.dev). It's a SvelteKit site built with
`adapter-static`: every page is prerendered at build time, so what ships is
plain static files.

The framework itself lives in
[happyvertical/smrt](https://github.com/happyvertical/smrt).

## Run it

You need Node 26 and pnpm. The install enforces the Node version, so on an older
Node it fails instead of warning.

```sh
pnpm install
pnpm run dev
```

## Test, lint and build

```sh
pnpm test        # dependency, copy and reference checks, then the unit tests
pnpm run check   # type check
pnpm run lint    # prettier, eslint and the template check
pnpm run build   # static site into build/
```

A pull request runs `test`, `check` and `build`, but not `lint`. Lint only runs
on `main` after a merge, so run it yourself before you open one.

The build also writes `llms.txt`, `llms-full.txt` and a Markdown copy of every
page into `build/`. `scripts/agent-docs/source.txt` holds the reviewed summary
and picks the full-text pages. Edit pages at their source, never in `build/`;
`vite preview` doesn't serve these files, so point a static server at `build/`.
After building, check them and the built links with:

```sh
pnpm run check:links
pnpm run check:agent-docs
node scripts/check-agent-metadata.mjs
```

Every content page carries JSON-LD built from its SEO metadata, with articles
and breadcrumbs added on documentation routes, and the layout advertises
`/llms.txt`. The metadata check fails when a canonical page is missing from the
sitemap or a sitemap URL has no built page. Redirect aliases are left out on
purpose. To check a deployed site:

```sh
node scripts/check-agent-metadata.mjs --origin https://s-m-r-t.dev
```

## How it deploys

`.github/workflows/build-deploy.yaml` does it. A push to `main` that touches the
site builds once, syncs `build/` to the staging S3 bucket, clears the CloudFront
cache and checks [staging.s-m-r-t.dev](https://staging.s-m-r-t.dev). If that
passes, the same build goes to production the same way. You can also deploy
either environment by running the workflow by hand.

The buckets, CloudFront distributions, DNS and certificates are OpenTofu
configuration in `infra/`. See [infra/README.md](infra/README.md).

## Writing and contributing

- [docs/writing-standard.md](docs/writing-standard.md) is the voice guide. Read
  it before you change any copy.
- [AGENTS.md](AGENTS.md) holds the contribution rules: how content is authored,
  the dependency policy, and what must stay green.
