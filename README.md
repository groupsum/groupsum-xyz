# groupsum.xyz

Standalone MdWrk lander repository for [groupsum.xyz](https://groupsum.xyz).

## Commands

- `npmctl install`
- `npmctl check`
- `npmctl build`
- `npmctl docker:build`
- `npmctl dns:plan`
- `npmctl deploy:dry-run`

The local npm scripts mirror those npmctl lifecycle commands for CI and Docker workers.

## Deployment

This repo deploys as the `groupsum-xyz` self-hosted Docker service. DNS is managed through Namecheap for the `groupsum.xyz` zone and is declared in `site.manifest.json`.
