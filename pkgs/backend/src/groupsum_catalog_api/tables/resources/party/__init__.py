from .person import PartyPerson
from .team import PartyTeam

RESOURCE_TABLES = {
    "party.person": PartyPerson,
    "party.team": PartyTeam,
}

__all__ = ["RESOURCE_TABLES"]
