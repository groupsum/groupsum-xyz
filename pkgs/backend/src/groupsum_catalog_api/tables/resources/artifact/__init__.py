from .attestation import ArtifactAttestation
from .audit_report import ArtifactAuditReport
from .benchmark_report import ArtifactBenchmarkReport
from .build import ArtifactBuild
from .coverage_report import ArtifactCoverageReport
from .generated_document import ArtifactGeneratedDocument
from .provenance_statement import ArtifactProvenanceStatement
from .publication_record import ArtifactPublicationRecord
from .security_report import ArtifactSecurityReport
from .test_report import ArtifactTestReport

RESOURCE_TABLES = {
    "artifact.attestation": ArtifactAttestation,
    "artifact.audit_report": ArtifactAuditReport,
    "artifact.benchmark_report": ArtifactBenchmarkReport,
    "artifact.build": ArtifactBuild,
    "artifact.coverage_report": ArtifactCoverageReport,
    "artifact.generated_document": ArtifactGeneratedDocument,
    "artifact.provenance_statement": ArtifactProvenanceStatement,
    "artifact.publication_record": ArtifactPublicationRecord,
    "artifact.security_report": ArtifactSecurityReport,
    "artifact.test_report": ArtifactTestReport,
}

__all__ = ["RESOURCE_TABLES"]
