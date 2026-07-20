# Groupsum, Tigrbl, and Swarmauri Product Portfolio Catalog

**Purpose:** content source and taxonomy for the Groupsum LLC website  
**Snapshot date:** July 20, 2026  
**Companion:** `FRONTEND_UIX_BRIEF.md` and `FRONTEND_UIX_CROSS_ORG_AMENDMENT.md`
## 1A. Cohesive GroupSum vision

GroupSum is the system-level story: a portfolio of mature, evidence-led solutions for horizontal problems that recur across software, infrastructure, delivery, trust, and operations. Individual products are proof points within that system, not competing homepages.

The website should lead with the problems GroupSum helps organizations solve:

- Make complex systems legible and governable.
- Move software, infrastructure, and digital deliverables through controlled release paths.
- Preserve evidence, provenance, and decision context.
- Operate storage, proxy, identity, and infrastructure boundaries safely.
- Give teams usable planning and operator surfaces instead of disconnected technical artifacts.

Products such as Voltrack, the DCIM planners, DeliverableOps, EvidenceVault, npmctl, and Portwyrm should appear as coordinated capabilities underneath those problem areas. No single product family should dominate the homepage. The visual hierarchy should be: GroupSum vision -> horizontal problem -> solution pattern -> selected proof points -> deeper portfolio catalog.

### Experience implications

- **Homepage:** one cohesive GroupSum narrative with balanced proof points from Groupsum, Tigrbl, and Swarmauri.
- **Solutions:** organize around horizontal problems and outcomes, then show the products, suites, packages, and services that contribute.
- **Portfolio:** provide the complete filterable catalog, with organization, family, entity type, maturity, and evidence state.
- **Products:** retain detailed product-family pages for visitors who already know what they are looking for.
- **Services:** describe how GroupSum combines the capabilities into an engagement, rather than selling a repository or package in isolation.
- **Insights:** connect legacy articles and current field notes back to the relevant horizontal problem and capability family.

This is a portfolio ecosystem, not a product directory. A repository, package, project, product, suite, and service must remain visibly distinct while still contributing to the same GroupSum operating thesis.

## 1. Portfolio model

The site must present the three organizations as a connected ecosystem without pretending they are one undifferentiated product:

- **Groupsum** is the company and commercial portfolio. It owns governed delivery systems, document and operational products, trust/storage infrastructure, websites, applications, and reusable governance packs.
- **Tigrbl** is the API and ASGI infrastructure ecosystem. It covers schema-first API construction, runtime execution, engines, modern protocol serving, identity, storage, portable contracts, and specialized applications.
- **Swarmauri** is the modular intelligence and developer-tooling ecosystem. It covers the Swarmauri SDK, component packages, agent and AI workflows, Peagen generation, UI/example applications, and developer infrastructure.

The catalog is broader than the homepage. The homepage should feature a small, balanced set; Products and Portfolio must make every **approved public** suite, project, repository, package family, package, application, site, demo, specification, and archive entry discoverable.

## 2. Entity taxonomy

| Entity | Meaning | Example |
| --- | --- | --- |
| Organization | Ownership and brand boundary | Groupsum, Tigrbl, Swarmauri |
| Suite | Related products/packages released or operated together | SSOT Registry, Tigrbl, Tigrbl Auth, Swarmauri SDK, MdWrk, Peagen |
| Product | User-facing installable or operated capability | Portwyrm, BucketWarden, Tigrcorn, PDFRemed |
| Project | Repository-backed body of work that may not be a released product | `wt-agentbus`, demos, research projects |
| Package family | Stable component or layer grouping within a suite | Tigrbl engines, Swarmauri standards, MdWrk landers |
| Package | Independently named distribution or manifest | `tigrbl-runtime`, `ssot-cli`, `swarmauri_signing_ed25519` |
| Application | End-user or operator interface | MdWrk desktop, Tigrbl Auth UI, Swarmauri Playground |
| Site/docs | Discovery, documentation, or product web surface | Tigrbl docs, Swarmauri docs |
| Demo/example | Runnable proof or teaching surface | Realtime operations demos, notebooks |
| Specification/pack | Reusable governed decisions, schemas, or policy assets | Groupsum governance packs, TrustSig bundle specification |
| Archive | Historical or retired work preserved for reference | Deprecated packages, legacy posts |

