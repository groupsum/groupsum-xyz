import { PortfolioItem } from "../types";

// This compact legacy collection feeds the featured-card and detail views.
// The complete, evidence-labeled catalog lives in entities.ts.
export const portfolioItems: PortfolioItem[] = [
  {
    slug: "ssot-registry", name: "SSOT Registry",
    summary: "Repository-agnostic traceability from features and requirements to implementation, tests, evidence, and releases.",
    description: "A Python CLI and repository convention for recording product intent, evaluating evidence, and projecting release state without treating documentation as proof of a live deployment.",
    capabilityFamily: "governed-delivery", artifactType: "toolkit", maturity: "active",
    evidenceLabel: "Public source and CLI documentation reviewed on 2026-08-02", evidenceOwner: "Groupsum repository maintainers",
    links: [{ label: "Public repository", href: "https://github.com/groupsum/ssot-registry" }], featured: true, approved: true,
    technologies: ["Python", "CLI", "YAML", "JSON"]
  },
  {
    slug: "markdown_workspace", name: "Markdown Workspace",
    summary: "Local-first Markdown authoring workspace with preview, packages, and an extension host.",
    description: "The public repository describes a portable Markdown workspace and supplies the implementation that can be inspected, built, and tested independently.",
    capabilityFamily: "documents", artifactType: "toolkit", maturity: "active",
    evidenceLabel: "Public source reviewed on 2026-08-02; no usage-volume claim", evidenceOwner: "Groupsum repository maintainers",
    links: [{ label: "Public repository", href: "https://github.com/groupsum/markdown_workspace" }], featured: true, approved: true,
    technologies: ["TypeScript", "React", "Markdown"]
  },
  {
    slug: "bucketwarden", name: "BucketWarden",
    summary: "Storage-governance platform source for policy, evidence, deployment profiles, and operator workflows.",
    description: "The inspected platform repository contains implementation, tests, deployment profiles, and evidence contracts. Those artifacts do not establish storage volume, customer adoption, certification, or the health of a live installation.",
    capabilityFamily: "infrastructure", artifactType: "product", maturity: "active",
    evidenceLabel: "Implementation and tests reviewed on 2026-08-02", evidenceOwner: "BucketWarden repository maintainers",
    links: [{ label: "Product site", href: "https://bucketwarden.com" }], featured: true, approved: true,
    technologies: ["Rust", "TypeScript", "Policy", "Evidence"]
  },
  {
    slug: "pdfremed", name: "PDFRemed",
    summary: "Workbench and service code for PDF accessibility inspection and remediation workflows.",
    description: "The inspected source contains document models, remediation workflow code, and verification plans. Results remain document-specific and require appropriate validation; no automated conformance guarantee is made.",
    capabilityFamily: "documents", artifactType: "product", maturity: "active",
    evidenceLabel: "Source and test plans reviewed on 2026-08-02", evidenceOwner: "Groupsum repository maintainers",
    links: [], featured: true, approved: true, technologies: ["Python", "PDF", "React", "Accessibility"]
  },
  {
    slug: "npmctl", name: "npmctl",
    summary: "Owner-scoped GitOps controller for Nginx Proxy Manager resources.",
    description: "The public Python repository manages declarative proxy hosts, certificates, and access lists with validation, plans, and apply workflows. Installation health must be verified separately.",
    capabilityFamily: "infrastructure", artifactType: "toolkit", maturity: "active",
    evidenceLabel: "Public source, tests, and examples reviewed on 2026-08-02", evidenceOwner: "Groupsum repository maintainers",
    links: [{ label: "Public repository", href: "https://github.com/groupsum/npmctl" }, { label: "Product site", href: "https://npmctl.com" }],
    featured: true, approved: true, technologies: ["Python", "YAML", "GitOps"]
  },
  {
    slug: "portwyrm", name: "Portwyrm",
    summary: "Self-hosted reverse-proxy control plane and UI designed around npmctl compatibility.",
    description: "The public repository contains an API, operator UI, deployment configuration, and tests. It is under active development and is not presented as a managed hosted service.",
    capabilityFamily: "infrastructure", artifactType: "product", maturity: "active",
    evidenceLabel: "Public source and deployment configuration reviewed on 2026-08-02", evidenceOwner: "Groupsum repository maintainers",
    links: [{ label: "Public repository", href: "https://github.com/groupsum/portwyrm" }], featured: true, approved: true,
    technologies: ["Python", "FastAPI", "React", "Docker"]
  },
  {
    slug: "trustsig", name: "TrustSig",
    summary: "Exploratory cryptographic signing and verification work represented in the local portfolio source.",
    description: "This item remains in the legacy route set for compatibility. No transaction volume, production deployment, certification, or public availability is asserted.",
    capabilityFamily: "trust-policy", artifactType: "toolkit", maturity: "exploratory",
    evidenceLabel: "Claim boundary corrected on 2026-08-02", evidenceOwner: "Groupsum site maintainers",
    links: [], featured: false, approved: true, technologies: ["Cryptography", "Verification"]
  }
];
