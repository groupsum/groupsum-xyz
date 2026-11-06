# Compact document and data system

## Character

UNUI supplies compact, utility-first structure. Graveyard/Graveprint informs
restrained palette contrast and editorial rules. CDD informs inspectable dense
activity. Resource UIX informs typed identity and relationships. No copied assets,
horror decoration, hard shadows, or added administration/billing scope.

## Foundations

- Six complete palettes: Paper/Coal, Mist/Midnight, Parchment/Evergreen.
- `src/design/themes.css`: semantic colors, charts, states, focus, spacing, controls.
- `src/design/layout.css`: flat document sections and compact table geometry.
- `src/typography.css`: interface headings/controls, editorial display, code/numbers.
- Explicit saved theme wins; otherwise follow system light/dark, then Paper.
- Theme initialization runs before app boot. Disabled storage remains usable.
- Component colors consume semantic roles, not raw palette values.

## Surfaces and navigation

Detail identity is a header, not a card. Sections use headings and thin rules.
Metrics are an inline definition strip. Facts are unboxed definition lists.
Independent category destinations can use cards; ordinary section contents cannot.
Keep current canonical routes, API service boundaries, metadata and discovery.
Brand navigation remains `/`. Compact is the only density.

## Table cells

Keep one compact table row per record. Name/identity and primary actions remain.
Allow bounded name wrapping, then accessible truncation and progressive disclosure.
Secondary columns disappear by priority, with record detail available via its link.
Do not substitute a mobile card with a large collection of stacked fields.

Activity bars use actual observed daily commits, not invented zero-filled periods.
Historical lines require two observations. No data is not the same as zero.
Each chart opens a bounded inspector with a keyboard-operable observation slider
and an optional exact-data table. Tooltips supplement rather than replace it.
Contributors show at most two identities; `+N more` reveals selectable identities.
Contribution bars describe share of returned contribution counts, not 30-day work.

No normal page/table X-scrollbars. Shrink, wrap, truncate with full-text access,
iconize with accessible names, or omit secondary columns before overflowing.
Prefer one document Y-scrollbar. Contributor pickers may have a bounded list;
chart data grows naturally. Never hide unreachable interactive content.

## States and accessibility

Loading, errors, no observations, single observations, zero counts and filtered
empty results remain distinct. Do not fabricate activity or successful API data.
Use native links, selects and disclosures, visible focus, reduced-motion behavior,
tabular numbers and theme-aware status colors. Colors are never the only signal.
Public catalog browsing remains anonymous/read-only; no permission model changes.

## Verification

`npm run validate:typography` also tests all palette roles against canvas, surface
and raised backgrounds (4.5:1), action contrast, early theme initialization, and
flat document/table contracts. This gate runs in both `build` and `check`.

`npm run verify:design` requires Playwright (or `PLAYWRIGHT_MODULE`) and a browser.
Optional `BROWSER_EXECUTABLE` supplies a local Chromium executable.
`DESIGN_VERIFY_URL` selects the preview/deployment. `DESIGN_API_ORIGIN` uses native
HTTP to capture real API responses once per run when a preview proxy is unavailable.
This is test transport only, never a runtime fallback or generated-manifest source.

The browser matrix covers six themes, seven routes, 320/360/768/1280/1600 widths,
populated tables, resource categories, dependency detail, disclosure, keyboard
chart controls, theme persistence and 200% text. JSON evidence and screenshots go
to `.tmp/design-evidence` by default. Check rendered screenshots, not just assertions.

Build retains generated Schema.org/social metadata/discovery checks and chunk
budgets. Passing a bundle budget is not a field Core Web Vitals measurement.

## Delivery and rollback

Frontend-only change; no database migration. Run build, tests and browser matrix,
then deploy the committed source with the existing finalized API snapshot via
Wyrmctl. Wait for public workflow verification. Roll back by deploying the prior
verified source SHA with that same immutable snapshot; do not roll back data.