Repository, project, package, and product are not synonyms. The UI must preserve these distinctions.

## 3. Evidence and publication states

Every entity must carry independent maturity, evidence, and publication dimensions.

### Maturity

- `concept`
- `experimental`
- `active-development`
- `usable`
- `released`
- `maintained`
- `deprecated`
- `archived`
- `unknown`

### Evidence

- Source repository.
- Implementation.
- Automated tests.
- Documentation.
- Package-registry publication.
- Release artifact.
- Live application/site.
- Governed claim/evidence record.
- External validation.

### Publication disposition

- Public and browseable.
- Public but grouped under a parent suite.
- Private/hidden.
- Confidential/hidden.
- Duplicate or mirror.
- Deprecated/archive.
- Not a portfolio entity.
- Review required.

Never infer one dimension from another. A repository is not automatically a product, a manifest is not proof of publication, a published package is not proof of complete coverage, and an SSOT “published” record is not a substitute for a public distribution artifact.

## 4. Groupsum product and suite catalog

| Family | Primary public or review-candidate entities | What the site may explain | Required boundary |
| --- | --- | --- | --- |
| Governed delivery | SSOT Registry package suite and lineage graph | Source-controlled decisions, claims, tests, evidence, boundaries, and releases | Package and release status must be verified independently |
| Governance packs | Identity, privacy, signature, lineage, analytics, attribution, advertising, consent, commerce, caching, and discovery packs | Installable ADR/SPEC starting points by technical domain | Present as governance assets, not certification |
| MdWrk | Markdown Workspace, client/desktop, studio, pages, themes, renderers, editors, extensions, landers | Governed markdown applications and reusable content/site infrastructure | Separate source packages, applications, artifacts, and live sites |
| Delivery and control planes | npmctl, Portwyrm, DeliverableOps, dist-router, operational control planes | Declarative delivery, proxy/DNS operations, routing, and control surfaces | Do not claim live health from repo state alone |
| Storage and evidence | BucketWarden, EvidenceVault, DataRoom, file tooling, caching work | Controlled storage, evidence retention, and operator workflows | Identify implemented slices versus planned boundaries |
| Trust and identity | TrustSig, TrustSig bundle specification, NotaryCore, authentication/authorization tooling | Signatures, trust records, notarization, identity, and policy operations | Compliance/certification language requires explicit evidence |
| Documents and accessibility | PDFRemed, WCAG PDF Test, document studio/viewer, signable PDF workbench | Document creation, viewing, signing, testing, remediation, and accessibility | Distinguish test tooling, workbench, product, and reference workspace |
| Infrastructure planning | DCIM rack/fiber planning, hardware clearinghouse, routing/capacity tools | Infrastructure inventory, planning, and operator workflows | Commercial availability requires approval |
| Focused applications and research | Approved commercial workflows, utilities, demonstrations, and research | Breadth of implementation and experimentation | Label demo, experimental, internal, and archived states honestly |

### SSOT Registry packages

- `ssot-registry`
- `ssot-core`
- `ssot-cli`
- `ssot-contracts`
- `ssot-pack-contracts`
- `ssot-conformance`
- `ssot-codegen`
- `ssot-views`
- `ssot-mcp`
- `ssot-tui`
- `@ssot-registry/lineage-graph`

### Governance-pack entities

