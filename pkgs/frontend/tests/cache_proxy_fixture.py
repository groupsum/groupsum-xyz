"""Synthetic upstream for isolated Nginx cache-policy integration tests only."""
import hashlib
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Upstream(BaseHTTPRequestHandler):
    count = 0

    def respond(self, post=False):
        type(self).count += 1
        body = json.dumps({"fixture": True, "path": self.path, "padding": "x" * 2048}).encode()
        etag = 'W/"' + hashlib.sha256(body).hexdigest() + '"'
        status = 404 if "missing" in self.path else 200
        if self.headers.get("If-None-Match") == etag and not post:
            status = 304
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("ETag", etag)
        self.send_header("X-Upstream-Requests", str(type(self).count))
        private = post or self.headers.get("Authorization") or self.headers.get("Cookie")
        policy = ("no-store" if private else "public, max-age=31536000, immutable"
                  if "snapshot_id=" in self.path else "public, max-age=15")
        self.send_header("Cache-Control", policy)
        self.end_headers()
        if status != 304:
            self.wfile.write(body)

    def do_GET(self):
        self.respond()

    def do_POST(self):
        self.respond(post=True)

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8000), Upstream).serve_forever()
