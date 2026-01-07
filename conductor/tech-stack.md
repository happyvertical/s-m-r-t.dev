# Technology Stack

## Frontend Framework

- **Primary Framework:** SvelteKit (using `smrt-svelte` components).
- **Rationale:** Aligns perfectly with the project goal of showcasing `smrt-svelte` components and providing a high-performance, interactive documentation site.

## Styling & Design

- **Methodology:** Vanilla CSS Modules within a custom `smrt-svelte` theme.
- **Aesthetic:** Custom implementation of "Swiss Design" principles (grid-based, clean typography) to match the `s-m-r-t` brand without relying on generic utility frameworks like Tailwind.

## Content & Data Pipeline

- **Source of Truth:** Existing `s-m-r-t` repository (currently Docusaurus-based content).
- **Automation Strategy:** Custom CI/CD pipeline to fetch, parse, and transform existing documentation into the new site's format.
- **Goal:** Dramatically improve implementation and automate the sync between the core framework and this showcase site, replacing the manual Docusaurus workflow.

## Deployment & Infrastructure

- **Platform:** Vercel or Netlify (Standard for SvelteKit apps).
- **Database (if needed for examples):** SQLite (Dev) -> Postgres (Prod) abstraction layer, as per `s-m-r-t` principles.
