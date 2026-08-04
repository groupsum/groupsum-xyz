import {
  ProductRecord,
  PortfolioRecord,
  RepositoryRecord,
  PackageRecord,
  TypedResourceRecord,
  TechnologyRecord,
  ReleaseRecord,
  SSOTGovernanceRecord,
} from '../types/catalog';

export const CURRENT_OBSERVATION_TIME = '2026-08-03T18:00:00Z';

// --------------------------------------------------------------------------
// PRODUCTS & PORTFOLIO
// --------------------------------------------------------------------------
export const PRODUCTS_DATA: ProductRecord[] = [
  {
    id: 'prod-peagen',
    slug: 'peagen',
    name: 'Peagen',
    summary: 'Autonomous data pipeline & schema verification platform for distributed microservices.',
    organization: 'groupsum',
    maturity: 'production',
    ecosystem: 'TypeScript / Node.js & Rust',
    audience: 'Data Engineers, Backend Architects, Infrastructure Engineers',
    reviewedCapabilities: [
      'Zero-downtime schema verification & drift detection',
      'Automated snapshot testing across staging databases',
      'High-throughput stream indexing with Rust worker nodes',
      'Interactive visual schema topology graphs'
    ],
    repositoryRefs: [
      { owner: 'groupsum', repository: 'peagen-core', role: 'Core Engine & API', name: 'peagen-core' },
      { owner: 'groupsum', repository: 'peagen-rust-worker', role: 'High-Performance Stream Worker', name: 'peagen-rust-worker' },
      { owner: 'groupsum', repository: 'peagen-docs-site', role: 'Documentation & Portal', name: 'peagen-docs-site' }
    ],
    packageRefs: [
      { packageName: '@peagen/cli', ecosystem: 'npm', routeKey: 'npm-peagen-cli' },
      { packageName: '@peagen/core', ecosystem: 'npm', routeKey: 'npm-peagen-core' },
      { packageName: '@peagen/react-hooks', ecosystem: 'npm', routeKey: 'npm-peagen-react-hooks' },
      { packageName: 'peagen-worker', ecosystem: 'cargo', routeKey: 'cargo-peagen-worker' },
      { packageName: '@peagen/internal-engine', ecosystem: 'npm', routeKey: 'npm-peagen-internal-engine' }
    ],
    resourceRefs: [
      { name: 'Peagen Official Site', type: 'website', routeKey: 'peagen-website' },
      { name: 'Peagen Developer Docs', type: 'documentation', routeKey: 'peagen-docs' },
      { name: 'Peagen REST API v2', type: 'api', routeKey: 'peagen-api' },
      { name: 'Peagen Web Console UI', type: 'ui', routeKey: 'peagen-ui' }
    ],
    limitations: [
      'Schema verification currently supports PostgreSQL 12+ and MySQL 8.0+; Oracle SQL is not observed.',
      'Live stream indexing is bounded to 150,000 events/sec per node under default buffer configurations.'
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    id: 'prod-tigrbl',
    slug: 'tigrbl',
    name: 'Tigrbl',
    summary: 'Single-source-of-truth (SSOT) metadata governance engine and claim verification suite.',
    organization: 'groupsum',
    maturity: 'active',
    ecosystem: 'Python / Rust',
    audience: 'Compliance Lead, Governance Officers, Product Operations',
    reviewedCapabilities: [
      'Automated claim-to-evidence matrix validation',
      'Multi-ecosystem artifact hashing & immutability checks',
      'Repository-level SSOT governance rule enforcement'
    ],
    repositoryRefs: [
      { owner: 'groupsum', repository: 'tigrbl-engine', role: 'Governance & Verification Engine', name: 'tigrbl-engine' },
      { owner: 'groupsum', repository: 'tigrbl-cli', role: 'Developer Tooling & Linter', name: 'tigrbl-cli' }
    ],
    packageRefs: [
      { packageName: 'tigrbl-core', ecosystem: 'pypi', routeKey: 'pypi-tigrbl-core' },
      { packageName: 'tigrbl-cli', ecosystem: 'pypi', routeKey: 'pypi-tigrbl-cli' }
    ],
    resourceRefs: [
      { name: 'Tigrbl Governance REST Specification', type: 'api', routeKey: 'tigrbl-api' },
      { name: 'Tigrbl Integration Quickstart', type: 'example', routeKey: 'tigrbl-example' }
    ],
    limitations: [
      'Claim provenance verification requires Git commit signed GPG keys.',
      'Audit log exports limited to 10,000 entries per CSV streaming chunk.'
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    id: 'prod-swarmauri',
    slug: 'swarmauri',
    name: 'Swarmauri AI',
    summary: 'Composable agentic AI orchestration suite for multi-modal Gemini & vectorstore workflows.',
    organization: 'swarmauri-org',
    maturity: 'production',
    ecosystem: 'TypeScript & Python',
    audience: 'AI Engineers, Product Developers, System Architects',
    reviewedCapabilities: [
      'Multi-agent conversation routing & tools execution',
      'Built-in Google Gemini 2.5/3.0 vector embedding integration',
      'Modular stateful memory & RAG retrieval pipelines'
    ],
    repositoryRefs: [
      { owner: 'swarmauri-org', repository: 'swarmauri-sdk', role: 'Monorepo SDK & Core Agents', name: 'swarmauri-sdk' }
    ],
    packageRefs: [
      { packageName: '@swarmauri/core', ecosystem: 'npm', routeKey: 'npm-swarmauri-core' },
      { packageName: '@swarmauri/sdk', ecosystem: 'npm', routeKey: 'npm-swarmauri-sdk' },
      { packageName: '@swarmauri/agents', ecosystem: 'npm', routeKey: 'npm-swarmauri-agents' },
      { packageName: '@swarmauri/vectorstores', ecosystem: 'npm', routeKey: 'npm-swarmauri-vectorstores' }
    ],
    resourceRefs: [
      { name: 'Swarmauri Agent Playground', type: 'demo', routeKey: 'swarmauri-demo' },
      { name: 'Swarmauri Architecture Showcase', type: 'showcase', routeKey: 'swarmauri-showcase' }
    ],
    limitations: [
      'Streaming token responses rely on HTTP/2 server push or SSE transport.',
      'Vector store caching requires Redis 7.0+ for cluster synchronization.'
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  }
];

export const PORTFOLIO_DATA: PortfolioRecord[] = [
  {
    id: 'port-data-infra',
    slug: 'data-infrastructure',
    name: 'Data Infrastructure & Verification Portfolio',
    summary: 'Comprehensive collection of tools, engines, and verifiers driving enterprise data integrity.',
    organization: 'groupsum',
    maturity: 'production',
    domain: 'Data Integrity & Governance',
    strategicFocus: 'Ensuring zero-trust verification across schemas, APIs, and microservice dependencies.',
    products: [
      { name: 'Peagen', slug: 'peagen' },
      { name: 'Tigrbl', slug: 'tigrbl' }
    ],
    keyMetrics: [
      { label: 'Active Managed Microservices', value: '1,420+' },
      { label: 'Daily Verified Schemas', value: '48,000' },
      { label: 'Observed Compliance Rate', value: '99.94%' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    id: 'port-ai-orchestration',
    slug: 'ai-orchestration',
    name: 'Agentic AI & Orchestration Portfolio',
    summary: 'Modular SDKs and infrastructure powering intelligent agentic systems.',
    organization: 'swarmauri-org',
    maturity: 'active',
    domain: 'Artificial Intelligence & Agents',
    strategicFocus: 'Providing reproducible, observable, enterprise-grade AI agent SDKs.',
    products: [
      { name: 'Swarmauri AI', slug: 'swarmauri' }
    ],
    keyMetrics: [
      { label: 'Total Weekly NPM Downloads', value: '340,000+' },
      { label: 'Supported Vectorstores', value: '18' },
      { label: 'Agent Tools Integration', value: '65+' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  }
];

// --------------------------------------------------------------------------
// REPOSITORIES
// --------------------------------------------------------------------------
export const REPOSITORIES_DATA: RepositoryRecord[] = [
  {
    owner: 'groupsum',
    repository: 'peagen-core',
    slug: 'groupsum/peagen-core',
    organization: 'groupsum',
    role: 'Core Engine & API',
    description: 'Primary TypeScript monorepo containing Peagen schema verifier, REST controllers, and migration hooks.',
    stars: 1240,
    starsSeries: {
      period: '30d',
      dataPointCount: 30,
      completeness: 'complete',
      observedAt: CURRENT_OBSERVATION_TIME,
      points: [
        { timestamp: '2026-07-05', dateLabel: 'Jul 5', value: 1110 },
        { timestamp: '2026-07-10', dateLabel: 'Jul 10', value: 1145 },
        { timestamp: '2026-07-15', dateLabel: 'Jul 15', value: 1170 },
        { timestamp: '2026-07-20', dateLabel: 'Jul 20', value: 1195 },
        { timestamp: '2026-07-25', dateLabel: 'Jul 25', value: 1220 },
        { timestamp: '2026-08-03', dateLabel: 'Aug 3', value: 1240 }
      ]
    },
    forks: 148,
    watchers: 86,
    contributors: 34,
    commits30d: [
      { date: 'Jul 5', commitCount: 4 }, { date: 'Jul 6', commitCount: 7 }, { date: 'Jul 7', commitCount: 2 },
      { date: 'Jul 8', commitCount: 12 }, { date: 'Jul 9', commitCount: 5 }, { date: 'Jul 10', commitCount: 8 },
      { date: 'Jul 11', commitCount: 0 }, { date: 'Jul 12', commitCount: 1 }, { date: 'Jul 13', commitCount: 9 },
      { date: 'Jul 14', commitCount: 15 }, { date: 'Jul 15', commitCount: 6 }, { date: 'Jul 16', commitCount: 11 },
      { date: 'Jul 17', commitCount: 3 }, { date: 'Jul 18', commitCount: 0 }, { date: 'Jul 19', commitCount: 0 },
      { date: 'Jul 20', commitCount: 14 }, { date: 'Jul 21', commitCount: 8 }, { date: 'Jul 22', commitCount: 10 },
      { date: 'Jul 23', commitCount: 7 }, { date: 'Jul 24', commitCount: 18 }, { date: 'Jul 25', commitCount: 5 },
      { date: 'Jul 26', commitCount: 2 }, { date: 'Jul 27', commitCount: 12 }, { date: 'Jul 28', commitCount: 9 },
      { date: 'Jul 29', commitCount: 16 }, { date: 'Jul 30', commitCount: 11 }, { date: 'Jul 31', commitCount: 7 },
      { date: 'Aug 1', commitCount: 4 }, { date: 'Aug 2', commitCount: 13 }, { date: 'Aug 3', commitCount: 8 }
    ],
    packagesCount: 3,
    latestRelease: { version: 'v2.4.1', date: '2026-07-28', url: 'https://github.com/groupsum/peagen-core/releases/tag/v2.4.1' },
    governanceState: 'governed',
    languages: [
      { language: 'TypeScript', bytes: 480000, percentage: 78.5, color: '#3178c6' },
      { language: 'HTML/CSS', bytes: 85000, percentage: 13.9, color: '#e34c26' },
      { language: 'Shell', bytes: 46000, percentage: 7.6, color: '#89e051' }
    ],
    technologies: ['Docker', 'PostgreSQL', 'Express', 'React', 'Vite'],
    license: { expression: 'Apache-2.0', evidenceState: 'reviewed', noticeUrl: 'https://github.com/groupsum/peagen-core/blob/main/LICENSE' },
    sourceUrl: 'https://github.com/groupsum/peagen-core',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    owner: 'swarmauri-org',
    repository: 'swarmauri-sdk',
    slug: 'swarmauri-org/swarmauri-sdk',
    organization: 'swarmauri-org',
    role: 'Monorepo SDK',
    description: 'High-pressure monorepo hosting Swarmauri core agent frameworks, tool integrations, and vector connectors.',
    stars: 3450,
    starsSeries: {
      period: '30d',
      dataPointCount: 30,
      completeness: 'complete',
      observedAt: CURRENT_OBSERVATION_TIME,
      points: [
        { timestamp: '2026-07-05', dateLabel: 'Jul 5', value: 3100 },
        { timestamp: '2026-07-12', dateLabel: 'Jul 12', value: 3220 },
        { timestamp: '2026-07-19', dateLabel: 'Jul 19', value: 3310 },
        { timestamp: '2026-07-26', dateLabel: 'Jul 26', value: 3390 },
        { timestamp: '2026-08-03', dateLabel: 'Aug 3', value: 3450 }
      ]
    },
    forks: 412,
    watchers: 210,
    contributors: 78,
    commits30d: [
      { date: 'Jul 5', commitCount: 18 }, { date: 'Jul 6', commitCount: 22 }, { date: 'Jul 7', commitCount: 14 },
      { date: 'Jul 8', commitCount: 31 }, { date: 'Jul 9', commitCount: 25 }, { date: 'Jul 10', commitCount: 19 },
      { date: 'Jul 11', commitCount: 8 }, { date: 'Jul 12', commitCount: 5 }, { date: 'Jul 13', commitCount: 28 },
      { date: 'Jul 14', commitCount: 34 }, { date: 'Jul 15', commitCount: 29 }, { date: 'Jul 16', commitCount: 21 },
      { date: 'Jul 17', commitCount: 16 }, { date: 'Jul 18', commitCount: 7 }, { date: 'Jul 19', commitCount: 4 },
      { date: 'Jul 20', commitCount: 38 }, { date: 'Jul 21', commitCount: 42 }, { date: 'Jul 22', commitCount: 33 },
      { date: 'Jul 23', commitCount: 27 }, { date: 'Jul 24', commitCount: 35 }, { date: 'Jul 25', commitCount: 18 },
      { date: 'Jul 26', commitCount: 10 }, { date: 'Jul 27', commitCount: 30 }, { date: 'Jul 28', commitCount: 26 },
      { date: 'Jul 29', commitCount: 41 }, { date: 'Jul 30', commitCount: 37 }, { date: 'Jul 31', commitCount: 22 },
      { date: 'Aug 1', commitCount: 12 }, { date: 'Aug 2', commitCount: 29 }, { date: 'Aug 3', commitCount: 19 }
    ],
    packagesCount: 4,
    latestRelease: { version: 'v3.2.0', date: '2026-07-30', url: 'https://github.com/swarmauri-org/swarmauri-sdk/releases/tag/v3.2.0' },
    governanceState: 'governed',
    languages: [
      { language: 'TypeScript', bytes: 890000, percentage: 65.2, color: '#3178c6' },
      { language: 'Python', bytes: 420000, percentage: 30.8, color: '#3572A5' },
      { language: 'Rust', bytes: 55000, percentage: 4.0, color: '#dea584' }
    ],
    technologies: ['Gemini AI API', 'Docker', 'Redis', 'PostgreSQL'],
    license: { expression: 'MIT', evidenceState: 'reviewed', noticeUrl: 'https://github.com/swarmauri-org/swarmauri-sdk/blob/main/LICENSE' },
    sourceUrl: 'https://github.com/swarmauri-org/swarmauri-sdk',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    owner: 'groupsum',
    repository: 'tigrbl-engine',
    slug: 'groupsum/tigrbl-engine',
    organization: 'groupsum',
    role: 'Governance Engine',
    description: 'Python & Rust engine for claim immutability, evidence validation, and governance audits.',
    stars: 620,
    starsSeries: {
      period: '30d',
      dataPointCount: 15,
      completeness: 'complete',
      observedAt: CURRENT_OBSERVATION_TIME,
      points: [
        { timestamp: '2026-07-05', dateLabel: 'Jul 5', value: 580 },
        { timestamp: '2026-07-20', dateLabel: 'Jul 20', value: 605 },
        { timestamp: '2026-08-03', dateLabel: 'Aug 3', value: 620 }
      ]
    },
    forks: 52,
    watchers: 38,
    contributors: 14,
    commits30d: [
      { date: 'Jul 5', commitCount: 2 }, { date: 'Jul 8', commitCount: 5 }, { date: 'Jul 12', commitCount: 3 },
      { date: 'Jul 15', commitCount: 8 }, { date: 'Jul 19', commitCount: 1 }, { date: 'Jul 22', commitCount: 6 },
      { date: 'Jul 27', commitCount: 4 }, { date: 'Aug 1', commitCount: 7 }, { date: 'Aug 3', commitCount: 3 }
    ],
    packagesCount: 2,
    latestRelease: { version: 'v1.8.0', date: '2026-07-15', url: 'https://github.com/groupsum/tigrbl-engine/releases/tag/v1.8.0' },
    governanceState: 'governed',
    languages: [
      { language: 'Python', bytes: 340000, percentage: 72.0, color: '#3572A5' },
      { language: 'Rust', bytes: 132000, percentage: 28.0, color: '#dea584' }
    ],
    technologies: ['PostgreSQL', 'Docker'],
    license: { expression: 'Apache-2.0', evidenceState: 'reviewed' },
    sourceUrl: 'https://github.com/groupsum/tigrbl-engine',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    owner: 'groupsum',
    repository: 'portwyrm',
    slug: 'groupsum/portwyrm',
    organization: 'groupsum',
    role: 'Container Proxy & Package Host',
    description: 'High-speed Rust proxy for GitHub Container Registry (GHCR) package delivery and caching.',
    stars: 480,
    starsSeries: {
      period: '30d',
      dataPointCount: 10,
      completeness: 'complete',
      observedAt: CURRENT_OBSERVATION_TIME,
      points: [
        { timestamp: '2026-07-05', dateLabel: 'Jul 5', value: 450 },
        { timestamp: '2026-08-03', dateLabel: 'Aug 3', value: 480 }
      ]
    },
    forks: 31,
    watchers: 22,
    contributors: 9,
    commits30d: [
      { date: 'Jul 10', commitCount: 6 }, { date: 'Jul 18', commitCount: 4 }, { date: 'Jul 25', commitCount: 9 }, { date: 'Aug 2', commitCount: 5 }
    ],
    packagesCount: 1,
    latestRelease: { version: 'v0.9.4', date: '2026-07-22', url: 'https://github.com/groupsum/portwyrm/releases/tag/v0.9.4' },
    governanceState: 'partial',
    languages: [
      { language: 'Rust', bytes: 290000, percentage: 94.0, color: '#dea584' },
      { language: 'Shell', bytes: 18500, percentage: 6.0, color: '#89e051' }
    ],
    technologies: ['Docker', 'Kubernetes'],
    license: { expression: 'MIT', evidenceState: 'reviewed' },
    sourceUrl: 'https://github.com/groupsum/portwyrm',
    observedAt: CURRENT_OBSERVATION_TIME
  }
];

// --------------------------------------------------------------------------
// PACKAGES
// --------------------------------------------------------------------------
export const PACKAGES_DATA: PackageRecord[] = [
  {
    ecosystem: 'npm',
    routeKey: 'npm-peagen-core',
    packageName: '@peagen/core',
    summary: 'Core schema verification engine, migration validator, and type assertion helpers.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core', manifestPath: 'packages/core/package.json' },
    packageKind: 'library',
    publicationState: 'published',
    latestVersion: '2.4.1',
    releaseCount: 18,
    downloadTrend: {
      period: '30d',
      dataPointCount: 30,
      completeness: 'complete',
      observedAt: CURRENT_OBSERVATION_TIME,
      points: [
        { timestamp: '2026-07-05', dateLabel: 'Jul 5', value: 12400 },
        { timestamp: '2026-07-15', dateLabel: 'Jul 15', value: 14800 },
        { timestamp: '2026-07-25', dateLabel: 'Jul 25', value: 16200 },
        { timestamp: '2026-08-03', dateLabel: 'Aug 3', value: 18500 }
      ]
    },
    dependencies: [
      { name: 'zod', version: '^3.22.4', scope: 'runtime', isInternal: false },
      { name: 'pg', version: '^8.11.3', scope: 'runtime', isInternal: false },
      { name: 'typescript', version: '^5.4.0', scope: 'dev', isInternal: false }
    ],
    dependentsCount: 42,
    dependents: [
      { name: '@peagen/cli', ecosystem: 'npm', routeKey: 'npm-peagen-cli', owner: 'groupsum' },
      { name: '@peagen/react-hooks', ecosystem: 'npm', routeKey: 'npm-peagen-react-hooks', owner: 'groupsum' }
    ],
    license: 'Apache-2.0',
    registryUrl: 'https://www.npmjs.com/package/@peagen/core',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'npm',
    routeKey: 'npm-peagen-cli',
    packageName: '@peagen/cli',
    summary: 'Command line interface for running schema verification and drift checks in CI/CD.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core', manifestPath: 'packages/cli/package.json' },
    packageKind: 'cli',
    publicationState: 'published',
    latestVersion: '2.4.1',
    releaseCount: 14,
    dependencies: [
      { name: '@peagen/core', version: '^2.4.1', scope: 'runtime', isInternal: true },
      { name: 'commander', version: '^11.1.0', scope: 'runtime', isInternal: false },
      { name: 'chalk', version: '^5.3.0', scope: 'runtime', isInternal: false }
    ],
    dependentsCount: 12,
    dependents: [],
    license: 'Apache-2.0',
    registryUrl: 'https://www.npmjs.com/package/@peagen/cli',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'npm',
    routeKey: 'npm-peagen-react-hooks',
    packageName: '@peagen/react-hooks',
    summary: 'React hooks for subscribing to real-time schema verification state and topology stream updates.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core', manifestPath: 'packages/react-hooks/package.json' },
    packageKind: 'library',
    publicationState: 'published',
    latestVersion: '2.4.0',
    releaseCount: 9,
    dependencies: [
      { name: '@peagen/core', version: '^2.4.0', scope: 'runtime', isInternal: true },
      { name: 'react', version: '^18.0.0 || ^19.0.0', scope: 'peer', isInternal: false }
    ],
    dependentsCount: 8,
    dependents: [],
    license: 'Apache-2.0',
    registryUrl: 'https://www.npmjs.com/package/@peagen/react-hooks',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'npm',
    routeKey: 'npm-peagen-internal-engine',
    packageName: '@peagen/internal-engine',
    summary: 'Private experimental schema parsing algorithm undergoing internal performance validation.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core', manifestPath: 'packages/internal-engine/package.json' },
    packageKind: 'library',
    publicationState: 'candidate',
    latestVersion: '0.1.0-alpha',
    releaseCount: 1,
    dependencies: [
      { name: 'esbuild', version: '^0.20.0', scope: 'dev', isInternal: false }
    ],
    dependentsCount: 1,
    dependents: [
      { name: '@peagen/core', ecosystem: 'npm', routeKey: 'npm-peagen-core', owner: 'groupsum' }
    ],
    license: 'UNLICENSED (Internal candidate)',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'npm',
    routeKey: 'npm-swarmauri-core',
    packageName: '@swarmauri/core',
    summary: 'Base interfaces, abstract agent primitives, and tools contract for Swarmauri framework.',
    owningRepository: { owner: 'swarmauri-org', repository: 'swarmauri-sdk', manifestPath: 'packages/core/package.json' },
    packageKind: 'library',
    publicationState: 'published',
    latestVersion: '3.2.0',
    releaseCount: 24,
    downloadTrend: {
      period: '30d',
      dataPointCount: 30,
      completeness: 'complete',
      observedAt: CURRENT_OBSERVATION_TIME,
      points: [
        { timestamp: '2026-07-05', dateLabel: 'Jul 5', value: 45000 },
        { timestamp: '2026-07-20', dateLabel: 'Jul 20', value: 52000 },
        { timestamp: '2026-08-03', dateLabel: 'Aug 3', value: 61000 }
      ]
    },
    dependencies: [
      { name: 'zod', version: '^3.22.4', scope: 'runtime', isInternal: false },
      { name: 'rxjs', version: '^7.8.1', scope: 'runtime', isInternal: false }
    ],
    dependentsCount: 185,
    dependents: [
      { name: '@swarmauri/sdk', ecosystem: 'npm', routeKey: 'npm-swarmauri-sdk', owner: 'swarmauri-org' },
      { name: '@swarmauri/agents', ecosystem: 'npm', routeKey: 'npm-swarmauri-agents', owner: 'swarmauri-org' }
    ],
    license: 'MIT',
    registryUrl: 'https://www.npmjs.com/package/@swarmauri/core',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'npm',
    routeKey: 'npm-swarmauri-sdk',
    packageName: '@swarmauri/sdk',
    summary: 'Full agent orchestrator SDK integrating Gemini models, vectorstores, and tool execution engines.',
    owningRepository: { owner: 'swarmauri-org', repository: 'swarmauri-sdk', manifestPath: 'packages/sdk/package.json' },
    packageKind: 'sdk',
    publicationState: 'published',
    latestVersion: '3.2.0',
    releaseCount: 24,
    dependencies: [
      { name: '@swarmauri/core', version: '^3.2.0', scope: 'runtime', isInternal: true },
      { name: '@google/genai', version: '^2.4.0', scope: 'runtime', isInternal: false }
    ],
    dependentsCount: 240,
    dependents: [],
    license: 'MIT',
    registryUrl: 'https://www.npmjs.com/package/@swarmauri/sdk',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'pypi',
    routeKey: 'pypi-tigrbl-core',
    packageName: 'tigrbl-core',
    summary: 'Python governance library for calculating claim hash trees and verifying manifest signatures.',
    owningRepository: { owner: 'groupsum', repository: 'tigrbl-engine', manifestPath: 'pyproject.toml' },
    packageKind: 'library',
    publicationState: 'published',
    latestVersion: '1.8.0',
    releaseCount: 12,
    dependencies: [
      { name: 'pydantic', version: '>=2.5.0', scope: 'runtime', isInternal: false },
      { name: 'cryptography', version: '>=41.0.0', scope: 'runtime', isInternal: false }
    ],
    dependentsCount: 19,
    dependents: [
      { name: 'tigrbl-cli', ecosystem: 'pypi', routeKey: 'pypi-tigrbl-cli', owner: 'groupsum' }
    ],
    license: 'Apache-2.0',
    registryUrl: 'https://pypi.org/project/tigrbl-core/',
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    ecosystem: 'ghcr',
    routeKey: 'ghcr-portwyrm',
    packageName: 'ghcr.io/groupsum/portwyrm',
    summary: 'Container image release of Portwyrm Rust GHCR caching proxy service.',
    owningRepository: { owner: 'groupsum', repository: 'portwyrm', manifestPath: 'Dockerfile' },
    packageKind: 'container',
    publicationState: 'published',
    latestVersion: 'v0.9.4',
    releaseCount: 6,
    dependencies: [],
    dependentsCount: 14,
    dependents: [],
    license: 'MIT',
    registryUrl: 'https://github.com/groupsum/portwyrm/pkgs/container/portwyrm',
    observedAt: CURRENT_OBSERVATION_TIME
  }
];

// --------------------------------------------------------------------------
// TYPED RESOURCES
// --------------------------------------------------------------------------
export const TYPED_RESOURCES_DATA: TypedResourceRecord[] = [
  {
    resourceType: 'website',
    routeKey: 'peagen-website',
    name: 'Peagen Official Landing Site',
    purpose: 'Public website detailing Peagen schema verification product capabilities, documentation links, and enterprise inquiry form.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core' },
    url: 'https://peagen.io',
    reachability: 'verified',
    relatedProduct: { name: 'Peagen', slug: 'peagen' },
    specDetails: { framework: 'Next.js & Tailwind CSS' },
    limitations: ['Hosted on Vercel CDN; status updated every 60 minutes.'],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    resourceType: 'documentation',
    routeKey: 'peagen-docs',
    name: 'Peagen Architecture & Integration Documentation',
    purpose: 'Comprehensive guides for schema verification, CLI configuration, and CI pipeline setup.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-docs-site' },
    url: 'https://docs.peagen.io',
    reachability: 'verified',
    relatedProduct: { name: 'Peagen', slug: 'peagen' },
    specDetails: { framework: 'Starlight / Astro' },
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    resourceType: 'api',
    routeKey: 'peagen-api',
    name: 'Peagen Verification REST API v2',
    purpose: 'Programmatic REST endpoint for submitting database schema DDL for instant compliance validation.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core' },
    url: 'https://api.peagen.io/v2/openapi.json',
    reachability: 'verified',
    relatedProduct: { name: 'Peagen', slug: 'peagen' },
    specDetails: { contractVersion: 'OpenAPI 3.1.0', authBoundary: 'Bearer API Token or OAuth2' },
    limitations: ['Rate limit: 1,000 schema validation requests per hour for basic tier.'],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    resourceType: 'ui',
    routeKey: 'peagen-ui',
    name: 'Peagen Topology Visualizer Console',
    purpose: 'Interactive web UI for inspecting database schema drift, relationship graphs, and migration histories.',
    owningRepository: { owner: 'groupsum', repository: 'peagen-core' },
    url: 'https://app.peagen.io',
    reachability: 'verified',
    relatedProduct: { name: 'Peagen', slug: 'peagen' },
    specDetails: { framework: 'React & Cytoscape.js' },
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    resourceType: 'demo',
    routeKey: 'swarmauri-demo',
    name: 'Swarmauri Agent Interactive Playground',
    purpose: 'Live web app demonstrating multi-agent Gemini tool invocation, memory management, and stream debugging.',
    owningRepository: { owner: 'swarmauri-org', repository: 'swarmauri-sdk' },
    url: 'https://swarmauri.org/playground',
    reachability: 'verified',
    relatedProduct: { name: 'Swarmauri AI', slug: 'swarmauri' },
    specDetails: { framework: 'Vite & React' },
    limitations: ['Requires a valid Gemini API key entered via user environment or demo token sandbox.'],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    resourceType: 'showcase',
    routeKey: 'swarmauri-showcase',
    name: 'Swarmauri Multi-Agent RAG Showcase',
    purpose: 'Case study showcasing real-time retrieval-augmented generation across 500,000 enterprise PDF documents.',
    owningRepository: { owner: 'swarmauri-org', repository: 'swarmauri-sdk' },
    url: 'https://swarmauri.org/showcase/enterprise-rag',
    reachability: 'verified',
    relatedProduct: { name: 'Swarmauri AI', slug: 'swarmauri' },
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    resourceType: 'example',
    routeKey: 'tigrbl-example',
    name: 'Tigrbl SSOT Governance Quickstart Script',
    purpose: 'Step-by-step example script showing how to link Git commits to verified claims in PyTest.',
    owningRepository: { owner: 'groupsum', repository: 'tigrbl-engine' },
    url: 'https://github.com/groupsum/tigrbl-engine/tree/main/examples/quickstart',
    reachability: 'verified',
    relatedProduct: { name: 'Tigrbl', slug: 'tigrbl' },
    specDetails: { scenario: 'Python 3.11 CI pipeline verification' },
    observedAt: CURRENT_OBSERVATION_TIME
  }
];

