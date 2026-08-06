from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class ResourceTypeDefinition:
    label: str
    family: str
    icon_key: str
    detail_schema_key: str


def _types(
    family: str,
    icon: str,
    definitions: dict[str, str],
) -> dict[str, ResourceTypeDefinition]:
    return {
        key: ResourceTypeDefinition(label, family, icon, key) for key, label in definitions.items()
    }


# Closed v1 vocabulary. Every catalog resource receives exactly one leaf type.
RESOURCE_TYPES: dict[str, ResourceTypeDefinition] = {
    **_types(
        "party",
        "users",
        {
            "party.organization": "Organization",
            "party.person": "Person",
            "party.team": "Team",
        },
    ),
    **_types(
        "offering",
        "box",
        {
            "offering.product": "Product",
            "offering.solution": "Solution",
            "offering.service": "Service",
        },
    ),
    **_types(
        "collection",
        "layers",
        {
            "collection.portfolio": "Portfolio",
            "collection.suite": "Suite",
            "collection.ecosystem": "Ecosystem collection",
            "collection.catalog": "Catalog",
        },
    ),
    **_types(
        "source",
        "folder-git-2",
        {
            "source.repository": "Repository",
            "source.workspace": "Workspace",
            "source.branch": "Branch",
            "source.tag": "Tag",
            "source.commit": "Commit",
        },
    ),
    **_types(
        "distribution",
        "package",
        {
            "distribution.package": "Package",
            "distribution.container_image": "Container image",
            "distribution.binary": "Binary",
            "distribution.archive": "Archive",
            "distribution.bundle": "Distribution bundle",
        },
    ),
    **_types(
        "release",
        "tags",
        {
            "release.package": "Package release",
            "release.container": "Container release",
            "release.repository": "Repository release",
            "release.binary": "Binary release",
            "release.bundle": "Bundle release",
        },
    ),
    **_types(
        "governance",
        "shield-check",
        {
            "governance.registry": "SSOT registry",
            "governance.adr": "ADR",
            "governance.spec": "Specification",
            "governance.feature": "Feature",
            "governance.test": "Test",
            "governance.claim": "Claim",
            "governance.evidence": "Evidence",
            "governance.issue": "Governed issue",
            "governance.boundary": "Boundary",
            "governance.profile": "Profile",
            "governance.risk": "Risk",
            "governance.release": "Governed release",
            "governance.scope": "Governance scope",
        },
    ),
    **_types(
        "documentation",
        "book-open",
        {
            "documentation.site": "Documentation site",
            "documentation.collection": "Documentation collection",
            "documentation.reference": "Reference",
            "documentation.guide": "Guide",
            "documentation.tutorial": "Tutorial",
            "documentation.how_to": "How-to",
            "documentation.quickstart": "Quickstart",
            "documentation.concept": "Concept",
            "documentation.runbook": "Runbook",
            "documentation.faq": "FAQ",
            "documentation.cookbook": "Cookbook",
            "documentation.changelog": "Changelog",
        },
    ),
    **_types(
        "contract",
        "file-json-2",
        {
            "contract.openapi": "OpenAPI contract",
            "contract.asyncapi": "AsyncAPI contract",
            "contract.openrpc": "OpenRPC contract",
            "contract.graphql": "GraphQL schema",
            "contract.protobuf": "Protobuf contract",
            "contract.json_schema": "JSON Schema",
            "contract.data_schema": "Data schema",
            "contract.configuration_schema": "Configuration schema",
            "contract.event_schema": "Event schema",
            "contract.protocol_spec": "Protocol specification",
        },
    ),
    **_types(
        "interface",
        "panels-top-left",
        {
            "interface.website": "Website",
            "interface.web_application": "Web application",
            "interface.desktop_application": "Desktop application",
            "interface.mobile_application": "Mobile application",
            "interface.gui": "GUI",
            "interface.console": "Console",
            "interface.dashboard": "Dashboard",
            "interface.playground": "Playground",
            "interface.api_explorer": "API explorer",
            "interface.developer_portal": "Developer portal",
            "interface.command_line": "Command-line interface",
            "interface.extension": "Extension",
        },
    ),
    **_types(
        "runtime",
        "server-cog",
        {
            "runtime.api": "API",
            "runtime.service": "Service runtime",
            "runtime.endpoint": "Endpoint",
            "runtime.webhook": "Webhook",
            "runtime.gateway": "Gateway",
            "runtime.deployment": "Deployment",
            "runtime.deployment_target": "Deployment target",
            "runtime.environment": "Environment",
            "runtime.worker": "Worker",
            "runtime.scheduled_job": "Scheduled job",
        },
    ),
    **_types(
        "implementation",
        "code-xml",
        {
            "implementation.example": "Example",
            "implementation.demo": "Demo",
            "implementation.showcase": "Showcase",
            "implementation.reference": "Reference implementation",
            "implementation.template": "Template",
            "implementation.sample_application": "Sample application",
            "implementation.notebook": "Notebook",
            "implementation.recipe": "Recipe",
            "implementation.adapter": "Adapter",
            "implementation.plugin": "Plugin",
        },
    ),
    **_types(
        "automation",
        "workflow",
        {
            "automation.github_action": "GitHub Action",
            "automation.workflow": "Workflow",
            "automation.pipeline": "Pipeline",
            "automation.script": "Script",
            "automation.generator": "Generator",
            "automation.collector": "Collector",
        },
    ),
    **_types(
        "artifact",
        "file-check-2",
        {
            "artifact.test_report": "Test report",
            "artifact.coverage_report": "Coverage report",
            "artifact.benchmark_report": "Benchmark report",
            "artifact.audit_report": "Audit report",
            "artifact.security_report": "Security report",
            "artifact.attestation": "Attestation",
            "artifact.provenance_statement": "Provenance statement",
            "artifact.build": "Build artifact",
            "artifact.publication_record": "Publication record",
            "artifact.generated_document": "Generated document",
        },
    ),
    **_types(
        "activity",
        "activity",
        {
            "activity.workflow_run": "Workflow run",
            "activity.build_run": "Build run",
            "activity.test_run": "Test run",
            "activity.deployment_run": "Deployment run",
            "activity.publication_run": "Publication run",
        },
    ),
    **_types(
        "content",
        "newspaper",
        {
            "content.insight": "Insight",
            "content.article": "Article",
            "content.case_study": "Case study",
            "content.report": "Report",
            "content.whitepaper": "Whitepaper",
            "content.presentation": "Presentation",
            "content.video": "Video",
            "content.podcast": "Podcast",
        },
    ),
    **_types(
        "data",
        "database",
        {
            "data.dataset": "Dataset",
            "data.model": "Data model",
            "data.vocabulary": "Vocabulary",
            "data.mapping": "Data mapping",
            "data.fixture": "Data fixture",
            "data.benchmark_corpus": "Benchmark corpus",
        },
    ),
    **_types(
        "legal",
        "scale",
        {
            "legal.license": "License",
            "legal.notice": "Notice",
            "legal.attribution": "Attribution",
            "legal.policy": "Policy",
            "legal.terms": "Terms",
            "legal.security_policy": "Security policy",
            "legal.contributor_agreement": "Contributor agreement",
        },
    ),
    **_types(
        "asset",
        "image",
        {
            "asset.logo": "Logo",
            "asset.icon": "Icon",
            "asset.image": "Image",
            "asset.screenshot": "Screenshot",
            "asset.diagram": "Diagram",
            "asset.video": "Video asset",
            "asset.audio": "Audio asset",
            "asset.font": "Font",
            "asset.document": "Document asset",
            "asset.archive": "Asset archive",
        },
    ),
    **_types(
        "work",
        "circle-dot",
        {
            "work.issue": "Issue",
            "work.pull_request": "Pull request",
            "work.discussion": "Discussion",
            "work.project": "Project",
            "work.milestone": "Milestone",
        },
    ),
    **_types(
        "taxonomy",
        "tags",
        {
            "taxonomy.technology": "Technology",
            "taxonomy.language": "Language",
            "taxonomy.ecosystem": "Ecosystem",
            "taxonomy.audience": "Audience",
            "taxonomy.capability": "Capability",
            "taxonomy.domain": "Domain",
            "taxonomy.topic": "Topic",
            "taxonomy.category": "Category",
        },
    ),
}


