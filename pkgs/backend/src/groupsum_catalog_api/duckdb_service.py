from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from .analytics import connect_analytics
from .config import Settings


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802
        if self.path not in {"/healthz", "/summary"}:
            self.send_error(404)
            return
        settings = Settings.from_environment()
        try:
            with connect_analytics(settings.analytics_path, read_only=True) as connection:
                observations = connection.execute(
                    "SELECT COUNT(*) FROM metric_observations"
                ).fetchone()[0]
                aggregates = connection.execute(
                    "SELECT COUNT(*) FROM record_aggregates"
                ).fetchone()[0]
            payload = {
                "status": "ok",
                "engine": "duckdb",
                "writer": "groupsum-catalog-api",
                "metric_observations": observations,
                "record_aggregates": aggregates,
            }
            body = json.dumps(payload).encode()
            self.send_response(200)
        except Exception as exc:  # pragma: no cover - container readiness boundary
            body = json.dumps({"status": "starting", "detail": str(exc)}).encode()
            self.send_response(503)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


def main() -> None:
    ThreadingHTTPServer(("0.0.0.0", 8001), Handler).serve_forever()


if __name__ == "__main__":
    main()
