import { ServiceItem } from "../types";

// These are engagement shapes, not fixed-duration packages. Scope, schedule,
// security obligations, acceptance criteria, and commercial terms are agreed
// only after discovery.
export const servicesData: ServiceItem[] = [
  {
    id: "product-evidence-review", slug: "product-evidence-review", title: "Product and Evidence Review",
    audience: "Product, platform, and release leaders",
    usefulWhen: ["Public claims are difficult to trace", "Repository and deployment state are being conflated", "A portfolio needs defensible maturity labels"],
    typicalOutputs: ["Claim-to-evidence inventory", "Maturity and publication boundaries", "Prioritized correction plan"],
    inputs: ["Repositories and documentation", "Release and deployment records", "Current public claims"],
    scope: ["Inspect source and delivery evidence", "Classify what is implemented, published, deployed, and reachable", "Rewrite claims to match the available proof"],
    engagementShape: "Scoped after a short discovery review; depth depends on portfolio size and evidence access.",
    exclusions: ["Third-party certification", "Legal opinions", "Claims that cannot be supported by supplied evidence"],
    relatedWorkSlugs: ["ssot-registry"], cta: "Review your product evidence"
  },
  {
    id: "architecture-specification", slug: "architecture-specification", title: "Architecture and Specification Delivery",
    audience: "Technical leads and platform teams",
    usefulWhen: ["System boundaries are ambiguous", "Interfaces change without a durable decision record", "Teams need executable contracts"],
    typicalOutputs: ["Architecture decision records", "API and data contracts", "Test and migration plan"],
    inputs: ["Existing source and diagrams", "Representative payloads and workflows", "Operational constraints"],
    scope: ["Map current boundaries", "Document decisions and alternatives", "Create validation that fits the repository"],
    engagementShape: "Milestones and schedule follow system discovery and an agreed statement of work.",
    exclusions: ["Unbounded feature development", "Compliance certification", "Guaranteed performance without target-environment testing"],
    relatedWorkSlugs: ["tigrbl", "ssot-registry"], cta: "Clarify a system boundary"
  },
  {
    id: "api-platform-engineering", slug: "api-platform-engineering", title: "API and Platform Engineering",
    audience: "Backend and platform engineering teams",
    usefulWhen: ["Service contracts and persistence logic drift", "API plumbing is repeatedly rebuilt", "A typed migration path is needed"],
    typicalOutputs: ["Working service slice", "Typed schemas and operations", "Tests, documentation, and migration guidance"],
    inputs: ["Current service source", "Data and API contracts", "Deployment and reliability constraints"],
    scope: ["Design schema-first service boundaries", "Implement the agreed slice", "Validate behavior in the target workflow"],
    engagementShape: "Incremental delivery sized around one verifiable service boundary at a time.",
    exclusions: ["Universal throughput promises", "Undisclosed production access", "Operation of customer infrastructure unless explicitly contracted"],
    relatedWorkSlugs: ["tigrbl", "tigrcorn"], cta: "Evaluate an API boundary"
  },
  {
    id: "developer-tooling", slug: "developer-tooling", title: "Developer Tooling and Package Delivery",
    audience: "Library maintainers and developer-experience teams",
    usefulWhen: ["Package boundaries are unclear", "Build and release steps are not reproducible", "Scaffolding and documentation have drifted"],
    typicalOutputs: ["Package and dependency model", "Build, test, and publication automation", "Examples and maintainer documentation"],
    inputs: ["Source repositories", "Package manifests", "Current contributor and release workflows"],
    scope: ["Refine package boundaries", "Automate repeatable checks", "Document actual supported workflows"],
    engagementShape: "Scoped by package count, registry targets, compatibility requirements, and release risk.",
    exclusions: ["Registry availability guarantees", "Community growth promises", "Publishing credentials outside agreed secret-handling boundaries"],
    relatedWorkSlugs: ["swarmauri-sdk", "peagen", "mdwrk"], cta: "Make a package workflow reproducible"
  },
  {
    id: "operator-interface", slug: "operator-interface", title: "Operator Interface Engineering",
    audience: "Platform operators and product teams",
    usefulWhen: ["High-consequence actions are hard to review", "Desired state and runtime state are confused", "An internal tool needs clearer ownership and recovery paths"],
    typicalOutputs: ["Operator journey and permission model", "Responsive interface implementation", "Validation, errors, recovery, and audit surfaces"],
    inputs: ["Operator workflows", "API contracts and permission rules", "Failure and recovery requirements"],
    scope: ["Audit the existing flow", "Design explicit action consequences", "Implement and validate the agreed interface"],
    engagementShape: "Delivered in testable workflow slices after roles, risks, and system boundaries are known.",
    exclusions: ["Unverified automation of destructive actions", "Brand campaigns", "Claims of accessibility conformance without appropriate testing"],
    relatedWorkSlugs: ["npmctl", "portwyrm", "bucketwarden"], cta: "Review an operator workflow"
  },
  {
    id: "delivery-release-operations", slug: "delivery-release-operations", title: "Delivery and Release Operations",
    audience: "Release engineers, maintainers, and platform teams",
    usefulWhen: ["Builds and publications are difficult to reproduce", "Secrets and deployment authority are unclear", "A passing CI run is treated as proof of availability"],
    typicalOutputs: ["Delivery-state model", "CI and publication workflow", "Deployment and external-reachability verification"],
    inputs: ["Repository workflows", "Registry and deployment targets", "Secret and approval boundaries"],
    scope: ["Separate implementation, publication, deployment, and reachability", "Automate scoped validation", "Record evidence at each boundary"],
    engagementShape: "Scope depends on repositories, registries, environments, and the approvals needed to change them.",
    exclusions: ["Bypassing approval or secret controls", "Guaranteed third-party uptime", "Treating source state as deployment proof"],
    relatedWorkSlugs: ["ssot-registry", "npmctl"], cta: "Make release state verifiable"
  }
];
