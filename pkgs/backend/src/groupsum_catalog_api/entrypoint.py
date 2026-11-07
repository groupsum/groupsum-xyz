from __future__ import annotations

from tigrcorn import run
from tigrcorn.config import build_config

from .app import app


def main() -> None:
    config = build_config(
        host="0.0.0.0",
        port=8000,
        config={
            # Compress once at Nginx. Avoid encoding-dependent, time-varying server ETags.
            "http": {"content_coding_policy": "identity-only"},
            "proxy": {
                "proxy_headers": True,
                "forwarded_allow_ips": ["*"],
            }
        },
    )
    run(app, config=config)


if __name__ == "__main__":
    main()
