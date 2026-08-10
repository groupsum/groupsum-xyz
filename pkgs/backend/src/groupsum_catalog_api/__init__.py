"""Groupsum catalog API."""

from typing import Any

__all__ = ["app", "build_app"]


def __getattr__(name: str) -> Any:
    if name in __all__:
        from .app import app, build_app

        return {"app": app, "build_app": build_app}[name]
    raise AttributeError(name)
