# GroupSum Catalog Collection and Member Pages

## Frontend UIX implementation brief

**Status:** implementation-ready design brief
**Audience:** frontend UIX engineer, design-system steward, data/API owner, and accessibility reviewer
**Site:** `https://groupsum.xyz`
**Prepared:** August 3, 2026

## 1. Assignment

Refine the catalog experience so visitors can scan a collection, recognize meaningful differences, and traverse from a product or portfolio record into its repositories, packages, resources, releases, evidence, and sources without losing ownership context.

The primary design problem is not missing data. It is that too much heterogeneous data is rendered through the same key/value row treatment. The new experience must choose a visual form based on what the data means:

- headers for identity and hierarchy;
- icons plus values for compact facts;
- count strips for bounded summaries;
- sparklines and trendlines for time-series metrics;
- bar sparklines for commit activity;
- tables for comparable records;
- row-cards for narrative collection members;
- badges or pills for categorical state;
- timelines for ordered release or observation events;
- concise evidence callouts for provenance and limitations.

Do not turn every section into a card grid or a dashboard. Visual variety must improve comprehension, not decorate the page.

## 2. Outcome

A visitor should be able to answer these questions quickly:

1. What kind of record am I viewing?
2. Who owns it?
3. What collection or parent resource contains it?
4. What are its most important current facts?
5. Which metrics belong to this exact resource?
6. What child resources can I inspect next?
7. What evidence supports the displayed claims?
8. What is unknown, unavailable, stale, or explicitly limited?

The catalog remains a supporting evidence explorer. Products and Portfolio remain the primary public evaluation surfaces.

## 3. Terminology and ownership contract

### Collection page

A page that helps a visitor browse, filter, compare, and choose members of one coherent type, such as products, repositories, packages, or typed resources.

### Member page

The canonical detail page for one entity in a collection. The phrase "member page" is a design term, not a new backend entity type.

### Ownership hierarchy

Render and navigate the following hierarchy explicitly:

`organization -> product or portfolio record -> repository -> package or typed resource -> release/evidence event`

Parallel editorial views such as Solutions and Services may relate to the same entities, but they do not replace or duplicate canonical resource ownership.

Hard rules:

- Repository metrics belong to repositories.
- Commit activity belongs to repositories.
- SSOT governance belongs to repositories.
- Dependencies and dependents belong to packages and are grouped by package.
- Registry releases belong to packages.
- GitHub releases belong to repositories.
- A website, API, demo, example, showcase, UI, or documentation record is a typed resource. Its source repository is a relationship, not its public identity.
- Product and portfolio pages may summarize attached evidence, but must label the owning repository or package beside every metric or event.
- General programming languages and markup languages remain separate from categorical technology tags and product ecosystems.

## 4. Primary users and jobs

| User | Job | Needs first | Likely next action |
| --- | --- | --- | --- |
| Technical evaluator | Understand what exists and how it fits together | Type, owner, maturity, source, implementation map | Open a repository, package, API, demo, or docs record |
| Product or engineering leader | Evaluate a product or portfolio item | Purpose, audience, evidence scope, limitations | Compare implementation resources or discuss work |
| Developer | Find an installable or runnable resource | Package ecosystem, version, license, repository, dependencies | Open registry, source, documentation, or example |
| Maintainer | Inspect current public state | Freshness, repository metrics, releases, governance evidence | Open canonical source or registry |
| Researcher | Compare the public ecosystem | Stable filters, counts, comparable columns, provenance | Traverse related records or download datasets |

## 5. Experience principles

1. **Identity before metrics.** A page must establish record type, owner, parent, and purpose before showing activity.
2. **One owner per metric.** Never show an unlabelled total composed from different repositories or packages.
3. **Comparison uses columns.** Use tables or aligned row-cards when people need to compare members.
4. **Time uses a time visual.** Use sparklines, bar sparklines, or timelines only when timestamps and a real series exist.
5. **State uses text plus shape.** Use labelled badges for maturity, publication, evidence, governance, freshness, and resource type; never color alone.
6. **Counts are not quality scores.** Stars, commits, tests, claims, and releases are observations, not maturity or quality grades.
7. **Unknown is a valid state.** Prefer “Not observed” or “Not reported by this source” to zero when the collector cannot prove zero.
8. **Progressive density.** Collection pages scan quickly; member pages disclose depth by section without dumping raw payloads.
9. **Canonical traversal.** Every collection row and relationship target uses a real canonical link. Back-navigation returns to the relevant filtered collection when possible.
10. **Evidence remains inspectable.** Every reviewed or observed statement keeps a visible source and timestamp without allowing provenance to dominate the main narrative.

