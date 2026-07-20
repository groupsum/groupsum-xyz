# Groupsum LLC Portfolio, Solutions, and Services Website

## Frontend UIX implementation brief

**Status:** implementation brief  
**Audience:** frontend UIX engineer, brand designer, content owner, and delivery reviewer  
**Site:** `https://groupsum.xyz`  
**Prepared:** July 20, 2026

## 1. Assignment

Replace the current Groupsum website with a completely new branded lander for Groupsum LLC. The site must present three distinct commercial surfaces:

1. **Portfolio** — selected products, platforms, and technical work that demonstrate capability.
2. **Solutions** — the client outcomes and problem areas Groupsum can address.
3. **Services** — the concrete ways a client can engage Groupsum.

The new site must also keep the existing legacy blog/post archive available at its current URLs. The archive is a compatibility surface, not the new brand concept and not the homepage's primary purpose.

This is a **net-new identity and UI system**. Do not reuse, trace, recolor, crop, simplify, or derive any element from previous Groupsum logos, lockups, monograms, symbols, design marks, favicons, or social images.

## 2. Repository truth and migration boundary

The implementation must start from the current repository contracts rather than assuming a blank project:

- The host is a React 19 + TypeScript + Vite 6 static site.
- `src/App.tsx` currently owns homepage and article rendering.
- `packages/site-content-pack` owns typed site content plus generated article data.
- `scripts/import-wordpress.mjs` imports published WordPress posts.
- `scripts/generate-static.mjs` creates per-article HTML shells, metadata, `robots.txt`, `llms.txt`, and `sitemap.xml`.
- The generated article set currently contains **2,288 posts** with date-based paths, from at least 2018 through 2024.
- Existing examples include `/2018/12/21/pycon-canada-2017-presentation/` and `/2023/12/21/a-benchmark-for-sparse-logistic-regression/`.
- The existing `public/assets/` directory contains the prior Groupsum identity. Every current `groupsum-*` brand image is prohibited as a source or final asset for this redesign.
- The worktree contains unrelated deployment/workflow changes. The frontend implementer must preserve those changes and avoid rewriting deployment configuration unless the website implementation requires a narrowly scoped adjustment.

### Existing assets that must not be reused

- `groupsum-brand-horizontal.png`
- `groupsum-design-mark.png`
- `groupsum-design-mark-dark.png`
- `groupsum-design-mark-light.png`
- `groupsum-monogram.png`
- `groupsum-monogram-black.png`
- `groupsum-monogram-dark.png`
- `groupsum-monogram-light.png`
- `groupsum-symbol.png`
- `groupsum-vertical-lockup.png`
- `groupsum-wordmark.png`

Remove references to these files from the HTML head, React chrome, article metadata fallbacks, structured data, and social cards. Delete the files only after all consumers have migrated and the new asset set passes the build.

## 3. Product and brand position

### Working position

Groupsum builds governed developer systems for teams that need source-controlled truth, traceable delivery, and reusable operations. The company site should make that idea understandable without requiring the visitor to know internal vocabulary such as SSOT, governance packs, or delivery boundaries.

### Brand promise

**Complex technical work, made legible and operable.**

This line is a strategic direction, not approved final copy. Final copy may change, but it should preserve the same plain-language outcome.

### Desired impression

- Precise without feeling bureaucratic.
- Technically credible without reading like package documentation.
- Quietly confident, editorial, and human.
- Built by practitioners rather than assembled from agency clichés.
- Capable of spanning product engineering, delivery systems, data/document workflows, and governance.

### Avoid

- Generic “digital transformation” language.
- Unverifiable superlatives, customer counts, impact metrics, certifications, or partner claims.
- Dense terminal imagery as the primary visual idea.
- Stock photos of offices, handshakes, data centers, or people pointing at screens.
- Neon-on-black developer aesthetics, glowing glass cards, circuit-board motifs, and AI sparkle icons.
- A logo concept based on the previous Groupsum marks or their geometry.

