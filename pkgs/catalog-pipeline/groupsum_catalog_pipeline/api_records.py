from __future__ import annotations

import hashlib
import json
from typing import Any

from .snapshots import normalized_measurements, normalized_observations, snapshot_descriptor


def _canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def _stable_id(namespace: str, *parts: object) -> str:
    material = "\x1f".join(str(part) for part in parts)
    return f"{namespace}:{hashlib.sha256(material.encode()).hexdigest()[:20]}"


def _presence_observation(
    snapshot_id: str,
    observed_at: str,
    subject_type: str,
    subject_id: str,
    payload: dict[str, Any],
    observation_type: str,
) -> dict[str, Any]:
    content_hash = hashlib.sha256(_canonical(payload).encode()).hexdigest()
    return {
        "id": _stable_id("observation", snapshot_id, observation_type, subject_type, subject_id),
        "snapshot_id": snapshot_id,
        "subject_type": subject_type,
        "subject_id": subject_id,
        "observation_type": observation_type,
        "source_kind": "groupsum-catalog",
        "source_url": None,
        "status": "observed",
        "observed_at": observed_at,
        "payload": payload,
        "content_hash": content_hash,
        "confidence": "observed",
    }


def publication_facts(
    catalog: dict[str, Any],
    entity_records: dict[str, list[dict[str, Any]]],
    associations: list[dict[str, Any]],
) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]]]:
    descriptor = snapshot_descriptor(catalog)
    snapshot_id = str(descriptor["snapshot_id"])
    observed_at = str(descriptor["collected_at"])
    observations = [
        {"id": row.pop("observation_id"), **row}
        for source in normalized_observations(catalog, snapshot_id)
        for row in [dict(source)]
    ]
    for entity_type, rows in entity_records.items():
        observations.extend(
            _presence_observation(
                snapshot_id,
                observed_at,
                entity_type,
                str(row["id"]),
                {"entity_type": entity_type, "entity_id": str(row["id"])},
                "entity_presence",
            )
            for row in rows
        )
    observations.extend(
        _presence_observation(
            snapshot_id,
            observed_at,
            "association",
            str(row["id"]),
            {"association_id": str(row["id"])},
            "association_presence",
        )
        for row in associations
    )
    observations = list({row["id"]: row for row in observations}.values())
    measurements = [
        {"text_value": None, "source_observation_id": None, **row}
        for row in normalized_measurements(catalog, snapshot_id)
    ]
    descriptor.update(
        observation_count=len(observations),
        measurement_count=len(measurements),
        error_count=sum(row.get("status") == "error" for row in observations),
    )
    return descriptor, observations, measurements


def publish_catalog(
    client: Any,
    descriptor: dict[str, Any],
    entity_records: dict[str, list[dict[str, Any]]],
    associations: list[dict[str, Any]],
    observations: list[dict[str, Any]],
    measurements: list[dict[str, Any]],
) -> dict[str, Any]:
    """Create every record first and invoke the snapshot finalizer exactly last."""

    snapshot_id = str(descriptor["snapshot_id"])
    results: dict[str, Any] = {
        "entities": client.publish_entities(snapshot_id, entity_records),
        "associations": client.publish_records(
            "/internal/v1/catalog/associations", snapshot_id, associations
        ),
        "observations": client.publish_records(
            "/internal/v1/catalog/observations", snapshot_id, observations
        ),
        "metrics": client.publish_records(
            "/internal/v1/catalog/metrics", snapshot_id, measurements
        ),
    }
    results["snapshot"] = client.create_snapshot(descriptor)
    return results


__all__ = ["publication_facts", "publish_catalog"]
