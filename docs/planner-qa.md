# Planner release QA

The public Planner is assembled from the released
`@happyvertical/smrt-planner` package during the documentation build. It is
served below `/plan/`; the canonical cookbook schema is served at
`/schemas/cookbook/v1.json`.

## Local preview

Use the Node and pnpm versions in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview --host 127.0.0.1 --port 4183
```

Open `http://127.0.0.1:4183/plan/`. The preview uses the same assembled
`build/` directory uploaded by the deployment workflow.

## Owner acceptance checklist

- Open `/plan/`, then reload supported nested pages including `/plan/ai/`,
  `/plan/cookbook/`, and one model page. Use back and forward. Confirm the
  address stays below `/plan/`.
- Open ordinary documentation before and after Planner navigation. Confirm a
  deliberately missing Planner asset and a missing documentation route still
  return 404.
- Start with no assistant. Choose a cookbook, edit recipes, layout, and
  settings, validate the plan, and export it. Confirm manual planning remains
  usable after an inference connection fails.
- Confirm BYO is the initial inference choice. WebLLM must start only after
  selecting it and explicitly starting its model download. A failed BYO
  request must not switch providers or start WebLLM.
- Configure Ollama and use **Test connection**. The browser makes the request
  directly to the loopback endpoint; the hosted documentation server never
  reaches the visitor's localhost. Allow the preview or deployed site origin
  in Ollama's CORS configuration, then confirm a blocked origin produces a
  clear, recoverable error.
- Enter a temporary provider key, export the cookbook, and inspect the URL and
  planner snapshot. The key must appear in none of them and must be forgotten
  after a reload. Confirm the key is sent only to the configured provider
  origin.
- Fetch `/schemas/cookbook/v1.json`. Confirm a JSON content type and validate
  every built-in library cookbook against it.
- Inspect the assembled `build/plan/` and `build/schemas/` directories.
  Confirm the root `aws s3 sync build/ ... --delete` is the only mutable sync,
  so Planner assets and the schema cannot be deleted as out-of-band prefixes.

Record the exact planner and SMRT versions, preview URL, browser, Ollama
version/model, and pass/fail result for each item. Manual acceptance remains
pending until the owner records those results.