RECORD_RESOURCE_TYPES = {
    "product": "offering.product",
    "portfolio": "collection.portfolio",
    "solution": "offering.solution",
    "service": "offering.service",
    "insight": "content.insight",
}

LEGACY_RESOURCE_TYPES = {
    "website": "interface.website",
    "documentation": "documentation.collection",
    "api": "runtime.api",
    "demo": "implementation.demo",
    "example": "implementation.example",
    "showcase": "implementation.showcase",
    "ui": "interface.gui",
}

SSOT_RESOURCE_TYPES = {
    "adrs": "governance.adr",
    "specs": "governance.spec",
    "features": "governance.feature",
    "tests": "governance.test",
    "claims": "governance.claim",
    "evidence": "governance.evidence",
    "issues": "governance.issue",
    "boundaries": "governance.boundary",
    "profiles": "governance.profile",
    "risks": "governance.risk",
    "releases": "governance.release",
    "scopes": "governance.scope",
}


def api_contract_type(path: str | None) -> str:
    value = (path or "").lower()
    if "asyncapi" in value:
        return "contract.asyncapi"
    if "openrpc" in value:
        return "contract.openrpc"
    if value.endswith(".proto"):
        return "contract.protobuf"
    return "contract.openapi"


def normalize_legacy_resource_type(resource_type: str, path: str | None = None) -> str | None:
    if resource_type == "api_definition":
        return api_contract_type(path)
    # Source directories and component files are implementation observations,
    # not independently addressable public catalog resources.
    if resource_type in {"api_source", "ui"}:
        return None
    return LEGACY_RESOURCE_TYPES.get(
        resource_type, resource_type if resource_type in RESOURCE_TYPES else None
    )


