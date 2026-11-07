# Snapshot-aware catalog caching

Governs `feat:catalog.snapshot-cache`.

## Decision

Serve useful static HTML immediately, reuse public data in the browser, and share
public read responses between visitors. Freshness is controlled by the finalized
snapshot pointer, not by forcing every visitor through a loading screen.

Public read models are built by shared Python projection functions. Publication
freezes that exact bundle inside the existing digest-checked snapshot export before
the finalizer advances the current snapshot. A pinned request never reads mutable
entity tables. Old snapshots without a bundle explicitly reject immutable pins;
their unversioned routes retain the existing short-lived read path.

## Contracts

- Identity: snapshot ID, projection version, operation, normalized filters and page.
- Finalization rejects advertised projection versions missing from the source bundle.
- Static repository/package HTML and serialized initial query data use the same model.
- Browser query retention: 30 minutes inactive; bounded HTTP memory/IndexedDB caches:
  100 entries, 32 MiB, 2 MiB per persisted entry, 24-hour persistence retention.
- Only public anonymous GET data may persist. Authorization and explicit credential
  requests bypass the cache; cacheable fetches omit cookies.
- Successful pinned projections use stable weak ETags and immutable caching.
- Mutable aliases and the current pointer use 15-second shared freshness with a
  15-second revalidation allowance. Visible pages check the pointer every 30 seconds
  and on focus/reconnection. The normal-network freshness target is 60–90 seconds
  after successful finalization, independent of the static deployment schedule.
- A new snapshot changes cache identities. Old content can remain visible while
  its replacement loads, but it must not be silently relabeled as the new snapshot.
- Slow evidence and analytics are not prerequisites for rendering identity content.
- Errors are not cached as successful reads. Saved-data fallback is labeled and
  bounded to one day. Health, internal writes, cookies, authorization and non-GET
  requests are excluded from the shared proxy cache.
- Nginx compresses public responses once; Tigrcorn serves identity-coded responses
  so compression cannot turn unchanged JSON into time-varying validators.
- Intent prefetch is restricted to repository/package/contributor links, debounced,
  limited to one concurrent request, and disabled for data-saving connections.

## Baseline and verification

The live pre-change Markdown Workspace response contained 2,619,339 decoded bytes
(248,304 gzip bytes); governance was repeated three times. Repeat API requests were
approximately 1.1 seconds. Identical gzip responses changed ETags and returned 200
to conditional requests; identity-coded responses correctly returned 304. These
are small diagnostic samples, not field p75 performance claims.

Required checks: real Tigrbl HTTP pinning, snapshot isolation while live rows mutate,
304/validator stability, rejection of incomplete/unknown pins, filter/paging parity,
bounded storage, repeat navigation, reload persistence, separate browser contexts,
snapshot transition, offline/private-storage fallbacks, complete static detail HTML,
all theme/viewport regression checks and unchanged chunk/performance budgets.

## Rollout and compatibility

Deploy the application and Nginx configuration together, then run the regular
collector/publisher to produce the first snapshot containing frozen read models.
Until that refresh, populated static pages and browser caching still work, but old
snapshots remain explicitly non-immutable. No history rewrite, new database table,
Redis deployment, credential changes or publication-frequency change is required.

Publishers must run `catalog:export-public` before `catalog:publish`. The publisher
hashes the read-model bundle together with the collected source, so the published
snapshot ID may differ from the earlier collection-only descriptor. Deployments
must use the finalizer's returned ID, never the collection-only descriptor.

The one-time bootstrap workflow must rebuild the frontend from the returned final
snapshot before public parity verification. Ordinary deployments already materialize
the finalizer's snapshot and do not recollect sources.

Lab checks do not establish real-user p75 Web Vitals. Runtime cache headers expose
proxy HIT/MISS/BYPASS plus projection HIT/MISS and Server-Timing for operational
verification. Do not certify a deployment or zero-loading guarantee from local tests.

## Local verification record — 2026-11-06

- Backend: 54 passing tests, including real Tigrbl HTTP routes, immutable isolation,
  malformed projection rejection and conditional 304s. Report: `catalog-cache-pytest.xml`.
- Catalog pipeline: 30 passing tests. Frontend route/cache tests: 12 passing tests;
  design-system tests: 14; structured-data tests: 4. TypeScript and Ruff pass.
- Disposable Nginx integration: MISS → HIT with an unchanged upstream request count;
  authorization/cookies BYPASS; repeated 404s remain MISS; conditional gzip request 304.
- Real-browser cache test: warm memory reads, IndexedDB reuse after reload, separate
  snapshot identities, shared proxy caching across browser contexts and disabled-storage
  fallback pass. UI projections are explicitly intercepted local fixtures, not live API
  performance measurements. A new pointer causes a new read rather than reseeding old
  static HTML. Repository/package pages pass all six themes at 320/768/1280/1600px
  and 200% text size, with no page overflow or browser errors.
- Static generation waits for React Suspense completion rather than emitting aborted
  lazy-component boundaries. Core detail identity is populated before hydration.
- Comparable repository projection: 906,219 decoded bytes / 86,466 gzip bytes,
  versus the baseline 2,619,339 / 248,304. This is payload reduction, not a latency SLA.
- The isolated production build retains the original performance limits: largest
  chunk 193,830 bytes; initial JavaScript gzip 155,063 bytes (limit 155,100).
- Workflow lint passes after excluding existing custom-runner-label and undeclared
  legacy-secret diagnostics. Protected runner/environment gates are unchanged.

Reproduce transport checks with `npm run test:catalog-routes`. The opt-in browser
test is `npm run test:catalog-cache-browser`, against the disposable Nginx/upstream
fixture (`cache_proxy_fixture.py`) and isolated build output. Configure
`PLAYWRIGHT_MODULE`, `CHROME_PATH`, `CACHE_TEST_ORIGIN` and `CACHE_TEST_SITE` as needed.
It must not be pointed at a production write endpoint. No production deployment,
field Web Vitals result or release certification is asserted here.
