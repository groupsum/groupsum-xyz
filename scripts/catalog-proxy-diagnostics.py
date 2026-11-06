"""Read-only, Groupsum-scoped proxy evidence; never print environment or payloads."""
from __future__ import annotations

import json
import re
import subprocess


def command(*args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=60)
    return result.returncode, result.stdout + result.stderr


def summarize(label, text):
    lines = text.splitlines()
    relevant = [line.strip() for line in lines if re.search(
        r"client_max_body_size|server_name.*groupsum\.xyz|location.*/internal|proxy_pass.*groupsum", line
    )]
    print(json.dumps({"source": label, "directives": relevant[:30]}))
    for line in lines:
        if "too large body" in line and ("groupsum.xyz" in line or "/internal/v1/catalog/" in line):
            size = re.search(r"too large body:\s*(\d+)", line)
            path = re.search(r'(?:POST|PUT)\s+(/internal/v1/catalog/[^\s?\"]+)', line)
            print(json.dumps({"source": label, "rejected_body_bytes": int(size[1]) if size else None,
                              "path": path[1] if path else None}))


EDGE_FILES = r'''
import os
from pathlib import Path
root=Path(os.getenv("PORTWYRM_NGINX_ROOT", str(Path(os.getenv("PORTWYRM_DATA_ROOT", "/data"))/"nginx")))
active=root/"current"
print("active_runtime_exists="+str(active.exists()))
if active.exists():
    for item in active.rglob("*.conf"):
        text=item.read_text()
        if "groupsum.xyz" in text:
            print("CONFIG "+str(item))
            for line in text.splitlines():
                if any(key in line for key in ("server_name", "client_max_body_size", "location", "proxy_pass")):
                    print(line)
    for name in ("nginx.conf", "custom/http.conf", "custom/http_top.conf", "custom/server_proxy.conf"):
        path=active/name
        if path.exists():
            for line in path.read_text().splitlines():
                if "client_max_body_size" in line: print(line)
for path in (Path("/data/logs/proxy-host-4_error.log"),):
    if path.exists():
        for line in path.read_text()[-2000000:].splitlines():
            if "too large body" in line and "groupsum.xyz" in line: print(line)
'''


def main():
    code, names = command("docker", "ps", "--format", "{{.Names}}")
    if code:
        raise SystemExit("Docker inventory unavailable")
    containers = [name for name in names.splitlines() if "portwyrm" in name or name == "groupsum-xyz"]
    for name in containers:
        _, config = command("docker", "exec", name, "nginx", "-T")
        summarize(f"{name}:nginx-T", config)
        _, logs = command("docker", "logs", "--since", "72h", "--tail", "2000", name)
        summarize(f"{name}:logs", logs)
        if name == "portwyrm-portwyrm-1":
            _, files = command("docker", "exec", name, "python", "-c", EDGE_FILES)
            summarize(f"{name}:active-generation", files)
    if "groupsum-xyz" not in containers:
        raise SystemExit("Groupsum application container is not running")


if __name__ == "__main__":
    main()