- `authentication-governance-pack`
- `authnz-policy-governance-pack`
- `authorization-policy-governance-pack`
- `verifiable-credentials-governance-pack`
- `decentralized-identifiers-governance-pack`
- `digital-signature-governance-pack`
- `privacy-governance-records-governance-pack`
- `data-catalog-lineage-contracts-governance-pack`
- `seo-aeo-aieo-governance-pack`
- `cache-freshness-governance-pack`
- `web-app-analytics-governance-pack`
- `web-performance-rum-governance-pack`
- `event-behavioral-telemetry-governance-pack`
- `ga4-google-tagging-governance-pack`
- `url-query-attribution-foundations-governance-pack`
- `marketing-attribution-conversion-governance-pack`
- `mobile-install-attribution-governance-pack`
- `ad-measurement-media-governance-pack`
- `ad-supply-chain-transparency-governance-pack`
- `customer-identity-profile-governance-pack`
- `customer-commerce-semantics-governance-pack`
- `consent-privacy-signals-governance-pack`
- `audience-data-transparency-governance-pack`
- `gs1-product-link-event-data-governance-pack`

### MdWrk package families

- Client, desktop, and website applications.
- Extension host, manifest, runtime, manager, Git operations, workspace files, agent, language-pack, and theme-studio packages.
- Markdown editor core, React editor, and edit-in-renderer integration.
- Markdown renderer core and React renderer.
- Lander content contract, compilation core, React rendering, theme, SEO, Markdown adapter, page templates, and presets.
- Shared icons, i18n, structured data, testing, and UI tokens.

## 5. Tigrbl product and suite catalog

| Family | Primary public or review-candidate entities | What the site may explain | Required boundary |
| --- | --- | --- | --- |
| Tigrbl API framework | Facade plus typing/spec/model/core/base/ORM/atoms/kernel/runtime/concrete layers | Schema-first REST, JSON-RPC, docs, hooks, diagnostics, and execution | App users start at the facade; split packages are specialist surfaces |
| Operation packs | OLTP, OLAP, realtime, WebTransport | Transactional, analytical, realtime, streaming, and transport operations | State exact transport/runtime support from evidence |
| Engine ecosystem | Database, warehouse, dataframe, file, memory, cache, queue, bloom, dedupe, rate, object, hybrid engines | Pluggable persistence and execution behind shared contracts | Manifest presence and production support are separate states |
| Tigrbl Auth | Contracts, bases, concrete implementations, providers, storage, capabilities, protocols, runtime, routers, backend apps, UIX | Multi-tenant authentication/authorization and authenticator ceremonies | Current repo says it is not fully certifiable or fully RFC compliant |
| Tigrcorn | ASGI server and operator surface | HTTP/1.1, HTTP/2, HTTP/3, QUIC, WebSocket, TLS, static delivery, metrics, workers, reload, embedding | Protocol and promotion status remain release-evidence backed |
| ASGI contracts | `tigr-asgi-contract` and generated language artifacts | Typed portable ASGI event/capability contracts | Do not invent cross-language parity |
| Storage | Tigrstore and related engine integrations | Block, object, content-addressed, network, and hybrid semantics | Separate demonstrated backends from proposals |
| Specialized applications | ACME CA, API Cron, API HPKS, Billing, KMS, SPIFFE, attribution | Focused apps built on Tigrbl contracts | Each repo owns maturity and release truth |
| Realtime and agent transport | `wt-agentbus` and realtime data demos | WebTransport/QUIC agent communication and realtime operations | Distinguish design, demo, and production runtime |
| Docs, sites, skills, demos | Tigrbl/Tigrcorn docs and sites, grammar, skills, examples | Education and implementation support | These do not inherit flagship release status |

### Tigrbl framework package layers

The inspected main workspace contains 50 active Python package manifests after excluding temporary, archived, and deprecated copies. Catalog them hierarchically:

- Foundations: `tigrbl-typing`, `tigrbl_spec`, `tigrbl_model`.
- Framework: `tigrbl-core`, `tigrbl-base`, `tigrbl-orm`, `tigrbl-atoms`, `tigrbl-kernel`, `tigrbl-runtime`, `tigrbl-concrete`.
- Facade and client: `tigrbl`, `tigrbl_client`.
- Operations: `tigrbl-ops-oltp`, `tigrbl-ops-olap`, `tigrbl-ops-realtime`, `tigrbl-ops-webtransport`.
- Engines: 28 inspected manifests spanning database, warehouse, dataframe/file, memory, cache, queue, rate, bloom, dedupe, and object-storage profiles.
- Support: examples, demos, test packages, and explicit deprecated surfaces.

