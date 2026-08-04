# GroupSum catalog explorer design source

This folder preserves and evolves the attached catalog-explorer application that now defines the primary visual and interaction direction for groupsum.xyz.

The standalone app provides:

- Primary navigation for Products, Portfolio, Solutions, Services, Insights, and About.
- Contextual catalog views for repositories, packages, typed resources, and technologies.
- Collection summary bands, row cards, record detail layouts, metrics, sparklines, governance evidence, and ownership paths.
- Wrapped responsive layouts that do not require horizontal table scrolling.
- A complete footer with GroupSum, public catalog, governance, and legal routes.

The production application remains at the repository root because it owns server rendering, static discovery files, structured data, social metadata, real catalog adapters, backend page models, and deployment validation. Visual changes are promoted from this design source into the production components rather than replacing real data with this folder's bounded mock fixtures.

Run the standalone design source from this folder with `npm run dev`. Run the production app from the repository root.
