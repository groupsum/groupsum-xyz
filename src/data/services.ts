/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem } from "../types";

export const servicesData: ServiceItem[] = [
  {
    id: "product-portfolio-architecture",
    slug: "product-portfolio-architecture",
    title: "Product & Portfolio Architecture",
    audience: "Enterprise Technology Executives, Portfolio Directors, Brand Officers",
    usefulWhen: [
      "Defining clear product boundaries across independent brand acquisitions",
      "Struggling with multi-entity engineering taxonomies",
      "Experiencing public messaging confusion regarding open-source vs. proprietary commercial assets"
    ],
    typicalOutputs: [
      "Ecosystem topology and organization boundary specifications",
      "Product roadmap alignment guidelines",
      "Verifiable claims-modeling structure mapping source code to public marketing claims"
    ],
    inputs: [
      "Existing project repositories and dependency manifests",
      "Corporate marketing strategy documentation",
      "Current-state deployment and license logs"
    ],
    scope: [
      "Deep audit of all organization-owned software interfaces",
      "Mapping product suites, packages, and application categories",
      "Drafting continuous alignment and publication rules"
    ],
    engagementShape: "4-week collaborative executive advisory and system taxonomy workshop.",
    exclusions: [
      "Direct code modification of unrelated products",
      "Creation of legal corporate documents (such as IP or merger agreements)"
    ],
    relatedWorkSlugs: ["ssot-registry"],
    cta: "Align your product ecosystem today"
  },
  {
    id: "architecture-adr-specification",
    slug: "architecture-adr-specification",
    title: "Architecture, ADR, and Specification Delivery",
    audience: "Principal Architects, Tech Leads, Engineering Directors",
    usefulWhen: [
      "Initiating critical multi-team software transitions with high design ambiguity",
      "Lacking formal Architectural Decision Records (ADRs) to govern key technical gates",
      "API specs are modified arbitrarily without team consensus"
    ],
    typicalOutputs: [
      "Formatted Architectural Decision Records with cryptographic audit trails",
      "Concrete multi-language interface specifications (OpenAPI, Protobuf)",
      "Strict schema-first compliance policies"
    ],
    inputs: [
      "High-level system diagrams or design goals",
      "Existing API endpoint samples",
      "Compliance requirements (GDPR, SOC2, etc.)"
    ],
    scope: [
      "Advisory sessions with engineering leads",
      "Drafting complete interface contracts",
      "Setting up ADR repository and automated linter checks"
    ],
    engagementShape: "Staged technical delivery sprints, typically 3 to 5 weeks.",
    exclusions: [
      "Long-term application feature development",
      "Cloud resource provisioning (provided under Delivery Operations)"
    ],
    relatedWorkSlugs: ["seo-aeo-aieo-governance-pack", "authentication-governance-pack"],
    cta: "Secure your architecture with governed specifications"
  },
  {
    id: "api-platform-engineering",
    slug: "api-platform-engineering",
    title: "API and Platform Engineering",
    audience: "Engineering Managers, Platform Leads, Backend Developers",
    usefulWhen: [
      "Rebuilding legacy monolith APIs into high-performance, non-blocking microservices",
      "Requiring low-overhead, typed REST or JSON-RPC server frameworks",
      "Establishing pluggable database and cache engine wrappers"
    ],
    typicalOutputs: [
      "Production-ready ASGI core microservices",
      "Type-safe ORM schemas and connection pools",
      "Edge routing configurations and rate-limiting modules"
    ],
    inputs: [
      "Legacy backend source code",
      "Database schema catalogs",
      "Target request throughput requirements"
    ],
    scope: [
      "Refactoring API logic to schema-first patterns",
      "Writing pluggable storage engine adapters (Postgres, Redis, files)",
      "Tuning ASGI servers for high-concurrent request loads"
    ],
    engagementShape: "Full-lifecycle platform engineering, typically 8 to 12 weeks.",
    exclusions: [
      "Bespoke mobile application frontend building",
      "Manual data entry of legacy catalogs"
    ],
    relatedWorkSlugs: ["tigrbl", "tigrcorn"],
    cta: "Deploy a high-concurrency schema-first platform"
  },
  {
    id: "sdk-package-ecosystem",
    slug: "sdk-package-ecosystem",
    title: "SDK and Package Ecosystem Engineering",
    audience: "Open Source Maintainers, Developer Experience Managers, Library Architects",
    usefulWhen: [
      "Managing massive multi-package codebases with complex dependency graphs",
      "Needing to split monolithic codebases into reusable standard, community, and experimental packages",
      "Requiring clear, typed library boundaries and multi-language client SDK wrappers"
    ],
    typicalOutputs: [
      "Structured mono-repository with automated dependency resolution",
      "PyPI, npm, or Cargo publication pipelines",
      "Fully typed class facades and interface stubs"
    ],
    inputs: [
      "Monolithic codebases to be modularized",
      "Current dependency manifests",
      "Target developer workflows"
    ],
    scope: [
      "Refactoring code into standard base classes and plugin schemas",
      "Creating automated pre-publication validation scripts",
      "Scaffolding API reference portals from type comments"
    ],
    engagementShape: "Targeted library restructuring campaigns, usually 6 weeks.",
    exclusions: [
      "Marketing and promotion of open-source packages",
      "Direct technical support for community package users"
    ],
    relatedWorkSlugs: ["swarmauri-sdk", "tigrbl"],
    cta: "Modularize your library into a professional package ecosystem"
  },
  {
    id: "ai-agent-application",
    slug: "ai-agent-application",
    title: "AI and Agent Application Engineering",
    audience: "Product Managers, AI Engineers, R&D Directors",
    usefulWhen: [
      "Moving beyond basic prompt engineering into robust, self-correcting multi-agent loops",
      "Implementing retrieval-augmented generation (RAG) over dense corporate vaults",
      "Systematically evaluating model outputs for compliance, accuracy, and latency"
    ],
    typicalOutputs: [
      "Structured multi-agent coordination pipelines",
      "Optimized vector embeddings and retrieval algorithms",
      "Custom evaluation suites and benchmark reports"
    ],
    inputs: [
      "Target domain documentation and text corpuses",
      "Preferred model provider credentials",
      "Accuracy benchmark criteria"
    ],
    scope: [
      "Developing agent control structures (conversations, tools, chains)",
      "Building high-accuracy vector chunking pipelines",
      "Integrating automated performance logging and evaluation filters"
    ],
    engagementShape: "8-week feature-staged agile sprint.",
    exclusions: [
      "Training custom foundation LLMs from raw weights",
      "Provisioning private high-performance GPU clusters"
    ],
    relatedWorkSlugs: ["swarmauri-sdk", "peagen"],
    cta: "Build trace-governed agent systems with verified accuracy"
  },
  {
    id: "identity-auth-trust",
    slug: "identity-auth-trust",
    title: "Identity, Authorization, and Trust Engineering",
    audience: "Security Architects, Compliance Officers, IAM Leads",
    usefulWhen: [
      "Implementing multi-tenant authentication protocols",
      "Enforcing cryptographically verifiable corporate signatures on electronic documents",
      "Moving security policies out of application code into auditable, decoupled rules"
    ],
    typicalOutputs: [
      "Secure multi-factor authenticator endpoints",
      "Decoupled policy-as-code evaluation boundaries",
      "Cryptographic signing and notary audit servers"
    ],
    inputs: [
      "Corporate security and compliance manuals",
      "Current IAM configurations (Okta, Active Directory)",
      "Target document formats requiring validation"
    ],
    scope: [
      "Writing clean OAuth2.0, WebAuthn, or OIDC controllers",
      "Configuring hardware security module (HSM) signing wrappers",
      "Authoring explicit linter policies for continuous verification"
    ],
    engagementShape: "6-week security hardening sprint.",
    exclusions: [
      "Legal responsibility for security breaches",
      "Physical guard operations or hardware installation"
    ],
    relatedWorkSlugs: ["tigrbl-auth", "trustsig"],
    cta: "Harden your systems with cryptographic trust"
  },
  {
    id: "data-storage-transfer",
    slug: "data-storage-transfer",
    title: "Data, Storage, and Transfer Engineering",
    audience: "Data Architects, SREs, Security Compliance Officers",
    usefulWhen: [
      "Operating storage infrastructure under strict public/private separation rules",
      "Experiencing slow, unmonitored object mutations in cloud buckets",
      "Needing to sanitize PII and sensitive headers at the edge of the network"
    ],
    typicalOutputs: [
      "Real-time bucket auditing and automated quarantine daemons",
      "WASM-based edge proxies for header sanitization",
      "Version-controlled secure database backup setups"
    ],
    inputs: [
      "Cloud platform architecture maps",
      "Compliance rules defining sensitive metadata",
      "Active bucket storage metrics"
    ],
    scope: [
      "Deploying event-driven security checkers (e.g., BucketWarden)",
      "Configuring low-latency proxy filters (e.g., Portwyrm WASM)",
      "Securing analytical data lakes with uniform schemas"
    ],
    engagementShape: "4-week storage compliance sprint.",
    exclusions: [
      "Payment of cloud hosting bills",
      "Long-term physical hard drive retrieval operations"
    ],
    relatedWorkSlugs: ["bucketwarden", "portwyrm"],
    cta: "Audit and defend your distributed cloud storage"
  },
  {
    id: "document-accessibility-remediation",
    slug: "document-accessibility-remediation",
    title: "Document and Accessibility Engineering",
    audience: "Technical Documentation Managers, DEI Directors, Web Platform Leads",
    usefulWhen: [
      "Facing legal or corporate mandates for WCAG 2.2 AA document compliance",
      "Operating high-volume PDF creation pipelines that output non-accessible tags",
      "Needing custom visual editors or theme systems designed around readability and quiet focus"
    ],
    typicalOutputs: [
      "Automated tag-tree remediation workflows",
      "Reading-order layout parsers",
      "Quiet, accessible Markdown editing and publishing surfaces"
    ],
    inputs: [
      "Sample non-compliant PDFs or templates",
      "Corporate editorial style guides",
      "Web accessibility target checklists"
    ],
    scope: [
      "Integrating layout-parsing algorithms with PDF libraries",
      "Designing accessible UI themes with high-contrast, navigable HTML",
      "Configuring automated sitemap and dead-link check scripts"
    ],
    engagementShape: "Staged content migration and automated tagging sprint, typically 5 weeks.",
    exclusions: [
      "Manual content copywriting",
      "Translation of document text into foreign languages"
    ],
    relatedWorkSlugs: ["pdfremed", "mdwrk"],
    cta: "Secure WCAG AA compliance across your entire document backlog"
  },
  {
    id: "frontend-operator-experience",
    slug: "frontend-operator-experience",
    title: "Frontend and Operator Experience",
    audience: "Product Owners, Support Leads, Operator Personnel",
    usefulWhen: [
      "Replacing confusing, cluttered admin portals with high-efficiency bento dashboards",
      "Needing clean, quiet, and legible web surfaces to present technical catalog items",
      "Requiring custom UI components and theme tokens styled with premium precision"
    ],
    typicalOutputs: [
      "High-performance React/Vite operator dashboards",
      "Accessible design-token config files and components",
      "Unified CSS systems styled with Tailwind CSS utility classes"
    ],
    inputs: [
      "Functional UI wireframes or goals",
      "Brand color palette and typography guides",
      "API payload samples"
    ],
    scope: [
      "Building modular React component libraries",
      "Optimizing page layouts for responsive ranges and touch targets",
      "Adding smooth, purposeful transition animations via Motion"
    ],
    engagementShape: "6 to 8-week design and development delivery milestones.",
    exclusions: [
      "Traditional graphic branding and marketing logo creation",
      "Third-party user acquisition campaign planning"
    ],
    relatedWorkSlugs: ["mdwrk", "tigrbl-auth"],
    cta: "Upgrade your operator dashboards with premium polish"
  },
  {
    id: "migration-modernization",
    slug: "migration-modernization",
    title: "Migration and Modernization Services",
    audience: "Technical Operations Leads, Database Architects, SREs",
    usefulWhen: [
      "Migrating massive legacy content folders without breaking active links",
      "Restructuring complex backend packages to support modern framework upgrades",
      "Phasing out fragile legacy authentication setups for modern secure standards"
    ],
    typicalOutputs: [
      "Structured, normalized content archives",
      "Automated route redirects and proxy rules",
      "Comprehensive backward-compatibility test suites"
    ],
    inputs: [
      "Legacy repository source code",
      "Active link metrics and sitemaps",
      "Framework upgrade checklists"
    ],
    scope: [
      "Re-wiring package structures without functional drift",
      "Writing robust data migration runners",
      "Implementing safe reverse-proxy routing schemes"
    ],
    engagementShape: "8-week migration execution campaign.",
    exclusions: [
      "Long-term feature additions to legacy frameworks",
      "Physical database hardware de-provisioning"
    ],
    relatedWorkSlugs: ["pdfremed", "mdwrk"],
    cta: "Modernize your legacy codebase with zero downtime"
  },
  {
    id: "delivery-release-operations",
    slug: "delivery-release-operations",
    title: "Delivery, Release, and Distribution Operations",
    audience: "SREs, Release Managers, Devops Engineers",
    usefulWhen: [
      "Experiencing slow, flaky, or untracked continuous integration pipelines",
      "Lacking repeatable, audited distribution routines for multi-package ecosystems",
      "Requiring standardized, containerized deployments with explicit secret management"
    ],
    typicalOutputs: [
      "Hardened, declarative GitHub Actions or GitLab pipelines",
      "Infrastructure-as-Code files (Terraform, Cloud Run)",
      "Audit trail recorders logging successful pipeline stages"
    ],
    inputs: [
      "Target cloud configuration requirements",
      "Current CI/CD YAML configurations",
      "Package registry access tokens"
    ],
    scope: [
      "Streamlining continuous integration steps to run under 5 minutes",
      "Implementing secure linter, test, and build verifications",
      "Setting up automated package publication runners"
    ],
    engagementShape: "4-week pipeline modernization sprint.",
    exclusions: [
      "Active maintenance of third-party cloud hosting servers",
      "Manual system backups on on-premise hardware"
    ],
    relatedWorkSlugs: ["bucketwarden"],
    cta: "Harden your release pipeline with automated gates"
  },
  {
    id: "technical-audit-evidence",
    slug: "technical-audit-evidence",
    title: "Technical Audit and Evidence Closure",
    audience: "Compliance Officers, Security Auditors, Engineering Directors",
    usefulWhen: [
      "Preparing for formal security certifications (SOC2, ISO 27001)",
      "Needing to mathematically verify database schemas against contract specifications",
      "Requiring automated reports to prove all pull-requests passed conformance gates"
    ],
    typicalOutputs: [
      "Comprehensive gap analysis and conformance matrices",
      "Automated proof logs generated directly from CI pipelines",
      "Readiness reports for legal counsel"
    ],
    inputs: [
      "Company policy manuals",
      "Active repository pipeline logs",
      "Target certification checklists"
    ],
    scope: [
      "Reviewing repository evidence items and matching them to active claims",
      "Configuring custom conformance audit scripts",
      "Drafting clear executive summaries and audit trail proofs"
    ],
    engagementShape: "3-week intensive gap analysis and reporting sprint.",
    exclusions: [
      "Legal representation in court or formal administrative proceedings",
      "Guarantees of third-party auditor approval"
    ],
    relatedWorkSlugs: ["ssot-registry", "seo-aeo-aieo-governance-pack"],
    cta: "Mathematically close your security compliance gaps"
  }
];
