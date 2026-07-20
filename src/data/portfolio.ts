/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem } from "../types";

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "ssot-registry",
    name: "Single Source of Truth (SSOT) Registry",
    summary: "A governed registry for microservices and data pipelines that ensures schema synchronization and API compliance.",
    description: "An automated inventory and version-controlled registry linking OpenAPI specifications, Avro schemas, and service-to-service communication paths. It automatically flags structural differences and compliance-breaking changes in pipeline pull requests, ensuring continuous contract validation.",
    capabilityFamily: "governed-delivery",
    artifactType: "platform",
    maturity: "released",
    evidenceLabel: "v2.1.0-stable, integrated into delivery pipeline gates",
    evidenceOwner: "Delivery Operations Lead",
    links: [
      { label: "View Specifications", href: "/portfolio/ssot-registry" },
      { label: "Public Repository", href: "https://github.com/groupsum/ssot-registry" }
    ],
    featured: true,
    approved: true,
    technologies: ["TypeScript", "Rust", "gRPC", "Protobuf", "PostgreSQL"]
  },
  {
    slug: "markdown_workspace",
    name: "MdWrk Markdown Workspace",
    summary: "A structured text-processing toolkit that transforms Markdown content directories into fully version-controlled sites.",
    description: "A high-performance file-system parser and content validator that runs inside continuous integration environments. Enforces heading level hierarchy, dead-link prevention, metadata schema rules, and media optimization bounds before deployment.",
    capabilityFamily: "documents",
    artifactType: "toolkit",
    maturity: "active",
    evidenceLabel: "Active development, running over 10k documents daily",
    evidenceOwner: "Technical Writing Lead",
    links: [
      { label: "Explore Toolkit Specs", href: "/portfolio/markdown_workspace" }
    ],
    featured: true,
    approved: true,
    technologies: ["Node.js", "Vite", "Markdown", "Regex Engine", "AST Parsing"]
  },
  {
    slug: "bucketwarden",
    name: "BucketWarden",
    summary: "A real-time storage auditing agent that guarantees strict access policies and automated remediation of cloud buckets.",
    description: "An event-driven auditing daemon that intercepts object storage mutations. Enforces object-level cryptographic signatures, content-type restrictions, and public-read access controls, auto-quarantining unverified artifacts in under 200 milliseconds.",
    capabilityFamily: "infrastructure",
    artifactType: "product",
    maturity: "released",
    evidenceLabel: "Released, auditing 4TB of distributed assets",
    evidenceOwner: "Cloud Infrastructure Architect",
    links: [
      { label: "Inspect Product Detail", href: "/portfolio/bucketwarden" }
    ],
    featured: true,
    approved: true,
    technologies: ["Go", "AWS S3 / GCS APIs", "CloudEvents", "Open Policy Agent"]
  },
  {
    slug: "pdfremed",
    name: "PDFRemed",
    summary: "An accessibility remediation framework converting legacy documents into WCAG 2.2 AA compliant structured PDFs.",
    description: "An intelligent layout analysis engine that automates tag tree injection, alternative-text matching, and reading-order layout recovery for massive corporate document backlogs.",
    capabilityFamily: "documents",
    artifactType: "specification",
    maturity: "active",
    evidenceLabel: "Active pilot, remediating 500k financial statements",
    evidenceOwner: "Accessibility Compliance Officer",
    links: [
      { label: "View Framework Specs", href: "/portfolio/pdfremed" }
    ],
    featured: true,
    approved: true,
    technologies: ["Python", "PDFlib", "LayoutParser", "HTML5"]
  },
  {
    slug: "portwyrm",
    name: "Portwyrm",
    summary: "A low-latency API gateway proxy designed for telemetry sanitization and ingress boundary governance.",
    description: "A secure edge proxy that strips sensitive headers, injects standardized tracing metadata, rate-limits on granular client identities, and ensures structured log uniformity before hitting backend services.",
    capabilityFamily: "infrastructure",
    artifactType: "platform",
    maturity: "released",
    evidenceLabel: "Production stable, handling 50M daily API calls",
    evidenceOwner: "Core Systems Engineer",
    links: [
      { label: "View Gateway Specs", href: "/portfolio/portwyrm" }
    ],
    featured: false,
    approved: true,
    technologies: ["Rust", "Envoy Proxy Filter", "WebAssembly", "Prometheus"]
  },
  {
    slug: "trustsig",
    name: "TrustSig",
    summary: "A cryptographic document signing service and validation oracle built on decentralized identity specifications.",
    description: "A high-security signing boundary utilizing hardware-security modules (HSMs) to apply verifiable, long-term signatures to corporate policies, release receipts, and audit trail reports.",
    capabilityFamily: "trust-policy",
    artifactType: "product",
    maturity: "released",
    evidenceLabel: "Released, securing 1.2M transactions",
    evidenceOwner: "Security Operations Director",
    links: [
      { label: "View Signing Engine Specs", href: "/portfolio/trustsig" }
    ],
    featured: true,
    approved: true,
    technologies: ["TypeScript", "WebCrypto API", "PKCS#11", "OAuth2.0 / OIDC"]
  }
];
