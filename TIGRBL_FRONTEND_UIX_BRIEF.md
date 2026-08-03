# Groupsum.xyz Tigrbl Frontend UIX Brief

## Outcome

Build a fast, evidence-led website that helps a visitor understand a Groupsum, Tigrbl, or Swarmauri product first, then inspect the public implementation evidence that supports it. The catalog is a backend capability; it must strengthen product and portfolio pages rather than become a second, disconnected website.

The frontend consumes the Tigrbl REST API at `/api/v1`. Every indexable route ships meaningful HTML, then progressively enhances filters, navigation, and conditional API refreshes. A failed API refresh must not erase the last successfully rendered page model.

## Experience principles

- Lead with the product: purpose, audience, maturity, capabilities, and related products.
- Aggregate implementation evidence on its parent product or portfolio record.
- Use compact rows, grouped sections, and definition lists. Do not expose raw payloads or turn releases, deployments, relationships, or evidence into generic card grids.
- Distinguish observed facts, reviewed editorial statements, and unknown state.
- Never infer production availability, maintenance, certification, adoption, or quality from source presence.
- Keep ecosystems distinct from programming languages. Ecosystems describe product/platform families; languages describe implementation media; technologies are categorical tags.
- Make every collection row and portfolio summary visibly and semantically clickable.

## Information architecture

Primary navigation remains:

1. Products
2. Portfolio
3. Solutions
4. Services
5. Insights
6. About
7. Contact

The public catalog may remain available as a secondary evidence explorer, but it must not compete with Products or Portfolio in primary navigation.

### Product collection

Route: `/products/`

Purpose: help visitors choose a product family or product record.

Required content:

- One clear page title and product-oriented introduction.
- Counts for reviewed products, represented organizations, and attached implementation evidence.
- Search and filters for organization, record type, maturity, audience, ecosystem, and technology.
- A row for each product with title, type, maturity, organization, summary, audience, selected technology tags, and evidence counts.
- Entire row is a real anchor with a visible focus state and descriptive accessible name.
- Empty filter state explains which filters are active and offers a single reset action.

API: `GET /api/v1/products`.

### Product record

Route: `/products/records/{slug}/`

Order:

1. Product identity: name, organization, reviewed summary, maturity, primary action.
2. Product profile: audience, record type, ecosystem, technologies, language breakdown, last reviewed time.
3. Purpose and capabilities.
4. Related products and portfolio work.
5. Public implementation evidence, grouped by repository role.
6. Packages, grouped by registry/ecosystem with version and publication evidence.
7. Demos, examples, showcases, APIs, documentation, UIs, and websites, grouped by resource type.
8. Features and SSOT governance claims with evidence state.
9. Evidence and limitations.

Releases, deployments, repository relationships, metrics, downloads, and traffic are summaries or timelines inside their parent repository/package/product section. They are not separate card collections.

Each evidence section has four states:

- `observed`: show source link and observation timestamp.
- `reviewed`: show reviewer boundary and review timestamp.
- `not observed`: say that the current collectors did not observe it.
- `unavailable`: explain that the evidence service could not be refreshed while retaining server-rendered data.

API: `GET /api/v1/products/{slug}`.

### Portfolio collection and record

Routes: `/portfolio/` and `/portfolio/{slug}/`.

Portfolio focuses on implemented work and delivery evidence. It uses the same record primitives as Products, but gives greater prominence to problem, contribution, implementation scope, constraints, and related product. All portfolio rows are anchors. A portfolio record may relate to multiple products through explicit `record_relations`.

APIs: `GET /api/v1/portfolio` and `GET /api/v1/portfolio/{slug}`.

### Solutions and services

Solution records connect a problem and audience to relevant products, evidence, limitations, and a discovery path. Service records communicate engagement shape, inputs, outputs, exclusions, and related work without implying fixed scope or guaranteed results.

APIs:

- `GET /api/v1/solutions`
- `GET /api/v1/solutions/{slug}`
- `GET /api/v1/services`
- `GET /api/v1/services/{slug}`

### Insights, organizations, and about

Insights require a compact server-rendered index, paginated API access, article metadata, and article HTML or Markdown fetched only on demand. Organization pages aggregate their product and portfolio records. About remains reviewed editorial content with explicit organization identities and authors.

Planned APIs:

- `GET /api/v1/insights`
- `GET /api/v1/insights/{slug}`
- `GET /api/v1/organizations/{slug}`

## Data and component contracts

Generated client types live in `.ts`, not `.tsx`. React files contain rendering only.

Core page-model components:

