from __future__ import annotations


import argparse
import concurrent.futures
import dataclasses
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
import time
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Iterable

from .collector_common import *  # noqa: F403
from .resource_discovery import normalize_license_expression

def manifest_package(path: str, text: str, repo: dict[str, Any]) -> tuple[dict[str, Any] | None, list[dict[str, str]]]:
    dependencies: list[dict[str, str]] = []
    package: dict[str, Any] | None = None
    try:
        if path.endswith("package.json"):
            data = json.loads(text)
            for group in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
                for name, requirement in (data.get(group) or {}).items():
                    dependencies.append({"name": name, "requirement": str(requirement), "scope": group})
            for name in data.get("bundledDependencies") or data.get("bundleDependencies") or []:
                dependencies.append({"name": str(name), "requirement": "bundled", "scope": "bundledDependencies"})
            if data.get("name"):
                package = {"ecosystem": "npm", "name": data["name"], "version_declared": data.get("version"), "private": bool(data.get("private", False)), "license_expression": normalize_license_expression(data.get("license"))}
        elif path.endswith("pyproject.toml"):
            data = tomllib.loads(text)
            project = data.get("project", {})
            poetry = data.get("tool", {}).get("poetry", {})
            name = project.get("name") or poetry.get("name")
            raw_dependencies = project.get("dependencies", [])
            for value in raw_dependencies:
                match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                if match:
                    dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": "dependencies"})
            for group, values in (project.get("optional-dependencies") or {}).items():
                for value in values:
                    match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                    if match:
                        dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": f"optional-dependencies.{group}"})
            for value in (data.get("build-system", {}).get("requires") or []):
                match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                if match:
                    dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": "build-system.requires"})
            for group, values in (data.get("dependency-groups") or {}).items():
                for value in values:
                    if not isinstance(value, str):
                        continue
                    match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", value)
                    if match:
                        dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": f"dependency-groups.{group}"})
            for dep_name, requirement in (poetry.get("dependencies") or {}).items():
                if dep_name.lower() != "python":
                    dependencies.append({"name": dep_name, "requirement": str(requirement), "scope": "dependencies"})
            for group, group_data in (poetry.get("group") or {}).items():
                for dep_name, requirement in (group_data.get("dependencies") or {}).items():
                    dependencies.append({"name": dep_name, "requirement": str(requirement), "scope": f"tool.poetry.group.{group}.dependencies"})
            for value in (data.get("tool", {}).get("uv", {}).get("dev-dependencies") or []):
                match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                if match:
                    dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": "tool.uv.dev-dependencies"})
            if name:
                project_license = project.get("license")
                license_file = project_license.get("file") if isinstance(project_license, dict) else None
                package = {"ecosystem": "pypi", "name": name, "version_declared": project.get("version") or poetry.get("version"), "private": False, "license_expression": normalize_license_expression(project.get("license-expression") or project_license or poetry.get("license")), "license_file": license_file}
        elif path.endswith("Cargo.toml"):
            data = tomllib.loads(text)
            cargo_package = data.get("package", {})
            def collect_cargo_dependencies(value: Any, prefix: str = "") -> None:
                if not isinstance(value, dict):
                    return
                for key, nested in value.items():
                    scope = f"{prefix}.{key}".strip(".")
                    if key in {"dependencies", "dev-dependencies", "build-dependencies"} and isinstance(nested, dict):
                        for name, requirement in nested.items():
                            encoded_requirement = (
                                json.dumps(requirement, sort_keys=True, separators=(",", ":"))
                                if isinstance(requirement, dict)
                                else str(requirement)
                            )
                            dependencies.append({"name": name, "requirement": encoded_requirement, "scope": scope})
                    elif key in {"workspace", "target"} and isinstance(nested, dict):
                        collect_cargo_dependencies(nested, scope)
            collect_cargo_dependencies(data)
            if cargo_package.get("name"):
                package = {"ecosystem": "crates", "name": cargo_package["name"], "version_declared": cargo_package.get("version"), "private": bool(cargo_package.get("publish") is False), "license_expression": normalize_license_expression(cargo_package.get("license")), "license_file": cargo_package.get("license-file")}
    except (json.JSONDecodeError, tomllib.TOMLDecodeError, TypeError):
        return None, dependencies
    if package:
        package.update({"repository": repo["full_name"], "manifest_path": path, "dependencies": dependencies})
    return package, dependencies


