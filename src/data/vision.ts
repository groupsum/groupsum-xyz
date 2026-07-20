export interface HorizontalCapability {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  proofPointSlugs: string[];
  solutionSlugs: string[];
}

export const groupSumVision = {
  eyebrow: "GroupSum / system vision",
  title: "Mature solutions for the horizontal problems behind complex systems.",
  summary: "GroupSum brings governed delivery, infrastructure planning, evidence, trust, and operator workflows into one coherent product ecosystem. The products are proof points; the operating vision is the center.",
};

export const horizontalCapabilities: HorizontalCapability[] = [
  {
    id: "governability",
    eyebrow: "Make systems legible",
    title: "Govern decisions, contracts, and change.",
    summary: "Source-controlled specifications, registries, policy packs, and evidence boundaries keep complex systems understandable as they evolve.",
    proofPointSlugs: ["ssot-registry", "tigrbl", "swarmauri-sdk"],
    solutionSlugs: ["governed-product-delivery", "api-platform-foundations"],
  },
  {
    id: "controlled-delivery",
    eyebrow: "Move work safely",
    title: "Turn deliverables into repeatable, evidenced workflows.",
    summary: "Fulfillment runtimes, release controls, artifact ledgers, and acceptance records connect intent to a verifiable result.",
    proofPointSlugs: ["deliverableops", "cc-deliverable-ops", "npmctl"],
    solutionSlugs: ["governed-product-delivery", "infrastructure-operational-planning"],
  },
  {
    id: "evidence-and-trust",
    eyebrow: "Preserve proof",
    title: "Keep provenance, custody, and trust close to the work.",
    summary: "Evidence custody, cryptographic boundaries, attestation, and independent verification make operational claims inspectable.",
    proofPointSlugs: ["evidencevault", "cc-deliverable-ops", "trustsig"],
    solutionSlugs: ["identity-trust-policy", "document-knowledge-operations"],
  },
  {
    id: "infrastructure-planning",
    eyebrow: "Plan the physical system",
    title: "Make infrastructure capacity visible and actionable.",
    summary: "Rack, fiber, topology, facility, and transport planning surfaces connect physical infrastructure decisions to operating workflows.",
    proofPointSlugs: ["voltrack", "dcim-rack-planner", "dcim-fiber-planner"],
    solutionSlugs: ["infrastructure-operational-planning", "storage-evidence-movement"],
  },
  {
    id: "operator-boundaries",
    eyebrow: "Operate the boundary",
    title: "Give operators safe control over edge, storage, and identity.",
    summary: "Proxy control planes, storage policy, identity systems, and service operations provide usable interfaces for high-consequence changes.",
    proofPointSlugs: ["portwyrm", "bucketwarden", "tigrbl-auth"],
    solutionSlugs: ["identity-trust-policy", "realtime-modern-transport"],
  },
];