## 6. Information architecture

### Primary evaluation collections

- `/products/`
- `/portfolio/`

These lead with reviewed purpose, audience, maturity, and capability. Implementation evidence enriches each member but does not redefine it.

### Supporting public catalog

- `/catalog/` — catalog overview and collection selector
- `/catalog/repositories/`
- `/catalog/packages/`
- `/catalog/resources/`

The existing dataset selector may remain during migration, but the target state gives each collection a stable route, unique metadata, and shareable filter state.

### Canonical member routes

- `/products/records/{slug}/`
- `/portfolio/records/{slug}/`
- `/catalog/repositories/{owner}/{repository}/`
- `/catalog/packages/{ecosystem}/{route-key}/`
- `/catalog/resources/{resource-type}/{route-key}/`
- `/catalog/releases/{route-key}/` when a direct release record is necessary

Do not create primary collection pages for technologies, releases, deployments, relationships, or SSOT artifacts. Technology stack tags belong on package records. Aggregate releases and deployments within the member that owns them; relationships remain navigation semantics, never a headline metric.

## 7. Shared collection-page layout

### A. Collection header

Use a strong editorial header, not a generic page title followed immediately by controls.

Required elements:

- breadcrumb or parent link;
- collection icon and eyebrow;
- one `h1`;
- 1–2 sentence purpose statement;
- observation or review timestamp;
- optional source/download actions placed after the primary introduction.

Below the introduction, show a compact **collection summary band** with 3–5 facts. Examples:

- total members;
- represented organizations;
- published packages;
- SSOT-governed repositories;
- members updated in the current observation window.

Each fact uses a short label, a large value, and an optional icon. It is not a clickable card unless it changes the active filter.

### B. Filter and search bar

Use one cohesive toolbar with persistent labels or accessible names:

- search;
- type or ecosystem;
- organization/owner;
- maturity or publication state where applicable;
- evidence/freshness state;
- sort;
- density control only if both modes are fully supported.

Active filters render as removable pills below the toolbar. Include a single “Clear all” action. Encode filters and sort in the URL so reload, back, and sharing remain predictable.

Do not search by serializing the entire raw record. Build a deliberate searchable projection of names, summaries, owners, ecosystems, package technology-stack tags, resource types, and aliases.

### C. Results header

Show:

- matching count;
- current sort;
- pagination or result range;
- last refreshed timestamp when it differs from page generation time.

Do not repeat the full collection summary here.

### D. Results presentation

Use one of two patterns based on the member type.

#### Narrative row-card

Use for Products, Portfolio, and typed resources whose purpose and relationship matter more than numeric comparison.

Structure:

- leading type icon;
- name and one-sentence summary;
- owner/parent path;
- 2–4 state pills;
- compact evidence counts;
- one clear trailing action or chevron;
- whole row is a real anchor without nested-link conflicts.

#### Comparison table

Use for Repositories and Packages.

Repository columns:

- repository;
- organization;
- role/type;
- stars with sparkline;
- forks;
- contributors;
- commits with 30-day bar sparkline;
- packages;
- latest release;
- governance badge;
- observed time.

Package columns:

- package;
- ecosystem;
- owning repository and manifest path;
- package kind/publication state;
- latest version;
- releases;
- dependency count;
- observed dependents;
- license;
- observed time.

Column headers support accessible sorting where the data is complete enough to sort. Prefer wrapping row-cards over rigid wide tables: fields flex to a second row at constrained widths and never require local horizontal or vertical scrolling.

### E. Narrow-layout row-cards

At content pressure below the usable table width, each table row reflows into a structured row-card:

- identity header;
- two-column fact grid;
- inline microchart;
- wrapped pills;
- one full-width record link.

Do not hide ownership, license, publication, freshness, or evidence state merely to shorten mobile rows.

### F. Pagination and empty states

- Keep current filters while paging.
- Return focus to the results heading after pagination when navigation is client-enhanced.
- Empty state names the active constraints and offers one reset action.
- Error state preserves server-rendered or last-known results when available.
- No full-page spinner on an indexable route.

## 8. Shared member-page shell

### A. Identity header

The member header establishes context before detail:

