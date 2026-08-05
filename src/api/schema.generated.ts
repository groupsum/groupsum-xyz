export interface paths {
    "/api/v1/catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Catalog overview page model */
        get: operations["catalog"];
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
        /** Package catalog collection */
        get: operations["catalog_packages"];
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
        /** Package catalog resource record */
        get: operations["catalog_package"];
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
        /** Release catalog resource record */
        get: operations["catalog_release"];
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
        /** Repository catalog collection */
        get: operations["catalog_repositories"];
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
        /** Repository catalog member record */
        get: operations["catalog_repository"];
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
        /** Typed resource catalog collection */
        get: operations["catalog_resources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/resources/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Typed catalog resource record */
        get: operations["catalog_resource"];
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
        /** Technology catalog collection */
        get: operations["catalog_technologies"];
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
        /** Technology catalog member record */
        get: operations["catalog_technology"];
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
        /** Canonical catalog entity collection */
        get: operations["entities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities/{entity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Canonical catalog entity graph */
        get: operations["entity"];
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
        /** Insight collection page model */
        get: operations["insights"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/insights/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Insight record page model */
        get: operations["insight"];
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
        /** Organization record page model */
        get: operations["organization"];
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
        /** Portfolio collection page model */
        get: operations["portfolio"];
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
        /** Portfolio record page model */
        get: operations["portfolio_record"];
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
        /** Product collection page model */
        get: operations["products"];
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
        /** Product record page model */
        get: operations["product"];
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
        /** Persisted repository metric histories */
        get: operations["repository_metrics"];
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
        /** Service collection page model */
        get: operations["services"];
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
        /** Service record page model */
        get: operations["service"];
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
        /** Solution collection page model */
        get: operations["solutions"];
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
        /** Solution record page model */
        get: operations["solution"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalogentity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogEntity.count"];
        put?: never;
        post: operations["CatalogEntity.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalogentity/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CatalogEntity.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Claim.count"];
        put?: never;
        post: operations["Claim.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/claim/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Claim.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/claimevidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ClaimEvidence.count"];
        put?: never;
        post: operations["ClaimEvidence.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/claimevidence/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ClaimEvidence.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dependency": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Dependency.count"];
        put?: never;
        post: operations["Dependency.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dependency/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Dependency.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/deployment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Deployment.count"];
        put?: never;
        post: operations["Deployment.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/deployment/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Deployment.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entityalias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityAlias.count"];
        put?: never;
        post: operations["EntityAlias.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entityalias/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityAlias.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entityrelationship": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityRelationship.count"];
        put?: never;
        post: operations["EntityRelationship.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entityrelationship/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityRelationship.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entitytype": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityType.count"];
        put?: never;
        post: operations["EntityType.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entitytype/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityType.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entityurl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityUrl.count"];
        put?: never;
        post: operations["EntityUrl.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entityurl/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["EntityUrl.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/evidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Evidence.count"];
        put?: never;
        post: operations["Evidence.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/evidence/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Evidence.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/feature": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Feature.count"];
        put?: never;
        post: operations["Feature.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/feature/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Feature.exists"];
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
    "/legalevidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalEvidence.count"];
        put?: never;
        post: operations["LegalEvidence.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalevidence/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalEvidence.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/limitation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Limitation.count"];
        put?: never;
        post: operations["Limitation.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/limitation/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Limitation.exists"];
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
        get: operations["Organization.count"];
        put?: never;
        post: operations["Organization.group_by"];
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
        get: operations["Organization.exists"];
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
        get: operations["Package.count"];
        put?: never;
        post: operations["Package.group_by"];
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
        get: operations["Package.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/packagerepository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PackageRepository.count"];
        put?: never;
        post: operations["PackageRepository.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/packagerepository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PackageRepository.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/packagetaxonomy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PackageTaxonomy.count"];
        put?: never;
        post: operations["PackageTaxonomy.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/packagetaxonomy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PackageTaxonomy.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Person.count"];
        put?: never;
        post: operations["Person.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Person.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/record": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Record.count"];
        put?: never;
        post: operations["Record.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/record/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Record.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordalias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordAlias.count"];
        put?: never;
        post: operations["RecordAlias.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordalias/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordAlias.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordauthor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordAuthor.count"];
        put?: never;
        post: operations["RecordAuthor.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordauthor/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordAuthor.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordfeature": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordFeature.count"];
        put?: never;
        post: operations["RecordFeature.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordfeature/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordFeature.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordpackage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordPackage.count"];
        put?: never;
        post: operations["RecordPackage.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordpackage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordPackage.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordrelation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordRelation.count"];
        put?: never;
        post: operations["RecordRelation.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordrelation/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordRelation.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordrepository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordRepository.count"];
        put?: never;
        post: operations["RecordRepository.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordrepository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordRepository.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordresource": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordResource.count"];
        put?: never;
        post: operations["RecordResource.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordresource/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordResource.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordtaxonomy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordTaxonomy.count"];
        put?: never;
        post: operations["RecordTaxonomy.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recordtaxonomy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RecordTaxonomy.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Release.count"];
        put?: never;
        post: operations["Release.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Release.exists"];
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
        get: operations["Repository.count"];
        put?: never;
        post: operations["Repository.group_by"];
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
        get: operations["Repository.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorycontributor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryContributor.count"];
        put?: never;
        post: operations["RepositoryContributor.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorycontributor/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryContributor.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorylanguage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryLanguage.count"];
        put?: never;
        post: operations["RepositoryLanguage.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositorylanguage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositoryLanguage.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotinventory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotInventory.count"];
        put?: never;
        post: operations["RepositorySsotInventory.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotinventory/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotInventory.exists"];
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
        get: operations["RepositorySsotRegistry.count"];
        put?: never;
        post: operations["RepositorySsotRegistry.group_by"];
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
        get: operations["RepositorySsotRegistry.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resource": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Resource.count"];
        put?: never;
        post: operations["Resource.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resource/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Resource.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourceevidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceEvidence.count"];
        put?: never;
        post: operations["ResourceEvidence.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourceevidence/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceEvidence.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourcerepository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceRepository.count"];
        put?: never;
        post: operations["ResourceRepository.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourcerepository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceRepository.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourcetaxonomy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceTaxonomy.count"];
        put?: never;
        post: operations["ResourceTaxonomy.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourcetaxonomy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceTaxonomy.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourcetype": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceType.count"];
        put?: never;
        post: operations["ResourceType.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resourcetype/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResourceType.exists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Taxonomy.count"];
        put?: never;
        post: operations["Taxonomy.group_by"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Taxonomy.exists"];
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
        /** CatalogCollection */
        CatalogCollection: {
            /** Count */
            count: number;
            /** Facets */
            facets?: {
                [key: string]: {
                    [key: string]: number;
                };
            };
            /**
             * Generated At
             * @default null
             */
            generated_at: string | null;
            /** Kind */
            kind: string;
            /**
             * Page
             * @default 1
             */
            page: number;
            /**
             * Page Count
             * @default 1
             */
            page_count: number;
            /**
             * Page Size
             * @default 50
             */
            page_size: number;
            /** Records */
            records: (components["schemas"]["RepositorySummary"] | components["schemas"]["PackageSummary"] | components["schemas"]["TypedResourceSummary"] | components["schemas"]["TechnologySummary"])[];
            /**
             * Resource Kind
             * @enum {string}
             */
            resource_kind: "repository" | "package" | "resource" | "technology";
        } & {
            [key: string]: unknown;
        };
        /**
         * CatalogEntityCountResponse
         * @description Tigrbl v3 CatalogEntity count schema
         */
        CatalogEntityCountResponse: {
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /** Entity Type Id */
            entity_type_id: string;
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
            /** Source Table */
            source_table: string;
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
         * CatalogEntityExistsResponse
         * @description Tigrbl v3 CatalogEntity exists schema
         */
        CatalogEntityExistsResponse: {
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /** Entity Type Id */
            entity_type_id: string;
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
            /** Source Table */
            source_table: string;
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
         * CatalogEntityGroupByRequest
         * @description Tigrbl v3 CatalogEntity group_by schema
         */
        CatalogEntityGroupByRequest: {
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /** Entity Type Id */
            entity_type_id: string;
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
            /** Source Table */
            source_table: string;
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
         * CatalogEntityGroupByResponse
         * @description Tigrbl v3 CatalogEntity group_by schema
         */
        CatalogEntityGroupByResponse: {
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /** Entity Type Id */
            entity_type_id: string;
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
            /** Source Table */
            source_table: string;
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
        /** CatalogMember */
        CatalogMember: {
            /** Governance */
            governance?: {
                [key: string]: unknown;
            };
            /**
             * Graph
             * @default null
             */
            graph: {
                [key: string]: unknown;
            } | null;
            /** Implementation */
            implementation?: {
                [key: string]: unknown;
            };
            /** Item */
            item: {
                [key: string]: unknown;
            };
            /** Kind */
            kind: string;
            /** Legal */
            legal?: {
                [key: string]: unknown;
            };
            /**
             * Parent
             * @default null
             */
            parent: {
                [key: string]: unknown;
            } | null;
            /** Related Records */
            related_records?: {
                [key: string]: unknown;
            }[];
            /**
             * Resource Type
             * @default null
             */
            resource_type: string | null;
        } & {
            [key: string]: unknown;
        };
        /** CatalogOverview */
        CatalogOverview: {
            /** Counts */
            counts: {
                [key: string]: number;
            };
            /**
             * Generated At
             * @default null
             */
            generated_at: string | null;
            /**
             * Kind
             * @constant
             */
            kind: "catalog_overview";
        } & {
            [key: string]: unknown;
        };
        /**
         * ClaimCountResponse
         * @description Tigrbl v3 Claim count schema
         */
        ClaimCountResponse: {
            /** Claim Type */
            claim_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Record Id
             * @default null
             */
            record_id: string | null;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Ssot Claim Id
             * @default null
             */
            ssot_claim_id: string | null;
            /** Statement */
            statement: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * ClaimEvidenceCountResponse
         * @description Tigrbl v3 ClaimEvidence count schema
         */
        ClaimEvidenceCountResponse: {
            /** Claim Id */
            claim_id: string;
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Support
             * @default null
             */
            support: string;
        };
        /**
         * ClaimEvidenceExistsResponse
         * @description Tigrbl v3 ClaimEvidence exists schema
         */
        ClaimEvidenceExistsResponse: {
            /** Claim Id */
            claim_id: string;
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Support
             * @default null
             */
            support: string;
        };
        /**
         * ClaimEvidenceGroupByRequest
         * @description Tigrbl v3 ClaimEvidence group_by schema
         */
        ClaimEvidenceGroupByRequest: {
            /** Claim Id */
            claim_id: string;
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Support
             * @default null
             */
            support: string;
        };
        /**
         * ClaimEvidenceGroupByResponse
         * @description Tigrbl v3 ClaimEvidence group_by schema
         */
        ClaimEvidenceGroupByResponse: {
            /** Claim Id */
            claim_id: string;
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Support
             * @default null
             */
            support: string;
        };
        /**
         * ClaimExistsResponse
         * @description Tigrbl v3 Claim exists schema
         */
        ClaimExistsResponse: {
            /** Claim Type */
            claim_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Record Id
             * @default null
             */
            record_id: string | null;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Ssot Claim Id
             * @default null
             */
            ssot_claim_id: string | null;
            /** Statement */
            statement: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * ClaimGroupByRequest
         * @description Tigrbl v3 Claim group_by schema
         */
        ClaimGroupByRequest: {
            /** Claim Type */
            claim_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Record Id
             * @default null
             */
            record_id: string | null;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Ssot Claim Id
             * @default null
             */
            ssot_claim_id: string | null;
            /** Statement */
            statement: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * ClaimGroupByResponse
         * @description Tigrbl v3 Claim group_by schema
         */
        ClaimGroupByResponse: {
            /** Claim Type */
            claim_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Record Id
             * @default null
             */
            record_id: string | null;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Ssot Claim Id
             * @default null
             */
            ssot_claim_id: string | null;
            /** Statement */
            statement: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /** CommitPoint */
        CommitPoint: {
            /** Count */
            count: number;
            /** Date */
            date: string;
        } & {
            [key: string]: unknown;
        };
        /**
         * DependencyCountResponse
         * @description Tigrbl v3 Dependency count schema
         */
        DependencyCountResponse: {
            /**
             * Completeness
             * @default null
             */
            completeness: string;
            /**
             * Evidence Type
             * @default null
             */
            evidence_type: string;
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
             * Requirement
             * @default null
             */
            requirement: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string | null;
            /** Source Id */
            source_id: string;
            /** Source Kind */
            source_kind: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Target Id */
            target_id: string;
            /** Target Kind */
            target_kind: string;
        };
        /**
         * DependencyExistsResponse
         * @description Tigrbl v3 Dependency exists schema
         */
        DependencyExistsResponse: {
            /**
             * Completeness
             * @default null
             */
            completeness: string;
            /**
             * Evidence Type
             * @default null
             */
            evidence_type: string;
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
             * Requirement
             * @default null
             */
            requirement: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string | null;
            /** Source Id */
            source_id: string;
            /** Source Kind */
            source_kind: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Target Id */
            target_id: string;
            /** Target Kind */
            target_kind: string;
        };
        /**
         * DependencyGroupByRequest
         * @description Tigrbl v3 Dependency group_by schema
         */
        DependencyGroupByRequest: {
            /**
             * Completeness
             * @default null
             */
            completeness: string;
            /**
             * Evidence Type
             * @default null
             */
            evidence_type: string;
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
             * Requirement
             * @default null
             */
            requirement: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string | null;
            /** Source Id */
            source_id: string;
            /** Source Kind */
            source_kind: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Target Id */
            target_id: string;
            /** Target Kind */
            target_kind: string;
        };
        /**
         * DependencyGroupByResponse
         * @description Tigrbl v3 Dependency group_by schema
         */
        DependencyGroupByResponse: {
            /**
             * Completeness
             * @default null
             */
            completeness: string;
            /**
             * Evidence Type
             * @default null
             */
            evidence_type: string;
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
             * Requirement
             * @default null
             */
            requirement: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string | null;
            /** Source Id */
            source_id: string;
            /** Source Kind */
            source_kind: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Target Id */
            target_id: string;
            /** Target Kind */
            target_kind: string;
        };
        /**
         * DeploymentCountResponse
         * @description Tigrbl v3 Deployment count schema
         */
        DeploymentCountResponse: {
            /**
             * Environment
             * @default null
             */
            environment: string | null;
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
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /** Record Id */
            record_id: string;
            /** Url */
            url: string;
        };
        /**
         * DeploymentExistsResponse
         * @description Tigrbl v3 Deployment exists schema
         */
        DeploymentExistsResponse: {
            /**
             * Environment
             * @default null
             */
            environment: string | null;
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
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /** Record Id */
            record_id: string;
            /** Url */
            url: string;
        };
        /**
         * DeploymentGroupByRequest
         * @description Tigrbl v3 Deployment group_by schema
         */
        DeploymentGroupByRequest: {
            /**
             * Environment
             * @default null
             */
            environment: string | null;
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
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /** Record Id */
            record_id: string;
            /** Url */
            url: string;
        };
        /**
         * DeploymentGroupByResponse
         * @description Tigrbl v3 Deployment group_by schema
         */
        DeploymentGroupByResponse: {
            /**
             * Environment
             * @default null
             */
            environment: string | null;
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
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /** Record Id */
            record_id: string;
            /** Url */
            url: string;
        };
        /**
         * EntityAliasCountResponse
         * @description Tigrbl v3 EntityAlias count schema
         */
        EntityAliasCountResponse: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /** Entity Id */
            entity_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
        };
        /**
         * EntityAliasExistsResponse
         * @description Tigrbl v3 EntityAlias exists schema
         */
        EntityAliasExistsResponse: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /** Entity Id */
            entity_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
        };
        /**
         * EntityAliasGroupByRequest
         * @description Tigrbl v3 EntityAlias group_by schema
         */
        EntityAliasGroupByRequest: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /** Entity Id */
            entity_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
        };
        /**
         * EntityAliasGroupByResponse
         * @description Tigrbl v3 EntityAlias group_by schema
         */
        EntityAliasGroupByResponse: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /** Entity Id */
            entity_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
        };
        /**
         * EntityRelationshipCountResponse
         * @description Tigrbl v3 EntityRelationship count schema
         */
        EntityRelationshipCountResponse: {
            /**
             * Confidence
             * @default null
             */
            confidence: string;
            /** Evidence Type */
            evidence_type: string;
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
            /** Relationship Type */
            relationship_type: string;
            /**
             * Role
             * @default null
             */
            role: string | null;
            /** Source Entity Id */
            source_entity_id: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Status
             * @default null
             */
            status: string;
            /** Target Entity Id */
            target_entity_id: string;
        };
        /**
         * EntityRelationshipExistsResponse
         * @description Tigrbl v3 EntityRelationship exists schema
         */
        EntityRelationshipExistsResponse: {
            /**
             * Confidence
             * @default null
             */
            confidence: string;
            /** Evidence Type */
            evidence_type: string;
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
            /** Relationship Type */
            relationship_type: string;
            /**
             * Role
             * @default null
             */
            role: string | null;
            /** Source Entity Id */
            source_entity_id: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Status
             * @default null
             */
            status: string;
            /** Target Entity Id */
            target_entity_id: string;
        };
        /**
         * EntityRelationshipGroupByRequest
         * @description Tigrbl v3 EntityRelationship group_by schema
         */
        EntityRelationshipGroupByRequest: {
            /**
             * Confidence
             * @default null
             */
            confidence: string;
            /** Evidence Type */
            evidence_type: string;
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
            /** Relationship Type */
            relationship_type: string;
            /**
             * Role
             * @default null
             */
            role: string | null;
            /** Source Entity Id */
            source_entity_id: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Status
             * @default null
             */
            status: string;
            /** Target Entity Id */
            target_entity_id: string;
        };
        /**
         * EntityRelationshipGroupByResponse
         * @description Tigrbl v3 EntityRelationship group_by schema
         */
        EntityRelationshipGroupByResponse: {
            /**
             * Confidence
             * @default null
             */
            confidence: string;
            /** Evidence Type */
            evidence_type: string;
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
            /** Relationship Type */
            relationship_type: string;
            /**
             * Role
             * @default null
             */
            role: string | null;
            /** Source Entity Id */
            source_entity_id: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Status
             * @default null
             */
            status: string;
            /** Target Entity Id */
            target_entity_id: string;
        };
        /**
         * EntityTypeCountResponse
         * @description Tigrbl v3 EntityType count schema
         */
        EntityTypeCountResponse: {
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
            /** Label */
            label: string;
            /** Semantic Class */
            semantic_class: string;
        };
        /**
         * EntityTypeExistsResponse
         * @description Tigrbl v3 EntityType exists schema
         */
        EntityTypeExistsResponse: {
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
            /** Label */
            label: string;
            /** Semantic Class */
            semantic_class: string;
        };
        /**
         * EntityTypeGroupByRequest
         * @description Tigrbl v3 EntityType group_by schema
         */
        EntityTypeGroupByRequest: {
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
            /** Label */
            label: string;
            /** Semantic Class */
            semantic_class: string;
        };
        /**
         * EntityTypeGroupByResponse
         * @description Tigrbl v3 EntityType group_by schema
         */
        EntityTypeGroupByResponse: {
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
            /** Label */
            label: string;
            /** Semantic Class */
            semantic_class: string;
        };
        /**
         * EntityUrlCountResponse
         * @description Tigrbl v3 EntityUrl count schema
         */
        EntityUrlCountResponse: {
            /** Entity Id */
            entity_id: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Url */
            url: string;
            /** Url Role */
            url_role: string;
        };
        /**
         * EntityUrlExistsResponse
         * @description Tigrbl v3 EntityUrl exists schema
         */
        EntityUrlExistsResponse: {
            /** Entity Id */
            entity_id: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Url */
            url: string;
            /** Url Role */
            url_role: string;
        };
        /**
         * EntityUrlGroupByRequest
         * @description Tigrbl v3 EntityUrl group_by schema
         */
        EntityUrlGroupByRequest: {
            /** Entity Id */
            entity_id: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Url */
            url: string;
            /** Url Role */
            url_role: string;
        };
        /**
         * EntityUrlGroupByResponse
         * @description Tigrbl v3 EntityUrl group_by schema
         */
        EntityUrlGroupByResponse: {
            /** Entity Id */
            entity_id: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Label
             * @default null
             */
            label: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Url */
            url: string;
            /** Url Role */
            url_role: string;
        };
        /**
         * EvidenceCountResponse
         * @description Tigrbl v3 Evidence count schema
         */
        EvidenceCountResponse: {
            /** Evidence Type */
            evidence_type: string;
            /**
             * Excerpt
             * @default null
             */
            excerpt: string | null;
            /**
             * Expires At
             * @default null
             */
            expires_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Locator
             * @default null
             */
            locator: string | null;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Source Url */
            source_url: string;
            /** Title */
            title: string;
        };
        /**
         * EvidenceExistsResponse
         * @description Tigrbl v3 Evidence exists schema
         */
        EvidenceExistsResponse: {
            /** Evidence Type */
            evidence_type: string;
            /**
             * Excerpt
             * @default null
             */
            excerpt: string | null;
            /**
             * Expires At
             * @default null
             */
            expires_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Locator
             * @default null
             */
            locator: string | null;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Source Url */
            source_url: string;
            /** Title */
            title: string;
        };
        /**
         * EvidenceGroupByRequest
         * @description Tigrbl v3 Evidence group_by schema
         */
        EvidenceGroupByRequest: {
            /** Evidence Type */
            evidence_type: string;
            /**
             * Excerpt
             * @default null
             */
            excerpt: string | null;
            /**
             * Expires At
             * @default null
             */
            expires_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Locator
             * @default null
             */
            locator: string | null;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Source Url */
            source_url: string;
            /** Title */
            title: string;
        };
        /**
         * EvidenceGroupByResponse
         * @description Tigrbl v3 Evidence group_by schema
         */
        EvidenceGroupByResponse: {
            /** Evidence Type */
            evidence_type: string;
            /**
             * Excerpt
             * @default null
             */
            excerpt: string | null;
            /**
             * Expires At
             * @default null
             */
            expires_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Locator
             * @default null
             */
            locator: string | null;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Source Url */
            source_url: string;
            /** Title */
            title: string;
        };
        /**
         * FeatureCountResponse
         * @description Tigrbl v3 Feature count schema
         */
        FeatureCountResponse: {
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
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /**
             * Ssot Feature Id
             * @default null
             */
            ssot_feature_id: string | null;
        };
        /**
         * FeatureExistsResponse
         * @description Tigrbl v3 Feature exists schema
         */
        FeatureExistsResponse: {
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
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /**
             * Ssot Feature Id
             * @default null
             */
            ssot_feature_id: string | null;
        };
        /**
         * FeatureGroupByRequest
         * @description Tigrbl v3 Feature group_by schema
         */
        FeatureGroupByRequest: {
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
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /**
             * Ssot Feature Id
             * @default null
             */
            ssot_feature_id: string | null;
        };
        /**
         * FeatureGroupByResponse
         * @description Tigrbl v3 Feature group_by schema
         */
        FeatureGroupByResponse: {
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
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /**
             * Ssot Feature Id
             * @default null
             */
            ssot_feature_id: string | null;
        };
        /**
         * LegalEvidenceCountResponse
         * @description Tigrbl v3 LegalEvidence count schema
         */
        LegalEvidenceCountResponse: {
            /** Evidence Kind */
            evidence_kind: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Expression
             * @default null
             */
            expression: string | null;
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
            /**
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string;
            /** Subject Id */
            subject_id: string;
            /** Subject Kind */
            subject_kind: string;
            /** Url */
            url: string;
        };
        /**
         * LegalEvidenceExistsResponse
         * @description Tigrbl v3 LegalEvidence exists schema
         */
        LegalEvidenceExistsResponse: {
            /** Evidence Kind */
            evidence_kind: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Expression
             * @default null
             */
            expression: string | null;
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
            /**
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string;
            /** Subject Id */
            subject_id: string;
            /** Subject Kind */
            subject_kind: string;
            /** Url */
            url: string;
        };
        /**
         * LegalEvidenceGroupByRequest
         * @description Tigrbl v3 LegalEvidence group_by schema
         */
        LegalEvidenceGroupByRequest: {
            /** Evidence Kind */
            evidence_kind: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Expression
             * @default null
             */
            expression: string | null;
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
            /**
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string;
            /** Subject Id */
            subject_id: string;
            /** Subject Kind */
            subject_kind: string;
            /** Url */
            url: string;
        };
        /**
         * LegalEvidenceGroupByResponse
         * @description Tigrbl v3 LegalEvidence group_by schema
         */
        LegalEvidenceGroupByResponse: {
            /** Evidence Kind */
            evidence_kind: string;
            /** Evidence Type */
            evidence_type: string;
            /**
             * Expression
             * @default null
             */
            expression: string | null;
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
            /**
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Scope
             * @default null
             */
            scope: string;
            /** Subject Id */
            subject_id: string;
            /** Subject Kind */
            subject_kind: string;
            /** Url */
            url: string;
        };
        /**
         * LimitationCountResponse
         * @description Tigrbl v3 Limitation count schema
         */
        LimitationCountResponse: {
            /** Description */
            description: string;
            /**
             * Evidence Id
             * @default null
             */
            evidence_id: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Severity
             * @default null
             */
            severity: string | null;
            /** Title */
            title: string;
        };
        /**
         * LimitationExistsResponse
         * @description Tigrbl v3 Limitation exists schema
         */
        LimitationExistsResponse: {
            /** Description */
            description: string;
            /**
             * Evidence Id
             * @default null
             */
            evidence_id: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Severity
             * @default null
             */
            severity: string | null;
            /** Title */
            title: string;
        };
        /**
         * LimitationGroupByRequest
         * @description Tigrbl v3 Limitation group_by schema
         */
        LimitationGroupByRequest: {
            /** Description */
            description: string;
            /**
             * Evidence Id
             * @default null
             */
            evidence_id: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Severity
             * @default null
             */
            severity: string | null;
            /** Title */
            title: string;
        };
        /**
         * LimitationGroupByResponse
         * @description Tigrbl v3 Limitation group_by schema
         */
        LimitationGroupByResponse: {
            /** Description */
            description: string;
            /**
             * Evidence Id
             * @default null
             */
            evidence_id: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Reviewed At
             * @default null
             */
            reviewed_at: string | null;
            /**
             * Severity
             * @default null
             */
            severity: string | null;
            /** Title */
            title: string;
        };
        /** MetricPoint */
        MetricPoint: {
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Value */
            value: number;
        } & {
            [key: string]: unknown;
        };
        /**
         * OrganizationCountResponse
         * @description Tigrbl v3 Organization count schema
         */
        OrganizationCountResponse: {
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
         * OrganizationExistsResponse
         * @description Tigrbl v3 Organization exists schema
         */
        OrganizationExistsResponse: {
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
         * OrganizationGroupByRequest
         * @description Tigrbl v3 Organization group_by schema
         */
        OrganizationGroupByRequest: {
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
         * OrganizationGroupByResponse
         * @description Tigrbl v3 Organization group_by schema
         */
        OrganizationGroupByResponse: {
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
         * PackageCountResponse
         * @description Tigrbl v3 Package count schema
         */
        PackageCountResponse: {
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
            /** Registry Url */
            registry_url: string;
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
         * PackageExistsResponse
         * @description Tigrbl v3 Package exists schema
         */
        PackageExistsResponse: {
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
            /** Registry Url */
            registry_url: string;
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
         * PackageGroupByRequest
         * @description Tigrbl v3 Package group_by schema
         */
        PackageGroupByRequest: {
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
            /** Registry Url */
            registry_url: string;
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
         * PackageGroupByResponse
         * @description Tigrbl v3 Package group_by schema
         */
        PackageGroupByResponse: {
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
            /** Registry Url */
            registry_url: string;
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
         * PackageRepositoryCountResponse
         * @description Tigrbl v3 PackageRepository count schema
         */
        PackageRepositoryCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /**
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * PackageRepositoryExistsResponse
         * @description Tigrbl v3 PackageRepository exists schema
         */
        PackageRepositoryExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /**
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * PackageRepositoryGroupByRequest
         * @description Tigrbl v3 PackageRepository group_by schema
         */
        PackageRepositoryGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /**
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * PackageRepositoryGroupByResponse
         * @description Tigrbl v3 PackageRepository group_by schema
         */
        PackageRepositoryGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /**
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /** PackageSummary */
        PackageSummary: {
            /**
             * Dependency Count
             * @default 0
             */
            dependency_count: number;
            /** Ecosystem */
            ecosystem: string;
            /** Id */
            id: string;
            /**
             * Latest Version
             * @default null
             */
            latest_version: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Package Kind */
            package_kind: string;
            /**
             * Publication Status
             * @default null
             */
            publication_status: string | null;
            /** Registry Url */
            registry_url: string;
            /**
             * Release Count
             * @default 0
             */
            release_count: number;
            /** Route */
            route: string;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
        } & {
            [key: string]: unknown;
        };
        /**
         * PackageTaxonomyCountResponse
         * @description Tigrbl v3 PackageTaxonomy count schema
         */
        PackageTaxonomyCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * PackageTaxonomyExistsResponse
         * @description Tigrbl v3 PackageTaxonomy exists schema
         */
        PackageTaxonomyExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * PackageTaxonomyGroupByRequest
         * @description Tigrbl v3 PackageTaxonomy group_by schema
         */
        PackageTaxonomyGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * PackageTaxonomyGroupByResponse
         * @description Tigrbl v3 PackageTaxonomy group_by schema
         */
        PackageTaxonomyGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * PersonCountResponse
         * @description Tigrbl v3 Person count schema
         */
        PersonCountResponse: {
            /**
             * Handle
             * @default null
             */
            handle: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
        };
        /**
         * PersonExistsResponse
         * @description Tigrbl v3 Person exists schema
         */
        PersonExistsResponse: {
            /**
             * Handle
             * @default null
             */
            handle: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
        };
        /**
         * PersonGroupByRequest
         * @description Tigrbl v3 Person group_by schema
         */
        PersonGroupByRequest: {
            /**
             * Handle
             * @default null
             */
            handle: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
        };
        /**
         * PersonGroupByResponse
         * @description Tigrbl v3 Person group_by schema
         */
        PersonGroupByResponse: {
            /**
             * Handle
             * @default null
             */
            handle: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
        };
        /**
         * RecordAliasCountResponse
         * @description Tigrbl v3 RecordAlias count schema
         */
        RecordAliasCountResponse: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
        };
        /**
         * RecordAliasExistsResponse
         * @description Tigrbl v3 RecordAlias exists schema
         */
        RecordAliasExistsResponse: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
        };
        /**
         * RecordAliasGroupByRequest
         * @description Tigrbl v3 RecordAlias group_by schema
         */
        RecordAliasGroupByRequest: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
        };
        /**
         * RecordAliasGroupByResponse
         * @description Tigrbl v3 RecordAlias group_by schema
         */
        RecordAliasGroupByResponse: {
            /** Alias */
            alias: string;
            /** Alias Kind */
            alias_kind: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
        };
        /**
         * RecordAuthorCountResponse
         * @description Tigrbl v3 RecordAuthor count schema
         */
        RecordAuthorCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Person Id */
            person_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordAuthorExistsResponse
         * @description Tigrbl v3 RecordAuthor exists schema
         */
        RecordAuthorExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Person Id */
            person_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordAuthorGroupByRequest
         * @description Tigrbl v3 RecordAuthor group_by schema
         */
        RecordAuthorGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Person Id */
            person_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordAuthorGroupByResponse
         * @description Tigrbl v3 RecordAuthor group_by schema
         */
        RecordAuthorGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Person Id */
            person_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordCountResponse
         * @description Tigrbl v3 Record count schema
         */
        RecordCountResponse: {
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
             * Content
             * @default null
             */
            content: {
                [key: string]: unknown;
            } | null;
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
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Record Type */
            record_type: string;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /** Title */
            title: string;
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
         * RecordExistsResponse
         * @description Tigrbl v3 Record exists schema
         */
        RecordExistsResponse: {
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
             * Content
             * @default null
             */
            content: {
                [key: string]: unknown;
            } | null;
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
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Record Type */
            record_type: string;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /** Title */
            title: string;
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
         * RecordFeatureCountResponse
         * @description Tigrbl v3 RecordFeature count schema
         */
        RecordFeatureCountResponse: {
            /**
             * Claim Id
             * @default null
             */
            claim_id: string | null;
            /** Feature Id */
            feature_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * RecordFeatureExistsResponse
         * @description Tigrbl v3 RecordFeature exists schema
         */
        RecordFeatureExistsResponse: {
            /**
             * Claim Id
             * @default null
             */
            claim_id: string | null;
            /** Feature Id */
            feature_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * RecordFeatureGroupByRequest
         * @description Tigrbl v3 RecordFeature group_by schema
         */
        RecordFeatureGroupByRequest: {
            /**
             * Claim Id
             * @default null
             */
            claim_id: string | null;
            /** Feature Id */
            feature_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * RecordFeatureGroupByResponse
         * @description Tigrbl v3 RecordFeature group_by schema
         */
        RecordFeatureGroupByResponse: {
            /**
             * Claim Id
             * @default null
             */
            claim_id: string | null;
            /** Feature Id */
            feature_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /**
             * Status
             * @default null
             */
            status: string;
        };
        /**
         * RecordGroupByRequest
         * @description Tigrbl v3 Record group_by schema
         */
        RecordGroupByRequest: {
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
             * Content
             * @default null
             */
            content: {
                [key: string]: unknown;
            } | null;
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
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Record Type */
            record_type: string;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /** Title */
            title: string;
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
         * RecordGroupByResponse
         * @description Tigrbl v3 Record group_by schema
         */
        RecordGroupByResponse: {
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
             * Content
             * @default null
             */
            content: {
                [key: string]: unknown;
            } | null;
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
            /** Organization Id */
            organization_id: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Record Type */
            record_type: string;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /** Title */
            title: string;
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
         * RecordPackageCountResponse
         * @description Tigrbl v3 RecordPackage count schema
         */
        RecordPackageCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordPackageExistsResponse
         * @description Tigrbl v3 RecordPackage exists schema
         */
        RecordPackageExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordPackageGroupByRequest
         * @description Tigrbl v3 RecordPackage group_by schema
         */
        RecordPackageGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordPackageGroupByResponse
         * @description Tigrbl v3 RecordPackage group_by schema
         */
        RecordPackageGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Package Id */
            package_id: string;
            /** Record Id */
            record_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordRelationCountResponse
         * @description Tigrbl v3 RecordRelation count schema
         */
        RecordRelationCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Note
             * @default null
             */
            note: string | null;
            /** Relation Type */
            relation_type: string;
            /** Source Record Id */
            source_record_id: string;
            /** Target Record Id */
            target_record_id: string;
        };
        /**
         * RecordRelationExistsResponse
         * @description Tigrbl v3 RecordRelation exists schema
         */
        RecordRelationExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Note
             * @default null
             */
            note: string | null;
            /** Relation Type */
            relation_type: string;
            /** Source Record Id */
            source_record_id: string;
            /** Target Record Id */
            target_record_id: string;
        };
        /**
         * RecordRelationGroupByRequest
         * @description Tigrbl v3 RecordRelation group_by schema
         */
        RecordRelationGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Note
             * @default null
             */
            note: string | null;
            /** Relation Type */
            relation_type: string;
            /** Source Record Id */
            source_record_id: string;
            /** Target Record Id */
            target_record_id: string;
        };
        /**
         * RecordRelationGroupByResponse
         * @description Tigrbl v3 RecordRelation group_by schema
         */
        RecordRelationGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Note
             * @default null
             */
            note: string | null;
            /** Relation Type */
            relation_type: string;
            /** Source Record Id */
            source_record_id: string;
            /** Target Record Id */
            target_record_id: string;
        };
        /**
         * RecordRepositoryCountResponse
         * @description Tigrbl v3 RecordRepository count schema
         */
        RecordRepositoryCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordRepositoryExistsResponse
         * @description Tigrbl v3 RecordRepository exists schema
         */
        RecordRepositoryExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordRepositoryGroupByRequest
         * @description Tigrbl v3 RecordRepository group_by schema
         */
        RecordRepositoryGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordRepositoryGroupByResponse
         * @description Tigrbl v3 RecordRepository group_by schema
         */
        RecordRepositoryGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Repository Id */
            repository_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * RecordResourceCountResponse
         * @description Tigrbl v3 RecordResource count schema
         */
        RecordResourceCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Resource Id */
            resource_id: string;
            /** Role */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RecordResourceExistsResponse
         * @description Tigrbl v3 RecordResource exists schema
         */
        RecordResourceExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Resource Id */
            resource_id: string;
            /** Role */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RecordResourceGroupByRequest
         * @description Tigrbl v3 RecordResource group_by schema
         */
        RecordResourceGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Resource Id */
            resource_id: string;
            /** Role */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RecordResourceGroupByResponse
         * @description Tigrbl v3 RecordResource group_by schema
         */
        RecordResourceGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Resource Id */
            resource_id: string;
            /** Role */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
        };
        /**
         * RecordTaxonomyCountResponse
         * @description Tigrbl v3 RecordTaxonomy count schema
         */
        RecordTaxonomyCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * RecordTaxonomyExistsResponse
         * @description Tigrbl v3 RecordTaxonomy exists schema
         */
        RecordTaxonomyExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * RecordTaxonomyGroupByRequest
         * @description Tigrbl v3 RecordTaxonomy group_by schema
         */
        RecordTaxonomyGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * RecordTaxonomyGroupByResponse
         * @description Tigrbl v3 RecordTaxonomy group_by schema
         */
        RecordTaxonomyGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Record Id */
            record_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * ReleaseCountResponse
         * @description Tigrbl v3 Release count schema
         */
        ReleaseCountResponse: {
            /**
             * Downloads
             * @default null
             */
            downloads: number | string | null;
            /**
             * Draft
             * @default null
             */
            draft: boolean;
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
             * Package Id
             * @default null
             */
            package_id: string | null;
            /**
             * Prerelease
             * @default null
             */
            prerelease: boolean;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Release Kind */
            release_kind: string;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /** Url */
            url: string;
            /** Version */
            version: string;
        };
        /**
         * ReleaseExistsResponse
         * @description Tigrbl v3 Release exists schema
         */
        ReleaseExistsResponse: {
            /**
             * Downloads
             * @default null
             */
            downloads: number | string | null;
            /**
             * Draft
             * @default null
             */
            draft: boolean;
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
             * Package Id
             * @default null
             */
            package_id: string | null;
            /**
             * Prerelease
             * @default null
             */
            prerelease: boolean;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Release Kind */
            release_kind: string;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /** Url */
            url: string;
            /** Version */
            version: string;
        };
        /**
         * ReleaseGroupByRequest
         * @description Tigrbl v3 Release group_by schema
         */
        ReleaseGroupByRequest: {
            /**
             * Downloads
             * @default null
             */
            downloads: number | string | null;
            /**
             * Draft
             * @default null
             */
            draft: boolean;
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
             * Package Id
             * @default null
             */
            package_id: string | null;
            /**
             * Prerelease
             * @default null
             */
            prerelease: boolean;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Release Kind */
            release_kind: string;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /** Url */
            url: string;
            /** Version */
            version: string;
        };
        /**
         * ReleaseGroupByResponse
         * @description Tigrbl v3 Release group_by schema
         */
        ReleaseGroupByResponse: {
            /**
             * Downloads
             * @default null
             */
            downloads: number | string | null;
            /**
             * Draft
             * @default null
             */
            draft: boolean;
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
             * Package Id
             * @default null
             */
            package_id: string | null;
            /**
             * Prerelease
             * @default null
             */
            prerelease: boolean;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Release Kind */
            release_kind: string;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /** Url */
            url: string;
            /** Version */
            version: string;
        };
        /**
         * RepositoryContributorCountResponse
         * @description Tigrbl v3 RepositoryContributor count schema
         */
        RepositoryContributorCountResponse: {
            /**
             * Contributions
             * @default null
             */
            contributions: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Login */
            login: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryContributorExistsResponse
         * @description Tigrbl v3 RepositoryContributor exists schema
         */
        RepositoryContributorExistsResponse: {
            /**
             * Contributions
             * @default null
             */
            contributions: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Login */
            login: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryContributorGroupByRequest
         * @description Tigrbl v3 RepositoryContributor group_by schema
         */
        RepositoryContributorGroupByRequest: {
            /**
             * Contributions
             * @default null
             */
            contributions: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Login */
            login: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryContributorGroupByResponse
         * @description Tigrbl v3 RepositoryContributor group_by schema
         */
        RepositoryContributorGroupByResponse: {
            /**
             * Contributions
             * @default null
             */
            contributions: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Login */
            login: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Profile Url
             * @default null
             */
            profile_url: string | null;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryCountResponse
         * @description Tigrbl v3 Repository count schema
         */
        RepositoryCountResponse: {
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
         * RepositoryExistsResponse
         * @description Tigrbl v3 Repository exists schema
         */
        RepositoryExistsResponse: {
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
         * RepositoryGroupByRequest
         * @description Tigrbl v3 Repository group_by schema
         */
        RepositoryGroupByRequest: {
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
         * RepositoryGroupByResponse
         * @description Tigrbl v3 Repository group_by schema
         */
        RepositoryGroupByResponse: {
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
         * RepositoryLanguageCountResponse
         * @description Tigrbl v3 RepositoryLanguage count schema
         */
        RepositoryLanguageCountResponse: {
            /**
             * Bytes
             * @default null
             */
            bytes: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Language */
            language: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Percentage
             * @default null
             */
            percentage: number | string;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryLanguageExistsResponse
         * @description Tigrbl v3 RepositoryLanguage exists schema
         */
        RepositoryLanguageExistsResponse: {
            /**
             * Bytes
             * @default null
             */
            bytes: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Language */
            language: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Percentage
             * @default null
             */
            percentage: number | string;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryLanguageGroupByRequest
         * @description Tigrbl v3 RepositoryLanguage group_by schema
         */
        RepositoryLanguageGroupByRequest: {
            /**
             * Bytes
             * @default null
             */
            bytes: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Language */
            language: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Percentage
             * @default null
             */
            percentage: number | string;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositoryLanguageGroupByResponse
         * @description Tigrbl v3 RepositoryLanguage group_by schema
         */
        RepositoryLanguageGroupByResponse: {
            /**
             * Bytes
             * @default null
             */
            bytes: number;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Language */
            language: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /**
             * Percentage
             * @default null
             */
            percentage: number | string;
            /** Repository Id */
            repository_id: string;
        };
        /**
         * RepositorySsotInventoryCountResponse
         * @description Tigrbl v3 RepositorySsotInventory count schema
         */
        RepositorySsotInventoryCountResponse: {
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
         * RepositorySsotInventoryExistsResponse
         * @description Tigrbl v3 RepositorySsotInventory exists schema
         */
        RepositorySsotInventoryExistsResponse: {
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
         * RepositorySsotInventoryGroupByRequest
         * @description Tigrbl v3 RepositorySsotInventory group_by schema
         */
        RepositorySsotInventoryGroupByRequest: {
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
         * RepositorySsotInventoryGroupByResponse
         * @description Tigrbl v3 RepositorySsotInventory group_by schema
         */
        RepositorySsotInventoryGroupByResponse: {
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
         * RepositorySsotRegistryCountResponse
         * @description Tigrbl v3 RepositorySsotRegistry count schema
         */
        RepositorySsotRegistryCountResponse: {
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
         * RepositorySsotRegistryExistsResponse
         * @description Tigrbl v3 RepositorySsotRegistry exists schema
         */
        RepositorySsotRegistryExistsResponse: {
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
         * RepositorySsotRegistryGroupByRequest
         * @description Tigrbl v3 RepositorySsotRegistry group_by schema
         */
        RepositorySsotRegistryGroupByRequest: {
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
         * RepositorySsotRegistryGroupByResponse
         * @description Tigrbl v3 RepositorySsotRegistry group_by schema
         */
        RepositorySsotRegistryGroupByResponse: {
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
        /** RepositorySummary */
        RepositorySummary: {
            /** Commit Activity */
            commit_activity?: components["schemas"]["CommitPoint"][];
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** History */
            history?: {
                [key: string]: components["schemas"]["MetricPoint"][];
            };
            /** Id */
            id: string;
            /** Metrics */
            metrics?: {
                [key: string]: number;
            };
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Owner */
            owner: string;
            /**
             * Package Count
             * @default 0
             */
            package_count: number;
            /**
             * Release Count
             * @default 0
             */
            release_count: number;
            /**
             * Resource Count
             * @default 0
             */
            resource_count: number;
            /** Route */
            route: string;
            /** Url */
            url: string;
        } & {
            [key: string]: unknown;
        };
        /**
         * ResourceCountResponse
         * @description Tigrbl v3 Resource count schema
         */
        ResourceCountResponse: {
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
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /** Resource Type */
            resource_type: string;
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
         * ResourceEvidenceCountResponse
         * @description Tigrbl v3 ResourceEvidence count schema
         */
        ResourceEvidenceCountResponse: {
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceEvidenceExistsResponse
         * @description Tigrbl v3 ResourceEvidence exists schema
         */
        ResourceEvidenceExistsResponse: {
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceEvidenceGroupByRequest
         * @description Tigrbl v3 ResourceEvidence group_by schema
         */
        ResourceEvidenceGroupByRequest: {
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceEvidenceGroupByResponse
         * @description Tigrbl v3 ResourceEvidence group_by schema
         */
        ResourceEvidenceGroupByResponse: {
            /** Evidence Id */
            evidence_id: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceExistsResponse
         * @description Tigrbl v3 Resource exists schema
         */
        ResourceExistsResponse: {
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
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /** Resource Type */
            resource_type: string;
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
         * ResourceGroupByRequest
         * @description Tigrbl v3 Resource group_by schema
         */
        ResourceGroupByRequest: {
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
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /** Resource Type */
            resource_type: string;
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
         * ResourceGroupByResponse
         * @description Tigrbl v3 Resource group_by schema
         */
        ResourceGroupByResponse: {
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
             * Path
             * @default null
             */
            path: string | null;
            /**
             * Repository Id
             * @default null
             */
            repository_id: string | null;
            /** Resource Type */
            resource_type: string;
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
         * ResourceRepositoryCountResponse
         * @description Tigrbl v3 ResourceRepository count schema
         */
        ResourceRepositoryCountResponse: {
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
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceRepositoryExistsResponse
         * @description Tigrbl v3 ResourceRepository exists schema
         */
        ResourceRepositoryExistsResponse: {
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
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceRepositoryGroupByRequest
         * @description Tigrbl v3 ResourceRepository group_by schema
         */
        ResourceRepositoryGroupByRequest: {
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
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceRepositoryGroupByResponse
         * @description Tigrbl v3 ResourceRepository group_by schema
         */
        ResourceRepositoryGroupByResponse: {
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
             * Path
             * @default null
             */
            path: string | null;
            /** Repository Id */
            repository_id: string;
            /** Resource Id */
            resource_id: string;
            /**
             * Role
             * @default null
             */
            role: string;
        };
        /**
         * ResourceTaxonomyCountResponse
         * @description Tigrbl v3 ResourceTaxonomy count schema
         */
        ResourceTaxonomyCountResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * ResourceTaxonomyExistsResponse
         * @description Tigrbl v3 ResourceTaxonomy exists schema
         */
        ResourceTaxonomyExistsResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * ResourceTaxonomyGroupByRequest
         * @description Tigrbl v3 ResourceTaxonomy group_by schema
         */
        ResourceTaxonomyGroupByRequest: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * ResourceTaxonomyGroupByResponse
         * @description Tigrbl v3 ResourceTaxonomy group_by schema
         */
        ResourceTaxonomyGroupByResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Resource Id */
            resource_id: string;
            /** Taxonomy Id */
            taxonomy_id: string;
        };
        /**
         * ResourceTypeCountResponse
         * @description Tigrbl v3 ResourceType count schema
         */
        ResourceTypeCountResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Detail Schema Key
             * @default null
             */
            detail_schema_key: string | null;
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
            /** Label */
            label: string;
        };
        /**
         * ResourceTypeExistsResponse
         * @description Tigrbl v3 ResourceType exists schema
         */
        ResourceTypeExistsResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Detail Schema Key
             * @default null
             */
            detail_schema_key: string | null;
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
            /** Label */
            label: string;
        };
        /**
         * ResourceTypeGroupByRequest
         * @description Tigrbl v3 ResourceType group_by schema
         */
        ResourceTypeGroupByRequest: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Detail Schema Key
             * @default null
             */
            detail_schema_key: string | null;
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
            /** Label */
            label: string;
        };
        /**
         * ResourceTypeGroupByResponse
         * @description Tigrbl v3 ResourceType group_by schema
         */
        ResourceTypeGroupByResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Detail Schema Key
             * @default null
             */
            detail_schema_key: string | null;
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
            /** Label */
            label: string;
        };
        /**
         * TaxonomyCountResponse
         * @description Tigrbl v3 Taxonomy count schema
         */
        TaxonomyCountResponse: {
            /**
             * Category
             * @default null
             */
            category: string | null;
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
            /** Label */
            label: string;
            /** Slug */
            slug: string;
            /** Taxonomy Type */
            taxonomy_type: string;
        };
        /**
         * TaxonomyExistsResponse
         * @description Tigrbl v3 Taxonomy exists schema
         */
        TaxonomyExistsResponse: {
            /**
             * Category
             * @default null
             */
            category: string | null;
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
            /** Label */
            label: string;
            /** Slug */
            slug: string;
            /** Taxonomy Type */
            taxonomy_type: string;
        };
        /**
         * TaxonomyGroupByRequest
         * @description Tigrbl v3 Taxonomy group_by schema
         */
        TaxonomyGroupByRequest: {
            /**
             * Category
             * @default null
             */
            category: string | null;
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
            /** Label */
            label: string;
            /** Slug */
            slug: string;
            /** Taxonomy Type */
            taxonomy_type: string;
        };
        /**
         * TaxonomyGroupByResponse
         * @description Tigrbl v3 Taxonomy group_by schema
         */
        TaxonomyGroupByResponse: {
            /**
             * Category
             * @default null
             */
            category: string | null;
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
            /** Label */
            label: string;
            /** Slug */
            slug: string;
            /** Taxonomy Type */
            taxonomy_type: string;
        };
        /** TechnologySummary */
        TechnologySummary: {
            /**
             * Category
             * @default null
             */
            category: string | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** Id */
            id: string;
            /** Name */
            name: string;
            /**
             * Record Count
             * @default 0
             */
            record_count: number;
            /** Route */
            route: string;
            /** Slug */
            slug: string;
        } & {
            [key: string]: unknown;
        };
        /** TypedResourceSummary */
        TypedResourceSummary: {
            /** Id */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Repository Name
             * @default null
             */
            repository_name: string | null;
            /**
             * Repository Owner
             * @default null
             */
            repository_owner: string | null;
            /** Resource Type */
            resource_type: string;
            /** Route */
            route: string;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        } & {
            [key: string]: unknown;
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
    catalog: {
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
                content: {
                    "application/json": components["schemas"]["CatalogOverview"];
                };
            };
        };
    };
    catalog_packages: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                q?: string;
                ecosystem?: string;
                publication_status?: string;
                sort?: string;
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
                    "application/json": components["schemas"]["CatalogCollection"];
                };
            };
        };
    };
    catalog_package: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["CatalogMember"];
                };
            };
        };
    };
    catalog_release: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["CatalogMember"];
                };
            };
        };
    };
    catalog_repositories: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                q?: string;
                owner?: string;
                sort?: string;
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
                    "application/json": components["schemas"]["CatalogCollection"];
                };
            };
        };
    };
    catalog_repository: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["CatalogMember"];
                };
            };
        };
    };
    catalog_resources: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                q?: string;
                resource_type?: string;
                repository_owner?: string;
                sort?: string;
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
                    "application/json": components["schemas"]["CatalogCollection"];
                };
            };
        };
    };
    catalog_resource: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["CatalogMember"];
                };
            };
        };
    };
    catalog_technologies: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                q?: string;
                sort?: string;
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
                    "application/json": components["schemas"]["CatalogCollection"];
                };
            };
        };
    };
    catalog_technology: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["CatalogMember"];
                };
            };
        };
    };
    entities: {
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
    entity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
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
                content?: never;
            };
        };
    };
    insights: {
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
    insight: {
        parameters: {
            query?: never;
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
                content?: never;
            };
        };
    };
    organization: {
        parameters: {
            query?: never;
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
                content?: never;
            };
        };
    };
    portfolio: {
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
    portfolio_record: {
        parameters: {
            query?: never;
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
                content?: never;
            };
        };
    };
    products: {
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
    product: {
        parameters: {
            query?: never;
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
                content?: never;
            };
        };
    };
    repository_metrics: {
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
    services: {
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
    service: {
        parameters: {
            query?: never;
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
                content?: never;
            };
        };
    };
    solutions: {
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
    solution: {
        parameters: {
            query?: never;
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
                content?: never;
            };
        };
    };
    "CatalogEntity.count": {
        parameters: {
            query?: {
                id?: string;
                entity_type_id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                canonical_url?: string;
                source_table?: string;
                source_id?: string;
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
                    "application/json": components["schemas"]["CatalogEntityCountResponse"];
                };
            };
        };
    };
    "CatalogEntity.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CatalogEntityGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogEntityGroupByResponse"];
                };
            };
        };
    };
    "CatalogEntity.exists": {
        parameters: {
            query?: {
                id?: string;
                entity_type_id?: string;
                organization_id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                canonical_url?: string;
                source_table?: string;
                source_id?: string;
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
                    "application/json": components["schemas"]["CatalogEntityExistsResponse"];
                };
            };
        };
    };
    "Claim.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                claim_type?: string;
                statement?: string;
                status?: string;
                ssot_claim_id?: string;
                reviewed_at?: string;
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
                    "application/json": components["schemas"]["ClaimCountResponse"];
                };
            };
        };
    };
    "Claim.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClaimGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimGroupByResponse"];
                };
            };
        };
    };
    "Claim.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                claim_type?: string;
                statement?: string;
                status?: string;
                ssot_claim_id?: string;
                reviewed_at?: string;
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
                    "application/json": components["schemas"]["ClaimExistsResponse"];
                };
            };
        };
    };
    "ClaimEvidence.count": {
        parameters: {
            query?: {
                id?: string;
                claim_id?: string;
                evidence_id?: string;
                support?: string;
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
                    "application/json": components["schemas"]["ClaimEvidenceCountResponse"];
                };
            };
        };
    };
    "ClaimEvidence.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClaimEvidenceGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimEvidenceGroupByResponse"];
                };
            };
        };
    };
    "ClaimEvidence.exists": {
        parameters: {
            query?: {
                id?: string;
                claim_id?: string;
                evidence_id?: string;
                support?: string;
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
                    "application/json": components["schemas"]["ClaimEvidenceExistsResponse"];
                };
            };
        };
    };
    "Dependency.count": {
        parameters: {
            query?: {
                id?: string;
                source_kind?: string;
                source_id?: string;
                target_kind?: string;
                target_id?: string;
                requirement?: string;
                scope?: string;
                evidence_type?: string;
                source_url?: string;
                completeness?: string;
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
                    "application/json": components["schemas"]["DependencyCountResponse"];
                };
            };
        };
    };
    "Dependency.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DependencyGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DependencyGroupByResponse"];
                };
            };
        };
    };
    "Dependency.exists": {
        parameters: {
            query?: {
                id?: string;
                source_kind?: string;
                source_id?: string;
                target_kind?: string;
                target_id?: string;
                requirement?: string;
                scope?: string;
                evidence_type?: string;
                source_url?: string;
                completeness?: string;
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
                    "application/json": components["schemas"]["DependencyExistsResponse"];
                };
            };
        };
    };
    "Deployment.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                name?: string;
                url?: string;
                environment?: string;
                reachability?: string;
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
                    "application/json": components["schemas"]["DeploymentCountResponse"];
                };
            };
        };
    };
    "Deployment.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeploymentGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeploymentGroupByResponse"];
                };
            };
        };
    };
    "Deployment.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                name?: string;
                url?: string;
                environment?: string;
                reachability?: string;
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
                    "application/json": components["schemas"]["DeploymentExistsResponse"];
                };
            };
        };
    };
    "EntityAlias.count": {
        parameters: {
            query?: {
                id?: string;
                entity_id?: string;
                alias_kind?: string;
                alias?: string;
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
                    "application/json": components["schemas"]["EntityAliasCountResponse"];
                };
            };
        };
    };
    "EntityAlias.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EntityAliasGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityAliasGroupByResponse"];
                };
            };
        };
    };
    "EntityAlias.exists": {
        parameters: {
            query?: {
                id?: string;
                entity_id?: string;
                alias_kind?: string;
                alias?: string;
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
                    "application/json": components["schemas"]["EntityAliasExistsResponse"];
                };
            };
        };
    };
    "EntityRelationship.count": {
        parameters: {
            query?: {
                id?: string;
                source_entity_id?: string;
                target_entity_id?: string;
                relationship_type?: string;
                role?: string;
                evidence_type?: string;
                source_url?: string;
                confidence?: string;
                status?: string;
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
                    "application/json": components["schemas"]["EntityRelationshipCountResponse"];
                };
            };
        };
    };
    "EntityRelationship.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EntityRelationshipGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityRelationshipGroupByResponse"];
                };
            };
        };
    };
    "EntityRelationship.exists": {
        parameters: {
            query?: {
                id?: string;
                source_entity_id?: string;
                target_entity_id?: string;
                relationship_type?: string;
                role?: string;
                evidence_type?: string;
                source_url?: string;
                confidence?: string;
                status?: string;
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
                    "application/json": components["schemas"]["EntityRelationshipExistsResponse"];
                };
            };
        };
    };
    "EntityType.count": {
        parameters: {
            query?: {
                id?: string;
                label?: string;
                semantic_class?: string;
                description?: string;
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
                    "application/json": components["schemas"]["EntityTypeCountResponse"];
                };
            };
        };
    };
    "EntityType.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EntityTypeGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityTypeGroupByResponse"];
                };
            };
        };
    };
    "EntityType.exists": {
        parameters: {
            query?: {
                id?: string;
                label?: string;
                semantic_class?: string;
                description?: string;
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
                    "application/json": components["schemas"]["EntityTypeExistsResponse"];
                };
            };
        };
    };
    "EntityUrl.count": {
        parameters: {
            query?: {
                id?: string;
                entity_id?: string;
                url_role?: string;
                url?: string;
                label?: string;
                evidence_type?: string;
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
                    "application/json": components["schemas"]["EntityUrlCountResponse"];
                };
            };
        };
    };
    "EntityUrl.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EntityUrlGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityUrlGroupByResponse"];
                };
            };
        };
    };
    "EntityUrl.exists": {
        parameters: {
            query?: {
                id?: string;
                entity_id?: string;
                url_role?: string;
                url?: string;
                label?: string;
                evidence_type?: string;
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
                    "application/json": components["schemas"]["EntityUrlExistsResponse"];
                };
            };
        };
    };
    "Evidence.count": {
        parameters: {
            query?: {
                id?: string;
                evidence_type?: string;
                title?: string;
                source_url?: string;
                locator?: string;
                excerpt?: string;
                observed_at?: string;
                expires_at?: string;
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
                    "application/json": components["schemas"]["EvidenceCountResponse"];
                };
            };
        };
    };
    "Evidence.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EvidenceGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EvidenceGroupByResponse"];
                };
            };
        };
    };
    "Evidence.exists": {
        parameters: {
            query?: {
                id?: string;
                evidence_type?: string;
                title?: string;
                source_url?: string;
                locator?: string;
                excerpt?: string;
                observed_at?: string;
                expires_at?: string;
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
                    "application/json": components["schemas"]["EvidenceExistsResponse"];
                };
            };
        };
    };
    "Feature.count": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                description?: string;
                ssot_feature_id?: string;
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
                    "application/json": components["schemas"]["FeatureCountResponse"];
                };
            };
        };
    };
    "Feature.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FeatureGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeatureGroupByResponse"];
                };
            };
        };
    };
    "Feature.exists": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                description?: string;
                ssot_feature_id?: string;
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
                    "application/json": components["schemas"]["FeatureExistsResponse"];
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
    "LegalEvidence.count": {
        parameters: {
            query?: {
                id?: string;
                subject_kind?: string;
                subject_id?: string;
                evidence_kind?: string;
                name?: string;
                expression?: string;
                path?: string;
                url?: string;
                scope?: string;
                evidence_type?: string;
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
                    "application/json": components["schemas"]["LegalEvidenceCountResponse"];
                };
            };
        };
    };
    "LegalEvidence.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LegalEvidenceGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalEvidenceGroupByResponse"];
                };
            };
        };
    };
    "LegalEvidence.exists": {
        parameters: {
            query?: {
                id?: string;
                subject_kind?: string;
                subject_id?: string;
                evidence_kind?: string;
                name?: string;
                expression?: string;
                path?: string;
                url?: string;
                scope?: string;
                evidence_type?: string;
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
                    "application/json": components["schemas"]["LegalEvidenceExistsResponse"];
                };
            };
        };
    };
    "Limitation.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                title?: string;
                description?: string;
                severity?: string;
                evidence_id?: string;
                reviewed_at?: string;
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
                    "application/json": components["schemas"]["LimitationCountResponse"];
                };
            };
        };
    };
    "Limitation.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LimitationGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LimitationGroupByResponse"];
                };
            };
        };
    };
    "Limitation.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                title?: string;
                description?: string;
                severity?: string;
                evidence_id?: string;
                reviewed_at?: string;
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
                    "application/json": components["schemas"]["LimitationExistsResponse"];
                };
            };
        };
    };
    "Organization.count": {
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
                    "application/json": components["schemas"]["OrganizationCountResponse"];
                };
            };
        };
    };
    "Organization.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OrganizationGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationGroupByResponse"];
                };
            };
        };
    };
    "Organization.exists": {
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
                    "application/json": components["schemas"]["OrganizationExistsResponse"];
                };
            };
        };
    };
    "Package.count": {
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
                    "application/json": components["schemas"]["PackageCountResponse"];
                };
            };
        };
    };
    "Package.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PackageGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageGroupByResponse"];
                };
            };
        };
    };
    "Package.exists": {
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
                    "application/json": components["schemas"]["PackageExistsResponse"];
                };
            };
        };
    };
    "PackageRepository.count": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                repository_id?: string;
                path?: string;
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
                    "application/json": components["schemas"]["PackageRepositoryCountResponse"];
                };
            };
        };
    };
    "PackageRepository.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PackageRepositoryGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageRepositoryGroupByResponse"];
                };
            };
        };
    };
    "PackageRepository.exists": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                repository_id?: string;
                path?: string;
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
                    "application/json": components["schemas"]["PackageRepositoryExistsResponse"];
                };
            };
        };
    };
    "PackageTaxonomy.count": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                taxonomy_id?: string;
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
                    "application/json": components["schemas"]["PackageTaxonomyCountResponse"];
                };
            };
        };
    };
    "PackageTaxonomy.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PackageTaxonomyGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageTaxonomyGroupByResponse"];
                };
            };
        };
    };
    "PackageTaxonomy.exists": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                taxonomy_id?: string;
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
                    "application/json": components["schemas"]["PackageTaxonomyExistsResponse"];
                };
            };
        };
    };
    "Person.count": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                handle?: string;
                profile_url?: string;
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
                    "application/json": components["schemas"]["PersonCountResponse"];
                };
            };
        };
    };
    "Person.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PersonGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonGroupByResponse"];
                };
            };
        };
    };
    "Person.exists": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                handle?: string;
                profile_url?: string;
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
                    "application/json": components["schemas"]["PersonExistsResponse"];
                };
            };
        };
    };
    "Record.count": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                organization_id?: string;
                record_type?: string;
                title?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                content?: string;
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
                    "application/json": components["schemas"]["RecordCountResponse"];
                };
            };
        };
    };
    "Record.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordGroupByResponse"];
                };
            };
        };
    };
    "Record.exists": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                organization_id?: string;
                record_type?: string;
                title?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                content?: string;
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
                    "application/json": components["schemas"]["RecordExistsResponse"];
                };
            };
        };
    };
    "RecordAlias.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                alias_kind?: string;
                alias?: string;
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
                    "application/json": components["schemas"]["RecordAliasCountResponse"];
                };
            };
        };
    };
    "RecordAlias.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordAliasGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordAliasGroupByResponse"];
                };
            };
        };
    };
    "RecordAlias.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                alias_kind?: string;
                alias?: string;
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
                    "application/json": components["schemas"]["RecordAliasExistsResponse"];
                };
            };
        };
    };
    "RecordAuthor.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                person_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["RecordAuthorCountResponse"];
                };
            };
        };
    };
    "RecordAuthor.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordAuthorGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordAuthorGroupByResponse"];
                };
            };
        };
    };
    "RecordAuthor.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                person_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["RecordAuthorExistsResponse"];
                };
            };
        };
    };
    "RecordFeature.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                feature_id?: string;
                claim_id?: string;
                status?: string;
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
                    "application/json": components["schemas"]["RecordFeatureCountResponse"];
                };
            };
        };
    };
    "RecordFeature.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordFeatureGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordFeatureGroupByResponse"];
                };
            };
        };
    };
    "RecordFeature.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                feature_id?: string;
                claim_id?: string;
                status?: string;
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
                    "application/json": components["schemas"]["RecordFeatureExistsResponse"];
                };
            };
        };
    };
    "RecordPackage.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                package_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["RecordPackageCountResponse"];
                };
            };
        };
    };
    "RecordPackage.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordPackageGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordPackageGroupByResponse"];
                };
            };
        };
    };
    "RecordPackage.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                package_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["RecordPackageExistsResponse"];
                };
            };
        };
    };
    "RecordRelation.count": {
        parameters: {
            query?: {
                id?: string;
                source_record_id?: string;
                target_record_id?: string;
                relation_type?: string;
                note?: string;
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
                    "application/json": components["schemas"]["RecordRelationCountResponse"];
                };
            };
        };
    };
    "RecordRelation.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordRelationGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordRelationGroupByResponse"];
                };
            };
        };
    };
    "RecordRelation.exists": {
        parameters: {
            query?: {
                id?: string;
                source_record_id?: string;
                target_record_id?: string;
                relation_type?: string;
                note?: string;
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
                    "application/json": components["schemas"]["RecordRelationExistsResponse"];
                };
            };
        };
    };
    "RecordRepository.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                repository_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["RecordRepositoryCountResponse"];
                };
            };
        };
    };
    "RecordRepository.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordRepositoryGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordRepositoryGroupByResponse"];
                };
            };
        };
    };
    "RecordRepository.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                repository_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["RecordRepositoryExistsResponse"];
                };
            };
        };
    };
    "RecordResource.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                resource_id?: string;
                role?: string;
                sort_order?: number;
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
                    "application/json": components["schemas"]["RecordResourceCountResponse"];
                };
            };
        };
    };
    "RecordResource.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordResourceGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordResourceGroupByResponse"];
                };
            };
        };
    };
    "RecordResource.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                resource_id?: string;
                role?: string;
                sort_order?: number;
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
                    "application/json": components["schemas"]["RecordResourceExistsResponse"];
                };
            };
        };
    };
    "RecordTaxonomy.count": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                taxonomy_id?: string;
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
                    "application/json": components["schemas"]["RecordTaxonomyCountResponse"];
                };
            };
        };
    };
    "RecordTaxonomy.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordTaxonomyGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordTaxonomyGroupByResponse"];
                };
            };
        };
    };
    "RecordTaxonomy.exists": {
        parameters: {
            query?: {
                id?: string;
                record_id?: string;
                taxonomy_id?: string;
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
                    "application/json": components["schemas"]["RecordTaxonomyExistsResponse"];
                };
            };
        };
    };
    "Release.count": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                repository_id?: string;
                release_kind?: string;
                version?: string;
                route_key?: string;
                url?: string;
                published_at?: string;
                downloads?: string;
                prerelease?: boolean;
                draft?: boolean;
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
                    "application/json": components["schemas"]["ReleaseCountResponse"];
                };
            };
        };
    };
    "Release.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReleaseGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseGroupByResponse"];
                };
            };
        };
    };
    "Release.exists": {
        parameters: {
            query?: {
                id?: string;
                package_id?: string;
                repository_id?: string;
                release_kind?: string;
                version?: string;
                route_key?: string;
                url?: string;
                published_at?: string;
                downloads?: string;
                prerelease?: boolean;
                draft?: boolean;
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
                    "application/json": components["schemas"]["ReleaseExistsResponse"];
                };
            };
        };
    };
    "Repository.count": {
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
                    "application/json": components["schemas"]["RepositoryCountResponse"];
                };
            };
        };
    };
    "Repository.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepositoryGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryGroupByResponse"];
                };
            };
        };
    };
    "Repository.exists": {
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
                    "application/json": components["schemas"]["RepositoryExistsResponse"];
                };
            };
        };
    };
    "RepositoryContributor.count": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                login?: string;
                profile_url?: string;
                contributions?: number;
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
                    "application/json": components["schemas"]["RepositoryContributorCountResponse"];
                };
            };
        };
    };
    "RepositoryContributor.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepositoryContributorGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryContributorGroupByResponse"];
                };
            };
        };
    };
    "RepositoryContributor.exists": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                login?: string;
                profile_url?: string;
                contributions?: number;
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
                    "application/json": components["schemas"]["RepositoryContributorExistsResponse"];
                };
            };
        };
    };
    "RepositoryLanguage.count": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                language?: string;
                bytes?: number;
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
                    "application/json": components["schemas"]["RepositoryLanguageCountResponse"];
                };
            };
        };
    };
    "RepositoryLanguage.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepositoryLanguageGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryLanguageGroupByResponse"];
                };
            };
        };
    };
    "RepositoryLanguage.exists": {
        parameters: {
            query?: {
                id?: string;
                repository_id?: string;
                language?: string;
                bytes?: number;
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
                    "application/json": components["schemas"]["RepositoryLanguageExistsResponse"];
                };
            };
        };
    };
    "RepositorySsotInventory.count": {
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
                    "application/json": components["schemas"]["RepositorySsotInventoryCountResponse"];
                };
            };
        };
    };
    "RepositorySsotInventory.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepositorySsotInventoryGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotInventoryGroupByResponse"];
                };
            };
        };
    };
    "RepositorySsotInventory.exists": {
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
                    "application/json": components["schemas"]["RepositorySsotInventoryExistsResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.count": {
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
                    "application/json": components["schemas"]["RepositorySsotRegistryCountResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepositorySsotRegistryGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotRegistryGroupByResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.exists": {
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
                    "application/json": components["schemas"]["RepositorySsotRegistryExistsResponse"];
                };
            };
        };
    };
    "Resource.count": {
        parameters: {
            query?: {
                id?: string;
                resource_type?: string;
                route_key?: string;
                repository_id?: string;
                path?: string;
                title?: string;
                url?: string;
                summary?: string;
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
                    "application/json": components["schemas"]["ResourceCountResponse"];
                };
            };
        };
    };
    "Resource.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResourceGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceGroupByResponse"];
                };
            };
        };
    };
    "Resource.exists": {
        parameters: {
            query?: {
                id?: string;
                resource_type?: string;
                route_key?: string;
                repository_id?: string;
                path?: string;
                title?: string;
                url?: string;
                summary?: string;
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
                    "application/json": components["schemas"]["ResourceExistsResponse"];
                };
            };
        };
    };
    "ResourceEvidence.count": {
        parameters: {
            query?: {
                id?: string;
                resource_id?: string;
                evidence_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["ResourceEvidenceCountResponse"];
                };
            };
        };
    };
    "ResourceEvidence.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResourceEvidenceGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceEvidenceGroupByResponse"];
                };
            };
        };
    };
    "ResourceEvidence.exists": {
        parameters: {
            query?: {
                id?: string;
                resource_id?: string;
                evidence_id?: string;
                role?: string;
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
                    "application/json": components["schemas"]["ResourceEvidenceExistsResponse"];
                };
            };
        };
    };
    "ResourceRepository.count": {
        parameters: {
            query?: {
                id?: string;
                resource_id?: string;
                repository_id?: string;
                role?: string;
                path?: string;
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
                    "application/json": components["schemas"]["ResourceRepositoryCountResponse"];
                };
            };
        };
    };
    "ResourceRepository.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResourceRepositoryGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceRepositoryGroupByResponse"];
                };
            };
        };
    };
    "ResourceRepository.exists": {
        parameters: {
            query?: {
                id?: string;
                resource_id?: string;
                repository_id?: string;
                role?: string;
                path?: string;
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
                    "application/json": components["schemas"]["ResourceRepositoryExistsResponse"];
                };
            };
        };
    };
    "ResourceTaxonomy.count": {
        parameters: {
            query?: {
                id?: string;
                resource_id?: string;
                taxonomy_id?: string;
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
                    "application/json": components["schemas"]["ResourceTaxonomyCountResponse"];
                };
            };
        };
    };
    "ResourceTaxonomy.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResourceTaxonomyGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceTaxonomyGroupByResponse"];
                };
            };
        };
    };
    "ResourceTaxonomy.exists": {
        parameters: {
            query?: {
                id?: string;
                resource_id?: string;
                taxonomy_id?: string;
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
                    "application/json": components["schemas"]["ResourceTaxonomyExistsResponse"];
                };
            };
        };
    };
    "ResourceType.count": {
        parameters: {
            query?: {
                id?: string;
                label?: string;
                category?: string;
                description?: string;
                icon_key?: string;
                detail_schema_key?: string;
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
                    "application/json": components["schemas"]["ResourceTypeCountResponse"];
                };
            };
        };
    };
    "ResourceType.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResourceTypeGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceTypeGroupByResponse"];
                };
            };
        };
    };
    "ResourceType.exists": {
        parameters: {
            query?: {
                id?: string;
                label?: string;
                category?: string;
                description?: string;
                icon_key?: string;
                detail_schema_key?: string;
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
                    "application/json": components["schemas"]["ResourceTypeExistsResponse"];
                };
            };
        };
    };
    "Taxonomy.count": {
        parameters: {
            query?: {
                id?: string;
                taxonomy_type?: string;
                slug?: string;
                label?: string;
                category?: string;
                description?: string;
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
                    "application/json": components["schemas"]["TaxonomyCountResponse"];
                };
            };
        };
    };
    "Taxonomy.group_by": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TaxonomyGroupByRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyGroupByResponse"];
                };
            };
        };
    };
    "Taxonomy.exists": {
        parameters: {
            query?: {
                id?: string;
                taxonomy_type?: string;
                slug?: string;
                label?: string;
                category?: string;
                description?: string;
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
                    "application/json": components["schemas"]["TaxonomyExistsResponse"];
                };
            };
        };
    };
}
