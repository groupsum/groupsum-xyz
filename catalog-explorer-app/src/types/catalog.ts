export type EntityType = 
  | 'product' 
  | 'portfolio' 
  | 'repository' 
  | 'package' 
  | 'resource' 
  | 'technology' 
  | 'release';

export type MaturityState = 'production' | 'active' | 'beta' | 'experimental' | 'deprecated' | 'archived';

export type PublicationState = 'published' | 'manifest-private' | 'workspace' | 'candidate' | 'registry-unavailable';

export type EvidenceState = 'reviewed' | 'observed' | 'not-observed' | 'unavailable' | 'stale';

export type GovernanceState = 'governed' | 'registry-absent' | 'invalid' | 'partial';

export type ResourceType = 'website' | 'documentation' | 'api' | 'demo' | 'example' | 'showcase' | 'ui';

export interface OwnershipPath {
  organization: string;
  product?: { name: string; slug: string };
  repository?: { owner: string; name: string };
  package?: { packageName: string; ecosystem: string; routeKey: string };
  resource?: { name: string; type: ResourceType; routeKey: string };
}

export interface MetricSnapshot {
  label: string;
  value: number | string | null;
  unit?: string;
  status: EvidenceState;
  ownerRef?: { name: string; route: string };
  observedAt: string;
  period?: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  dateLabel: string;
  value: number;
}

export interface TimeSeries {
  period: '30d' | '90d' | '365d';
  dataPointCount: number;
  points: TimeSeriesPoint[];
  completeness: 'complete' | 'partial' | 'single-observation';
  observedAt: string;
}

export interface CommitBarPoint {
  date: string;
  commitCount: number;
  authorCount?: number;
}

export interface LanguageByte {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  summary: string;
  organization: string;
  maturity: MaturityState;
  ecosystem: string;
  audience: string;
  reviewedCapabilities: string[];
  repositoryRefs: {
    owner: string;
    repository: string;
    role: string;
    name: string;
  }[];
  packageRefs: {
    packageName: string;
    ecosystem: string;
    routeKey: string;
  }[];
  resourceRefs: {
    name: string;
    type: ResourceType;
    routeKey: string;
  }[];
  limitations: string[];
  observedAt: string;
}

export interface PortfolioRecord {
  id: string;
  slug: string;
  name: string;
  summary: string;
  organization: string;
  maturity: MaturityState;
  domain: string;
  strategicFocus: string;
  products: { name: string; slug: string }[];
  keyMetrics: { label: string; value: string }[];
  observedAt: string;
}

export interface RepositoryRecord {
  owner: string;
  repository: string;
  slug: string;
  organization: string;
  role: string;
  description: string;
  stars: number;
  starsSeries: TimeSeries;
  forks: number;
  watchers: number;
  contributors: number;
  commits30d: CommitBarPoint[];
  packagesCount: number;
  latestRelease: {
    version: string;
    date: string;
    url: string;
  } | null;
  governanceState: GovernanceState;
  languages: LanguageByte[];
  technologies: string[];
  license: {
    expression: string;
    evidenceState: EvidenceState;
    noticeUrl?: string;
  };
  sourceUrl: string;
  observedAt: string;
}

export interface PackageDependency {
  name: string;
  version: string;
  scope: 'runtime' | 'dev' | 'peer' | 'optional';
  isInternal: boolean;
}

export interface PackageDependent {
  name: string;
  ecosystem: string;
  routeKey: string;
  owner: string;
}

export interface PackageRecord {
  ecosystem: string;
  routeKey: string;
  packageName: string;
  summary: string;
  owningRepository: {
    owner: string;
    repository: string;
    manifestPath: string;
  };
  packageKind: 'library' | 'cli' | 'container' | 'framework' | 'sdk';
  publicationState: PublicationState;
  latestVersion: string;
  releaseCount: number;
  downloadTrend?: TimeSeries;
  dependencies: PackageDependency[];
  dependentsCount: number;
  dependents: PackageDependent[];
  license: string;
  observedAt: string;
  registryUrl?: string;
}

export interface TypedResourceRecord {
  resourceType: ResourceType;
  routeKey: string;
  name: string;
  purpose: string;
  owningRepository?: {
    owner: string;
    repository: string;
  };
  url: string;
  reachability: 'verified' | 'unverified' | 'degraded';
  relatedProduct?: {
    name: string;
    slug: string;
  };
  specDetails?: {
    contractVersion?: string;
    authBoundary?: string;
    framework?: string;
    scenario?: string;
  };
  limitations?: string[];
  observedAt: string;
}

export interface TechnologyRecord {
  slug: string;
  name: string;
  category: string;
  summary: string;
  iconName: string;
  relatedRecordRefs: {
    entityType: EntityType;
    name: string;
    route: string;
  }[];
  observedAt: string;
}

export interface ReleaseRecord {
  routeKey: string;
  version: string;
  tagName: string;
  releaseKind: 'registry' | 'github';
  ownerRef: {
    type: 'package' | 'repository';
    name: string;
    route: string;
  };
  publishedAt: string;
  isPrerelease: boolean;
  isDraft: boolean;
  downloadsCount?: number;
  notes: string;
  licenseInherited: string;
  sourceUrl: string;
}

export interface SSOTGovernanceRecord {
  repositorySlug: string;
  canonicalRegistry: string;
  governanceState: GovernanceState;
  inventory: {
    label: string;
    count: number;
    icon: string;
  }[];
  claimCoverage: {
    numerator: number;
    denominator: number;
    percentage: number;
  };
  evidenceLinks: {
    title: string;
    url: string;
    observedAt: string;
  }[];
  explicitLimitation: string;
}

export interface FilterState {
  search: string;
  ecosystem: string;
  organization: string;
  maturity: string;
  publicationState: string;
  evidenceState: string;
  governanceState: string;
  resourceType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  density: 'comfortable' | 'compact';
}