- breadcrumb ownership path;
- type icon and explicit record-type label;
- name;
- reviewed or source-derived summary;
- owner and parent resource;
- maturity/publication/evidence/freshness pills;
- primary source action;
- one context-appropriate secondary action.

Do not place a wall of metadata beside the title. The header may include a restrained count strip of up to five resource-owned metrics.

### B. Ownership and relationship context

Immediately below the header, render a compact ownership strip:

`Organization / Product / Repository / Current member`

Each available ancestor is a canonical link. Related but non-owning entities appear in a separate “Connected resources” section with labelled relationship types.

### C. Section navigation

Use sticky, flex-wrapped local navigation only when the page contains at least four substantive sections. Anchor labels are specific to the record type. Navigation wraps to another row instead of scrolling and must not obscure focus or anchor targets.

### D. Page body

On wide layouts, use a 12-column content grid:

- 8–9 columns for primary content;
- 3–4 columns for a compact context rail containing identity, freshness, evidence boundary, and external links.

On narrow layouts, the rail moves below the header and before deep detail. DOM order remains logical without CSS-only semantic reordering.

## 9. Type-specific member layouts

### Product and portfolio records

Lead with reviewed purpose and capability, then show implementation evidence.

Recommended order:

1. purpose, audience, maturity, ecosystem, and reviewed capabilities;
2. related product/portfolio/solution context;
3. repository implementation table grouped by attachment role;
4. packages grouped under their repository and ecosystem;
5. typed resources grouped as APIs, demos, examples, showcases, documentation, UIs, and websites;
6. releases grouped by owning repository or package;
7. dependencies and dependents grouped by package;
8. evidence and limitations;
9. repository-grouped SSOT governance.

Do not show product-wide repository metrics or package dependency totals. If a product contains multiple repositories, each repository row owns its metrics and microcharts.

### Repository member

Recommended sections:

1. **Activity header:** stars, forks, watchers, contributors, commits, and observation timestamp.
2. **Trend band:** star/fork/contributor trendlines and commit bar sparkline, each labelled with period and data-point count.
3. **Contained packages:** comparison table with manifest path, kind, publication, version, releases, dependencies, package-owned license summary, notices count, and record link.
4. **Typed resources:** row-cards for websites, docs, APIs, demos, examples, showcases, and UIs sourced by the repository.
5. **Releases:** latest release callout plus compact chronological table.
6. **SSOT governance:** repository badge, canonical registry link, inventory count grid, claim/evidence linkage summary, and explicit limitation.
7. **Package tech stack:** show categorical technology and language tags only on package records. Do not promote technology to a catalog headline, collection, or cross-record grouping.
8. **Repository legal context:** show only the repository's top-level license and top-level notice links inside the repository overview. Never render package license files as a repository-wide legal list.

### Package member

Recommended sections:

1. package identity, ecosystem icon, package kind, publication badge, latest version, registry/source actions;
2. owning repository callout with exact manifest path;
3. release/download trend when historical observations exist;
4. dependencies table grouped by scope;
5. dependents table with explicit coverage limitation;
6. release timeline or table;
7. package-owned license and notices inside the package overview, including direct versus inherited evidence;
8. related documentation, examples, demos, APIs, and products.

Dependencies are rows, not pills. Use pills only for scope, internal/external classification, completeness, and ecosystem.

### Typed resource member

The resource type determines its detail modules:

| Resource type | Primary modules |
| --- | --- |
| Website | destination, reachability evidence, source repository, deployment/source boundary, related product |
| Documentation | document path/site, subject, parent repository/package, freshness, source |
| API | contract type/version, endpoints only when verified, authentication boundary, docs, source |
| Demo | purpose, launch/source action, requirements, related product/package, limitations |
| Example | scenario, language/ecosystem, source path, related package/API, prerequisites |
| Showcase | demonstrated capability, evidence source, related implementation, claim boundary |
| UI/GUI | interface purpose, supported flows, deployment/source status, related API/service |

Use a common shell, but do not render unavailable modules as empty generic sections.

### Release member

Treat a direct release route as a child page. The header must name and link the owning package or repository. Show version, channel, publication time, prerelease/draft state, downloads when reported, license inheritance/evidence, and source. Do not build a standalone release-card gallery.

## 10. Visualization grammar

