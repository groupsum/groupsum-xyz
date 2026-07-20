# Groupsum product research catalog

Research date: 2026-07-20

This catalog is grounded in local repository READMEs and source trees. It is a portfolio-research artifact, not a release or commercial-availability claim. The site should label each item by maturity and evidence status before publishing customer-facing claims.

## Recommended portfolio families

| Product | Recommended positioning | Confirmed local evidence | Publication boundary |
| --- | --- | --- | --- |
| **Voltrack** | Multi-app volume, inventory, or operational tracking workspace with client, backend, and static-serving layers | `groupsum/voltrack` has `backend/`, `client/`, and `staticserve/`; client supports `client-local`, `client-to-remote`, and `client-to-proxy-to-remote` Tigrbl engine modes using JSON-RPC | The README establishes architecture and runtime modes, but not a public launch, customer deployment, or specific volume-domain metric |
| **DCIM Rack Planner** | Data-center infrastructure planning and rack-layout visualization | `groupsum/dcim-rack-planner` has backend, client, staticserve, rack/layout/device/facility pages, topology stores, provisioning, cabling, ports, circuits, and capacity-oriented workflows | Describe as a planning workspace or project; do not imply production DCIM adoption or inventory scale without separate evidence |
| **DCIM Fiber Planner** | Fiber, optical, cabling, and transport planning workspace | `groupsum/dcim-fiber-planner` has backend, Vite/React client, staticserve, proxy/health routes, and client optical/fiber planning surfaces | Describe implemented planning surfaces; commercial service availability and carrier-grade operational claims require approval |
| **CC Deliverable Ops** | Confidential-computing workload release and attestation-bound secret delivery | `groupsum/confidential-workloads-delivery-ops` is a DeliverableOps/Tigrbl application with challenge, GCP Confidential Space attestation, key-possession proof, policy checks, ciphertext-only release, signed receipts, and governed infrastructure workflows | This is security-sensitive and evidence-scoped. Do not claim certification, customer adoption, guaranteed capacity, or production availability from repository evidence alone |
| **DeliverableOps** | SKU-to-digital-deliverable fulfillment runtime | `groupsum/deliverableops` documents the chain `SKU -> DeliverableReference -> BundleSnapshot -> ParameterBinding -> WorkflowRun -> Jobs -> Steps -> Artifacts -> Evidence -> ProofBundle -> DeliveryEvent -> AcceptanceRecord`; it includes Tigrbl/Tigrcorn APIs, checkout webhook verification, bundle/workflow validation, local and GitHub Actions execution, artifacts, evidence, proof, delivery, and acceptance | Present as a runtime/platform project. Keep example bundles and CI evidence separate from paid deliverables or customer outcomes |
| **EvidenceVault** | Forensic evidence custody, sealed bundles, audit trails, disclosure policies, and independent verification | `groupsum/evidencevault` contains vault, admin, and verifier web apps; contracts, crypto, roles, storage, local/remote/cached-remote adapters; Python backend packages; local Docker UI/API/MinIO setup; WORM/evidence target research | “BucketWarden-backed” is not currently confirmed by the EvidenceVault README/source inspected here. Use “object-storage-backed” unless a direct integration contract is added and verified |
| **npmctl** | Owner-scoped GitOps controller for Nginx Proxy Manager | `groupsum/npmctl` README and public repository document desired-state validation, owner-scoped plan/apply, explicit adoption, drift-safe mutation boundaries, proxy hosts, certificates, access lists, redirects, streams, users, settings, DNS providers, audits, diagnostics, and compliance artifacts | This is the strongest public product candidate in this group. Still separate repository capability from live installation health |
| **Portwyrm** | Self-hosted reverse-proxy control plane and npmctl-compatible NPM replacement | `groupsum/portwyrm` documents a control-plane UI/API on port 81, Nginx data plane on 80/443, npmctl-compatible API behavior, deterministic Nginx generations, identity/MFA, certificate lifecycle, migration, rollback, and Tigrbl metadata engines | The README explicitly says the 1.0 target is under active implementation and external ACME/MySQL gates remain. Do not call it a released 1.0 product |
| **Wyrmctl** | **Unresolved name / likely Portwyrm operator CLI alias** | No separate `wyrmctl` repository or authoritative local product record was found. Portwyrm already includes an operator CLI with `status`, `schema`, `setup`, `login`, CRUD, import/export, and npm migration commands | Do not publish Wyrmctl as a separate product until its repository, package, or naming decision is confirmed |

