#!/usr/bin/env python3
"""Render display-safe catalog derivatives from a normalized snapshot."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from catalog_collect import summarize, typescript_summary

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=ROOT / "catalog" / "generated" / "catalog.json")
    parser.add_argument("--summary", type=Path, default=ROOT / "catalog" / "generated" / "summary.json")
    parser.add_argument("--typescript", type=Path, default=ROOT / "src" / "data" / "catalog.generated.ts")
    args = parser.parse_args()
    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    summary = summarize(catalog)
    args.summary.parent.mkdir(parents=True, exist_ok=True)
    args.typescript.parent.mkdir(parents=True, exist_ok=True)
    args.summary.write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    args.typescript.write_text(typescript_summary(summary), encoding="utf-8")
    print(json.dumps(summary, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