### Tigrbl Auth package layers

The inspected workspace contains approximately 400 active package manifests outside deprecated packages. Do not render them as unrelated cards. Preserve these layers:

- Primitives and storage.
- Contracts.
- Base implementations.
- Concrete implementations.
- Providers.
- Storage runtime.
- Capabilities.
- Protocols.
- Runtime and facade.
- Routers and backend applications.
- UIX core, authenticator UI modules, and broader UI packages.
- Examples, tests, and deprecated compatibility surfaces.

Package pages show layer, parent suite, relationships, protocol/ceremony where relevant, source, distribution evidence, maturity, and limitations.

## 6. Swarmauri product and suite catalog

| Family | Primary public or review-candidate entities | What the site may explain | Required boundary |
| --- | --- | --- | --- |
| Swarmauri SDK | Namespace, interfaces, base classes, standard components, community/standards packages, plugins, experiments | Composable typed Python infrastructure for AI apps, security, transport, storage, and tooling | Availability/maturity recorded per distribution |
| Peagen | Facade, CLI, gateway, worker, TUI, client, core, tables, plugins, template sets | Template/DAG-driven project generation and repeatable CLI/service workflows | Separate current implementation from examples and plans |
| AI and retrieval applications | Approved RAG, assistant, playground, and notebook projects | Runnable AI application patterns | Provider support/live availability require verification |
| UI and education | Approved UI kits, components, classroom, chart, and learning projects | Interface components and educational examples | Components, demos, and products are separate kinds |
| Developer tooling | CRUD routing, boilerplates, package/repo operations, PDK, documentation | Developer and repository workflows | Archived/experimental tools must be labeled |
| Infrastructure and operations | Approved runner, hosting, security, CDN, and auth projects | Operational support for the ecosystem | Private infrastructure details stay private |
| Research and experiments | Approved prototype and research projects | Research breadth and experimental work | No customer or production inference |

### Swarmauri SDK package families

The inspected SDK contains 346 active Python package manifests outside deprecated packages and virtual environments:

- Core contracts and typing.
- Reusable base classes.
- Main `swarmauri` namespace/facade.
- `swarmauri_standard` first-party components.
- 113 community package manifests.
- 185 standards package manifests.
- 36 experimental package manifests.
- 5 plugin package manifests.

Group packages by component capability:

- Agents and agent factories.
- Chains and conversations.
- Documents and schema converters.
- Embeddings, distances, similarity, and vector stores.
- LLM, image, speech, TTS, video, and multimodal providers.
- Parsers, prompts, tools, and toolkits.
- Evaluators and evaluation pools.
- Signing, crypto, cipher suites, key providers, proof-of-possession, and tokens.
- Middleware, transports, publishers, and protocol adapters.
- Storage and Git filters.
- Billing and commercial integrations.
- XMP/media metadata components.
- Skills, plugins, examples, and experiments.

Generate normalized records from manifests plus curated overrides. Do not hand-maintain or initially ship hundreds of cards.

### Peagen package suite

- `peagen`
- `peagen-core`
- `peagen-client`
- `peagen-tables`
- `peagen-cli`
- `peagen-gateway`
- `peagen-worker`
- `peagen-tui`
- `peagen-plugin`
- `peagen_templset_vue`

## 7. Source inventory and confidentiality boundary

An authenticated GitHub inventory on July 20, 2026 confirmed that all three organizations contain more repositories than can safely be inferred from public search or local clones. Exact authenticated results may include private or confidential entities and must not be copied into public content merely to demonstrate completeness.

The catalog pipeline must:

1. Inventory all repositories using authenticated organization access.
2. Assign every repository a disposition before content generation.
3. Export only approved public records into the website content pack.
4. Keep private/confidential names, descriptions, URLs, counts, and relationship metadata out of the public build, sitemap, client bundle, search index, source maps, and generated reports.
5. Keep the full internal review report outside the public website repository or in an explicitly protected system.
6. Compare local clones, GitHub inventory, manifests, release evidence, and registries without assuming any one is complete.

“All projects and packages are represented” means all discovered entities receive an internal disposition; it does **not** mean all entity names become public.

## 8. Updated Solutions catalog

Solutions are outcome-led cross-portfolio compositions. Each page names relevant suites and proof without reading like a repository list.

| Solution | Client problem | Evidence families | Typical outcome |
| --- | --- | --- | --- |
| Governed product delivery | Decisions, implementation, tests, and releases drift apart | SSOT Registry, governance packs, DeliverableOps, MdWrk | Traceable scope and delivery evidence |
| API and platform foundations | Teams need consistent APIs without rebuilding transports and persistence boundaries | Tigrbl, engines, operation packs, Tigrcorn, ASGI contracts | Typed API/runtime platform with extension seams |
| Identity, trust, and policy | Authentication, authorization, signatures, and evidence are fragmented | Tigrbl Auth, Groupsum trust/identity work, governance packs, Swarmauri security packages | Governed identity/trust capabilities with auditable boundaries |
| AI and agent systems | AI components and workflows are difficult to compose, test, and operate | Swarmauri SDK, Peagen, approved RAG/UI apps, `wt-agentbus` | Modular AI/agent system with repeatable workflows |
| Document and knowledge operations | Documents are hard to author, remediate, sign, publish, and preserve | MdWrk, PDFRemed, WCAG PDF Test, TrustSig, EvidenceVault | Accessible, governed document lifecycle |
| Storage, evidence, and data movement | Data needs controlled persistence, transfer, retention, and verification | BucketWarden, Tigrstore, Portwyrm, storage packages, data-room/file tooling | Explicit storage/transfer architecture with operator controls |
| Realtime and modern transport | Apps need WebSocket, HTTP/2/3, QUIC, WebTransport, or streaming | Tigrcorn, Tigrbl realtime ops, ASGI contracts, Swarmauri transports, demos | Governed realtime and transport foundation |
| Developer experience and distribution | Multi-package systems are hard to generate, document, release, and operate | Peagen, npmctl, MdWrk landers, SSOT tooling, SDK workspaces | Reproducible developer workflow and release system |
| Accessibility and remediation | Existing documents and interfaces fail accessibility or migration needs | PDFRemed, WCAG PDF Test, accessibility work, legacy migration | Audited and remediated digital surface |
| Infrastructure and operational planning | Infrastructure decisions lack usable planning tools | Approved DCIM, hardware, routing, capacity, and control-plane work | Purpose-built operator workflow and planning evidence |

Each solution page requires: problem, audience, symptoms, target capability, relevant suites/projects/package families, engagement path, deliverables, evidence, limitations, and CTA.

## 9. Updated Services catalog

Services describe what Groupsum LLC can deliver. They may draw on all three ecosystems but must not imply that installing an open-source package is itself a consulting engagement.