- `RecordCollectionPage`
- `RecordCollectionRow`
- `ProductRecordPage`
- `PortfolioRecordPage`
- `RecordProfile`
- `ImplementationEvidence`
- `RepositorySummary`
- `PackageList`
- `RelatedResourceGroups`
- `GovernanceClaims`
- `EvidenceAndLimitations`
- `FreshnessNotice`

Frontend code consumes composed page models. It must not assemble a public page through dozens of raw CRUD-table requests.

## Loading and failure behavior

- Server-rendered content is the initial state.
- During hydration, the client sends a conditional request using browser cache semantics and the backend ETag.
- A `304` retains current content without rerendering.
- A newer `200` updates evidence sections without shifting the page header.
- A network error keeps server-rendered content and displays a small “refresh unavailable” notice near freshness metadata.
- A true `404` renders a helpful record-not-found page with links to its parent collection.
- Search and filters work without a network round trip after collection hydration.
- No full-page loading spinner is permitted on an indexable route.

## Responsive behavior

### 320–639 px

- Single-column flow.
- Header navigation becomes an accessible disclosure.
- Record section navigation scrolls horizontally or wraps without clipping.
- Metrics use two columns at most.
- Long repository/package names wrap; URLs never force horizontal overflow.
- Minimum interactive target is 44 by 44 CSS pixels.

### 640–1023 px

- Collection rows use a compact metadata column and flexible content column.
- Record profile appears above content unless sufficient width exists for a balanced rail.
- Filters wrap and retain labels.

### 1024 px and above

- Record pages use a restrained profile rail and a wide reading column.
- Sticky elements must not overlap anchor targets or keyboard focus.
- Reading lines remain below roughly 80 characters for prose.

## Accessibility requirements

- WCAG 2.2 AA is the minimum implementation target.
- One `h1`; logical heading order; landmarks for header, navigation, main, complementary content, and footer.
- All collection and record navigation is available as real anchors without JavaScript.
- Visible `:focus-visible` styling meets contrast requirements.
- Filters have persistent labels or programmatic names and communicate pressed/selected state.
- Dynamic refresh status uses polite announcements; errors use an alert only when user action is required.
- Color is never the only carrier of maturity, freshness, or evidence state.
- Respect reduced motion and high-contrast/forced-colors settings.
- Automated axe checks and keyboard journey tests cover representative collection and record routes.

## Performance and caching contract

Targets are enforced for `/`, `/products/`, `/products/records/peagen/`, `/portfolio/`, `/solutions/`, and `/insights/`:

- Lighthouse category scores: 100 Performance, Accessibility, Best Practices, and SEO in the pinned CI environment.
- LCP at or below 2.0 seconds at mobile test conditions.
- CLS at or below 0.02.
- INP at or below 150 ms in field monitoring when available.
- Initial JavaScript for non-article pages at or below 150 KiB gzip.
- No individual JavaScript chunk above 256 KiB uncompressed.
- Legacy article bodies are never included in the initial product or home bundle.

Caching:

- Hashed assets: `public, max-age=31536000, immutable`.
- Page-model APIs: short browser freshness, shared-cache freshness, stale-while-revalidate, strong ETag, and `Vary: Accept-Encoding`.
- HTML: cacheable at the edge with revalidation; never immutable.
- A page hit must not change a content ETag.
- Failed refreshes may serve stale reviewed content with a visible timestamp.

## SEO, discovery, and social metadata

- Every indexable route has unique title, description, canonical URL, Open Graph and Twitter metadata.
- Product records emit `SoftwareApplication` only when the record actually represents software; portfolio and service records use appropriate WebPage/Service types.
- Breadcrumb JSON-LD mirrors visible hierarchy.
- Sitemap, robots, `llms.txt`, and full content manifests derive from the same exported page models.
- Structured data validation, link validation, and metadata uniqueness are build gates.

## Governance and acceptance

Editorial descriptions, maturity, featured status, product relationships, and availability claims remain reviewed inputs. Collectors may update observable facts and metrics but may not invent positioning.

A route is accepted only when:

1. Its page model passes schema and evidence validation.
2. Server HTML contains the record title and primary facts.
3. API and HTML agree on stable record ID and content revision.
4. Conditional requests return `304` for an unchanged model.
5. Keyboard, screen-reader landmarks, mobile overflow, and empty/error states pass.
6. Lighthouse and bundle budgets pass in the pinned environment.
7. Deployment verification checks visible content markers, not only HTTP status.

Peagen is the migration reference record. It must show its explicit primary implementation, website and documentation repositories, its scoped package records, related resources, evidence timestamps, and limitations. It must never fall back to the nonexistent `swarmauri/peagen` repository URL.
