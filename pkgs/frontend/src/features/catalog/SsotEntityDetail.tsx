import React from "react";
import { BadgeCheck, GitBranch, ShieldCheck } from "lucide-react";
import { LinkedResourceSections } from "./CatalogCollections";
import { CatalogPill, FactPanel, MetricBand } from "./CatalogVisuals";
import { DetailRows, DetailSection, formatDate, humanLabel, valueRecord, valueRecords, type CatalogRecord } from "./CatalogRecordShared";

type Navigate = (path: string) => void;
type Spec = [label: string, fields: string[]];
const specs: Record<string, Spec> = {
  "governance.registry": ["SSOT registry", ["schema_version", "valid", "source_sha256"]],
  "governance.adr": ["Architecture decision", ["number", "origin", "managed", "immutable", "supersedes", "superseded_by", "status_notes", "content_sha256"]],
  "governance.spec": ["Specification", ["number", "ssot_kind", "origin", "adr_ids", "immutable", "content_sha256"]],
  "governance.feature": ["Feature", ["implementation_status", "lifecycle.stage", "plan.horizon", "plan.slot", "plan.target_claim_tier", "lifecycle.effective_release_id", "requires", "parent_feature_ids"]],
  "governance.profile": ["Conformance profile", ["ssot_kind", "claim_tier", "evaluation", "feature_ids", "profile_ids"]],
  "governance.test": ["Governed test", ["ssot_kind", "path", "execution.mode", "execution.argv", "execution.cwd", "execution.timeout_seconds", "execution.env_keys"]],
  "governance.claim": ["Assurance claim", ["tier", "ssot_kind", "feature_ids", "depends_on_claim_ids"]],
  "governance.evidence": ["Evidence", ["tier", "ssot_kind", "path", "origin", "claim_ids", "test_ids"]],
  "governance.issue": ["Governed issue", ["severity", "release_blocking", "plan.horizon", "plan.slot", "feature_ids", "risk_ids"]],
  "governance.risk": ["Governed risk", ["severity", "release_blocking", "feature_ids", "issue_ids"]],
  "governance.boundary": ["Frozen boundary", ["frozen", "feature_ids", "profile_ids", "test_ids", "evidence_ids"]],
  "governance.release": ["Governed release", ["version", "boundary_id", "boundary_ids", "claim_ids", "evidence_ids"]],
  "governance.scope": ["Reserved governance scope", []],
};
const at = (model: Record<string, unknown>, path: string) => path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>)[key] : undefined, model);
function shown(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not published by the current collector";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map((item) => shown(item)).join(", ") || "None recorded";
  if (typeof value === "object") return Object.entries(value as Record<string, unknown>).map(([key, item]) => `${humanLabel(key)}: ${shown(item)}`).join(" · ");
  return humanLabel(String(value));
}
const relations = (record: CatalogRecord) => valueRecords(valueRecord(record.entity_graph).relationships);
export const isSsotEntity = (record: CatalogRecord) => String(record.resource_type || "").startsWith("governance.");
export function SsotEntityDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: Navigate }) {
  const type = String(record.resource_type || "governance.scope");
  const [label, fields] = specs[type] || specs["governance.scope"];
  const payload = valueRecord(record.payload);
  const model = { ...payload, ...record, ssot_kind: payload.kind };
  const status = String(model.status || model.implementation_status || "not reported").toLowerCase();
  const relationships = relations(record);
  const integrity = valueRecord(payload.relationship_integrity);
  const referenceCount = Number(integrity.reference_count || 0);
  const resolvedReferences = Number(integrity.resolved_reference_count || 0);
  const unresolvedReferences = Number(integrity.unresolved_reference_count || 0);
  const proof = relationships.filter((item) => ["asserts_claim", "tests", "verifies", "claim_has_evidence", "produces", "covers"].includes(String(item.relationship_type))).length;
  const source = record.source_url || record.registry_url;
  const note = type === "governance.scope" ? "The current SSOT schema does not define scopes; unsupported semantics are not inferred." : type === "governance.test" ? "Execution environment values are never published." : type === "governance.boundary" ? "Frozen means immutable scope, not proof or certification." : type === "governance.release" ? "Certification is an SSOT workflow state, not external compliance certification." : undefined;
  return <>{Boolean(model.release_blocking) && <div role="alert" className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 p-4 text-sm text-red-900"><strong>Release-blocking record.</strong> The observed registry marks this entity as blocking.</div>}{unresolvedReferences > 0 && <div role="status" className="rounded-[var(--radius-md)] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Incomplete relationship graph.</strong> {unresolvedReferences.toLocaleString()} of {referenceCount.toLocaleString()} referenced SSOT records were not present in the source registry. Their identifiers remain listed below; no relationship was inferred.</div>}<DetailSection title="Program state" intro={`Observed ${label.toLowerCase()} status, provenance, scope, and assurance relationships.`}><div className="flex flex-wrap gap-2"><CatalogPill tone="accent" Icon={ShieldCheck}>{label}</CatalogPill><CatalogPill Icon={BadgeCheck}>{humanLabel(status)}</CatalogPill></div><FactPanel items={[{ label: "Entity type", icon: ShieldCheck, value: label }, { label: "Status", icon: BadgeCheck, value: humanLabel(status) }, { label: "Relationships", icon: GitBranch, value: relationships.length.toLocaleString() }, { label: "Observed", icon: BadgeCheck, value: formatDate(record.observed_at) }]} /></DetailSection><DetailSection title="SSOT record" intro={String(model.body || model.statement || model.description || "The current public collector did not publish a narrative for this entity.")}><DetailRows rows={[["Stable SSOT ID", String(model.source_key || model.id)], ["Status", humanLabel(status)], ["Observed", formatDate(record.observed_at)], ["Authoritative source", source ? <a href={String(source)} target="_blank" rel="noreferrer" className="text-accent hover:underline">Open source</a> : "Not published by the current collector"]]} /></DetailSection><DetailSection title="Entity details" intro={note}><DetailRows rows={fields.map((path) => [humanLabel(path.split(".").at(-1) || path), shown(at(model, path))])} /></DetailSection><DetailSection title="Relationship completeness" intro="Only source-backed references become navigable catalog relationships."><MetricBand label="SSOT relationship integrity" items={[{ label: "Referenced", value: referenceCount, icon: GitBranch }, { label: "Resolved", value: resolvedReferences, icon: BadgeCheck }, { label: "Unresolved", value: unresolvedReferences, icon: ShieldCheck }]} />{unresolvedReferences > 0 && <DetailRows rows={valueRecords(integrity.unresolved_references).map((item) => [humanLabel(String(item.field || "reference")), `${String(item.target_kind || "entity")} · ${String(item.target_id || "unknown")}`])} />}</DetailSection><DetailSection title="Assurance coverage" intro="Missing links remain visible and are never inferred."><MetricBand label="Observed assurance links" items={[{ label: "Proof links", value: proof, icon: BadgeCheck }, { label: "All relationships", value: relationships.length, icon: GitBranch }]} /></DetailSection><LinkedResourceSections sections={record.linked_sections} onNavigate={onNavigate} /></>;
}

export default SsotEntityDetail;
