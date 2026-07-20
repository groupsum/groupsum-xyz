# Cross-Organization Product and Portfolio Amendment

**Applies to:** `FRONTEND_UIX_BRIEF.md`  
**Detailed catalog:** `PRODUCT_PORTFOLIO_CATALOG.md`  
**Status:** authoritative amendment  
**Prepared:** July 20, 2026

## 1. Precedence

This amendment expands the website from a Groupsum-only selected-work lander into the product and portfolio front door for the Groupsum, Tigrbl, and Swarmauri ecosystems.

Where this document differs from `FRONTEND_UIX_BRIEF.md`, this amendment controls. It supersedes the original brief's:

- Three-surface assignment.
- Primary navigation and product/portfolio routes.
- Homepage Selected Portfolio, Solutions, and Services sections.
- Four-family portfolio type.
- Initial four-solution and five-service lists.
- Portfolio-specific implementation and acceptance criteria.

The original brief remains authoritative for the new identity, favicon, soft-border CSS system, responsive behavior, accessibility, legacy-post preservation, performance, contact flow, and general claim governance.

## 2. Revised assignment

The new Groupsum LLC website must present four distinct surfaces:

1. **Products** — owned and affiliated suites, products, applications, and package ecosystems across Groupsum, Tigrbl, and Swarmauri.
2. **Portfolio** — the complete approved catalog of suites, projects, repositories, package families, packages, applications, sites, demos, specifications, and archives.
3. **Solutions** — outcome-led compositions of capabilities from the three ecosystems.
4. **Services** — advisory, implementation, remediation, and operational engagements delivered by Groupsum LLC.

The implementation must use `PRODUCT_PORTFOLIO_CATALOG.md` as the initial taxonomy and source inventory.

## 3. Revised primary navigation

- **Products** — `/products/`
- **Portfolio** — `/portfolio/`
- **Solutions** — `/solutions/`
- **Services** — `/services/`
- **Insights** — `/insights/`
- **About** — `/about/`
- Primary CTA: **Discuss a project** — `/contact/`

On medium widths, About may move into an overflow menu or footer before any product, portfolio, solution, service, or CTA item is removed.

## 4. Revised route system

| Route | Purpose |
| --- | --- |
| `/products/` | Curated product and suite overview |
| `/products/groupsum/` | Groupsum products and suites |
| `/products/tigrbl/` | Tigrbl products and suites |
| `/products/swarmauri/` | Swarmauri products and suites |
| `/products/{suite-slug}/` | Suite landing page with products, applications, package families, docs, source, and evidence |
| `/portfolio/` | Searchable/filterable complete approved catalog |
| `/portfolio/projects/{slug}/` | Project or repository-backed work detail |
| `/portfolio/packages/{slug}/` | Package detail with parent suite and distribution evidence |
| `/portfolio/specifications/{slug}/` | Approved specification or governance-pack detail |
| `/solutions/` | Solution catalog |
| `/solutions/{slug}/` | Detailed outcome, capability, proof, limitations, and engagement path |
| `/services/` | Services catalog |
| `/services/{slug}/` | Service audience, outputs, inputs, scope, proof, and CTA |

Detail-route generation may use one generic template per entity kind. Do not create bespoke React components for hundreds of packages.

## 5. Revised homepage hierarchy

### A. Hero

The hero explains Groupsum LLC as the builder and operator behind connected product ecosystems. It must not imply that Groupsum, Tigrbl, and Swarmauri are the same legal entity or one monolithic product.

Primary CTA: **Discuss a project**.  
Secondary CTA: **Explore products**.

### B. Ecosystem orientation

Introduce the three organizations in one compact editorial composition:

- Groupsum: governed delivery, document, trust, storage, and operational systems.
- Tigrbl: schema-first API, ASGI runtime, identity, storage, and modern transport infrastructure.
- Swarmauri: modular AI/agent infrastructure, reusable components, workflow generation, and developer tooling.

Each organization links to its product landing view. Do not reduce this section to three identical logo cards.

### C. Flagship product suites

Feature 6–9 approved suites across the three ecosystems. The initial editorial set should consider:

- SSOT Registry.
- MdWrk.
- Tigrbl.
- Tigrbl Auth.
- Tigrcorn.
- Swarmauri SDK.
- Peagen.
- One Groupsum operational product such as BucketWarden, PDFRemed, or Portwyrm after maturity review.

Each feature needs organization, entity type, primary job, maturity/evidence label, and a useful destination.

### D. Selected portfolio

Show 6–8 approved pieces of work selected for range and proof, not one card per repository. Balance the selection across:

- Products and applications.
- Package suites.
- Infrastructure/runtime work.
- Document/accessibility work.
- Trust/identity work.
- AI/agent work.
- Governed specifications or packs.

Provide a clear path to **Browse the complete portfolio**.

### E. Solutions

Preview six outcome-led solutions, selected from the complete solution catalog:

- Governed product delivery.
- API and platform foundations.
- Identity, trust, and policy.
- AI and agent systems.
- Document and knowledge operations.
- Storage, evidence, and data movement.

Additional solution routes cover realtime/modern transport, developer experience/distribution, accessibility/remediation, and infrastructure/operational planning.

### F. Services

Preview six engagement models:

- Product and portfolio architecture.
- API and platform engineering.
- SDK and package ecosystem engineering.
- AI and agent application engineering.
- Identity, authorization, and trust engineering.
- Delivery, release, and distribution operations.

The complete Services catalog also includes architecture/specification delivery, data/storage/transfer engineering, document/accessibility engineering, frontend/operator experience, migration/modernization, and technical audit/evidence closure.

### G. Operating model, Insights, and CTA

Retain the original brief's operating-model, Insights, final CTA, and footer requirements. Add direct footer groups for Products, Portfolio, Solutions, Services, and each organization ecosystem.

