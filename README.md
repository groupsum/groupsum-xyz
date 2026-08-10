[![Managed with npmctl](https://img.shields.io/badge/managed%20with-npmctl-2f6f4e.svg)](https://npmctl.com)

# groupsum.xyz

Evidence-backed product and portfolio website for [groupsum.xyz](https://groupsum.xyz),
with a Tigrbl REST API, PostgreSQL system of record, and DuckDB analytics store.

## Workspace

Runtime packages live under `pkgs/`:

- `pkgs/frontend`: React website, static rendering, and generated API client.
- `pkgs/backend`: Tigrbl tables, bound operations, import services, projections,
  OpenAPI export, migrations, and tests.
- `pkgs/catalog-pipeline`: collectors, normalization, validation, and display-safe
  catalog exports.
- `pkgs/site-content-pack`: generated editorial content package.

Deployment and repository validation utilities live under `ops/`. Authored source
modules are limited to 400 lines so table ownership, collection, projection, and UI
responsibilities remain explicit.

## Commands

- `npm ci`
- `npm run check`
- `npm run build`
- `npm run catalog:collect` (refresh the public ecosystem inventory)
- `npm run catalog:render` (compile display-safe website datasets)
- `npm run catalog:refresh` (collect, render, and validate)
- `npm run catalog:validate`
- `npm run catalog:test`
- `npm run docker:build`
- `npm run dns:plan` (uses PyPI `npmctl` plus `npmctl-namecheap`)
- `npm run proxy:plan` (uses PyPI `npmctl`)

The GitHub workflows install `npmctl` and `npmctl-namecheap` from PyPI, then use `npmctl validate`, `npmctl plan`, and `npmctl apply` against `.npmctl/desired-state/production/`.

## Backend

The backend in `pkgs/backend/` uses Tigrbl REST tables and table-bound operations over
PostgreSQL in production and SQLite for lightweight local development. DuckDB stores
aggregated metric series. It stores normalized products, portfolio records, organizations, authors,
packages, repositories, implementation resources, releases, deployments, evidence,
limitations, claims, features, taxonomies, relationships, and timestamped metrics.
Languages and ecosystem classifications are intentionally separate.

```powershell
uv sync --project pkgs/backend --locked
uv run --project pkgs/backend python pkgs/backend/scripts/migrate.py
uv run --project pkgs/backend python pkgs/backend/scripts/publish_catalog.py --dry-run
uv run --project pkgs/backend python pkgs/backend/scripts/export_openapi.py
uv run --project pkgs/backend python pkgs/backend/scripts/export_static_api.py
uv run --project pkgs/backend pytest pkgs/backend/tests
uv run --project pkgs/backend tigrcorn groupsum_catalog_api.app:app --app-dir pkgs/backend/src --reload
```

The default development database is `pkgs/backend/data/groupsum-catalog.sqlite3`.
Production sets `GROUPSUM_DATABASE_URL` for PostgreSQL, a bearer token in
`GROUPSUM_CATALOG_INTERNAL_TOKEN`, and a terse
`GROUPSUM_ANALYTICS_DSN` such as `quack://groupsum-duckdb:9494` for the DuckDB
metric store. The scheduled catalog workflow creates entity and fact records through
`POST /internal/v1/catalog/*`, then finalizes them with
`POST /internal/v1/catalog/snapshots`. The snapshot endpoint never ingests a bundle,
and metric observations are append-only. Create an online, integrity-checked backup with:

```powershell
uv run --project pkgs/backend python pkgs/backend/scripts/backup.py
```

The public contract is available at `/openapi.json`. Page-oriented endpoints under
`/api/v1/` return compact product, portfolio, solution, service, insight, and organization
models with strong ETags and shared-cache directives. Canonical Tigrbl tables are exposed
read-only; collection observations remain internal.

Database import and public reads enter through owning Tigrbl table handlers; REST routes
invoke the same bound operations. Static builds are exported by exercising the in-process
API, rather than reading database rows through a parallel page-model implementation.

The catalog import is deterministic and idempotent. Reviewed records and explicit
attachments live in `catalog/content/`; collected public facts remain in
`catalog/generated/`. Attachments are joined onto their parent product or portfolio
record, so releases, deployments, packages, demos, examples, APIs, showcases, and other
resources appear as cohesive record sections rather than standalone card catalogs.

## Public catalog

The evidence-governed catalog pipeline is documented in [`catalog/README.md`](catalog/README.md). It collects public repositories (excluding organization `.github` repositories), complete default-branch commit histories, contributors, releases, deployments, manifests, registry packages and versions, verified language data, dependencies, and observed relationships for the configured Groupsum ecosystem owners. Release, deployment, and relationship evidence is aggregated onto its parent repository, package, or organization for the website. A scheduled workflow refreshes the snapshot and opens a pull request when tracked facts change.

## Deployment

This repo deploys PostgreSQL and a DuckDB Quack service as the database tier,
followed by `groupsum-catalog-api` and the nginx-served `groupsum-xyz` frontend.
The API reaches DuckDB only through the named `tigrbl-engine-duckdb` engine;
nginx proxies `/api/` and `/openapi.json` to the API.
The deploy workflow persists both data services, runs migrations/import during
API startup, verifies rendered Peagen relationship markers, checks exact API attachment
counts, exercises conditional ETag requests, and confirms the deployed OpenAPI contract.

DNS is managed through the PyPI `npmctl-namecheap` provider for the `groupsum.xyz` zone
and is declared in `.npmctl/desired-state/production/dns.yaml`.
