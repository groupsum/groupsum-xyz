/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SolutionItem } from "../types";

export const solutionsData: SolutionItem[] = [
  {
    id: "governed-product-delivery",
    slug: "governed-product-delivery",
    title: "Governed Product Delivery",
    problem: "Engineering decisions, dynamic source code implementations, testing gates, and release states drift apart over time, introducing critical deployment risks.",
    audience: "Chief Technology Officers, VP of Engineering, Delivery Operations Managers",
    symptoms: [
      "Stale or incorrect documentation mismatching live production servers",
      "Manual release reviews that delay deployments by multiple days",
      "API breaking changes leaking to staging and production environments"
    ],
    capability: "We connect specifications, source-controlled decisions, automated continuous verification gates, and release evidence into a single traceable thread of truth.",
    suites: ["ssot-registry", "mdwrk", "seo-aeo-aieo-governance-pack"],
    engagementPath: "Initial 3-week verification sprint resulting in pipeline-embedded SSOT registries and conformance checks.",
    deliverables: [
      "Centralized SSOT registry for API contracts",
      "Automated pull-request contract checking gates",
      "Traceability map linking core requirements to live unit tests"
    ],
    evidence: [
      "SSOT Registry v2.1-governed pipelines",
      "Over 10,000 automated document checks processed daily via MdWrk"
    ],
    limitations: [
      "Requires continuous repository-level authorization",
      "Does not automate architectural judgment; flags contract discrepancies only"
    ],
    cta: "Embed contract governance in your delivery pipelines today"
  },
  {
    id: "api-platform-foundations",
    slug: "api-platform-foundations",
    title: "API and Platform Foundations",
    problem: "Product development teams spend excessive time rebuilding standard API layers, transport protocols, and storage adapters, leading to fragmented microservices.",
    audience: "Lead Architects, Platform Engineers, Backend Core Developers",
    symptoms: [
      "Inconsistent API designs across different sub-teams",
      "Complex custom boilerplate code duplicated in every microservice",
      "Difficulty switching or scaling transport layers (e.g., REST to WebSockets)"
    ],
    capability: "We establish a schema-first ASGI platform with clean pluggable persistence layers, modular transport runtimes, and standardized testing interfaces.",
    suites: ["tigrbl", "tigrcorn"],
    engagementPath: "6-week platform core setup with concrete REST, JSON-RPC, and high-performance streaming examples.",
    deliverables: [
      "Schema-first backend typing models and ASGI runtime",
      "Pluggable database and cache engine interfaces",
      "Unified telemetry and tracing adapters"
    ],
    evidence: [
      "Tigrbl PyPI framework modules serving enterprise clients",
      "Tigrcorn low-latency ASGI performance metrics"
    ],
    limitations: [
      "Requires backend teams to adopt schema-first workflow discipline",
      "Custom third-party engine integrations may need bespoke adapters"
    ],
    cta: "Unify your services under a schema-first API platform"
  },
  {
    id: "identity-trust-policy",
    slug: "identity-trust-policy",
    title: "Identity, Trust, and Policy",
    problem: "Authentication flows, security policies, digital signatures, and audit logs are typically scattered across different databases, creating compliance gaps.",
    audience: "Security Directors, Chief Information Security Officers (CISOs), Compliance Leads",
    symptoms: [
      "Brittle hard-coded authorization logic inside business route handlers",
      "Inability to securely trace or verify the authenticity of critical PDF/text receipts",
      "Fragile custom OIDC login setups"
    ],
    capability: "We build explicit, testable, cryptographic authentication and policy engines to safeguard records, user identities, and distributed compliance trails.",
    suites: ["tigrbl-auth", "trustsig", "authentication-governance-pack"],
    engagementPath: "4-week identity sprint focused on protocol audits, cryptographic key storage, and custom policy definitions.",
    deliverables: [
      "Cryptographically signed release receipt spec",
      "Decoupled policy-as-code authorization gateway",
      "Multi-tenant auth schemas and WebAuthn credentials"
    ],
    evidence: [
      "TrustSig securing over 1.2M transactions in live environments",
      "Tigrbl Auth beta-testing protocols on compliant infrastructure"
    ],
    limitations: [
      "Notary signature verification depends on HSM accessibility",
      "Identity federation requires pre-existing enterprise directory structures"
    ],
    cta: "Secure your transactions with cryptographic proof-of-trust"
  },
  {
    id: "ai-agent-systems",
    slug: "ai-agent-systems",
    title: "AI and Agent Systems",
    problem: "AI integrations and intelligent agent applications are difficult to test, trace, evaluate, and scale beyond simple chat mockups.",
    audience: "AI Developers, Product Managers, R&D Directors",
    symptoms: [
      "Unpredictable LLM hallucinations causing service failures in production",
      "Brittle custom agent structures that crash when complex prompts are passed",
      "No mechanism to systematically grade model outputs"
    ],
    capability: "We implement modular, composable, and typed Python pipelines for multi-agent frameworks, vector search, custom prompts, and systematic output evaluation.",
    suites: ["swarmauri-sdk", "peagen"],
    engagementPath: "4-week model-agnostic agent sprint to build production-ready RAG or systematic document parsers.",
    deliverables: [
      "Model-agnostic SDK implementation with local and API provider backends",
      "Rigorous prompt parser and vector evaluation pipeline",
      "Repeatable DAG generation workflows via Peagen"
    ],
    evidence: [
      "Swarmauri SDK serving stable multi-agent packages with 300+ sub-manifests",
      "Peagen code generators running reproducible scaffold workflows"
    ],
    limitations: [
      "Model performance is bound by third-party provider APIs and local GPU capacities",
      "Evaluators require pre-curated test suites to gauge accurate output compliance"
    ],
    cta: "Build trace-governed AI agents using Swarmauri's composable SDK"
  },
  {
    id: "document-knowledge-operations",
    slug: "document-knowledge-operations",
    title: "Document and Knowledge Operations",
    problem: "Corporate documentation, specifications, and layout designs exist as fragmented, unsearchable, and non-compliant silos.",
    audience: "Technical Documentation Directors, Legal Operations, Knowledge Managers",
    symptoms: [
      "Inaccessible tag structures causing compliance fines under WCAG guidelines",
      "Dead markdown links and broken site navigation after restructuring docs",
      "Inconsistent tone, formatting, and layout across product websites"
    ],
    capability: "We construct high-performance AST markdown engines, PDF remediation workbenches, and automated layout parsers to optimize document lifecycles.",
    suites: ["mdwrk", "pdfremed"],
    engagementPath: "3-week content audit and automated rendering framework setup.",
    deliverables: [
      "Markdown AST parser with compliance checking plugins",
      "PDF tagging and reading-order layout remediation scripts",
      "Static site generation pipelines with zero-broken-link guarantees"
    ],
    evidence: [
      "PDFRemed pilot automating tags for 500k legacy statements",
      "MdWrk renderer core rendering high-contrast digital pages safely"
    ],
    limitations: [
      "Complex visual diagrams in PDFs require manual alt-text mapping",
      "Markdown rendering does not execute embedded javascript for security reasons"
    ],
    cta: "Modernize your document archives into a structured knowledge engine"
  },
  {
    id: "storage-evidence-movement",
    slug: "storage-evidence-movement",
    title: "Storage, Evidence, and Data Movement",
    problem: "Unmonitored file transfers, insecure object storage buckets, and untraced data access patterns make regulatory compliance auditing impossible.",
    audience: "SREs, Cloud Storage Architects, Security Compliance Managers",
    symptoms: [
      "Exposed cloud storage buckets leaking metadata to public crawlers",
      "No real-time auditing of object modifications",
      "Slow and unvalidated backup file validation"
    ],
    capability: "We deploy real-time storage auditing daemons, edge proxies, and trace collectors to quarantine unverified data mutations instantly.",
    suites: ["bucketwarden", "portwyrm"],
    engagementPath: "2-week storage hardening and proxy-based filtering deployment.",
    deliverables: [
      "BucketWarden automatic file quarantining configurations",
      "Telemetry proxy filtering setups for sensitive PII",
      "Cryptographically signed evidence logs for all transfers"
    ],
    evidence: [
      "BucketWarden actively protecting 4TB of active operational assets",
      "Portwyrm processing massive ingress volume with zero compliance leaks"
    ],
    limitations: [
      "Quarantine latency is dependent on native cloud pub/sub broker speeds",
      "Requires read-write container credentials for active quarantine actions"
    ],
    cta: "Audit and defend your operational cloud storage in real-time"
  },
  {
    id: "realtime-modern-transport",
    slug: "realtime-modern-transport",
    title: "Realtime and Modern Transport",
    problem: "Traditional HTTP REST requests fail to meet latency demands for collaborative applications, streaming telemetry, or live agent execution.",
    audience: "Interactive App Developers, SREs, Real-time Operations Managers",
    symptoms: [
      "High CPU load and overhead from constant HTTP polling",
      "Unresponsive or slow collaborative screens on unstable networks",
      "Fragile custom WebSocket connections that drop packets silently"
    ],
    capability: "We engineer low-overhead ASGI servers supporting WebSocket, HTTP/3 QUIC, and WebTransport for real-time bidirection streaming.",
    suites: ["tigrcorn"],
    engagementPath: "4-week transport modernization sprint, implementing server-authoritative live streams and backup channels.",
    deliverables: [
      "HTTP/3 and WebTransport microservice templates",
      "Fallback WebSocket connections for legacy browsers",
      "Performance metrics collectors for connection throughput"
    ],
    evidence: [
      "Tigrcorn ASGI container server executing lightning fast network handshakes",
      "WebTransport agents communicating under 5ms latency"
    ],
    limitations: [
      "QUIC and WebTransport are blocked on certain restricted corporate firewalls",
      "Requires modern browser engine support for WebTransport streaming"
    ],
    cta: "Modernize your communication layer with ultra-fast ASGI servers"
  },
  {
    id: "developer-experience-distribution",
    slug: "developer-experience-distribution",
    title: "Developer Experience and Distribution",
    problem: "Multi-package mono-repositories are notoriously difficult to scaffold, version-control, document, and publish in a reproducible manner.",
    audience: "DevOps Leads, Platform Engineers, Repository Architects",
    symptoms: [
      "Hours wasted setting up local development environments for new engineers",
      "Broken package dependencies on npm, PyPI, or Cargo registries",
      "Fragmented code formatting and lint rules across multiple repositories"
    ],
    capability: "We provide template code generators, DAG compilers, registry automation setups, and unified documentation pipelines.",
    suites: ["peagen", "mdwrk"],
    engagementPath: "3-week mono-repo streamlining and publishing automation project.",
    deliverables: [
      "Peagen workspace layout templates for Python and Node.js",
      "Automated multi-package publication CI/CD workflows",
      "Integrated documentation portal from markdown repository files"
    ],
    evidence: [
      "Swarmauri SDK successfully managing 346 Python package manifests",
      "Peagen generating reliable, compliant developer scaffolds"
    ],
    limitations: [
      "Requires developer tooling conformity across the engineering team",
      "Registry credentials must be managed via secure platform secrets"
    ],
    cta: "Streamline your multi-package development experience"
  },
  {
    id: "accessibility-remediation",
    slug: "accessibility-remediation",
    title: "Accessibility and Remediation",
    problem: "Enterprise portals and voluminous PDF backlogs fail WCAG 2.2 accessibility legal standards, exposing organizations to litigation.",
    audience: "Corporate Counsel, DEI Directors, Web Platform Managers",
    symptoms: [
      "PDFs with missing tags or incorrect reading order for screen readers",
      "Contrast ratio failures on web layouts",
      "Inability to navigate web assets using keyboard controls alone"
    ],
    capability: "We implement automated tag-tree injection, reading-order algorithms, and visual-contrast analyzers.",
    suites: ["pdfremed"],
    engagementPath: "4-week auditing and bulk document remediation campaign.",
    deliverables: [
      "Remediated high-priority document sets",
      "Automated WCAG compliance test scripts",
      "Web accessibility theme configurations"
    ],
    evidence: [
      "Remediating half a million statements under strict AA standards",
      "MdWrk's built-in high-contrast, fully navigable theme"
    ],
    limitations: [
      "Highly complex infographics require manual editorial translation",
      "Deep scanning of corrupt PDFs may require visual rebuilding"
    ],
    cta: "Secure accessibility compliance for your entire document catalog"
  },
  {
    id: "infrastructure-operational-planning",
    slug: "infrastructure-operational-planning",
    title: "Infrastructure and Operational Planning",
    problem: "Data center operations, hardware inventories, and network capacity planning are managed on scattered, untracked spreadsheets, causing allocation gridlock.",
    audience: "Data Center Operators, Network Engineers, SRE Directors",
    symptoms: [
      "Mismatched rack space calculations during physical hardware arrival",
      "Unrecorded network routing paths causing failover gridlocks",
      "No source-of-truth inventory for operational capacity"
    ],
    capability: "We deliver visual planning tools, fiber mapping structures, and capacity models built on version-controlled data configurations.",
    suites: ["ssot-registry"],
    engagementPath: "5-week inventory modeling sprint with visual interface maps.",
    deliverables: [
      "Visual data center rack and route planning templates",
      "Version-controlled hardware specification registry",
      "Capacity model and trace dashboard"
    ],
    evidence: [
      "Groupsum's custom layout planning tools currently in physical network trials",
      "SSOT Registry keeping capacity schemas strictly bounded"
    ],
    limitations: [
      "Requires physical inventory verification; software reflects input data only",
      "Active hardware status depends on external telemetry probes"
    ],
    cta: "Govern your infrastructure with version-controlled planning"
  }
];
