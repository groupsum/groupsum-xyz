export type OrganizationId = "groupsum" | "tigrbl" | "swarmauri";

export type PortfolioEntityKind =
  | "suite"
  | "product"
  | "project"
  | "package-family"
  | "package"
  | "application"
  | "site-docs"
  | "demo-example"
  | "specification-pack"
  | "archive";

export type Maturity =
  | "concept"
  | "experimental"
  | "active-development"
  | "usable"
  | "released"
  | "maintained"
  | "deprecated"
  | "archived"
  | "unknown";

export type PublicationDisposition =
  | "public"
  | "public-grouped"
  | "private"
  | "confidential"
  | "duplicate-mirror"
  | "deprecated-archive"
  | "not-portfolio"
  | "review-required";

export interface EvidenceItem {
  kind: string;
  label: string;
  href?: string;
  checkedAt: string;
}

export interface EntityLink {
  kind: "source" | "docs" | "package" | "release" | "live";
  label: string;
  href: string;
}

export interface PortfolioEntity {
  id: string;
  slug: string;
  sourceName: string;
  displayName: string;
  organization: OrganizationId;
  kind: PortfolioEntityKind;
  parentId?: string;
  suiteId?: string;
  capabilityIds: string[];
  ecosystem: Array<"python" | "npm" | "rust" | "web" | "service" | "specification">;
  summary: string;
  audience: string[];
  maturity: Maturity;
  evidence: EvidenceItem[];
  limitations: string[];
  links: EntityLink[];
  featured: boolean;
  approved: boolean;
  disposition: PublicationDisposition;
  technologies: string[];
}

export interface PortfolioItem {
  slug: string;
  name: string;
  summary: string;
  description: string;
  capabilityFamily: "governed-delivery" | "documents" | "trust-policy" | "infrastructure";
  artifactType: "product" | "platform" | "toolkit" | "specification" | "engagement";
  maturity: "exploratory" | "active" | "released" | "archived";
  evidenceLabel: string;
  evidenceOwner: string;
  links: Array<{ label: string; href: string }>;
  featured: boolean;
  approved: boolean;
  technologies: string[];
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  problem: string;
  audience: string;
  symptoms: string[];
  capability: string;
  suites: string[];
  engagementPath: string;
  deliverables: string[];
  evidence: string[];
  limitations: string[];
  cta: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  audience: string;
  usefulWhen: string[];
  typicalOutputs: string[];
  inputs: string[];
  scope: string[];
  engagementShape: string;
  exclusions: string[];
  relatedWorkSlugs: string[];
  cta: string;
}

export interface BlogPost {
  slug: string;
  legacyPath: string;
  canonicalUrl?: string;
  title: string;
  date: string;
  modified?: string;
  author: string;
  excerpt: string;
  content: string;
  tags?: string[];
  category?: string;
  featuredImage?: string;
  isLegacy?: boolean;
}
