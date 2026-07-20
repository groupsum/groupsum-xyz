/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioEntity } from "../types";

export const portfolioEntities: PortfolioEntity[] = [
  // ==========================================
  // GROUPSUM SUITES & PRODUCTS
  // ==========================================
  {
    id: "groupsum-ssot-registry",
    slug: "ssot-registry",
    sourceName: "ssot-registry",
    displayName: "Single Source of Truth (SSOT) Registry",
    organization: "groupsum",
    kind: "suite",
    capabilityIds: ["governed-delivery", "dev-experience"],
    ecosystem: ["npm", "rust", "specification"],
    summary: "A version-controlled registry linking schemas, OpenAPI specifications, and communications.",
    audience: ["Delivery Operations Leads", "Platform Engineers"],
    maturity: "released",
    evidence: [
      { kind: "release", label: "v2.1.0-stable", checkedAt: "2026-07-20" },
      { kind: "live", label: "Active pipeline gate integration", checkedAt: "2026-07-20" }
    ],
    limitations: ["Requires continuous repository verification", "Initial setup needs schema anchoring"],
    links: [
      { kind: "source", label: "Public Repository", href: "https://github.com/groupsum/ssot-registry" },
      { kind: "docs", label: "Registry Documentation", href: "/portfolio/specifications/ssot-registry" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Rust", "TypeScript", "gRPC", "Protobuf", "PostgreSQL"]
  },
  {
    id: "groupsum-mdwrk",
    slug: "mdwrk",
    sourceName: "mdwrk",
    displayName: "MdWrk Markdown Workspace",
    organization: "groupsum",
    kind: "suite",
    capabilityIds: ["documents", "dev-experience"],
    ecosystem: ["npm", "web"],
    summary: "A structured, governed text-processing and rendering suite for enterprise documents and sites.",
    audience: ["Technical Writers", "Content Operators"],
    maturity: "released",
    evidence: [
      { kind: "release", label: "v1.4.2-stable", checkedAt: "2026-07-20" },
      { kind: "live", label: "Powering Groupsum digital surfaces", checkedAt: "2026-07-20" }
    ],
    limitations: ["Strictly layout-bounded", "No inline CSS/JS support in content parsing"],
    links: [
      { kind: "source", label: "Source repository", href: "https://github.com/groupsum/mdwrk" },
      { kind: "package", label: "npm registry", href: "https://npmjs.com/package/mdwrk" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Node.js", "Vite", "AST Parsing", "React", "Tailwind CSS"]
  },
  {
    id: "groupsum-bucketwarden",
    slug: "bucketwarden",
    sourceName: "bucketwarden",
    displayName: "BucketWarden",
    organization: "groupsum",
    kind: "product",
    suiteId: "groupsum-ssot-registry",
    capabilityIds: ["storage", "trust-policy"],
    ecosystem: ["web", "service"],
    summary: "Real-time automated storage auditor enforcing policy compliance on distributed cloud buckets.",
    audience: ["Cloud Architects", "Security Compliance Officers"],
    maturity: "released",
    evidence: [
      { kind: "live", label: "Auditing 4TB of active operational assets", checkedAt: "2026-07-20" },
      { kind: "release", label: "v3.0.1-certified", checkedAt: "2026-07-20" }
    ],
    limitations: ["Limited to AWS S3 and Google Cloud Storage APIs", "Event latency scales with mutation volume"],
    links: [
      { kind: "live", label: "Live audit console", href: "https://bucketwarden.groupsum.xyz" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Go", "Open Policy Agent", "CloudEvents", "S3 API"]
  },
  {
    id: "groupsum-pdfremed",
    slug: "pdfremed",
    sourceName: "pdfremed",
    displayName: "PDFRemed",
    organization: "groupsum",
    kind: "product",
    suiteId: "groupsum-mdwrk",
    capabilityIds: ["documents", "accessibility"],
    ecosystem: ["web", "service"],
    summary: "An accessibility remediation workbench and engine translating legacy documents to WCAG 2.2 AA.",
    audience: ["Accessibility Compliance Officers", "Librarians"],
    maturity: "active-development",
    evidence: [
      { kind: "live", label: "Active pilot with 500k financial statements", checkedAt: "2026-07-20" }
    ],
    limitations: ["Highly complex layouts require manual metadata overrides", "Scanned documents need OCR pre-processing"],
    links: [
      { kind: "docs", label: "Remediation specifications", href: "#" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Python", "PDFlib", "LayoutParser AI", "HTML5"]
  },
  {
    id: "groupsum-portwyrm",
    slug: "portwyrm",
    sourceName: "portwyrm",
    displayName: "Portwyrm Edge Proxy",
    organization: "groupsum",
    kind: "product",
    capabilityIds: ["storage", "trust-policy"],
    ecosystem: ["rust", "service"],
    summary: "Secure edge proxy stripping sensitive metadata and government ingress telemetry uniformly.",
    audience: ["Core Systems Engineers", "SecOps"],
    maturity: "released",
    evidence: [
      { kind: "live", label: "Production stable at 50M daily requests", checkedAt: "2026-07-20" }
    ],
    limitations: ["Proxy rules require WASM module recompilation", "High memory profile under burst traffic"],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Rust", "Envoy Proxy", "WebAssembly", "Prometheus"]
  },
  {
    id: "groupsum-trustsig",
    slug: "trustsig",
    sourceName: "trustsig",
    displayName: "TrustSig Cryptographic Signing",
    organization: "groupsum",
    kind: "product",
    capabilityIds: ["trust-policy", "governed-delivery"],
    ecosystem: ["web", "specification"],
    summary: "A cryptographic document signing boundary and verification oracle using decentralized identity.",
    audience: ["Security Operations Directors", "Notary Officers"],
    maturity: "released",
    evidence: [
      { kind: "live", label: "Securing over 1.2M validation gates", checkedAt: "2026-07-20" }
    ],
    limitations: ["Requires hardware security module (HSM) connection for production anchors", "Public key revocation has 1-minute caching latency"],
    links: [],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["TypeScript", "WebCrypto API", "PKCS#11", "OIDC"]
  },

  // ==========================================
  // TIGRBL API INFRASTRUCTURE SUITES
  // ==========================================
  {
    id: "tigrbl-framework",
    slug: "tigrbl",
    sourceName: "tigrbl",
    displayName: "Tigrbl API Framework",
    organization: "tigrbl",
    kind: "suite",
    capabilityIds: ["api-foundations", "dev-experience"],
    ecosystem: ["python"],
    summary: "Schema-first ASGI API development suite, from typing facades to pluggable execution engines.",
    audience: ["API Designers", "Back-end Developers"],
    maturity: "released",
    evidence: [
      { kind: "release", label: "v4.2.0-stable PyPI", checkedAt: "2026-07-20" },
      { kind: "docs", label: "Full spec and ORM documentation", checkedAt: "2026-07-20" }
    ],
    limitations: ["Strictly schema-first; dynamic interfaces require custom kernel hooks", "ASGI event patterns are non-blocking exclusive"],
    links: [
      { kind: "source", label: "GitHub Repo", href: "https://github.com/tigrbl/tigrbl" },
      { kind: "package", label: "PyPI Package", href: "https://pypi.org/project/tigrbl" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Python", "ASGI", "Typing Model", "Pydantic"]
  },
  {
    id: "tigrbl-auth",
    slug: "tigrbl-auth",
    sourceName: "tigrbl-auth",
    displayName: "Tigrbl Auth Protocol Suite",
    organization: "tigrbl",
    kind: "suite",
    capabilityIds: ["trust-policy", "api-foundations"],
    ecosystem: ["python", "web"],
    summary: "Multi-tenant authentication, cryptographic verification ceremonies, and authorization runtime.",
    audience: ["Identity Engineers", "Security Administrators"],
    maturity: "active-development",
    evidence: [
      { kind: "release", label: "v0.8.4-beta", checkedAt: "2026-07-20" }
    ],
    limitations: ["Not yet fully certified under standard OIDC profiles", "Requires explicit protocol storage implementations"],
    links: [],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Python", "OAuth2.0", "WebAuthn", "React", "JWT"]
  },
  {
    id: "tigrbl-tigrcorn",
    slug: "tigrcorn",
    sourceName: "tigrcorn",
    displayName: "Tigrcorn ASGI Server",
    organization: "tigrbl",
    kind: "suite",
    capabilityIds: ["realtime", "api-foundations"],
    ecosystem: ["python", "rust"],
    summary: "A ultra-low latency ASGI HTTP/3 & WebTransport container server for high-volume execution.",
    audience: ["Operations Engineers", "SREs"],
    maturity: "usable",
    evidence: [
      { kind: "release", label: "v1.1.0-usable", checkedAt: "2026-07-20" }
    ],
    limitations: ["HTTP/3 transport requires explicit TLS certificate anchoring", "WebTransport features depend on modern browser client support"],
    links: [
      { kind: "source", label: "Tigrcorn Repository", href: "https://github.com/tigrbl/tigrcorn" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Rust", "Python", "QUIC", "Tokio", "WebTransport"]
  },

  // ==========================================
  // SWARMAURI INTELLIGENCE & DEVELOPER TOOLING
  // ==========================================
  {
    id: "swarmauri-sdk",
    slug: "swarmauri-sdk",
    sourceName: "swarmauri-sdk",
    displayName: "Swarmauri SDK",
    organization: "swarmauri",
    kind: "suite",
    capabilityIds: ["ai-agents", "dev-experience"],
    ecosystem: ["python"],
    summary: "The primary SDK for composable AI models, multi-agent frameworks, conversations, and evaluations.",
    audience: ["AI Developers", "Software Architects"],
    maturity: "released",
    evidence: [
      { kind: "release", label: "v0.12.5-stable", checkedAt: "2026-07-20" },
      { kind: "package", label: "Active package with 300+ manifests", checkedAt: "2026-07-20" }
    ],
    limitations: ["Component structures are strictly bounded by typed standards", "High-volume loops require custom middleware scheduling"],
    links: [
      { kind: "source", label: "Swarmauri Github", href: "https://github.com/swarmauri/swarmauri-sdk" },
      { kind: "package", label: "PyPI Registry", href: "https://pypi.org/project/swarmauri" }
    ],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Python", "LLM APIs", "JSON Schema", "Vector DBs"]
  },
  {
    id: "swarmauri-peagen",
    slug: "peagen",
    sourceName: "peagen",
    displayName: "Peagen Code Generator",
    organization: "swarmauri",
    kind: "suite",
    capabilityIds: ["dev-experience", "ai-agents"],
    ecosystem: ["python", "npm"],
    summary: "Template and DAG-driven project workspace scaffold generator and service builder.",
    audience: ["Developer Experience Leads", "Platform engineers"],
    maturity: "usable",
    evidence: [
      { kind: "release", label: "v0.9.1-usable", checkedAt: "2026-07-20" }
    ],
    limitations: ["Requires strict package definition layouts", "Vue/React compilation depends on exact template profiles"],
    links: [],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["Python", "Jinja2", "CLI TUI", "YAML Compiler"]
  },

  // ==========================================
  // SUB-PACKAGES (SSOT, MdWrk, Tigrbl, Swarmauri)
  // ==========================================
  // SSOT Packages
  {
    id: "pkg-ssot-registry",
    slug: "pkg-ssot-registry",
    sourceName: "ssot-registry",
    displayName: "ssot-registry",
    organization: "groupsum",
    kind: "package",
    suiteId: "groupsum-ssot-registry",
    parentId: "groupsum-ssot-registry",
    capabilityIds: ["governed-delivery"],
    ecosystem: ["rust"],
    summary: "Primary registry core managing schema lifecycles and linear diff graphs.",
    audience: ["Specialist Developers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "Cargo Registry v2.1.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Rust"]
  },
  {
    id: "pkg-ssot-core",
    slug: "pkg-ssot-core",
    sourceName: "ssot-core",
    displayName: "ssot-core",
    organization: "groupsum",
    kind: "package",
    suiteId: "groupsum-ssot-registry",
    parentId: "groupsum-ssot-registry",
    capabilityIds: ["governed-delivery"],
    ecosystem: ["rust"],
    summary: "Base structures, validation traits, and parsing models for SSOT assets.",
    audience: ["Specialist Developers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "Cargo Registry v2.1.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Rust"]
  },
  {
    id: "pkg-ssot-cli",
    slug: "pkg-ssot-cli",
    sourceName: "ssot-cli",
    displayName: "ssot-cli",
    organization: "groupsum",
    kind: "package",
    suiteId: "groupsum-ssot-registry",
    parentId: "groupsum-ssot-registry",
    capabilityIds: ["governed-delivery"],
    ecosystem: ["npm"],
    summary: "Developer CLI surface for local contract testing, registry query, and schema assertion.",
    audience: ["Developers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "npm v2.1.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Node.js"]
  },
  {
    id: "pkg-ssot-contracts",
    slug: "pkg-ssot-contracts",
    sourceName: "ssot-contracts",
    displayName: "ssot-contracts",
    organization: "groupsum",
    kind: "package",
    suiteId: "groupsum-ssot-registry",
    parentId: "groupsum-ssot-registry",
    capabilityIds: ["governed-delivery"],
    ecosystem: ["specification"],
    summary: "Decoupled JSON schemas and protobuf specifications representing active service agreements.",
    audience: ["Architects"],
    maturity: "released",
    evidence: [{ kind: "release", label: "Artifact Bundle v2.1.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["JSON Schema", "Protobuf"]
  },

  // Governance Packs (Groupsum Specifications)
  {
    id: "spec-seo-aeo-aieo-pack",
    slug: "seo-aeo-aieo-governance-pack",
    sourceName: "seo-aeo-aieo-governance-pack",
    displayName: "SEO/AEO/AIEO Governance Pack",
    organization: "groupsum",
    kind: "specification-pack",
    capabilityIds: ["trust-policy", "dev-experience"],
    ecosystem: ["specification"],
    summary: "A robust set of schemas, structured JSON-LD rules, and markdown structures to maximize LLM crawler confidence.",
    audience: ["SEO Specialists", "Marketing Engineers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "Spec Pack Stable v1.1", checkedAt: "2026-07-20" }],
    limitations: ["Compliance depends on visual alignment", "Requires strict meta tag uniformity"],
    links: [],
    featured: true,
    approved: true,
    disposition: "public",
    technologies: ["JSON-LD", "Schema.org", "XML Sitemap"]
  },
  {
    id: "spec-authentication-pack",
    slug: "authentication-governance-pack",
    sourceName: "authentication-governance-pack",
    displayName: "Authentication Governance Pack",
    organization: "groupsum",
    kind: "specification-pack",
    capabilityIds: ["trust-policy"],
    ecosystem: ["specification"],
    summary: "Standardized decision trees and compliance policies for multi-factor authenticator setup.",
    audience: ["Security Officers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "Spec Pack v2.4", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["OIDC", "FIDO2"]
  },
  {
    id: "spec-privacy-pack",
    slug: "privacy-governance-records-governance-pack",
    sourceName: "privacy-governance-records-governance-pack",
    displayName: "Privacy Records Governance Pack",
    organization: "groupsum",
    kind: "specification-pack",
    capabilityIds: ["trust-policy"],
    ecosystem: ["specification"],
    summary: "Data catalog layouts and retention covenants mapping compliance assertions to live evidence structures.",
    audience: ["GDPR Officers", "Data Custodians"],
    maturity: "released",
    evidence: [{ kind: "release", label: "Spec Pack v1.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["GDPR Compliance", "Metadata Schema"]
  },

  // Tigrbl Packages
  {
    id: "pkg-tigrbl-typing",
    slug: "tigrbl-typing",
    sourceName: "tigrbl-typing",
    displayName: "tigrbl-typing",
    organization: "tigrbl",
    kind: "package",
    suiteId: "tigrbl-framework",
    parentId: "tigrbl-framework",
    capabilityIds: ["api-foundations"],
    ecosystem: ["python"],
    summary: "Strict type declarations and stub definitions underpinning the schema core.",
    audience: ["Library Users"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI release v4.2.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python Types"]
  },
  {
    id: "pkg-tigrbl-spec",
    slug: "tigrbl-spec",
    sourceName: "tigrbl_spec",
    displayName: "tigrbl_spec",
    organization: "tigrbl",
    kind: "package",
    suiteId: "tigrbl-framework",
    parentId: "tigrbl-framework",
    capabilityIds: ["api-foundations"],
    ecosystem: ["python"],
    summary: "API specification parsing, openapi compiler, and diagnostic tools.",
    audience: ["Library Users"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI release v4.2.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Pydantic", "Python"]
  },
  {
    id: "pkg-tigrbl-core",
    slug: "pkg-tigrbl-core",
    sourceName: "tigrbl-core",
    displayName: "tigrbl-core",
    organization: "tigrbl",
    kind: "package",
    suiteId: "tigrbl-framework",
    parentId: "tigrbl-framework",
    capabilityIds: ["api-foundations"],
    ecosystem: ["python"],
    summary: "Engine interface contracts, ASGI middleware dispatcher, and request lifecycle scheduler.",
    audience: ["Library Users"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI release v4.2.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python", "ASGI"]
  },
  {
    id: "pkg-tigrbl-orm",
    slug: "pkg-tigrbl-orm",
    sourceName: "tigrbl-orm",
    displayName: "tigrbl-orm",
    organization: "tigrbl",
    kind: "package",
    suiteId: "tigrbl-framework",
    parentId: "tigrbl-framework",
    capabilityIds: ["api-foundations"],
    ecosystem: ["python"],
    summary: "Schema-first database model declarations with atomic operation hooks.",
    audience: ["Library Users"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI release v4.2.0", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python", "SQLAlchemy Engine"]
  },

  // Swarmauri Packages
  {
    id: "pkg-swarmauri-contracts",
    slug: "swarmauri-contracts",
    sourceName: "swarmauri-contracts",
    displayName: "swarmauri-contracts",
    organization: "swarmauri",
    kind: "package",
    suiteId: "swarmauri-sdk",
    parentId: "swarmauri-sdk",
    capabilityIds: ["ai-agents"],
    ecosystem: ["python"],
    summary: "Base protocols, entity signatures, and evaluation contracts.",
    audience: ["SDK Integrators"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI v0.12.5", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python Typing"]
  },
  {
    id: "pkg-swarmauri-standard",
    slug: "swarmauri-standard",
    sourceName: "swarmauri-standard",
    displayName: "swarmauri-standard",
    organization: "swarmauri",
    kind: "package",
    suiteId: "swarmauri-sdk",
    parentId: "swarmauri-sdk",
    capabilityIds: ["ai-agents"],
    ecosystem: ["python"],
    summary: "Core components including conversational managers, prompt parsers, and distance solvers.",
    audience: ["SDK Integrators"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI v0.12.5", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python", "Numerical Solvers"]
  },
  {
    id: "pkg-swarmauri-vector-store",
    slug: "swarmauri-vector-store",
    sourceName: "swarmauri_vector_store",
    displayName: "swarmauri_vector_store",
    organization: "swarmauri",
    kind: "package",
    suiteId: "swarmauri-sdk",
    parentId: "swarmauri-sdk",
    capabilityIds: ["ai-agents"],
    ecosystem: ["python"],
    summary: "Pluggable cosine and euclidean similarity vector store abstractions.",
    audience: ["AI Developers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI v0.12.5", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python", "Numpy"]
  },
  {
    id: "pkg-swarmauri-signing-ed25519",
    slug: "swarmauri-signing-ed25519",
    sourceName: "swarmauri_signing_ed25519",
    displayName: "swarmauri_signing_ed25519",
    organization: "swarmauri",
    kind: "package",
    suiteId: "swarmauri-sdk",
    parentId: "swarmauri-sdk",
    capabilityIds: ["trust-policy"],
    ecosystem: ["python"],
    summary: "Ed25519 cryptographic token generation and proof-of-possession validators.",
    audience: ["AI Security Engineers"],
    maturity: "released",
    evidence: [{ kind: "release", label: "PyPI v0.12.5", checkedAt: "2026-07-20" }],
    limitations: [],
    links: [],
    featured: false,
    approved: true,
    disposition: "public",
    technologies: ["Python", "Cryptography"]
  },
  {
    id: "groupsum-voltrack", slug: "voltrack", sourceName: "voltrack", displayName: "Voltrack", organization: "groupsum", kind: "project", capabilityIds: ["infrastructure", "dev-experience"], ecosystem: ["web", "service"], summary: "A multi-app operational tracking workspace with local-first and remotely synchronized Tigrbl modes.", audience: ["Operations teams", "Platform engineers"], maturity: "active-development", evidence: [{ kind: "source", label: "Repository architecture and runtime modes", checkedAt: "2026-07-20" }], limitations: ["Public release and customer deployment require separate evidence"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/voltrack" }], featured: false, approved: true, disposition: "public", technologies: ["React", "Tigrbl", "JSON-RPC", "IndexedDB"]
  },
  {
    id: "groupsum-dcim-rack-planner", slug: "dcim-rack-planner", sourceName: "dcim-rack-planner", displayName: "DCIM Rack Planner", organization: "groupsum", kind: "project", capabilityIds: ["infrastructure"], ecosystem: ["web", "service"], summary: "Planning and visualization workspace for facilities, racks, devices, cabling, topology, and capacity.", audience: ["Infrastructure planners", "Data-center operators"], maturity: "active-development", evidence: [{ kind: "source", label: "Rack, facility, topology, and provisioning surfaces", checkedAt: "2026-07-20" }], limitations: ["Do not imply production inventory scale without deployment evidence"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/dcim-rack-planner" }], featured: false, approved: true, disposition: "public", technologies: ["React", "Vite", "Tigrbl", "Topology"]
  },
  {
    id: "groupsum-dcim-fiber-planner", slug: "dcim-fiber-planner", sourceName: "dcim-fiber-planner", displayName: "DCIM Fiber Planner", organization: "groupsum", kind: "project", capabilityIds: ["infrastructure", "realtime"], ecosystem: ["web", "service"], summary: "Fiber, optical, cabling, and transport planning workspace for infrastructure teams.", audience: ["Network planners", "Infrastructure operators"], maturity: "active-development", evidence: [{ kind: "source", label: "Fiber and optical planning client with backend proxy modes", checkedAt: "2026-07-20" }], limitations: ["Carrier-grade and commercial availability claims require approval"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/dcim-fiber-planner" }], featured: false, approved: true, disposition: "public", technologies: ["React", "Vite", "FastAPI", "Optical planning"]
  },
  {
    id: "groupsum-deliverableops", slug: "deliverableops", sourceName: "deliverableops", displayName: "DeliverableOps", organization: "groupsum", kind: "product", capabilityIds: ["governed-delivery", "trust-policy"], ecosystem: ["python", "service"], summary: "SKU-to-digital-deliverable fulfillment runtime connecting workflow runs, artifacts, evidence, proof, delivery, and acceptance.", audience: ["Delivery operations", "Platform teams"], maturity: "active-development", evidence: [{ kind: "source", label: "Tigrbl/Tigrcorn runtime and bundle validation", checkedAt: "2026-07-20" }], limitations: ["Example bundles and CI evidence are not customer adoption"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/deliverableops" }], featured: false, approved: true, disposition: "public", technologies: ["Python", "Tigrbl", "Tigrcorn", "GitHub Actions"]
  },
  {
    id: "groupsum-cc-deliverable-ops", slug: "cc-deliverable-ops", sourceName: "confidential-workloads-delivery-ops", displayName: "CC Deliverable Ops", organization: "groupsum", kind: "project", capabilityIds: ["governed-delivery", "trust-policy"], ecosystem: ["python", "service"], summary: "Attestation-bound confidential workload release with proof-of-possession, ciphertext-only delivery, and signed receipts.", audience: ["Security engineering", "Confidential-computing operators"], maturity: "active-development", evidence: [{ kind: "source", label: "GCP Confidential Space and receipt verification workflow", checkedAt: "2026-07-20" }], limitations: ["Do not claim certification, capacity, or customer availability without qualifying evidence"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/confidential-workloads-delivery-ops" }], featured: false, approved: true, disposition: "public", technologies: ["Python", "GCP Confidential Space", "OIDC", "ECDH"]
  },
  {
    id: "groupsum-evidencevault", slug: "evidencevault", sourceName: "evidencevault", displayName: "EvidenceVault", organization: "groupsum", kind: "product", capabilityIds: ["storage", "trust-policy"], ecosystem: ["python", "web", "service"], summary: "Forensic evidence custody workspace for sealed bundles, audit trails, disclosure policies, and independent verification.", audience: ["Security teams", "Auditors", "Evidence custodians"], maturity: "active-development", evidence: [{ kind: "source", label: "Vault, verifier, storage, crypto, and local object-storage surfaces", checkedAt: "2026-07-20" }], limitations: ["BucketWarden integration is not confirmed by the inspected source"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/evidencevault" }], featured: false, approved: true, disposition: "public", technologies: ["React", "FastAPI", "IndexedDB", "MinIO"]
  },
  {
    id: "groupsum-npmctl", slug: "npmctl", sourceName: "npmctl", displayName: "npmctl", organization: "groupsum", kind: "product", capabilityIds: ["governed-delivery", "infrastructure"], ecosystem: ["python", "service"], summary: "Owner-scoped GitOps controller for declarative Nginx Proxy Manager operations.", audience: ["Platform engineers", "Release operators"], maturity: "released", evidence: [{ kind: "docs", label: "Public repository documentation and release history", checkedAt: "2026-07-20" }], limitations: ["Repository capability does not establish live installation health"], links: [{ kind: "source", label: "Source repository", href: "https://github.com/groupsum/npmctl" }], featured: false, approved: true, disposition: "public", technologies: ["Python", "YAML", "GitOps", "Nginx Proxy Manager"]
  },];
