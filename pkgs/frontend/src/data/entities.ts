import { PortfolioEntity } from "../types";

// Catalog claims are intentionally limited to facts that can be checked in a
// public repository. Source availability does not imply a hosted service,
// customer adoption, production readiness, certification, or support terms.
const checkedAt = "2026-08-02";

export const portfolioEntities: PortfolioEntity[] = [
  {
    id: "groupsum-ssot-registry", slug: "ssot-registry", sourceName: "ssot-registry", displayName: "SSOT Registry",
    organization: "groupsum", kind: "product", capabilityIds: ["governed-delivery", "dev-experience"], ecosystem: ["python"],
    summary: "Repository-agnostic Python CLI for tracing features and requirements to implementation, tests, evidence, and release state.",
    audience: ["Platform engineers", "Release engineers"], maturity: "maintained",
    evidence: [{ kind: "source", label: "Public repository and CLI documentation reviewed", checkedAt }],
    limitations: ["Repository evidence does not establish a live hosted service or third-party certification."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/groupsum/ssot-registry" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "CLI", "YAML", "JSON"],
    claimBoundary: "Source and documentation evidence only."
  },
  {
    id: "groupsum-mdwrk", slug: "mdwrk", sourceName: "mdwrk", displayName: "MdWrk",
    organization: "groupsum", kind: "suite", capabilityIds: ["documents", "dev-experience"], ecosystem: ["npm", "web"],
    summary: "Package platform for Markdown rendering, editing, extension contracts, extension runtimes, and shared primitives.",
    audience: ["Documentation teams", "Frontend engineers"], maturity: "maintained",
    evidence: [{ kind: "source", label: "Public core and Pages repositories reviewed", checkedAt }],
    limitations: ["Capabilities vary by package; no throughput, scale, or customer-use claim is made."],
    links: [{ kind: "source", label: "Core repository", href: "https://github.com/groupsum/mdwrk" }, { kind: "source", label: "Pages repository", href: "https://github.com/groupsum/mdwrk-pages" }],
    featured: true, approved: true, disposition: "public-grouped", technologies: ["TypeScript", "React", "Markdown"],
    claimBoundary: "Public source and repository documentation only."
  },
  {
    id: "groupsum-markdown-workspace", slug: "markdown_workspace", sourceName: "markdown_workspace", displayName: "Markdown Workspace",
    organization: "groupsum", kind: "application", parentId: "groupsum-mdwrk", capabilityIds: ["documents", "dev-experience"], ecosystem: ["npm", "web"],
    summary: "Local-first Markdown workspace with preview editing, packages, and an extension host for portable authoring.",
    audience: ["Writers", "Developers"], maturity: "maintained",
    evidence: [{ kind: "source", label: "Public repository description and implementation reviewed", checkedAt }],
    limitations: ["Public source does not establish hosted availability or service-level commitments."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/groupsum/markdown_workspace" }],
    featured: false, approved: true, disposition: "public", technologies: ["TypeScript", "React", "Markdown"]
  },
  {
    id: "groupsum-npmctl", slug: "npmctl", sourceName: "npmctl", displayName: "npmctl",
    organization: "groupsum", kind: "product", capabilityIds: ["governed-delivery", "infrastructure"], ecosystem: ["python", "service"],
    summary: "Owner-scoped GitOps controller for Nginx Proxy Manager proxy hosts, certificates, and access lists.",
    audience: ["Platform engineers", "Release operators"], maturity: "maintained",
    evidence: [{ kind: "source", label: "Public repository, tests, and desired-state examples reviewed", checkedAt }],
    limitations: ["A repository and test suite do not prove the health of any particular installation."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/groupsum/npmctl" }, { kind: "docs", label: "Product site", href: "https://npmctl.com" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "YAML", "GitOps", "Nginx Proxy Manager"]
  },
  {
    id: "groupsum-portwyrm", slug: "portwyrm", sourceName: "portwyrm", displayName: "Portwyrm",
    organization: "groupsum", kind: "product", capabilityIds: ["infrastructure", "operator-boundaries"], ecosystem: ["python", "web", "service"],
    summary: "Self-hosted reverse-proxy control plane and UI designed around npmctl-compatible operations.",
    audience: ["Self-hosters", "Platform operators"], maturity: "active-development",
    evidence: [{ kind: "source", label: "Public repository, API surface, and deployment configuration reviewed", checkedAt }],
    limitations: ["Active development; public source does not establish a supported hosted service."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/groupsum/portwyrm" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "FastAPI", "React", "Docker"]
  },
  {
    id: "bucketwarden-platform", slug: "bucketwarden", sourceName: "bucketwarden-platform", displayName: "BucketWarden",
    organization: "groupsum", kind: "product", capabilityIds: ["storage", "trust-policy"], ecosystem: ["rust", "service"],
    summary: "Storage-governance platform source spanning policy, evidence, deployment profiles, and operator workflows.",
    audience: ["Cloud platform teams", "Storage operators"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local platform source, tests, and deployment profiles reviewed", checkedAt }],
    limitations: ["No storage volume, customer adoption, certification, or live-service claim is made."],
    links: [{ kind: "docs", label: "Product site", href: "https://bucketwarden.com" }],
    featured: true, approved: true, disposition: "public-grouped", technologies: ["Rust", "TypeScript", "Policy", "Evidence"]
  },
  {
    id: "groupsum-pdfremed", slug: "pdfremed", sourceName: "pdfremed", displayName: "PDFRemed",
    organization: "groupsum", kind: "product", capabilityIds: ["documents", "accessibility"], ecosystem: ["python", "web"],
    summary: "Workbench and service code for inspecting, planning, and performing PDF accessibility remediation.",
    audience: ["Document accessibility teams", "Developers"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local source, schemas, and test plans reviewed", checkedAt }],
    limitations: ["No automated conformance guarantee, production volume, or active-customer claim is made."],
    links: [], featured: true, approved: true, disposition: "public-grouped", technologies: ["Python", "PDF", "React", "Accessibility"]
  },
  {
    id: "tigrbl-framework", slug: "tigrbl", sourceName: "tigrbl", displayName: "Tigrbl",
    organization: "tigrbl", kind: "suite", capabilityIds: ["api-foundations"], ecosystem: ["python", "rust"],
    summary: "Schema-first Python and Rust workspace for REST and JSON-RPC APIs with typed validation, SQLAlchemy models, and engine-backed execution.",
    audience: ["Backend engineers", "Platform engineers"], maturity: "maintained",
    evidence: [{ kind: "source", label: "Public repository description, packages, tests, and examples reviewed", checkedAt }],
    limitations: ["No performance benchmark or enterprise-adoption claim is made."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/tigrbl/tigrbl" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "Rust", "ASGI", "SQLAlchemy"]
  },
  {
    id: "tigrbl-auth", slug: "tigrbl-auth", sourceName: "tigrbl_auth", displayName: "Tigrbl Auth",
    organization: "tigrbl", kind: "product", capabilityIds: ["trust-policy", "api-foundations"], ecosystem: ["python", "service"],
    summary: "Tigrbl-native multi-tenant OpenID Connect and OAuth 2.0 identity-provider workspace with JWKS/JWT and operator controls.",
    audience: ["Identity engineers", "Platform teams"], maturity: "active-development",
    evidence: [{ kind: "source", label: "Public repository and protocol implementation reviewed", checkedAt }],
    limitations: ["Implementation evidence is not a security certification or interoperability certification."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/tigrbl/tigrbl_auth" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "OIDC", "OAuth 2.0", "JWT"]
  },
  {
    id: "tigrbl-tigrcorn", slug: "tigrcorn", sourceName: "tigrcorn", displayName: "Tigrcorn",
    organization: "tigrbl", kind: "product", capabilityIds: ["realtime", "api-foundations"], ecosystem: ["python", "rust", "service"],
    summary: "ASGI3 server with HTTP/1.1, HTTP/2, HTTP/3, QUIC, WebSocket, TLS, static delivery, and release validation in its public source.",
    audience: ["ASGI developers", "Platform engineers"], maturity: "active-development",
    evidence: [{ kind: "source", label: "Public repository, protocol modules, and validation workflow reviewed", checkedAt }],
    limitations: ["Protocol support does not imply a universal latency or throughput result."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/tigrbl/tigrcorn" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "ASGI", "HTTP/3", "WebTransport"]
  },
  {
    id: "swarmauri-sdk", slug: "swarmauri-sdk", sourceName: "swarmauri-sdk", displayName: "Swarmauri SDK",
    organization: "swarmauri", kind: "suite", capabilityIds: ["ai-agents", "dev-experience"], ecosystem: ["python"],
    summary: "Modular Python SDK and monorepo for agents, model integrations, tools, parsers, embeddings, vector stores, and application workflows.",
    audience: ["AI application developers", "Python developers"], maturity: "maintained",
    evidence: [{ kind: "source", label: "Public monorepo, package layout, and tests reviewed", checkedAt }],
    limitations: ["Model quality, cost, and availability depend on selected providers and application-specific evaluation."],
    links: [{ kind: "source", label: "Public repository", href: "https://github.com/swarmauri/swarmauri-sdk" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "LLM integrations", "Tools", "Vector stores"]
  },
  {
    id: "swarmauri-peagen", slug: "peagen", sourceName: "peagen", displayName: "Peagen",
    organization: "swarmauri", kind: "product", capabilityIds: ["dev-experience", "ai-agents"], ecosystem: ["python", "service"],
    summary: "Template-driven code-generation workspace for DAG/Jinja2 rendering, CLI workflows, and gateway/worker services.",
    audience: ["Developer-experience teams", "Python developers"], maturity: "active-development",
    evidence: [{ kind: "source", label: "Public website source, documentation, and SDK integration marker reviewed", checkedAt }],
    limitations: [
      "Generated output still requires project-specific review, testing, and ownership.",
      "No public core implementation repository, API, demo, example, or showcase is verified in the current catalog."
    ],
    links: [{ kind: "source", label: "Public website source", href: "https://github.com/swarmauri/peagen-com" }],
    featured: true, approved: true, disposition: "public", technologies: ["Python", "Jinja2", "DAGs", "CLI"]
  },
  {
    id: "groupsum-voltrack", slug: "voltrack", sourceName: "voltrack", displayName: "Voltrack",
    organization: "groupsum", kind: "project", capabilityIds: ["infrastructure", "dev-experience"], ecosystem: ["web", "service"],
    summary: "Operational tracking workspace with local-first and Tigrbl-backed application modes in the inspected source.",
    audience: ["Operations teams", "Platform engineers"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local repository architecture and runtime modes reviewed", checkedAt }],
    limitations: ["No public release or deployment claim is made."], links: [], featured: false, approved: true, disposition: "review-required", technologies: ["React", "Tigrbl", "IndexedDB"]
  },
  {
    id: "groupsum-dcim-rack-planner", slug: "dcim-rack-planner", sourceName: "dcim-rack-planner", displayName: "DCIM Rack Planner",
    organization: "groupsum", kind: "project", capabilityIds: ["infrastructure"], ecosystem: ["web", "service"],
    summary: "Planning workspace for facilities, racks, devices, cabling, topology, and capacity in the inspected source.",
    audience: ["Infrastructure planners", "Data-center operators"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local planning surfaces and schemas reviewed", checkedAt }],
    limitations: ["No production inventory scale or public availability claim is made."], links: [], featured: false, approved: true, disposition: "review-required", technologies: ["React", "Vite", "Tigrbl"]
  },
  {
    id: "groupsum-dcim-fiber-planner", slug: "dcim-fiber-planner", sourceName: "dcim-fiber-planner", displayName: "DCIM Fiber Planner",
    organization: "groupsum", kind: "project", capabilityIds: ["infrastructure", "realtime"], ecosystem: ["web", "service"],
    summary: "Fiber, optical, cabling, and transport planning workspace in the inspected source.",
    audience: ["Network planners", "Infrastructure operators"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local fiber and optical planning surfaces reviewed", checkedAt }],
    limitations: ["No carrier-grade, commercial-availability, or production claim is made."], links: [], featured: false, approved: true, disposition: "review-required", technologies: ["React", "FastAPI", "Optical planning"]
  },
  {
    id: "groupsum-deliverableops", slug: "deliverableops", sourceName: "deliverableops", displayName: "DeliverableOps",
    organization: "groupsum", kind: "project", capabilityIds: ["governed-delivery", "trust-policy"], ecosystem: ["python", "service"],
    summary: "Source workspace connecting workflow runs, artifacts, evidence, delivery, and acceptance records.",
    audience: ["Delivery operations", "Platform teams"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local runtime, bundle, and validation source reviewed", checkedAt }],
    limitations: ["Examples and tests are not evidence of customer adoption or a hosted service."], links: [], featured: false, approved: true, disposition: "review-required", technologies: ["Python", "Tigrbl", "GitHub Actions"]
  },
  {
    id: "groupsum-cc-deliverable-ops", slug: "cc-deliverable-ops", sourceName: "confidential-workloads-delivery-ops", displayName: "Confidential Workloads Delivery Ops",
    organization: "groupsum", kind: "project", capabilityIds: ["governed-delivery", "trust-policy"], ecosystem: ["python", "service"],
    summary: "Confidential-workload delivery source with attestation, proof-of-possession, encrypted delivery, and signed receipt workflows.",
    audience: ["Security engineers", "Confidential-computing operators"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local implementation, tests, and deployment evidence model reviewed", checkedAt }],
    limitations: ["Repository validation is separate from a currently reachable public service, customer availability, or third-party certification."], links: [], featured: false, approved: true, disposition: "review-required", technologies: ["Python", "GCP Confidential Space", "OIDC", "ECDH"]
  },
  {
    id: "groupsum-evidencevault", slug: "evidencevault", sourceName: "evidencevault", displayName: "EvidenceVault",
    organization: "groupsum", kind: "project", capabilityIds: ["storage", "trust-policy"], ecosystem: ["python", "web", "service"],
    summary: "Evidence-custody workspace source covering sealed bundles, audit trails, disclosure policy, and verification.",
    audience: ["Security teams", "Auditors", "Evidence custodians"], maturity: "active-development",
    evidence: [{ kind: "implementation", label: "Local vault, verifier, storage, and UI source reviewed", checkedAt }],
    limitations: ["No hosted availability, integration, or independent assurance claim is made."], links: [], featured: false, approved: true, disposition: "review-required", technologies: ["React", "FastAPI", "IndexedDB", "MinIO"]
  }
];
