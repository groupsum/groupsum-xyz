import type { EntityGraph } from "../api/catalog.generated";

export type CatalogSourceObservation = { kind?: string; url?: string; observed_at?: string };

/** Deliberate UI projection shared by collection rows and typed member sections. */
export type CatalogViewRecord = {
  id: string;
  kind?: string; name?: string; display_name?: string; full_name?: string; title?: string;
  description?: string; summary?: string; route?: string; route_key?: string | null;
  url?: string; registry_url?: string; source_url?: string; observed_at?: string | null;
  claim_boundary?: string; metrics?: Record<string, number>; history?: unknown; commit_activity?: unknown;
  evidence?: CatalogSourceObservation[]; legal_observations?: unknown[]; ssot_governance?: Record<string, unknown>;
  entity_graph?: EntityGraph | null; owner?: string; organization?: string; ecosystem?: string;
  publication_status?: string | null; package_kind?: string; resource_type?: string; category?: string | null;
  repository_owner?: string | null; repository_name?: string | null; repository_id?: string;
  repository_route?: string; repository?: unknown; repositories?: unknown; packages?: unknown;
  related_resources?: unknown; related_records?: unknown; releases?: unknown; dependencies?: unknown;
  dependents?: unknown; parent?: unknown; technologies?: unknown; release_count?: number;
  dependency_count?: number; dependent_count?: number; downstream_count?: number; repository_count?: number;
  downloads?: unknown; github_releases?: unknown; latest_version?: string | null; latest_release?: unknown;
  latest_commit?: unknown; latest_deployment?: unknown; license?: string; license_expression?: unknown;
  license_status?: unknown; version?: string; version_declared?: string; release_kind?: string;
  origin_kind?: string; path?: string; visibility?: string; default_branch?: string;
  description_source?: string; downstream_completeness?: string; created_at?: string; pushed_at?: string;
  published_at?: string; published?: boolean | null; prerelease?: boolean; draft?: boolean; bytes?: number;
  linked_sections?: unknown; resource_family?: string; type_label?: string; icon_key?: string;
  ssot?: unknown;
};