| Service | Typical outputs | Portfolio anchors |
| --- | --- | --- |
| Product and portfolio architecture | Taxonomy, suite boundaries, roadmap, claim model, maturity map | Cross-organization portfolio, SSOT Registry |
| Architecture, ADR, and specification delivery | System map, ADRs, specs, interfaces, dependency boundaries | Governance packs, Tigrbl/ASGI contracts, TrustSig specs |
| API and platform engineering | REST/JSON-RPC services, models, engines, runtime profiles, operator surfaces | Tigrbl, Tigrcorn, specialized apps |
| SDK and package ecosystem engineering | Contracts, bases, plugins, package splits, compatibility, examples, release order | Swarmauri SDK, Tigrbl, SSOT, MdWrk |
| AI and agent application engineering | Model/tool/agent composition, RAG, generation, evaluation, deployment integration | Swarmauri SDK, Peagen, approved AI apps, AgentBus work |
| Identity, authorization, and trust engineering | OIDC/OAuth, authenticators, policy, signatures, keys, tokens, evidence | Tigrbl Auth, TrustSig, NotaryCore, Swarmauri security packages |
| Data, storage, and transfer engineering | Storage contracts, object/file backends, retention, migration, control planes | BucketWarden, Tigrstore, Portwyrm, storage adapters |
| Document and accessibility engineering | Document workflow, PDF testing/remediation, accessible content/UI, signing/preservation | PDFRemed, WCAG PDF Test, MdWrk, document workbenches |
| Frontend and operator experience | Product UI, admin/control planes, dashboards, technical landers, design systems | Approved sites/apps, Tigrbl Auth UIX, Swarmauri UI work |
| Migration and modernization | Legacy content migration, package restructuring, system upgrades | Legacy archive, package-layer migrations, MdWrk landers |
| Delivery, release, and distribution operations | CI/CD, package publication, containers, DNS/proxy automation, release evidence | npmctl, DeliverableOps, SSOT conformance, multi-package systems |
| Technical audit and evidence closure | Gap analysis, conformance matrix, claim/evidence review, readiness report | SSOT Registry, governance packs, identity/protocol evidence |

Every service page/block states audience, when to use it, outputs, required inputs/access, portfolio evidence, exclusions, engagement shape, and next action.

## 10. Catalog ingestion and maintenance

### Source adapters

- Authenticated GitHub repository inventory for all three organizations.
- `pyproject.toml` for Python packages and workspaces.
- `package.json` for npm applications/packages.
- `Cargo.toml` for Rust crates/workspaces.
- Repository and package-local README files.
- SSOT registries, current-state docs, conformance reports, release evidence, and public registry metadata.

### Merge behavior

1. Generate stable candidate IDs from organization, repository, kind, and package.
2. Preserve source-native names.
3. Apply curated display name, summary, family, relationships, imagery, maturity, evidence, approval, and disposition.
4. Never overwrite editorial approval, limitations, or publication disposition during regeneration.
5. Mark disappeared entities `unknown` or `archive-candidate`; do not silently delete them.
6. Detect duplicates, renamed repos, mirrors, sites, examples, deprecated paths, and private entries.
7. Emit a protected review report for new, changed, missing, conflicting, and unapproved entities.

## 11. Catalog UX requirements

- Search display/source names, summaries, packages, capabilities, and organizations.
- Filter organization, kind, suite, capability, language/ecosystem, maturity, evidence, and availability.
- Use hierarchical suite pages with progressively disclosed package families.
- Use canonical detail pages for approved products, projects, and packages.
- Use package tables for high-volume families, not hundreds of cards.
- Preserve URL-addressable filter state where practical.
- Paginate or statically chunk large catalogs.
- Show result count, active filters, and a useful empty state.
- Link related solutions, services, docs, source, distributions, and parent suites.
- Provide mobile table alternatives without horizontal page overflow.

## 12. Portfolio acceptance criteria

1. Groupsum, Tigrbl, and Swarmauri each have an organization view and accurate ecosystem explanation.
2. Every authenticated discovered repository/package receives an internal disposition, while only approved public records reach the site.
3. Suite, product, project, app, package family, package, site, demo, specification, and archive are distinct.
4. Suite pages exist for SSOT Registry, MdWrk, Tigrbl, Tigrbl Auth, Tigrcorn, Swarmauri SDK, and Peagen.
5. High-volume package ecosystems are searchable/filterable and grouped by capability/layer.
6. No private, confidential, internal, or unapproved entity leaks into public output or repository artifacts.
7. No release, compliance, certification, completeness, or adoption claim is inferred from repository/manifest existence.
8. Every Solution identifies cross-ecosystem evidence and limitations.
9. Every Service identifies outputs, engagement shape, portfolio anchors, and exclusions.
10. Inventory refresh produces a reviewable protected diff rather than silently changing the public catalog.