## 4. Primary users and jobs

| User | Primary job | Evidence they need | Primary action |
| --- | --- | --- | --- |
| Technical buyer or operator | Decide whether Groupsum understands a difficult systems problem | Clear solution framing, relevant work, operating approach | Discuss a project |
| Product or engineering leader | Find a partner who can turn ambiguous scope into governed delivery | Portfolio depth, methods, concrete deliverables | Explore services, then inquire |
| Developer or evaluator | Understand what Groupsum actually builds | Product descriptions, source links, docs, honest maturity language | Open a project or technical resource |
| Returning article reader | Reach an old post without disruption | Original content, date, author/taxonomy context, readable code and media | Read or navigate to Insights |

The critical commercial path is:

`Landing page -> relevant solution or portfolio proof -> service model -> inquiry`

The critical legacy path is:

`Existing search/bookmark URL -> original article -> related Insights or main site`

## 5. Information architecture

### Primary navigation

- **Portfolio** — `/portfolio/`
- **Solutions** — `/solutions/`
- **Services** — `/services/`
- **Insights** — `/insights/`
- **About** — `/about/`
- Primary CTA: **Discuss a project** — `/contact/`

The homepage is a full lander and should preview Portfolio, Solutions, and Services. Dedicated index routes provide enough depth for discovery, sharing, and focused evaluation. Do not use ambiguous labels such as “Platform” or “Proof” in the primary navigation.

### Required routes

| Route | Purpose |
| --- | --- |
| `/` | Company lander and critical commercial path |
| `/portfolio/` | Filterable or grouped index of approved work |
| `/portfolio/{slug}/` | Optional case-study/product detail template when enough evidence exists |
| `/solutions/` | Outcome-led solution areas |
| `/services/` | Engagement models, deliverables, and ways of working |
| `/insights/` | Browse/search entry point for the legacy archive and future writing |
| `/about/` | Company point of view, operating principles, and legal identity |
| `/contact/` | Short inquiry flow with direct fallback contact method |
| `/privacy-policy/` | Privacy policy |
| `/terms-of-service/` | Terms |
| `/{yyyy}/{mm}/{dd}/{slug}/` | Existing article URLs; preserve exactly |
| `*` | Useful branded 404 with routes back to Portfolio, Insights, and Home |

If the implementation remains a client-routed single entry point, static generation must still create route-specific HTML metadata for all index/detail pages and articles.

## 6. Homepage content hierarchy

### A. Header

- New brand mark and new wordmark.
- Compact primary navigation.
- “Discuss a project” CTA.
- Active route state and visible keyboard focus.
- On narrow layouts, use a real menu button with `aria-expanded`, escape-to-close, focus return, and background scroll lock.

### B. Hero: what Groupsum does

- One direct outcome-led headline; target 6–12 words.
- One supporting paragraph; target 20–35 words.
- Primary CTA: “Discuss a project.”
- Secondary CTA: “View selected work.”
- One net-new graphic composition based on the new visual language described below.
- Do not place a card grid, fake dashboard, or terminal window inside the hero.

### C. Capability statement

Explain the connecting system behind the work: Groupsum turns decisions, specifications, software, verification, and operations into durable delivery systems. Use a short editorial layout, not six equal feature cards.

### D. Selected portfolio

Show 4–6 approved projects across different capability families. Each entry needs:

- Project name.
- One-sentence job/outcome.
- Type label such as product, platform, specification, or toolkit.
- Current evidence/maturity label when relevant.
- Destination: a detail page, public source, live product, or docs.

Initial candidates supported by the local organization inventory include `ssot-registry`, MdWrk/`markdown_workspace`, BucketWarden, PDFRemed, Portwyrm, and TrustSig. This is a **content-review shortlist**, not permission to publish unsupported maturity or customer-impact claims. The content owner must approve the final set and evidence for each card.

