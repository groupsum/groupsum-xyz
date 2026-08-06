import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Box, Building2, CheckCircle2, ExternalLink, FileCode2, GitBranch, Info, Layers, Package, Search, ShieldCheck } from "lucide-react";
import {
  PackageResource,
  RecordCollectionPageModel,
  RecordPageModel,
  RecordSummary,
  RepositoryResource,
  RepositorySignals,
  getRecordPageModel,
} from "../../api/catalog.generated";
import { portfolioEntities } from "../../data/entities";
import { PortfolioEntity } from "../../types";
import { RepositorySignalStrip } from "../catalog/RepositorySignals";
import { EntityOwnership } from "../catalog/EntityIdentity";
import { CollectionHeader, ContextRailCard, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons } from "../catalog/CatalogVisuals";
import { ExplorerProductPortfolioCollection } from "./ExplorerProductPortfolioCollection";

export type Navigate = (path: string) => void;
export type CollectionMode = "products" | "portfolio";

export type RelatedResource = {
  id: string;
  kind?: string;
  name?: string;
  url?: string;
  route?: string;
  origin_kind?: string;
};

export type CatalogPackage = PackageResource & { display_name?: string; route?: string };

export type CatalogRepository = {
  id: string;
  name: string;
  full_name: string;
  route?: string;
  url?: string;
  observed_at?: string;
  metrics?: Record<string, number>;
  latest_release?: Record<string, unknown> | null;
  latest_deployment?: Record<string, unknown> | null;
  relationship_counts?: Record<string, number>;
  related_resources?: RelatedResource[];
  repository_count?: number;
  deployment_count?: number;
};

export type ProductCatalogBundle = {
  generated_at: string;
  repository: CatalogRepository;
  packages: CatalogPackage[];
};

export type ProductPageModel = RecordPageModel;

export type CollectionRecord = {
  id: string;
  slug: string;
  recordType: "product" | "portfolio";
  kind: string;
  title: string;
  summary: string;
  maturity: string;
  organization: string;
  audience: string[];
  technologies: string[];
  featured: boolean;
  repositoryCount: number;
  packageCount: number;
  resourceCount: number;
};

export function initialProductModel(slug: string, recordType: "product" | "portfolio"): ProductPageModel | null {
  const model = globalThis.__GROUPSUM_API_SNAPSHOT__ as ProductPageModel | null | undefined;
  return model?.kind === `${recordType}_record` && model.record.slug === slug ? model : null;
}

export function initialCollectionModel(recordType: "product" | "portfolio"): RecordCollectionPageModel | null {
  const model = globalThis.__GROUPSUM_API_SNAPSHOT__ as RecordCollectionPageModel | null | undefined;
  return model?.kind === `${recordType}_collection` ? model : null;
}

export function catalogBundle(model: ProductPageModel): ProductCatalogBundle {
  const repositories = model.implementation.repositories;
  const primary = repositories[0];
  return {
    generated_at: model.generated_at,
    repository: {
      id: primary?.id || model.record.slug,
      name: primary?.name || model.record.slug,
      full_name: primary ? `${primary.owner}/${primary.name}` : model.record.slug,
      url: primary?.url,
      observed_at: primary?.observed_at,
      metrics: primary?.metrics || {},
      repository_count: repositories.length,
      deployment_count: model.implementation.deployments.length,
      related_resources: model.implementation.resources.map((resource) => ({
        id: resource.id,
        kind: resource.resource_type,
        name: resource.title,
        url: resource.route_key
          ? `/catalog/resources/${resource.resource_type}/${resource.route_key}`
          : resource.url,
        route: resource.route_key ? `/catalog/resources/${resource.resource_type}/${resource.route_key}` : undefined,
      })),
    },
    packages: model.implementation.packages,
  };
}

export const organizationNames: Record<string, string> = {
  groupsum: "GroupSum",
  tigrbl: "Tigrbl",
  swarmauri: "Swarmauri",
};

export const collectionKinds = new Set(["suite", "product", "application", "package-family"]);

export function humanize(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ecosystemLabel(value: string): string {
  return ({ pypi: "PyPI", npm: "npm", crates: "crates.io", ghcr: "GHCR", github: "GitHub Releases", "github-npm": "GitHub npm" } as Record<string, string>)[value] || humanize(value);
}

const stableDate = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const stableTimestamp = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
export function formatObserved(value: string, includeTime = false): string {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : (includeTime ? stableTimestamp : stableDate).format(date);
}

export function productRecordPath(slug: string): string {
  return `/products/records/${slug}`;
}

export function portfolioRecordPath(slug: string): string {
  return `/portfolio/records/${slug}`;
}

export function productRoute(entity: PortfolioEntity): string {
  return productRecordPath(entity.slug);
}

export function collectionRecordPath(record: CollectionRecord): string {
  return record.recordType === "portfolio"
    ? portfolioRecordPath(record.slug)
    : productRecordPath(record.slug);
}

export function repositorySignals(repository: RepositoryResource): RepositorySignals {
  return {
    repository_count: 1,
    metrics: {
      stars: Number(repository.metrics.stars || 0),
      forks: Number(repository.metrics.forks || 0),
      watchers: Number(repository.metrics.watchers || 0),
      contributors: Number(repository.metrics.contributors || 0),
      commits: Number(repository.metrics.commits || 0),
    },
    history: repository.history,
    commit_activity: repository.commit_activity,
    observed_at: repository.observed_at,
  };
}
