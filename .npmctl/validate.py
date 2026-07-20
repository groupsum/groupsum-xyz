from __future__ import annotations

from pathlib import Path
import sys
import yaml

ROOT = Path(__file__).resolve().parent
repo = yaml.safe_load((ROOT / "repository.yaml").read_text(encoding="utf-8"))
owner = repo["spec"]["owner"]
errors: list[str] = []

def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)

require(repo.get("apiVersion") == "npmctl.com/v1", "repository apiVersion must be npmctl.com/v1")
require(repo.get("kind") == "NpmctlRepository", "repository kind must be NpmctlRepository")
require(repo.get("schemaVersion") == 1, "repository schemaVersion must be 1")

for environment in ("development", "production"):
    plan_path = ROOT / "plans" / f"{owner}-{environment}.yaml"
    plan = yaml.safe_load(plan_path.read_text(encoding="utf-8"))
    require(plan.get("kind") == "NpmctlPlan", f"{plan_path}: kind must be NpmctlPlan")
    require(plan.get("schemaVersion") == 1, f"{plan_path}: schemaVersion must be 1")
    require(plan.get("metadata", {}).get("owner") == owner, f"{plan_path}: owner mismatch")
    require(plan.get("metadata", {}).get("environment") == environment, f"{plan_path}: environment mismatch")
    for key in ("baseline", "desiredState", "resources", "operations", "workflow", "approvals", "verification", "recovery", "unresolved"):
        require(key in plan, f"{plan_path}: missing {key}")

for migration_path in sorted((ROOT / "migrations").glob("*.yaml")):
    migration = yaml.safe_load(migration_path.read_text(encoding="utf-8"))
    require(migration.get("kind") == "NpmctlMigration", f"{migration_path}: kind must be NpmctlMigration")
    require(migration.get("schemaVersion") == 1, f"{migration_path}: schemaVersion must be 1")
    require(migration.get("metadata", {}).get("owner") == owner, f"{migration_path}: owner mismatch")

for environment in ("development", "production"):
    state_dir = ROOT / "desired-state" / environment
    for state_path in (state_dir / "dns.yaml", state_dir / "proxy.yaml"):
        state = yaml.safe_load(state_path.read_text(encoding="utf-8"))
        require(state.get("apiVersion") == "npmctl.com/v1", f"{state_path}: invalid apiVersion")
        require(state.get("schemaVersion") == 2, f"{state_path}: schemaVersion must be 2")
        if state_path.name == "dns.yaml":
            require(not any(key in state for key in ("proxy_hosts", "certificates")), f"{state_path}: proxy resources belong in proxy.yaml")
        else:
            require("dns_records" not in state, f"{state_path}: DNS resources belong in dns.yaml")
        for collection in ("dns_records", "certificates", "proxy_hosts"):
            for resource in state.get(collection, []) or []:
                meta = resource.get("meta", {})
                require(meta.get("managed_by") == "npmctl", f"{state_path}: {collection} resource is not managed by npmctl")
                require(meta.get("owner") == owner, f"{state_path}: {collection} owner mismatch")
                require(bool(meta.get("resource_id")), f"{state_path}: {collection} resource_id missing")

if errors:
    print("\n".join(f"ERROR: {error}" for error in errors), file=sys.stderr)
    raise SystemExit(1)
print(f"npmctl layout valid for {repo['metadata']['repository']}")
