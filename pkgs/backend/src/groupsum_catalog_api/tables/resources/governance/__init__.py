from .adr import GovernanceAdr
from .boundary import GovernanceBoundary
from .claim import GovernanceClaim
from .evidence import GovernanceEvidence
from .feature import GovernanceFeature
from .issue import GovernanceIssue
from .profile import GovernanceProfile
from .release import GovernanceRelease
from .risk import GovernanceRisk
from .scope import GovernanceScope
from .spec import GovernanceSpec
from .test import GovernanceTest

RESOURCE_TABLES = {
    "governance.adr": GovernanceAdr,
    "governance.boundary": GovernanceBoundary,
    "governance.claim": GovernanceClaim,
    "governance.evidence": GovernanceEvidence,
    "governance.feature": GovernanceFeature,
    "governance.issue": GovernanceIssue,
    "governance.profile": GovernanceProfile,
    "governance.release": GovernanceRelease,
    "governance.risk": GovernanceRisk,
    "governance.scope": GovernanceScope,
    "governance.spec": GovernanceSpec,
    "governance.test": GovernanceTest,
}

__all__ = ["RESOURCE_TABLES"]