| Data | Preferred visualization | Required context | Do not use |
| --- | --- | --- | --- |
| Stars, forks, watchers, contributors | current value + thin sparkline | owner, period, data-point count, observed time | inferred growth percentage from one point |
| Commits | 30-day vertical bar sparkline | repository name, total in window, accessible daily values | product-level merged series |
| Releases over time | compact timeline or monthly bars | owning package/repository and release kind | mixed unlabelled registry totals |
| Downloads or hits | value + trendline when a real series exists | source, period, completeness | zero when source does not report data |
| Language composition | proportional stacked bar + legend | byte basis and observation time | language as product ecosystem |
| Dependency scopes | grouped table + count header | package owner, scope, internal/external | network graph as default view |
| Dependents | table + coverage callout | source coverage and completeness | “all dependents” claim without authority |
| SSOT inventory | icon count grid | repository, canonical registry, observation time | product governance score |
| Claim/evidence linkage | labelled numerator/denominator bar | declared registry linkage and limitation | compliance or quality grade |
| Maturity/publication/evidence | text badge/pill | legend or immediately understandable label | color-only state |
| Freshness | timestamp + freshness pill | source timestamp and refresh state | animated “live” indicator without live data |

Microcharts must expose a textual equivalent through accessible names, summaries, or a nearby data table. Tooltips may add precision but cannot be the only way to obtain values.

## 11. Visual direction

Preserve the current warm editorial design system and soft-border rule. The catalog should feel like a well-edited technical field guide, not an admin console.

### Hierarchy

- Serif display type for page and section identity.
- Humanist sans for prose, tables, filters, and values.
- Monospace reserved for identifiers, versions, paths, and compact labels.
- Large numeric values use tabular numerals.
- Icons are restrained, consistent, and always paired with text when meaning is not universal.

### Density

- Collection tables are compact but not cramped: 48–64 px minimum desktop row height depending on summary content.
- Member sections alternate open editorial space with denser evidence tables.
- Use surface color, spacing, and alignment before adding borders.
- Use pills for categories and states, not every short string.
- Avoid nested cards, card-within-card layouts, and four-column walls of equal boxes.

### Color

- Accent identifies links, active filters, and selected states.
- Signal color may mark freshness or attention, but not errors.
- Semantic success/warning/error colors require text labels and accessible contrast.
- Sparkline series use a small stable palette and remain distinguishable in grayscale and forced-colors mode.

### Motion

- Animate only filter disclosure, row expansion, and chart updates caused by user actions.
- Duration target: 140–220 ms.
- Do not animate initial metric counts from zero.
- Disable nonessential transitions under `prefers-reduced-motion`.

## 12. Component inventory

### Reuse and refine

- global site header/footer;
- page container and editorial typography;
- `RepositorySignalStrip` chart semantics;
- evidence/freshness labels;
- entity ownership and relationship data contracts;
- existing filter pills and route navigation.

### Extend

| Component | Required extension |
| --- | --- |
| `RecordCollectionPage` | collection header, summary band, URL-backed filters, result range, table/row-card composition |
| `RecordCollectionRow` | full anchor semantics, icon, parent path, state pills, selected owned metrics |
| `RepositorySummary` | aligned metrics, trend band, package/resource counts, governance state |
| `PackageList` | comparison table, repository grouping, dependency/release counts, license state |
| `RelatedResourceGroups` | typed icons, row-cards, resource-specific secondary facts |
| `GovernanceClaims` | repository grouping, count grid, claim/evidence coverage, provenance boundary |
| `FreshnessNotice` | current, stale, refresh unavailable, and not observed states |

### New primitives

- `CollectionHeader`
- `CollectionSummaryBand`
- `FilterToolbar`
- `ActiveFilterList`
- `ResponsiveDataTable`
- `MemberRowCard`
- `RecordIdentityHeader`
- `OwnershipPath`
- `MetricValue`
- `MetricSparkline`
- `CommitBarSparkline`
- `MetricTrendBand`
- `CountGrid`
- `ReleaseTimeline`
- `LanguageCompositionBar`
- `EvidenceBoundaryCallout`
- `EmptySectionState`

Charts must consume typed presentation models. Components must not derive time series or ownership by inspecting raw payloads.

## 13. Data and API requirements

Frontend page models should provide display-ready fields:

- stable IDs and canonical routes;
- explicit entity type, owner, parent, and relationship role;
- selected current metrics plus named time series;
- period, source, observation time, and completeness for every series;
- precomputed count summaries;
- typed badges/states;
- grouped child members;
- evidence URLs and limitations;
- license and notice evidence.