## 6. Product and portfolio page hierarchy

### Products index

The Products index is editorial and buyer/developer friendly. Lead with flagship suites and use organization/capability groupings. It should answer:

- What can I install, use, or evaluate?
- Which suite owns the capability?
- Who is it for?
- Where are the docs, source, distributions, and current evidence?

### Suite page

Every flagship suite page includes:

- Suite name and organization.
- Primary job and audience.
- Architecture/layer overview.
- Products or applications.
- Package-family groups.
- Selected packages.
- Examples/demos.
- Documentation and source.
- Distribution/release evidence.
- Maturity and known limitations.
- Related solutions and services.

Required initial suite pages: SSOT Registry, MdWrk, Tigrbl, Tigrbl Auth, Tigrcorn, Swarmauri SDK, and Peagen.

### Complete Portfolio index

The Portfolio index is a high-density catalog, not a marketing-card wall. It must support:

- Search across source-native and display names.
- Organization, suite, capability, entity-kind, language/ecosystem, maturity, evidence, and availability filters.
- URL-addressable filter state.
- Result count, active filters, reset, no-results recovery, and pagination/static chunking.
- Cards or editorial rows for products/projects.
- Tables for package-heavy result sets.
- Progressive disclosure for hundreds of suite packages.

The catalog must remain usable with approximately 400 Tigrbl Auth manifests and 346 Swarmauri SDK manifests. Do not render all records into one document or initial client payload.

## 7. Revised entity model

```ts
type OrganizationId = "groupsum" | "tigrbl" | "swarmauri";

type PortfolioEntityKind =
  | "suite"
  | "product"
  | "project"
  | "package-family"
  | "package"
  | "application"
  | "site-docs"
  | "demo-example"
  | "specification-pack"
  | "archive";

type Maturity =
  | "concept"
  | "experimental"
  | "active-development"
  | "usable"
  | "released"
  | "maintained"
  | "deprecated"
  | "archived"
  | "unknown";

type PublicationDisposition =
  | "public"
  | "public-grouped"
  | "private"
  | "confidential"
  | "duplicate-mirror"
  | "deprecated-archive"
  | "not-portfolio"
  | "review-required";

type PortfolioEntity = {
  id: string;
  slug: string;
  sourceName: string;
  displayName: string;
  organization: OrganizationId;
  kind: PortfolioEntityKind;
  parentId?: string;
  suiteId?: string;
  capabilityIds: string[];
  ecosystem: Array<"python" | "npm" | "rust" | "web" | "service" | "specification">;
  summary: string;
  audience: string[];
  maturity: Maturity;
  evidence: Array<{ kind: string; label: string; href?: string; checkedAt: string }>;
  limitations: string[];
  links: Array<{ kind: "source" | "docs" | "package" | "release" | "live"; label: string; href: string }>;
  featured: boolean;
  approved: boolean;
  disposition: PublicationDisposition;
};
```

Only `approved: true` entities with a public disposition may render. Preserve source-native names for search and package accuracy even when the display name is friendlier.

## 8. Revised catalog components

Add these contracts to the original component inventory:

| Component | Contract |
| --- | --- |
| `OrganizationSwitch` | Groupsum/Tigrbl/Swarmauri navigation with text labels; not logo-only |
| `SuiteHero` | Suite identity, job, audience, maturity/evidence, actions |
| `SuiteArchitecture` | Accessible hierarchy of products, layers, and package families |
| `CatalogSearch` | Persistent label, query state, clear action, result announcement |
| `CatalogFilters` | Multi-select filters, mobile disclosure, active chips, reset, URL state |
| `PortfolioRow` | Dense product/project result with organization, kind, capability, maturity, and action |
| `PackageTable` | Sortable accessible package rows; responsive stacked alternative |
| `EvidenceSummary` | Text-first evidence sources, checked date, and limitations |
| `RelatedEntities` | Parent suite, sibling packages, solution, service, docs, and source links |

## 9. Revised implementation sequence

Before building Product or Portfolio pages:

1. Create authenticated repository inventory adapters for all three organizations.
2. Scan Python, npm, and Rust manifests for package candidates.
3. Normalize candidates into the entity model.
4. Merge curated summaries, relationships, maturity, evidence, approval, and publication dispositions.
5. Produce a review report for new, changed, missing, duplicate, private, confidential, and unresolved entities.
6. Approve the initial public catalog.
7. Generate suite/product/project/package routes and search indexes.
8. Build the editorial homepage and indexes against the approved data.

The generated layer must never overwrite editorial approval, limitations, or publication disposition.

## 10. Revised acceptance criteria

In addition to the original brief's brand, legacy-content, CSS, accessibility, performance, and build criteria:

1. Groupsum, Tigrbl, and Swarmauri each have an organization product view and accurate ecosystem explanation.
2. Every discovered repository and package receives a catalog record and explicit disposition, including hidden/private/confidential outcomes.
3. Suite, product, project, package family, package, application, site, demo, specification, and archive entities are distinguishable.
4. Flagship suite pages exist for SSOT Registry, MdWrk, Tigrbl, Tigrbl Auth, Tigrcorn, Swarmauri SDK, and Peagen.
5. Large package suites are searchable, filterable, paginated/chunked, and grouped by layer or capability.
6. The homepage features all three ecosystems without attempting to list every package.
7. The Products route explains usable suites; the Portfolio route provides complete approved discovery; Solutions remain outcome-led; Services remain engagement-led.
8. No private, confidential, unapproved, duplicate, or internal-only entity leaks into the public build.
9. No maturity, publication, protocol, compliance, certification, completeness, or adoption claim is inferred from repository/manifest existence.
10. An inventory refresh produces a reviewable diff and cannot silently publish new entities.
