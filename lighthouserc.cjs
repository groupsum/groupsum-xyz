module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      numberOfRuns: 1,
      url: [
        "http://localhost/",
        "http://localhost/products/",
        "http://localhost/products/records/peagen/",
        "http://localhost/products/records/tigrbl/",
        "http://localhost/portfolio/",
        "http://localhost/portfolio/records/catalog-groupsum-groupsum-xyz/",
        "http://localhost/solutions/",
        "http://localhost/insights/",
      ],
      settings: {
        chromeFlags: "--headless --no-sandbox --disable-dev-shm-usage",
        preset: "desktop",
        throttlingMethod: "provided",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 1 }],
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