## Evidence notes by product

### Voltrack

The most defensible description is a multi-app operational tracking foundation. Its client supports three persistence/network modes: browser-local IndexedDB/local storage, direct JSON-RPC remote access, and a staticserve proxy-to-remote mode. The standardized `TIGRBL_ENGINE_CONFIG` contract is a useful portfolio detail because it shows the product is designed for local-first and remotely synchronized operation.

### DCIM Rack Planner

This is broader than a static rack diagrammer. The repository contains facilities, sites, pods, racks, rack models, devices, device models, ports, cables, circuits, cabling, provisioning, procurement, customer, IAM, topology, transport-map, and analysis surfaces. The portfolio should frame it as an infrastructure planning/operator workspace, with “rack layout visualization” as the entry point.

### DCIM Fiber Planner

This should be grouped with the rack planner under an infrastructure planning suite, but kept as its own project record. The repository’s explicit fiber/optical language and `client-to-proxy-to-remote` service mode justify describing fiber topology and transport planning. Avoid implying live carrier inventory or network-provider integration without a separate source.

### CC Deliverable Ops and DeliverableOps

These belong in one delivery-and-assurance family, but they are not the same product. DeliverableOps is the general fulfillment runtime; CC Deliverable Ops is a security-sensitive application built on it. The CC project’s strongest differentiators are single-use challenges, attestation policy evaluation, proof of private-key possession, ciphertext-only secret release, signed receipt verification, and explicit separation between infrastructure evidence and commercial claims.

### EvidenceVault

EvidenceVault has a clear forensic custody and independent-verifier story. The local compose notes show MinIO/object-storage development and separate UI/API endpoints. The repository also contains careful guidance on WORM, retention, proof-of-existence, and evidence-record standards. The website should not say “BucketWarden-backed” until the storage adapter or integration contract directly proves that relationship.

### npmctl and Portwyrm

These should be presented as adjacent control-plane products. npmctl is the declarative GitOps/controller layer for Nginx Proxy Manager resources. Portwyrm is the self-hosted control/data plane that aims to preserve the npmctl-shaped API while replacing NPM. The distinction matters: npmctl can target NPM, while Portwyrm provides the proxy platform and operator UI/API.

## Suggested site taxonomy

- **Infrastructure planning:** DCIM Rack Planner, DCIM Fiber Planner, Voltrack.
- **Delivery and release operations:** DeliverableOps, CC Deliverable Ops, npmctl.
- **Proxy and edge control:** Portwyrm, npmctl.
- **Evidence and assurance:** EvidenceVault, CC Deliverable Ops, DeliverableOps.
- **Storage integration:** EvidenceVault with object-storage adapters; BucketWarden relationship pending direct integration evidence.

## Links

- [Voltrack](https://github.com/groupsum/voltrack)
- [DCIM Rack Planner](https://github.com/groupsum/dcim-rack-planner)
- [DCIM Fiber Planner](https://github.com/groupsum/dcim-fiber-planner)
- [Confidential Workloads Delivery Ops](https://github.com/groupsum/confidential-workloads-delivery-ops)
- [DeliverableOps](https://github.com/groupsum/deliverableops)
- [EvidenceVault](https://github.com/groupsum/evidencevault)
- [npmctl](https://github.com/groupsum/npmctl)
- [Portwyrm](https://github.com/groupsum/portwyrm)
