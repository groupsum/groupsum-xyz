# Public ecosystem catalog

This directory contains the reproducible public catalog used by groupsum.xyz.
It inventories the configured Groupsum, Tigrbl, Swarmauri, and BucketWarden
organizations from primary APIs and repository manifests.

## Commands

- `npm run catalog:collect` refreshes every configured public organization,
  repository, default-branch commit, contributor, GitHub release, deployment,
  environment, manifest, registry package, technology, surface, and observed
  relationship.
- `npm run catalog:validate` checks freshness, uniqueness, visibility,
  itemized commit counts, evidence labels, publication links, and relationship
  integrity.
- `npm run catalog:test` runs the parser and validation unit tests.
- `npm run catalog:render` compiles display-safe datasets and bounded frontend summaries.
- `npm run catalog:refresh` runs collection, rendering, and validation as one explicit pipeline.
- `python scripts/catalog_collect.py --discover-downstream` additionally runs
  bounded, rate-limited GitHub public code searches for package-manifest
  references. Results are labeled as observed matches, not a complete census.

Collection requires Python 3.11 or newer. Authenticated GitHub requests use
`GITHUB_TOKEN`, `GH_TOKEN`, or the token returned by `gh auth token`; token
values are never written to output or cache. PyPI, npm, and crates.io are
queried directly. Cached HTTP response bodies live in `.catalog-cache/` and
are not committed.

## Outputs

- `generated/catalog.json` is the detailed normalized catalog.
- `generated/summary.json` contains display-safe aggregate counts.
- `generated/site/*.json` contains lazy-loaded repositories, packages, releases,
  deployments, technologies, surfaces, relationships, and a hashed manifest.
- `../src/data/catalog.generated.ts` contains bounded summary, organization,
  featured-repository, technology, and dataset-manifest records for initial rendering.

Reviewed names, descriptions, grouping, and claim boundaries may be supplied in
`content/editorial.json`. Source-derived descriptions remain labeled as such,
and missing editorial review never becomes an inferred maturity or availability
claim. The scheduled workflow collects, renders, validates, builds, and opens or
updates a refresh pull request.

Every snapshot includes a `completeness` object. “All” means every record
returned by the named primary API within the configured public scope. It does
not mean that absence from an API proves nonexistence. In particular, npm and
PyPI do not provide a complete authoritative public dependents API. Crates.io
reverse dependencies are recorded where available, and optional GitHub code
search remains disabled by default because it is bounded and rate-limited.

GitHub’s `watchers_count` is an alias for stars. This catalog records stars
from `stargazers_count` and actual watchers from `subscribers_count`.

Repository paths are classified as apps, APIs, services, UIs, deployments,
websites, demos, examples, showcases, and docs. These are source-level
surfaces; they are not treated as proof of a reachable deployment. GitHub
deployment records and environment URLs are stored separately.
