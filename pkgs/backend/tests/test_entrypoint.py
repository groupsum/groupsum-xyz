from __future__ import annotations

from groupsum_catalog_api import entrypoint


def test_main_starts_tigrcorn_without_importing_catalog(monkeypatch) -> None:
    events: list[tuple[str, object]] = []
    server_config = object()

    def fake_build_config(**kwargs):
        events.append(("config", kwargs))
        return server_config

    def fake_run(app, *, config):
        events.append(("run", (app, config)))

    monkeypatch.setattr(entrypoint, "build_config", fake_build_config)
    monkeypatch.setattr(entrypoint, "run", fake_run)

    entrypoint.main()

    assert [event[0] for event in events] == ["config", "run"]
    assert events[0][1] == {
        "host": "0.0.0.0",
        "port": 8000,
        "config": {
            "proxy": {
                "proxy_headers": True,
                "forwarded_allow_ips": ["*"],
            }
        },
    }
    assert events[1][1] == (entrypoint.app, server_config)
