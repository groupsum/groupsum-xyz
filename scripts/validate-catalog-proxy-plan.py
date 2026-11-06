"""Fail closed: this repair can update only Groupsum's catalog location."""
import json
import sys
from pathlib import Path

def require(condition, message):
    if not condition:
        raise SystemExit(message)


plan = json.loads(Path(sys.argv[1]).read_text())["spec"]
require(not plan.get("conflicts") and not plan.get("dns", {}).get("operations"), "Proxy repair cannot include conflicts or DNS changes")
for operation in plan["operations"]:
    if operation["action"] == "noop":
        continue
    require(operation["action"] == "update" and operation["kind"] == "proxy_host", "Only proxy updates are allowed")
    require(operation["existing"]["identity"] == {"owner": "groupsum-xyz", "resource_id": "proxy.groupsum-xyz"}, "Proxy ownership mismatch")
    require(set(operation["diff"]) <= {"locations"}, "Unrelated proxy fields would change")
    previous_locations = operation["existing"].get("raw", {}).get("locations") or []
    require(len(previous_locations) <= 1 and all(item.get("path") == "/internal/v1/catalog/" for item in previous_locations), "Repair must not remove unrelated existing locations")
    require(operation["desired"]["locations"] == [{
        "path": "/internal/v1/catalog/", "forward_scheme": "http",
        "forward_host": "groupsum-xyz", "forward_port": 80,
        "advanced_config": "client_max_body_size 32m;",
    }], "Unexpected catalog location configuration")
print("Validated: only the owned Groupsum catalog publishing location may change")