Do not load the full normalized catalog into the React bundle. Collection pages use compact collection projections. Member pages fetch only their composed page model and conditionally refresh it with ETags.

If a trend contains fewer than two observations, show a value and “1 persisted observation”; do not draw a misleading flat line.

## 14. State matrix

| Surface | Required states |
| --- | --- |
| Collection | server-rendered/populated, refreshing, filtered, empty, page error, stale retained data |
| Filter toolbar | default, active, disabled due to unavailable dimension, keyboard focus, narrow disclosure open/closed |
| Metric | observed value, unknown, unavailable source, stale, single observation, multi-point trend |
| Microchart | complete series, partial series, no series, reduced motion, forced colors |
| Member page | server-rendered, conditional refresh, missing, API unavailable with retained page model |
| Relationship | canonical internal target, external source only, missing target, unavailable target |
| Package | published, manifest-private, workspace project, candidate, registry unavailable |
| Evidence | reviewed, observed, not observed, unavailable, stale |
| SSOT governance | governed repository, registry absent, registry invalid/unavailable, partial linkage |

Loading must preserve stable page geometry. Do not replace an entire member page with a spinner during conditional refresh.

## 15. Responsive behavior

Breakpoints follow content pressure; verify these minimum bands:

### Narrow: 320–639 px

- one-column header and content;
- summary band uses two columns at most;
- filters collapse behind a labelled disclosure while search remains visible;
- result tables become structured row-cards;
- local section navigation wraps to additional rows without clipping;
- charts retain at least a 120 px plotting width or fall back to textual summaries;
- identifiers, versions, and paths wrap without horizontal page scroll;
- controls meet 44 × 44 CSS px touch targets where practical.

### Medium: 640–1023 px

- filters wrap in a persistent toolbar;
- row-cards may use identity plus facts columns;
- repository/package tables reflow into labelled row-cards and do not create local scroll regions;
- member context rail appears above primary content unless adequate width exists.

### Wide: 1024 px and above

- aligned comparison tables are preferred for repositories and packages;
- member pages may use the 8/4 or 9/3 content/rail split;
- sticky table headers and local navigation are allowed after overlap/focus testing;
- prose remains below roughly 80 characters per line.

At 200% and 400% zoom, content order and ownership context must remain intact.

## 16. Accessibility requirements

- Meet WCAG 2.2 AA.
- Use one `h1`, logical headings, landmarks, real tables for tabular comparison, lists for lists, links for navigation, and buttons only for in-page actions.
- Every collection member is keyboard reachable with a visible focus state.
- Sort controls announce column and direction.
- Active filters expose selected state and removable labels.
- Microcharts provide accessible names containing owner, metric, period, and summary; precise values remain available without hover.
- Table captions or nearby headings name the member type and scope.
- Color is never the sole carrier of trend, state, maturity, evidence, or governance.
- Support forced-colors mode; chart strokes and badges must remain legible.
- Respect reduced motion.
- After client-side pagination or filtering, announce result-count changes politely without moving focus unexpectedly.
- Reflowed row-card regions preserve semantic labels and logical keyboard order.

## 17. Performance, caching, and discovery

- Preserve the existing perfect-score Lighthouse goal in the pinned environment.
- Do not introduce a general charting library for sparklines or count grids; use lightweight SVG/CSS primitives unless a measured requirement justifies otherwise.
- Render initial collection/member content in HTML.
- Keep collection projections compact and paginate before rendering large datasets.
- Lazy-load below-the-fold historical series only when the page model does not already contain a compact window.
- Hashed assets remain immutable; HTML and page models remain revalidatable.
- Conditional API requests use ETags and retain current content on `304` or refresh failure.
- Every stable collection and member route has unique title, description, canonical, Open Graph, and Twitter metadata.
- Breadcrumb structured data mirrors the visible ownership hierarchy.
- Software, package, service, article, and generic resource schemas are used only when the record type supports them accurately.
- Sitemap and discovery files include canonical collections and member pages from the same page models.

## 18. Implementation sequence

