from __future__ import annotations

from collections.abc import Iterable, Mapping
from typing import Any
from urllib.parse import unquote


def decode_path_parameters(
    params: Mapping[str, Any], expected_parts: Iterable[str]
) -> dict[str, Any]:
    path_names = {
        part[1:-1]
        for part in expected_parts
        if part.startswith("{") and part.endswith("}")
    }
    return {
        key: unquote(str(value)) if key in path_names else value
        for key, value in params.items()
    }


__all__ = ["decode_path_parameters"]
