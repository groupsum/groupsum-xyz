from .attribution import LegalAttribution
from .contributor_agreement import LegalContributorAgreement
from .license import LegalLicense
from .notice import LegalNotice
from .policy import LegalPolicy
from .security_policy import LegalSecurityPolicy
from .terms import LegalTerms

RESOURCE_TABLES = {
    "legal.attribution": LegalAttribution,
    "legal.contributor_agreement": LegalContributorAgreement,
    "legal.license": LegalLicense,
    "legal.notice": LegalNotice,
    "legal.policy": LegalPolicy,
    "legal.security_policy": LegalSecurityPolicy,
    "legal.terms": LegalTerms,
}

__all__ = ["RESOURCE_TABLES"]
