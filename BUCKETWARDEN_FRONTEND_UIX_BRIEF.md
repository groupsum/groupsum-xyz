# BucketWarden customer-facing lander brief

**Audience:** Frontend UIX engineer, copywriter, and technical marketer  
**Product:** BucketWarden  
**Live console:** [bucketwarden.groupsum.xyz](https://bucketwarden.groupsum.xyz)  
**Platform context:** [Groupsum](https://groupsum.xyz)  
**Status:** Customer-facing direction for implementation

## The job

Build a clear, credible product lander for teams responsible for cloud storage, data governance, security operations, and platform reliability.

The visitor should understand three things quickly:

1. Storage changes are difficult to see and govern once they move across teams, services, and automation.
2. BucketWarden gives operators a clearer way to audit storage activity and act on policy violations.
3. They can open the live console, read the technical material, or connect with Groupsum about their environment.

This is a product page, not a company dissertation and not a provider-compatibility showcase.

## Positioning

### One-line position

**BucketWarden helps teams keep cloud storage changes visible, governed, and reviewable.**

### Hero direction

**Know what changed in your storage—and what to do next.**

Supporting copy:

> BucketWarden helps security and platform teams audit storage activity, surface policy issues, and give operators a clear path from event to action.

Primary CTA: **Open the audit console**  
Secondary CTA: **See how it works**

### Message hierarchy

**Problem:** Storage changes can happen across buckets, services, identities, and automated workflows without a simple operational view.

**Value:** BucketWarden turns storage activity into an understandable audit and response workflow.

**Mechanism:** Observe relevant events, evaluate policy, surface the decision, and support an operator response such as review, flagging, or quarantine where configured.

**Audience outcome:** Security teams gain a clearer review surface. Platform teams gain a more explicit control boundary. Cloud architects gain a product they can evaluate against their storage design.

**Proof:** Link to the live console, product evidence, technical publications, and the Groupsum platform context.

**Boundary:** Do not promise universal provider coverage, automatic compliance, customer outcomes, or production scale unless separately approved.

## Who this is for

Use audience language that reflects real buying and evaluation roles:

- **Cloud and platform architects** evaluating storage control boundaries.
- **Security operations and compliance teams** reviewing access, policy, and public-exposure risk.
- **Data and infrastructure teams** responsible for storage workflows and operational change.
- **Engineering leaders** looking for a more reviewable path from storage event to response.

Do not lead with “cloud-native,” “enterprise-grade,” “zero trust,” or “AI-powered.” Say what the product helps the operator see and do.

## Page structure

### 1. Hero

Headline, short supporting copy, two CTAs, and an original event-to-decision visual.

The visual should show a storage event becoming a policy decision and an operator action. It must not be a fake dashboard, terminal window, padlock, shield, cloud outline, or stock security illustration.

### 2. The storage visibility gap

Short editorial section:

> Storage is part of the application. Its changes deserve the same visibility as code and infrastructure changes.

Follow with three short points:

- See relevant storage activity.
- Understand the policy decision.
- Give operators a traceable next step.

### 3. How BucketWarden works

Use four simple steps:

1. **Observe** — bring storage activity into view.
2. **Evaluate** — compare the event with declared policy.
3. **Respond** — review, flag, or quarantine where configured.
4. **Record** — preserve a useful audit trail for operators.

Keep each step to one sentence. Link “technical details” to the product or publication page.

### 4. Outcomes by audience

Use three outcome blocks, not a large feature grid:

- **For security teams:** Find policy issues earlier and create a clearer review trail.
- **For platform teams:** Make storage controls part of the operating model.
- **For architects:** Evaluate storage governance as an explicit system boundary.

### 5. Evidence and limits

Use plain, confidence-building language:

> See the product in context, review the available evidence, and understand where deployment-specific work begins.

Link to:

- [Open the live audit console](https://bucketwarden.groupsum.xyz)
- [Read Groupsum portfolio context](https://groupsum.xyz/portfolio/)
- [Read self-hosted Insights](https://groupsum.xyz/insights/)
- [Read a preserved publication](https://groupsum.xyz/2023/12/21/a-benchmark-for-sparse-logistic-regression/)

Do not make AWS S3 or Google Cloud Storage the visual center of this section. AWS S3 may appear as a compatibility note in technical material. Google Cloud Storage is internal infrastructure context and should not be marketed as a customer integration or product flex.

### 6. Publications

Label the two content paths clearly:

- **BucketWarden field notes** — product-specific technical writing.
- **Groupsum Insights archive** — self-hosted publications and preserved articles from the wider engineering portfolio.

Use short summaries and useful article titles. Do not imply that historical Groupsum articles are BucketWarden case studies.

### 7. Final CTA

Headline direction:

**Make storage governance easier to see and act on.**

CTAs:

- **Open the audit console**
- **Discuss your storage environment**
- **Read the field notes**

Footer link: **Explore the Groupsum platform** → [groupsum.xyz](https://groupsum.xyz)

## Customer-facing copy rules

- Prefer concrete verbs: see, review, evaluate, surface, govern, record, respond.
- Explain the operator benefit before naming implementation details.
- Use “helps” when describing product value; reserve “enforces,” “quarantines,” and “automates” for verified flows.
- Keep paragraphs to 1–3 sentences.
- Keep headings short enough to scan on mobile.
- Never turn a repository, internal deployment, or technical dependency into a customer or compliance claim.
- Never claim certification, guaranteed protection, zero incidents, customer adoption, universal coverage, or production scale without approved evidence.

## Visual identity

Create a completely new BucketWarden identity. Do not reuse, trace, recolor, crop, simplify, or derive any previous Groupsum logo, lockup, monogram, symbol, design mark, favicon, or social image.

The new visual idea should express a visible signal becoming a governed record: calm, precise, and operational. Avoid literal buckets, locks, shields, checkmarks, cloud icons, neon cyberpunk, glowing glass, circuit-board motifs, and AI sparkle graphics.

Create original:

- BucketWarden wordmark and symbol.
- Horizontal lockup and wordmark-only asset.
- Small-size optical mark.
- Light/dark variants.
- New favicon family and social fallback.

Required icon outputs: `bucketwarden-favicon.svg`, `bucketwarden-favicon.ico`, 16 px and 32 px PNGs, 180 px Apple touch icon, 192 px and 512 px icons, maskable 512 px icon, and a manifest that references only the new BucketWarden assets. Use new filenames to avoid stale Groupsum cache references.

## CSS direction: soft borders only

Use a warm, light-first interface with a restrained technical accent. The page should feel editorial and trustworthy, not like a dark security dashboard.

```css
:root {
  --bw-canvas: #f2f0ea;
  --bw-surface: #faf9f5;
  --bw-surface-raised: #fffdf8;
  --bw-ink: #1e2724;
  --bw-ink-muted: #61706a;
  --bw-accent: #245f57;
  --bw-accent-hover: #174a44;
  --bw-signal: #c46f3b;
  --bw-border-soft: rgb(30 39 36 / 10%);
  --bw-border-muted: rgb(30 39 36 / 16%);
  --bw-border-accent-soft: rgb(36 95 87 / 24%);
  --bw-focus: #8b4b2e;
  --bw-shadow-soft: 0 18px 48px rgb(33 43 39 / 8%);
}
```

Explicit requirements:

- Do **not** require high-contrast white borders.
- Do **not** require high-contrast black borders.
- Do not use pure white, near-white, pure black, near-black, `currentColor`, or opaque text colors as resting borders.
- Standard cards, panels, inputs, and dividers use `--bw-border-soft` at `1px`.
- Use surface tone, spacing, type, or soft shadow before adding another border.
- Focus may be stronger than resting borders, but use an outline or shadow ring.
- Text, controls, and focus states must still meet accessibility requirements.

```css
.bw-card,
.bw-panel,
.bw-input {
  border: 1px solid var(--bw-border-soft);
  border-radius: 0.9rem;
}

:where(a, button, input, select, textarea):focus-visible {
  outline: 3px solid color-mix(in srgb, var(--bw-focus) 42%, transparent);
  outline-offset: 3px;
}
```

## UX requirements

- Responsive at 320, 768, 1024, and 1440 CSS px.
- No horizontal page scroll at 320 px.
- 44 px minimum touch targets.
- Semantic landmarks, one clear `h1`, ordered headings, descriptive links, and keyboard-accessible navigation.
- Visible focus, reduced-motion support, dark-mode support, forced-colors support, and 200% zoom support.
- Diagram alt text when informative; empty alt when decorative.
- Clear loading, empty, error, and success states for publications and inquiry actions.
- Fast first paint; no hero video or third-party font dependency.

## Definition of done

The page is ready when a cloud/security/platform visitor can understand the problem, product value, operating model, evidence path, and next action without reading a technical essay; when the live console and self-hosted publications are easy to find; when the BucketWarden identity is wholly original; and when the UI uses soft borders rather than required black or white frames.
