import { useEffect, useMemo, useState } from "react";
import {
  RecordCollectionPageModel,
  RecordSummary,
  getRecordCollectionPageModel,
} from "../../api/catalog";
import { portfolioEntities } from "../../data/entities";
import { PortfolioEntity } from "../../types";
import { ExplorerProductPortfolioCollection } from "./ExplorerProductPortfolioCollection";

import { collectionKinds, initialCollectionModel, type CollectionMode, type CollectionRecord, type Navigate } from "./ProductPortfolioShared";

function staticCollectionRecord(entity: PortfolioEntity): CollectionRecord {
  return {
    id: entity.id,
    slug: entity.slug,
    recordType: entity.kind === "project" ? "portfolio" : "product",
    kind: entity.kind,
    title: entity.displayName,
    summary: entity.summary,
    maturity: entity.maturity,
    organization: entity.organization,
    audience: entity.audience,
    technologies: entity.technologies,
    featured: entity.featured,
    repositoryCount: 0,
    packageCount: 0,
    resourceCount: 0,
  };
}

function backendCollectionRecord(record: RecordSummary): CollectionRecord {
  return {
    id: record.id,
    slug: record.slug,
    recordType: record.record_type === "portfolio" ? "portfolio" : "product",
    kind: record.eyebrow || record.record_type,
    title: record.title,
    summary: record.summary,
    maturity: record.maturity || "not classified",
    organization: record.organization_id,
    audience: [],
    technologies: record.technologies,
    featured: record.featured,
    repositoryCount: record.repository_count,
    packageCount: record.package_count,
    resourceCount: record.resource_count,
  };
}

export function ProductCollectionPage({
  mode,
  organization,
  onNavigate,
}: {
  mode: CollectionMode;
  organization?: string;
  onNavigate: Navigate;
}) {
  const collectionType = mode === "products" ? "product" : "portfolio";
  const [collectionModel, setCollectionModel] = useState<RecordCollectionPageModel | null>(
    () => initialCollectionModel(collectionType),
  );
  useEffect(() => {
    if (collectionModel) return;
    const controller = new AbortController();
    getRecordCollectionPageModel(mode, controller.signal)
      .then((value) => setCollectionModel(value))
      .catch((error: Error) => { if (error.name !== "AbortError") setCollectionModel((value) => value); });
    return () => controller.abort();
  }, [mode, collectionModel]);
  const baseRecords = useMemo(() => {
    const staticRecords = portfolioEntities
      .filter((entity) => entity.approved)
      .filter((entity) => mode === "products" ? collectionKinds.has(entity.kind) : entity.kind === "project")
      .map(staticCollectionRecord);
    const merged = new Map(staticRecords.map((record) => [`${record.recordType}:${record.slug}`, record]));
    for (const backend of collectionModel?.records || []) {
      const record = backendCollectionRecord(backend);
      const key = `${record.recordType}:${record.slug}`;
      const editorial = merged.get(key);
      merged.set(key, editorial ? {
        ...editorial,
        ...record,
        kind: editorial.kind,
        audience: editorial.audience,
        technologies: [...new Set([...editorial.technologies, ...record.technologies])],
      } : record);
    }
    return [...merged.values()].filter((record) => !organization || record.organization === organization);
  }, [collectionModel, mode, organization]);

  return <ExplorerProductPortfolioCollection
    mode={mode}
    records={baseRecords}
    observedAt={collectionModel?.generated_at}
    organization={organization}
    onNavigate={onNavigate}
  />;
}
