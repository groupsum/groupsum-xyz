export const siteContent = {
  product: {
    name: "GroupSum",
    slug: "groupsum-xyz",
    tagline: "Structured collaboration for groups that need clear decisions.",
    description: "GroupSum helps teams summarize, compare, and decide with durable group intelligence.",
    category: "Product website",
    canonicalUrl: "https://groupsum.xyz"
  },
  theme: { id: "default", label: "Default", mode: "light", tokens: { accent: "#246BFE" } },
  nav: {
    primary: [
      { label: "Platform", href: "/platform/" },
      { label: "Proof", href: "/proof/" },
      { label: "Docs", href: "https://docs.groupsum.xyz" }
    ],
    cta: { label: "Get started", href: "/platform/" }
  },
  footer: {
    note: "GroupSum is maintained by groupsum.",
    links: [
      { label: "GitHub", href: "https://github.com/groupsum/groupsum-xyz" },
      { label: "Docs", href: "https://docs.groupsum.xyz" }
    ]
  },
  ai: {
    llmsTxtTitle: "GroupSum",
    coreFacts: [
      "GroupSum helps teams summarize, compare, and decide with durable group intelligence.",
      "The canonical website is https://groupsum.xyz.",
      "The site is deployed as a self-hosted Docker static site."
    ]
  },
  pages: [
    {
      slug: "/",
      kind: "home",
      title: "GroupSum | Structured collaboration for groups that need clear decisions.",
      description: "GroupSum helps teams summarize, compare, and decide with durable group intelligence.",
      h1: "GroupSum",
      intro: "GroupSum helps teams summarize, compare, and decide with durable group intelligence. The site packages product positioning, structured metadata, and deployment evidence in a standalone MdWrk lander repository.",
      sections: [
        { id: "hero", kind: "hero", eyebrow: "GroupSum", title: "Structured collaboration for groups that need clear decisions.", subtitle: "GroupSum helps teams summarize, compare, and decide with durable group intelligence." },
        { id: "platform", kind: "feature_grid", title: "What this site owns", items: [
          { title: "Product narrative", description: "Canonical product messaging, audience positioning, and calls to action for groupsum.xyz." },
          { title: "Structured discovery", description: "Search, assistant, social, and linked-data metadata generated from the content pack." },
          { title: "Independent deploys", description: "CI, Docker deployment, and Namecheap DNS live in this repository." }
        ] },
        { id: "proof", kind: "proof_matrix", title: "Operational proof", items: [
          { claim: "The site is independently buildable.", status: "planned", evidence: "npm run build produces the local static artifact and Docker image build input." },
          { claim: "DNS ownership is explicit.", status: "planned", evidence: "site.manifest.json records the Namecheap zone and records owned by this repository." }
        ] },
        { id: "cta", kind: "cta", title: "Build from source", body: "Use npm ci, npm run check, npm run build, npm run dns:plan, and npm run proxy:plan before publishing." }
      ],
      schema: [
        { kind: "Organization", data: { name: "GroupSum", url: "https://groupsum.xyz" } },
        { kind: "WebSite", data: { name: "GroupSum", url: "https://groupsum.xyz" } }
      ]
    },
    {
      slug: "/platform/",
      kind: "feature",
      title: "GroupSum platform",
      description: "Platform overview for GroupSum.",
      h1: "Platform",
      intro: "This page captures the platform surface that the GroupSum website introduces to operators, builders, and technical evaluators.",
      sections: [
        { id: "details", kind: "feature_detail", title: "Repository-owned site system", body: "The lander is intentionally thin: the application host renders a typed content pack, while metadata, sitemap, robots, and Docker deployment remain repo-local.", items: [
          { title: "MdWrk lander", description: "Reusable page sections and structured-data support." },
          { title: "Content pack", description: "Product-specific content, navigation, metadata, and discovery outputs." }
        ] },
        { id: "faq", kind: "faq", title: "Platform FAQ", items: [
          { question: "Where is this site deployed?", answer: "It is built as a static site and served by a self-hosted Docker service." },
          { question: "Who owns DNS?", answer: "This repository owns its declared Namecheap records through the DNS workflow." }
        ] }
      ]
    },
    {
      slug: "/proof/",
      kind: "package",
      title: "GroupSum proof",
      description: "Build, DNS, and deployment proof for GroupSum.",
      h1: "Proof",
      intro: "The proof page gives operators a quick inventory of the commands and artifacts required before publication.",
      sections: [
        { id: "commands", kind: "package_grid", title: "Verification commands", packages: [
          { name: "Install", description: "Install deterministic dependencies.", install: "npm ci", api: ["npm ci"] },
          { name: "Check", description: "Run type and content-pack checks.", install: "npm run check", api: ["npm run check"] },
          { name: "Build", description: "Build the content pack and static site.", install: "npm run build", api: ["npm run build"] },
          { name: "DNS plan", description: "Render the Namecheap record plan.", install: "npm run dns:plan", api: ["npmctl plan desired-state/dns.yaml"] }
        ] }
      ]
    }
  ]
};

export { importedArticles as articles } from "./articles.generated.js";
export default siteContent;