### E. Solutions

Solutions describe outcomes, not internal repos. Recommended initial groups:

1. **Governed product delivery** — connect decisions, scope, claims, tests, evidence, and releases.
2. **Document and knowledge systems** — build durable authoring, remediation, workspace, and publishing workflows.
3. **Trust, identity, and policy systems** — make authentication, authorization, signatures, and records explicit and testable.
4. **Storage and operational infrastructure** — design controlled movement, persistence, observability, and operator workflows.

Each solution preview must state the problem, the resulting capability, representative work, and the next action. Do not imply every portfolio project is production-complete.

### F. Services

Services describe how Groupsum engages. Recommended models:

- **Architecture and product definition** — discovery, system maps, ADRs/specs, boundaries, delivery plan.
- **Product and platform engineering** — implementation of web, CLI, API, package, and operational surfaces.
- **Governance and evidence systems** — claim/evidence models, conformance checks, release gates, reusable policy packs.
- **Modernization and remediation** — legacy content/system migration, accessibility remediation, workflow hardening.
- **Delivery operations** — CI/CD, distribution, infrastructure automation, observability, and release closure.

For each service show: useful when, typical outputs, engagement shape, and a relevant portfolio link. Do not publish price, duration, or availability until approved.

### G. Operating model

Use a simple four-stage sequence:

1. Frame the decision.
2. Define the boundary.
3. Build and verify.
4. Deliver with evidence.

The section should feel like a working method, not a decorative timeline.

### H. Insights preview

Show a deliberately curated set of recent or representative articles. Do not hard-code five posts in the React component. Source the preview from content data and allow editorial pinning. Clearly label older imported writing as archive content when its framing may not represent current company positioning.

### I. Final CTA and footer

- Short closing invitation with one inquiry CTA and one direct contact fallback.
- Footer links for primary pages, Insights, GitHub, privacy, and terms.
- Use the exact approved legal name “Groupsum LLC” in legal/footer contexts; use “Groupsum” as the display brand.

## 7. Portfolio and claim model

Portfolio content must be data-driven. Use a typed record rather than embedding project copy in components.

Minimum record:

```ts
type PortfolioItem = {
  slug: string;
  name: string;
  summary: string;
  capabilityFamily: "governed-delivery" | "documents" | "trust-policy" | "infrastructure";
  artifactType: "product" | "platform" | "toolkit" | "specification" | "engagement";
  maturity: "exploratory" | "active" | "released" | "archived";
  evidenceLabel: string;
  links: Array<{ label: string; href: string }>;
  featured: boolean;
  approved: boolean;
};
```

Only `approved: true` items may render publicly. A repository's existence is evidence that work exists, not proof of production maturity, adoption, certification, or client impact. If a project has mixed implemented and planned surfaces, its copy must describe that boundary.

## 8. Net-new identity direction

### Creative territory: Field Notes

Build the identity around **structured traces becoming a coherent field**: fine paths, registration marks, short annotations, and clustered evidence resolving into one clear composition. The mood is editorial systems engineering—closer to a carefully marked technical notebook or a modern field guide than a SaaS dashboard.

This territory must be developed from scratch. Do not use the silhouette, proportions, letter treatment, internal negative space, or composition of any previous Groupsum asset.

### New logo system

Create all of the following as original vector artwork:

- Primary horizontal lockup: new symbol + “Groupsum” wordmark.
- Wordmark-only asset.
- Symbol-only asset.
- One-color light and dark variants.
- Small-size optical variant for 16–32 px use.

The symbol should remain recognizable at 16 px and must not depend on hairline gaps, gradients, or tiny interior counters. Avoid literal “G + S” monograms, chat bubbles, people-in-a-circle, summation symbols, and stacked copies of the old mark.

### Favicon and application icons

Create a genuinely new favicon from the new small-size symbol. Required outputs:

- `favicon.svg`
- `favicon.ico` containing 16, 32, and 48 px sizes
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` at 180 × 180
- `icon-192.png`
- `icon-512.png`
- Maskable 512 × 512 icon with a documented safe zone
- `site.webmanifest` referencing only the new icon set

Verify on light and dark browser chrome. No old design mark may remain as a favicon, Apple touch icon, maskable icon, pinned asset, metadata fallback, or cached filename reference. Use new filenames where practical to reduce stale-cache collisions.

### Imagery

- Prefer original diagrams, annotated system fragments, project artifacts, and restrained abstract compositions.
- Use photography only when it documents real work and has publishing permission.
- Every image needs purposeful alt text or an empty `alt` when decorative.
- Portfolio imagery must not suggest a live product state that the linked evidence does not support.

## 9. Visual system and explicit CSS direction

### Color roles

Use a warm, light-first editorial system with one deep technical accent and one warm signal color. The following values are the implementation starting point; tune only after contrast and visual regression checks.

```css
:root {
  color-scheme: light;

  --color-canvas: #f3f1ea;
  --color-surface: #faf8f2;
  --color-surface-raised: #ffffff;
  --color-ink: #17211e;
  --color-ink-muted: #5c6863;
  --color-accent: #176b5b;
  --color-accent-hover: #0f574a;
  --color-signal: #c98232;
  --color-signal-soft: #f2dfc7;

  /* Borders are intentionally quiet and never pure black or white. */
  --color-border-soft: rgb(23 33 30 / 10%);
  --color-border-muted: rgb(23 33 30 / 16%);
  --color-border-accent-soft: rgb(23 107 91 / 24%);

  --shadow-soft: 0 18px 50px rgb(35 45 40 / 8%);
  --shadow-hover: 0 22px 60px rgb(35 45 40 / 12%);
  --focus-ring: #176b5b;

  --radius-sm: 0.5rem;
  --radius-md: 0.9rem;
  --radius-lg: 1.4rem;
  --content-max: 76rem;
  --reading-max: 46rem;
}
```

### Border rule: soft only

This is a hard requirement:

- Do **not** use white borders, near-white borders, black borders, or near-black borders to outline sections, cards, buttons, inputs, article blocks, or navigation.
- Do **not** use `border-color: #fff`, `#ffffff`, `#000`, `#000000`, `currentColor`, or opaque text colors as borders.
- Standard dividers and component outlines use `--color-border-soft`.
- Inputs and controls may use `--color-border-muted`; active state may use `--color-border-accent-soft` plus a separate focus ring.
- Normal borders are 1 px. Do not create high-contrast 2–4 px card frames.
- Prefer spacing, surface tone, typography, or a soft shadow over adding a border.
- A filled button may use `border: 1px solid transparent` to prevent layout shift.
- Focus visibility is an accessibility signal and may be stronger, but implement it as an offset outline or box-shadow ring—not as a permanent high-contrast border.

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
}