// --------------------------------------------------------------------------
// TECHNOLOGIES (Categorical vs Languages!)
// --------------------------------------------------------------------------
export const TECHNOLOGIES_DATA: TechnologyRecord[] = [
  {
    slug: 'docker',
    name: 'Docker',
    category: 'Containerization & Infrastructure',
    summary: 'Container platform utilized for consistent deployment environments across Peagen, Swarmauri, and Portwyrm.',
    iconName: 'Box',
    relatedRecordRefs: [
      { entityType: 'repository', name: 'groupsum/peagen-core', route: '/catalog/repositories/groupsum/peagen-core' },
      { entityType: 'repository', name: 'swarmauri-org/swarmauri-sdk', route: '/catalog/repositories/swarmauri-org/swarmauri-sdk' },
      { entityType: 'package', name: 'ghcr.io/groupsum/portwyrm', route: '/catalog/packages/ghcr/ghcr-portwyrm' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL',
    category: 'Relational Database',
    summary: 'Primary relational store for schema snapshot history, audit logs, and governance metadata.',
    iconName: 'Database',
    relatedRecordRefs: [
      { entityType: 'product', name: 'Peagen', route: '/products/records/peagen' },
      { entityType: 'repository', name: 'groupsum/peagen-core', route: '/catalog/repositories/groupsum/peagen-core' },
      { entityType: 'repository', name: 'groupsum/tigrbl-engine', route: '/catalog/repositories/groupsum/tigrbl-engine' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    slug: 'gemini-ai',
    name: 'Gemini AI API',
    category: 'Artificial Intelligence & LLM',
    summary: 'Google Gemini multimodal models powering Swarmauri agent reasoning, tool selection, and text generation.',
    iconName: 'Sparkles',
    relatedRecordRefs: [
      { entityType: 'product', name: 'Swarmauri AI', route: '/products/records/swarmauri' },
      { entityType: 'package', name: '@swarmauri/sdk', route: '/catalog/packages/npm/npm-swarmauri-sdk' },
      { entityType: 'resource', name: 'Swarmauri Agent Interactive Playground', route: '/catalog/resources/demo/swarmauri-demo' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    slug: 'express',
    name: 'Express.js',
    category: 'Web Framework',
    summary: 'Server side API routing engine serving proxy requests and OpenAPI endpoints.',
    iconName: 'Server',
    relatedRecordRefs: [
      { entityType: 'repository', name: 'groupsum/peagen-core', route: '/catalog/repositories/groupsum/peagen-core' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  },
  {
    slug: 'react',
    name: 'React',
    category: 'UI Library',
    summary: 'Declarative component framework driving Peagen Web Console, Swarmauri Playground, and GroupSum Catalog.',
    iconName: 'Code',
    relatedRecordRefs: [
      { entityType: 'package', name: '@peagen/react-hooks', route: '/catalog/packages/npm/npm-peagen-react-hooks' },
      { entityType: 'resource', name: 'Peagen Topology Visualizer Console', route: '/catalog/resources/ui/peagen-ui' }
    ],
    observedAt: CURRENT_OBSERVATION_TIME
  }
];

// --------------------------------------------------------------------------
// SSOT GOVERNANCE RECORDS
// --------------------------------------------------------------------------
export const SSOT_GOVERNANCE_DATA: Record<string, SSOTGovernanceRecord> = {
  'groupsum/peagen-core': {
    repositorySlug: 'groupsum/peagen-core',
    canonicalRegistry: 'https://groupsum.xyz/registry/peagen-core',
    governanceState: 'governed',
    inventory: [
      { label: 'Verified Schemas', count: 142, icon: 'CheckCircle' },
      { label: 'Migration Hooks', count: 28, icon: 'GitMerge' },
      { label: 'Security Assertions', count: 64, icon: 'Shield' },
      { label: 'Audit Log Chain', count: 1250, icon: 'Lock' }
    ],
    claimCoverage: {
      numerator: 88,
      denominator: 92,
      percentage: 95.6
    },
    evidenceLinks: [
      { title: 'GPG Commit Signature Audit Log', url: 'https://groupsum.xyz/audit/peagen-gpg-2026', observedAt: CURRENT_OBSERVATION_TIME },
      { title: 'NPM Security Provenance Attestation', url: 'https://www.npmjs.com/package/@peagen/core/access', observedAt: CURRENT_OBSERVATION_TIME }
    ],
    explicitLimitation: 'Governance coverage excludes legacy v1 migration hooks deprecated prior to Jan 2026.'
  },
  'groupsum/tigrbl-engine': {
    repositorySlug: 'groupsum/tigrbl-engine',
    canonicalRegistry: 'https://groupsum.xyz/registry/tigrbl-engine',
    governanceState: 'governed',
    inventory: [
      { label: 'Claims Asserted', count: 310, icon: 'FileText' },
      { label: 'Evidence Cryptographic Hashes', count: 310, icon: 'Key' },
      { label: 'Validated Repositories', count: 18, icon: 'Folder' }
    ],
    claimCoverage: {
      numerator: 310,
      denominator: 310,
      percentage: 100.0
    },
    evidenceLinks: [
      { title: 'Tigrbl Immutable Claim Ledger #8941', url: 'https://groupsum.xyz/ledger/claim-8941', observedAt: CURRENT_OBSERVATION_TIME }
    ],
    explicitLimitation: 'Claims are re-evaluated automatically on every main branch push.'
  },
  'groupsum/portwyrm': {
    repositorySlug: 'groupsum/portwyrm',
    canonicalRegistry: 'https://groupsum.xyz/registry/portwyrm',
    governanceState: 'partial',
    inventory: [
      { label: 'Container Signatures', count: 12, icon: 'Box' },
      { label: 'GHCR Digest Verifications', count: 45, icon: 'Check' }
    ],
    claimCoverage: {
      numerator: 12,
      denominator: 16,
      percentage: 75.0
    },
    evidenceLinks: [
      { title: 'Cosign Container Signature Log', url: 'https://github.com/groupsum/portwyrm/attestations', observedAt: CURRENT_OBSERVATION_TIME }
    ],
    explicitLimitation: 'Partial governance: ARM64 multi-arch digests are awaiting automated Cosign verification.'
  }
};

// --------------------------------------------------------------------------
// RELEASES
// --------------------------------------------------------------------------
export const RELEASES_DATA: ReleaseRecord[] = [
  {
    routeKey: 'peagen-core-v2-4-1',
    version: 'v2.4.1',
    tagName: 'v2.4.1',
    releaseKind: 'github',
    ownerRef: { type: 'repository', name: 'groupsum/peagen-core', route: '/catalog/repositories/groupsum/peagen-core' },
    publishedAt: '2026-07-28T14:30:00Z',
    isPrerelease: false,
    isDraft: false,
    downloadsCount: 1420,
    notes: 'Hotfix for PostgreSQL 16 partition table inspection and improved CLI diagnostic error codes.',
    licenseInherited: 'Apache-2.0',
    sourceUrl: 'https://github.com/groupsum/peagen-core/releases/tag/v2.4.1'
  },
  {
    routeKey: 'swarmauri-sdk-v3-2-0',
    version: 'v3.2.0',
    tagName: 'v3.2.0',
    releaseKind: 'registry',
    ownerRef: { type: 'package', name: '@swarmauri/sdk', route: '/catalog/packages/npm/npm-swarmauri-sdk' },
    publishedAt: '2026-07-30T10:15:00Z',
    isPrerelease: false,
    isDraft: false,
    downloadsCount: 18500,
    notes: 'Added native Google Gemini 3.0 Flash support, stream tool hooks, and optimized vector cache memory.',
    licenseInherited: 'MIT',
    sourceUrl: 'https://www.npmjs.com/package/@swarmauri/sdk/v/3.2.0'
  }
];
