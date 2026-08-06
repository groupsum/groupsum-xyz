import { SolutionItem } from "../types";

// Solutions describe problems Groupsum has relevant source experience with.
// They are not pre-scoped offers, warranties, certifications, or case studies.
export const solutionsData: SolutionItem[] = [
  {
    id: "governed-product-delivery", slug: "governed-product-delivery", title: "Traceable Product Delivery",
    problem: "Requirements, implementation, tests, deployment state, and public claims can drift apart.",
    audience: "Platform, product, and release teams",
    symptoms: ["Requirements cannot be traced to tests", "Release claims outpace deploy evidence", "Documentation and runtime state are conflated"],
    capability: "Use source-controlled records and automated checks to connect intent, implementation, evidence, and release decisions.",
    suites: ["ssot-registry", "npmctl"], engagementPath: "Begin with a repository and release-evidence review; scope follows the verified gaps.",
    deliverables: ["Current-state evidence map", "Machine-checkable claim boundaries", "Repository-integrated validation"],
    evidence: ["SSOT Registry public CLI and repository", "npmctl public plan/apply workflow"],
    limitations: ["Automation can evaluate recorded evidence; it cannot replace architectural or release judgment.", "A passing source check does not prove a live deployment."],
    cta: "Review your delivery evidence"
  },
  {
    id: "api-platform-foundations", slug: "api-platform-foundations", title: "Schema-first API Foundations",
    problem: "API behavior, validation, persistence, and transport code often diverge across services.",
    audience: "Backend and platform engineering teams",
    symptoms: ["Duplicated API plumbing", "Inconsistent validation and operation semantics", "Transport concerns leak into domain code"],
    capability: "Design typed service boundaries using schema-first models, explicit operations, pluggable engines, and testable ASGI interfaces.",
    suites: ["tigrbl", "tigrcorn"], engagementPath: "Start from one representative service and its existing contracts.",
    deliverables: ["Target service architecture", "Typed API and persistence contracts", "Executable tests and migration guidance"],
    evidence: ["Tigrbl public Python and Rust workspace", "Tigrcorn public protocol and release-validation source"],
    limitations: ["Architecture and performance depend on workload, dependencies, and deployment environment.", "Protocol support is not a throughput guarantee."],
    cta: "Evaluate a service boundary"
  },
  {
    id: "identity-trust-policy", slug: "identity-trust-policy", title: "Identity, Trust, and Policy",
    problem: "Identity protocols and authorization decisions become difficult to inspect when they are embedded throughout application code.",
    audience: "Identity, security, and platform teams",
    symptoms: ["Policy is mixed with route logic", "Token and key handling lacks explicit boundaries", "Protocol evidence is difficult to reproduce"],
    capability: "Model identity flows, policy decisions, credentials, keys, and verification evidence as explicit, testable system boundaries.",
    suites: ["tigrbl-auth", "authentication-governance-pack"], engagementPath: "Review the required protocol profile, threat model, and current implementation before choosing controls.",
    deliverables: ["Protocol and trust-boundary map", "Testable policy and identity contracts", "Implementation and verification plan"],
    evidence: ["Tigrbl Auth public OIDC/OAuth workspace", "Public Groupsum authentication governance pack"],
    limitations: ["Source review is not a security audit or certification.", "Production identity systems require environment-specific threat modeling and interoperability testing."],
    cta: "Map an identity boundary"
  },
  {
    id: "ai-agent-systems", slug: "ai-agent-systems", title: "Composable AI Application Systems",
    problem: "AI application code becomes hard to test when providers, prompts, tools, parsing, memory, and evaluation are tightly coupled.",
    audience: "AI application and platform developers",
    symptoms: ["Provider-specific integrations dominate application logic", "Tool and parser behavior is difficult to isolate", "Evaluation is missing or application-agnostic"],
    capability: "Compose typed model, tool, parser, embedding, vector-store, and workflow components with application-specific evaluation.",
    suites: ["swarmauri-sdk", "peagen"], engagementPath: "Define the task, acceptable failure modes, data boundary, and evaluation set first.",
    deliverables: ["Component and data-flow design", "Provider-aware implementation", "Task-specific evaluation harness"],
    evidence: ["Swarmauri SDK public monorepo", "Peagen public generation workspace"],
    limitations: ["Model quality, cost, latency, and availability depend on providers and workload.", "No model-output accuracy guarantee is implied."],
    cta: "Define an evaluable AI workflow"
  },
  {
    id: "document-knowledge-operations", slug: "document-knowledge-operations", title: "Document and Knowledge Workflows",
    problem: "Document content, rendering, metadata, accessibility work, and publication evidence are often managed in disconnected tools.",
    audience: "Documentation, accessibility, and web platform teams",
    symptoms: ["Content cannot be validated before publication", "Rendering and metadata rules vary by surface", "Accessibility remediation lacks a repeatable workflow"],
    capability: "Build source-controlled Markdown and PDF workflows with explicit parsing, rendering, review, and verification stages.",
    suites: ["mdwrk", "pdfremed"], engagementPath: "Inspect representative documents, current tooling, and required validation criteria.",
    deliverables: ["Document workflow map", "Parsing and rendering pipeline", "Verification plan and reproducible checks"],
    evidence: ["MdWrk public package repositories", "PDFRemed implementation and test plans"],
    limitations: ["Accessibility outcomes are document-specific and require appropriate validation.", "No automatic conformance or zero-defect guarantee is made."],
    cta: "Review a document workflow"
  },
  {
    id: "storage-evidence-movement", slug: "storage-evidence-movement", title: "Storage Policy and Evidence",
    problem: "Storage policy, object changes, delivery receipts, and operational evidence are difficult to reconcile after the fact.",
    audience: "Cloud platform, storage, and security teams",
    symptoms: ["Policy intent is not tied to evidence", "Operator actions lack reproducible records", "Source validation is mistaken for live-system health"],
    capability: "Design explicit policy, evidence, delivery, and operator boundaries for storage-related workflows.",
    suites: ["bucketwarden", "evidencevault"], engagementPath: "Start with the storage environment, threat model, operator workflow, and evidence requirements.",
    deliverables: ["Policy and evidence model", "Operator workflow design", "Implementation and validation plan"],
    evidence: ["BucketWarden platform source and deployment profiles", "EvidenceVault local implementation source"],
    limitations: ["No protected-volume, response-time, or certification claim is made.", "Runtime protection must be verified in the target environment."],
    cta: "Review a storage control boundary"
  },
  {
    id: "realtime-modern-transport", slug: "realtime-modern-transport", title: "Realtime and Modern Transport",
    problem: "Realtime systems need explicit connection lifecycles, fallbacks, fanout ownership, and transport-aware testing.",
    audience: "Realtime application and platform teams",
    symptoms: ["Connection cleanup is inconsistent", "Fallback behavior is undefined", "Protocol support is confused with application performance"],
    capability: "Implement and test ASGI, WebSocket, HTTP/3, QUIC, and WebTransport boundaries where they fit the application.",
    suites: ["tigrcorn", "tigrbl"], engagementPath: "Choose transports from browser, network, deployment, and application constraints.",
    deliverables: ["Transport decision record", "Connection-lifecycle implementation", "Environment-specific functional and performance tests"],
    evidence: ["Tigrcorn public protocol modules", "Tigrbl public realtime examples"],
    limitations: ["Network and application performance must be measured in the target environment.", "Modern transport support varies by client and network."],
    cta: "Review a realtime architecture"
  },
  {
    id: "infrastructure-operational-planning", slug: "infrastructure-operational-planning", title: "Infrastructure and Operator Planning",
    problem: "Physical and software infrastructure decisions become risky when capacity, topology, change intent, and operator controls are separated.",
    audience: "Infrastructure planners and platform operators",
    symptoms: ["Topology and capacity records drift", "High-consequence changes lack a reviewable plan", "Operator tools obscure ownership boundaries"],
    capability: "Create planning and control surfaces that keep topology, capacity, desired state, and evidence inspectable.",
    suites: ["dcim-rack-planner", "dcim-fiber-planner", "npmctl", "portwyrm"], engagementPath: "Inspect the current inventory, workflows, system boundaries, and required evidence.",
    deliverables: ["Current-state model", "Operator workflow and control boundaries", "Incremental implementation plan"],
    evidence: ["DCIM planning application source", "npmctl and Portwyrm public repositories"],
    limitations: ["Planning software does not replace field validation or change control.", "No production inventory scale is claimed."],
    cta: "Map an operator workflow"
  }
];
