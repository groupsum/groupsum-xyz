from __future__ import annotations

from pathlib import Path

from groupsum_catalog_api import entrypoint


def test_main_imports_catalog_before_starting_tigrcorn(monkeypatch) -> None:
    events: list[tuple[str, object]] = []
    server_config = object()

    async def fake_import_catalog(repo_root):
        events.append(("import", repo_root))

    def fake_build_config(**kwargs):
        events.append(("config", kwargs))
        return server_config

    def fake_run(app, *, config):
        events.append(("run", (app, config)))

    monkeypatch.setattr(entrypoint, "import_catalog", fake_import_catalog)
    monkeypatch.setattr(entrypoint, "build_config", fake_build_config)
    monkeypatch.setattr(entrypoint, "run", fake_run)

    entrypoint.main()

    assert [event[0] for event in events] == ["import", "config", "run"]
    assert events[0][1] == Path("/app")
    assert events[1][1] == {
        "host": "0.0.0.0",
        "port": 8000,
        "config": {
            "proxy": {
                "proxy_headers": True,
                "forwarded_allow_ips": ["*"],
            }
        },
    }
    assert events[2][1] == (entrypoint.app, server_config)
