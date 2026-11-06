"""Fail closed: this repair can update only Groupsum's catalog location."""
import json
import sys
from pathlib import Path

plan = json.loads(Path(sys.argv[1]).read_text())["spec"]
assert not plan.get("conflicts") and not plan.get("dns", {}).get("operations")
for operation in plan["operations"]:
    if operation["action"] == "noop":
        continue
    assert operation["action"] == "update" and operation["kind"] == "proxy_host", operation
    assert operation["existing"]["identity"] == {"owner": "groupsum-xyz", "resource_id": "proxy.groupsum-xyz"}
    assert set(operation["diff"]) <= {"locations"}, operation["diff"]
    assert operation["desired"]["locations"] == [{
        "path": "/internal/v1/catalog/", "forward_scheme": "http",
        "forward_host": "groupsum-xyz", "forward_port": 80,
        "advanced_config": "client_max_body_size 32m;",
    }]
print("Validated: only the owned Groupsum catalog publishing location may change")