RELATIONSHIP_TYPES = frozenset(
    {
        "owned_by",
        "maintained_by",
        "authored_by",
        "contributed_by",
        "published_by",
        "operated_by",
        "contains",
        "groups",
        "bundles",
        "includes",
        "has_component",
        "has_entrypoint",
        "implements",
        "implemented_by",
        "source_for",
        "distributed_as",
        "built_from",
        "generated_from",
        "provides",
        "extends",
        "wraps",
        "adapts",
        "compatible_with",
        "depends_on",
        "uses",
        "uses_package",
        "calls",
        "consumes",
        "produces",
        "integrates_with",
        "imports",
        "exports",
        "release_of",
        "published_from",
        "contains_artifact",
        "tags_revision",
        "publishes",
        "installs",
        "promotes",
        "supersedes",
        "governed_by",
        "declares",
        "decides",
        "specifies",
        "defines",
        "constrains",
        "applies_to",
        "implements_spec",
        "asserts_claim",
        "claim_has_evidence",
        "references_artifact",
        "verifies",
        "tests",
        "covers",
        "addresses",
        "mitigates",
        "profiles",
        "conforms_to",
        "satisfies",
        "violates",
        "boundary_for",
        "documents",
        "explains",
        "reference_for",
        "tutorial_for",
        "how_to_for",
        "quickstart_for",
        "runbook_for",
        "troubleshoots",
        "prerequisite_for",
        "next_step_for",
        "demonstrates",
        "showcases",
        "example_of",
        "reference_implementation_of",
        "template_for",
        "recipe_for",
        "launches",
        "exposes",
        "described_by",
        "implements_contract",
        "renders",
        "serves",
        "accepts",
        "returns",
        "emits",
        "subscribes_to",
        "proxies",
        "routes_to",
        "deployment_of",
        "deployed_to",
        "hosts",
        "served_at",
        "backed_by",
        "runs",
        "monitors",
        "health_checks",
        "configured_by",
        "produced_by",
        "derived_from",
        "attests_to",
        "reports_on",
        "measures",
        "validates",
        "references",
        "licensed_under",
        "has_notice",
        "has_attribution",
        "subject_to_policy",
        "subject_to_terms",
        "inherits_license_from",
        "uses_technology",
        "written_in",
        "targets_ecosystem",
        "for_audience",
        "has_capability",
        "in_domain",
        "has_topic",
        "categorized_as",
        "tracks",
        "proposes_change_to",
        "resolves",
        "closes",
        "merged_into",
        "discusses",
        "forked_from",
        "mirrors",
        "replaces",
        "same_as",
        "alias_of",
    }
)