def raw_url(repo: dict[str, Any], path: str) -> str:
    owner, name = repo["full_name"].split("/", 1)
    return f"https://raw.githubusercontent.com/{owner}/{name}/{repo['default_branch']}/{urllib.parse.quote(path)}"


def registry_record(client: ApiClient, package: dict[str, Any]) -> tuple[dict[str, Any], list[Observation]]:
    ecosystem = package["ecosystem"]
    name = package["name"]
    observations: list[Observation] = []
    record = {key: value for key, value in package.items() if key != "dependencies"}
    record["published"] = None
    record["releases"] = []
    if package.get("private"):
        record["published"] = False
        record["publication_status"] = "manifest_private"
        return record, observations
    if ecosystem == "pypi":
        url = f"https://pypi.org/pypi/{urllib.parse.quote(name)}/json"
        body, _, obs = client.request_json(url, allow_404=True)
        observations.append(obs)
        if body:
            info = body.get("info", {})
            record.update({"published": True, "registry_url": f"https://pypi.org/project/{name}/", "latest_version": info.get("version"), "registry_license_expression": normalize_license_expression(info.get("license_expression") or info.get("license")), "license_classifiers": [item for item in info.get("classifiers", []) if str(item).startswith("License ::")]})
            record["releases"] = [
                {
                    "version": version,
                    "published_at": next(
                        (
                            file.get("upload_time_iso_8601") or file.get("upload_time")
                            for file in files
                            if file.get("upload_time_iso_8601") or file.get("upload_time")
                        ),
                        None,
                    ),
                    "url": f"https://pypi.org/project/{name}/{version}/",
                }
                for version, files in sorted((body.get("releases") or {}).items(), reverse=True)
            ]
        elif obs.status == "not_found":
            record.update({"published": False, "publication_status": "registry_not_found"})
    elif ecosystem == "npm":
        encoded = urllib.parse.quote(name, safe="")
        url = f"https://registry.npmjs.org/{encoded}"
        body, _, obs = client.request_json(url, allow_404=True)
        observations.append(obs)
        if body:
            latest_version = (body.get("dist-tags") or {}).get("latest")
            latest_metadata = (body.get("versions") or {}).get(latest_version, {})
            record.update({"published": True, "registry_url": f"https://www.npmjs.com/package/{name}", "latest_version": latest_version, "registry_license_expression": normalize_license_expression(latest_metadata.get("license") or body.get("license"))})
            published_times = body.get("time") or {}
            record["releases"] = [
                {
                    "version": version,
                    "published_at": published_times.get(version),
                    "url": f"https://www.npmjs.com/package/{name}/v/{version}",
                }
                for version in sorted((body.get("versions") or {}).keys(), reverse=True)
            ]
        elif obs.status == "not_found":
            record.update({"published": False, "publication_status": "registry_not_found"})
    elif ecosystem == "crates":
        url = f"https://crates.io/api/v1/crates/{urllib.parse.quote(name)}"
        body, _, obs = client.request_json(url, allow_404=True)
        observations.append(obs)
        if body:
            crate = body.get("crate", {})
            newest_version = crate.get("newest_version")
            newest_metadata = next((item for item in body.get("versions", []) if item.get("num") == newest_version), {})
            record.update({"published": True, "registry_url": f"https://crates.io/crates/{name}", "latest_version": newest_version, "downloads": crate.get("downloads"), "registry_license_expression": normalize_license_expression(newest_metadata.get("license"))})
            record["releases"] = [
                {
                    "version": version.get("num"),
                    "published_at": version.get("created_at") or version.get("updated_at"),
                    "downloads": version.get("downloads"),
                    "url": f"https://crates.io/crates/{name}/{version.get('num')}",
                }
                for version in body.get("versions", [])
                if version.get("num")
            ]
            reverse_url = f"https://crates.io/api/v1/crates/{urllib.parse.quote(name)}/reverse_dependencies?page=1&per_page=100"
            reverse, _, reverse_obs = client.request_json(reverse_url, allow_404=True)
            observations.append(reverse_obs)
            record["downstream"] = [item.get("crate_id") for item in (reverse or {}).get("versions", []) if item.get("crate_id")]
            record["downstream_completeness"] = "first_100_registry_reverse_dependencies"
        elif obs.status == "not_found":
            record.update({"published": False, "publication_status": "registry_not_found"})
    return record, observations
