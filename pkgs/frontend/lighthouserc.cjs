module.exports = {
  ci: {
    collect: {
      staticDistDir: "./pkgs/frontend/dist",
      numberOfRuns: 1,
      url: [
        "http://localhost/",
        "http://localhost/products/",
        "http://localhost/products/records/peagen/",
        "http://localhost/products/records/tigrbl/",
        "http://localhost/portfolio/",
        "http://localhost/portfolio/portwyrm/",
        "http://localhost/solutions/",
        "http://localhost/insights/",
      ],
      settings: {
        chromeFlags: "--headless --no-sandbox --disable-dev-shm-usage",
        preset: "desktop",
        throttlingMethod: "provided",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        // The static audit server intentionally has no API proxy and the CI
        // runner blocks remote font requests. Exercise console health in the
        // integrated deployment probes instead of treating those requests as
        // browser-code errors here.
        skipAudits: ["errors-in-console"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.02 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