1. Inventory all current collection and member page variants and capture representative wide/narrow screenshots.
2. Define typed presentation models for identity, ownership, metric snapshots, series, counts, states, and child groups.
3. Build the shared identity header, ownership path, count band, filter toolbar, responsive table, row-card, and microchart primitives.
4. Refine Products and Portfolio collections first; retain their editorial priority.
5. Implement Repository collection and member pages as the reference evidence pattern.
6. Implement Package collection and member pages with grouped dependencies, dependents, releases, license, and parent navigation.
7. Implement typed Resource member variants and collection filters.
8. Refine package-only technology-stack tags without promoting them into catalog navigation.
9. Apply repository-grouped SSOT governance and evidence boundary callouts.
10. Add responsive, keyboard, forced-colors, reduced-motion, empty/error, and stale-data tests.
11. Validate static metadata, structured data, bundle budgets, Lighthouse, ETags, and deployed visible markers.

## 19. Reference records for verification

Use real high-pressure records rather than placeholder fixtures:

- **Peagen product:** multiple repository roles, five packages, package-grouped dependencies, documentation and website resources, and explicit limitations.
- **Swarmauri SDK repository:** large commit/release history and many contained packages.
- **Tigrbl product/repositories:** multiple release ecosystems and repository-scoped SSOT governance.
- **Portwyrm repository/package:** repository-owned GHCR package relationship.
- **A package with no public registry publication:** validates private/candidate treatment.
- **A typed documentation, API, example, demo, and website resource:** validates resource-specific member modules.

## 20. Verification matrix

At minimum verify:

- collection and member pages at 320, 768, 1024, and 1440 CSS px;
- keyboard-only traversal from collection row to member, parent, child package/resource, and back;
- no horizontal page overflow or local x/y scroll region at 320 px;
- sortable table semantics and responsive row-card equivalence;
- screen-reader output for ownership paths, metric summaries, sparklines, and commit bars;
- reduced-motion and forced-colors rendering;
- correct unknown versus zero behavior;
- repository metrics never presented as product attributes;
- dependencies/dependents always grouped under packages;
- SSOT governance always grouped under repositories;
- repository pages link to every contained package;
- package/resource pages link to their owning repository and related product when present;
- repository top-level legal context in its overview, package-owned legal context in each contained-package row, and detailed license/notice evidence inside package, release, and resource overviews;
- loading, stale, unavailable, empty, and missing states;
- `npm run check` and `npm run build`;
- pinned Lighthouse and bundle budgets;
- deployed page markers, canonical URLs, structured data, and ETag behavior.

## 21. Acceptance criteria

The refinement is complete only when:

1. Collection pages communicate identity, scale, controls, and comparable member differences without relying on repetitive key/value rows.
2. Every member page clearly distinguishes organization, product, repository, package, and typed-resource metadata.
3. Repository and package collections use aligned comparison patterns on wide layouts and equivalent row-cards under narrow content pressure.
4. Time-series metrics use honest, accessible sparklines/trendlines; commits use bars; single observations do not masquerade as trends.
5. Product/portfolio pages retain editorial purpose while implementation evidence remains grouped by its actual owner.
6. Repository pages provide direct navigation to all contained packages and typed resources.
7. Package pages group dependencies, dependents, releases, downloads, license, and notices under that package.
8. Repository pages never flatten package license files into a repository-wide license list.
9. SSOT governance appears only at repository scope, with source and limitation.
10. Raw payloads, generic relationship grids, release grids, and deployment grids are absent from public member pages.
11. Keyboard, screen-reader, zoom, forced-colors, reduced-motion, responsive, performance, caching, and discovery gates pass with recorded evidence.

## 22. Explicit non-goals

- Do not redesign the global GroupSum brand or primary navigation.
- Do not create an admin CRUD interface.
- Do not add speculative metrics, inferred maturity, or generated marketing claims.
- Do not build default force-directed relationship graphs.
- Do not merge repositories and packages into one entity type.
- Do not create standalone collection grids for releases, deployments, relationships, or SSOT artifacts.
- Do not replace the Tigrbl composed page-model contract with frontend joins across raw REST tables.

## 23. Decisions for implementation kickoff

These decisions should be resolved during the first design review:

- Whether each supporting catalog dataset receives a dedicated collection route immediately or through staged migration from the current selector.
- Which columns remain visible by default for repository and package comparison at medium widths.
- Whether historical metric windows standardize on 30, 90, or 365 days when the backend has sufficient observations.
- Whether a compact/comfortable density preference is warranted after testing real records.
- Which resource types have enough structured data for specialized modules at launch.
- Whether filter state is encoded through query parameters only or additionally supports named shareable views.

Until resolved, default to one comfortable density, 30-day microcharts, query-parameter filter state, and progressive enhancement over stable server-rendered content.
