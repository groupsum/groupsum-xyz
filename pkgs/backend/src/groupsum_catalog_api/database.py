from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path
from typing import Any

import psycopg

sqlite3.register_converter("JSON", lambda value: json.loads(value.decode("utf-8")))


class Row(dict[str, Any]):
    """Mapping row that retains the legacy integer-index access used by import checks."""

    def __getitem__(self, key: str | int) -> Any:
        if isinstance(key, int):
            return tuple(self.values())[key]
        return super().__getitem__(key)


class Cursor:
    def __init__(self, cursor: Any) -> None:
        self.cursor = cursor

    def _row(self, value: Any) -> Row | None:
        if value is None:
            return None
        if isinstance(value, dict):
            return Row(value)
        names = [column[0] for column in self.cursor.description or ()]
        return Row(zip(names, value, strict=True))

    def fetchone(self) -> Row | None:
        return self._row(self.cursor.fetchone())

    def fetchall(self) -> list[Row]:
        return [self._row(row) for row in self.cursor.fetchall() if row is not None]

    def __iter__(self):
        for row in self.cursor:
            converted = self._row(row)
            if converted is not None:
                yield converted


class Connection:
    def __init__(self, raw: Any, *, postgres: bool, database: str | Path) -> None:
        self.raw = raw
        self.postgres = postgres
        self.database = database

    def execute(self, query: str, parameters: tuple[Any, ...] | list[Any] = ()) -> Cursor:
        if self.postgres:
            query = query.replace(" COLLATE NOCASE", "")
            query = re.sub(r"\?", "%s", query)
        return Cursor(self.raw.execute(query, parameters))

    def commit(self) -> None:
        self.raw.commit()

    def rollback(self) -> None:
        self.raw.rollback()

    def close(self) -> None:
        self.raw.close()

    def __enter__(self) -> Connection:
        return self

    def __exit__(self, exc_type: Any, exc: Any, traceback: Any) -> None:
        if exc_type is None:
            self.commit()
        else:
            self.rollback()
        self.close()


def sqlite_path(database: str | Path) -> Path | None:
    if isinstance(database, Path):
        return database
    if database.startswith("sqlite:///"):
        return Path(database.removeprefix("sqlite:///"))
    return None


def connect(database: str | Path) -> Connection:
    path = sqlite_path(database)
    if path is not None:
        path.parent.mkdir(parents=True, exist_ok=True)
        raw = sqlite3.connect(path, detect_types=sqlite3.PARSE_DECLTYPES)
        raw.execute("PRAGMA foreign_keys=ON")
        return Connection(raw, postgres=False, database=path)
    raw = psycopg.connect(str(database).replace("postgresql+psycopg://", "postgresql://"))
    return Connection(raw, postgres=True, database=database)