.button:focus-visible,
.nav-link:focus-visible,
.input:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}
```

The soft-border requirement does not relax WCAG contrast for text, icons, controls, or focus states. Interactive boundaries must remain understandable through fill, placement, labels, shape, and focus treatment.

### Typography

- Use a new pairing that has no dependency on the current Inter-led identity.
- Direction: expressive editorial serif for major headings plus a highly readable humanist sans for UI/body.
- Starting recommendation: self-hosted `Newsreader` for display and `Manrope` for UI/body, subject to license verification before committing font files.
- If the selected files are not self-hosted, use stable system fallbacks and avoid blocking render on third-party font services.
- Body size: 17–19 px on wide layouts, 16–18 px on narrow layouts.
- Article line length: 60–75 characters.
- Avoid all-caps paragraphs and excessive letter spacing. Eyebrows may use modest tracking.

### Layout and spacing

- Use a 4 px base with primary spacing steps of 8, 12, 16, 24, 32, 48, 64, 96, and 128 px.
- Main container: `min(76rem, 100% - 2 * gutter)`.
- Narrow gutter: 20 px; medium: 32 px; wide: 48 px.
- Alternate dense evidence rows with open editorial sections; do not make every section a card grid.
- Use asymmetry deliberately at wide widths, but return to a clear single-column reading order under content pressure.
- Keep radii restrained. Do not make every rectangle a pill.

### Motion

- Motion should clarify entry, hierarchy, and state change; it is not ambient decoration.
- Standard duration: 140–220 ms; section reveal maximum: 360 ms.
- Animate opacity and transform only where practical.
- No scroll-jacking, cursor-following effects, infinite marquees, or continuous background animation.
- Under `prefers-reduced-motion: reduce`, remove nonessential motion and make state changes immediate.

## 10. Component inventory and contracts

### Foundations to add

- Semantic color, type, spacing, radius, elevation, motion, and breakpoint tokens.
- New SVG icon/mark asset handling.
- Container, Stack, Cluster, and editorial Split layout primitives.
- Focus-ring and visually-hidden utilities.

### Components to add or replace

| Component | Contract |
| --- | --- |
| `SiteHeader` | Brand, desktop nav, disclosure-based mobile nav, active state, CTA |
| `SiteFooter` | Company statement, grouped links, legal identity, copyright |
| `Hero` | Eyebrow, headline, support copy, two actions, optional original graphic |
| `PortfolioCard` | Type, name, outcome, maturity/evidence, approved links; whole-card semantics without nested interactive conflicts |
| `SolutionSummary` | Problem, outcome, representative proof, action |
| `ServiceBlock` | Useful-when statement, outputs, engagement shape, related work |
| `EvidenceLabel` | Text-first maturity/evidence state; never color-only |
| `ArticleCard` | Date, title, excerpt, taxonomy, archive marker where needed |
| `ArticleLayout` | Breadcrumbs, title/meta, optional media, rich content, related content |
| `InquiryForm` | Persistent labels, validation, sending/success/error states, privacy context, direct-email fallback |
| `EmptyState` | Clear explanation and next route or recovery action |
| `Pagination` | Real links, current-page semantics, previous/next labels |

Do not preserve old components just because their class names exist. Reuse only neutral behavior that still satisfies the new semantic contract. Deprecate old brand classes/assets after consumers migrate, then remove them.

## 11. Legacy Insights and post compatibility

### Non-negotiable URL behavior

- Every imported `legacyPath` must keep returning the corresponding article at the same trailing-slash URL.
- Preserve canonical URLs unless a reviewed redirect/canonical migration map explicitly replaces them.
- Do not collapse legacy posts into a single client-only view that serves identical metadata for every URL.
- Include all index pages and legacy articles in `sitemap.xml` without duplicates.
- Internal links pointing to `groupsum.xyz` should remain same-origin relative links.
- External links remain external and receive safe `rel` behavior when opened in a new tab.

### Archive experience

- `/insights/` provides search and/or pagination over the imported collection; do not render 2,288 cards into the first page.
- Default ordering is newest first, while editorial pins may appear in a clearly labeled featured group.
- Support taxonomy labels only when the imported values are useful and normalized. Do not create thousands of low-value index pages automatically.
- Show publication date and author only when data is present. Never render empty separators.
- Provide a short archive notice for imported historical content.

### Rich-content safety and presentation

- Treat imported HTML as untrusted content at the rendering boundary. Add an allowlist-based sanitization step before public rendering; do not rely on `dangerouslySetInnerHTML` alone.
- Preserve headings, paragraphs, lists, tables, blockquotes, code, links, and legitimate media.
- Make wide tables and code blocks horizontally scrollable inside the reading column.
- Constrain images to the content width and prevent layout shift with dimensions or aspect ratio when known.
- Repair or clearly degrade missing images and embeds.
- Heading order in imported content must not create multiple page-level `h1` elements.

### Article discovery metadata

- Maintain route-specific title, description, canonical, Open Graph, and Twitter metadata.
- Use the **new** social-card asset as the fallback image.
- Keep valid `Article` JSON-LD and add author/publisher data only when accurate.
- Add `Organization` and `WebSite` structured data to the appropriate main pages.

## 12. Responsive behavior

Breakpoints should follow content pressure, with these test bands as a minimum:

- **Narrow:** 320–639 px — single-column flow, disclosure navigation, 20 px gutter, full-width primary actions where helpful.
- **Medium:** 640–1023 px — two-column portfolio/solution layouts when copy remains readable, 32 px gutter.
- **Wide:** 1024 px and above — asymmetric hero/editorial splits, 3-column portfolio only when cards retain useful line length, 48 px gutter.

Requirements:

- No horizontal page scroll at 320 CSS px.
- Navigation labels, portfolio names, URLs, code, and imported tables must survive long-content pressure.
- Touch targets are at least 44 × 44 CSS px where controls permit.
- Hero content must remain visible and understandable at 200% zoom.
- Reordering must preserve DOM reading and keyboard order.
- Do not hide meaningful portfolio or service content solely to make a narrow layout shorter.

## 13. State matrix

| Surface | Required states |
| --- | --- |
| Global navigation | default, current route, hover, focus, mobile closed/open |
| Portfolio/solution/service links | default, hover, focus, unavailable destination |
| Insights index | loading if client data is used, populated, no results, error, paginated |
| Legacy article | valid, missing media, malformed/removed embed, not found |
| Inquiry form | pristine, field error, submitting, success, service error, offline/retry |
| 404 | unknown route, clear recovery actions |

Do not show a blank shell while article data loads. Use a stable skeleton or statically available route payload so the title and page structure do not jump.

## 14. Accessibility requirements

- Meet WCAG 2.2 AA for the implemented surface.
- Use semantic landmarks, one page-level `h1`, logical headings, lists, buttons, links, and form controls.
- Provide a visible skip link.
- All navigation, menus, filters, pagination, and forms work by keyboard.
- Visible focus is never removed and is not communicated by color alone.
- Text and meaningful icons meet contrast requirements even though decorative borders remain soft.
- Form fields have persistent labels, instructions, inline errors tied with `aria-describedby`, and submission feedback announced appropriately.
- Mobile menu escape/close behavior and focus return are deterministic.
- Respect reduced motion and Windows high-contrast/forced-colors modes.
- Verify at 200% and 400% zoom.
- Decorative brand graphics are hidden from assistive technology; meaningful diagrams include text equivalents.

## 15. Performance and discovery

- Target Lighthouse lab scores of 90+ for Performance and 95+ for Accessibility, Best Practices, and SEO on representative production builds; document test conditions.
- Target Core Web Vitals: LCP <= 2.5 s, CLS <= 0.1, INP <= 200 ms at the 75th percentile once field data exists.
- Ship responsive AVIF/WebP images with appropriate fallbacks.
- Inline only critical brand SVGs; lazy-load below-the-fold media.
- Subset and preload only essential self-hosted fonts; use `font-display: swap`.
- Keep homepage JavaScript deliberately small. Static content must not require hydration to become readable.
- Generate unique metadata for Home, Portfolio, Solutions, Services, Insights, About, Contact, and each approved detail/article route.
- Preserve `robots.txt`, `sitemap.xml`, `llms.txt`, canonical URLs, and structured-data generation.

## 16. Contact experience

Default to a short inquiry form:

- Name
- Work email
- Organization (optional)
- “What are you trying to make possible?” multiline field
- Optional service interest
- Submit action

Do not ask for budget or phone number in the first interaction. Provide a visible direct-email fallback. The UI may be implemented before the final submission endpoint is selected, but it must never fake success: use a clearly documented adapter and show an honest unavailable/error state when no backend is configured.

## 17. Content and claim governance

- Treat implementation, tests, release artifacts, public docs, and live endpoints as distinct evidence types.
- Every featured portfolio statement must have an evidence owner and source link in the content record or adjacent editorial notes.
- Avoid “production-ready,” “enterprise-grade,” “certified,” “complete,” “secure,” or adoption claims unless current evidence explicitly supports them.
- Separate Groupsum-owned products from client work and experiments.
- Do not identify clients or imply a client relationship without approval.
- Historical posts do not automatically become current Groupsum positions.
- Draft content must not silently reach production; require an explicit approval field or reviewed content change.

## 18. Implementation sequence

1. Inventory every old brand reference and legacy URL consumer.
2. Add typed content models for portfolio, solutions, services, navigation, and Insights settings.
3. Create the new brand assets and semantic design tokens.
4. Build neutral layout primitives and accessible global chrome.
5. Implement the homepage critical path.
6. Implement Portfolio, Solutions, Services, About, Contact, and 404 routes.
7. Add the Insights index and migrate the article template without changing legacy paths.
8. Replace favicon, social fallback, manifest, metadata, and structured-data brand references.
9. Add sanitization and resilient styling for imported HTML.
10. Generate static metadata/output for all routes.
11. Run visual, responsive, accessibility, type, content, build, and legacy-URL regression checks.
12. Remove obsolete brand assets only after reference scanning is clean.

## 19. Verification matrix

At minimum, verify:

- `npm run check`
- `npm run build`
- Representative pages at 320, 768, 1024, and 1440 CSS px.
- Keyboard-only navigation through header, mobile menu, cards, pagination, form, and footer.
- Reduced-motion and forced-colors behavior.
- Automated accessibility scans on Home, Portfolio, Services, Insights, one article, Contact, and 404.
- Metadata and structured data for the same route sample.
- At least one legacy URL from each imported year plus a larger automated path-existence sample.
- No references to any prohibited old brand asset in source or built output.
- No pure white/black/high-contrast borders in component CSS or rendered screenshots.
- No horizontal overflow at 320 px, including article code blocks and tables.
- Inquiry submission success and failure behavior against the selected adapter.
- `sitemap.xml` contains all intended primary routes and all unique legacy article URLs.

## 20. Acceptance criteria

The redesign is complete only when:

1. The homepage clearly communicates Groupsum's portfolio, solutions, services, and next action without relying on the legacy archive.
2. The new logo, wordmark, symbol, favicon, touch icons, manifest icons, and social fallback are original and share no reused or derivative old Groupsum artwork.
3. The source and built site contain no references to the prohibited old brand assets.
4. Portfolio, Solutions, Services, Insights, About, Contact, legal, detail/article, and 404 experiences are implemented or explicitly routed to an approved staged scope.
5. Every existing imported post remains reachable at its exact legacy path with route-specific metadata.
6. The Insights index handles 2,288 posts without rendering the entire archive at once.
7. All standard UI borders use the defined soft semantic border tokens; there are no required white or black high-contrast component borders.
8. Text, controls, focus states, and meaningful icons still meet accessibility contrast requirements.
9. The site passes type/content checks and the production build.
10. The verification matrix is recorded with honest pass/fail evidence, and no partial check is presented as full release readiness.

## 21. Decisions for the content owner

These decisions should be resolved during implementation but do not block the initial system build:

- Approve the final hero claim and supporting proof.
- Approve the 4–6 featured portfolio projects and their maturity wording.
- Confirm which service categories are actively offered.
- Select the contact destination and published email address.
- Confirm the exact legal copy and mailing/privacy details.
- Decide whether any historical posts require archival disclaimers, corrections, or removal for legal reasons while preserving appropriate redirect behavior.

Until approval, use accurate draft labels and keep unapproved portfolio records out of the public build.
