[![Managed with npmctl](https://img.shields.io/badge/managed%20with-npmctl-2f6f4e.svg)](https://npmctl.com)

# groupsum.xyz

Standalone MdWrk lander repository for [groupsum.xyz](https://groupsum.xyz).

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

## Public catalog

The evidence-governed catalog pipeline is documented in [`catalog/README.md`](catalog/README.md). It collects public repositories (excluding organization `.github` repositories), complete default-branch commit histories, contributors, releases, deployments, manifests, registry packages and versions, verified language data, dependencies, and observed relationships for the configured Groupsum ecosystem owners. Release, deployment, and relationship evidence is aggregated onto its parent repository, package, or organization for the website. A scheduled workflow refreshes the snapshot and opens a pull request when tracked facts change.

## Deployment

This repo deploys as the `groupsum-xyz` self-hosted Docker service. DNS is managed through the PyPI `npmctl-namecheap` provider for the `groupsum.xyz` zone and is declared in `.npmctl/desired-state/production/dns.yaml`.
