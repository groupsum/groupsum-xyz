export interface paths {
    "/api/v1/analytics/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["MetricObservation.catalog_analytics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/analytics/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["MetricObservation.analytics_summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.catalog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/packages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Package.catalog_packages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/packages/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Package.catalog_package"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/releases/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.catalog_release"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/repositories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.catalog_repositories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/repositories/{owner}/{repository}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.catalog_repository"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.catalog_resources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/resources/{resource_type}/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.catalog_resource"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/technologies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Technology.catalog_technologies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/technologies/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Technology.catalog_technology"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/contributors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PartyPerson.contributors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/contributors/{provider}/{login}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PartyPerson.contributor_detail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.entities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities/{entity_type}/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["MetricObservation.metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities/{entity_type}/metrics/{metric_key}/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["MetricObservation.metric_series"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities/{entity_type}/observations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogObservation.observations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities/{entity_type}/{entity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.entity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/insights": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.insights"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organizations/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Organization.organization"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/portfolio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Portfolio.portfolios"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/portfolio/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Portfolio.portfolio"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.products"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.product"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/repository-metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.repository_metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.services"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/services/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.service"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/snapshots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogSnapshot.catalog_snapshots"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/snapshots/{snapshot_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogSnapshot.catalog_snapshot"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/solutions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.solutions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/solutions/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.solution"];
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
        get: operations["catalog_healthz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/catalog/associations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Association.publish_associations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/catalog/entities/{entity_type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Association.publish_entities"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/catalog/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["MetricObservation.publish_metrics"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/catalog/observations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CatalogObservation.publish_observations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/catalog/snapshots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CatalogSnapshot.publish_snapshot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/system/healthz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Health
         * @description Database connectivity check.
         */
        get: operations["healthz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/system/hookz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Hooks
         * @description Expose hook execution order for each method.
         *
         *     Phases appear in runner order; error phases trail.
         *     Within each phase, hooks are listed in execution order: global (None) hooks, then method-specific hooks.
         */
        get: operations["hookz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/system/kernelz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Kernel Plan
         * @description Phase-chain plan as built by the kernel per operation.
         */
        get: operations["kernelz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/system/methodz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Methods
         * @description Ordered, canonical operation list.
         */
        get: operations["methodz"];
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
        /** InternalResponse */
        InternalResponse: {
            /**
             * Accepted
             * @default 0
             */
            accepted: number;
            /**
             * Created
             * @default 0
             */
            created: number;
            /**
             * Existing
             * @default 0
             */
            existing: number;
            /** Snapshot Id */
            snapshot_id: string;
            /** Status */
            status: string;
        };
        /** PublicResponse */
        PublicResponse: unknown;
        /** RecordBatch */
        RecordBatch: {
            /** Records */
            records?: {
                [key: string]: unknown;
            }[];
            /** Snapshot Id */
            snapshot_id: string;
        };
        /** SnapshotCreate */
        SnapshotCreate: {
            /**
             * Collected At
             * Format: date-time
             */
            collected_at: string;
            /**
             * Collector Version
             * @default null
             */
            collector_version: string | null;
            /** Completeness */
            completeness?: {
                [key: string]: unknown;
            };
            /**
             * Error Count
             * @default 0
             */
            error_count: number;
            /** Measurement Count */
            measurement_count: number;
            /** Observation Count */
            observation_count: number;
            /**
             * Parent Snapshot Id
             * @default null
             */
            parent_snapshot_id: string | null;
            /**
             * Schema Version
             * @default null
             */
            schema_version: string | null;
            /** Snapshot Id */
            snapshot_id: string;
            /** Source Digest */
            source_digest: string;
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
    "MetricObservation.catalog_analytics": {
        parameters: {
            query?: {
                measurement_id?: string;
                snapshot_id?: string;
                subject_type?: string;
                subject_id?: string;
                metric_key?: string;
                numeric_value?: string;
                text_value?: string;
                unit?: string;
                dimensions?: string;
                period_start?: string;
                period_end?: string;
                source_url?: string;
                source_observation_id?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "MetricObservation.analytics_summary": {
        parameters: {
            query?: {
                measurement_id?: string;
                snapshot_id?: string;
                subject_type?: string;
                subject_id?: string;
                metric_key?: string;
                numeric_value?: string;
                text_value?: string;
                unit?: string;
                dimensions?: string;
                period_start?: string;
                period_end?: string;
                source_url?: string;
                source_observation_id?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Association.catalog": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Package.catalog_packages": {
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Package.catalog_package": {
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
                source_payload?: string;
            };
            header?: never;
            path: {
                route_key: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Association.catalog_release": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                route_key: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Repository.catalog_repositories": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Repository.catalog_repository": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
            };
            header?: never;
            path: {
                owner: string;
                repository: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Association.catalog_resources": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Association.catalog_resource": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                resource_type: string;
                route_key: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Technology.catalog_technologies": {
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Technology.catalog_technology": {
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
                source_payload?: string;
            };
            header?: never;
            path: {
                slug: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "PartyPerson.contributors": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                provider?: string;
                provider_id?: string;
                login?: string;
                profile_url?: string;
                avatar_url?: string;
                account_type?: string;
                anonymous?: boolean;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "PartyPerson.contributor_detail": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                provider?: string;
                provider_id?: string;
                login?: string;
                profile_url?: string;
                avatar_url?: string;
                account_type?: string;
                anonymous?: boolean;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                provider: string;
                login: string;
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
                    "application/json": unknown;
                };
            };
        };
    };
    "Association.entities": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "MetricObservation.metrics": {
        parameters: {
            query?: {
                measurement_id?: string;
                snapshot_id?: string;
                subject_type?: string;
                subject_id?: string;
                metric_key?: string;
                numeric_value?: string;
                text_value?: string;
                unit?: string;
                dimensions?: string;
                period_start?: string;
                period_end?: string;
                source_url?: string;
                source_observation_id?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                entity_type: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "MetricObservation.metric_series": {
        parameters: {
            query?: {
                measurement_id?: string;
                snapshot_id?: string;
                subject_type?: string;
                subject_id?: string;
                metric_key?: string;
                numeric_value?: string;
                text_value?: string;
                unit?: string;
                dimensions?: string;
                period_start?: string;
                period_end?: string;
                source_url?: string;
                source_observation_id?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                entity_type: string;
                metric_key: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "CatalogObservation.observations": {
        parameters: {
            query?: {
                id?: string;
                snapshot_id?: string;
                subject_type?: string;
                subject_id?: string;
                observation_type?: string;
                source_kind?: string;
                source_url?: string;
                status?: string;
                observed_at?: string;
                payload?: string;
                content_hash?: string;
                confidence?: string;
            };
            header?: never;
            path: {
                entity_type: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Association.entity": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                entity_type: string;
                entity_id: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Association.insights": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Organization.organization": {
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
                slug: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Portfolio.portfolios": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Portfolio.portfolio": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
            };
            header?: never;
            path: {
                slug: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Product.products": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Product.product": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
            };
            header?: never;
            path: {
                slug: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Repository.repository_metrics": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Product.services": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Product.service": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
            };
            header?: never;
            path: {
                slug: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "CatalogSnapshot.catalog_snapshots": {
        parameters: {
            query?: {
                id?: string;
                schema_version?: string;
                collected_at?: string;
                completed_at?: string;
                status?: string;
                collector_version?: string;
                source_digest?: string;
                parent_snapshot_id?: string;
                is_current?: boolean;
                completeness?: string;
                observation_count?: number;
                measurement_count?: number;
                error_count?: number;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "CatalogSnapshot.catalog_snapshot": {
        parameters: {
            query?: {
                id?: string;
                schema_version?: string;
                collected_at?: string;
                completed_at?: string;
                status?: string;
                collector_version?: string;
                source_digest?: string;
                parent_snapshot_id?: string;
                is_current?: boolean;
                completeness?: string;
                observation_count?: number;
                measurement_count?: number;
                error_count?: number;
            };
            header?: never;
            path: {
                snapshot_id: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Product.solutions": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    "Product.solution": {
        parameters: {
            query?: {
                id?: string;
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
                source_payload?: string;
            };
            header?: never;
            path: {
                slug: string;
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
                    "application/json": components["schemas"]["PublicResponse"][];
                };
            };
        };
    };
    catalog_healthz: {
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
    "Association.publish_associations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordBatch"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InternalResponse"];
                };
            };
        };
    };
    "Association.publish_entities": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entity_type: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordBatch"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InternalResponse"];
                };
            };
        };
    };
    "MetricObservation.publish_metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordBatch"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InternalResponse"];
                };
            };
        };
    };
    "CatalogObservation.publish_observations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordBatch"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InternalResponse"];
                };
            };
        };
    };
    "CatalogSnapshot.publish_snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SnapshotCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InternalResponse"];
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
    hookz: {
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
    kernelz: {
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
    methodz: {
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
}
