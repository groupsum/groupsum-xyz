export interface paths {
    "/catalogentry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogEntry.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalogentry/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogEntry.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/healthz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Catalog API health */
        get: operations["healthz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organization": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Organization.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organization/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Organization.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/package": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Package.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/package/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Package.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/packagetechnology": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PackageTechnology.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/packagetechnology/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PackageTechnology.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfolio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Portfolio.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfolio/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Portfolio.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfolioproduct": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PortfolioProduct.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfolioproduct/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PortfolioProduct.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfoliorepository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PortfolioRepository.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfoliorepository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PortfolioRepository.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productpackage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProductPackage.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productpackage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProductPackage.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productrepository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProductRepository.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productrepository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProductRepository.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productresource": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProductResource.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productresource/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProductResource.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorypackage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryPackage.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorypackage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryPackage.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryresource": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryResource.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryresource/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryResource.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotitem": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotItem.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotitem/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotItem.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotregistry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotRegistry.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotregistry/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotRegistry.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorytechnology": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryTechnology.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorytechnology/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryTechnology.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/technology": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Technology.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/technology/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Technology.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/typedresource": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TypedResource.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/typedresource/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TypedResource.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * CatalogEntryListResponse
         * @description Tigrbl v3 CatalogEntry list schema
         */
        CatalogEntryListResponse: {
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Icon Key
             * @default null
             */
            icon_key: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Kind */
            kind: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Organization Id
             * @default null
             */
            organization_id: string | null;
            /** Slug */
            slug: string;
            /** Source Id */
            source_id: string;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * CatalogEntryReadResponse
         * @description Tigrbl v3 CatalogEntry read schema
         */
        CatalogEntryReadResponse: {
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Icon Key
             * @default null
             */
            icon_key: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Kind */
            kind: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Organization Id
             * @default null
             */
            organization_id: string | null;
            /** Slug */
            slug: string;
            /** Source Id */
            source_id: string;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * OrganizationListResponse
         * @description Tigrbl v3 Organization list schema
         */
        OrganizationListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * OrganizationReadResponse
         * @description Tigrbl v3 Organization read schema
         */
        OrganizationReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * PackageListResponse
         * @description Tigrbl v3 Package list schema
         */
        PackageListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** Ecosystem */
            ecosystem: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Latest Version
             * @default null
             */
            latest_version: string | null;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /**
             * License Status
             * @default null
             */
            license_status: string | null;
            /**
             * Manifest Path
             * @default null
             */
            manifest_path: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Package Kind
             * @default null
             */
            package_kind: string;
            /**
             * Private
             * @default null
             */
            private: boolean;
            /**
             * Publication Status
             * @default null
             */
            publication_status: string | null;
            /**
             * Published
             * @default null
             */
            published: boolean | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Registry Url
             * @default null
             */
            registry_url: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PackageReadResponse
         * @description Tigrbl v3 Package read schema
         */
        PackageReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** Ecosystem */
            ecosystem: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Latest Version
             * @default null
             */
            latest_version: string | null;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /**
             * License Status
             * @default null
             */
            license_status: string | null;
            /**
             * Manifest Path
             * @default null
             */
            manifest_path: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Package Kind
             * @default null
             */
            package_kind: string;
            /**
             * Private
             * @default null
             */
            private: boolean;
            /**
             * Publication Status
             * @default null
             */
            publication_status: string | null;
            /**
             * Published
             * @default null
             */
            published: boolean | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Registry Url
             * @default null
             */
            registry_url: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PackageTechnologyListResponse
         * @description Tigrbl v3 PackageTechnology list schema
         */
        PackageTechnologyListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Id */
            package_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /** Technology Id */
            technology_id: string;
        };
        /**
         * PackageTechnologyReadResponse
         * @description Tigrbl v3 PackageTechnology read schema
         */
        PackageTechnologyReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Id */
            package_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /** Technology Id */
            technology_id: string;
        };
        /**
         * PortfolioListResponse
         * @description Tigrbl v3 Portfolio list schema
         */
        PortfolioListResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Focus
             * @default null
             */
            focus: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * PortfolioProductListResponse
         * @description Tigrbl v3 PortfolioProduct list schema
         */
        PortfolioProductListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Portfolio Id */
            portfolio_id: string;
            /** Product Id */
            product_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * PortfolioProductReadResponse
         * @description Tigrbl v3 PortfolioProduct read schema
         */
        PortfolioProductReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Portfolio Id */
            portfolio_id: string;
            /** Product Id */
            product_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * PortfolioReadResponse
         * @description Tigrbl v3 Portfolio read schema
         */
        PortfolioReadResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Focus
             * @default null
             */
            focus: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * PortfolioRepositoryListResponse
         * @description Tigrbl v3 PortfolioRepository list schema
         */
        PortfolioRepositoryListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Portfolio Id */
            portfolio_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * PortfolioRepositoryReadResponse
         * @description Tigrbl v3 PortfolioRepository read schema
         */
        PortfolioRepositoryReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Portfolio Id */
            portfolio_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * ProductListResponse
         * @description Tigrbl v3 Product list schema
         */
        ProductListResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ProductPackageListResponse
         * @description Tigrbl v3 ProductPackage list schema
         */
        ProductPackageListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Id */
            package_id: string;
            /** Product Id */
            product_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * ProductPackageReadResponse
         * @description Tigrbl v3 ProductPackage read schema
         */
        ProductPackageReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Id */
            package_id: string;
            /** Product Id */
            product_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * ProductReadResponse
         * @description Tigrbl v3 Product read schema
         */
        ProductReadResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ProductRepositoryListResponse
         * @description Tigrbl v3 ProductRepository list schema
         */
        ProductRepositoryListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Product Id */
            product_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * ProductRepositoryReadResponse
         * @description Tigrbl v3 ProductRepository read schema
         */
        ProductRepositoryReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Product Id */
            product_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * ProductResourceListResponse
         * @description Tigrbl v3 ProductResource list schema
         */
        ProductResourceListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Product Id */
            product_id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * ProductResourceReadResponse
         * @description Tigrbl v3 ProductResource read schema
         */
        ProductResourceReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Product Id */
            product_id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RepositoryListResponse
         * @description Tigrbl v3 Repository list schema
         */
        RepositoryListResponse: {
            /**
             * Default Branch
             * @default null
             */
            default_branch: string | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Is Archived
             * @default null
             */
            is_archived: boolean;
            /**
             * Is Fork
             * @default null
             */
            is_fork: boolean;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Organization Id
             * @default null
             */
            organization_id: string | null;
            /** Owner */
            owner: string;
            /** Provider */
            provider: string;
            /**
             * Ssot Governed
             * @default null
             */
            ssot_governed: boolean;
            /**
             * Ssot Observed At
             * @default null
             */
            ssot_observed_at: string | null;
            /**
             * Ssot Registry Sha256
             * @default null
             */
            ssot_registry_sha256: string | null;
            /**
             * Ssot Registry Url
             * @default null
             */
            ssot_registry_url: string | null;
            /**
             * Ssot Schema Version
             * @default null
             */
            ssot_schema_version: string | null;
            /**
             * Ssot Summary
             * @default null
             */
            ssot_summary: {
                [key: string]: unknown;
            } | null;
            /** Url */
            url: string;
        };
        /**
         * RepositoryPackageListResponse
         * @description Tigrbl v3 RepositoryPackage list schema
         */
        RepositoryPackageListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Id */
            package_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RepositoryPackageReadResponse
         * @description Tigrbl v3 RepositoryPackage read schema
         */
        RepositoryPackageReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Id */
            package_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RepositoryReadResponse
         * @description Tigrbl v3 Repository read schema
         */
        RepositoryReadResponse: {
            /**
             * Default Branch
             * @default null
             */
            default_branch: string | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Is Archived
             * @default null
             */
            is_archived: boolean;
            /**
             * Is Fork
             * @default null
             */
            is_fork: boolean;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Organization Id
             * @default null
             */
            organization_id: string | null;
            /** Owner */
            owner: string;
            /** Provider */
            provider: string;
            /**
             * Ssot Governed
             * @default null
             */
            ssot_governed: boolean;
            /**
             * Ssot Observed At
             * @default null
             */
            ssot_observed_at: string | null;
            /**
             * Ssot Registry Sha256
             * @default null
             */
            ssot_registry_sha256: string | null;
            /**
             * Ssot Registry Url
             * @default null
             */
            ssot_registry_url: string | null;
            /**
             * Ssot Schema Version
             * @default null
             */
            ssot_schema_version: string | null;
            /**
             * Ssot Summary
             * @default null
             */
            ssot_summary: {
                [key: string]: unknown;
            } | null;
            /** Url */
            url: string;
        };
        /**
         * RepositoryResourceListResponse
         * @description Tigrbl v3 RepositoryResource list schema
         */
        RepositoryResourceListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Repository Id */
            repository_id: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RepositoryResourceReadResponse
         * @description Tigrbl v3 RepositoryResource read schema
         */
        RepositoryResourceReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Repository Id */
            repository_id: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RepositorySsotItemListResponse
         * @description Tigrbl v3 RepositorySsotItem list schema
         */
        RepositorySsotItemListResponse: {
            /** Entity Id */
            entity_id: string;
            /** Entity Kind */
            entity_kind: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Registry Id */
            registry_id: string;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * RepositorySsotItemReadResponse
         * @description Tigrbl v3 RepositorySsotItem read schema
         */
        RepositorySsotItemReadResponse: {
            /** Entity Id */
            entity_id: string;
            /** Entity Kind */
            entity_kind: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Registry Id */
            registry_id: string;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * RepositorySsotRegistryListResponse
         * @description Tigrbl v3 RepositorySsotRegistry list schema
         */
        RepositorySsotRegistryListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Registry Url */
            registry_url: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Schema Version
             * @default null
             */
            schema_version: string | null;
            /**
             * Source Sha256
             * @default null
             */
            source_sha256: string | null;
            /**
             * Valid
             * @default null
             */
            valid: boolean;
        };
        /**
         * RepositorySsotRegistryReadResponse
         * @description Tigrbl v3 RepositorySsotRegistry read schema
         */
        RepositorySsotRegistryReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Registry Url */
            registry_url: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Schema Version
             * @default null
             */
            schema_version: string | null;
            /**
             * Source Sha256
             * @default null
             */
            source_sha256: string | null;
            /**
             * Valid
             * @default null
             */
            valid: boolean;
        };
        /**
         * RepositoryTechnologyListResponse
         * @description Tigrbl v3 RepositoryTechnology list schema
         */
        RepositoryTechnologyListResponse: {
            /**
             * Bytes
             * @default null
             */
            bytes: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Percentage
             * @default null
             */
            percentage: number | string | null;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /** Technology Id */
            technology_id: string;
        };
        /**
         * RepositoryTechnologyReadResponse
         * @description Tigrbl v3 RepositoryTechnology read schema
         */
        RepositoryTechnologyReadResponse: {
            /**
             * Bytes
             * @default null
             */
            bytes: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Percentage
             * @default null
             */
            percentage: number | string | null;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /** Technology Id */
            technology_id: string;
        };
        /**
         * TechnologyListResponse
         * @description Tigrbl v3 Technology list schema
         */
        TechnologyListResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Icon Key
             * @default null
             */
            icon_key: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * TechnologyReadResponse
         * @description Tigrbl v3 Technology read schema
         */
        TechnologyReadResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Icon Key
             * @default null
             */
            icon_key: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * TypedResourceListResponse
         * @description Tigrbl v3 TypedResource list schema
         */
        TypedResourceListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Organization Id
             * @default null
             */
            organization_id: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /** Resource Type */
            resource_type: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * TypedResourceReadResponse
         * @description Tigrbl v3 TypedResource read schema
         */
        TypedResourceReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Organization Id
             * @default null
             */
            organization_id: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /** Resource Type */
            resource_type: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "CatalogEntry.list": {
        parameters: {
            query?: {
                id?: string;
                kind?: string;
                source_id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                canonical_url?: string;
                icon_key?: string;
                visibility?: string;
                maturity?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogEntryListResponse"];
                };
            };
        };
    };
    "CatalogEntry.read": {
        parameters: {
            query?: {
                id?: string;
                kind?: string;
                source_id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                canonical_url?: string;
                icon_key?: string;
                visibility?: string;
                maturity?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogEntryReadResponse"];
                };
            };
        };
    };
    healthz: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "Organization.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationListResponse"];
                };
            };
        };
    };
    "Organization.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationReadResponse"];
                };
            };
        };
    };
    "Package.list": {
        parameters: {
            query?: {
                id?: string;
                ecosystem?: string;
                name?: string;
                registry_url?: string;
                source_url?: string;
                manifest_path?: string;
                package_kind?: string;
                private?: boolean;
                description?: string;
                latest_version?: string;
                published?: string;
                publication_status?: string;
                route_key?: string;
                license_expression?: string;
                license_status?: string;
                published_at?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageListResponse"];
                };
            };
        };
    };
    "Package.read": {
        parameters: {
            query?: {
                id?: string;
                ecosystem?: string;
                name?: string;
                registry_url?: string;
                source_url?: string;
                manifest_path?: string;
                package_kind?: string;
                private?: boolean;
                description?: string;
                latest_version?: string;
                published?: string;
                publication_status?: string;
                route_key?: string;
                license_expression?: string;
                license_status?: string;
                published_at?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageReadResponse"];
                };
            };
        };
    };
    "PackageTechnology.list": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                technology_id?: string;
                role?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageTechnologyListResponse"];
                };
            };
        };
    };
    "PackageTechnology.read": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                technology_id?: string;
                role?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageTechnologyReadResponse"];
                };
            };
        };
    };
    "Portfolio.list": {
        parameters: {
            query?: {
                id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                focus?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioListResponse"];
                };
            };
        };
    };
    "Portfolio.read": {
        parameters: {
            query?: {
                id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                focus?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioReadResponse"];
                };
            };
        };
    };
    "PortfolioProduct.list": {
        parameters: {
            query?: {
                id?: string;
                portfolio_id?: string;
                product_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioProductListResponse"];
                };
            };
        };
    };
    "PortfolioProduct.read": {
        parameters: {
            query?: {
                id?: string;
                portfolio_id?: string;
                product_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioProductReadResponse"];
                };
            };
        };
    };
    "PortfolioRepository.list": {
        parameters: {
            query?: {
                id?: string;
                portfolio_id?: string;
                repository_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioRepositoryListResponse"];
                };
            };
        };
    };
    "PortfolioRepository.read": {
        parameters: {
            query?: {
                id?: string;
                portfolio_id?: string;
                repository_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioRepositoryReadResponse"];
                };
            };
        };
    };
    "Product.list": {
        parameters: {
            query?: {
                id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductListResponse"];
                };
            };
        };
    };
    "Product.read": {
        parameters: {
            query?: {
                id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductReadResponse"];
                };
            };
        };
    };
    "ProductPackage.list": {
        parameters: {
            query?: {
                id?: string;
                product_id?: string;
                package_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductPackageListResponse"];
                };
            };
        };
    };
    "ProductPackage.read": {
        parameters: {
            query?: {
                id?: string;
                product_id?: string;
                package_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductPackageReadResponse"];
                };
            };
        };
    };
    "ProductRepository.list": {
        parameters: {
            query?: {
                id?: string;
                product_id?: string;
                repository_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductRepositoryListResponse"];
                };
            };
        };
    };
    "ProductRepository.read": {
        parameters: {
            query?: {
                id?: string;
                product_id?: string;
                repository_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductRepositoryReadResponse"];
                };
            };
        };
    };
    "ProductResource.list": {
        parameters: {
            query?: {
                id?: string;
                product_id?: string;
                resource_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResourceListResponse"];
                };
            };
        };
    };
    "ProductResource.read": {
        parameters: {
            query?: {
                id?: string;
                product_id?: string;
                resource_id?: string;
                role?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResourceReadResponse"];
                };
            };
        };
    };
    "Repository.list": {
        parameters: {
            query?: {
                id?: string;
                organization_id?: string;
                provider?: string;
                owner?: string;
                name?: string;
                url?: string;
                description?: string;
                default_branch?: string;
                is_archived?: boolean;
                is_fork?: boolean;
                license_expression?: string;
                ssot_governed?: boolean;
                ssot_registry_url?: string;
                ssot_registry_sha256?: string;
                ssot_schema_version?: string;
                ssot_summary?: string;
                ssot_observed_at?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryListResponse"];
                };
            };
        };
    };
    "Repository.read": {
        parameters: {
            query?: {
                id?: string;
                organization_id?: string;
                provider?: string;
                owner?: string;
                name?: string;
                url?: string;
                description?: string;
                default_branch?: string;
                is_archived?: boolean;
                is_fork?: boolean;
                license_expression?: string;
                ssot_governed?: boolean;
                ssot_registry_url?: string;
                ssot_registry_sha256?: string;
                ssot_schema_version?: string;
                ssot_summary?: string;
                ssot_observed_at?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryReadResponse"];
                };
            };
        };
    };
    "RepositoryPackage.list": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                package_id?: string;
                role?: string;
                repository_path?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryPackageListResponse"];
                };
            };
        };
    };
    "RepositoryPackage.read": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                package_id?: string;
                role?: string;
                repository_path?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryPackageReadResponse"];
                };
            };
        };
    };
    "RepositoryResource.list": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                resource_id?: string;
                role?: string;
                repository_path?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryResourceListResponse"];
                };
            };
        };
    };
    "RepositoryResource.read": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                resource_id?: string;
                role?: string;
                repository_path?: string;
                sort_order?: number;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryResourceReadResponse"];
                };
            };
        };
    };
    "RepositorySsotItem.list": {
        parameters: {
            query?: {
                id?: string;
                registry_id?: string;
                entity_kind?: string;
                entity_id?: string;
                title?: string;
                status?: string;
                implementation_status?: string;
                payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotItemListResponse"];
                };
            };
        };
    };
    "RepositorySsotItem.read": {
        parameters: {
            query?: {
                id?: string;
                registry_id?: string;
                entity_kind?: string;
                entity_id?: string;
                title?: string;
                status?: string;
                implementation_status?: string;
                payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotItemReadResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.list": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                registry_url?: string;
                schema_version?: string;
                source_sha256?: string;
                valid?: boolean;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotRegistryListResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.read": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                registry_url?: string;
                schema_version?: string;
                source_sha256?: string;
                valid?: boolean;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotRegistryReadResponse"];
                };
            };
        };
    };
    "RepositoryTechnology.list": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                technology_id?: string;
                role?: string;
                bytes?: string;
                percentage?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryTechnologyListResponse"];
                };
            };
        };
    };
    "RepositoryTechnology.read": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                technology_id?: string;
                role?: string;
                bytes?: string;
                percentage?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryTechnologyReadResponse"];
                };
            };
        };
    };
    "Technology.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                category?: string;
                description?: string;
                icon_key?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TechnologyListResponse"];
                };
            };
        };
    };
    "Technology.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                category?: string;
                description?: string;
                icon_key?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TechnologyReadResponse"];
                };
            };
        };
    };
    "TypedResource.list": {
        parameters: {
            query?: {
                id?: string;
                resource_type?: string;
                organization_id?: string;
                repository_id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TypedResourceListResponse"];
                };
            };
        };
    };
    "TypedResource.read": {
        parameters: {
            query?: {
                id?: string;
                resource_type?: string;
                organization_id?: string;
                repository_id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TypedResourceReadResponse"];
                };
            };
        };
    };
}
