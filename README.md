[![Managed with npmctl](https://img.shields.io/badge/managed%20with-npmctl-2f6f4e.svg)](https://npmctl.com)

# groupsum.xyz

Evidence-backed product and portfolio website for [groupsum.xyz](https://groupsum.xyz),
with a Tigrbl REST API and durable SQLite catalog.

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

The backend in `backend/` uses Tigrbl REST tables and read-only bound operations over
SQLite. It stores normalized products, portfolio records, organizations, authors,
packages, repositories, implementation resources, releases, deployments, evidence,
limitations, claims, features, taxonomies, relationships, and timestamped metrics.
Languages and ecosystem classifications are intentionally separate.

```powershell
uv sync --project backend --locked
uv run --project backend python backend/scripts/migrate.py
uv run --project backend python backend/scripts/import_catalog.py
uv run --project backend python backend/scripts/export_openapi.py
uv run --project backend pytest backend/tests
uv run --project backend uvicorn groupsum_catalog_api.app:app --app-dir backend/src --reload
```

The default development database is `backend/data/groupsum-catalog.sqlite3`. Production
sets `GROUPSUM_DATABASE_PATH=/data/groupsum-catalog.sqlite3`, backed by the named Docker
volume `groupsum-xyz-catalog-data`. Schema changes are applied by numbered, idempotent
migrations before import. Create an online, integrity-checked backup with:

```powershell
uv run --project backend python backend/scripts/backup.py
```

The public contract is available at `/openapi.json`. Page-oriented endpoints under
`/api/v1/` return compact product, portfolio, solution, service, insight, and organization
models with strong ETags and shared-cache directives. Canonical Tigrbl tables are exposed
read-only; collection observations remain internal.

The catalog import is deterministic and idempotent. Reviewed records and explicit
attachments live in `catalog/content/`; collected public facts remain in
`catalog/generated/`. Attachments are joined onto their parent product or portfolio
record, so releases, deployments, packages, demos, examples, APIs, showcases, and other
resources appear as cohesive record sections rather than standalone card catalogs.

## Public catalog

The evidence-governed catalog pipeline is documented in [`catalog/README.md`](catalog/README.md). It collects public repositories (excluding organization `.github` repositories), complete default-branch commit histories, contributors, releases, deployments, manifests, registry packages and versions, verified language data, dependencies, and observed relationships for the configured Groupsum ecosystem owners. Release, deployment, and relationship evidence is aggregated onto its parent repository, package, or organization for the website. A scheduled workflow refreshes the snapshot and opens a pull request when tracked facts change.

## Deployment

This repo deploys as two self-hosted Docker services: `groupsum-catalog-api` and the
nginx-served `groupsum-xyz` frontend. nginx proxies `/api/` and `/openapi.json` to the API.
The deploy workflow persists SQLite in the named volume, runs migrations/import during
API startup, verifies rendered Peagen relationship markers, checks exact API attachment
counts, exercises conditional ETag requests, and confirms the deployed OpenAPI contract.

DNS is managed through the PyPI `npmctl-namecheap` provider for the `groupsum.xyz` zone
and is declared in `.npmctl/desired-state/production/dns.yaml`.
